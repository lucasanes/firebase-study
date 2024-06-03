"use client";

import PasswordInput from "@/components/passwordInput";
import { Button, CardHeader, Checkbox, Input } from "@nextui-org/react";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { auth } from "../../../../firebase.config";
import * as S from "./styles";

export default function Home() {
  const { push } = useRouter();

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

    if (rememberMe) {
      auth.setPersistence(browserLocalPersistence);
    } else {
      auth.setPersistence(browserSessionPersistence);
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        push("/home");
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Erro: ${errorCode} - ${errorMessage}`);
      });
  }

  function handleGoogleSignIn() {
    signInWithPopup(auth, new GoogleAuthProvider())
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        console.log(user, token);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Erro: ${errorCode} - ${errorMessage}`);
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
                href="/forget-password"
              >
                Esqueceu sua senha?
              </Button>
            </div>
          </S.Body>
          <S.Footer style={{ gap: "10px" }}>
            <div className="buttons">
              <Button variant="flat" color="danger" as={Link} href="/signup">
                Cadastrar
              </Button>
              <Button variant="flat" color="primary" type="submit">
                Entrar
              </Button>
            </div>
            <div className="google">
              <span>Ou se preferir</span>
              <Button
                color="primary"
                variant="bordered"
                onClick={handleGoogleSignIn}
              >
                Entrar com Google
              </Button>
            </div>
          </S.Footer>
        </form>
      </S.Content>
    </S.Container>
  );
}
