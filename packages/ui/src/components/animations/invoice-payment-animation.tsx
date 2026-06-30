"use client"

import { Badge, type BadgeProps } from "@workspace/ui/components/badge"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface Invoice {
  id: string
  customer: string
  amount: string
  dueDate: string
  invoiceDate: string
  invoiceNo: string
  status: "sent" | "paid" | "overdue" | "scheduled" | "recurring"
}

const INVOICE_STATUS_CONFIG: Record<
  Invoice["status"],
  { label: string; variant: NonNullable<BadgeProps["variant"]> }
> = {
  sent: { label: "Sent", variant: "secondary" },
  overdue: { label: "Overdue", variant: "warning" },
  scheduled: { label: "Scheduled", variant: "info" },
  recurring: { label: "Recurring", variant: "outline" },
  paid: { label: "Paid", variant: "success" },
}

function InvoiceStatusBadge({ status }: { status: Invoice["status"] }) {
  const config = INVOICE_STATUS_CONFIG[status]

  return (
    <motion.div
      key={status}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <Badge
        className="rounded-full px-1.5 py-px text-[9px] md:text-[10px]"
        size="sm"
        variant={config.variant}
      >
        {config.label}
      </Badge>
    </motion.div>
  )
}

const initialInvoices: Omit<Invoice, "status">[] = [
  {
    id: "1",
    customer: "Acme Corp",
    amount: "$2,450.50",
    dueDate: "Mar 19",
    invoiceDate: "Mar 19",
    invoiceNo: "INV-015",
  },
  {
    id: "2",
    customer: "TechFlow Inc",
    amount: "$1,850.00",
    dueDate: "Mar 18",
    invoiceDate: "Mar 18",
    invoiceNo: "INV-014",
  },
  {
    id: "3",
    customer: "Design Studio",
    amount: "$3,200.75",
    dueDate: "Mar 16",
    invoiceDate: "Mar 16",
    invoiceNo: "INV-013",
  },
  {
    id: "4",
    customer: "Cloud Services",
    amount: "$1,120.25",
    dueDate: "Mar 15",
    invoiceDate: "Mar 15",
    invoiceNo: "INV-012",
  },
  {
    id: "5",
    customer: "Data Systems",
    amount: "$4,500.00",
    dueDate: "Mar 14",
    invoiceDate: "Mar 14",
    invoiceNo: "INV-011",
  },
  {
    id: "6",
    customer: "Media Works",
    amount: "$2,100.25",
    dueDate: "Mar 13",
    invoiceDate: "Mar 13",
    invoiceNo: "INV-010",
  },
  {
    id: "7",
    customer: "Creative Labs",
    amount: "$1,750.50",
    dueDate: "Mar 12",
    invoiceDate: "Mar 12",
    invoiceNo: "INV-009",
  },
  {
    id: "8",
    customer: "Digital Solutions",
    amount: "$3,800.00",
    dueDate: "Mar 11",
    invoiceDate: "Mar 11",
    invoiceNo: "INV-008",
  },
  {
    id: "9",
    customer: "Innovation Hub",
    amount: "$2,650.00",
    dueDate: "Mar 10",
    invoiceDate: "Mar 10",
    invoiceNo: "INV-007",
  },
  {
    id: "10",
    customer: "Tech Ventures",
    amount: "$1,950.75",
    dueDate: "Mar 09",
    invoiceDate: "Mar 09",
    invoiceNo: "INV-006",
  },
  {
    id: "11",
    customer: "Studio Alpha",
    amount: "$3,400.50",
    dueDate: "Mar 08",
    invoiceDate: "Mar 08",
    invoiceNo: "INV-005",
  },
  {
    id: "12",
    customer: "Global Networks",
    amount: "$2,800.25",
    dueDate: "Mar 07",
    invoiceDate: "Mar 07",
    invoiceNo: "INV-004",
  },
  {
    id: "13",
    customer: "Future Systems",
    amount: "$1,600.00",
    dueDate: "Mar 06",
    invoiceDate: "Mar 06",
    invoiceNo: "INV-003",
  },
  {
    id: "14",
    customer: "Pixel Perfect",
    amount: "$2,300.50",
    dueDate: "Mar 05",
    invoiceDate: "Mar 05",
    invoiceNo: "INV-002",
  },
  {
    id: "15",
    customer: "Code Masters",
    amount: "$4,200.75",
    dueDate: "Mar 04",
    invoiceDate: "Mar 04",
    invoiceNo: "INV-001",
  },
]

const PAYMENT_SCORE_BARS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  filled: i < 8,
}))

export function InvoicePaymentAnimation({
  onComplete,
  shouldPlay = true,
}: {
  onComplete?: () => void
  shouldPlay?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showCards, setShowCards] = useState(false)
  const [showTable, setShowTable] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>(
    initialInvoices.map((inv) => ({ ...inv, status: "sent" as const }))
  )
  const [showPaymentScore, setShowPaymentScore] = useState(false)
  const [visibleBars, setVisibleBars] = useState<number[]>([])

  const [openAmount] = useState("$36,500.75")
  const [overdueAmount, _setOverdueAmount] = useState("$12,500.50")
  const [paidAmount, setPaidAmount] = useState("$126,500.75")
  const [openCount] = useState(6)
  const [overdueCount, setOverdueCount] = useState(12)
  const [paidCount, setPaidCount] = useState(10)

  useEffect(() => {
    if (!shouldPlay) return

    const cardsTimer = setTimeout(() => setShowCards(true), 0)

    const scoreTimer = setTimeout(() => {
      setShowPaymentScore(true)
      PAYMENT_SCORE_BARS.forEach((_, index) => {
        setTimeout(
          () => {
            setVisibleBars((prev) => [...prev, index])
          },
          900 + index * 50
        )
      })
    }, 700)

    const tableTimer = setTimeout(() => setShowTable(true), 500)

    const flipTimers: NodeJS.Timeout[] = []
    const invoiceCount = initialInvoices.length
    const overdueIndices = [2, 7]
    const scheduledIndices = [1]
    const recurringIndices = [4]
    let paidCount = 0
    let paidTotal = 0

    initialInvoices.forEach((invoice, index) => {
      const timer = setTimeout(
        () => {
          const isOverdue = overdueIndices.includes(index)
          const isScheduled = scheduledIndices.includes(index)
          const isRecurring = recurringIndices.includes(index)
          let newStatus: "paid" | "overdue" | "scheduled" | "recurring"

          if (isOverdue) {
            newStatus = "overdue"
          } else if (isScheduled) {
            newStatus = "scheduled"
          } else if (isRecurring) {
            newStatus = "recurring"
          } else {
            newStatus = "paid"
          }

          setInvoices((prev) =>
            prev.map((inv, idx) =>
              idx === index ? { ...inv, status: newStatus } : inv
            )
          )

          if (isOverdue) {
            setOverdueCount((prev) => prev + 1)
          } else if (!isScheduled && !isRecurring) {
            paidCount++
            paidTotal += Number.parseFloat(
              invoice.amount.replace(/[^0-9.]/g, "")
            )
          }

          if (index === invoiceCount - 1) {
            setPaidCount((prev) => prev + paidCount)
            setPaidAmount((prev) => {
              const current = Number.parseFloat(prev.replace(/[^0-9.]/g, ""))
              return `$${(current + paidTotal).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            })
          }
        },
        2000 + index * 400
      )
      flipTimers.push(timer)
    })

    const doneTimer = onComplete
      ? setTimeout(() => {
          onComplete()
        }, 15000)
      : undefined

    return () => {
      clearTimeout(cardsTimer)
      clearTimeout(scoreTimer)
      clearTimeout(tableTimer)
      flipTimers.forEach(clearTimeout)
      if (doneTimer) clearTimeout(doneTimer)
    }
  }, [shouldPlay, onComplete])

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="relative z-10 border-b border-border px-2 pt-3 pb-2 md:px-3 md:pt-4 md:pb-3">
        <h3 className="text-[13px] text-foreground md:text-[14px]">Invoices</h3>
      </div>

      {/* Main content area */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Status Cards */}
        {showCards && (
          <div className="grid grid-cols-2 gap-3 pt-4 pb-4 md:gap-4 md:pt-6 md:pb-6">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-border bg-background p-3 md:p-4"
            >
              <div className="mb-1 font-serif text-base text-foreground md:mb-1.5 md:text-lg">
                {openAmount}
              </div>
              <div className="mb-1 font-sans text-[10px] text-foreground md:mb-1.5 md:text-xs">
                Open
              </div>
              <div className="font-sans text-[9px] text-muted-foreground md:text-[10px]">
                {openCount} invoices
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="border border-border bg-background p-3 md:p-4"
            >
              <div className="mb-1 font-serif text-base text-foreground md:mb-1.5 md:text-lg">
                {overdueAmount}
              </div>
              <div className="mb-1 font-sans text-[10px] text-foreground md:mb-1.5 md:text-xs">
                Overdue
              </div>
              <div className="font-sans text-[9px] text-muted-foreground md:text-[10px]">
                {overdueCount} invoices
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="border border-border bg-background p-3 md:p-4"
            >
              <div className="mb-1 font-serif text-base text-foreground md:mb-1.5 md:text-lg">
                {paidAmount}
              </div>
              <div className="mb-1 font-sans text-[10px] text-foreground md:mb-1.5 md:text-xs">
                Paid
              </div>
              <div className="font-sans text-[9px] text-muted-foreground md:text-[10px]">
                {paidCount} invoices
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="border border-border bg-background p-3 md:p-4"
            >
              <div className="mb-1.5 flex items-center justify-between md:mb-2">
                <div className="font-serif text-base text-foreground md:text-lg">
                  Good
                </div>
                {showPaymentScore && (
                  <div className="flex items-end gap-1 md:gap-1">
                    {PAYMENT_SCORE_BARS.map((bar, index) => (
                      <motion.div
                        key={bar.id}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: visibleBars.includes(index) ? "18px" : 0,
                          opacity: visibleBars.includes(index) ? 1 : 0,
                        }}
                        transition={{
                          duration: 0.2,
                          delay: index * 0.05,
                          ease: "easeOut",
                        }}
                        className={`w-[2px] md:w-[3px] ${
                          bar.filled ? "bg-foreground" : "bg-muted-foreground"
                        }`}
                        style={{ minHeight: "18px" }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-1.5 font-sans text-[10px] text-foreground md:mb-2 md:text-xs">
                Payment score
              </div>
              <div className="font-sans text-[9px] text-muted-foreground md:text-[10px]">
                Right on schedule
              </div>
            </motion.div>
          </div>
        )}

        {/* Table */}
        {showTable && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="min-h-0 flex-1 overflow-hidden border border-border bg-background"
          >
            <table
              className="w-full border-collapse"
              style={{ borderSpacing: 0 }}
            >
              <thead className="sticky top-0 z-10 border-b border-border bg-secondary">
                <tr className="h-[28px] md:h-[32px]">
                  <th className="w-[75px] border-r border-border px-1.5 text-left text-[10px] font-medium text-muted-foreground md:w-[70px] md:px-2 md:text-[11px]">
                    Due date
                  </th>
                  <th className="w-[140px] border-r border-border px-1.5 text-left text-[10px] font-medium text-muted-foreground md:w-[170px] md:px-2 md:text-[11px]">
                    Customer
                  </th>
                  <th className="w-[90px] border-r border-border px-1.5 text-left text-[10px] font-medium text-muted-foreground md:w-[100px] md:px-2 md:text-[11px]">
                    Amount
                  </th>
                  <th className="hidden w-[90px] border-r border-border px-1.5 text-left text-[10px] font-medium text-muted-foreground md:table-cell md:w-[100px] md:px-2 md:text-[11px] lg:hidden">
                    Invoice no.
                  </th>
                  <th className="w-[115px] px-1.5 text-left text-[10px] font-medium text-muted-foreground md:w-[110px] md:px-2 md:text-[11px]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, index) => (
                  <motion.tr
                    key={invoice.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: showTable ? 1 : 0,
                      y: showTable ? 0 : 10,
                    }}
                    transition={{
                      duration: 0.3,
                      delay: 0.5 + index * 0.08,
                      ease: "easeOut",
                    }}
                    className="h-[28px] border-b border-border bg-background transition-colors hover:bg-secondary md:h-[32px]"
                  >
                    <td className="w-[75px] border-r border-border px-1.5 text-[10px] text-muted-foreground md:w-[70px] md:px-2 md:text-[11px]">
                      {invoice.dueDate}
                    </td>
                    <td className="w-[140px] border-r border-border px-1.5 text-[10px] text-foreground md:w-[170px] md:px-2 md:text-[11px]">
                      <div className="truncate" title={invoice.customer}>
                        {invoice.customer}
                      </div>
                    </td>
                    <td className="w-[90px] border-r border-border px-1.5 text-[10px] text-foreground md:w-[100px] md:px-2 md:text-[11px]">
                      {invoice.amount}
                    </td>
                    <td className="hidden w-[90px] border-r border-border px-1.5 text-[10px] text-foreground md:table-cell md:w-[100px] md:px-2 md:text-[11px] lg:hidden">
                      {invoice.invoiceNo}
                    </td>
                    <td className="w-[115px] px-1.5 md:w-[110px] md:px-2">
                      <div className="flex h-full items-center">
                        <AnimatePresence mode="wait">
                          <InvoiceStatusBadge status={invoice.status} />
                        </AnimatePresence>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  )
}
