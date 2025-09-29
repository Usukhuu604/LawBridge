"use client";

import { useSignIn } from "@clerk/nextjs";
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import OtpInput from "@/components/OtpInput";
import { ClerkAPIError } from "@clerk/types";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [pending, setPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isPhone = /^\+?[0-9]{8,15}$/.test(identifier);
  const strategy = isPhone ? "phone_code" : "email_code";

  const handleIdentifierSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!isLoaded || !signIn) return;
    try {
      const res = await signIn.create({
        identifier,
        strategy,
      });
      if (res.status === "needs_first_factor") {
        setPending(true);
      } else {
        // @ts-expect-error: Clerk may not always return .json()
        const data = typeof res.json === "function" ? await res.json() : res;
        setErrorMsg(data?.message || "OTP илгээхэд алдаа гарлаа.");
      }
    } catch (err) {
      const error = err as ClerkAPIError;
      setErrorMsg(error?.message || "Код илгээхэд алдаа гарлаа.");
    }
  };

  const handleOTPSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!isLoaded || !signIn) return;
    try {
      const res = await signIn.attemptFirstFactor({
        strategy,
        code: otpCode,
      });
      // @ts-expect-error: Clerk may not always return .json()
      const data = typeof res.json === "function" ? await res.json() : res;
      if (res.status === "complete") {
        if (!setActive) {
          setErrorMsg("Системийн алдаа: setActive боломжгүй байна.");
          return;
        }
        await setActive({ session: data.sessionId || data.createdSessionId });
        router.push("/");
      } else {
        setErrorMsg(data?.message || "OTP шалгахад алдаа гарлаа.");
      }
    } catch (err) {
      const error = err as ClerkAPIError;
      setErrorMsg(error?.message || "OTP код буруу байна.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Card className="overflow-hidden p-0 border-[#dbeafe]">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="bg-muted relative hidden md:block">
            <img
              src="/lawbridgeLOGO.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <form
              onSubmit={pending ? handleOTPSubmit : handleIdentifierSubmit}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Тавтай морилно уу?</h1>
                <p className="text-muted-foreground text-sm">
                  Login to your LawBridge account
                </p>
              </div>
              {!pending ? (
                <>
                  <div className="grid gap-3">
                    <Label htmlFor="identifier">Имэйл хаяг оруулна уу</Label>
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="name@gmail.com"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#2563eb] text-white"
                  >
                    Үргэлжлүүлэх
                  </Button>
                </>
              ) : (
                <>
                  <div className="grid gap-3">
                    <Label>Баталгаажуулах код</Label>
                    <OtpInput onChange={setOtpCode} />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#2563eb] text-white"
                  >
                    Нэвтрэх
                  </Button>
                </>
              )}
              {errorMsg && (
                <p className="text-sm text-red-500 text-center">{errorMsg}</p>
              )}
            </form>
            <div className="flex justify-center text-center text-sm mt-4 gap-1">
              Шинэ хэрэглэгч?
              <a href="/sign-up" className="underline underline-offset-4">
                Бүртгэл үүсгэх
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
