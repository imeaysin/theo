export interface AuthPageHeaderProps {
  title: string
  description?: string
}

export function AuthPageHeader({ title, description }: AuthPageHeaderProps) {
  return (
    <div className="space-y-2 text-center">
      <h1 className="mb-4 font-serif text-lg lg:text-xl">{title}</h1>
      {description ? (
        <p className="font-sans text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}
