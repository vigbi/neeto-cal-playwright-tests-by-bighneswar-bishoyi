import test, { expect } from '@playwright/test';

import LoginPage from '../poms/login.page';
import { faker } from '@faker-js/faker';

test.describe('Logging in Tests', () => {
  let loginPage: LoginPage
  test.beforeEach(async ({ page }, testInfo) => {
    loginPage = new LoginPage(page);
    await page.goto('/admin');
    if (!testInfo.title.includes('SKIPLOGIN')) {
    
      await loginPage.login("cpts9gnqty9-bighneswar_bishoyi-playwright-july-2024@bigbinary.com", "123456");
    }
  });

  test('Verify Login', async ({ page }) => {
    expect(await loginPage.profileIconIsVisible(20)).toBe(true);
  });



});