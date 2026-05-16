import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useCurrentUser } from "@/hooks/use-current-user";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({ component: AuthPage });

type AuthMode = "login" | "signup";
type AuthStep = "credentials" | "otp";

interface SignUpFields {
  name: string;
  email: string;
  password: string;
}

type FormFields = SignUpFields;

function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [step, setStep] = useState<AuthStep>("credentials");
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [pendingName, setPendingName] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const { setUser } = useCurrentUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();

  function switchMode(next: AuthMode) {
    setMode(next);
    setStep("credentials");
    setOtpValue("");
    setOtpError("");
    reset();
  }

  function onCredentialsSubmit(data: FormFields) {
    setPendingName((data as SignUpFields).name ?? "User");
    setPendingEmail(data.email);
    setOtpValue("");
    setOtpError("");
    setStep("otp");
    toast.success("OTP sent! Check your email or phone.");
  }

  function onOTPSubmit() {
    if (otpValue.length < 6) {
      setOtpError("Please enter the full 6-digit code.");
      return;
    }
    setOtpError("");
    setUser({
      id: String(Date.now()),
      name: pendingName || "User",
      email: pendingEmail,
      phone: "",
    });
    toast.success("Welcome to Sabi Solar!");
    navigate({ to: "/dashboard" });
  }

  const loginFields = mode === "login";

  return (
    <div
      className="min-h-svh flex flex-col items-center justify-center bg-background px-4 py-12"
      data-ocid="auth.page"
    >
      {/* Logo / brand */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-8 h-8"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="4"
              fill="currentColor"
              className="text-primary-foreground"
            />
            <path
              d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-primary-foreground"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Sabi Solar
        </h1>
        <p className="text-sm text-muted-foreground">
          Remote energy monitoring
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
        {/* Mode toggle */}
        <div
          className="flex p-1.5 m-4 bg-muted rounded-xl"
          data-ocid="auth.mode_toggle"
        >
          <button
            type="button"
            data-ocid="auth.login_tab"
            onClick={() => switchMode("login")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
              mode === "login"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            data-ocid="auth.signup_tab"
            onClick={() => switchMode("signup")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
              mode === "signup"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="px-6 pb-8">
          {step === "credentials" ? (
            <form
              onSubmit={handleSubmit(onCredentialsSubmit)}
              noValidate
              data-ocid="auth.credentials_form"
            >
              <div className="flex flex-col gap-5">
                {!loginFields && (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Ada Okoye"
                      autoComplete="name"
                      data-ocid="auth.name_input"
                      {...register("name", { required: "Name is required" })}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="auth.name_input.field_error"
                      >
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    data-ocid="auth.email_input"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email",
                      },
                    })}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="auth.email_input.field_error"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete={
                      loginFields ? "current-password" : "new-password"
                    }
                    data-ocid="auth.password_input"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Minimum 6 characters" },
                    })}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="auth.password_input.field_error"
                    >
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {loginFields && (
                  <button
                    type="button"
                    data-ocid="auth.forgot_password_link"
                    onClick={() => toast.info("Password reset coming soon")}
                    className="self-end text-xs text-primary hover:underline -mt-2"
                  >
                    Forgot password?
                  </button>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  data-ocid="auth.credentials_submit_button"
                  className="w-full h-11 font-semibold"
                >
                  {loginFields ? "Login" : "Create Account"}
                </Button>
              </div>
            </form>
          ) : (
            <div
              className="flex flex-col items-center gap-6"
              data-ocid="auth.otp_step"
            >
              <div className="text-center">
                <h2 className="text-lg font-semibold text-foreground">
                  Verify your identity
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter the 6-digit code sent to{" "}
                  <span className="text-foreground font-medium">
                    {pendingEmail}
                  </span>
                </p>
              </div>

              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(val) => {
                  setOtpValue(val);
                  if (otpError) setOtpError("");
                }}
                data-ocid="auth.otp_input"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              {otpError && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="auth.otp_input.field_error"
                >
                  {otpError}
                </p>
              )}

              <Button
                type="button"
                onClick={onOTPSubmit}
                data-ocid="auth.otp_submit_button"
                className="w-full h-11 font-semibold"
              >
                Verify & Continue
              </Button>

              <button
                type="button"
                data-ocid="auth.otp_back_button"
                onClick={() => setStep("credentials")}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="mt-8 text-xs text-muted-foreground text-center">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}
