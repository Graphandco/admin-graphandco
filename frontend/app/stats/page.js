"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   ChartContainer,
   ChartTooltip,
   ChartTooltipContent,
   ChartLegend,
   ChartLegendContent,
} from "@/components/ui/chart";
import {
   Area,
   AreaChart,
   XAxis,
   YAxis,
   CartesianGrid,
   ResponsiveContainer,
} from "recharts";

// Configuration des sites
const SITES = [
   { id: "345118589", name: "Graph and Co" },
   { id: "431228089", name: "3ème chance" },
   { id: "338573140", name: "Holamate" },
   // Ajoutez d'autres sites ici
];

// Configuration des périodes
const PERIODS = [
   { id: "7days", name: "7 derniers jours", value: "7daysAgo" },
   { id: "30days", name: "30 derniers jours", value: "30daysAgo" },
   { id: "90days", name: "90 derniers jours", value: "90daysAgo" },
   { id: "month", name: "Mois en cours", value: "month" },
   { id: "quarter", name: "Trimestre en cours", value: "quarter" },
   { id: "year", name: "Année en cours", value: "year" },
];

export default function StatsPage() {
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [selectedSite, setSelectedSite] = useState(SITES[0]);
   const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[3]); // Mois en cours par défaut

   const fetchData = async (siteId, periodId) => {
      try {
         setLoading(true);
         setError(null);

         console.log(
            `Tentative de récupération des données analytics pour le site ${siteId} sur la période ${periodId}...`
         );
         const response = await fetch(
            `/api/analytics?site=${siteId}&period=${periodId}`
         );

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         const result = await response.json();

         if (result.error) {
            throw new Error(result.error);
         }

         console.log("Données reçues:", result);
         setData(result);
      } catch (err) {
         console.error("Erreur lors de la récupération des données:", err);
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchData(selectedSite.id, selectedPeriod.id);
   }, [selectedSite, selectedPeriod]);

   const handleSiteChange = (siteId) => {
      const site = SITES.find((s) => s.id === siteId);
      if (site) {
         setSelectedSite(site);
      }
   };

   const handlePeriodChange = (periodId) => {
      const period = PERIODS.find((p) => p.id === periodId);
      if (period) {
         setSelectedPeriod(period);
      }
   };

   const formatDuration = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
   };

   const formatPercentage = (value) => {
      return `${(value * 100).toFixed(1)}%`;
   };

   // Préparer les données pour le graphique
   const prepareChartData = (dailyData) => {
      if (!dailyData || dailyData.length === 0) return [];

      const mappedData = dailyData.map((row) => {
         // Convertir le format YYYYMMDD en objet Date
         const dateStr = row.dimensionValues[0].value;
         const year = dateStr.substring(0, 4);
         const month = dateStr.substring(4, 6);
         const day = dateStr.substring(6, 8);
         const date = new Date(year, month - 1, day); // month - 1 car les mois commencent à 0

         return {
            date: dateStr, // Garder la date originale pour l'affichage
            dateObj: date, // Objet Date pour le tri
            visiteurs: parseInt(row.metricValues[0].value) || 0,
            sessions: parseInt(row.metricValues[1].value) || 0,
            pagesVues: parseInt(row.metricValues[2].value) || 0,
            dureeMoyenne: parseFloat(row.metricValues[3].value) || 0,
            tauxRebond: parseFloat(row.metricValues[4].value) || 0,
         };
      });

      // S'assurer que les données sont triées par date pour que les lignes du graphique s'affichent
      return mappedData.sort(
         (a, b) => a.dateObj.getTime() - b.dateObj.getTime()
      );
   };

   // Configuration des métriques pour les cartes
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

   if (loading) {
      return (
         <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Statistiques GA4</h1>

            {/* Sélecteurs */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-sm font-medium">Site</label>
                  <Select
                     value={selectedSite.id}
                     onValueChange={handleSiteChange}
                     disabled={loading}
                  >
                     <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un site" />
                     </SelectTrigger>
                     <SelectContent>
                        {SITES.map((site) => (
                           <SelectItem key={site.id} value={site.id}>
                              {site.name} ({site.id})
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-medium">Période</label>
                  <Select
                     value={selectedPeriod.id}
                     onValueChange={handlePeriodChange}
                     disabled={loading}
                  >
                     <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une période" />
                     </SelectTrigger>
                     <SelectContent>
                        {PERIODS.map((period) => (
                           <SelectItem key={period.id} value={period.id}>
                              {period.name}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>
            </div>

            <div className="flex items-center space-x-2">
               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
               <p>
                  Chargement des données pour {selectedSite.name} (
                  {selectedPeriod.name})...
               </p>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Statistiques GA4</h1>

            {/* Sélecteurs */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-sm font-medium">Site</label>
                  <Select
                     value={selectedSite.id}
                     onValueChange={handleSiteChange}
                  >
                     <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un site" />
                     </SelectTrigger>
                     <SelectContent>
                        {SITES.map((site) => (
                           <SelectItem key={site.id} value={site.id}>
                              {site.name} ({site.id})
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-medium">Période</label>
                  <Select
                     value={selectedPeriod.id}
                     onValueChange={handlePeriodChange}
                  >
                     <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une période" />
                     </SelectTrigger>
                     <SelectContent>
                        {PERIODS.map((period) => (
                           <SelectItem key={period.id} value={period.id}>
                              {period.name}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-md p-4">
               <h2 className="text-red-800 font-semibold">Erreur</h2>
               <p className="text-red-600 mt-2">{error}</p>
               <p className="text-sm text-red-500 mt-2">
                  Vérifiez que les variables d'environnement sont correctement
                  configurées.
               </p>
            </div>
         </div>
      );
   }

   const chartData = prepareChartData(data?.dailyData);

   return (
      <div className="p-8">
         <h1 className="text-2xl font-bold mb-6">
            Statistiques GA4 - {selectedSite.name}
         </h1>

         {/* Sélecteurs */}
         <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
               <label className="text-sm font-medium">Site</label>
               <Select value={selectedSite.id} onValueChange={handleSiteChange}>
                  <SelectTrigger>
                     <SelectValue placeholder="Sélectionner un site" />
                  </SelectTrigger>
                  <SelectContent>
                     {SITES.map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                           {site.name} ({site.id})
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium">Période</label>
               <Select
                  value={selectedPeriod.id}
                  onValueChange={handlePeriodChange}
               >
                  <SelectTrigger>
                     <SelectValue placeholder="Sélectionner une période" />
                  </SelectTrigger>
                  <SelectContent>
                     {PERIODS.map((period) => (
                        <SelectItem key={period.id} value={period.id}>
                           {period.name}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
         </div>

         {data ? (
            <div className="space-y-6">
               {/* Période */}
               <Card>
                  <CardHeader>
                     <CardTitle>Période analysée</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-muted-foreground">
                        Du {data.period?.startDate} au {data.period?.endDate}(
                        {data.period?.daysCount} jours)
                     </p>
                  </CardContent>
               </Card>

               {/* Graphique d'évolution */}
               {chartData.length > 0 && (
                  <Card>
                     <CardHeader>
                        <CardTitle>Évolution des métriques</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <ChartContainer
                           config={{
                              visiteurs: {
                                 label: "Visiteurs uniques",
                                 color: "#3b82f6", // Bleu
                              },
                              sessions: {
                                 label: "Sessions",
                                 color: "#16a34a", // Vert
                              },
                              pagesVues: {
                                 label: "Pages vues",
                                 color: "#f97316", // Orange
                              },
                           }}
                           className="h-[300px] w-full"
                        >
                           <AreaChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis
                                 dataKey="date"
                                 tickFormatter={(value) => {
                                    // Convertir le format YYYYMMDD en objet Date
                                    const year = value.substring(0, 4);
                                    const month = value.substring(4, 6);
                                    const day = value.substring(6, 8);
                                    const date = new Date(year, month - 1, day);

                                    return date.toLocaleDateString("fr-FR", {
                                       day: "2-digit",
                                       month: "2-digit",
                                    });
                                 }}
                              />
                              <YAxis />
                              <ChartTooltip
                                 content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                       // Convertir le format YYYYMMDD en objet Date pour l'affichage
                                       const year = label.substring(0, 4);
                                       const month = label.substring(4, 6);
                                       const day = label.substring(6, 8);
                                       const date = new Date(
                                          year,
                                          month - 1,
                                          day
                                       );
                                       const formattedDate =
                                          date.toLocaleDateString("fr-FR", {
                                             day: "2-digit",
                                             month: "2-digit",
                                             year: "numeric",
                                          });

                                       return (
                                          <ChartTooltipContent
                                             active={active}
                                             payload={payload}
                                             label={formattedDate}
                                          />
                                       );
                                    }
                                    return null;
                                 }}
                              />
                              <ChartLegend content={<ChartLegendContent />} />
                              <Area
                                 type="monotone"
                                 dataKey="pagesVues"
                                 stroke="#f97316"
                                 fillOpacity={0.3}
                                 fill="#f97316"
                                 connectNulls
                              />
                              <Area
                                 type="monotone"
                                 dataKey="sessions"
                                 stroke="#16a34a"
                                 fillOpacity={0.3}
                                 fill="#16a34a"
                                 connectNulls
                              />
                              <Area
                                 type="monotone"
                                 dataKey="visiteurs"
                                 stroke="#3b82f6"
                                 fillOpacity={0.3}
                                 fill="#3b82f6"
                                 connectNulls
                              />
                           </AreaChart>
                        </ChartContainer>
                     </CardContent>
                  </Card>
               )}

               {/* Totaux avec Cards */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getMetricsCards(data.totals).map((metric, index) => (
                     <Card key={index}>
                        <CardHeader>
                           <CardTitle>{metric.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-2">
                              <p className="text-3xl font-bold">
                                 {metric.value}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                 {metric.description}
                              </p>
                           </div>
                        </CardContent>
                     </Card>
                  ))}
               </div>

               {/* Données quotidiennes */}
               {data.dailyData && data.dailyData.length > 0 && (
                  <Card>
                     <CardHeader>
                        <CardTitle>Données quotidiennes</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="overflow-x-auto">
                           <table className="min-w-full border border-gray-200">
                              <thead>
                                 <tr className="bg-gray-50">
                                    <th className="px-4 py-2 border">Date</th>
                                    <th className="px-4 py-2 border">
                                       Visiteurs
                                    </th>
                                    <th className="px-4 py-2 border">
                                       Sessions
                                    </th>
                                    <th className="px-4 py-2 border">
                                       Pages vues
                                    </th>
                                    <th className="px-4 py-2 border">
                                       Durée moy.
                                    </th>
                                    <th className="px-4 py-2 border">Rebond</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {data.dailyData
                                    .slice(-10)
                                    .map((row, index) => (
                                       <tr
                                          key={index}
                                          className="hover:bg-gray-50"
                                       >
                                          <td className="px-4 py-2 border text-center">
                                             {row.dimensionValues[0].value}
                                          </td>
                                          <td className="px-4 py-2 border text-center">
                                             {parseInt(
                                                row.metricValues[0].value
                                             ).toLocaleString()}
                                          </td>
                                          <td className="px-4 py-2 border text-center">
                                             {parseInt(
                                                row.metricValues[1].value
                                             ).toLocaleString()}
                                          </td>
                                          <td className="px-4 py-2 border text-center">
                                             {parseInt(
                                                row.metricValues[2].value
                                             ).toLocaleString()}
                                          </td>
                                          <td className="px-4 py-2 border text-center">
                                             {formatDuration(
                                                parseFloat(
                                                   row.metricValues[3].value
                                                )
                                             )}
                                          </td>
                                          <td className="px-4 py-2 border text-center">
                                             {formatPercentage(
                                                parseFloat(
                                                   row.metricValues[4].value
                                                )
                                             )}
                                          </td>
                                       </tr>
                                    ))}
                              </tbody>
                           </table>
                        </div>
                     </CardContent>
                  </Card>
               )}

               {/* Données brutes (optionnel) */}
               <Card>
                  <CardHeader>
                     <CardTitle>Données brutes (debug)</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <details>
                        <summary className="font-semibold cursor-pointer mb-2">
                           Afficher les données JSON
                        </summary>
                        <pre className="text-xs overflow-auto p-4 rounded border">
                           {JSON.stringify(data, null, 2)}
                        </pre>
                     </details>
                  </CardContent>
               </Card>
            </div>
         ) : (
            <Card>
               <CardContent>
                  <p>Aucune donnée disponible</p>
               </CardContent>
            </Card>
         )}
      </div>
   );
}
