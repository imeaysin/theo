import { useRef, useState, type ChangeEvent } from "react"
import type { UploadResponse } from "@workspace/contracts"
import { UPLOAD_MAX_BYTES } from "@workspace/contracts"
import { Button } from "@workspace/ui-shadcn/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui-shadcn/components/card"
import { Input } from "@workspace/ui-shadcn/components/input"
import { UploadIcon } from "lucide-react"
import { useUploadFileMutation } from "@/features/uploads/hooks/use-upload"

export function UploadsPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const uploadFile = useUploadFileMutation()
  const [lastUpload, setLastUpload] = useState<UploadResponse | null>(null)
  const [selectedName, setSelectedName] = useState<string | null>(null)

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    setSelectedName(file?.name ?? null)
    setLastUpload(null)
  }

  async function onUpload() {
    const file = inputRef.current?.files?.[0]
    if (!file) return

    if (file.size > UPLOAD_MAX_BYTES) {
      uploadFile.reset()
      return
    }

    const result = await uploadFile.mutateAsync(file)
    setLastUpload(result)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
    setSelectedName(null)
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Uploads</h2>
          <p className="text-muted-foreground">
            Upload files to the API (max 5 MB). Uses local storage in dev.
          </p>
        </div>
      </div>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UploadIcon className="size-4" aria-hidden />
            Upload a file
          </CardTitle>
          <CardDescription>
            Second reference feature — multipart POST to{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              /v1/uploads
            </code>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            ref={inputRef}
            type="file"
            accept="image/*,.pdf,.txt"
            onChange={onFileChange}
          />
          {selectedName ? (
            <p className="text-sm text-muted-foreground">
              Selected: {selectedName}
            </p>
          ) : null}
          <Button
            type="button"
            disabled={!selectedName || uploadFile.isPending}
            onClick={() => void onUpload()}
          >
            Upload
          </Button>
          {lastUpload ? (
            <div className="rounded-lg border bg-muted/40 p-3 text-sm">
              <p className="font-medium">Last upload</p>
              <p className="mt-1 break-all text-muted-foreground">
                Path: {lastUpload.path}
              </p>
              <a
                className="mt-2 inline-block text-primary underline-offset-4 hover:underline"
                href={lastUpload.url}
                rel="noreferrer"
                target="_blank"
              >
                Open file
              </a>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
