#!/usr/bin/env python3
"""Rebuild catalog/template-catalog-report-bundle.zip from the (regrouped) template catalog.

The pipeline builds this visual report from the raw clustering output
(catalog/.clusters/pages.templates.grouped.json, keyed by cluster id). After manual
regrouping (tools/da/apply-template-regrouping.js) that output is stale, so this script
feeds the same report builder with catalog/template-catalog.json instead, keyed by
template name. The raw clustering output is left untouched; the previous bundle is
archived under migration-work/da-publish/archive/.

    python3 tools/da/rebuild_catalog_report.py
"""
import json
import shutil
import sys
from pathlib import Path

CLUSTERING = Path('/home/node/.excat-marketplaces/excat-marketplace/excat/tools/excatops-mcp/clustering')
sys.path.insert(0, str(CLUSTERING))
from cluster.package_bundle import package  # noqa: E402
from cluster.template_report_bundle import (  # noqa: E402
    BUNDLE_DIR_STEM, REPORT_HTML_NAME, _load_build_template_report_module,
)

ROOT = Path.cwd()
CATALOG = ROOT / 'catalog'
STAGE = ROOT / 'migration-work' / 'da-publish'
REGROUPED = CATALOG / '.clusters-regrouped'


def main() -> None:
    templates = json.loads((CATALOG / 'template-catalog.json').read_text())['templates']
    grouped = {t['name']: t['urls'] for t in templates}

    REGROUPED.mkdir(exist_ok=True)
    grouped_path = REGROUPED / 'pages.templates.grouped.json'
    grouped_path.write_text(json.dumps(grouped, indent=2) + '\n')
    # The builder reads run metadata from a summary beside the grouped file.
    shutil.copy(CATALOG / '.clusters' / 'pages.templates.summary.json', REGROUPED / 'pages.templates.summary.json')

    report_path = CATALOG / REPORT_HTML_NAME
    n_tpl, n_pages, singletons, biggest = _load_build_template_report_module().build_report_html(
        grouped_path, CATALOG / '.pages', report_path,
        label='Template families (manually regrouped 2026-09-29)', sort_mode='values',
    )

    target_zip = CATALOG / f'{BUNDLE_DIR_STEM}.zip'
    archive = STAGE / 'archive' / f'{BUNDLE_DIR_STEM}.before-regrouping.zip'
    if target_zip.exists() and not archive.exists():
        archive.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(target_zip), str(archive))

    staging_dir = STAGE / 'report-staging' / BUNDLE_DIR_STEM
    if staging_dir.parent.exists():
        shutil.rmtree(staging_dir.parent)
    staging_dir.parent.mkdir(parents=True)
    try:
        produced = package(report_path, staging_dir, include_clusters=False, make_zip=True)
        if target_zip.exists():
            target_zip.unlink()
        shutil.move(str(produced), str(target_zip))
    finally:
        report_path.unlink(missing_ok=True)
        shutil.rmtree(staging_dir.parent, ignore_errors=True)

    print(f'{target_zip.relative_to(ROOT)}: {n_tpl} templates, {n_pages} pages, '
          f'{singletons} singletons, biggest family={biggest}')
    if archive.exists():
        print(f'previous bundle archived at {archive.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
