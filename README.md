# Autocomplete Form — QA Test Suite

Complete test suite for the Autocomplete Form feature covering manual analysis, defect identification, test cases, UI automation (Playwright), and API automation (Jest).

---

## Project Structure

```
├── README.md
├── package.json
├── tsconfig.json
├── jest.config.js
├── docs/
│   ├── 1-requirement-analysis.md
│   ├── 2-test-scenarios.md
│   ├── 3-defect-identification.md
│   ├── 4-test-cases.md
│   ├── 7-ai-reflection.md
│   └── 8-architecture-discussion.md
└── tests/
    ├── ui/
    │   ├── config/
    │   │   ├── playwright.config.ts
    │   │   └── env.ts
    │   ├── pages/
    │   │   └── AutocompleteFormPage.ts
    │   └── tests/
    │       └── autocomplete.spec.ts
    └── api/
        └── tests/
            └── api.test.ts
```

---

## Prerequisites

- Node.js v18+
- npm v9+

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install chromium
```

---

## Running Tests

### API Tests (run immediately, no live server needed)
```bash
npm run test:api
```

### UI Tests (requires live application at https://test.com)
```bash
npm run test:ui

# With browser visible
npm run test:ui:headed
```

### All Tests
```bash
npm test
```

---

## What Each Task Covers

| Task | File | Description |
|------|------|-------------|
| Task 1 — Test Scenarios | `docs/2-test-scenarios.md` | Top 10 risks ranked highest to lowest |
| Task 2 — Defects | `docs/3-defect-identification.md` | FR-05 API response discrepancies |
| Task 3 — Test Cases | `docs/4-test-cases.md` | 10 detailed test cases (UI + API) |
| Task 4 — UI Automation | `tests/ui/` | 16 Playwright tests with Page Object Model |
| Task 5 — API Automation | `tests/api/tests/api.test.ts` | 18 Jest tests (schema, types, BCP 47, negatives) |
| Task 6 — AI Reflection | `docs/7-ai-reflection.md` | Tools used, modifications made, limitations found |

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `@playwright/test` | UI end-to-end test framework |
| `jest` | API test runner |
| `axios` | HTTP client for API tests |
| `ts-jest` | TypeScript support in Jest |
| `typescript` | Language |
