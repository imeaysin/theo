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
import { Checkbox } from "@workspace/ui/components/checkbox"

export interface ChangePasswordFormProps {
  onChangePassword: (values: {
    currentPassword?: string
    newPassword: string
    revokeOtherSessions?: boolean
  }) => Promise<void>
  isPending?: boolean
}

export function ChangePasswordForm({
  onChangePassword,
  isPending,
}: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(true)
  
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!newPassword) {
      setError("Please enter a new password.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.")
      return
    }

    try {
      await onChangePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions,
      })
      setSuccess("Your password has been changed successfully.")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your password to keep your account secure</CardDescription>
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
            <FieldLabel>Current Password</FieldLabel>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isPending}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Leave blank if you signed in with a magic link or social provider.
            </p>
          </Field>

          <Field>
            <FieldLabel>New Password</FieldLabel>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isPending}
              required
            />
            <FieldError />
          </Field>

          <Field>
            <FieldLabel>Confirm New Password</FieldLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isPending}
              required
            />
            <FieldError />
          </Field>

          <Field className="flex flex-row items-start gap-3 space-y-0 rounded-md border p-4">
            <Checkbox
              checked={revokeOtherSessions}
              onCheckedChange={(checked) =>
                setRevokeOtherSessions(checked)
              }
              disabled={isPending}
            />
            <div className="space-y-1 leading-none">
              <FieldLabel>Sign out of other devices</FieldLabel>
              <p className="text-sm text-muted-foreground">
                This will end all of your other active sessions.
              </p>
            </div>
          </Field>

          <Button type="submit" loading={isPending} className="w-fit">
            Update Password
          </Button>
        </Form>
      </CardPanel>
    </Card>
  )
}
