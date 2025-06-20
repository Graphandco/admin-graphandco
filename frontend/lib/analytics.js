// lib/analytics.js
import fs from "fs";
import path from "path";
import { JWT } from "google-auth-library";

export async function getAnalyticsData() {
   const keyFilePath = path.join(
      process.cwd(),
      "credentials",
      "ga-service-account.json"
   );
   const keyFile = JSON.parse(fs.readFileSync(keyFilePath, "utf8"));

   const jwt = new JWT({
      email: keyFile.client_email,
      key: keyFile.private_key,
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
   });

   await jwt.authorize();

   const propertyId = process.env.GA_PROPERTY_ID;
   if (!propertyId) throw new Error("GA_PROPERTY_ID n'est pas défini");

   const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;

   // Obtenir le premier jour du mois en cours
   const now = new Date();
   const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
   const startDate = firstDayOfMonth.toISOString().split("T")[0]; // Format YYYY-MM-DD
   const endDate = now.toISOString().split("T")[0];

   const body = {
      dateRanges: [
         {
            startDate: startDate,
            endDate: endDate,
         },
      ],
      metrics: [
         { name: "totalUsers" }, // Utilisateurs uniques
         { name: "sessions" }, // Sessions
         { name: "screenPageViews" }, // Pages vues
         { name: "averageSessionDuration" }, // Durée moyenne session
         { name: "bounceRate" }, // Taux de rebond
         { name: "sessionsPerUser" }, // Sessions par utilisateur
      ],
      dimensions: [
         { name: "date" }, // Par jour
      ],
      orderBys: [{ dimension: { dimensionName: "date" } }],
   };

   const res = await fetch(url, {
      method: "POST",
      headers: {
         Authorization: `Bearer ${jwt.credentials.access_token}`,
         "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
   });

   if (!res.ok) {
      const error = await res.text();
      throw new Error(`Erreur API GA: ${error}`);
   }

   const data = await res.json();

   // Calculer les totaux pour le mois
   const totals = {
      totalUsers: 0,
      totalSessions: 0,
      totalPageViews: 0,
      averageSessionDuration: 0,
      averageBounceRate: 0,
      averageSessionsPerUser: 0,
   };

   if (data.rows && data.rows.length > 0) {
      data.rows.forEach((row) => {
         totals.totalUsers += parseInt(row.metricValues[0].value);
         totals.totalSessions += parseInt(row.metricValues[1].value);
         totals.totalPageViews += parseInt(row.metricValues[2].value);
         totals.averageSessionDuration += parseFloat(row.metricValues[3].value);
         totals.averageBounceRate += parseFloat(row.metricValues[4].value);
         totals.averageSessionsPerUser += parseFloat(row.metricValues[5].value);
      });

      const daysCount = data.rows.length;
      totals.averageSessionDuration = Math.round(
         totals.averageSessionDuration / daysCount
      );
      totals.averageBounceRate =
         Math.round((totals.averageBounceRate / daysCount) * 100) / 100;
      totals.averageSessionsPerUser =
         Math.round((totals.averageSessionsPerUser / daysCount) * 100) / 100;
   }

   return {
      period: {
         startDate,
         endDate,
         daysCount: data.rows ? data.rows.length : 0,
      },
      totals,
      dailyData: data.rows || [],
      headers: data.metricHeaders || [],
   };
}
