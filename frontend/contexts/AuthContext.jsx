"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { setCookie, deleteCookie } from "cookies-next";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
   const [user, setUser] = useState(null);
   const [token, setToken] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      // Vérifier si l'utilisateur est déjà connecté au chargement
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
         try {
            const parsedUser = JSON.parse(storedUser);

            // Vérifier si c'est la nouvelle structure { jwt, user } ou l'ancienne
            if (parsedUser.jwt && parsedUser.user) {
               // Nouvelle structure : { jwt, user }
               setUser(parsedUser.user);
               setToken(parsedUser.jwt);
            } else {
               // Ancienne structure : juste user
               setUser(parsedUser);
            }
         } catch (error) {
            console.error("AuthContext - Error parsing user:", error);
         }
      }
      setLoading(false);
   }, []);

   const login = (userData) => {
      setUser(userData.user);
      setToken(userData.jwt);

      // Stocker dans localStorage avec la structure { jwt, user }
      const authData = {
         jwt: userData.jwt,
         user: userData.user,
      };
      localStorage.setItem("user", JSON.stringify(authData));

      // Stocker dans un cookie
      setCookie("user", JSON.stringify(authData), {
         maxAge: 60 * 60 * 24 * 7, // 7 jours
         path: "/",
      });
   };

   const logout = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      deleteCookie("user");
   };

   return (
      <AuthContext.Provider value={{ user, token, login, logout, loading }}>
         {children}
      </AuthContext.Provider>
   );
}

export const useAuth = () => useContext(AuthContext);
