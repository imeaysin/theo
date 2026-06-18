import type { statement } from "./statement"

export type Permission = {
  [R in keyof typeof statement]?: (typeof statement)[R][number][]
}
