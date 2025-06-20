"use client";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
   const { user, logout } = useAuth();
   const handleLogout = () => {
      logout();
   };

   return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-5">
         <div>Welcome {user?.user?.username}</div>
         <div>
            <button
               onClick={handleLogout}
               className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
               Déconnexion
            </button>
         </div>
      </div>
   );
}
