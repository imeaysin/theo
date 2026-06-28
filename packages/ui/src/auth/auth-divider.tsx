export function AuthDivider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-background px-2 font-sans text-muted-foreground">
          or
        </span>
      </div>
    </div>
  )
}
