// "use client";

// import { useUser } from "@clerk/nextjs";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export const AuthRedirectGuard = () => {
//   const { user, isLoaded, isSignedIn } = useUser();
//   const router = useRouter();
//   const pathname = usePathname();
//   const [isAllowed, setIsAllowed] = useState(false);

//   useEffect(() => {
//     if (!isLoaded) return;

//     const role = user?.publicMetadata?.role;
//     const id = user?.id;

//     // ✅ Publicly accessible routes
//     const publicRoutes = [
//       "/",
//       "/find-lawyers",
//       "/legal-articles",
//       "sign-up",
//       "/sign-up/*",
//       "/sign-in",
//     ];
//     const isPublic =
//       publicRoutes.includes(pathname) || pathname.startsWith("/lawyer/");

//     if (!isSignedIn) {
//       // If not signed in, allow only public routes
//       if (!isPublic) {
//         router.replace("/sign-in");
//       }
//       return;
//     }

//     if (role === "lawyer") {
//       if (pathname === `/lawyer/${id}`) {
//         router.push("/my-profile/me");
//       }
//     }

//     if (role === "admin") {
//       router.push("/admin");
//     }

//     // ✅ Signed in but not a lawyer
//     if (role !== "lawyer") {
//       // Allow everything for non-lawyers except /lawyer-form
//       if (pathname === "/lawyer-form") {
//         router.replace("/");
//         return;
//       }

//       // Chat only for signed-in users
//       if (["/chatbot", "/chatroom"].includes(pathname)) {
//         setIsAllowed(true);
//         return;
//       }

//       setIsAllowed(true);
//       return;
//     }
//   }, [isLoaded, isSignedIn, pathname, router, user]);

//   // Render children only when allowed
//   if (!isLoaded || !isAllowed) return null;

//   return null; // This is just redirect logic; children are rendered outside this guard
// };
