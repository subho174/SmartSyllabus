import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log(token);

  if (!PUBLIC_ROUTES.includes(path) && !token)
    return NextResponse.redirect(new URL("/sign-in", req.url));

  if (PUBLIC_ROUTES.includes(path) && token)
    return NextResponse.redirect(new URL("/dashboard", req.url));
}

export const config = {
  // matcher: ["/((?!_next|favicon.ico|api|.*\\..*).*)"],
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
