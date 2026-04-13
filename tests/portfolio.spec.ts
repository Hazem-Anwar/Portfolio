import { test, expect } from '@playwright/test';

/**
 * Portfolio SQA Professional Test Suite
 * Focuses on critical path verification: Visibility, Data Consistency, and Navigation.
 */
test.describe('Portfolio Core Experience', () => {

  // We assume the baseURL is set in playwright.config.ts or passed via CLI
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await page.goto('/');
  });

  test('TC-01: Hero Visual Verification - Header and Media Visibility', async ({ page }) => {
    // Step 1: Wait for and verify the main hero section is visible
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible({ timeout: 10000 });

    // Step 2: Verify that at least one image is visible (Hero or branding)
    // This ensures that our Image components are rendering correctly after site load
    const heroImage = page.locator('img').first();
    await expect(heroImage).toBeVisible();
    
    // Step 3: Check for specific hero text (optional but good for branding)
    await expect(page.locator('h1')).toBeVisible();
  });

  test('TC-02: Content Inventory - Visibility of Works on Home and Work Pages', async ({ page }) => {
    // Phase 1: Verify projects are listed on the Home page
    const homeProjects = page.locator('#work h3, .grid h3').first();
    await expect(homeProjects).toBeVisible();
    
    const countOnHome = await page.locator('h3').count();
    console.log(`Professional Report: Found ${countOnHome} works listed on Home page.`);
    expect(countOnHome).toBeGreaterThan(0);

    // Phase 2: Navigate to Works page and verify full catalog
    await page.goto('/work');
    const worksList = page.locator('h3');
    await expect(worksList.first()).toBeVisible();
    
    const countOnWorks = await worksList.count();
    console.log(`Professional Report: Found ${countOnWorks} works listed on the dedicated Work page.`);
    expect(countOnWorks).toBeGreaterThan(0);
  });

  test('TC-03: Navigation and Detail Fidelity - Project Deep Dive', async ({ page }) => {
    // Step 1: Browse to the works page
    await page.goto('/work');
    
    // Step 2: Capture the first project title for consistency check
    const firstProject = page.locator('h3').first();
    const expectedTitle = await firstProject.textContent();
    
    // Step 3: Click on the case study or detail link
    const detailLink = page.locator('a[href*="/work/"]').first();
    await detailLink.click();

    // Step 4: Verify URL structure follows the slug pattern
    await expect(page).toHaveURL(/\/work\/.+/);

    // Step 5: Verify the detail page renders the correct project title
    const detailHeader = page.locator('h1');
    await expect(detailHeader).toBeVisible();
    if (expectedTitle) {
      await expect(detailHeader).toContainText(expectedTitle.trim(), { ignoreCase: true });
    }

    // Step 6: Verify detailed content sections (Problem, Approach, or Gallery)
    // Professional check: Ensure at least one section or detailed description exists
    const projectDescription = page.locator('p').first();
    await expect(projectDescription).toBeVisible();
    expect(await projectDescription.innerText()).not.toBe('');
  });

});
