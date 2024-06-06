"use client";

import CardComponent from "@/components/cardVerified/page";
import PasswordInput from "@/components/passwordInput";
import { ERROR_MESSAGES } from "@/constants/error";
import { phoneMask } from "@/utils/masks";
import { validatorCel } from "@/utils/validators";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Spinner,
} from "@nextui-org/react";
import {
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
  updatePassword,
  updatePhoneNumber,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { BiPhone } from "react-icons/bi";
import { MdOutlineEmail } from "react-icons/md";
import { toast } from "react-toastify";
import { auth } from "../../../../firebase.config";
import * as S from "./styles";

export default function Home() {
  const { push } = useRouter();

  const [isTransition, startTransition] = useTransition();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [verificationCode, setVerificationCode] = useState("");

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

    if (!email && !password) return;

    startTransition(async () => {
      if (email.length > 0 && email !== auth.currentUser?.email) {
        await verifyBeforeUpdateEmail(auth.currentUser!, email)
          .then(() => {
            toast.success("Verificação para novo Email enviada com sucesso.");
          })
          .catch((error) => {
            toast.error(
              ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES]
            );
          });
      }

      if (password.length > 0) {
        await updatePassword(auth.currentUser!, password)
          .then(() => {
            toast.success("Senha atualizada com sucesso.");
          })
          .catch((error) => {
            toast.error(
              ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES]
            );
          });
      }
    });
  }

  function handle2FA(e: FormEvent) {
    e.preventDefault();

    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    );

    recaptchaVerifier.render();

    startTransition(async () => {
      const provider = new PhoneAuthProvider(auth);

      await provider
        .verifyPhoneNumber(`+55${phoneNumber}`, recaptchaVerifier)
        .then(async (verifyResult) => {
          const phoneCredential = PhoneAuthProvider.credential(
            verifyResult,
            "000000"
          );
          await updatePhoneNumber(auth.currentUser!, phoneCredential);

          const multiFactorAssertion =
            PhoneMultiFactorGenerator.assertion(phoneCredential);

          multiFactor(auth.currentUser!)
            .enroll(multiFactorAssertion)
            .then(() => {
              toast.success("2FA ativado com sucesso.");
            })
            .catch((error) => {
              recaptchaVerifier.clear();
              console.log(error);
              toast.error(
                ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES]
              );
            });
        })
        .catch((error) => {
          recaptchaVerifier.clear();
          console.log(error);
          toast.error(
            ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES]
          );
        });
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await auth.currentUser
        ?.delete()
        .then(() => {
          toast.success("Conta deletada com sucesso.");
          auth.signOut();
          push("/signin");
        })
        .catch((error) => {
          toast.error(
            ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES]
          );
        });
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
        <div id="recaptcha-container"></div>
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

        <Card style={{ width: "300px" }}>
          <form onSubmit={handle2FA}>
            <CardHeader>
              <h1>Ativar 2FA</h1>
            </CardHeader>
            <CardBody style={{ gap: "20px" }}>
              <Input
                required
                labelPlacement="outside"
                autoComplete="off"
                type="phone"
                label="Número de telefone"
                value={phoneMask(phoneNumber)}
                maxLength={15}
                onValueChange={(e) => setPhoneNumber(e.replace(/\D/g, ""))}
                // eslint-disable-next-line react/jsx-no-undef
                startContent={<BiPhone className="pallet" size={20} />}
                isInvalid={error?.input == "phone"}
                onBlur={phoneValidator}
                errorMessage={error?.input == "phone" && error.msg}
                placeholder="(21) 99999-9999"
              />
            </CardBody>
            <CardFooter>
              <Button
                variant="flat"
                color="primary"
                type="submit"
                disabled={isTransition}
              >
                {!isTransition ? "Ativar 2FA" : <Spinner />}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Button
          className="button"
          variant="flat"
          color="danger"
          onPress={handleSignOut}
        >
          Desconectar
        </Button>
        <Button
          className="button"
          variant="flat"
          color="danger"
          onPress={handleDelete}
          disabled={isTransition}
        >
          {!isTransition ? "Deletar conta" : <Spinner />}
        </Button>
      </S.Content>
    </S.Container>
  );
}
