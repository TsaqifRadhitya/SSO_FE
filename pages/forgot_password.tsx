import EmailForm from "@/src/components/ForgotPassword/EmailForm";
import NewPasswordForm from "@/src/components/ForgotPassword/NewPasswordOTP";
import OTPForm from "@/src/components/ForgotPassword/OTPForm";
import { useAuth } from "@/src/hooks/useAuth";
import GuestLayout from "@/src/layouts/GuestLayout";
import Head from "next/head";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [progress, setProgress] = useState<
    | "waiting for email"
    | "invalid email"
    | "waiting for otp"
    | "invalid otp"
    | "Valid OTP"
  >("waiting for email");
  const [resetedEmailAccount, setResetedEmailAccount] = useState<string>();
  return (
    <GuestLayout className="flex items-center justify-center p-4">
      <Head>
        <title>SSO - Login Page</title>
      </Head>
      {["waiting for email", "invalid email"].includes(progress) && (
        <EmailForm
          setProgress={setProgress}
          setResetedEmail={(email: string) => setResetedEmailAccount(email)}
        />
      )}
      {["waiting for otp", "invalid otp"].includes(progress) && resetedEmailAccount && (
        <OTPForm setProgress={setProgress} email={resetedEmailAccount}/>
      )}
      {progress === "Valid OTP" && <NewPasswordForm />}
    </GuestLayout>
  );
}
