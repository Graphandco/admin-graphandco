"use client";

import * as React from "react";
import { ChevronsUpDown, Globe } from "lucide-react";
import { useSite } from "@/contexts/SiteContext";
import { useRouter, usePathname } from "next/navigation";

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuShortcut,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   useSidebar,
} from "@/components/ui/sidebar";

export function TeamSwitcher() {
   const { isMobile } = useSidebar();
   const { sites, selectedSite, switchSite, loading } = useSite();
   const router = useRouter();
   const pathname = usePathname();

   const handleSiteChange = (siteId) => {
      const numericSiteId = parseInt(siteId, 10);
      const site = sites.find((s) => s.id === numericSiteId);

      if (site) {
         switchSite(numericSiteId);

         const pathParts = pathname.split("/").filter(Boolean);
         if (pathParts.length === 2) {
            const currentSection = pathParts[0];
            router.push(`/${currentSection}/${site.slug}`);
         } else {
            router.push(`/stats/${site.slug}`);
         }
      }
   };

   if (loading) {
      return (
         <SidebarMenuItem>
            <SidebarMenuButton
               size="lg"
               className="animate-pulse bg-gray-200 dark:bg-gray-800"
            />
         </SidebarMenuItem>
      );
   }

   if (!selectedSite) {
      return null;
   }

   return (
      <SidebarMenu>
         <SidebarMenuItem>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                     size="lg"
                     className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                     <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                        <Globe className="size-4" />
                     </div>
                     <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                           {selectedSite.name}
                        </span>
                     </div>
                     <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
               </DropdownMenuTrigger>
               <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  align="start"
                  side={isMobile ? "bottom" : "right"}
                  sideOffset={4}
               >
                  <DropdownMenuLabel className="text-muted-foreground text-xs">
                     Sites
                  </DropdownMenuLabel>
                  {sites.map((site) => (
                     <DropdownMenuItem
                        key={site.id}
                        onClick={() => handleSiteChange(site.id)}
                        className="gap-2 p-2"
                     >
                        <div className="flex size-6 items-center justify-center rounded-md border">
                           <Globe className="size-3.5 shrink-0" />
                        </div>
                        {site.name}
                     </DropdownMenuItem>
                  ))}
               </DropdownMenuContent>
            </DropdownMenu>
         </SidebarMenuItem>
      </SidebarMenu>
   );
}
