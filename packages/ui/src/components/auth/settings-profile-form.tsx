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

export interface SettingsProfileFormProps {
  user: {
    name: string
    email: string
  }
  onUpdateProfile: (values: { name: string }) => Promise<void>
  isPending?: boolean
}

export function SettingsProfileForm({
  user,
  onUpdateProfile,
  isPending,
}: SettingsProfileFormProps) {
  const [name, setName] = useState(user.name)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      await onUpdateProfile({ name })
      setSuccess("Profile updated successfully")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
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
            <FieldLabel>Name</FieldLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
            <FieldError />
          </Field>

          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input type="email" value={user.email} disabled />
            <p className="mt-1 text-xs text-muted-foreground">
              Email cannot be changed here.
            </p>
          </Field>

          <Button type="submit" loading={isPending} className="w-fit">
            Save Changes
          </Button>
        </Form>
      </CardPanel>
    </Card>
  )
}
