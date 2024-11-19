import { langs } from "@/dictionary";
import { type MiddlewareConfig, type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import axios from "./lib/axios";
import { User } from "./types";

export async function middleware(req: NextRequest) {
  let res: NextResponse = NextResponse.next();
  const { pathname } = req.nextUrl;
  const pathnameLang = langs.find((lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`);

  const token = req.cookies.get("session")?.value;
  const user = await axios
    .get<User>("/api/auth/check", { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => res.data)
    .catch(() => null);

  if (user && (!pathnameLang || pathnameLang !== user?.language)) {
    req.nextUrl.pathname = `/${user?.language}${pathname}`;
    res = NextResponse.redirect(req.nextUrl);
  } else if (!user) {
    req.nextUrl.pathname = `/en${pathname}`;
    res = NextResponse.redirect(req.nextUrl);
  }

  return res;
}

export const config: MiddlewareConfig = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|favicon.png|images/*).*)"]
};
