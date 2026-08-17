from __future__ import annotations

import importlib.util
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read_skill(name: str) -> str:
    return (ROOT / "skills" / name / "SKILL.md").read_text(encoding="utf-8")


def load_ste_lint():
    script = ROOT / "skills" / "simple-english" / "scripts" / "ste_lint.py"
    spec = importlib.util.spec_from_file_location("ste_lint_contract", script)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


class VoiceContractTests(unittest.TestCase):
    def test_skill_and_package_versions_are_aligned(self) -> None:
        versions = {
            "humanizer": "1.1.1",
            "simple-english": "2.0.0",
            "writing-prose": "1.1.0",
        }
        readme = (ROOT / "README.md").read_text(encoding="utf-8")
        sources = (ROOT / "SOURCES.md").read_text(encoding="utf-8")
        for name, version in versions.items():
            self.assertIn(f"version: {version}", read_skill(name))
            self.assertIn(f"| [`{name}`](skills/{name}/) | `{version}` |", readme)
        self.assertIn("| package_version | `2.0.1` |", sources)

    def test_simple_english_separates_strict_and_flavored_modes(self) -> None:
        skill = read_skill("simple-english")
        self.assertIn("Strict mode controls form", skill)
        self.assertIn("A reported item is not an automatic", skill)
        self.assertIn("contractions are allowed", skill)
        self.assertIn("Do not apply one whole-file score", skill)
        self.assertIn("Follow the project's established spelling", skill)
        self.assertIn("Passive voice stays when the actor is unknown", skill)
        self.assertIn("In STE-flavored prose, contractions are allowed", skill)
        self.assertNotIn("\n- American spelling.\n", skill)

    def test_natural_copy_findings_require_interpretation(self) -> None:
        lint = load_ste_lint()
        sample = (
            "You'll see the colors already in your scene, so you can reuse one "
            "without rebuilding it by eye. A preset keeps stroke, fill, text, "
            "and opacity together, which makes repeated drawing work faster "
            "without forcing every object into the same look."
        )
        result = lint.lint(sample)
        self.assertGreater(result["total"], 0)
        self.assertIn("not an automatic", read_skill("simple-english"))

    def test_humanizer_uses_a_voice_hierarchy(self) -> None:
        skill = read_skill("humanizer")
        self.assertIn("## Voice hierarchy", skill)
        self.assertIn("user's explicit brief or supplied writing sample", skill)
        self.assertIn("Do not pass", skill)

    def test_writing_prose_rejects_sequential_filtering(self) -> None:
        skill = read_skill("writing-prose")
        self.assertIn("## Skill boundaries", skill)
        self.assertIn("Do not run every skill across the", skill)
        self.assertNotIn("\n- writing\n", skill)


if __name__ == "__main__":
    unittest.main()
