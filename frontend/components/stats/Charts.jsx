"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
   ChartContainer,
   ChartTooltip,
   ChartTooltipContent,
   ChartLegend,
   ChartLegendContent,
} from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts";

export default function Charts({ chartData }) {
   if (!chartData || chartData.length === 0) return null;

   return (
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
                           const date = new Date(year, month - 1, day);
                           const formattedDate = date.toLocaleDateString(
                              "fr-FR",
                              {
                                 day: "2-digit",
                                 month: "2-digit",
                                 year: "numeric",
                              }
                           );

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
   );
}
