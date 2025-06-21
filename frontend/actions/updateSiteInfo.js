export async function updateSiteInfo(siteId, siteData, token) {
   try {
      const response = await fetch(
         `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/sites/${siteId}`,
         {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               data: siteData,
            }),
         }
      );

      if (!response.ok) {
         let errorMsg = "Erreur lors de la mise à jour du site";
         try {
            const text = await response.text();
            if (text) {
               const errorData = JSON.parse(text);
               errorMsg = errorData.error?.message || errorMsg;
            }
         } catch (e) {
            console.error("Error parsing response:", e);
         }
         throw new Error(errorMsg);
      }

      const result = await response.json();
      return { success: true, data: result.data };
   } catch (error) {
      console.error("Erreur lors de la mise à jour du site:", error);
      return { success: false, error: error.message };
   }
}
