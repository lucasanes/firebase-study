"use client";

import { ERROR_MESSAGES } from "@/constants/error";
import { applyActionCode } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { auth } from "../../../../firebase.config";

export default function VerifyEmail() {
  const router = useRouter();

  useEffect(() => {
    //confirmar a verificacao do email pelo oob code do firebase

    const urlParams = new URLSearchParams(window.location.search);
    const oobCode = urlParams.get("oobCode");

    applyActionCode(auth, oobCode!)
      .then(() => {
        toast.success("Email verificado com sucesso!");
        router.push("/");
      })
      .catch((error) => {
        toast.error(ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES]);
      });
  }, []);

  return <div></div>;
}
