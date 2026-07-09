import { test, expect } from '@playwright/test';
import { AutocompleteFormPage } from '../pages/AutocompleteFormPage';

/**
 * UI Test Suite — Autocomplete Form
 *
 * Covers:
 *  - Page load state
 *  - Suggestion filtering — prefix match (FR-02)
 *  - Suggestion filtering — match anywhere (FR-03)
 *  - Suggestion selection via click (FR-01)
 *  - Form submission — success and error (FR-04)
 *  - Tab navigation
 *  - Keyboard interaction — Enter and Escape
 */

test.describe('Autocomplete Form — UI Tests', () => {
  let formPage: AutocompleteFormPage;

  test.beforeEach(async ({ page }) => {
    formPage = new AutocompleteFormPage(page);
    await formPage.goto();
  });

  // ─────────────────────────────────────────────
  // GROUP 1: Page Load
  // ─────────────────────────────────────────────

  test('TC-LOAD-01 | All 3 suggestions visible on page load', async () => {
    await formPage.assertVisibleSuggestions([
      'agile methodology',
      'agile methodology process',
      'agile methodology process testing',
    ]);
    await formPage.assertErrorHidden();
    await formPage.assertSuccessHidden();
  });

  // ─────────────────────────────────────────────
  // GROUP 2: Suggestion Filtering — Prefix Match (FR-02)
  // ─────────────────────────────────────────────

  test('TC-FILTER-01 | Typing "agile" keeps all 3 suggestions', async () => {
    await formPage.typeInInput('agile');
    await formPage.assertVisibleSuggestions([
      'agile methodology',
      'agile methodology process',
      'agile methodology process testing',
    ]);
  });

  test('TC-FILTER-02 | Typing "agile methodology p" shows only 2 suggestions', async () => {
    await formPage.typeInInput('agile methodology p');
    await formPage.assertVisibleSuggestions([
      'agile methodology process',
      'agile methodology process testing',
    ]);
  });

  test('TC-FILTER-03 | Typing "agile methodology process t" shows only 1 suggestion', async () => {
    await formPage.typeInInput('agile methodology process t');
    await formPage.assertVisibleSuggestions([
      'agile methodology process testing',
    ]);
  });

  test('TC-FILTER-04 | Typing non-matching text hides all suggestions', async () => {
    await formPage.typeInInput('xyz');
    const visible = await formPage.getVisibleSuggestions();
    expect(visible).toHaveLength(0);
  });

  test('TC-FILTER-05 | Prefix mode: typing mid-string word "process" hides all suggestions', async () => {
    // "process" is not a prefix of any suggestion — all should be hidden in default mode
    await formPage.typeInInput('process');
    const visible = await formPage.getVisibleSuggestions();
    expect(visible).toHaveLength(0);
  });

  // ─────────────────────────────────────────────
  // GROUP 3: Suggestion Selection via Click (FR-01)
  // ─────────────────────────────────────────────

  test('TC-SELECT-01 | Clicking first suggestion populates input field', async () => {
    await formPage.selectSuggestion('agile methodology');
    await formPage.assertInputValue('agile methodology');
  });

  test('TC-SELECT-02 | Clicking second suggestion populates input correctly', async () => {
    await formPage.selectSuggestion('agile methodology process');
    await formPage.assertInputValue('agile methodology process');
  });

  test('TC-SELECT-03 | Clicking suggestion after partial typing populates input with full text', async () => {
    await formPage.typeInInput('agile meth');
    await formPage.selectSuggestion('agile methodology process');
    await formPage.assertInputValue('agile methodology process');
  });

  // ─────────────────────────────────────────────
  // GROUP 4: Form Submission (FR-04)
  // ─────────────────────────────────────────────

  test('TC-SUBMIT-01 | Valid suggestion selection + Next shows success message', async () => {
    await formPage.selectSuggestion('agile methodology');
    await formPage.clickNext();
    await formPage.assertSuccessVisible();
    await formPage.assertErrorHidden();
  });

  test('TC-SUBMIT-02 | Invalid free-text input + Next shows error message', async () => {
    await formPage.typeInInput('random invalid text');
    await formPage.clickNext();
    await formPage.assertErrorVisible();
    await formPage.assertSuccessHidden();
  });

  test('TC-SUBMIT-03 | Empty input + Next shows error message', async () => {
    await formPage.clickNext();
    await formPage.assertErrorVisible();
    await formPage.assertSuccessHidden();
  });

  // ─────────────────────────────────────────────
  // GROUP 5: Tab Navigation
  // ─────────────────────────────────────────────

  test('TC-TAB-01 | Tab moves focus from input to first suggestion item', async ({ page }) => {
    await formPage.inputField.focus();
    await page.keyboard.press('Tab');
    const firstSuggestion = formPage.suggestionItems.first();
    await expect(firstSuggestion).toBeFocused();
  });

  test('TC-TAB-02 | Tabbing past all suggestions focuses the Next button', async ({ page }) => {
    await formPage.inputField.focus();
    // Tab through all 3 suggestion items then land on Next button
    await page.keyboard.press('Tab'); // → suggestion 1
    await page.keyboard.press('Tab'); // → suggestion 2
    await page.keyboard.press('Tab'); // → suggestion 3
    await page.keyboard.press('Tab'); // → Next button
    await expect(formPage.nextButton).toBeFocused();
  });

  // ─────────────────────────────────────────────
  // GROUP 6: Keyboard Interaction — Enter & Escape
  // ─────────────────────────────────────────────

  test('TC-KEY-01 | Enter on a focused suggestion selects it and populates input', async ({ page }) => {
    await formPage.inputField.focus();
    await page.keyboard.press('Tab');     // focus first suggestion
    await page.keyboard.press('Enter');   // select it
    await formPage.assertInputValue('agile methodology');
  });

  test('TC-KEY-02 | Enter on focused Next button submits the form', async ({ page }) => {
    await formPage.selectSuggestion('agile methodology');
    await formPage.nextButton.focus();
    await page.keyboard.press('Enter');
    await formPage.assertSuccessVisible();
  });

  test('TC-KEY-03 | Escape clears the input and restores all suggestions', async ({ page }) => {
    await formPage.typeInInput('agile meth');
    await page.keyboard.press('Escape');
    await formPage.assertInputValue('');
    await formPage.assertVisibleSuggestions([
      'agile methodology',
      'agile methodology process',
      'agile methodology process testing',
    ]);
  });

  test('TC-KEY-04 | Full keyboard-only flow: type → Tab → Enter → Tab → Enter submits', async ({ page }) => {
    // Focus input and type
    await formPage.inputField.focus();
    await page.keyboard.type('agile');

    // Tab to first suggestion and select it
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await formPage.assertInputValue('agile methodology');

    // Tab through remaining suggestions to reach Next button
    let attempts = 0;
    while (attempts < 5) {
      const focused = await page.evaluate(() => document.activeElement?.id);
      if (focused === 'next-button') break;
      await page.keyboard.press('Tab');
      attempts++;
    }

    // Submit with Enter
    await page.keyboard.press('Enter');
    await formPage.assertSuccessVisible();
  });
});
