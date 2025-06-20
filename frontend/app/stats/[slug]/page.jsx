import { getStrapiSiteBySlug } from "@/actions/getStrapiSites";
import StatsDashboard from "@/components/stats/StatsDashboard";

export default async function SiteStatsPage({ params }) {
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

   return <StatsDashboard site={site} />;
}
