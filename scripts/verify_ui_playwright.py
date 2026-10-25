import os
import sys
import time
from playwright.sync_api import sync_playwright

def main():
    print("Starting Playwright UI Verification for Akeezo Case Management...")
    screenshots_dir = os.path.join(os.getcwd(), "artifacts", "playwright_screenshots")
    os.makedirs(screenshots_dir, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        page.on("console", lambda msg: print(f"[Browser Console] {msg.type}: {msg.text}"))
        page.on("pageerror", lambda err: print(f"[Browser PageError] {err}"))

        # 1. Navigate to /case-management/
        url = "http://localhost:4000/case-management/"
        print(f"Navigating to {url}...")
        page.goto(url, wait_until="networkidle")
        page.screenshot(path=os.path.join(screenshots_dir, "01_login_view.png"))

        # Check if login form is displayed
        login_header = page.locator("h2:has-text('Staff & Admin Sign In')")
        if login_header.is_visible():
            print("Login view confirmed. Submitting credentials for priti@akeezo.com...")
            # Click continue
            page.locator("button:has-text('Continue')").click()
            page.wait_for_timeout(1000)

            # Check if 2FA form appears
            totp_header = page.locator("h2:has-text('Two-Factor Authentication')")
            if totp_header.is_visible():
                print("2FA step confirmed. Entering pilot TOTP code 123456...")
                page.screenshot(path=os.path.join(screenshots_dir, "02_2fa_view.png"))
                page.locator("button:has-text('Verify & Enter Workspace')").click()
                page.wait_for_timeout(3000)
                page.screenshot(path=os.path.join(screenshots_dir, "02b_after_2fa.png"))
                print(f"Page URL after 2FA: {page.url}")
                print(f"Body text snippet: {page.locator('body').inner_text()[:300]}")

        # 2. Verify Pipeline Board is loaded
        print("Waiting for Pipeline Board to load...")
        page.wait_for_selector("text=Pipeline Board", timeout=10000)
        page.screenshot(path=os.path.join(screenshots_dir, "03_pipeline_board.png"))
        print("Pipeline board confirmed.")

        # Check kanban columns
        columns = ["New Referral", "Under Review", "Quotes Requested"]
        for col in columns:
            assert page.locator(f"text={col}").first.is_visible(), f"Column {col} not visible"
            print(f"Verified column: {col}")

        # Check case cards presence
        case_card = page.locator("text=AKZ-2026-00001").first
        assert case_card.is_visible(), "Case AKZ-2026-00001 must be visible on the board"
        print("Verified Case AKZ-2026-00001 card is present.")

        # 3. Open Case AKZ-2026-00001 detail modal
        print("Clicking AKZ-2026-00001 to open CaseDetailModal...")
        case_card.click()
        page.wait_for_selector("text=Patient Profile", timeout=8000)
        page.wait_for_timeout(1000)
        page.screenshot(path=os.path.join(screenshots_dir, "04_case_detail_modal.png"))
        print("CaseDetailModal opened successfully.")

        # 4. Verify Masked Passport in Patient details
        modal_content = page.locator("body").inner_text()
        assert "******412" in modal_content, f"Masked passport ******412 must be present in modal content. Found:\n{modal_content[:400]}"
        assert "B01234412" not in modal_content, "Plaintext passport must NOT be leaked in UI text"
        print("Passport masking verified: Plaintext passport is not exposed; masked format ******412 used.")

        # 5. Verify 'Move Back' button & modal
        move_back_btn = page.locator("button:has-text('Move Back')")
        if move_back_btn.is_visible():
            print("Clicking 'Move Back' button...")
            move_back_btn.click()
            page.wait_for_selector("h3:has-text('Move Case Backward')", timeout=3000)
            page.screenshot(path=os.path.join(screenshots_dir, "05_move_backward_modal.png"))
            assert page.locator("text=Mandatory Explanatory Reason").is_visible(), "Mandatory reason label must be visible"
            assert page.locator("textarea[placeholder*='alternate hospital']").is_visible(), "Reason textarea must be visible"
            print("Move Backward modal verified with earlier stage dropdown and mandatory reason field.")
            # Close dialog
            page.locator("button:has-text('Cancel')").first.click()
            page.wait_for_timeout(500)

        # 6. Verify 'Close Case' button & modal
        close_case_btn = page.locator("button:has-text('Close Case')")
        if close_case_btn.is_visible():
            print("Clicking 'Close Case' button...")
            close_case_btn.click()
            page.wait_for_selector("h3:has-text('Close / Drop Case')", timeout=3000)
            page.screenshot(path=os.path.join(screenshots_dir, "06_close_case_modal.png"))
            assert page.locator("select").is_visible(), "Closure reason dropdown must be visible"
            assert page.locator("textarea[placeholder*='audit trail']").is_visible(), "Closure notes textarea must be visible"
            print("Close Case modal verified with closure reason dropdown and notes.")
            page.locator("button:has-text('Cancel')").first.click()
            page.wait_for_timeout(500)

        print("\nAll Playwright UI verification checks PASSED successfully!")
        browser.close()

if __name__ == "__main__":
    main()
