"""Systematic quality scan — contrast tokens, link consistency, touch targets, aria."""
from playwright.sync_api import sync_playwright
import json

BASE = "http://localhost:5173"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    
    findings = {"contrast_tokens": [], "touch_targets": [], "aria_issues": [], "link_types": []}
    
    routes = ["/", "/tracker", "/roadmap/calculo-para-ml", "/roadmap/ml-fundamentals"]
    
    for route in routes:
        page.goto(f"{BASE}{route}", wait_until="networkidle", timeout=15000)
        page.wait_for_timeout(500)
        
        hardcoded = page.evaluate("""() => {
            const styles = Array.from(document.querySelectorAll('[style]'));
            return styles.filter(el => {
                const style = el.getAttribute('style') || '';
                return style.includes('background') || style.includes('color');
            }).map(el => ({
                tag: el.tagName,
                style: el.getAttribute('style'),
                classes: el.className
            }));
        }""")
        
        findings["contrast_tokens"].append({"route": route, "hardcoded_colors": hardcoded[:5]})
        
        touch_issues = page.evaluate("""() => {
            const interactive = Array.from(document.querySelectorAll('button, a, input, select, textarea'));
            return interactive.filter(el => {
                const rect = el.getBoundingClientRect();
                return (rect.width < 44 || rect.height < 44) && rect.width > 0;
            }).slice(0, 10).map(el => ({
                tag: el.tagName,
                text: (el.textContent || '').slice(0, 30),
                width: Math.round(el.getBoundingClientRect().width),
                height: Math.round(el.getBoundingClientRect().height),
                classes: el.className
            }));
        }""")
        
        findings["touch_targets"].append({"route": route, "issues": touch_issues})
        
        links = page.evaluate("""() => {
            return Array.from(document.querySelectorAll('a')).map(a => ({
                href: a.getAttribute('href'),
                text: (a.textContent || '').slice(0, 50),
                target: a.getAttribute('target'),
                rel: a.getAttribute('rel'),
                classes: a.className
            }));
        }""")
        
        nlm_links = [l for l in links if l.get('href', '').startswith('https://notebooklm')]
        external_no_rel = [l for l in links if l.get('target') == '_blank' and not l.get('rel')][:3]
        
        findings["link_types"].append({
            "route": route,
            "total_links": len(links),
            "nlm_links": len(nlm_links),
            "external_no_rel": external_no_rel
        })
    
    browser.close()
    print(json.dumps(findings, indent=2))
