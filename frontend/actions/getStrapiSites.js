"use server";

export async function getStrapiSiteBySlug(slug) {
   const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/sites?filters[slug][$eq]=${slug}&populate=*`;
   const res = await fetch(url, { cache: "no-store" }); // SSR

   if (!res.ok) throw new Error("Erreur Strapi");

   const json = await res.json();
   return json.data[0]; // ou null si non trouvé
}

export async function getStrapiAllSites() {
   let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/sites?populate=*`;
   const res = await fetch(url, { cache: "no-store" });

   if (!res.ok) {
      throw new Error("Erreur lors de la récupération de la collection");
   }

   const json = await res.json();

   if (json) {
      return json.data;
   }
}
