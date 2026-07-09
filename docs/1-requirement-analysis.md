# Requirement Analysis — Autocomplete Form

## Scope

This document captures ambiguities, assumptions, and implicit requirements identified from reading the functional requirements.

---

## Ambiguities Identified

### 1. When is the suggestion list visible?
**Gap:** FR-01 and FR-02 do not say whether the list shows on page load or only after typing.

**Assumption:** All 3 suggestions are visible on page load. Filtering starts as soon as the user types.

---

### 2. Case sensitivity of suggestion filtering
**Gap:** FR-02 and FR-03 do not state whether prefix/substring matching is case-sensitive.

**Assumption:** Filtering is case-insensitive — typing "AGILE" still shows suggestions containing "agile".

---

### 3. What is "invalid input" (FR-04)?
**Gap:** FR-04 mentions an error message on "invalid input" but does not define invalid.

**Assumption:** Invalid input means the submitted text does not exactly match any suggestion in the visible list — i.e., free-text that never matched any suggestion.

---

### 4. Behaviour after suggestion is clicked
**Gap:** FR-01 says clicking a suggestion populates the input, but does not say what happens to the list.

**Assumption:** After clicking a suggestion, the input is populated and the suggestion list collapses or shows only the selected item.

---

### 5. suggestion_list field — "matching" vs "all"
**Gap:** FR-05 states suggestion_list is "suggestions matching the value entered/selected." It is not clear whether this means only visible (filtered) suggestions or all suggestions.

**Assumption:** suggestion_list must contain only the suggestions visible at submission time — not the full unfiltered list.

---

### 6. start_date timing — client-side or server-side?
**Gap:** FR-05 says start_date is "when they reached the form" but doesn't say who captures it.

**Assumption:** start_date is captured client-side at page load, in the user's local timezone.

---

### 7. What happens when no suggestions match?
**Gap:** No requirement covers this scenario.

**Assumption:** All suggestions disappear. User may still submit, which triggers the error message per FR-04.

---

### 8. Tab navigation order
**Gap:** Not specified.

**Assumption:** Logical DOM order — input field → suggestion items → Next button.

---

## Implicit Requirements

| ID | Implicit Requirement |
|----|----------------------|
| IR-01 | The form must be navigable by keyboard only (Tab, Enter, Escape) |
| IR-02 | `span.error-message` must be hidden by default; shown only on invalid submission |
| IR-03 | `div.success-container` must be hidden by default; shown only after HTTP 200 |
| IR-04 | `completed` in the API response must be a boolean `true`, not a string `"true"` |
| IR-05 | Timestamps must carry the user's local timezone offset (e.g., +05:30 for IST) |
| IR-06 | `locale` must include the region subtag (e.g., `en-IN`, not just `en`) |
