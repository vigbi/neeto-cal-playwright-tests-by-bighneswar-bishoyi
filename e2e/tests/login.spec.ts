import test, { Page, expect } from '@playwright/test';

import LoginPage from '../poms/login.page';
import MeetingPage from '../poms/meeting.page';
import { faker } from '@faker-js/faker';      


test.describe('Meeting Tests', () => {
  let loginPage: LoginPage
  let meetingPage: MeetingPage
  test.beforeEach(async ({ page }, testInfo) => {
    loginPage = new LoginPage(page);
    meetingPage = new MeetingPage(page)
    await page.goto('/admin');
    if (!testInfo.title.includes('SKIPLOGIN')) {
    
      await loginPage.login("cpts9gnqty9-bighneswar_bishoyi-playwright-july-2024@bigbinary.com", "123456");
    }
  });

  test.slow(); 

  test('Verify Login', async ({ page }) => {
    expect(await meetingPage.profileIconIsVisible(20)).toBe(true);
  });

  test('Verify Create a new One-on-One meeting', async ({ page }) => {
    expect(await meetingPage.profileIconIsVisible(40)).toBe(true);
    const meetingName: string = faker.commerce.productName()
    const meetingLink: string = meetingName.trim().toLowerCase().replace(/\s+/g, '-');
    const meetingDesc: string = faker.lorem.paragraph();
    await meetingPage.createNewMeeting("one_on_one", meetingName, meetingLink, meetingDesc)

  });

  test('Verify Book a new One-on-One meeting', async ({ page }) => {
    expect(await meetingPage.profileIconIsVisible(40)).toBe(true);
    const meetingName: string = faker.commerce.productName()
    const meetingLink: string = meetingName.trim().toLowerCase().replace(/\s+/g, '-');
    const meetingDesc: string = faker.lorem.paragraph();
    const newMeetingPage: Page = await meetingPage.createNewMeeting("one_on_one", meetingName, meetingLink, meetingDesc);
    const clientName: string = faker.person.firstName()
    const email: string = clientName + "@sample.com";
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 2);
    const day = currentDate.toLocaleString('en-US', { month: 'long', day: 'numeric' });
    await meetingPage.createNewMeetingWithForm(newMeetingPage, meetingName, day, clientName, email);
  });


});
