"use client";

import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { push } = useRouter();

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      push("/");
    }
    console.log("user", user);
  }, [user, push]);

  return (
    <>
      {((!user && user != undefined) || user == null) && children}
      {!!user && null}
    </>
  );
}
