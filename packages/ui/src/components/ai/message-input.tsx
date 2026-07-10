"use client"

import React, { useEffect, useRef, useState } from "react"
import { ArrowUp, Info, Loader2, Mic, Paperclip, Square } from "lucide-react"
import { omit } from "remeda"

import { cn } from "@workspace/ui/lib/utils"
import { useAudioRecording } from "@workspace/ui/hooks/use-audio-recording"
import { useAutosizeTextArea } from "@workspace/ui/hooks/use-autosize-textarea"
import { AudioVisualizer } from "@workspace/ui/components/ai/audio-visualizer"
import { Button } from "@workspace/ui/components/button"
import { FilePreview } from "@workspace/ui/components/ai/file-preview"
import { InterruptPrompt } from "@workspace/ui/components/ai/interrupt-prompt"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
  InputGroupText,
} from "@workspace/ui/components/input-group"
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"

interface MessageInputBaseProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string
  submitOnEnter?: boolean
  stop?: () => void
  isGenerating: boolean
  enableInterrupt?: boolean
  transcribeAudio?: (blob: Blob) => Promise<string>
}

interface MessageInputWithoutAttachmentProps extends MessageInputBaseProps {
  allowAttachments?: false
}

interface MessageInputWithAttachmentsProps extends MessageInputBaseProps {
  allowAttachments: true
  files: File[] | null
  setFiles: React.Dispatch<React.SetStateAction<File[] | null>>
}

type MessageInputProps =
  MessageInputWithoutAttachmentProps | MessageInputWithAttachmentsProps

export function MessageInput({
  placeholder = "Ask AI...",
  className,
  onKeyDown: onKeyDownProp,
  submitOnEnter = true,
  stop,
  isGenerating,
  enableInterrupt = true,
  transcribeAudio,
  ...props
}: MessageInputProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [showInterruptPrompt, setShowInterruptPrompt] = useState(false)

  const {
    isListening,
    isSpeechSupported,
    isRecording,
    isTranscribing,
    audioStream,
    toggleListening,
    stopRecording,
  } = useAudioRecording({
    transcribeAudio,
    onTranscriptionComplete: (text) => {
      if (textAreaRef.current) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value"
        )?.set
        nativeInputValueSetter?.call(textAreaRef.current, text)
        const event = new Event("input", { bubbles: true })
        textAreaRef.current.dispatchEvent(event)
      }
    },
  })

  const [prevIsGenerating, setPrevIsGenerating] = useState(isGenerating)
  if (isGenerating !== prevIsGenerating) {
    setPrevIsGenerating(isGenerating)
    if (!isGenerating) {
      setShowInterruptPrompt(false)
    }
  }

  const setFiles = "setFiles" in props ? props.setFiles : undefined
  const addFiles = React.useCallback(
    (files: File[] | null) => {
      if (props.allowAttachments && setFiles) {
        setFiles((currentFiles) => {
          if (currentFiles === null) {
            return files
          }
          if (files === null) {
            return currentFiles
          }
          return [...currentFiles, ...files]
        })
      }
    },
    [props.allowAttachments, setFiles]
  )

  const onDragOver = (event: React.DragEvent) => {
    if (props.allowAttachments !== true) return
    event.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = (event: React.DragEvent) => {
    if (props.allowAttachments !== true) return
    event.preventDefault()
    setIsDragging(false)
  }

  const onDrop = (event: React.DragEvent) => {
    setIsDragging(false)
    if (props.allowAttachments !== true) return
    event.preventDefault()
    const dataTransfer = event.dataTransfer
    if (dataTransfer.files.length) {
      addFiles(Array.from(dataTransfer.files))
    }
  }

  const onPaste = React.useCallback(
    (event: React.ClipboardEvent) => {
      const items = event.clipboardData?.items
      if (!items) return

      const text = event.clipboardData.getData("text")
      if (text && text.length > 500 && props.allowAttachments) {
        event.preventDefault()
        const blob = new Blob([text], { type: "text/plain" })
        const file = new File([blob], "Pasted text", {
          type: "text/plain",
          lastModified: Date.now(),
        })
        addFiles([file])
        return
      }

      const files = Array.from(items)
        .map((item) => item.getAsFile())
        .filter((file) => file !== null)

      if (props.allowAttachments && files.length > 0) {
        addFiles(files)
      }
    },
    [props.allowAttachments, addFiles]
  )

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (submitOnEnter && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()

      if (isGenerating && stop && enableInterrupt) {
        if (showInterruptPrompt) {
          stop()
          setShowInterruptPrompt(false)
          event.currentTarget.form?.requestSubmit()
        } else if (
          props.value ||
          (props.allowAttachments && props.files?.length)
        ) {
          setShowInterruptPrompt(true)
          return
        }
      }

      event.currentTarget.form?.requestSubmit()
    }

    onKeyDownProp?.(event)
  }

  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [textAreaHeight, setTextAreaHeight] = useState<number>(0)
  const showFileList =
    props.allowAttachments && props.files && props.files.length > 0

  useEffect(() => {
    if (textAreaRef.current) {
      setTextAreaHeight(textAreaRef.current.offsetHeight)
    }
  }, [props.value])

  useAutosizeTextArea({
    ref: textAreaRef,
    maxHeight: 240,
    borderWidth: 1,
    dependencies: [props.value, showFileList],
  })

  return (
    <div
      className="relative flex w-full flex-col gap-2"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {enableInterrupt && (
        <InterruptPrompt
          isOpen={showInterruptPrompt}
          close={() => setShowInterruptPrompt(false)}
        />
      )}

      <RecordingPrompt
        isVisible={isRecording}
        onStopRecording={stopRecording}
      />

      <InputGroup className={cn("rounded-xl shadow-none", className)}>
        <InputGroupTextarea
          aria-label="Write your prompt here"
          placeholder={placeholder}
          ref={textAreaRef}
          onPaste={onPaste}
          onKeyDown={onKeyDown}
          className={cn(
            "resize-none bg-background transition-[border] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            showFileList && "pb-[4rem]"
          )}
          {...(props.allowAttachments
            ? omit(props, ["allowAttachments", "files", "setFiles"])
            : omit(props, ["allowAttachments"]))}
        />

        {showFileList && (
          <div className="absolute inset-x-3 bottom-14 z-20 overflow-x-auto py-2">
            <div className="flex gap-3">
              {props.files?.map((file) => {
                return (
                  <FilePreview
                    key={file.name + String(file.lastModified)}
                    file={file}
                    onRemove={() => {
                      if (!("setFiles" in props) || !props.setFiles) return
                      props.setFiles((files) => {
                        if (!files) return null
                        const filtered = Array.from(files).filter(
                          (f) => f !== file
                        )
                        if (filtered.length === 0) return null
                        return filtered
                      })
                    }}
                  />
                )
              })}
            </div>
          </div>
        )}

        <InputGroupAddon
          align="block-end"
          className="justify-between pt-2 pb-2"
        >
          <div className="flex gap-1">
            <TooltipProvider>
              {props.allowAttachments && (
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        type="button"
                        aria-label="Attach file"
                        size="icon-sm"
                        variant="ghost"
                        className="rounded-full"
                        onClick={async () => {
                          const files = await showFileUploadDialog()
                          addFiles(files)
                        }}
                      />
                    }
                  >
                    <Paperclip className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipPopup>Attach file</TooltipPopup>
                </Tooltip>
              )}
              {isSpeechSupported && (
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        type="button"
                        aria-label="Voice message"
                        className={cn(
                          "rounded-full",
                          isListening && "text-primary"
                        )}
                        size="icon-sm"
                        variant="ghost"
                        onClick={toggleListening}
                      />
                    }
                  >
                    <Mic className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipPopup>Record voice message</TooltipPopup>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-2">
            <InputGroupText className="text-xs text-muted-foreground max-sm:hidden">
              Press Enter to send
            </InputGroupText>
            {isGenerating && stop ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        type="button"
                        size="icon-sm"
                        className="rounded-full"
                        aria-label="Stop generating"
                        onClick={stop}
                      />
                    }
                  >
                    <Square
                      className="h-3 w-3 animate-pulse"
                      fill="currentColor"
                    />
                  </TooltipTrigger>
                  <TooltipPopup>Stop generation</TooltipPopup>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        type="submit"
                        size="icon-sm"
                        className="rounded-full transition-opacity"
                        aria-label="Send message"
                        disabled={props.value === "" || isGenerating}
                      />
                    }
                  >
                    <ArrowUp className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipPopup>Send</TooltipPopup>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </InputGroupAddon>
      </InputGroup>

      {props.allowAttachments && <FileUploadOverlay isDragging={isDragging} />}

      <RecordingControls
        isRecording={isRecording}
        isTranscribing={isTranscribing}
        audioStream={audioStream}
        textAreaHeight={textAreaHeight}
        onStopRecording={stopRecording}
      />
    </div>
  )
}
MessageInput.displayName = "MessageInput"

interface FileUploadOverlayProps {
  isDragging: boolean
}

function FileUploadOverlay({ isDragging }: FileUploadOverlayProps) {
  if (!isDragging) return null

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 flex animate-in items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background text-sm text-muted-foreground duration-200 fade-in"
      aria-hidden
    >
      <Paperclip className="h-4 w-4" />
      <span>Drop your files here to attach them.</span>
    </div>
  )
}

function showFileUploadDialog() {
  const input = document.createElement("input")

  input.type = "file"
  input.multiple = true
  input.accept = "*/*"
  input.click()

  return new Promise<File[] | null>((resolve) => {
    input.onchange = (e) => {
      const files = (e.currentTarget as HTMLInputElement).files
      if (files) {
        resolve(Array.from(files))
        return
      }
      resolve(null)
    }
  })
}

function TranscribingOverlay() {
  return (
    <div className="flex h-full w-full animate-in flex-col items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm duration-200 fade-in">
      <div className="relative">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="absolute inset-0 h-8 w-8 animate-pulse rounded-full bg-primary/20" />
      </div>
      <p className="mt-4 text-sm font-medium text-muted-foreground">
        Transcribing audio...
      </p>
    </div>
  )
}

interface RecordingPromptProps {
  isVisible: boolean
  onStopRecording: () => void
}

function RecordingPrompt({ isVisible, onStopRecording }: RecordingPromptProps) {
  if (!isVisible) return null

  return (
    <div
      className="absolute -top-10 left-1/2 flex -translate-x-1/2 animate-in cursor-pointer overflow-hidden rounded-full border border-border bg-background py-1 text-center text-sm whitespace-nowrap text-muted-foreground duration-200 fade-in slide-in-from-bottom-2"
      onClick={onStopRecording}
    >
      <span className="mx-2.5 flex items-center">
        <Info className="mr-2 h-3 w-3" />
        Click to finish recording
      </span>
    </div>
  )
}

interface RecordingControlsProps {
  isRecording: boolean
  isTranscribing: boolean
  audioStream: MediaStream | null
  textAreaHeight: number
  onStopRecording: () => void
}

function RecordingControls({
  isRecording,
  isTranscribing,
  audioStream,
  textAreaHeight,
  onStopRecording,
}: RecordingControlsProps) {
  if (isRecording) {
    return (
      <div
        className="absolute inset-px z-50 overflow-hidden rounded-xl"
        style={{ height: textAreaHeight - 2 }}
      >
        <AudioVisualizer
          stream={audioStream}
          isRecording={isRecording}
          onClick={onStopRecording}
        />
      </div>
    )
  }

  if (isTranscribing) {
    return (
      <div
        className="absolute inset-px z-50 overflow-hidden rounded-xl"
        style={{ height: textAreaHeight - 2 }}
      >
        <TranscribingOverlay />
      </div>
    )
  }

  return null
}
