import React from "react";
import { useGeneralStore } from "@/stores/generalStore";
import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import { useState } from "react";
import OverlayLayout from "./OverlayLayout";
import { useTranslation } from "@/context/Translation";
import Button from "../Button";
import ForgetPassword from "../auth/ForgetPassword";

export default function AuthOverlay() {
  const { setIsLoginOpen, isLoginOpen } = useGeneralStore();
  const [tap, setTap] = useState<"register" | "login" | "forgetpassword">("login");
  const { t } = useTranslation();

  return (
    <OverlayLayout
      isOpen={isLoginOpen}
      className="px-6"
      close={() => setIsLoginOpen(false)}
      title={tap === "register" ? t("auth.register") : tap === "login" ? t("auth.login") : t("auth.forgetPassword")}
    >
      {tap === "register" ? (
        <Register onSuccess={() => setTap("login")} />
      ) : tap === "login" ? (
        <Login />
      ) : (
        <ForgetPassword />
      )}

      {tap !== "forgetpassword" ? (
        <div className="text-center">
          <button
            className="text-center text-sm font-semibold text-primary hover:underline"
            onClick={() => setTap("forgetpassword")}
          >
            {t("auth.forgetPassword")}
          </button>
        </div>
      ) : null}

      <div className="mt-2 flex w-full items-center justify-center border-t p-2">
        <span className="text-sm text-gray-600">
          {!(tap === "register") ? t("auth.dontHaveAnAccount") : t("auth.alreadyHveAnAccount")}
        </span>

        <Button
          className="text-sm font-semibold text-primary hover:underline"
          onClick={() => setTap(!(tap === "register") ? "register" : "login")}
        >
          {!(tap === "register") ? t("auth.register") : t("auth.login")}
        </Button>
      </div>
    </OverlayLayout>
  );
}
