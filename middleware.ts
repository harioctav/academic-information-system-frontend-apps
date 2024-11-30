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

async function handleTokenRefresh(request: NextRequest) {
	const refreshToken = request.cookies.get("refresh_token")?.value;

	if (!refreshToken) {
		return null;
	}

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ refresh_token: refreshToken }),
			}
		);

		if (!response.ok) {
			return null;
		}

		const data = await response.json();
		return data.token.access_token;
	} catch {
		return null;
	}
}

export async function middleware(request: NextRequest) {
	// handle token
	const tokenCookie = request.cookies.get("token");
	const { pathname } = request.nextUrl;

	// Handle locale
	const locale = request.cookies.get("locale")?.value || "en";
	request.headers.set("x-locale", locale);

	if (request.nextUrl.pathname === "/") {
		// Check token first before redirecting to dashboard
		if (!tokenCookie?.value) {
			return NextResponse.redirect(new URL("/auth/login", request.url));
		}

		return NextResponse.redirect(new URL("/", request.url));
	}

	// Handle public routes
	if (routes.public.includes(pathname as PublicRoute)) {
		if (tokenCookie?.value) {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}
		return NextResponse.next();
	}

	// Check if token exists
	if (!tokenCookie?.value) {
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}

	try {
		const decoded = jwtDecode<JwtPayload>(tokenCookie.value);
		const currentTime = Math.floor(Date.now() / 1000);

		// Check if token is expired
		if (decoded.exp < currentTime) {
			// Try to refresh the token
			const newToken = await handleTokenRefresh(request);

			if (!newToken) {
				return NextResponse.redirect(new URL("/auth/login", request.url));
			}

			// Create response with new token
			const response = NextResponse.next();
			response.cookies.set("token", newToken, { path: "/" });
			return response;
		}

		// Check permissions for protected routes
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
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
