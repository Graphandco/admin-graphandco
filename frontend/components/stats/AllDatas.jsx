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

const formatDate = (dateString) => {
   if (!dateString) return null;
   const year = dateString.substring(0, 4);
   const month = dateString.substring(4, 6);
   const day = dateString.substring(6, 8);
   return `${day}/${month}/${year}`;
};

export default function AllDatas({ data }) {
   if (!data) return null;

   return (
      <div className="space-y-6">
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
                           <tr className="">
                              <th className="px-4 py-2 border">Date</th>
                              <th className="px-4 py-2 border">Visiteurs</th>
                              <th className="px-4 py-2 border">Sessions</th>
                              <th className="px-4 py-2 border">Pages vues</th>
                              <th className="px-4 py-2 border">Durée moy.</th>
                              <th className="px-4 py-2 border">Rebond</th>
                           </tr>
                        </thead>
                        <tbody>
                           {data.dailyData.slice(-10).map((row, index) => (
                              <tr key={index} className="hover:bg-white/5">
                                 <td className="px-4 py-2 border text-center">
                                    {formatDate(row.dimensionValues[0].value)}
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
   );
}
