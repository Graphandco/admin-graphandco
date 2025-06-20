"use client";
import { useEffect, useState } from "react";

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

   if (loading) {
      return (
         <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Statistiques GA4</h1>

            {/* Sélecteurs */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label
                     htmlFor="site-select"
                     className="block text-sm font-medium mb-2"
                  >
                     Site :
                  </label>
                  <select
                     id="site-select"
                     value={selectedSite.id}
                     onChange={(e) => handleSiteChange(e.target.value)}
                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                     disabled={loading}
                  >
                     {SITES.map((site) => (
                        <option key={site.id} value={site.id}>
                           {site.name} ({site.id})
                        </option>
                     ))}
                  </select>
               </div>

               <div>
                  <label
                     htmlFor="period-select"
                     className="block text-sm font-medium mb-2"
                  >
                     Période :
                  </label>
                  <select
                     id="period-select"
                     value={selectedPeriod.id}
                     onChange={(e) => handlePeriodChange(e.target.value)}
                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                     disabled={loading}
                  >
                     {PERIODS.map((period) => (
                        <option key={period.id} value={period.id}>
                           {period.name}
                        </option>
                     ))}
                  </select>
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
               <div>
                  <label
                     htmlFor="site-select"
                     className="block text-sm font-medium mb-2"
                  >
                     Site :
                  </label>
                  <select
                     id="site-select"
                     value={selectedSite.id}
                     onChange={(e) => handleSiteChange(e.target.value)}
                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                     {SITES.map((site) => (
                        <option key={site.id} value={site.id}>
                           {site.name} ({site.id})
                        </option>
                     ))}
                  </select>
               </div>

               <div>
                  <label
                     htmlFor="period-select"
                     className="block text-sm font-medium mb-2"
                  >
                     Période :
                  </label>
                  <select
                     id="period-select"
                     value={selectedPeriod.id}
                     onChange={(e) => handlePeriodChange(e.target.value)}
                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                     {PERIODS.map((period) => (
                        <option key={period.id} value={period.id}>
                           {period.name}
                        </option>
                     ))}
                  </select>
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

   return (
      <div className="p-8">
         <h1 className="text-2xl font-bold mb-6">
            Statistiques GA4 - {selectedSite.name}
         </h1>

         {/* Sélecteurs */}
         <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <label
                  htmlFor="site-select"
                  className="block text-sm font-medium mb-2"
               >
                  Site :
               </label>
               <select
                  id="site-select"
                  value={selectedSite.id}
                  onChange={(e) => handleSiteChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                  {SITES.map((site) => (
                     <option key={site.id} value={site.id}>
                        {site.name} ({site.id})
                     </option>
                  ))}
               </select>
            </div>

            <div>
               <label
                  htmlFor="period-select"
                  className="block text-sm font-medium mb-2"
               >
                  Période :
               </label>
               <select
                  id="period-select"
                  value={selectedPeriod.id}
                  onChange={(e) => handlePeriodChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                  {PERIODS.map((period) => (
                     <option key={period.id} value={period.id}>
                        {period.name}
                     </option>
                  ))}
               </select>
            </div>
         </div>

         {data ? (
            <div className="space-y-6">
               {/* Période */}
               <div className=" p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">
                     Période analysée
                  </h3>
                  <p className="text-blue-600">
                     Du {data.period?.startDate} au {data.period?.endDate}(
                     {data.period?.daysCount} jours)
                  </p>
               </div>

               {/* Totaux du mois */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                     <h3 className="font-semibold text-green-800">
                        Visiteurs uniques
                     </h3>
                     <p className="text-3xl font-bold text-green-600">
                        {data.totals?.totalUsers?.toLocaleString() || 0}
                     </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                     <h3 className="font-semibold text-purple-800">Sessions</h3>
                     <p className="text-3xl font-bold text-purple-600">
                        {data.totals?.totalSessions?.toLocaleString() || 0}
                     </p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                     <h3 className="font-semibold text-orange-800">
                        Pages vues
                     </h3>
                     <p className="text-3xl font-bold text-orange-600">
                        {data.totals?.totalPageViews?.toLocaleString() || 0}
                     </p>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg">
                     <h3 className="font-semibold text-indigo-800">
                        Durée moyenne session
                     </h3>
                     <p className="text-2xl font-bold text-indigo-600">
                        {data.totals?.averageSessionDuration
                           ? formatDuration(data.totals.averageSessionDuration)
                           : "0m 0s"}
                     </p>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                     <h3 className="font-semibold text-red-800">
                        Taux de rebond
                     </h3>
                     <p className="text-2xl font-bold text-red-600">
                        {data.totals?.averageBounceRate
                           ? formatPercentage(data.totals.averageBounceRate)
                           : "0%"}
                     </p>
                  </div>

                  <div className="bg-teal-50 p-4 rounded-lg">
                     <h3 className="font-semibold text-teal-800">
                        Sessions/utilisateur
                     </h3>
                     <p className="text-2xl font-bold text-teal-600">
                        {data.totals?.averageSessionsPerUser?.toFixed(2) || "0"}
                     </p>
                  </div>
               </div>

               {/* Données quotidiennes */}
               {data.dailyData && data.dailyData.length > 0 && (
                  <div className=" p-4 rounded-lg">
                     <h3 className="font-semibold mb-4">
                        Données quotidiennes
                     </h3>
                     <div className="overflow-x-auto">
                        <table className="min-w-full  border border-gray-200">
                           <thead>
                              <tr className="">
                                 <th className="px-4 py-2 border">Date</th>
                                 <th className="px-4 py-2 border">Visiteurs</th>
                                 <th className="px-4 py-2 border">Sessions</th>
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
                              {data.dailyData.slice(-10).map((row, index) => (
                                 <tr key={index} className="">
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
                                          parseFloat(row.metricValues[3].value)
                                       )}
                                    </td>
                                    <td className="px-4 py-2 border text-center">
                                       {formatPercentage(
                                          parseFloat(row.metricValues[4].value)
                                       )}
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               )}

               {/* Données brutes (optionnel) */}
               <details className=" p-4 rounded-lg">
                  <summary className="font-semibold cursor-pointer">
                     Données brutes (debug)
                  </summary>
                  <pre className="text-xs overflow-auto  p-4 rounded border mt-2">
                     {JSON.stringify(data, null, 2)}
                  </pre>
               </details>
            </div>
         ) : (
            <p>Aucune donnée disponible</p>
         )}
      </div>
   );
}
