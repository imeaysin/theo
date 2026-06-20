"use client"

import { useState } from "react"
import type * as React from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@workspace/ui/components/card"
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field"
import { Form } from "@workspace/ui/components/form"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"

export interface ChangeEmailFormProps {
  currentEmail: string
  onChangeEmail: (values: {
    newEmail: string
    callbackURL: string
  }) => Promise<void>
  isPending?: boolean
}

export function ChangeEmailForm({
  currentEmail,
  onChangeEmail,
  isPending,
}: ChangeEmailFormProps) {
  const [newEmail, setNewEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!newEmail) {
      setError("Please enter a new email address.")
      return
    }

    if (newEmail === currentEmail) {
      setError("New email must be different from the current email.")
      return
    }

    try {
      await onChangeEmail({
        newEmail,
        callbackURL: window.location.href,
      })
      setSuccess("A verification link has been sent to your new email address.")
      setNewEmail("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change email")
    }
  }

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Change Email</CardTitle>
        <CardDescription>Update your email address</CardDescription>
      </CardHeader>
      <CardPanel>
        <Form
          onSubmit={handleSubmit}
          className="flex w-full max-w-md flex-col gap-4"
        >
          {error && (
            <Alert variant="error">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="success">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Field>
            <FieldLabel>Current Email</FieldLabel>
            <Input type="email" value={currentEmail} disabled />
          </Field>

          <Field>
            <FieldLabel>New Email</FieldLabel>
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={isPending}
              placeholder="new@example.com"
            />
            <FieldError />
          </Field>

          <Button type="submit" loading={isPending} className="w-fit">
            Change Email
          </Button>
        </Form>
      </CardPanel>
    </Card>
  )
}
