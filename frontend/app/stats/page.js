"use client";
import { useEffect, useState } from "react";
import SelectInfos from "@/components/stats/SelectInfos";
import Charts from "@/components/stats/Charts";
import Totals from "@/components/stats/Totals";
import AllDatas from "@/components/stats/AllDatas";

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

         setData(result);
      } catch (err) {
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

   // Préparer les données pour le graphique
   const prepareChartData = (dailyData) => {
      if (!dailyData || dailyData.length === 0) return [];

      const mappedData = dailyData.map((row) => {
         const dateStr = row.dimensionValues[0].value;
         const year = dateStr.substring(0, 4);
         const month = dateStr.substring(4, 6);
         const day = dateStr.substring(6, 8);
         const date = new Date(year, month - 1, day);

         return {
            date: dateStr,
            dateObj: date,
            visiteurs: parseInt(row.metricValues[0].value) || 0,
            sessions: parseInt(row.metricValues[1].value) || 0,
            pagesVues: parseInt(row.metricValues[2].value) || 0,
            dureeMoyenne: parseFloat(row.metricValues[3].value) || 0,
            tauxRebond: parseFloat(row.metricValues[4].value) || 0,
         };
      });

      return mappedData.sort(
         (a, b) => a.dateObj.getTime() - b.dateObj.getTime()
      );
   };

   if (loading) {
      return (
         <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Statistiques GA4</h1>
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
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
               <h2 className="text-red-800 font-semibold">Erreur</h2>
               <p className="text-red-600 mt-2">{error}</p>
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

         {data ? (
            <div className="space-y-6">
               <SelectInfos
                  SITES={SITES}
                  PERIODS={PERIODS}
                  selectedSite={selectedSite}
                  selectedPeriod={selectedPeriod}
                  handleSiteChange={handleSiteChange}
                  handlePeriodChange={handlePeriodChange}
                  data={data}
               />
               <Totals totals={data.totals} />
               <Charts chartData={chartData} />
               <AllDatas data={data} />
            </div>
         ) : (
            <p>Aucune donnée disponible</p>
         )}
      </div>
   );
}
