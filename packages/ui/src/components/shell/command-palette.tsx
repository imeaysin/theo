"use client"

import {
  ArrowDownIcon,
  ArrowUpIcon,
  CornerDownLeftIcon,
  SearchIcon,
} from "lucide-react"
import { Fragment, useEffect, useMemo } from "react"
import type React from "react"
import { cn } from "@workspace/ui/lib/utils"
import {
  Command,
  CommandCollection,
  CommandDialog,
  CommandDialogPopup,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
  CommandSeparator,
  CommandShortcut,
} from "@workspace/ui/components/command"
import { Kbd, KbdGroup } from "@workspace/ui/components/kbd"
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { useShell } from "./shell-context"
import type { CommandAction } from "./types"

interface CommandGroupModel {
  value: string
  items: CommandAction[]
}

const DEFAULT_SECTION = "Actions"

function groupActions(actions: CommandAction[]): CommandGroupModel[] {
  const groups: CommandGroupModel[] = []
  const indexBySection = new Map<string, number>()

  for (const action of actions) {
    const section = action.section ?? DEFAULT_SECTION
    let groupIndex = indexBySection.get(section)
    if (groupIndex === undefined) {
      groupIndex = groups.length
      indexBySection.set(section, groupIndex)
      groups.push({ value: section, items: [] })
    }
    groups[groupIndex]!.items.push(action)
  }

  return groups
}

export interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  actions: CommandAction[]
  placeholder?: string
  emptyText?: string
  /** Centralized handler; falls back to `action.onSelect` then `action.href`. */
  onSelectAction?: (action: CommandAction) => void
}

export function CommandPalette({
  open,
  onOpenChange,
  actions,
  placeholder = "Search...",
  emptyText = "No results found.",
  onSelectAction,
}: CommandPaletteProps): React.ReactElement {
  const groups = useMemo(() => groupActions(actions), [actions])

  function handleSelect(action: CommandAction): void {
    onOpenChange(false)
    if (onSelectAction) {
      onSelectAction(action)
      return
    }
    if (action.onSelect) {
      action.onSelect()
      return
    }
    if (action.href && typeof window !== "undefined") {
      window.location.assign(action.href)
    }
  }

  return (
    <CommandDialog onOpenChange={onOpenChange} open={open}>
      <CommandDialogPopup>
        <Command items={groups}>
          <CommandInput placeholder={placeholder} />
          <CommandPanel>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandList>
              {groups.map((group, groupIndex) => (
                <Fragment key={group.value}>
                  <CommandGroup items={group.items}>
                    <CommandGroupLabel>{group.value}</CommandGroupLabel>
                    <CommandCollection>
                      {(item: CommandAction) => (
                        <CommandItem
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          value={`${item.name} ${item.keywords ?? ""}`}
                        >
                          <span className="flex-1">{item.name}</span>
                          {item.shortcut && item.shortcut.length > 0 ? (
                            <CommandShortcut>
                              {item.shortcut.join(" ")}
                            </CommandShortcut>
                          ) : null}
                        </CommandItem>
                      )}
                    </CommandCollection>
                  </CommandGroup>
                  {groupIndex < groups.length - 1 ? <CommandSeparator /> : null}
                </Fragment>
              ))}
            </CommandList>
          </CommandPanel>
          <CommandFooter>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <KbdGroup>
                  <Kbd>
                    <ArrowUpIcon />
                  </Kbd>
                  <Kbd>
                    <ArrowDownIcon />
                  </Kbd>
                </KbdGroup>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-2">
                <Kbd>
                  <CornerDownLeftIcon />
                </Kbd>
                <span>Open</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Kbd>Esc</Kbd>
              <span>Close</span>
            </div>
          </CommandFooter>
        </Command>
      </CommandDialogPopup>
    </CommandDialog>
  )
}

/** Registers the global Cmd/Ctrl+K shortcut to toggle the palette. */
export function useCommandPaletteShortcut(toggle: () => void): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggle()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [toggle])
}

/** Search button that opens the command palette, mirroring the sidebar trigger. */
export function CommandTrigger({
  className,
  variant = "sidebar",
}: {
  className?: string
  variant?: "sidebar" | "topnav"
}): React.ReactElement | null {
  const { openCommandPalette, isCommandPaletteEnabled } = useShell()

  if (!isCommandPaletteEnabled) return null

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            aria-label="Search"
            className={cn(
              "flex shrink-0 items-center justify-center transition",
              variant === "topnav"
                ? "rounded-full p-2 text-foreground hover:bg-accent"
                : "rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent lg:px-2 lg:hover:text-sidebar-accent-foreground",
              className
            )}
            onClick={openCommandPalette}
            type="button"
          >
            <SearchIcon className="size-4 shrink-0 text-inherit" />
          </button>
        }
      />
      <TooltipPopup side={variant === "topnav" ? "bottom" : "right"}>
        ⌘ + K
      </TooltipPopup>
    </Tooltip>
  )
}
