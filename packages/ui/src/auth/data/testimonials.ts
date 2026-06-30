export interface AuthTestimonial {
  name: string
  title: string
  firstPart: string
  secondPart: string
}

export const authTestimonials: AuthTestimonial[] = [
  {
    name: "Paweł Michalski",
    title: "VC leaders • Poland",
    firstPart:
      "Due to improved invoice reconciliation, we are now saving 1-2 man-days each month",
    secondPart:
      ", and we have a better understanding of our finances thanks to dashboards.",
  },
  {
    name: "Guy Solan",
    title: "Thetis Medical • United Kingdom",
    firstPart:
      "Without Theo I would've sold my company and lost loads of money",
    secondPart:
      ". I never had the time to learn Quickbooks or Xero so had no idea what the company cash was doing without ringing up my accountant.",
  },
  {
    name: "Facu Montanaro",
    title: "Kundo Studio • Argentina",
    firstPart: "It has completely transformed how I manage my day-to-day tasks",
    secondPart:
      ". From generating invoices to tracking projects and having all the information centralized in one place, the change has been remarkable.",
  },
  {
    name: "Richard Poelderl",
    title: "Conduct.bln • Germany",
    firstPart:
      "I prefer to have one tool for finances, similar to what Deel is for HR",
    secondPart:
      ". Theo helped me find a compromise with my tax advisor: I'm not using one of his supported clunky tools but an actually UX-friendly tool and can provide him with acceptable .csv. That's a big one!",
  },
]
