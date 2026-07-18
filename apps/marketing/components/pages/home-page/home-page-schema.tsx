import { homeContent } from "@/content/home"
import { testimonials } from "@/content/testimonials"
import {
  createBreadcrumbSchema,
  createFAQSchema,
  createOrganizationSchema,
  createProductSchema,
  createSoftwareApplicationSchema,
  createWebSiteSchema,
} from "@/utils/web-schema"
import { productConfig } from "@workspace/config/public"

const createHomePageSchema = () => {
  const schemas = [
    createOrganizationSchema(),
    createWebSiteSchema(),
    createSoftwareApplicationSchema(testimonials),
    createProductSchema(),
    createBreadcrumbSchema([{ name: "Home", url: productConfig.siteUrl }]),
    createFAQSchema(
      homeContent.faq.items.map((item) => ({
        question: item.question,
        answer: item.answer,
      }))
    ),
  ]

  return JSON.stringify(schemas)
}

export const HomePageSchema = () => {
  return <script type="application/ld+json">{createHomePageSchema()}</script>
}
