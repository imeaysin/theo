export interface AuthPageHeaderProps {
  title: string
  description?: string
}

export function AuthPageHeader({ title, description }: AuthPageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 text-center">
      <h1 className="font-heading text-lg tracking-wide lg:text-xl">{title}</h1>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}
