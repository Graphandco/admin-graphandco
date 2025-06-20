"use client";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import SiteSelector from "@/components/SiteSelector";

export default function Header() {
   const { user, logout } = useAuth();

   return (
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
         <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold">
               Admin
            </Link>
            {user && <SiteSelector />}
         </div>
         <nav>
            <ul className="flex space-x-4">
               {user ? (
                  <>
                     <li>
                        <span className="text-gray-400">
                           Bonjour, {user.username}
                        </span>
                     </li>
                     <li>
                        <button
                           onClick={logout}
                           className="hover:text-gray-300"
                        >
                           Déconnexion
                        </button>
                     </li>
                  </>
               ) : (
                  <>
                     <li>
                        <Link href="/login" className="hover:text-gray-300">
                           Connexion
                        </Link>
                     </li>
                     <li>
                        <Link href="/register" className="hover:text-gray-300">
                           Inscription
                        </Link>
                     </li>
                  </>
               )}
            </ul>
         </nav>
      </header>
   );
}
