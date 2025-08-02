import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { auth } from "./app/api/auth/[...nextauth]/options";

const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!PUBLIC_ROUTES.includes(path) && !token)
    return NextResponse.redirect(new URL("/sign-in", req.url));

  if (PUBLIC_ROUTES.includes(path) && token)
    return NextResponse.redirect(new URL("/dashboard", req.url));
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api|.*\\..*).*)"],
};
