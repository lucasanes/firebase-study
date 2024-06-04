"use client";

import { Spinner } from "@nextui-org/react";
import { checkActionCode } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { auth } from "../../../firebase.config";
import * as S from "./styles";

export default function Firebase() {
  const { push } = useRouter();

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const code = search.get("oobCode");

    const actions = {
      VERIFY_EMAIL: "verify-email",
      PASSWORD_RESET: "reset-password",
      RECOVER_EMAIL: "recover-email",
      REVERT_SECOND_FACTOR_ADDITION: "remove-second-factor",
      VERIFY_AND_CHANGE_EMAIL: "change-email",
      EMAIL_SIGNIN: "email-signin",
    };

    checkActionCode(auth, code!)
      .then((info) => {
        console.log(info);
        push(`/firebase/${actions[info.operation]}/?oobCode=${code}`);
      })
      .catch((error) => {
        console.error(error);
        // push("/");
      });
  }, []);

  return (
    <S.Container>
      <Spinner color="primary" />
    </S.Container>
  );
}
