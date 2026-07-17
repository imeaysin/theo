"use client"

import { Button } from "@/components/product-ui"
import { useId, useState } from "react"
import { toast } from "sonner"

export const LicenseDeactivationPage = () => {
  const licenseKeyId = useId()
  const emailId = useId()
  const [licenseKey, setLicenseKey] = useState("")
  const [email, setEmail] = useState("")
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!licenseKey.trim() || !email.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    toast.info("License deactivation is unavailable in this UI-only build.")
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-32 sm:px-8 md:py-40">
      <div className="mb-14 text-center">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Deactivate License
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Enter your license key and purchase email to deactivate your Theo
          commercial license from its current device.
        </p>
      </div>
      <div className="mx-auto max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label
              htmlFor={licenseKeyId}
              className="mb-2 block text-sm font-medium text-muted-foreground"
            >
              License Key
            </label>
            <input
              type="text"
              id={licenseKeyId}
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              className="ring-offset-gray-3 flex h-[44px] w-full rounded-xl border border-border bg-muted px-4 text-base font-thin text-muted-foreground ring-0 ring-ring outline-0 transition-all duration-200 placeholder:text-muted-foreground placeholder:transition-all placeholder:duration-200 autofill:bg-muted hover:border-border hover:bg-muted hover:placeholder:text-muted-foreground focus:border-border focus:bg-muted focus:ring-1 focus:ring-ring focus:ring-offset-2 md:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor={emailId}
              className="mb-2 block text-sm font-medium text-muted-foreground"
            >
              Purchase Email
            </label>
            <input
              type="email"
              id={emailId}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="ring-offset-gray-3 flex h-[44px] w-full rounded-xl border border-border bg-muted px-4 text-base font-thin text-muted-foreground ring-0 ring-ring outline-0 transition-all duration-200 placeholder:text-muted-foreground placeholder:transition-all placeholder:duration-200 autofill:bg-muted hover:border-border hover:bg-muted hover:placeholder:text-muted-foreground focus:border-border focus:bg-muted focus:ring-1 focus:ring-ring focus:ring-offset-2 md:text-sm"
            />
          </div>
          <Button type="submit" variant="primary" className="w-full">
            Deactivate License
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          After deactivating, you can activate your license on a different
          device.
        </p>
      </div>
    </div>
  )
}
