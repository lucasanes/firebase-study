"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { auth } from "../../firebase.config";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { push } = useRouter();

  const user = auth.currentUser!;

  useEffect(() => {
    if (!user) {
      push("/signin");
    }
  }, [user, push]);

  return (
    <>
      {!!user && children}
      {!user && null}
    </>
  );
}
