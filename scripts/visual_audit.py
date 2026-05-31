"""Full-page visual audit — check consistency, color usage, mobile layout."""
from playwright.sync_api import sync_playwright

BASE = "http://localhost:5173"
OUT = "/tmp/audit_visual"

import os
os.makedirs(OUT, exist_ok=True)

VIEWPORTS = [
    ("desktop", 1440, 900),
    ("mobile", 375, 812),
]

PAGES = [
    ("home", "/"),
    ("tracker", "/tracker"),
    ("calculo-para-ml", "/roadmap/calculo-para-ml"),
    ("mit-18-01-02-calculus", "/roadmap/mit-18-01-02-calculus"),
    ("ml-fundamentals", "/roadmap/ml-fundamentals"),
    ("csapp-memory", "/roadmap/csapp-memory"),
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    
    for vp_name, vp_w, vp_h in VIEWPORTS:
        page = browser.new_page(viewport={"width": vp_w, "height": vp_h})
        
        for slug, route in PAGES:
            try:
                page.goto(f"{BASE}{route}", wait_until="networkidle", timeout=15000)
                page.wait_for_timeout(500)
                page.screenshot(path=f"{OUT}/{vp_name}_{slug}.png", full_page=True)
                print(f"✅ {vp_name} {slug}")
            except Exception as e:
                print(f"❌ {vp_name} {slug}: {e}")
        
        page.close()
    
    browser.close()
    print(f"\nScreenshots saved to {OUT}/")
