import { checkPermission } from "@/config/permissions";
import { PublicRoute, routes, validModulePaths } from "@/config/routes";
import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface JwtPayload {
	exp: number;
	roles: {
		name: string;
		permissions: string[];
	}[];
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const token = request.cookies.get("token")?.value;

	// Set default locale
	const locale = request.cookies.get("locale")?.value || "en";
	request.headers.set("x-locale", locale);

	// Handle public routes
	if (routes.public.includes(pathname as PublicRoute)) {
		return token
			? NextResponse.redirect(new URL("/", request.url))
			: NextResponse.next();
	}

	// Handle root path
	if (pathname === "/") {
		return token
			? NextResponse.next()
			: NextResponse.redirect(new URL("/auth/login", request.url));
	}

	// Handle protected routes
	if (!token) {
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}

	try {
		const decoded = jwtDecode<JwtPayload>(token);
		const currentTime = Math.floor(Date.now() / 1000);

		if (decoded.exp < currentTime) {
			return NextResponse.redirect(new URL("/auth/login", request.url));
		}

		// Check permissions for module paths
		if (validModulePaths.some((path) => pathname.startsWith(path))) {
			const userPermissions = decoded.roles.flatMap((role) => role.permissions);
			if (!checkPermission(pathname, userPermissions)) {
				return NextResponse.redirect(new URL("/errors/forbidden", request.url));
			}
		}

		return NextResponse.next();
	} catch {
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
