"use client"

import { LogOut } from "lucide-react"
import type * as React from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
  MenuGroup,
  MenuGroupLabel,
} from "@workspace/ui/components/menu"
import { Button } from "@workspace/ui/components/button"

export interface UserButtonProps {
  user: {
    name: string
    email: string
    avatar?: string
  }
  onSignOut: () => void
  children?: React.ReactNode
}

export function UserButton({ user, onSignOut, children }: UserButtonProps) {
  return (
    <Menu>
      <MenuTrigger
        render={
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="size-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <MenuPopup align="end" className="w-56">
        <MenuGroup>
          <MenuGroupLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm leading-none font-medium">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </MenuGroupLabel>
          <MenuSeparator />
          {children}
        </MenuGroup>
        
        {children && <MenuSeparator />}
        
        <MenuItem onClick={onSignOut}>
          <LogOut className="mr-2 size-4" />
          Sign out
        </MenuItem>
      </MenuPopup>
    </Menu>
  )
}
