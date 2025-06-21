"use client";

import { useState, useEffect } from "react";
import { useSite } from "@/contexts/SiteContext";
import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Edit, MapPin, Save, User, X, Link } from "lucide-react";
import { toast } from "sonner";

export default function CoordonneesPage({ params }) {
   const { selectedSite, editMode, toggleEditMode, updateSite, updating } =
      useSite();
   const { user, token } = useAuth();
   const [formData, setFormData] = useState({
      name: selectedSite?.name || "",
      person: selectedSite?.person || "",
      email: selectedSite?.email || "",
      phone: selectedSite?.phone || "",
      address: selectedSite?.address || "",
      ville: selectedSite?.ville || "",
      url: selectedSite?.url || "",
      admin_url: selectedSite?.admin_url || "",
   });

   // Mettre à jour formData quand selectedSite change
   useEffect(() => {
      if (selectedSite) {
         setFormData({
            name: selectedSite.name || "",
            person: selectedSite.person || "",
            email: selectedSite.email || "",
            phone: selectedSite.phone || "",
            address: selectedSite.address || "",
            ville: selectedSite.ville || "",
            url: selectedSite.url || "",
            admin_url: selectedSite.admin_url || "",
         });
      }
   }, [selectedSite]);

   const handleInputChange = (field, value) => {
      setFormData((prev) => ({
         ...prev,
         [field]: value,
      }));
   };

   const handleSave = async () => {
      if (!user || !token) {
         toast.error("Vous devez être connecté pour modifier les informations");
         return;
      }

      try {
         const result = await updateSite(formData);

         // Mettre à jour le formData avec les nouvelles valeurs
         if (result) {
            // Les données sont directement dans result, pas dans attributes
            setFormData({
               name: result.name || formData.name,
               person: result.person || formData.person,
               email: result.email || formData.email,
               phone: result.phone || formData.phone,
               address: result.address || formData.address,
               ville: result.ville || formData.ville,
               url: result.url || formData.url,
               admin_url: result.admin_url || formData.admin_url,
            });
         }

         // Fermer le mode édition
         toggleEditMode();

         // Afficher un toast de succès
         toast.success("Les informations ont été sauvegardées avec succès");
      } catch (error) {
         toast.error(error.message || "Erreur lors de la sauvegarde");
      }
   };

   const handleCancel = () => {
      // Restaurer les valeurs originales
      setFormData({
         name: selectedSite?.name || "",
         person: selectedSite?.person || "",
         email: selectedSite?.email || "",
         phone: selectedSite?.phone || "",
         address: selectedSite?.address || "",
         ville: selectedSite?.ville || "",
         url: selectedSite?.url || "",
         admin_url: selectedSite?.admin_url || "",
      });
      toggleEditMode();
   };

   if (!selectedSite) {
      return <div>Chargement...</div>;
   }

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold">Coordonnées</h1>
               <p className="text-muted-foreground">
                  Gérez les informations de contact et les coordonnées du site
               </p>
            </div>
            <div className="flex items-center space-x-2">
               <Label htmlFor="edit-mode" className="text-sm font-medium">
                  Mode édition
               </Label>
               <Switch
                  id="edit-mode"
                  checked={editMode}
                  onCheckedChange={toggleEditMode}
                  disabled={!user || !token}
               />
            </div>
         </div>

         {!user || !token ? (
            <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
               <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                     <span>
                        Vous devez être connecté pour modifier les informations
                     </span>
                  </div>
               </CardContent>
            </Card>
         ) : null}

         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <Edit className="h-5 w-5" />
                     Informations générales
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-2">
                  <Label htmlFor="name">Nom du site</Label>
                  {editMode ? (
                     <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                           handleInputChange("name", e.target.value)
                        }
                        placeholder="Nom du site"
                     />
                  ) : (
                     <div className="text-muted-foreground">
                        {formData.name || "Non renseigné"}
                     </div>
                  )}

                  <div className="">
                     <Label htmlFor="person">Contact principal</Label>
                     {editMode ? (
                        <Input
                           id="person"
                           value={formData.person}
                           onChange={(e) =>
                              handleInputChange("person", e.target.value)
                           }
                           placeholder="Nom du contact"
                        />
                     ) : (
                        <div className="text-muted-foreground">
                           {formData.person || "Non renseigné"}
                        </div>
                     )}
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <User className="h-5 w-5" />
                     Contact
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-2">
                  <div className="space-y-2">
                     <Label htmlFor="email">Email</Label>
                     {editMode ? (
                        <Input
                           id="email"
                           type="email"
                           value={formData.email}
                           onChange={(e) =>
                              handleInputChange("email", e.target.value)
                           }
                           placeholder="email@exemple.com"
                        />
                     ) : (
                        <div className="text-muted-foreground">
                           {formData.email || "Non renseigné"}
                        </div>
                     )}
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="phone">Téléphone</Label>
                     {editMode ? (
                        <Input
                           id="phone"
                           value={formData.phone}
                           onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                           }
                           placeholder="Téléphone..."
                        />
                     ) : (
                        <div className="text-muted-foreground">
                           {formData.phone || "Non renseigné"}
                        </div>
                     )}
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <MapPin className="h-5 w-5" />
                     Adresse
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-2">
                  <div className="space-y-2">
                     <Label htmlFor="address">Adresse</Label>
                     {editMode ? (
                        <Input
                           id="address"
                           value={formData.address}
                           onChange={(e) =>
                              handleInputChange("address", e.target.value)
                           }
                           placeholder="123 rue de la Paix"
                        />
                     ) : (
                        <div className="text-muted-foreground">
                           {formData.address || "Non renseigné"}
                        </div>
                     )}

                     <div className="space-y-2">
                        <Label htmlFor="ville">Ville</Label>
                        {editMode ? (
                           <Input
                              id="ville"
                              value={formData.ville}
                              onChange={(e) =>
                                 handleInputChange("ville", e.target.value)
                              }
                              placeholder="75000 Paris"
                           />
                        ) : (
                           <div className="text-muted-foreground">
                              {formData.ville || "Non renseigné"}
                           </div>
                        )}
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <Link className="h-5 w-5" />
                     URLs
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-2">
                  <div className="space-y-2">
                     <Label htmlFor="url">URL du site</Label>
                     {editMode ? (
                        <Input
                           id="url"
                           type="url"
                           value={formData.url}
                           onChange={(e) =>
                              handleInputChange("url", e.target.value)
                           }
                           placeholder="https://exemple.com"
                        />
                     ) : (
                        <div className="text-muted-foreground">
                           {formData.url ? (
                              <a
                                 href={formData.url}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-blue-600 hover:underline"
                              >
                                 {formData.url}
                              </a>
                           ) : (
                              "Non renseigné"
                           )}
                        </div>
                     )}
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="admin_url">URL Admin</Label>
                     {editMode ? (
                        <Input
                           id="admin_url"
                           type="url"
                           value={formData.admin_url}
                           onChange={(e) =>
                              handleInputChange("admin_url", e.target.value)
                           }
                           placeholder="https://exemple.com/wp-admin"
                        />
                     ) : (
                        <div className="text-muted-foreground">
                           {formData.admin_url ? (
                              <a
                                 href={formData.admin_url}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-blue-600 hover:underline"
                              >
                                 {formData.admin_url}
                              </a>
                           ) : (
                              "Non renseigné"
                           )}
                        </div>
                     )}
                  </div>
               </CardContent>
            </Card>
         </div>

         {editMode && (
            <div className="flex justify-end space-x-2">
               <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Annuler
               </Button>
               <Button onClick={handleSave} disabled={updating}>
                  <Save className="h-4 w-4 mr-2" />
                  {updating ? "Sauvegarde..." : "Sauvegarder"}
               </Button>
            </div>
         )}
      </div>
   );
}
