"""Debug script: open specific pages and check console errors, DOM content."""
from playwright.sync_api import sync_playwright

BASE = "http://localhost:5173"

ROUTES = [
    "/roadmap/calculo-para-ml",
    "/roadmap/ml-fundamentals",
    "/roadmap/csapp-memory",
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    
    for route in ROUTES:
        page.on("console", lambda msg: print(f"  [CONSOLE {msg.type}] {msg.text}"))
        page.on("pageerror", lambda err: print(f"  [PAGE ERROR] {err}"))
        
        print(f"\n{'='*60}")
        print(f"Route: {route}")
        print(f"{'='*60}")
        
        try:
            page.goto(f"{BASE}{route}", wait_until="networkidle", timeout=15000)
            page.wait_for_timeout(2000)
            
            # Get full page HTML 
            html = page.content()
            
            # Check for ResourceTable or table elements
            table_count = page.locator("table").count()
            print(f"  Tables found: {table_count}")
            
            if table_count > 0:
                for i in range(table_count):
                    t = page.locator("table").nth(i)
                    headers = t.locator("thead th").all()
                    rows = t.locator("tbody tr").all()
                    print(f"  Table {i}: {len(headers)} headers, {len(rows)} rows")
                    if headers:
                        print(f"    Headers: {[h.inner_text() for h in headers]}")
            
            # Check for links
            links = page.locator("a").all()
            visible = [l for l in links if l.is_visible()]
            print(f"  Visible links: {len(visible)}")
            if visible:
                for l in visible[:5]:
                    print(f"    -> {l.inner_text()[:60]}")
            
            # Check page has any content beyond empty container
            content_area = page.locator(".rounded-xl.border.border-slate-200.bg-white.p-6")
            inner_html = content_area.first.inner_html() if content_area.count() > 0 else "NO CONTENT AREA"
            if len(inner_html) < 100:
                print(f"  ⚠️  Content area nearly empty ({len(inner_html)} chars)")
            
            # Check for React error boundary
            error_texts = page.locator("text=Error").all()
            if error_texts:
                print(f"  ❌ Error elements found: {len(error_texts)}")
            
        except Exception as e:
            print(f"  ❌ EXCEPTION: {e}")
    
    browser.close()
