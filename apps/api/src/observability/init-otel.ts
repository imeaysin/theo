import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { NodeSDK } from "@opentelemetry/sdk-node"
import { env } from "@workspace/config"
import { isOtelEnabled } from "./enabled"

let sdk: NodeSDK | undefined

export function initOtel(): void {
  if (!isOtelEnabled()) return

  sdk = new NodeSDK({
    serviceName: env.OTEL_SERVICE_NAME,
    traceExporter: new OTLPTraceExporter({
      url: env.OTEL_EXPORTER_OTLP_ENDPOINT,
    }),
    instrumentations: [getNodeAutoInstrumentations()],
  })

  sdk.start()

  const shutdown = () => {
    void sdk?.shutdown()
  }

  process.once("SIGTERM", shutdown)
  process.once("SIGINT", shutdown)
}
