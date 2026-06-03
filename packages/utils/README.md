# @repo/utils

Centralized utility library for **theo**.

## 🚀 Features

- **HTTP**: Utilities for working with Web Standard Headers and Node.js headers.
- **Platform Agnostic**: Can be used in Web, Desktop (Electron), and API (NestJS).

## 🛠 Usage

### HTTP Headers

```typescript
import { nodeHeadersToWebHeaders } from "@repo/utils";

// Convert Node.js IncomingHttpHeaders to Web Standard Headers
const headers = nodeHeadersToWebHeaders(nodeIncomingHeaders);
```

---

Part of the [theo](https://github.com/your-username/theo) starter template.
