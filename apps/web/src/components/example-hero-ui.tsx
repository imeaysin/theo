/**
 * Example component demonstrating HeroUI v3 usage
 * This shows the compound component pattern and semantic variants
 */

import { Button, Card } from "@workspace/hero-ui"

export function ExampleHeroUI() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-8">
      <h1 className="text-3xl font-bold">HeroUI v3 Example</h1>

      {/* Card with compound components */}
      <Card>
        <Card.Header>
          <Card.Title>Welcome to HeroUI v3</Card.Title>
          <Card.Description>
            This is an example of the compound component pattern used in HeroUI
            v3
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <p className="mb-4">
            HeroUI v3 uses compound components for better composition and
            flexibility. Notice how we use Card.Header, Card.Title, etc. instead
            of flat props.
          </p>

          {/* Semantic variants - use onPress instead of onClick */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onPress={() => console.log("Primary action")}
            >
              Primary Action
            </Button>

            <Button
              variant="secondary"
              onPress={() => console.log("Secondary action")}
            >
              Secondary Action
            </Button>

            <Button
              variant="tertiary"
              onPress={() => console.log("Tertiary action")}
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              onPress={() => console.log("Danger action")}
            >
              Delete
            </Button>

            <Button variant="ghost" onPress={() => console.log("Ghost action")}>
              Ghost
            </Button>

            <Button
              variant="outline"
              onPress={() => console.log("Outline action")}
            >
              Outline
            </Button>
          </div>
        </Card.Content>
        <Card.Footer>
          <p className="text-sm text-gray-500">
            Pro tip: Use semantic variants (primary, secondary, etc.) instead of
            color names
          </p>
        </Card.Footer>
      </Card>

      {/* Another card showing key features */}
      <Card>
        <Card.Header>
          <Card.Title>Key Features of HeroUI v3</Card.Title>
        </Card.Header>
        <Card.Content>
          <ul className="list-inside list-disc space-y-2">
            <li>No provider needed (removed in v3)</li>
            <li>Compound component pattern for better composition</li>
            <li>Use onPress instead of onClick for better accessibility</li>
            <li>Tailwind CSS v4 required</li>
            <li>CSS-based animations (no framer-motion)</li>
            <li>OKLCH color space for better theming</li>
            <li>Semantic variants over color names</li>
          </ul>
        </Card.Content>
      </Card>
    </div>
  )
}
