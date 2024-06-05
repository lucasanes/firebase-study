"use client";

import CardComponent from "@/components/cardVerified/page";
import PasswordInput from "@/components/passwordInput";
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
import { updateEmail, updatePassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { toast } from "react-toastify";
import { auth } from "../../../../firebase.config";
import * as S from "./styles";

export default function Home() {
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

    if (!email && !password) return;

    startTransition(async () => {
      if (email) {
        await updateEmail(auth.currentUser!, email)
          .then(() => {
            toast.success("Email atualizado com sucesso");
          })
          .catch((error) => {
            toast.error(
              ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES]
            );
          });
      }

      if (password) {
        await updatePassword(auth.currentUser!, password)
          .then(() => {
            toast.success("Senha atualizada com sucesso");
          })
          .catch((error) => {
            toast.error(
              ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES]
            );
          });
      }
    });
  }

  function handleSignOut() {
    auth.signOut();
    push("/signin");
  }

  return (
    <S.Container>
      <S.Content>
        <h1>Olá, {auth.currentUser?.displayName}</h1>
        {!auth.currentUser?.emailVerified && <CardComponent />}
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
              <PasswordInput
                value={password}
                onValueChange={setPassword}
                onBlur={passwordValidator}
                isInvalid={error?.input == "password"}
                errorMessage={error?.input == "password" && error.msg}
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
        <Button
          className="signout"
          variant="flat"
          color="danger"
          onPress={handleSignOut}
        >
          Desconectar
        </Button>
      </S.Content>
    </S.Container>
  );
}
