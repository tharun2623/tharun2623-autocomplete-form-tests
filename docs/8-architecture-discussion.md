# Architecture Discussion

## Test Architecture Overview

```
┌─────────────────────────────────────────────────┐
│              UI Tests (Playwright)               │
│  ┌──────────────────┐   ┌─────────────────────┐ │
│  │ Page Object Model │──▶│  Test Specs          │ │
│  │ AutocompleteForm  │   │  autocomplete.spec.ts│ │
│  └──────────────────┘   └─────────────────────┘ │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│              API Tests (Jest + Axios)            │
│  ┌──────────────────────────────────────────┐   │
│  │  api.test.ts                              │   │
│  │  - Schema validation                      │   │
│  │  - Data type checks                       │   │
│  │  - BCP 47 locale format                   │   │
│  │  - suggestion_list accuracy               │   │
│  │  - Negative tests                         │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## Why Page Object Model (POM)?

- **Separation of concerns:** All selectors and interaction logic live in the Page Object, not scattered across test files.
- **Maintainability:** When the UI changes (e.g., a class name changes), only the Page Object needs updating — not every test.
- **Readability:** Test files read like plain English (`await formPage.selectSuggestion('agile methodology')`) rather than raw Playwright selector code.

---

## Why Jest + Axios for API Tests?

- **Simplicity:** Axios provides a clean, promise-based HTTP client.
- **Rich assertions:** Jest's `expect` API has excellent matchers for type checking and regex — needed for BCP 47 and timestamp validation.
- **Decoupled:** API tests run independently of the browser, making them faster and more targeted.

---

## Technology Decisions

| Decision | Alternative Considered | Reason for Choice |
|----------|----------------------|-------------------|
| Playwright | Cypress | Better native keyboard event support (Tab, Escape) which is core to this suite |
| TypeScript | JavaScript | Type safety catches errors in test code; better IDE autocompletion |
| POM pattern | Inline selectors | Easier maintenance; single place to update when selectors change |
| Jest for API | Playwright `request` context | Fully decoupled from browser lifecycle; faster; cleaner |
