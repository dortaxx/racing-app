import { test, expect } from '@playwright/test';

test.describe('Horse Racing Game E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display initial game interface', async ({ page }) => {
    await expect(page.locator('[data-test="generate-schedule"]')).toBeVisible();
    await expect(page.locator('[data-test="start-races"]')).toBeVisible();
    
    await expect(page.locator('[data-test="start-races"]')).toBeDisabled();
    
    await expect(page.locator('[data-test="game-status"]')).toBeVisible();
  });

  test('should generate race schedule successfully', async ({ page }) => {
    // Click generate schedule button
    await page.click('[data-test="generate-schedule"]');
    
    // Wait for schedule to be generated
    await expect(page.locator('[data-test="race-schedule"]')).toBeVisible();
    
    // Check if 6 rounds are created
    const rounds = page.locator('[data-test="round-info"]');
    await expect(rounds).toHaveCount(6);
    
    // Verify round distances
    const expectedDistances = ['1200m', '1400m', '1600m', '1800m', '2000m', '2200m'];
    for (let i = 0; i < 6; i++) {
      await expect(rounds.nth(i)).toContainText(`Round ${i + 1}`);
      await expect(rounds.nth(i)).toContainText(expectedDistances[i]);
    }
    
    // Check horses are displayed
    await expect(page.locator('[data-test="horses-list"]')).toBeVisible();
    const horses = page.locator('[data-test="horse-item"]');
    await expect(horses).toHaveCount(20);
    
    // Verify start races button is now enabled
    await expect(page.locator('[data-test="start-races"]')).toBeEnabled();
    
    // Check status updated
    await expect(page.locator('[data-test="game-status"]')).toContainText('Schedule generated - Ready to race!');
  });

  test('should display horse information correctly', async ({ page }) => {
    await page.click('[data-test="generate-schedule"]');
    await expect(page.locator('[data-test="horses-list"]')).toBeVisible();
    
    // Check first horse has required information
    const firstHorse = page.locator('[data-test="horse-item"]').first();
    await expect(firstHorse.locator('[data-test="horse-name"]')).toBeVisible();
    await expect(firstHorse.locator('[data-test="horse-condition"]')).toBeVisible();

    // Verify horse condition format
    await expect(firstHorse.locator('[data-test="horse-condition"]')).toContainText('/100');
  });

  test('should start races and show progress', async ({ page }) => {
    // Generate schedule first
    await page.click('[data-test="generate-schedule"]');
    await expect(page.locator('[data-test="race-schedule"]')).toBeVisible();
    
    // Start races
    await page.click('[data-test="start-races"]');
    
    // Check that racing status is updated
    await expect(page.locator('[data-test="game-status"]')).toContainText('Racing Round', { timeout: 2000 });
    
    // Buttons should be disabled during racing
    await expect(page.locator('[data-test="generate-schedule"]')).toBeDisabled();
    await expect(page.locator('[data-test="start-races"]')).toBeDisabled();
    
    // Wait for first race to complete and results to appear
    await expect(page.locator('[data-test="results-container"]')).toBeVisible({ timeout: 15000 });
  });

  test('should display race results correctly', async ({ page }) => {
    // Generate schedule and start races
    await page.click('[data-test="generate-schedule"]');
    await page.click('[data-test="start-races"]');
    
    // Wait for results to appear
    await expect(page.locator('[data-test="results-container"]')).toBeVisible({ timeout: 15000 });
    
    // Check round header is present
    await expect(page.locator('[data-test="round-header"]').first()).toBeVisible();
    await expect(page.locator('[data-test="round-header"]').first()).toContainText('Round 1');
    await expect(page.locator('[data-test="round-header"]').first()).toContainText('1200m');
    
    // Check result items are present
    const resultItems = page.locator('[data-test="result-item"]');
    await expect(resultItems).toHaveCount(10, { timeout: 5000 });
    
    // Check first place result has required elements
    const firstPlace = resultItems.first();
    await expect(firstPlace.locator('[data-test="position"]')).toContainText('1');
    await expect(firstPlace.locator('[data-test="horse-name"]')).toBeVisible();
    await expect(firstPlace.locator('[data-test="horse-color"]')).toBeVisible(); 
    await expect(firstPlace.locator('[data-test="finish-time"]')).toContainText('s');
    
    // Check podium styling
    await expect(firstPlace).toHaveClass(/first-place/);
  });

  test('should show race track during races', async ({ page }) => {
    // Generate schedule and start races  
    await page.click('[data-test="generate-schedule"]');
    await page.click('[data-test="start-races"]');
    
    // Check race track appears
    await expect(page.locator('[data-test="race-info"]')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('[data-test="race-info"]')).toContainText('Round 1');
    await expect(page.locator('[data-test="race-info"]')).toContainText('1200m');
    
    // Check racing indicator 
    await expect(page.locator('[data-test="racing-indicator"]')).toBeVisible();
    await expect(page.locator('[data-test="racing-indicator"]')).toContainText('Race in Progress');
    
    // Check horses are displayed on track
    const raceHorses = page.locator('[data-test="race-horse"]');
    await expect(raceHorses).toHaveCount(10);
    
    // Check finish line is present
    await expect(page.locator('[data-test="finish-line"]')).toBeVisible();
  });

  test('should complete races and display results', async ({ page }) => {
    // Generate schedule and start races
    await page.click('[data-test="generate-schedule"]');
    await page.click('[data-test="start-races"]');
    
    // Wait for races to start and show some progress
    await expect(page.locator('[data-test="game-status"]')).toContainText('Racing Round', { timeout: 5000 });
    
    // Wait for at least some races to complete - check for results
    await expect(page.locator('[data-test="results-container"]')).toBeVisible({ timeout: 20000 });
    
    // Check that at least one round of results is displayed
    const roundHeaders = page.locator('[data-test="round-header"]');
    await expect(roundHeaders.first()).toBeVisible();
    
    // Verify first round has results
    await expect(roundHeaders.first()).toContainText('Round 1');
    
    // Check that result items are present
    const resultItems = page.locator('[data-test="result-item"]');
    await expect(resultItems.first()).toBeVisible();
  });

  test('should handle no results state correctly', async ({ page }) => {
    // Initially, no results should be shown
    await expect(page.locator('[data-test="no-results-message"]')).toBeVisible();
    await expect(page.locator('[data-test="no-results-message"]')).toContainText('No race results yet');
    
    // Results container should not be visible
    await expect(page.locator('[data-test="results-container"]')).not.toBeVisible();
  });

  test('should show no race message when track is empty', async ({ page }) => {
    await expect(page.locator('[data-test="no-race-message"]')).toBeVisible();
    await expect(page.locator('[data-test="no-race-message"]')).toContainText('No race in progress');
  });
});