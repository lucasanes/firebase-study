"use client";

import { ERROR_MESSAGES } from "@/constants/error";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Spinner,
} from "@nextui-org/react";
import { updateEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { toast } from "react-toastify";
import { auth } from "../../../../firebase.config";
import * as S from "./styles";

export default function ChangeEmail() {
  const { push } = useRouter();

  const [isTransition, startTransition] = useTransition();

  const [email, setEmail] = useState("");

  const [error, setError] = useState<{ msg: string; input: string } | null>(
    null
  );

  function emailValidator() {
    if (email && !email.match(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]/)) {
      setError({ msg: "Informe um Email válido.", input: "email" });
      return;
    }
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (error) return;

    if (!email) return;

    startTransition(async () => {
      if (email.length > 0) {
        await updateEmail(auth.currentUser!, email)
          .then(() => {
            toast.success("Email atualizado com sucesso.");
            push("/");
          })
          .catch((error) => {
            toast.error(
              ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES]
            );
          });
      }
    });
  }

  return (
    <S.Container>
      <S.Content>
        <Card style={{ width: "300px" }}>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <h1>Conta</h1>
            </CardHeader>
            <CardBody style={{ gap: "20px" }}>
              <Input
                labelPlacement="outside"
                autoComplete="off"
                type="email"
                label="Email"
                value={email}
                onValueChange={setEmail}
                startContent={<MdOutlineEmail className="pallet" size={20} />}
                isInvalid={error?.input == "email"}
                onBlur={emailValidator}
                errorMessage={error?.input == "email" && error.msg}
                placeholder="eu@exemplo.com"
              />
            </CardBody>
            <CardFooter>
              <Button
                variant="flat"
                color="primary"
                type="submit"
                disabled={isTransition}
              >
                {!isTransition ? "Salvar" : <Spinner />}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </S.Content>
    </S.Container>
  );
}
