#!/usr/bin/env bash
# Production smoke tests for ai-writing-detector.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ANALYZE="$ROOT/scripts/analyze.js"
VALIDATE="$ROOT/scripts/validate-cli.js"
FIX="$ROOT/fixtures"

pass=0
fail=0

run_check() {
  local name="$1"
  shift
  if "$@"; then
    printf 'PASS  %s\n' "$name"
    pass=$((pass + 1))
  else
    printf 'FAIL  %s\n' "$name"
    fail=$((fail + 1))
  fi
}

echo "ai-writing-detector smoke (root=$ROOT)"

run_check "analyze slop sanitized + tier1 markers" node -e "
const {execFileSync}=require('child_process');
const out=execFileSync(process.execPath,['$ANALYZE','--json','$FIX/slop.md'],{encoding:'utf8'});
const r=JSON.parse(out);
if (r.interpretation!=='signals_only') process.exit(1);
if (r.document_classification) process.exit(2);
if (!r.bands || r.bands.tier1_markers<1) process.exit(3);
if (typeof r.score!=='number') process.exit(4);
if (!r.disclaimer) process.exit(5);
if (!r.source) process.exit(6);
"

run_check "analyze human low signal" node -e "
const {execFileSync}=require('child_process');
const out=execFileSync(process.execPath,['$ANALYZE','--json','$FIX/human-ops.md'],{encoding:'utf8'});
const r=JSON.parse(out);
if (r.interpretation!=='signals_only') process.exit(1);
if (r.issue_count>3) process.exit(2);
"

run_check "short input too_short warning" node -e "
const {execFileSync}=require('child_process');
const out=execFileSync(process.execPath,['$ANALYZE','--json'],{input:'Hi',encoding:'utf8'});
const r=JSON.parse(out);
if (!r.reliability||!r.reliability.too_short) process.exit(1);
if (!r.warnings||!r.warnings.length) process.exit(2);
"

run_check "raw includes engine_raw; default omits" node -e "
const {execFileSync}=require('child_process');
const def=JSON.parse(execFileSync(process.execPath,['$ANALYZE','--json','$FIX/slop.md'],{encoding:'utf8'}));
const raw=JSON.parse(execFileSync(process.execPath,['$ANALYZE','--json','--raw','$FIX/slop.md'],{encoding:'utf8'}));
if (def.engine_raw) process.exit(1);
if (def.document_classification) process.exit(2);
if (!raw.engine_raw) process.exit(3);
if (!raw.engine_raw.document_classification) process.exit(4);
"

run_check "fail-above exit 3" node -e "
const {execFileSync}=require('child_process');
try {
  execFileSync(process.execPath,['$ANALYZE','--json','--fail-above','1','$FIX/slop.md'],{encoding:'utf8'});
  process.exit(1);
} catch (e) {
  if (e.status!==3) process.exit(2);
}
"

run_check "batch multi-file schema + summary" node -e "
const {execFileSync}=require('child_process');
const out=execFileSync(process.execPath,['$ANALYZE','--json','$FIX/slop.md','$FIX/human-ops.md'],{encoding:'utf8'});
const r=JSON.parse(out);
if (r.schema!=='ai-writing-detector.analyze.batch.v1') process.exit(1);
if (!r.results || r.results.length!==2) process.exit(2);
if (r.results[0].interpretation!=='signals_only') process.exit(3);
if (!r.summary || r.summary.files!==2) process.exit(4);
if (typeof r.summary.max_score!=='number') process.exit(5);
if (!Array.isArray(r.summary.by_source) || r.summary.by_source.length!==2) process.exit(6);
"

run_check "quiet one line" node -e "
const {execFileSync}=require('child_process');
const out=execFileSync(process.execPath,['$ANALYZE','--quiet','$FIX/human-ops.md'],{encoding:'utf8'}).trim();
if (!out.startsWith('score=')) process.exit(1);
if (out.includes('\\n')) process.exit(2);
"

run_check "summary-only batch" node -e "
const {execFileSync}=require('child_process');
const out=execFileSync(process.execPath,['$ANALYZE','--json','--summary-only','$FIX/slop.md','$FIX/human-ops.md'],{encoding:'utf8'});
const r=JSON.parse(out);
if (r.results) process.exit(1);
if (!r.summary || r.summary.files!==2) process.exit(2);
"

run_check "min-severity filters listed issues" node -e "
const {execFileSync}=require('child_process');
const all=JSON.parse(execFileSync(process.execPath,['$ANALYZE','--json','$FIX/slop.md'],{encoding:'utf8'}));
const hi=JSON.parse(execFileSync(process.execPath,['$ANALYZE','--json','--min-severity','high','$FIX/slop.md'],{encoding:'utf8'}));
if (hi.issue_count>all.issue_count) process.exit(1);
if (hi.score!==all.score) process.exit(2);
if (hi.min_severity!=='high') process.exit(3);
for (const s of hi.samples||[]) {
  if (s.severity && s.severity!=='high') process.exit(4);
}
"

run_check "validate prose pass" node -e "
const {execFileSync}=require('child_process');
execFileSync(process.execPath,['$VALIDATE','$FIX/validate-before.md','$FIX/validate-after-ok.md']);
"

run_check "validate code fail" node -e "
const {execFileSync}=require('child_process');
try {
  execFileSync(process.execPath,['$VALIDATE','$FIX/validate-before.md','$FIX/validate-after-bad-code.md']);
  process.exit(1);
} catch (e) {
  if (e.status!==1) process.exit(2);
}
"

run_check "validate quiet" node -e "
const {execFileSync}=require('child_process');
const out=execFileSync(process.execPath,['$VALIDATE','--quiet','$FIX/validate-before.md','$FIX/validate-after-ok.md'],{encoding:'utf8'}).trim();
if (out!=='ok=1 errors=0 warnings=0') process.exit(1);
"

run_check "validate fail-on-warnings exit 0 when clean" node -e "
const {execFileSync}=require('child_process');
execFileSync(process.execPath,['$VALIDATE','--fail-on-warnings','$FIX/validate-before.md','$FIX/validate-after-ok.md']);
"

run_check "report module loads" node -e "require('$ROOT/scripts/report.js')"

run_check "fence requires blank closing (#77)" node "$ROOT/scripts/fence-probe.js"

run_check "check-engine-pin runs" bash -c "
  set +e
  out=\$(bash '$ROOT/scripts/check-engine-pin.sh' 2>&1)
  code=\$?
  set -e
  echo \"\$out\" | grep -q 'patterns_sha='
  # 0=match or local_only, 1=drift vs optional clone — both OK for smoke
  test \"\$code\" -eq 0 -o \"\$code\" -eq 1
"

echo ""
echo "passed=$pass failed=$fail"
if [[ "$fail" -gt 0 ]]; then
  exit 1
fi
exit 0
