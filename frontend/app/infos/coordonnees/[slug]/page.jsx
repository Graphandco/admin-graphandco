import { getStrapiSiteBySlug } from "@/actions/getStrapiSites";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

export default async function SiteInfosPage({ params }) {
   // Les versions récentes de Next.js peuvent passer `params` comme une promesse
   const resolvedParams = await params;
   const site = await getStrapiSiteBySlug(resolvedParams.slug);

   if (!site) {
      return (
         <div className="p-8">
            <h1 className="text-2xl font-bold">Site non trouvé</h1>
            <p>
               Le site avec le slug "{resolvedParams.slug}" n'a pas pu être
               trouvé.
            </p>
         </div>
      );
   }

   return (
      <div className="space-y-8">
         <h1 className="text-xl">
            Détails du client <span className="text-primary">{site.name}</span>
         </h1>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
               <CardHeader>
                  <CardTitle>Site web</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-2">
                     <p className="">
                        Site:{" "}
                        <a
                           href={site.url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-muted-foreground hover:text-primary"
                        >
                           {site.url}
                        </a>
                     </p>
                     {site.admin_url && (
                        <p className="">
                           Admin:{" "}
                           <a
                              href={site.admin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary"
                           >
                              {site.admin_url}
                           </a>
                        </p>
                     )}
                  </div>
               </CardContent>
            </Card>
            <Card>
               <CardHeader>
                  <CardTitle>Contact</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-2">
                     <p className="text-muted-foreground">{site.person}</p>
                     <p className="text-muted-foreground">
                        {site.address}
                        <br></br>
                        {site.ville}
                     </p>
                     <p className="text-muted-foreground flex items-center gap-2">
                        <Phone size={16} /> {site.phone}
                     </p>
                     <p className="text-muted-foreground flex items-center gap-2">
                        <Mail size={16} />
                        {site.email}
                     </p>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
