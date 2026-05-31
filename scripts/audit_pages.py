"""Comprehensive audit of all routes in cs-learning app.
Captures screenshots and inspects DOM for rendering issues:
- ResourceTable columns rendering
- NotebookLMModuleCard sync status
- Layout issues
- Missing links/content
"""
import json, sys, os
from playwright.sync_api import sync_playwright

BASE = "http://localhost:5173"
OUT_DIR = "/tmp/audit_screenshots"
os.makedirs(OUT_DIR, exist_ok=True)

# All routes to test
ROUTES = [
    "/",
    "/roadmap/mit-18-01-02-calculus",
    "/roadmap/mit-18-06sc-linear-algebra",
    "/roadmap/calculo-para-ml",
    "/roadmap/algebra-lineal-numerica",
    "/roadmap/optimization-convexa",
    "/roadmap/probabilidad-aplicada",
    "/roadmap/ml-fundamentals",
    "/roadmap/dl-basics-cnn",
    "/roadmap/mlops-intro",
    "/roadmap/mlops-advanced",
    "/roadmap/nlp-finetuning",
    "/roadmap/fine-tuning-practical",
    "/roadmap/advanced-inference-system",
    "/roadmap/csapp-memory",
    "/roadmap/os-concurrency",
    "/roadmap/distributed-raft",
    "/tracker",
]

results = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    
    # First, hit home page to warm up
    print("Navigating to home...")
    page.goto(BASE, wait_until="networkidle", timeout=15000)
    page.wait_for_timeout(2000)
    
    for route in ROUTES:
        slug = route.replace("/", "_").strip("_") or "home"
        print(f"\n{'='*60}")
        print(f"Testing: {route}")
        print(f"{'='*60}")
        
        try:
            page.goto(f"{BASE}{route}", wait_until="networkidle", timeout=15000)
            page.wait_for_timeout(1000)
            
            entry = {"route": route, "issues": []}
            
            # Screenshot
            shot_path = f"{OUT_DIR}/{slug}.png"
            page.screenshot(path=shot_path, full_page=True)
            entry["screenshot"] = shot_path
            print(f"  Screenshot: {shot_path}")
            
            # Check ResourceTable
            resource_table = page.locator("table").first
            if resource_table.count() > 0:
                # Check headers
                headers = resource_table.locator("thead th").all()
                header_texts = [h.inner_text().strip() for h in headers]
                print(f"  ResourceTable headers: {header_texts}")
                
                # Check first row data
                first_row = resource_table.locator("tbody tr").first
                if first_row.count() > 0:
                    cells = first_row.locator("td").all()
                    cell_texts = [c.inner_text().strip() for c in cells]
                    print(f"  ResourceTable first row: {cell_texts}")
                    
                    # Check for undefined
                    if any("undefined" in c.lower() or c == "" for c in cell_texts):
                        entry["issues"].append(f"ResourceTable cells show empty/undefined: {cell_texts}")
                        print(f"  ❌ ISSUE: ResourceTable has empty/undefined cells")
                else:
                    print(f"  ResourceTable has no rows")
                    entry["issues"].append("ResourceTable has no rows")
            else:
                print(f"  No ResourceTable found")
            
            # Check NotebookLMModuleCard
            nlm_section = page.locator("text=NotebookLM").first
            if nlm_section.count() > 0:
                nlm_text = page.locator("text=NotebookLM").locator("..").inner_text() if nlm_section.count() > 0 else ""
                print(f"  NotebookLM section text: {nlm_text[:200]}")
                
                synced_text = page.locator("text=Synced").first
                not_synced_text = page.locator("text=Not synced").first
                awaiting_text = page.locator("text=Awaiting sync").first
                
                if not_synced_text.count() > 0 or awaiting_text.count() > 0:
                    print(f"  ❌ ISSUE: NotebookLM shows 'Not synced' or 'Awaiting sync'")
                    entry["issues"].append("NotebookLM shows 'Not synced' / 'Awaiting sync'")
            else:
                # Only an issue for routes that HAVE nlm data
                pass
            
            # Check for links in content area
            main_content = page.locator("main, article, .content, #content").first
            if main_content.count() == 0:
                main_content = page.locator("body")
            
            links = main_content.locator("a").all()
            visible_links = [l for l in links if l.is_visible()]
            print(f"  Visible links in content: {len(visible_links)}")
            
            if len(visible_links) == 0 and route != "/":
                entry["issues"].append("No visible links found in content")
                print(f"  ❌ ISSUE: No links in content")
            
            # Check for broken elements
            error_elements = page.locator("text=undefined").all()
            if error_elements:
                entry["issues"].append(f"Found {len(error_elements)} 'undefined' text elements")
                print(f"  ❌ ISSUE: Found {len(error_elements)} 'undefined' text elements")
            
            # Check layout overflow
            body = page.locator("body")
            scroll_width = page.evaluate("() => document.body.scrollWidth")
            viewport_width = page.evaluate("() => window.innerWidth")
            if scroll_width > viewport_width:
                print(f"  ⚠️  Horizontal overflow: scrollWidth={scroll_width} > viewport={viewport_width}")
                entry["issues"].append(f"Horizontal overflow: {scroll_width} > {viewport_width}")
            
            if not entry["issues"]:
                entry["status"] = "OK"
                print(f"  ✅ All checks passed")
            else:
                entry["status"] = "ISSUES"
            
            results.append(entry)
            
        except Exception as e:
            print(f"  ❌ ERROR: {e}")
            results.append({"route": route, "status": "ERROR", "error": str(e), "issues": [str(e)]})
    
    browser.close()

# Summary
print("\n\n" + "="*60)
print("AUDIT SUMMARY")
print("="*60)
ok_count = sum(1 for r in results if r.get("status") == "OK")
issue_count = sum(1 for r in results if r.get("status") == "ISSUES")
error_count = sum(1 for r in results if r.get("status") == "ERROR")
print(f"  ✅ OK: {ok_count}")
print(f"  ⚠️  Issues: {issue_count}")
print(f"  ❌ Errors: {error_count}")

for r in results:
    status = r.get("status", "?")
    emoji = "✅" if status == "OK" else "⚠️" if status == "ISSUES" else "❌"
    print(f"  {emoji} {r['route']}")
    if r.get("issues"):
        for issue in r["issues"]:
            print(f"      - {issue}")

# Write detailed report
report_path = f"{OUT_DIR}/report.json"
with open(report_path, "w") as f:
    json.dump(results, f, indent=2, default=str)
print(f"\nFull report: {report_path}")
print(f"Screenshots: {OUT_DIR}/")
