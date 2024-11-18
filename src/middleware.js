import { NextResponse } from "next/server";
import { getCurrentUser } from "./features/auth/queries";

export async function middleware(request) {
  const user = await getCurrentUser();
  if (!user && request.nextUrl.pathname !== "/sign-in") {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next(request.url);
}

export const config = {
  matcher: ["/sign-in", "/sign-up"],
};
