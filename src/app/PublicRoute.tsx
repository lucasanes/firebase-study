"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { auth } from "../../firebase.config";

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { push } = useRouter();

  const user = auth.currentUser!;

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
