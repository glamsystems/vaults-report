import * as React from "react"
import { FolderOpen, Books, Info, Globe, XLogo } from "@phosphor-icons/react"
import { GitHubLogoIcon } from "@radix-ui/react-icons"

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
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

const navItems = [
  { title: "Directory", url: "/directory", icon: FolderOpen },
  { title: "Ecosystem", url: "/ecosystem", icon: Globe, desktopOnly: true },
  { title: "Resources", url: "/resources", icon: Books },
]

const secondaryItems = [
  { title: "About", url: "/about", icon: Info },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  directoryCount?: number
}

export function AppSidebar({ directoryCount, ...props }: AppSidebarProps) {
  const isMobile = useIsMobile()
  const filteredNavItems = navItems.filter(item => !item.desktopOnly || !isMobile)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href={import.meta.env.BASE_URL}>
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
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={`${import.meta.env.BASE_URL}${item.url.replace(/^\//, '')}`}>
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
            <SidebarSeparator className="my-2" />
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={`${import.meta.env.BASE_URL}${item.url.replace(/^\//, '')}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex gap-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-1">
          <a
            href="https://x.com/vaultsreport"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 border px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-sidebar-accent group-data-[collapsible=icon]:p-2"
          >
            <XLogo className="size-4" />
            <span className="group-data-[collapsible=icon]:hidden">Follow</span>
          </a>
          <a
            href="https://github.com/glamsystems/vaults-report"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 border px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-sidebar-accent group-data-[collapsible=icon]:p-2"
          >
            <GitHubLogoIcon className="size-4" />
            <span className="group-data-[collapsible=icon]:hidden">GitHub</span>
          </a>
        </div>
        <a
          href="https://glam.systems"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-pampas-100 dark:bg-zeus-950 text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 group-data-[collapsible=icon]:aspect-square group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
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
