"""Quick check: nlp-finetuning and fine-tuning-practical rendering."""
from playwright.sync_api import sync_playwright

BASE = "http://localhost:5173"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    
    for route in ["/roadmap/nlp-finetuning", "/roadmap/fine-tuning-practical"]:
        page.goto(f"{BASE}{route}", wait_until="networkidle", timeout=15000)
        page.wait_for_timeout(1000)
        
        area = page.locator(".rounded-xl.border.border-slate-200.bg-white.p-6").first
        text = area.inner_text()[:600] if area.count() > 0 else "NO AREA"
        
        print(f"\n{'='*40}")
        print(f"Route: {route}")
        print(f"Content ({len(text)} chars):")
        print(text[:500])
        print("...")
        
        # Check tables
        tables = page.locator("table").all()
        for t in tables:
            headers = t.locator("thead th").all()
            print(f"  Headers: {[h.inner_text() for h in headers]}")
    
    browser.close()
