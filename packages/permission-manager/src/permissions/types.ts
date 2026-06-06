import type { statement } from "./config"

export type Permission = {
  [R in keyof typeof statement]?: (typeof statement)[R][number][]
}
