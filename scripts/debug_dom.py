"""Deep DOM inspection of specific pages."""
from playwright.sync_api import sync_playwright

BASE = "http://localhost:5173"

ROUTES = ["/roadmap/calculo-para-ml", "/roadmap/ml-fundamentals"]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    errors = []
    page.on("pageerror", lambda err: errors.append(str(err)))
    
    for route in ROUTES:
        print(f"\n{'='*60}")
        print(f"Route: {route}")
        
        try:
            page.goto(f"{BASE}{route}", wait_until="networkidle", timeout=15000)
            page.wait_for_timeout(2000)
            
            if errors:
                print(f"  React errors: {errors}")
                errors.clear()
            
            # Get content area inner HTML
            area = page.locator(".rounded-xl.border.border-slate-200.bg-white.p-6").first
            if area.count() > 0:
                text = area.inner_text()
                print(f"  Content area text ({len(text)} chars):")
                print(text[:500])
            else:
                print("  No content area found")
            
            # Check for LoadError component
            not_found = page.locator("text=Content not found").count()
            if not_found > 0:
                print("  ❌ Content not found!")
            
            # Get the lazy component area specifically
            inner = page.locator(".rounded-xl.border.border-slate-200.bg-white.p-6.shadow-sm").last
            if inner.count() > 0:
                html = inner.inner_html()
                print(f"\n  Inner HTML ({len(html)} chars):")
                print(html[:800])
            
        except Exception as e:
            print(f"  ❌ {e}")
    
    browser.close()
