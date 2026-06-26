"use client"

import Image from "next/image"
import Link from "next/link"
import { MaterialIcon } from "@workspace/ui/components/material-icon"

export function PreAccountingSection() {
  return (
    <section className="bg-background py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-12 space-y-4 text-center">
          <div className="relative mx-auto mb-8 h-[100px] w-28">
            <Image
              src="/images/accounting-light.png"
              alt="Accounting Icon"
              width={112}
              height={100}
              className="h-full w-full rounded-none object-contain dark:hidden"
            />
            <Image
              src="/images/accounting-dark.png"
              alt="Accounting Icon"
              width={112}
              height={100}
              className="hidden h-full w-full rounded-none object-contain dark:block"
            />
          </div>
          <h2 className="font-serif text-2xl text-foreground sm:text-2xl">
            Ready for accounting, without extra work
          </h2>
          <p className="mx-auto hidden max-w-2xl font-sans text-base leading-normal text-muted-foreground sm:block">
            Receipts, invoices, and transactions stay organized automatically so
            your books are always ready when you need them.
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <Link
            href="/pre-accounting"
            className="block cursor-pointer transition-opacity hover:opacity-90"
          >
            <div className="relative border border-border bg-secondary p-6">
              <div className="space-y-6">
                {/* Section 1 */}
                <div className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center border border-border bg-secondary">
                    <MaterialIcon
                      name="check"
                      className="text-foreground"
                      size={14}
                    />
                  </div>
                  <span className="font-sans text-sm text-foreground">
                    <span className="sm:hidden">
                      Transactions from 25,000+ banks
                    </span>
                    <span className="hidden sm:inline">
                      Transactions from 25,000+ banks are categorized and
                      reconciled automatically
                    </span>
                  </span>
                </div>

                {/* Section 2 */}
                <div className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center border border-border bg-secondary">
                    <MaterialIcon
                      name="check"
                      className="text-foreground"
                      size={14}
                    />
                  </div>
                  <span className="font-sans text-sm text-foreground">
                    <span className="sm:hidden">
                      Receipts pulled from email and uploads
                    </span>
                    <span className="hidden sm:inline">
                      Receipts and invoices are pulled from email and payments,
                      then matched to transactions
                    </span>
                  </span>
                </div>

                {/* Section 3 */}
                <div className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center border border-border bg-secondary">
                    <MaterialIcon
                      name="check"
                      className="text-foreground"
                      size={14}
                    />
                  </div>
                  <span className="font-sans text-sm text-foreground">
                    Clean records across all connected accounts
                  </span>
                </div>

                {/* Section 4 */}
                <div className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center border border-border bg-secondary">
                    <MaterialIcon
                      name="check"
                      className="text-foreground"
                      size={14}
                    />
                  </div>
                  <span className="font-sans text-sm text-foreground">
                    <span className="sm:hidden">
                      Taxes tracked per transaction
                    </span>
                    <span className="hidden sm:inline">
                      Taxes are tracked per transaction
                    </span>
                  </span>
                </div>

                {/* Section 5 */}
                <div className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center border border-border bg-secondary">
                    <MaterialIcon
                      name="check"
                      className="text-foreground"
                      size={14}
                    />
                  </div>
                  <span className="font-sans text-sm text-foreground">
                    <span className="sm:hidden">
                      Ready to export to your accounting system
                    </span>
                    <span className="hidden sm:inline">
                      Export-ready for your accounting system
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/pre-accounting"
            className="font-sans text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Learn more about pre-accounting
          </Link>
        </div>
      </div>
    </section>
  )
}
