import type { NextFunction, Request, Response } from "express"
import {
  LocalStorageAdapter,
  normalizeStoragePath,
  type LocalStorageConfig,
} from "@workspace/storage"

/**
 * Serves local files at `/uploads` only when `exp` + `sig` query params verify.
 */
export function createLocalDownloadMiddleware(config: LocalStorageConfig) {
  const adapter = new LocalStorageAdapter(config)

  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.status(405).end()
      return
    }

    const relativePath = normalizeStoragePath(
      decodeURIComponent(req.path.replace(/^\/+/, ""))
    )

    if (!relativePath) {
      res.status(404).end()
      return
    }

    const exp = req.query.exp
    const sig = req.query.sig
    if (typeof exp !== "string" || typeof sig !== "string") {
      res.status(403).json({ message: "Missing download signature" })
      return
    }

    let absolutePath: string
    try {
      if (!adapter.verifyDownloadSignature(relativePath, exp, sig)) {
        res
          .status(403)
          .json({ message: "Invalid or expired download signature" })
        return
      }
      absolutePath = adapter.absolutePath(relativePath)
    } catch {
      res.status(404).end()
      return
    }

    res.sendFile(absolutePath, (err) => {
      if (!err) return
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        res.status(404).end()
        return
      }
      next(err)
    })
  }
}
