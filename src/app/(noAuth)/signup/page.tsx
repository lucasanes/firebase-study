"use client";

import PasswordInput from "@/components/passwordInput";
import { Button, CardFooter, CardHeader, Input } from "@nextui-org/react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Link from "next/link";
import { useState } from "react";
import { BiUserCheck } from "react-icons/bi";
import { MdOutlineEmail } from "react-icons/md";
import { toast } from "react-toastify";
import { auth } from "../../../../firebase.config";
import * as S from "./styles";

export default function Home() {
  const [name, setName] = useState("");
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

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        updateProfile(user, {
          displayName: name,
        })
          .then(() => {
            toast.success(`Bem vindo, ${user.email}`);
          })
          .catch((error) => {
            console.log(`Error: ${error.code} - ${error.message}`);
          });

        console.log(user);
      })
      .catch((error) => {
        console.log(`Error: ${error.code} - ${error.message}`);
      });
  }

  return (
    <S.Container>
      <S.Content>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <h1>Cadastro</h1>
          </CardHeader>
          <S.Body>
            <Input
              isRequired
              labelPlacement="outside"
              autoComplete="off"
              type="text"
              label="Nome"
              value={name}
              onValueChange={setName}
              startContent={<BiUserCheck className="pallet" size={20} />}
              minLength={3}
              maxLength={50}
              placeholder="Pedro Henrique"
            />

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
          </S.Body>
          <CardFooter style={{ gap: "10px" }}>
            <Button variant="flat" color="danger" as={Link} href="/">
              Voltar
            </Button>
            <Button variant="flat" color="success" type="submit">
              Cadastrar
            </Button>
          </CardFooter>
        </form>
      </S.Content>
    </S.Container>
  );
}
