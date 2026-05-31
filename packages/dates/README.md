# @repo/dates

Centralized date utility library for **codebase-x**, powered by **date-fns**.

## 🚀 Features

- **Standard Formatting**: Predefined date formats for consistency across apps.
- **Relative Time**: Easy human-readable time strings (e.g., "5 minutes ago").
- **Type-Safe**: Built with TypeScript and re-exports core `date-fns` utilities.

## 🛠 Usage

### Formatting

```typescript
import { formatDate, DATE_FORMATS } from "@repo/dates";

const full = formatDate(new Date()); // "May 15th, 2026"
const iso = formatDate(new Date(), DATE_FORMATS.ISO); // "2026-05-15"
```

### Relative Time

```typescript
import { relativeTime } from "@repo/dates";

const text = relativeTime("2026-05-10"); // "5 days ago"
```

---

Part of the [codebase-x](https://github.com/your-username/codebase-x) starter template.
