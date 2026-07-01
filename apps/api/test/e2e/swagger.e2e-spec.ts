import { type INestApplication } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { cleanupOpenApiDoc } from "nestjs-zod"
import { createE2eApp } from "./support/create-e2e-app"

function getJsonSchemaRef(ref: unknown): string | undefined {
  if (!ref || typeof ref !== "object" || !("$ref" in ref)) return undefined
  const value = (ref as { $ref?: unknown }).$ref
  return typeof value === "string" ? value : undefined
}

function getSchemaByRef(
  document: ReturnType<typeof cleanupOpenApiDoc>,
  ref?: string
) {
  if (!ref) return undefined
  const name = ref.replace("#/components/schemas/", "")
  return document.components?.schemas?.[name]
}

describe("Swagger (e2e)", () => {
  let app: INestApplication
  let document: ReturnType<typeof cleanupOpenApiDoc>

  beforeAll(async () => {
    ;({ app } = await createE2eApp())

    const config = new DocumentBuilder().setTitle("API").setVersion("1").build()
    document = cleanupOpenApiDoc(SwaggerModule.createDocument(app, config))
  })

  afterAll(async () => {
    await app.close()
  })

  it("registers operations for all controller tags", () => {
    const operationTags = Object.values(document.paths).flatMap((pathItem) =>
      Object.values(pathItem ?? {}).flatMap((operation) =>
        operation && "tags" in operation ? (operation.tags ?? []) : []
      )
    )
    expect(operationTags).toEqual(
      expect.arrayContaining(["notes", "uploads", "account", "health", "root"])
    )
  })

  it("documents notes request bodies with Zod metadata", () => {
    const createNote = document.paths["/v1/notes"]?.post
    const requestBody = createNote?.requestBody
    expect(requestBody && "content" in requestBody).toBe(true)
    if (!requestBody || !("content" in requestBody)) return

    const requestSchema = getSchemaByRef(
      document,
      getJsonSchemaRef(requestBody.content?.["application/json"]?.schema)
    )
    expect(requestSchema).toMatchObject({
      description: "Payload to create a new note.",
      properties: expect.objectContaining({
        title: expect.objectContaining({
          description: "Short title for the note",
        }),
      }),
    })
  })

  it("documents notes responses with the success envelope", () => {
    const listNotes = document.paths["/v1/notes"]?.get
    const response200 = listNotes?.responses?.["200"]
    expect(response200 && "content" in response200).toBe(true)
    if (!response200 || !("content" in response200)) return

    const envelopeSchema = getSchemaByRef(
      document,
      getJsonSchemaRef(response200.content?.["application/json"]?.schema)
    )
    expect(envelopeSchema).toMatchObject({
      description: "Standard API envelope containing the notes list.",
      properties: expect.objectContaining({
        success: expect.any(Object),
        statusCode: expect.any(Object),
        message: expect.any(Object),
        data: expect.any(Object),
        timestamp: expect.any(Object),
      }),
    })
  })

  it("documents standard error responses on notes routes", () => {
    const listNotes = document.paths["/v1/notes"]?.get
    expect(listNotes?.responses?.["400"]).toBeDefined()
    expect(listNotes?.responses?.["401"]).toBeDefined()
    expect(listNotes?.responses?.["500"]).toBeDefined()
  })

  it("documents delete note as 204 without a body", () => {
    const removeNote = document.paths["/v1/notes/{id}"]?.delete
    expect(removeNote?.responses?.["204"]).toBeDefined()
    expect(removeNote?.responses?.["200"]).toBeUndefined()
  })

  it("documents upload, me, health, and root responses", () => {
    expect(
      document.paths["/v1/uploads"]?.post?.responses?.["201"]
    ).toBeDefined()
    expect(document.paths["/v1/me"]?.get?.responses?.["200"]).toBeDefined()
    expect(document.paths["/v1/health"]?.get?.responses?.["200"]).toBeDefined()
    expect(document.paths["/"]?.get?.responses?.["200"]).toBeDefined()
  })
})
