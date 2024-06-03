"use client";

import { AuthProvider } from "@/contexts/auth";
import { GlobalStyles } from "@/styles/global";
import { NextUIProvider } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const publicPages = ["/signin", "/signup", "/forget-password"];

  const isPublicPage = publicPages.includes(pathname);

  return (
    <AuthProvider>
      <NextUIProvider>
        <GlobalStyles />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          limit={3}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          theme="dark"
        />
        {isPublicPage && <PublicRoute>{children}</PublicRoute>}
        {!isPublicPage && <PrivateRoute>{children}</PrivateRoute>}
      </NextUIProvider>
    </AuthProvider>
  );
}
