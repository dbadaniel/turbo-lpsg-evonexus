#!/usr/bin/env python3
"""Build the EvoNexus agents/ and skills/ trees from upstream artifacts."""

from __future__ import annotations

import json
import shutil
import tempfile
import zipfile
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parent.parent
ARTIFACTS = ROOT / "artifacts"
PLUGIN_ID = "turbo-lpsg"
EXCLUDED_SKILLS = {
    # The first release is knowledge-only. These bundles execute Meta API
    # operations and will return in a separately reviewed integration release.
    "meta-ads-cli-setup",
    "meta-ads-cli-turbo",
}
AGENTS = (
    "automacao-turbo",
    "closer-turbo",
    "copywriter-turbo",
    "cs-turbo",
    "designer-turbo",
    "diretor-criativo-turbo",
    "estrategista-turbo",
    "pesquisador-mercado-turbo",
    "pesquisador-turbo",
    "picasso-auditor-lpsg",
    "revisor-copy-turbo",
    "social-turbo",
    "trafego-turbo",
)


def _reset_dir(path: Path) -> None:
    if path.exists():
        shutil.rmtree(path)
    path.mkdir(parents=True)


def _build_skills() -> set[str]:
    target = ROOT / "skills"
    _reset_dir(target)
    bundled: set[str] = set()

    for archive in sorted(ARTIFACTS.glob("*.zip")):
        if archive.stem in EXCLUDED_SKILLS:
            continue
        with tempfile.TemporaryDirectory() as raw_tmp:
            tmp = Path(raw_tmp)
            with zipfile.ZipFile(archive) as bundle:
                bundle.extractall(tmp)
            skill_files = list(tmp.rglob("SKILL.md"))
            if not skill_files:
                continue
            if len(skill_files) != 1:
                raise RuntimeError(f"{archive.name}: expected one SKILL.md, found {len(skill_files)}")
            source = skill_files[0].parent
            destination = target / archive.stem
            shutil.copytree(source, destination)
            bundled.add(archive.stem)

    return bundled


def _repair_frontmatter(raw: str, filename: str) -> tuple[dict, str]:
    if not raw.startswith("---\n"):
        raise RuntimeError(f"{filename}: missing YAML frontmatter")
    _, frontmatter, body = raw.split("---", 2)
    try:
        metadata = yaml.safe_load(frontmatter) or {}
    except yaml.YAMLError:
        repaired = []
        for line in frontmatter.splitlines():
            if line.startswith("description: "):
                line = "description: " + json.dumps(line.removeprefix("description: "))
            repaired.append(line)
        metadata = yaml.safe_load("\n".join(repaired)) or {}
    if not metadata.get("name"):
        raise RuntimeError(f"{filename}: frontmatter has no name")
    return metadata, body.lstrip("\r\n")


def _build_agents(bundled_skills: set[str]) -> None:
    target = ROOT / "agents"
    _reset_dir(target)
    bundle_path = ARTIFACTS / "squad-turbo-completo.zip"
    with tempfile.TemporaryDirectory() as raw_tmp:
        tmp = Path(raw_tmp)
        with zipfile.ZipFile(bundle_path) as bundle:
            bundle.extractall(tmp)
        for name in AGENTS:
            matches = list(tmp.rglob(f"{name}.md"))
            if len(matches) != 1:
                raise RuntimeError(f"{bundle_path.name}: expected one {name}.md")
            source = matches[0]
            metadata, body = _repair_frontmatter(source.read_text(encoding="utf-8"), source.name)
            declared = metadata.get("skills") or []
            metadata["skills"] = [
                f"plugin-{PLUGIN_ID}-{skill}" for skill in declared if skill in bundled_skills
            ]
            rendered = yaml.safe_dump(
                metadata,
                allow_unicode=True,
                sort_keys=False,
                width=1000,
            ).strip()
            (target / source.name).write_text(
                f"---\n{rendered}\n---\n\n{body}",
                encoding="utf-8",
            )


def main() -> None:
    bundled = _build_skills()
    _build_agents(bundled)
    print(f"Built EvoNexus plugin: {len(AGENTS)} agents, {len(bundled)} skills")


if __name__ == "__main__":
    main()
