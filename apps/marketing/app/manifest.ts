import { productConfig } from "@workspace/config/public"
import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: productConfig.name,
    short_name: productConfig.shortName,
    description: productConfig.description,
    start_url: "/",
    display: "standalone",
  }
}
