import * as React from "react"
import { Globe, FolderOpen, Info } from "@phosphor-icons/react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"

const navItems = [
  // { title: "Ecosystem", url: "/", icon: Globe },
  { title: "Directory", url: "/", icon: FolderOpen },
  // { title: "About", url: "/about", icon: Info },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  directoryCount?: number
}

export function AppSidebar({ directoryCount, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="bg-foreground text-background flex aspect-square size-8 items-center justify-center rounded-lg text-sm">
                  VR<span className="text-primary">_</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate">Vaults Report</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.title === "Directory" && directoryCount && (
                    <SidebarMenuBadge className="text-muted-foreground">[{directoryCount}]</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <a
          href="https://glam.systems"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 group-data-[collapsible=icon]:aspect-square group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
        >
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 group-data-[collapsible=icon]:hidden">
            A public good initiative maintained by{" "}
            <span
              className="hover:text-primary"
              style={{ fontFamily: "'Geist Sans', sans-serif" }}
            >
              GLAM *.+
            </span>
          </p>
          <span
            className="hidden text-xs text-muted-foreground hover:text-primary group-data-[collapsible=icon]:block"
            style={{ fontFamily: "'Geist Sans', sans-serif" }}
          >
            *.+
          </span>
        </a>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
