"use client";

import { ERROR_MESSAGES } from "@/constants/error";
import { Button, CardHeader, Input, Spinner } from "@nextui-org/react";
import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { toast } from "react-toastify";
import { auth } from "../../../../firebase.config";
import * as S from "./styles";

export default function ForgetPassword() {
  const { push } = useRouter();

  const [isTransition, startTransition] = useTransition();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

    startTransition(async () => {
      await sendPasswordResetEmail(auth, email)
        .then((response) => {
          toast.success("Email enviado com sucesso!");
          push("/signin");
        })
        .catch((err) => {
          toast.error(ERROR_MESSAGES[err.code as keyof typeof ERROR_MESSAGES]);
        });
    });
  }

  return (
    <S.Container>
      <S.Content>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <h1>Recuperar Senha</h1>
          </CardHeader>
          <S.Body>
            <Input
              required
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
          </S.Body>
          <S.Footer style={{ gap: "10px" }}>
            <div className="buttons">
              <Button variant="flat" color="danger" as={Link} href="/signin">
                Voltar
              </Button>
              <Button
                variant="flat"
                color="primary"
                type="submit"
                disabled={isTransition}
              >
                {!isTransition ? "Enviar" : <Spinner />}
              </Button>
            </div>
          </S.Footer>
        </form>
      </S.Content>
    </S.Container>
  );
}
