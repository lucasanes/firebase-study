"use client";

import { ERROR_MESSAGES } from "@/constants/error";
import { Button, Card } from "@nextui-org/react";
import { sendEmailVerification } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../../../firebase.config";
import * as S from "./styles";

export default function CardComponent() {
  function handleSendEmail() {
    sendEmailVerification(auth.currentUser!)
      .then(() => {
        toast.success("Email de verificação enviado com sucesso.");
      })
      .catch((error) => {
        toast.error(ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES]);
      });
  }

  return (
    <Card>
      <S.Container>
        <h2>
          Você não está verificado, favor clique abaixo para receber o email de
          verificação.
        </h2>
        <Button variant="flat" color="primary" onPress={handleSendEmail}>
          Enviar
        </Button>
      </S.Container>
    </Card>
  );
}
