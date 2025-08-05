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
    await page.click('[data-test="generate-schedule"]');
    
    await expect(page.locator('[data-test="race-schedule"]')).toBeVisible();
    
    const rounds = page.locator('[data-test="round-info"]');
    await expect(rounds).toHaveCount(6);
    
    const expectedDistances = ['1200m', '1400m', '1600m', '1800m', '2000m', '2200m'];
    for (let i = 0; i < 6; i++) {
      await expect(rounds.nth(i)).toContainText(`Round ${i + 1}`);
      await expect(rounds.nth(i)).toContainText(expectedDistances[i]);
    }
    await expect(page.locator('[data-test="horses-list"]')).toBeVisible();
    const horses = page.locator('[data-test="horse-item"]');
    await expect(horses).toHaveCount(20);

    await expect(page.locator('[data-test="start-races"]')).toBeEnabled();

    await expect(page.locator('[data-test="game-status"]')).toContainText('Schedule generated - Ready to race!');
  });

  test('should display horse information correctly', async ({ page }) => {
    await page.click('[data-test="generate-schedule"]');
    await expect(page.locator('[data-test="horses-list"]')).toBeVisible();
    const firstHorse = page.locator('[data-test="horse-item"]').first();
    await expect(firstHorse.locator('[data-test="horse-name"]')).toBeVisible();
    await expect(firstHorse.locator('[data-test="horse-condition"]')).toBeVisible();

    await expect(firstHorse.locator('[data-test="horse-condition"]')).toContainText('/100');
  });

  test('should start races and show progress', async ({ page }) => {
    await page.click('[data-test="generate-schedule"]');
    await expect(page.locator('[data-test="race-schedule"]')).toBeVisible();

    await page.click('[data-test="start-races"]');

    await expect(page.locator('[data-test="game-status"]')).toContainText('Racing Round', { timeout: 2000 });

    await expect(page.locator('[data-test="generate-schedule"]')).toBeDisabled();
    await expect(page.locator('[data-test="start-races"]')).toBeDisabled();

    await expect(page.locator('[data-test="results-container"]')).toBeVisible({ timeout: 15000 });
  });

  test('should display race results correctly', async ({ page }) => {
    await page.click('[data-test="generate-schedule"]');
    await page.click('[data-test="start-races"]');
    
    await expect(page.locator('[data-test="results-container"]')).toBeVisible({ timeout: 15000 });
    
    await expect(page.locator('[data-test="round-header"]').first()).toBeVisible();
    await expect(page.locator('[data-test="round-header"]').first()).toContainText('Round 1');
    await expect(page.locator('[data-test="round-header"]').first()).toContainText('1200m');

    const resultItems = page.locator('[data-test="result-item"]');
    await expect(resultItems).toHaveCount(10, { timeout: 5000 });
    const firstPlace = resultItems.first();
    await expect(firstPlace.locator('[data-test="position"]')).toContainText('1');
    await expect(firstPlace.locator('[data-test="horse-name"]')).toBeVisible();
    await expect(firstPlace.locator('[data-test="horse-color"]')).toBeVisible(); 
    await expect(firstPlace.locator('[data-test="finish-time"]')).toContainText('s');

    await expect(firstPlace).toHaveClass(/first-place/);
  });

  test('should show race track during races', async ({ page }) => {
    await page.click('[data-test="generate-schedule"]');
    await page.click('[data-test="start-races"]');
    
    await expect(page.locator('[data-test="race-info"]')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('[data-test="race-info"]')).toContainText('Round 1');
    await expect(page.locator('[data-test="race-info"]')).toContainText('1200m');
    
    await expect(page.locator('[data-test="racing-indicator"]')).toBeVisible();
    await expect(page.locator('[data-test="racing-indicator"]')).toContainText('Race in Progress');
    
    const raceHorses = page.locator('[data-test="race-horse"]');
    await expect(raceHorses).toHaveCount(10);
    
    await expect(page.locator('[data-test="finish-line"]')).toBeVisible();
  });

  test('should complete races and display results', async ({ page }) => {
    await page.click('[data-test="generate-schedule"]');
    await page.click('[data-test="start-races"]');

    await expect(page.locator('[data-test="game-status"]')).toContainText('Racing Round', { timeout: 5000 });

    await expect(page.locator('[data-test="results-container"]')).toBeVisible({ timeout: 20000 });

    const roundHeaders = page.locator('[data-test="round-header"]');
    await expect(roundHeaders.first()).toBeVisible();

    await expect(roundHeaders.first()).toContainText('Round 1');

    const resultItems = page.locator('[data-test="result-item"]');
    await expect(resultItems.first()).toBeVisible();
  });

  test('should handle no results state correctly', async ({ page }) => {
    await expect(page.locator('[data-test="no-results-message"]')).toBeVisible();
    await expect(page.locator('[data-test="no-results-message"]')).toContainText('No race results yet');

    await expect(page.locator('[data-test="results-container"]')).not.toBeVisible();
  });

  test('should show no race message when track is empty', async ({ page }) => {
    await expect(page.locator('[data-test="no-race-message"]')).toBeVisible();
    await expect(page.locator('[data-test="no-race-message"]')).toContainText('No race in progress');
  });
});
