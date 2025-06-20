import { NextResponse } from "next/server";

export function middleware(request) {
   const userCookie = request.cookies.get("user");

   const isAuthPage =
      request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/register");

   const isProtectedRoute = request.nextUrl.pathname === "/";
   // ||
   // request.nextUrl.pathname.startsWith("/dashboard") ||
   // request.nextUrl.pathname.startsWith("/shopping-list") ||
   // request.nextUrl.pathname.startsWith("/add-product") ||
   // request.nextUrl.pathname.startsWith("/inventaire");

   const isAuthenticated = userCookie && userCookie.value;

   if (isProtectedRoute && !isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
   }

   // if (isAuthPage && isAuthenticated) {
   //   return NextResponse.redirect(new URL("/dashboard", request.url));
   // }

   return NextResponse.next();
}

// ✅ Ce matcher applique le middleware uniquement sur les routes frontend,
// et exclut les appels API, les assets statiques et favicon
export const config = {
   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
