# Defect Identification — FR-05 API Response Analysis

## API Response Received

After selecting "agile methodology" and clicking Next, the GET request returned:

```json
{
  "account_id": "98765",
  "account_email": "test123@gmail.com",
  "start_date": "2024-03-15T10:30:00Z",
  "end_date": "2024-03-15T10:32:00Z",
  "locale": "en",
  "text": "agile methodology",
  "suggestion_list": "agile methodology, agile methodology process, agile methodology process testing",
  "completed": "true"
}
```

---

## Discrepancy 1 — start_date and end_date: UTC instead of local time

| | Detail |
|--|--------|
| **Field** | `start_date`, `end_date` |
| **Actual** | `"2024-03-15T10:30:00Z"` / `"2024-03-15T10:32:00Z"` |
| **Expected** | `"2024-03-15T16:00:00+05:30"` / `"2024-03-15T16:02:00+05:30"` (approx.) |
| **Requirement** | FR-05: *"Timestamp in the user's **local time**"* |
| **Root Cause** | Both timestamps use UTC (trailing `Z`). The test user is in India (IST = UTC+05:30). |
| **Impact** | Every timestamp record for Indian users is wrong by 5 hours 30 minutes. Time-based analytics and audit logs are all incorrect. |
| **Severity** | 🔴 Critical |

---

## Discrepancy 2 — locale: Missing region subtag

| | Detail |
|--|--------|
| **Field** | `locale` |
| **Actual** | `"en"` |
| **Expected** | `"en-IN"` |
| **Requirement** | FR-05: *"IETF BCP 47 format (e.g., en-IN)"* |
| **Root Cause** | The locale is captured as language-only. The test environment is Chrome on Windows 10 configured with English in India, which should resolve to `en-IN`. |
| **Impact** | Downstream locale-sensitive operations (date format, number format, currency) cannot distinguish between English variants (en-US, en-GB, en-IN). |
| **Severity** | 🔴 Critical |

---

## Discrepancy 3 — completed: String instead of boolean

| | Detail |
|--|--------|
| **Field** | `completed` |
| **Actual** | `"true"` (JSON string) |
| **Expected** | `true` (JSON boolean) |
| **Requirement** | FR-05: *"**Boolean** representing the status of form response upload"* |
| **Root Cause** | Value serialised as a string, not a boolean primitive. |
| **Impact** | Any consumer doing `if (completed === true)` will fail. Type-safe systems (TypeScript, Java, etc.) will reject the value or require extra coercion. |
| **Severity** | 🔴 Critical |

---

## Discrepancy 4 — suggestion_list: Risk of always returning all items

| | Detail |
|--|--------|
| **Field** | `suggestion_list` |
| **Actual** | `"agile methodology, agile methodology process, agile methodology process testing"` |
| **Expected** | Only suggestions that were visible (matched) at time of submission |
| **Requirement** | FR-05: *"Comma-separated string of suggestions **matching** the value entered/selected"* |
| **Analysis** | In this specific scenario the user selected "agile methodology", and in prefix-match mode all 3 suggestions start with "agile methodology", so all 3 being returned is coincidentally correct. However, the concern is whether the backend dynamically filters or always returns all suggestions. A separate test (e.g., filter down to 2 suggestions then submit) is needed to confirm or deny this defect. |
| **Severity** | 🟡 Medium (risk — requires additional test to confirm) |

---

## Summary

| # | Field | Issue | Severity |
|---|-------|-------|----------|
| 1 | `start_date` | UTC timestamp, should be IST (+05:30) | 🔴 Critical |
| 2 | `end_date` | UTC timestamp, should be IST (+05:30) | 🔴 Critical |
| 3 | `locale` | `"en"` instead of `"en-IN"` | 🔴 Critical |
| 4 | `completed` | String `"true"` instead of boolean `true` | 🔴 Critical |
| 5 | `suggestion_list` | Potential risk of always returning all items, not just matched | 🟡 Medium |
