import * as React from "react"
import { PageError } from "@/components/page-error"

type State = { error: Error | null }

export class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  reset = () => this.setState({ error: null })

  render() {
    if (this.state.error) {
      return <PageError onRetry={this.reset} />
    }
    return this.props.children
  }
}
