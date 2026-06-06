import type { statement } from "./config.js"

export type Permission = {
  [R in keyof typeof statement]?: (typeof statement)[R][number][]
}
