# Detailed Test Cases

Minimum 8 test cases covering both UI behaviour and API response validation.

---

## TC-001 — Successful Form Submission via Suggestion Click

| Field | Detail |
|-------|--------|
| **Test Case ID** | TC-001 |
| **Title** | Successful form submission after selecting a suggestion by clicking |
| **Preconditions** | 1. User logged in as test123@gmail.com. 2. On form page https://test.com/autocomplete-form. 3. Default prefix-match mode active. |
| **Test Steps** | 1. Observe the suggestion list on page load. 2. Click the suggestion "agile methodology". 3. Verify input field is populated with "agile methodology". 4. Click the "Next" button. 5. Observe the page response. |
| **Expected Results** | 1. All 3 suggestions visible on load. 2. Input shows "agile methodology" after click. 3. REST API POST call fires. 4. HTTP 200 returned. 5. Success message visible. Error message hidden. |
| **Test Data** | User: test123@gmail.com. Suggestion: "agile methodology". |

---

## TC-002 — Prefix Match Filtering Hides Non-Matching Suggestions

| Field | Detail |
|-------|--------|
| **Test Case ID** | TC-002 |
| **Title** | Suggestion list filters correctly when typed text matches only a prefix |
| **Preconditions** | 1. On form page. 2. Default prefix-match mode active. |
| **Test Steps** | 1. Click into the input field. 2. Type "agile methodology p". 3. Observe the suggestion list. |
| **Expected Results** | 1. "agile methodology" disappears (does not start with "agile methodology p"). 2. "agile methodology process" remains. 3. "agile methodology process testing" remains. |
| **Test Data** | Input: "agile methodology p" |

---

## TC-003 — No Matching Suggestions Clears the List

| Field | Detail |
|-------|--------|
| **Test Case ID** | TC-003 |
| **Title** | All suggestions disappear when typed text matches no prefix |
| **Preconditions** | 1. On form page. 2. Default prefix-match mode active. |
| **Test Steps** | 1. Click into the input field. 2. Type "xyz". 3. Observe the suggestion list. |
| **Expected Results** | 1. All 3 suggestion items disappear. 2. Input retains value "xyz". |
| **Test Data** | Input: "xyz" |

---

## TC-004 — Match-Anywhere Mode Shows Substring Matches

| Field | Detail |
|-------|--------|
| **Test Case ID** | TC-004 |
| **Title** | Suggestions remain visible when typed text appears anywhere in the string (FR-03) |
| **Preconditions** | 1. On form page. 2. Backend "Match Anywhere" mode enabled. |
| **Test Steps** | 1. Click into the input field. 2. Type "process". 3. Observe the suggestion list. |
| **Expected Results** | 1. "agile methodology" disappears (no "process" in it). 2. "agile methodology process" remains. 3. "agile methodology process testing" remains. |
| **Test Data** | Input: "process". Match Anywhere: enabled. |

---

## TC-005 — Invalid Input Shows Error Message

| Field | Detail |
|-------|--------|
| **Test Case ID** | TC-005 |
| **Title** | Error message displayed when submitted text matches no suggestion |
| **Preconditions** | 1. On form page. |
| **Test Steps** | 1. Type "random invalid text" in the input field. 2. Click "Next". 3. Observe the page. |
| **Expected Results** | 1. `span.error-message` becomes visible with text "Error: Invalid input. Please select a valid suggestion." 2. `div.success-container` remains hidden. |
| **Test Data** | Input: "random invalid text" |

---

## TC-006 — Keyboard-Only Form Submission

| Field | Detail |
|-------|--------|
| **Test Case ID** | TC-006 |
| **Title** | User can navigate and submit using keyboard only (Tab + Enter) |
| **Preconditions** | 1. On form page. |
| **Test Steps** | 1. Press Tab to focus the input field. 2. Type "agile". 3. Press Tab to move focus to first suggestion item. 4. Press Enter to select it. 5. Tab to the Next button. 6. Press Enter to submit. |
| **Expected Results** | 1. Input field receives focus. 2. All 3 suggestions visible. 3. First suggestion is focused. 4. Input populated with "agile methodology". 5. Next button focused. 6. Form submits; success message shown. |
| **Test Data** | Input text: "agile" |

---

## TC-007 — API: Timestamps in Local Timezone (IST)

| Field | Detail |
|-------|--------|
| **Test Case ID** | TC-007 |
| **Title** | API response contains start_date and end_date in user's local timezone (IST / UTC+05:30) |
| **Preconditions** | 1. Logged in as test123@gmail.com. 2. Browser locale: English (India). 3. Form just submitted successfully. |
| **Test Steps** | 1. Select "agile methodology" from suggestion list. 2. Click Next. 3. GET the API record. 4. Inspect `start_date` and `end_date`. |
| **Expected Results** | 1. `start_date` has `+05:30` offset (e.g., `2024-03-15T16:00:00+05:30`), not `Z`. 2. `end_date` likewise in IST. 3. `end_date` is after `start_date`. |
| **Test Data** | Timezone: IST (UTC+05:30) |

---

## TC-008 — API: Full Schema and Data Type Validation

| Field | Detail |
|-------|--------|
| **Test Case ID** | TC-008 |
| **Title** | All FR-05 fields present with correct types, formats, and values |
| **Preconditions** | 1. Form submitted successfully. 2. GET request made to retrieve the record. |
| **Test Steps** | 1. Submit form by selecting "agile methodology" and clicking Next. 2. GET the API response. 3. Validate each field: `account_id` (string), `account_email` (email string), `start_date` (ISO 8601 + IST offset), `end_date` (ISO 8601 + IST offset), `locale` (`en-IN`), `text` (string), `suggestion_list` (comma-separated, only matched items), `completed` (boolean `true`). |
| **Expected Results** | 1. All 8 fields present. 2. `locale` = `"en-IN"` not `"en"`. 3. Both timestamps have `+05:30`. 4. `completed` is boolean `true` not string `"true"`. 5. `suggestion_list` contains only suggestions matching the input text. |
| **Test Data** | Expected locale: `en-IN`. Expected completed type: boolean. |

---

## TC-009 — API: suggestion_list Contains Only Filtered Suggestions

| Field | Detail |
|-------|--------|
| **Test Case ID** | TC-009 |
| **Title** | suggestion_list persists only the suggestions visible at submission time |
| **Preconditions** | 1. Match Anywhere mode enabled. 2. On form page. |
| **Test Steps** | 1. Type "process" — list shows 2 items. 2. Click "agile methodology process". 3. Click Next. 4. GET API response. 5. Check `suggestion_list`. |
| **Expected Results** | `suggestion_list` = `"agile methodology process, agile methodology process testing"`. "agile methodology" must NOT be present. |
| **Test Data** | Input: "process". Match Anywhere: enabled. |

---

## TC-010 — Escape Key Clears Input and Resets Suggestions

| Field | Detail |
|-------|--------|
| **Test Case ID** | TC-010 |
| **Title** | Pressing Escape clears the input field and restores all suggestions |
| **Preconditions** | 1. On form page. |
| **Test Steps** | 1. Type "agile meth" into input. 2. Verify 3 suggestions are visible. 3. Press Escape. 4. Observe input and suggestion list. |
| **Expected Results** | 1. Input is cleared (empty string). 2. All 3 suggestions return to visible state. |
| **Test Data** | Input before Escape: "agile meth" |
