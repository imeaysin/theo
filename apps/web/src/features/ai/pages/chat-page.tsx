import { useChat } from "@ai-sdk/react"
import { Chat } from "@workspace/ui/components/ai/chat"
import { ShellMain } from "@workspace/ui/components/shell"

export function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({
      api: "/api/ai/chat",
    })

  return (
    <ShellMain
      header={{
        heading: "AI Assistant",
        subtitle:
          "Chat with our intelligent assistant to get help with your tasks.",
      }}
      contentClassName="flex-1 flex flex-col min-h-0"
    >
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
        <Chat
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isGenerating={isLoading}
          stop={stop}
          className="h-full p-4"
        />
      </div>
    </ShellMain>
  )
}
