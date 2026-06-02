import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"
import { TextField, Label, Input, FieldError } from "@workspace/hero-ui"

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  type?: "text" | "email" | "password" | "number" | "tel" | "url"
  placeholder?: string
  autoComplete?: string
  disabled?: boolean
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  disabled,
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          name={name}
          type={type}
          isInvalid={fieldState.invalid}
          isDisabled={disabled}
          className="w-full"
        >
          <Label>{label}</Label>
          <Input placeholder={placeholder} autoComplete={autoComplete} />
          {fieldState.error?.message ? (
            <FieldError>{fieldState.error.message}</FieldError>
          ) : null}
        </TextField>
      )}
    />
  )
}
