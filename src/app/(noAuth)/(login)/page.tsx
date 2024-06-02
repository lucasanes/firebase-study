"use client";

import {
  Button,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Input,
} from "@nextui-org/react";
import * as S from "./styles";
import Link from "next/link";
import PasswordInput from "@/components/passwordInput";
import { MdOutlineEmail } from "react-icons/md";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../../../firebase.config";
import { toast } from "react-toastify";
import { BiUserCheck } from "react-icons/bi";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

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

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        toast.success(`Bem vindo, ${user.displayName}`);

        console.log(user);
      })
      .catch((error) => {
        toast.error("Email ou senha incorretos.");
        console.log(`Error: ${error.code} - ${error.message}`);
      });
  }

  return (
    <S.Container>
      <S.Content>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <h1>Login</h1>
          </CardHeader>
          <S.Body>
            <Input
              isRequired
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
            <PasswordInput value={password} onValueChange={setPassword} />
            <div
              style={{
                margin: "-1rem 0 -.5rem 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Checkbox
                size="sm"
                isSelected={rememberMe}
                onValueChange={setRememberMe}
              >
                Lembrar-me
              </Checkbox>

              <Button
                style={{ background: "none", padding: "0" }}
                color="primary"
                variant="light"
                as={Link}
                href="/forgot"
              >
                Esqueceu sua senha?
              </Button>
            </div>
          </S.Body>
          <CardFooter style={{ gap: "10px" }}>
            <Button variant="flat" color="danger" as={Link} href="/signup">
              Cadastrar
            </Button>
            <Button variant="flat" color="primary" type="submit">
              Entrar
            </Button>
          </CardFooter>
        </form>
      </S.Content>
    </S.Container>
  );
}
