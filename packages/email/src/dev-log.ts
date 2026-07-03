type DevEmailPayload = {
  to: string
  subject: string
  lines: string[]
}

export function logDevEmail({ to, subject, lines }: DevEmailPayload) {
  const body = lines.join("\n")
  console.info(`[email:dev] To: ${to}\nSubject: ${subject}\n${body}\n---`)
}
