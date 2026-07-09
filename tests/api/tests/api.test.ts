/**
 * API Test Suite — Autocomplete Form
 *
 * Validates the persisted API response against the FR-05 data contract.
 *
 * Covers:
 *  1. Schema validation — all required fields present
 *  2. Data type validation — boolean, string, timestamps
 *  3. IETF BCP 47 locale format
 *  4. suggestion_list — only matched suggestions
 *  5. Negative test cases — missing fields, wrong types, bad data
 */

// ─────────────────────────────────────────────────────────
// Sample response from the assignment (used for all tests)
// ─────────────────────────────────────────────────────────

const SAMPLE_RESPONSE = {
  account_id: '98765',
  account_email: 'test123@gmail.com',
  start_date: '2024-03-15T10:30:00Z',      // BUG: should be +05:30 local time
  end_date: '2024-03-15T10:32:00Z',         // BUG: should be +05:30 local time
  locale: 'en',                              // BUG: should be en-IN
  text: 'agile methodology',
  suggestion_list: 'agile methodology, agile methodology process, agile methodology process testing',
  completed: 'true',                         // BUG: should be boolean true
};

// ─────────────────────────────────────────────────────────
// Regex helpers
// ─────────────────────────────────────────────────────────

/** IETF BCP 47 structural format: en, en-IN, zh-Hant-TW */
const BCP47_REGEX = /^[a-z]{2,3}(-[A-Z][a-z]{3})?(-([A-Z]{2}|\d{3}))?(-[a-zA-Z0-9]{5,8}|\d[a-zA-Z0-9]{3})*$/;

/** ISO 8601 with LOCAL timezone offset — NOT UTC (no trailing Z allowed) */
const LOCAL_TIMESTAMP_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/;

/** ISO 8601 — accepts both UTC (Z) and offset — used for loose format check */
const ISO8601_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/;

/** Basic email format */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─────────────────────────────────────────────────────────
// Test Suite
// ─────────────────────────────────────────────────────────

describe('FR-05 — API Response Data Contract Tests', () => {

  // ── 1. Schema Validation ──────────────────────────────

  describe('1. Schema Validation — all required fields must be present', () => {

    test('TC-API-001 | All 8 required fields from FR-05 are present', () => {
      const requiredFields = [
        'account_id',
        'account_email',
        'start_date',
        'end_date',
        'locale',
        'text',
        'suggestion_list',
        'completed',
      ];
      requiredFields.forEach((field) => {
        expect(SAMPLE_RESPONSE).toHaveProperty(field);
      });
    });

    test('TC-API-002 | No required field is null or undefined', () => {
      Object.entries(SAMPLE_RESPONSE).forEach(([key, value]) => {
        expect(value).not.toBeNull();
        expect(value).not.toBeUndefined();
      });
    });

  });

  // ── 2. Data Type Validation ───────────────────────────

  describe('2. Data Type Validation', () => {

    test('TC-API-003 | account_id is a string', () => {
      expect(typeof SAMPLE_RESPONSE.account_id).toBe('string');
    });

    test('TC-API-004 | account_email is a valid email string', () => {
      expect(typeof SAMPLE_RESPONSE.account_email).toBe('string');
      expect(SAMPLE_RESPONSE.account_email).toMatch(EMAIL_REGEX);
    });

    test('TC-API-005 | start_date is a valid ISO 8601 timestamp', () => {
      expect(SAMPLE_RESPONSE.start_date).toMatch(ISO8601_REGEX);
    });

    test('TC-API-006 | end_date is a valid ISO 8601 timestamp', () => {
      expect(SAMPLE_RESPONSE.end_date).toMatch(ISO8601_REGEX);
    });

    test('TC-API-007 | end_date is after start_date', () => {
      const start = new Date(SAMPLE_RESPONSE.start_date).getTime();
      const end   = new Date(SAMPLE_RESPONSE.end_date).getTime();
      expect(end).toBeGreaterThan(start);
    });

    test('TC-API-008 | text is a non-empty string', () => {
      expect(typeof SAMPLE_RESPONSE.text).toBe('string');
      expect(SAMPLE_RESPONSE.text.length).toBeGreaterThan(0);
    });

    test('TC-API-009 | suggestion_list is a non-empty string', () => {
      expect(typeof SAMPLE_RESPONSE.suggestion_list).toBe('string');
      expect(SAMPLE_RESPONSE.suggestion_list.length).toBeGreaterThan(0);
    });

    /**
     * TC-API-010 — DEFECT TEST
     * FR-05 requires `completed` to be a BOOLEAN.
     * The sample response returns the STRING "true".
     * This test documents the defect — it will FAIL against the real API.
     */
    test('TC-API-010 | [DEFECT] completed must be boolean true — not string "true"', () => {
      // This assertion FAILS because typeof "true" === 'string', not 'boolean'
      expect(typeof SAMPLE_RESPONSE.completed).toBe('boolean');
      expect(SAMPLE_RESPONSE.completed).toBe(true);
    });

  });

  // ── 3. Locale — BCP 47 Format ────────────────────────

  describe('3. Locale — IETF BCP 47 Format Validation', () => {

    test('TC-API-011 | locale is a valid BCP 47 structural format', () => {
      expect(SAMPLE_RESPONSE.locale).toMatch(BCP47_REGEX);
    });

    /**
     * TC-API-012 — DEFECT TEST
     * FR-05 example is "en-IN". The sample response returns "en" — missing region subtag.
     * This test documents the defect — it will FAIL against the real API.
     */
    test('TC-API-012 | [DEFECT] locale must be "en-IN" for English user in India — not just "en"', () => {
      expect(SAMPLE_RESPONSE.locale).toBe('en-IN'); // FAILS: actual is "en"
    });

  });

  // ── 4. Timestamps — Local Time Validation ────────────

  describe('4. Timestamps — Must be in user local time (IST +05:30), not UTC', () => {

    /**
     * TC-API-013 — DEFECT TEST
     * FR-05 requires local time. The sample response uses UTC ("Z" suffix).
     * This test documents the defect — it will FAIL against the real API.
     */
    test('TC-API-013 | [DEFECT] start_date must have +05:30 offset — not UTC "Z"', () => {
      expect(SAMPLE_RESPONSE.start_date).toMatch(LOCAL_TIMESTAMP_REGEX); // FAILS: ends with Z
    });

    test('TC-API-014 | [DEFECT] end_date must have +05:30 offset — not UTC "Z"', () => {
      expect(SAMPLE_RESPONSE.end_date).toMatch(LOCAL_TIMESTAMP_REGEX); // FAILS: ends with Z
    });

  });

  // ── 5. suggestion_list Accuracy ──────────────────────

  describe('5. suggestion_list — Must contain only matched suggestions', () => {

    test('TC-API-015 | suggestion_list items are separated by ", " (comma + space)', () => {
      const items = SAMPLE_RESPONSE.suggestion_list.split(', ');
      expect(items.length).toBeGreaterThan(0);
      items.forEach((item) => {
        expect(item.trim().length).toBeGreaterThan(0);
      });
    });

    test('TC-API-016 | suggestion_list includes the text the user submitted', () => {
      const items = SAMPLE_RESPONSE.suggestion_list.split(', ');
      expect(items).toContain(SAMPLE_RESPONSE.text);
    });

    test('TC-API-017 | Every item in suggestion_list starts with the submitted text (prefix match)', () => {
      const submitted = SAMPLE_RESPONSE.text.toLowerCase();
      const items = SAMPLE_RESPONSE.suggestion_list.split(', ');
      items.forEach((item) => {
        expect(item.toLowerCase().startsWith(submitted)).toBe(true);
      });
    });

    test('TC-API-018 | [Match-Anywhere] suggestion_list excludes non-matching suggestions', () => {
      // Simulated: user typed "process" in match-anywhere mode
      // Only 2 suggestions were visible — "agile methodology" must NOT appear
      const simulatedResponse = {
        text: 'agile methodology process',
        suggestion_list: 'agile methodology process, agile methodology process testing',
      };
      const items = simulatedResponse.suggestion_list.split(', ');
      expect(items).not.toContain('agile methodology');
      expect(items).toContain('agile methodology process');
      expect(items).toContain('agile methodology process testing');
    });

  });

  // ── 6. Negative Tests ────────────────────────────────

  describe('6. Negative Tests', () => {

    test('TC-API-NEG-001 | Response missing account_email fails schema check', () => {
      const invalidResponse = { ...SAMPLE_RESPONSE } as Partial<typeof SAMPLE_RESPONSE>;
      delete invalidResponse.account_email;

      const requiredFields = [
        'account_id', 'account_email', 'start_date', 'end_date',
        'locale', 'text', 'suggestion_list', 'completed',
      ];
      const missingFields = requiredFields.filter((f) => !(f in invalidResponse));
      expect(missingFields).toContain('account_email');
    });

    test('TC-API-NEG-002 | completed as string "false" fails boolean type check', () => {
      const badResponse = { ...SAMPLE_RESPONSE, completed: 'false' };
      expect(typeof badResponse.completed).not.toBe('boolean');
    });

    test('TC-API-NEG-003 | locale "en_IN" (underscore) fails BCP 47 format check', () => {
      // BCP 47 requires hyphens, not underscores
      const badLocale = 'en_IN';
      expect(badLocale).not.toMatch(BCP47_REGEX);
    });

    test('TC-API-NEG-004 | end_date before start_date is invalid', () => {
      const badResponse = {
        ...SAMPLE_RESPONSE,
        start_date: '2024-03-15T10:32:00Z',
        end_date:   '2024-03-15T10:30:00Z', // earlier than start
      };
      const start = new Date(badResponse.start_date).getTime();
      const end   = new Date(badResponse.end_date).getTime();
      // end must NOT be greater than start — this response is invalid
      expect(end).not.toBeGreaterThan(start);
    });

    test('TC-API-NEG-005 | suggestion_list containing non-matching item fails prefix validation', () => {
      // User submitted "agile methodology process" — "agile methodology" alone should NOT be in the list
      const badResponse = {
        text: 'agile methodology process',
        suggestion_list: 'agile methodology, agile methodology process, agile methodology process testing',
      };
      const inputText = badResponse.text.toLowerCase();
      const items = badResponse.suggestion_list.split(', ');
      const invalidItems = items.filter((item) => !item.toLowerCase().startsWith(inputText));
      // "agile methodology" does not start with "agile methodology process"
      expect(invalidItems.length).toBeGreaterThan(0);
    });

  });

});
