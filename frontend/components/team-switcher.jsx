"use client";

import * as React from "react";
import { ChevronsUpDown, Globe } from "lucide-react";
import { useSite } from "@/contexts/SiteContext";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
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
   const [isTransitioning, setIsTransitioning] = React.useState(false);

   const handleSiteChange = async (siteId) => {
      const numericSiteId = parseInt(siteId, 10);
      const site = sites.find((s) => s.id === numericSiteId);

      if (site && !isTransitioning) {
         setIsTransitioning(true);

         try {
            switchSite(numericSiteId);

            const pathParts = pathname.split("/").filter(Boolean);

            // Gestion des différentes sections
            if (pathParts.length >= 2) {
               const currentSection = pathParts[0];
               const currentSubSection = pathParts[1];

               // Cas spécial pour les pages /infos/coordonnees et /infos/paiements
               if (
                  currentSection === "infos" &&
                  (currentSubSection === "coordonnees" ||
                     currentSubSection === "paiements")
               ) {
                  await router.push(
                     `/${currentSection}/${currentSubSection}/${site.slug}`
                  );
               }
               // Cas pour les pages /stats/[slug]
               else if (currentSection === "stats") {
                  await router.push(`/${currentSection}/${site.slug}`);
               }
               // Cas par défaut pour les autres sections
               else {
                  await router.push(`/${currentSection}/${site.slug}`);
               }
            } else {
               // Si on est sur la page d'accueil, rediriger vers les stats du nouveau site
               await router.push(`/stats/${site.slug}`);
            }
         } catch (error) {
            console.error("Erreur lors du changement de site:", error);
         } finally {
            // Petit délai pour éviter le glitch visuel
            setTimeout(() => setIsTransitioning(false), 100);
         }
      }
   };

   const renderLogo = (site, size = "size-4") => {
      const logoUrl = site?.logo?.formats?.thumbnail?.url;
      if (logoUrl) {
         return (
            <Image
               src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${logoUrl}`}
               alt={`Logo de ${site.name}`}
               width={32}
               height={32}
               className={`rounded-sm object-cover ${size}`}
               priority
            />
         );
      }
      return <Globe className={size} />;
   };

   if (loading) {
      return (
         <SidebarMenu>
            <SidebarMenuItem>
               <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
               >
                  <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg  animate-pulse">
                     <Globe className="size-8" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                     <span className="truncate font-medium  h-4 w-24 rounded animate-pulse" />
                  </div>
                  <ChevronsUpDown className="ml-auto" />
               </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
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
                     disabled={isTransitioning}
                     className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ${
                        isTransitioning ? "opacity-75" : ""
                     }`}
                  >
                     <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                        {renderLogo(selectedSite, "size-7")}
                     </div>
                     <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                           {selectedSite.name}
                        </span>
                     </div>
                     <ChevronsUpDown
                        className={`ml-auto ${
                           isTransitioning ? "animate-spin" : ""
                        }`}
                     />
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
                        disabled={
                           isTransitioning || site.id === selectedSite.id
                        }
                        className={`gap-2 p-2 ${
                           site.id === selectedSite.id
                              ? "bg-sidebar-accent"
                              : ""
                        }`}
                     >
                        <div className="flex size-6 items-center justify-center rounded-md border">
                           {renderLogo(site, "size-4")}
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
