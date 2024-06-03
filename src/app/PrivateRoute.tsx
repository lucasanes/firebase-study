"use client";

import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { push } = useRouter();

  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      push("/");
    }
  }, [user, push]);

  return (
    <>
      {!!user && children}
      {!user && null}
    </>
  );
}
