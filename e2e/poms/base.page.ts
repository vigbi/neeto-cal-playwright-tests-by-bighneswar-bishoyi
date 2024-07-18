import { Locator, Page, expect } from "@playwright/test";

export default class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async click(testId: string): Promise<void> {
    try {
      await this.waitForElementToBeVisible(testId, 10);
      await this.page.getByTestId(testId).click();
    } catch (error) {
      throw new Error(
        `Failed to click on element with testId: ${testId}. Error: ${error}`
      );
    }
  }

  async type(testId: string, value: string): Promise<void> {
    try {
      await this.waitForElementToBeVisible(testId, 10);
      await this.page.getByTestId(testId).clear()
      await this.page.getByTestId(testId).fill(value);
    } catch (error) {
      throw new Error(
        `Failed to type into element with testId: ${testId}. Error: ${error}`
      );
    }
  }

  async waitForElementToBeVisible(testId: string, timeoutInSeconds: number): Promise<void> {
    const timeoutInMilliseconds = timeoutInSeconds * 1000;
    try {
      await this.page.getByTestId(testId).waitFor({ state: 'visible', timeout: timeoutInMilliseconds });
    } catch (error) {
      throw new Error(
        `Element with testId: ${testId} was not visible within ${timeoutInSeconds} seconds. Error: ${error}`
      );
    }
  }

  async isVisible(testId: string, timeoutInSeconds: number): Promise<boolean> {
    const timeoutInMilliseconds = timeoutInSeconds * 1000;
    try {
      await this.page.getByTestId(testId).waitFor({ state: 'visible', timeout: timeoutInMilliseconds });
      return await this.page.getByTestId(testId).isVisible();
    } catch (error) {
      return false;
    }
  }

  async getText(testId: string): Promise<string> {
    try {
      await this.waitForElementToBeVisible(testId, 10);
      const textContent = await this.page.getByTestId(testId).textContent();
      if (textContent === null) {
        throw new Error(
          `Element with testId: ${testId} has no text content`
        );
      }
      return textContent.trim();
    } catch (error) {
      throw new Error(
        `Failed to get text from element with testId: ${testId}. Error: ${error}`
      );
    }
  }

  async assertTextContains(actualText: string, expectedText: string): Promise<void> {
    try {
      expect(actualText).toContain(expectedText);
    } catch (error) {
      throw new Error(
        `Failed: Expected '${expectedText}' to be contained in Actual '${actualText}'`
      );
    }
  }

  async assertTextEqual(actualText: string, expectedText: string): Promise<void> {
    try {
      expect(actualText).toEqual(expectedText);
    } catch (error) {
      throw new Error(
        `Failed: Expected '${expectedText}' but got '${actualText}'`
      );
    }
  }

  async assertEqual(actualText: any, expectedText: any): Promise<void> {
    try {
      expect(actualText).toEqual(expectedText);
    } catch (error) {
      throw new Error(
        `Failed: Expected '${expectedText}' but got '${actualText}'`
      );
    }
  }

  async assertGreaterThanEqualTo(actNum: any, expNum: any): Promise<void> {
    try {
      expect(actNum).toBeGreaterThanOrEqual(expNum);
    } catch (error) {
      throw new Error(
        `Failed: '${actNum}' toBeGreaterThanOrEqual '${expNum}'`
      );
    }
  }

  async assertElementCountGreaterThan(testId: string, count: number, timeoutInSeconds: number = 10): Promise<void> {
    try {
      await this.waitForElementToBeVisible(testId, timeoutInSeconds);
      const elements = this.page.getByTestId(testId)
      const cnt = await elements.count();
      expect(cnt).toBeGreaterThan(count);
    } catch (error) {
      throw new Error(
        `Failed to assert element count for testId '${testId}'. Error: ${error}`
      );
    }
  }

  async assertElementCountEqualTo(testId: string, count: number, timeoutInSeconds: number = 10): Promise<void> {
    try {
      await this.waitForElementToBeVisible(testId, timeoutInSeconds);
      const elements = this.page.getByTestId(testId)
      const cnt = await elements.count();
      expect(cnt).toBe(count);
    } catch (error) {
      throw new Error(
        `Failed to assert element count for testId '${testId}'. Error: ${error}`
      );
    }
  }

}
