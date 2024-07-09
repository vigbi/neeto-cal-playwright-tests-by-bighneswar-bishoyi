import { Locator, Page } from '@playwright/test';
import BasePage from './base.page';

enum Selectors {
  profileIcon = 'profile-avatar',
  addNewMeetingLink = 'add-new-meeting-button',
  meetingNameInput = 'enter-meeting-name-text-field',
  meetingLinkInput = 'enter-meeting-url-text-field',
  meetingDesc = 'neeto-editor-content',
  meetingCreateBtn = 'save-changes-button',
  viewMeetingDetailsBtn = 'arrow-icon',
  meetingDetailsTitle = '[data-cy="meeting-name-header-title"]',
  meetingDetailsDesc = '[data-cy="neeto-editor-content"]'
}

export default class MeetingPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  async profileIconIsVisible(timeoutInSeconds: number): Promise<boolean> {
    return this.isVisible(Selectors.profileIcon, timeoutInSeconds);
  }
  async getMeetingLinkByType(meetingType: string): Promise<Locator | null> {
    try {
      const selector = `[data-cy="continue-button"][href*="${meetingType}"]`;
      const linkElement = this.page.locator(selector);
      return linkElement;
    } catch (error) {
      console.error(`Failed to get link with href containing '${meetingType}': ${error}`);
      return null;
    }
  }
  async createNewMeeting(meetingType: string, meetingName: string, meetingLink: string, meetingDesc: string) {
    try {

      await this.waitForElementToBeVisible(Selectors.addNewMeetingLink, 30)
      await this.click(Selectors.addNewMeetingLink);

      const linkElement = await this.getMeetingLinkByType(meetingType);
      if (!linkElement) {
        throw new Error('Meeting link element not found.');
      }
      await linkElement.click();

      await this.type(Selectors.meetingNameInput, meetingName);
      await this.type(Selectors.meetingLinkInput, meetingLink);
      await this.type(Selectors.meetingDesc, meetingDesc);
      await this.click(Selectors.meetingCreateBtn);


      const pagePromise = this.page.context().waitForEvent('page');
      await this.click(Selectors.viewMeetingDetailsBtn);
      const newTab = await pagePromise;

      const currentUrl = newTab.url();
      this.assertTextContains(currentUrl, meetingLink);

      const meetingTitle = await newTab.locator(Selectors.meetingDetailsTitle).textContent();
      if (meetingTitle) {
        this.assertTextContains(meetingTitle, meetingName);
      } else {
        throw new Error(`Meeting title is null or undefined.`);
      }
      const meetingDescription = await newTab.locator(Selectors.meetingDetailsDesc).textContent();
      if (meetingDescription) {
        this.assertTextContains(meetingDescription, meetingDesc);
      } else {
        throw new Error(`Meeting description is null or undefined.`);
      }

    } catch (error) {
      console.error(`Failed to create new meeting or verify details: ${error}`);
    }
  }
}
