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
   PERIODS,
   selectedPeriod,
   handlePeriodChange,
   data,
}) {
   return (
      <div className="space-y-6">
         <div className="mb-6 max-w-xs">
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
