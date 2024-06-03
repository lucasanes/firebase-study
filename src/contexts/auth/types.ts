import { User } from "firebase/auth";

export type AuthContextProps = {
  signIn: (email: string, password: string, rememberMe: boolean) => void;

  signOut: () => void;

  user: User | null | undefined;

  token: string | null | undefined;
};

export type DataProps = {
  user: User | null;

  token: string | null;
};
