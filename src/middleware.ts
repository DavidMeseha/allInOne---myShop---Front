import { langs } from "@/dictionary";
import { type MiddlewareConfig, type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { User } from "./types";

const URL = process.env.API_BASEURL;

const getToken = async () => {
  const guestUser: { user: User; token: string } = await fetch(URL + "/api/auth/guest")
    .then((res) => res.json())
    .catch(() => null);
  return guestUser;
};

const check = async (token: string) => {
  const guestUser: User = await fetch(URL + "/api/auth/check", {
    headers: {
      Authorization: "Bearer " + token
    }
  })
    .then(async (res) => res.json())
    .catch(() => null);

  return guestUser;
};

export async function middleware(req: NextRequest) {
  let res: NextResponse = NextResponse.next();
  const { pathname } = req.nextUrl;
  const pathnameLang = langs.find((lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`);
  let token = req.cookies.get("access_token")?.value ?? "";

  const tokenUser = !token ? null : await check(token);

  let user: { user: User; token: string } | null = null;
  if (!tokenUser) {
    user = await getToken();
    if (user) {
      res.cookies.set("access_token", user.token);
    }
  } else {
    user = { user: tokenUser, token: token };
  }

  if (!pathnameLang) {
    if (user) req.nextUrl.pathname = `/${user.user.language ?? "en"}${pathname}`;
    res = NextResponse.redirect(req.nextUrl);
  }

  return res;
}

export const config: MiddlewareConfig = {
  matcher: ["/((?!_next|static|images).*)"]
};
