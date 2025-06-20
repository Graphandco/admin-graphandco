import { getAnalyticsData } from "@/lib/analytics";

export async function GET(request) {
   try {
      console.log("Début de la requête API analytics");

      // Récupérer les paramètres depuis l'URL
      const { searchParams } = new URL(request.url);
      const siteId = searchParams.get("site");
      const periodId = searchParams.get("period");

      console.log("Site demandé:", siteId || "défaut");
      console.log("Période demandée:", periodId || "défaut");

      const data = await getAnalyticsData(siteId, periodId);

      console.log("Données récupérées avec succès:", {
         rowCount: data.dailyData?.length || 0,
         siteId: siteId,
         periodId: periodId,
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
