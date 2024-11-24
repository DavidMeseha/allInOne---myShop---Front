import { type MiddlewareConfig, type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getPathnameLang } from "./lib/misc";

export async function middleware(req: NextRequest) {
  let res: NextResponse = NextResponse.next();
  const { pathname } = req.nextUrl;
  let lang = req.cookies.get("lang")?.value ?? "en";

  const pathnameLang = getPathnameLang(pathname);
  const pathnameTemp = pathname;
  const pathOnly = pathnameLang ? pathnameTemp.replace("/" + pathnameLang, "") : pathname;

  if (!pathnameLang) {
    req.nextUrl.pathname = `/${lang}${pathOnly ?? ""}`;
    res = NextResponse.redirect(req.nextUrl);
  }

  return res;
}

export const config: MiddlewareConfig = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|favicon.png|images/*).*)"]
};
