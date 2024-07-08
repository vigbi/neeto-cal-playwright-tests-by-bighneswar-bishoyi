import { Page, expect } from '@playwright/test';
import BasePage from '../poms/base.page';
enum Selectors {
  emailInput = 'login-email-text-field',
  loginCodeInput = 'otpinput-otp-number',
  nextBtn = 'login-submit-button',
  profileIcon = 'profile-avatar'
}

export default class LoginPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  async login(email: string, otp: string) {
    await this.type(Selectors.emailInput, email);
    await this.click(Selectors.nextBtn);
    await this.type(Selectors.loginCodeInput, otp);
  }
  async profileIconIsVisible(timeoutInSeconds: number): Promise<boolean> {
    return this.isVisible(Selectors.profileIcon, timeoutInSeconds);
  }
}
