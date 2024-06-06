"use client";

import PasswordInput from "@/components/passwordInput";
import { ERROR_MESSAGES } from "@/constants/error";
import { phoneMask } from "@/utils/masks";
import { validatorCel } from "@/utils/validators";
import {
  Button,
  CardHeader,
  Checkbox,
  Input,
  Spinner,
} from "@nextui-org/react";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { BiPhone } from "react-icons/bi";
import { MdOutlineEmail } from "react-icons/md";
import { toast } from "react-toastify";
import { auth } from "../../../../firebase.config";
import * as S from "./styles";

export default function Home() {
  const { push } = useRouter();
  const [isTransition, startTransition] = useTransition();

  const [phoneNumerSignIn, setPhoneNumberSignIn] = useState(false);

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
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

  function phoneValidator() {
    if (phoneNumber && !validatorCel(phoneNumber)) {
      setError({ msg: "Informe um número válido.", input: "phone" });
      return;
    }
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (error) return;

    if (rememberMe) {
      auth.setPersistence(browserLocalPersistence);
    } else {
      auth.setPersistence(browserSessionPersistence);
    }

    startTransition(async () => {
      if (!phoneNumerSignIn) {
        await signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;

            toast.success(`Bem vindo, ${user.displayName}`);
            push("/");
          })
          .catch((error) => {
            toast.error(
              ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES]
            );
          });
      } else {
        const recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
          }
        );

        recaptchaVerifier.render();
        await signInWithPhoneNumber(
          auth,
          `+55${phoneNumber}`,
          recaptchaVerifier
        )
          .then(async (confirmationResult) => {
            await confirmationResult
              .confirm("000000")
              .then(async () => {
                toast.success(`Bem vindo, ${auth.currentUser?.displayName}.`);
              })
              .catch((error) => {
                toast.error(
                  ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES]
                );
              });
          })
          .catch((error) => {
            console.log(error);
            toast.error(
              ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES]
            );
          });
      }
    });
  }

  function handleGoogleSignIn() {
    startTransition(async () => {
      await signInWithPopup(auth, new GoogleAuthProvider())
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          const user = result.user;
          console.log(user, token);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(
            ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES]
          );
        });
    });
  }

  return (
    <S.Container>
      <S.Content>
        <div id="recaptcha-container"></div>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <h1>Login</h1>
          </CardHeader>
          <S.Body>
            {!phoneNumerSignIn ? (
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
            ) : (
              <Input
                required
                labelPlacement="outside"
                autoComplete="off"
                type="phone"
                label="Número de telefone"
                value={phoneMask(phoneNumber)}
                maxLength={15}
                onValueChange={(e) => setPhoneNumber(e.replace(/\D/g, ""))}
                startContent={<BiPhone className="pallet" size={20} />}
                isInvalid={error?.input == "phone"}
                onBlur={phoneValidator}
                errorMessage={error?.input == "phone" && error.msg}
                placeholder="(21) 99999-9999"
              />
            )}
            <PasswordInput
              required
              value={password}
              onValueChange={setPassword}
            />
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
              <Button
                variant="flat"
                color="primary"
                type="submit"
                disabled={isTransition}
              >
                {!isTransition ? "Entrar" : <Spinner />}
              </Button>
            </div>
            <div className="google">
              <Button
                color="primary"
                variant="bordered"
                onPress={() => setPhoneNumberSignIn(!phoneNumerSignIn)}
              >
                {!phoneNumerSignIn ? "Entrar com número" : "Entrar com Email"}
              </Button>
              <Button
                color="primary"
                variant="bordered"
                onPress={handleGoogleSignIn}
                disabled={isTransition}
              >
                {!isTransition ? "Entrar com Google" : <Spinner />}
              </Button>
            </div>
          </S.Footer>
        </form>
      </S.Content>
    </S.Container>
  );
}
