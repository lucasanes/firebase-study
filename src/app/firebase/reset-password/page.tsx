"use client";

import PasswordInput from "@/components/passwordInput";
import { Button, CardHeader } from "@nextui-org/react";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../../../../firebase.config";
import * as S from "./styles";

export default function Firebase() {
  const { push } = useRouter();

  const [password, setPassword] = useState("");

  const [error, setError] = useState<{ msg: string; input: string } | null>(
    null
  );

  function passwordValidator() {
    if (password && password.length < 8) {
      setError({
        msg: "A senha deve ter no mínimo 8 caracteres.",
        input: "password",
      });
      return;
    } else if (password && password.length > 20) {
      setError({
        msg: "A senha deve ter no máximo 20 caracteres.",
        input: "password",
      });
      return;
    } else if (
      password &&
      !password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    ) {
      setError({
        msg: "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número.",
        input: "password",
      });
      return;
    }
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (error) return;

    const search = new URLSearchParams(window.location.search);
    const code = search.get("oobCode");

    verifyPasswordResetCode(auth, code!)
      .then((a) => {
        confirmPasswordReset(auth, code!, password)
          .then((a) => {
            toast.success("Senha redefinida com sucesso!");
            push("/signin");
          })
          .catch((error) => {
            toast.error(`Error: ${error.code} - ${error.message}`);
          });
      })
      .catch((error) => {
        toast.error(`Error: ${error.code} - ${error.message}`);
      });
  }

  return (
    <S.Container>
      <S.Content>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <h1>Firebase</h1>
          </CardHeader>
          <S.Body>
            <PasswordInput
              value={password}
              onValueChange={setPassword}
              onBlur={passwordValidator}
              isInvalid={error?.input == "password"}
              errorMessage={error?.input == "password" && error.msg}
            />
          </S.Body>
          <S.Footer style={{ gap: "10px" }}>
            <div className="buttons">
              <Button
                variant="flat"
                color="danger"
                as={Link}
                href="/forget-password"
              >
                Voltar
              </Button>
              <Button variant="flat" color="primary" type="submit">
                Enviar
              </Button>
            </div>
          </S.Footer>
        </form>
      </S.Content>
    </S.Container>
  );
}
