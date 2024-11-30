import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const locale = request.cookies.get("locale")?.value || "en";
	request.headers.set("x-locale", locale);
	return NextResponse.next();
}

export const config = {
	matcher: "/:path*",
};
