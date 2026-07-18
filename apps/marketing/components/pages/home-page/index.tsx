import {
  DeferredHomepageClosingSections,
  DeferredHomepageSections,
} from "./deferred-homepage-sections"
import Faq from "./faq"
import Header from "./header"
import { HomePageSchema } from "./home-page-schema"

interface HomePageProps {
  serverHomepageCopyVariant?: string
}

export function HomePage({ serverHomepageCopyVariant = "" }: HomePageProps) {
  return (
    <>
      <HomePageSchema />
      <Header serverHomepageCopyVariant={serverHomepageCopyVariant} />
      <DeferredHomepageSections />
      <div className="mt-20 sm:mt-[120px] lg:mt-[180px]">
        <Faq />
      </div>
      <DeferredHomepageClosingSections />
    </>
  )
}
