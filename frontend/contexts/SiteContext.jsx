"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getStrapiAllSites } from "@/actions/getStrapiSites";

const SiteContext = createContext();

export function SiteProvider({ children }) {
   const [sites, setSites] = useState([]);
   const [selectedSite, setSelectedSite] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchSites = async () => {
         try {
            const allSites = await getStrapiAllSites();
            setSites(allSites);
            if (allSites.length > 0) {
               // Essayer de charger le dernier site sélectionné depuis localStorage
               const storedSiteId = localStorage.getItem("selectedSiteId");
               const site =
                  allSites.find((s) => s.id.toString() === storedSiteId) ||
                  allSites[0];
               setSelectedSite(site);
               console.log(site);
            }
         } catch (error) {
            console.error("Erreur lors de la récupération des sites:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchSites();
   }, []);

   const switchSite = (siteId) => {
      const site = sites.find((s) => s.id === siteId);
      if (site) {
         setSelectedSite(site);
         localStorage.setItem("selectedSiteId", site.id.toString());
      }
   };

   return (
      <SiteContext.Provider
         value={{ sites, selectedSite, switchSite, loading }}
      >
         {children}
      </SiteContext.Provider>
   );
}

export function useSite() {
   return useContext(SiteContext);
}
