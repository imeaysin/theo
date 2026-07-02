export type ClientResult<T> = {
  data: T | null
  error: { code?: string; message?: string } | null
}

export async function unwrapClientResult<T>(promise: Promise<ClientResult<T>>) {
  const { data, error } = await promise
  if (error) throw error
  return data
}
