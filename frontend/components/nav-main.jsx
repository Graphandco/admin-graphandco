"use client";

import { ChevronRight, Info } from "lucide-react";
import { useSite } from "@/contexts/SiteContext";

import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
   SidebarGroup,
   SidebarGroupLabel,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarMenuSub,
   SidebarMenuSubButton,
   SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain() {
   const { selectedSite } = useSite();

   const infoItems = [
      {
         title: "Coordonnées",
         url: `/infos/coordonnees/${selectedSite?.slug || ""}`,
      },
      {
         title: "Paiements",
         url: `/infos/paiements/${selectedSite?.slug || ""}`,
      },
   ];

   return (
      <SidebarGroup>
         <SidebarGroupLabel>Platform</SidebarGroupLabel>
         <SidebarMenu>
            <Collapsible
               asChild
               defaultOpen={true}
               className="group/collapsible"
            >
               <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                     <SidebarMenuButton tooltip="Informations">
                        <Info />
                        <span>Informations</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                     </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                     <SidebarMenuSub>
                        {infoItems.map((subItem) => (
                           <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                 <a href={subItem.url}>
                                    <span>{subItem.title}</span>
                                 </a>
                              </SidebarMenuSubButton>
                           </SidebarMenuSubItem>
                        ))}
                     </SidebarMenuSub>
                  </CollapsibleContent>
               </SidebarMenuItem>
            </Collapsible>
         </SidebarMenu>
      </SidebarGroup>
   );
}
