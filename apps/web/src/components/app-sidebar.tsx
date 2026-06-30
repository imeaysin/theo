import { Link, useLocation } from "react-router-dom"
import {
  CircleHelpIcon,
  LayoutDashboardIcon,
  MapIcon,
  MoonIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react"
import { NavUser } from "@workspace/ui/components/nav-user"
import type { ShellLinkProps } from "@workspace/ui/components/shell"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import { useAuthSession } from "@/features/auth/hooks/use-auth-session"
import { useSignOutMutation } from "@/features/auth/hooks/use-auth-mutations"
import { paths } from "@/config/paths"
import { site } from "@/config/site"

const RouterNavLink = ({ href, children, ...props }: ShellLinkProps) => (
  <Link to={href} {...props}>
    {children}
  </Link>
)

const userMenuItems = [
  {
    label: "My profile",
    href: paths.auth.settings,
    icon: UserIcon,
  },
  {
    label: "My settings",
    href: paths.auth.settings,
    icon: SettingsIcon,
  },
  {
    label: "Out of office",
    href: `${paths.auth.settings}/out-of-office`,
    icon: MoonIcon,
  },
  {
    label: "Visit roadmap",
    href: "https://cal.com/roadmap",
    icon: MapIcon,
    target: "_blank",
    rel: "noreferrer",
    separatorBefore: true,
  },
  {
    label: "Help",
    icon: CircleHelpIcon,
  },
] as const

const navItems = [
  { title: "Overview", href: paths.dashboard, icon: LayoutDashboardIcon },
  { title: "Settings", href: paths.auth.settings, icon: SettingsIcon },
]

export function AppSidebar() {
  const location = useLocation()
  const { data: session } = useAuthSession()
  const signOut = useSignOutMutation()
  const user = session?.user

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link to={paths.dashboard} />} size="lg">
              <span className="font-heading font-semibold">{site.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.href}
                    render={<Link to={item.href} />}
                    tooltip={item.title}
                  >
                    <item.icon aria-hidden="true" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {user ? (
        <SidebarFooter>
          <NavUser
            linkComponent={RouterNavLink}
            menuItems={[...userMenuItems]}
            onSignOut={() => signOut.mutate()}
            user={{
              name: user.name ?? "User",
              email: user.email ?? "",
              avatar: user.image ?? "",
            }}
          />
        </SidebarFooter>
      ) : null}
    </Sidebar>
  )
}
