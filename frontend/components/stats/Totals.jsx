"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatDuration = (seconds) => {
   const minutes = Math.floor(seconds / 60);
   const remainingSeconds = Math.round(seconds % 60);
   return `${minutes}m ${remainingSeconds}s`;
};

const formatPercentage = (value) => {
   return `${(value * 100).toFixed(1)}%`;
};

export default function Totals({ totals }) {
   const getMetricsCards = (totals) => {
      if (!totals) return [];

      return [
         {
            title: "Visiteurs uniques",
            value: totals.totalUsers?.toLocaleString() || "0",
            description: "Nombre total d'utilisateurs uniques",
         },
         {
            title: "Sessions",
            value: totals.totalSessions?.toLocaleString() || "0",
            description: "Nombre total de sessions",
         },
         {
            title: "Pages vues",
            value: totals.totalPageViews?.toLocaleString() || "0",
            description: "Nombre total de pages consultées",
         },
         {
            title: "Durée moyenne session",
            value: totals.averageSessionDuration
               ? formatDuration(totals.averageSessionDuration)
               : "0m 0s",
            description: "Temps moyen passé par session",
         },
         {
            title: "Taux de rebond",
            value: totals.averageBounceRate
               ? formatPercentage(totals.averageBounceRate)
               : "0%",
            description: "Pourcentage de sessions à une seule page",
         },
         {
            title: "Sessions/utilisateur",
            value: totals.averageSessionsPerUser?.toFixed(2) || "0",
            description: "Nombre moyen de sessions par utilisateur",
         },
      ];
   };

   const metricsCards = getMetricsCards(totals);

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {metricsCards.map((metric, index) => (
            <Card key={index}>
               <CardHeader>
                  <CardTitle>{metric.title}</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-2">
                     <p className="text-3xl font-bold">{metric.value}</p>
                     <p className="text-sm text-muted-foreground">
                        {metric.description}
                     </p>
                  </div>
               </CardContent>
            </Card>
         ))}
      </div>
   );
}
