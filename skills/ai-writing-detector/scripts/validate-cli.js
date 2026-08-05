#!/usr/bin/env node
"use strict";

/**
 * CLI wrapper around vendored validate.js with a package-local banner.
 * Upstream: conorbronsdon/avoid-ai-writing detector/validate.js (MIT).
 *
 * Exit codes:
 *   0 ok
 *   1 preservation errors
 *   2 usage / node version
 *   4 warnings present and --fail-on-warnings
 */

const fs = require("fs");
const path = require("path");

function requireNode() {
  const major = Number(String(process.versions.node || "0").split(".")[0]);
  if (!Number.isFinite(major) || major < 18) {
    process.stderr.write(
      `ai-writing-detector requires Node.js >= 18 (found ${process.versions.node})\n`
    );
    process.exit(1);
  }
}

requireNode();

const { validate, formatResult } = require("./validate.js");

function usage(code) {
  process.stderr.write(`Usage: node validate-cli.js [options] <original> <rewritten>

Options:
  --json               JSON result (schema ai-writing-detector.validate.v1)
  --quiet              One line: ok=1|0 errors=N warnings=N
  --fail-on-warnings   Exit 4 if warnings and no errors
  -h, --help

Exit 1 if preservation errors. Warnings alone exit 0 unless --fail-on-warnings.
Vendored engine: scripts/validate.js (avoid-ai-writing).
`);
  process.exit(code);
}

function main(argv) {
  let json = false;
  let quiet = false;
  let failOnWarnings = false;
  const files = [];
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-h" || a === "--help") usage(0);
    else if (a === "--json") json = true;
    else if (a === "--quiet" || a === "-q") quiet = true;
    else if (a === "--fail-on-warnings") failOnWarnings = true;
    else if (a.startsWith("-")) {
      process.stderr.write(`Unknown flag: ${a}\n`);
      usage(2);
    } else files.push(a);
  }
  if (files.length !== 2) usage(2);

  const originalPath = path.resolve(files[0]);
  const rewrittenPath = path.resolve(files[1]);
  const original = fs.readFileSync(originalPath, "utf8");
  const rewritten = fs.readFileSync(rewrittenPath, "utf8");
  const result = validate(original, rewritten);
  const errors = result.errors || [];
  const warnings = result.warnings || [];

  if (json) {
    process.stdout.write(
      JSON.stringify(
        {
          schema: "ai-writing-detector.validate.v1",
          ok: result.ok,
          errors,
          warnings,
          original: originalPath,
          rewritten: rewrittenPath,
        },
        null,
        2
      ) + "\n"
    );
  } else if (quiet) {
    process.stdout.write(
      `ok=${result.ok ? 1 : 0} errors=${errors.length} warnings=${warnings.length}\n`
    );
  } else {
    process.stdout.write(formatResult(result) + "\n");
  }

  if (!result.ok || errors.length) process.exit(1);
  if (failOnWarnings && warnings.length) process.exit(4);
  process.exit(0);
}

main(process.argv);
