import { faHeart } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { homeContent } from "@/content/home"
import { CommercialCard } from "./commercial-card"
import { ProCard } from "./pro-card"

export { CommercialCard } from "./commercial-card"
export { ProCard } from "./pro-card"

const Pricing = () => {
  return (
    <div className="mx-auto w-full max-w-[960px] px-5">
      <div className="mb-14 px-5 text-center">
        <h2 className="mb-3 w-full text-4xl font-medium tracking-tight text-foreground">
          {homeContent.pricing.title}
        </h2>
        <p className="mx-auto w-full max-w-[640px] text-lg leading-[1.75rem] text-muted-foreground">
          {homeContent.pricing.subtitle}
        </p>
        <div className="mx-auto mt-6 flex w-fit items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2.5">
          <FontAwesomeIcon
            className="size-3.5 text-destructive"
            icon={faHeart}
          />
          <p className="font-medium text-foreground">
            {homeContent.pricing.lovedBy}
          </p>
        </div>
      </div>
      <div className="grid items-stretch gap-6 pt-3 md:grid-cols-2">
        <CommercialCard />
        <ProCard />
      </div>
    </div>
  )
}

export default Pricing
