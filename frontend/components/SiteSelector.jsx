"use client";
import { useSite } from "@/contexts/SiteContext";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { useRouter, usePathname } from "next/navigation";

export default function SiteSelector() {
   const { sites, selectedSite, switchSite, loading } = useSite();
   const router = useRouter();
   const pathname = usePathname();

   const handleSiteChange = (siteId) => {
      const numericSiteId = parseInt(siteId, 10);
      const site = sites.find((s) => s.id === numericSiteId);

      if (site) {
         switchSite(numericSiteId);

         const pathParts = pathname.split("/").filter(Boolean); // ["infos", "hola-mate"]

         // Si on est sur une page de type /section/slug
         if (pathParts.length === 2) {
            const currentSection = pathParts[0];
            router.push(`/${currentSection}/${site.slug}`);
         } else {
            // Sinon, redirection par défaut vers les stats
            router.push(`/stats/${site.slug}`);
         }
      }
   };

   if (loading) {
      return (
         <div className="h-9 w-48 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800" />
      );
   }

   if (!selectedSite) return null;

   return (
      <Select
         value={selectedSite.id.toString()}
         onValueChange={handleSiteChange}
      >
         <SelectTrigger className="w-auto min-w-[180px]">
            <SelectValue placeholder="Changer de site..." />
         </SelectTrigger>
         <SelectContent>
            {sites.map((site) => (
               <SelectItem key={site.id} value={site.id.toString()}>
                  {site.name}
               </SelectItem>
            ))}
         </SelectContent>
      </Select>
   );
}
