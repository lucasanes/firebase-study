"use client";

import { GlobalStyles } from "@/styles/global";
import { NextUIProvider } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../../firebase.config";

export function Providers({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const { push } = useRouter();

  const noAuthPages = ["/signin", "/signup", "/forget-password"];

  const privatePages = ["/"];

  const isNoAuthPage = noAuthPages.includes(pathname);

  const isPrivatePage = privatePages.includes(pathname);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log(user);
      if (user && isNoAuthPage) {
        push("/");
        setLoading(false);
        return;
      }
      if (!user && isPrivatePage) {
        push("/signin");
        setLoading(false);
        return;
      }
      setLoading(false);
    });
  }, []);

  return (
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
      {!loading && children}
    </NextUIProvider>
  );
}
