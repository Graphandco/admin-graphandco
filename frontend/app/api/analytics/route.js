import { getAnalyticsData } from "@/lib/analytics";

export async function GET() {
   try {
      console.log("Début de la requête API analytics");

      const data = await getAnalyticsData();

      console.log("Données récupérées avec succès:", {
         rowCount: data.rows?.length || 0,
         metricHeaders: data.metricHeaders?.length || 0,
         dimensionHeaders: data.dimensionHeaders?.length || 0,
      });

      return Response.json(data);
   } catch (error) {
      console.error("Erreur API GA4 :", error.message);
      console.error("Stack trace:", error.stack);

      return Response.json(
         {
            error: "Erreur lors de la récupération des données Analytics.",
            details: error.message,
         },
         { status: 500 }
      );
   }
}
