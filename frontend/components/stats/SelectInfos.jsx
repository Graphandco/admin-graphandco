"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

const formatDate = (dateString) => {
   if (!dateString) return null;
   const [year, month, day] = dateString.split("-");
   return `${day}/${month}/${year}`;
};

export default function SelectInfos({
   SITES,
   PERIODS,
   selectedSite,
   selectedPeriod,
   handleSiteChange,
   handlePeriodChange,
   data,
}) {
   return (
      <div className="space-y-6">
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

         {/* Période */}
         <Card>
            <CardHeader>
               <CardTitle>Période analysée</CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-muted-foreground">
                  Du {formatDate(data.period?.startDate)} au{" "}
                  {formatDate(data.period?.endDate)} ({data.period?.daysCount}{" "}
                  jours)
               </p>
            </CardContent>
         </Card>
      </div>
   );
}
