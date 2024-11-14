import { langs } from "@/dictionary";
import { type MiddlewareConfig, type NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  let res: NextResponse = NextResponse.next();
  const { pathname } = req.nextUrl;
  const pathnameLang = langs.find((lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`);
  if (!pathnameLang) {
    req.nextUrl.pathname = `/${"en"}${pathname}`;
    res = NextResponse.redirect(req.nextUrl);
  }

  return res;
}

export const config: MiddlewareConfig = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|favicon.png|images/*).*)"]
};
