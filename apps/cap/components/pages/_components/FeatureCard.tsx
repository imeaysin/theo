interface FeatureCardProps {
  title: string
  description: string
  imagePath: string
  imageAlt?: string
  bg?: string
  className?: string
  imageHeight?: string
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  imagePath,
  imageAlt,
  className,
  bg,
  imageHeight = "h-48",
}) => {
  return (
    <div
      style={{
        backgroundImage: `url(${bg})`,
      }}
      className={`relative z-10 flex h-full flex-col overflow-hidden rounded-xl border border-border bg-muted p-8 pt-0 backdrop-blur-md ${className}`}
    >
      <img
        src={imagePath}
        alt={imageAlt || title}
        className={`mt-10 mb-6 w-full rounded-lg object-contain ${imageHeight}`}
      />
      <h3 className="mb-1 text-xl leading-[1.5rem] font-semibold">{title}</h3>
      <p className="mb-0 max-w-lg text-base leading-[1.5rem] text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
