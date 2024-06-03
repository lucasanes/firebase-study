"use client";

import { useAuth } from "@/contexts/auth";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import * as S from "./styles";

export default function Home() {
  const { push } = useRouter();
  const { signOut } = useAuth();

  function handleSignOut() {
    signOut();
    push("/");
  }

  return (
    <S.Container>
      <S.Content>
        <Button variant="flat" color="danger" onPress={handleSignOut}>
          Desconectar
        </Button>
      </S.Content>
    </S.Container>
  );
}
