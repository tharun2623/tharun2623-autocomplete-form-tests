# Top 10 Test Scenarios — Ranked by Risk

Ranked from **highest** to **lowest** risk based on impact to data integrity, user experience, and correctness of persisted records.

---

| Rank | Scenario | Risk Level | Rationale |
|------|----------|------------|-----------|
| 1 | **Incorrect timezone in start_date / end_date** — Timestamps stored in UTC instead of user's local time (IST) | Critical | FR-05 explicitly requires local time. UTC timestamps for an IST user are off by ±5:30 hours, permanently corrupting every time-based record. |
| 2 | **completed field stored as string instead of boolean** — API returns `"true"` (string) instead of `true` (boolean) | Critical | Wrong data type breaks any downstream system doing strict type checks (`completed === true` fails when value is `"true"`). Clear data contract violation. |
| 3 | **locale field non-compliant with BCP 47** — Stored as `"en"` instead of `"en-IN"` | Critical | FR-05 mandates IETF BCP 47 format. Losing the region subtag breaks locale-sensitive features (currency, date format, number format) for downstream consumers. |
| 4 | **suggestion_list always returns all suggestions regardless of filter state** — After filtering to 2 suggestions, API still sends all 3 | High | FR-05 requires only matching suggestions. Sending the unfiltered list means the stored record does not reflect what the user actually saw. |
| 5 | **Form accepts and submits free-text with no error shown** — No error message on invalid input | High | FR-04 requires an error message on invalid input. Silent acceptance means corrupt records are persisted with no user correction. |
| 6 | **Prefix match filtering broken** — Typing a non-prefix string incorrectly hides or shows wrong suggestions | High | FR-02 is the core filtering behaviour. Broken filtering prevents valid selections and is the primary UX feature of the form. |
| 7 | **Clicking a suggestion does not populate the input field** | High | FR-01 primary interaction method. If clicking a suggestion does not update the input, the user cannot use the expected workflow. |
| 8 | **Clicking Next does not trigger an API call** — Form submission is silently broken | High | FR-04 depends on the API call completing. If it doesn't fire, no record is persisted and no feedback is given. |
| 9 | **Match-Anywhere mode (FR-03) broken when enabled** — Substring-matching suggestions incorrectly disappear | Medium | FR-03 is a configurable enhancement. Broken only when flag is enabled; does not affect the default mode. |
| 10 | **Keyboard navigation broken** — Tab / Enter / Escape do not work | Medium | Accessibility requirement. Broken keyboard support excludes keyboard-dependent users but does not corrupt data. |
