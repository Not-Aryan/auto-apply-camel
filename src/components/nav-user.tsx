"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useUser, useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export function NavUser() {
  const { isMobile, state } = useSidebar()
  const { user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const isCollapsed = state === "collapsed"

  if (!user) return null

  const handleSignOut = async () => {
    await signOut()
    router.push("/sign-in")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center"
              tooltip={isCollapsed ? user.fullName : undefined}
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
                <AvatarFallback>{user.firstName?.[0] || "U"}</AvatarFallback>
              </Avatar>
              {!isMobile && (
                <>
                  <div className="ml-3 flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                    <div className="truncate font-medium">
                      {user.fullName || user.username}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {user.primaryEmailAddress?.emailAddress}
                    </div>
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 group-data-[collapsible=icon]:hidden" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
