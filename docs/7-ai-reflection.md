# AI Reflection — Task 6

## 1. Tools Used

- **Claude (Anthropic — claude.ai)** — Used as the primary AI assistant throughout this assignment.

---

## 2. Usage Areas

| Area | How AI Was Used |
|------|----------------|
| Requirement Analysis | Asked Claude to list ambiguities and implicit assumptions from the FRs. Output used as a starting checklist, then manually reviewed and expanded. |
| Test Scenario Ranking | Asked Claude to suggest test scenarios. Manually re-ranked them based on data integrity risk rather than accepting the AI's default ordering. |
| Defect Identification | Asked Claude to cross-reference the sample API response against FR-05. All discrepancies personally verified against the spec before documenting. |
| Test Case Writing | Claude generated initial test case skeletons. Expected results and test data sections were rewritten manually. |
| Playwright Script (UI) | Claude generated initial Page Object Model scaffolding. Keyboard interaction steps, Escape key test, and assertion logic were significantly modified. |
| API Automation | Claude provided Jest + Axios boilerplate. BCP 47 regex validation and strict boolean type check were added manually after AI output missed both. |

---

## 3. Modifications Made

### Modification 1 — BCP 47 Locale Validation

**What Claude generated:**
```typescript
expect(response.data.locale).toBe('en-IN');
```

**What I changed it to:**
```typescript
const bcp47Regex = /^[a-z]{2,3}(-[A-Z][a-z]{3})?(-[A-Z]{2}|\d{3})?(-[a-zA-Z0-9]{5,8}|\d[a-zA-Z0-9]{3})*$/;
expect(response.data.locale).toMatch(bcp47Regex);
expect(response.data.locale).toBe('en-IN');
```

**Reason:** A hardcoded `toBe('en-IN')` only validates the specific value, not whether the format is structurally valid BCP 47. The task explicitly asks to "Validate IETF BCP 47 locale format." The regex validates the structure first, then the expected value. This correctly documents what the requirement tests.

---

### Modification 2 — Boolean Type Check for `completed`

**What Claude generated:**
```typescript
expect(response.data.completed).toBeTruthy();
```

**What I changed it to:**
```typescript
expect(typeof response.data.completed).toBe('boolean');
expect(response.data.completed).toBe(true);
```

**Reason:** `toBeTruthy()` passes for both `true` (boolean) AND `"true"` (string). The AI's assertion would not catch the actual defect. The requirement says "Boolean." Splitting into two assertions validates the type AND value independently, which is exactly what the defect exposes.

---

### Modification 3 — Timestamp Timezone Assertion

**What Claude generated:**
```typescript
expect(response.data.start_date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
```

**What I changed it to:**
```typescript
const localTimestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+05:30$/;
expect(response.data.start_date).toMatch(localTimestampRegex);
```

**Reason:** The AI's regex only checked the ISO 8601 shape — it would pass even for UTC (`"2024-03-15T10:30:00Z"`), which is exactly the defect. Adding `+05:30` to the regex means the test fails correctly when given the buggy UTC response.

---

## 4. AI Limitations

### Limitation 1 — Did not flag `suggestion_list` as a potential defect

When asked to analyse the sample API response against FR-05, Claude initially said `suggestion_list` was correct because all 3 items in the response matched existing suggestions. Claude failed to reason that:

- FR-05 says "suggestions **matching** the value entered/selected" — meaning the dynamically filtered subset, not all suggestions statically.
- In this scenario all 3 happened to be visible, so the risk was hidden. But the real question is: does the backend always return all 3 regardless of what was filtered?
- Claude did not raise this conditional risk. I caught it by manually thinking through a filtered scenario ("what if only 2 suggestions were visible — would the API still return all 3?") and added TC-009 to test it explicitly.

### Limitation 2 — Keyboard navigation tests were incomplete

Claude's generated keyboard tests used Tab and Enter but missed:
- Verifying that individual `<li>` items are focusable via Tab (not just the input and button).
- Testing the Escape key to clear the input field.
- Asserting which specific element holds focus at each step.

These were added manually after reviewing FR requirements and accessibility patterns.
