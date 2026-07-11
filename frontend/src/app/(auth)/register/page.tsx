import { AuthSplit }     from "@/components/auth/AuthSplit";
import { RegisterForm }  from "@/components/auth/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create account — snip.link",
};

export default function RegisterPage() {
  return (
    <AuthSplit mode="register">
      <RegisterForm />
    </AuthSplit>
  );
}
