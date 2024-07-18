import { Page } from '@playwright/test';
import BasePage from '../poms/base.page';

enum Selectors {
  emailInput = 'login-email-text-field',
  loginCodeInput = 'otpinput-otp-number',
  nextBtn = 'login-submit-button'
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
}
