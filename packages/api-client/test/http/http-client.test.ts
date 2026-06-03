import { describe, expect, it, vi } from "vitest"
import { z } from "zod"
import { HttpClient } from "@src/http/http-client"
import { ApiError } from "@src/lib/errors"

describe("HttpClient", () => {
  it("calls fetch with /api prefix and session credentials", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: "u1", ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    )

    const client = new HttpClient({
      baseUrl: "http://localhost:4000",
      fetch: fetchMock,
      credentials: "include",
    })

    const schema = z.object({ id: z.string(), ok: z.boolean() })
    const data = await client.get("/users/me", schema)

    expect(data).toEqual({ id: "u1", ok: true })
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:4000/api/users/me",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
      })
    )
  })

  it("sends Cookie header when getCookieHeader is set", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    )

    const client = new HttpClient({
      baseUrl: "http://localhost:4000/api",
      fetch: fetchMock,
      credentials: "omit",
      getCookieHeader: () => "theo.session_token=abc",
    })

    await client.get("/users/me", z.object({ ok: z.boolean() }))

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(init.headers).toMatchObject({
      Cookie: "theo.session_token=abc",
    })
  })

  it("throws ApiError on non-2xx responses", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ statusCode: 403, message: "Forbidden" }), {
        status: 403,
        statusText: "Forbidden",
      })
    )

    const client = new HttpClient({
      baseUrl: "http://localhost:4000",
      fetch: fetchMock,
    })

    await expect(
      client.get("/users", z.array(z.object({ id: z.string() })))
    ).rejects.toBeInstanceOf(ApiError)
  })
})
