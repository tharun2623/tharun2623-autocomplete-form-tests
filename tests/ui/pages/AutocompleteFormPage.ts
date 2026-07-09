import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Autocomplete Form.
 * URL: https://test.com/autocomplete-form
 *
 * Encapsulates all selectors and interaction methods so that
 * test scripts stay readable and easy to maintain.
 */
export class AutocompleteFormPage {
  readonly page: Page;

  // Element locators
  readonly inputField: Locator;
  readonly suggestionList: Locator;
  readonly suggestionItems: Locator;
  readonly nextButton: Locator;
  readonly errorMessage: Locator;
  readonly successContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inputField      = page.locator('#input-field');
    this.suggestionList  = page.locator('ul.suggestions');
    this.suggestionItems = page.locator('ul.suggestions li');
    this.nextButton      = page.locator('#next-button');
    this.errorMessage    = page.locator('span.error-message');
    this.successContainer = page.locator('div.success-container');
  }

  /** Navigate to the autocomplete form page. */
  async goto() {
    await this.page.goto('/autocomplete-form');
  }

  /** Type text into the input field to trigger suggestion filtering. */
  async typeInInput(text: string) {
    await this.inputField.click();
    await this.inputField.fill(text);
  }

  /** Clear the input field using the Escape key. */
  async clearWithEscape() {
    await this.inputField.focus();
    await this.page.keyboard.press('Escape');
  }

  /** Click a suggestion item by its exact visible text. */
  async selectSuggestion(text: string) {
    await this.suggestionList.locator(`li:has-text("${text}")`).click();
  }

  /** Click the Next button to submit the form. */
  async clickNext() {
    await this.nextButton.click();
  }

  /** Returns an array of all currently visible suggestion texts. */
  async getVisibleSuggestions(): Promise<string[]> {
    const items = await this.suggestionItems.all();
    const texts: string[] = [];
    for (const item of items) {
      if (await item.isVisible()) {
        texts.push((await item.innerText()).trim());
      }
    }
    return texts;
  }

  /** Assert the error message element is visible. */
  async assertErrorVisible() {
    await expect(this.errorMessage).toBeVisible();
  }

  /** Assert the success container is visible. */
  async assertSuccessVisible() {
    await expect(this.successContainer).toBeVisible();
  }

  /** Assert the error message element is hidden. */
  async assertErrorHidden() {
    await expect(this.errorMessage).toBeHidden();
  }

  /** Assert the success container is hidden. */
  async assertSuccessHidden() {
    await expect(this.successContainer).toBeHidden();
  }

  /** Assert the input field has a specific value. */
  async assertInputValue(expected: string) {
    await expect(this.inputField).toHaveValue(expected);
  }

  /** Assert the exact list of visible suggestions. */
  async assertVisibleSuggestions(expected: string[]) {
    const visible = await this.getVisibleSuggestions();
    expect(visible).toEqual(expected);
  }
}
