import { AuthSplit }  from "@/components/auth/AuthSplit";
import { LoginForm }  from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in — snip.link",
};

export default function LoginPage() {
  return (
    <AuthSplit mode="login">
      <LoginForm />
    </AuthSplit>
  );
}
