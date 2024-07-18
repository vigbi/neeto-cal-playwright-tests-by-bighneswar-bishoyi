import { Locator, Page,expect } from '@playwright/test';
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
  meetingDetailsDesc = '[data-cy="neeto-editor-content"]',
  newMeetingDetailsTitle = '[data-cy="booking-meeting-name"]',
  newMeetingDetailsClient = '[data-cy="booking-host-name"]',
  newMeetingDetailsEmail = '[data-cy="booking-responses-answer"] a',
  newMeetingDetailsTime = '[data-cy="booking-date"]',
  homeBtn = '[data-cy="home-button"]',
  bookingsLink = '[data-cy="scheduled-meeting-sidebar-link"]',
  bookingsTableRow = '[data-cy="bookings-table"] tbody tr',
}
export default class MeetingPage extends BasePage {
  private originalPage: Page | undefined;
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
      console.error(`Failed to get link : ${error}`);
      return null;
    }
  }
  async createNewMeeting(meetingType: string, meetingName: string, meetingLink: string, meetingDesc: string): Promise<Page> {
    try {
      this.originalPage = this.page;
      await this.waitForElementToBeVisible(Selectors.addNewMeetingLink, 30);
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

      return newTab; // Return the new page reference

    } catch (error) {
      console.error(`Failed to create new meeting or verify details: ${error}`);
      throw new Error('Failed to create new meeting.');
    }
  }

  async assertTextContains(actualText: string, expectedText: string): Promise<void> {
      expect(actualText).toContain(expectedText);
  }

  async createNewMeetingWithForm(newTab: Page, meetingName: string, date: string, clientName: string, email: string) {
    try {
      await newTab.getByRole('button', { name: date + "," }).click();
      const timeSlots = await newTab.locator('[data-cy="start-time-slot-button"]').elementHandles();
      const firstTimeSlot = timeSlots[0];
      const timeSlotText = await firstTimeSlot.textContent();
      await firstTimeSlot.click();
      await newTab.getByRole('button', { name: 'Confirm' }).click();

      const nameField = newTab.getByLabel('Name*');
      await nameField.fill(clientName);

      const emailField = newTab.getByLabel('Email*');
      await emailField.fill(email);

      await newTab.getByRole('button', { name: 'Submit' }).click();

      const title = await newTab.locator(Selectors.newMeetingDetailsTitle).textContent();
      if (title) {
        this.assertTextContains(title, meetingName);
      } else {
        throw new Error(`Meeting title is null or undefined.`);
      }

      const client = await newTab.locator(Selectors.newMeetingDetailsClient).nth(0).textContent();
      if (client) {
        this.assertTextContains(client, clientName);
      } else {
        throw new Error(`Client name is null or undefined.`);
      }

      const clientEmail = await newTab.locator(Selectors.newMeetingDetailsEmail).textContent();
      if (clientEmail) {
        this.assertTextContains(clientEmail, email.toLowerCase());
      } else {
        throw new Error(`Client email is null or undefined.`);
      }

      const [monthFullName, dayOfMonth] = date.split(' ');

      const monthAbbreviation = new Date(`${monthFullName} 1 2000`).toLocaleString('en-US', { month: 'short' });
      const formattedDate = `${monthAbbreviation} ${dayOfMonth}`;
      const meetingTime = await newTab.locator(Selectors.newMeetingDetailsTime).textContent();
      if (meetingTime) {
        this.assertTextContains(meetingTime, formattedDate);
      } else {
        throw new Error(`Meeting time is null or undefined.`);
      }
      if (this.originalPage) {
        await this.originalPage.bringToFront();
        await this.originalPage.locator(Selectors.homeBtn).click()
        await this.originalPage.locator(Selectors.bookingsLink).click()
        await this.originalPage.reload();

        const rows = this.originalPage.locator(Selectors.bookingsTableRow);
        const rowCount = await rows.count();
        const lastRow = await rows.nth(rowCount - 1).textContent();

        if (lastRow) {
          this.assertTextContains(lastRow, meetingName);
          this.assertTextContains(lastRow, clientName);
          this.assertTextContains(lastRow, email.toLowerCase());
          this.assertTextContains(lastRow, formattedDate);
        } else {
          throw new Error(`Booking details in the last row are null or undefined.`);
        }
      }

    } catch (error) {
      console.error('Failed to create meeting with form:', error);
      throw error;
    }
  }
  
}
