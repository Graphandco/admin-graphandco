"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getStrapiAllSites } from "@/actions/getStrapiSites";
import { updateSiteInfo } from "@/actions/updateSiteInfo";
import { useAuth } from "./AuthContext";

const SiteContext = createContext();

export function SiteProvider({ children }) {
   const { token } = useAuth();
   const [sites, setSites] = useState([]);
   const [selectedSite, setSelectedSite] = useState(null);
   const [loading, setLoading] = useState(true);
   const [editMode, setEditMode] = useState(false);
   const [updating, setUpdating] = useState(false);

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
         // Désactiver le mode édition lors du changement de site
         setEditMode(false);
      }
   };

   const updateSite = async (siteData) => {
      if (!selectedSite || !token) {
         console.error("Site ou token manquant");
         return;
      }

      setUpdating(true);
      try {
         // Utiliser le documentId pour Strapi
         const siteIdentifier = selectedSite.documentId;

         const result = await updateSiteInfo(siteIdentifier, siteData, token);

         if (result.success) {
            // Mettre à jour le site dans la liste
            const updatedSites = sites.map((site) =>
               site.id === selectedSite.id ? { ...site, ...result.data } : site
            );
            setSites(updatedSites);

            // Mettre à jour le site sélectionné
            const updatedSelectedSite = { ...selectedSite, ...result.data };
            setSelectedSite(updatedSelectedSite);

            return result.data;
         } else {
            throw new Error(result.error || "Erreur lors de la mise à jour");
         }
      } catch (error) {
         console.error("Erreur lors de la mise à jour du site:", error);
         throw error;
      } finally {
         setUpdating(false);
      }
   };

   const toggleEditMode = () => {
      setEditMode(!editMode);
   };

   return (
      <SiteContext.Provider
         value={{
            sites,
            selectedSite,
            switchSite,
            loading,
            editMode,
            toggleEditMode,
            updateSite,
            updating,
         }}
      >
         {children}
      </SiteContext.Provider>
   );
}

export function useSite() {
   return useContext(SiteContext);
}
