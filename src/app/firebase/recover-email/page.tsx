"use client";

import { ERROR_MESSAGES } from "@/constants/error";
import { applyActionCode } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { auth } from "../../../../firebase.config";

export default function VerifyChangedEmail() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oobCode = urlParams.get("oobCode");

    applyActionCode(auth, oobCode!)
      .then(() => {
        toast.success("Email recuperado com sucesso!");
        router.push("/");
      })
      .catch((error) => {
        toast.error(ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES]);
      });
  }, []);

  return <div></div>;
}
