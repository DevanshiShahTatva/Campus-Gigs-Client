import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ROLE, ROUTES } from "./utils/constant";

const userDefaultRoute = ROUTES.HOME;
const adminDefaultRoute = ROUTES.ADMIN.DASHBOARD;

const publicRoutes = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.SIGN_UP,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
];

const adminRoutes = [
  ROUTES.ADMIN.DASHBOARD,
  ROUTES.ADMIN.SUBSCRIPTION,
  ROUTES.ADMIN.SUPPORT_REQUESTS,
  ROUTES.ADMIN.FAQS,
  ROUTES.ADMIN.CREATE_FAQs,
  ROUTES.ADMIN.PRIVACY_POLICY,
  ROUTES.ADMIN.TERMS_CONDITIONS,
  ROUTES.ADMIN.TIRE,
  ROUTES.ADMIN.GIGCATEGORY,
  ROUTES.ADMIN.SERVICE_MANAGEMENT,
  ROUTES.ADMIN.USERS,
  ROUTES.ADMIN.USER_DETAILS,
];

const userRoutes = [
  ROUTES.USER.DASHBOARD,
  ROUTES.USER.BUY_SUBSCRIPTION,
  ROUTES.USER.BUY_SUBSCRIPTION_CHECKOUT,
  ROUTES.USER.PROFILE,
  ROUTES.USER.GIGS,
  ROUTES.USER.GIGS_CREATE,
  ROUTES.USER.PROVIDER,
  ROUTES.USER.CHAT,
];

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(currentPath);
  if (isPublicRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  if (!token) {
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
    }
    return NextResponse.next();
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_TOKEN_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userRole = payload.role as string;

    if (!userRole) {
      return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
    }

    const roleRoutes: Record<string, string[]> = {
      [ROLE.Admin]: adminRoutes,
      [ROLE.User]: userRoutes,
    };

    const defaultRoutes: Record<string, string> = {
      [ROLE.Admin]: adminDefaultRoute,
      [ROLE.User]: userDefaultRoute,
    };

    const allowedRoutes = roleRoutes[userRole] || [];
    const defaultRedirect = defaultRoutes[userRole] || "/";

    const isAllowed = allowedRoutes.some((route) =>
      currentPath.startsWith(route)
    );
    if (!isAllowed) {
      return NextResponse.redirect(new URL(defaultRedirect, request.url));
    }

    // Protect /profile, /gigs, and /provider routes
    const isProtected =
      currentPath.startsWith("/profile") ||
      currentPath.startsWith("/gigs") ||
      currentPath.startsWith("/gigs/create") ||
      currentPath.startsWith("/provider") ||
      currentPath.startsWith("/chat") ||
      currentPath.startsWith("/buy-subscription") ||
      currentPath.startsWith("/buy-subscription/:id/checkout");

    if (isProtected && !token) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Err:", error);
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/admin/:path*",
    "/user/:path*",
    "/profile/:path*",
    "/gigs/:path*",
    "/provider/:path*",
    "/chat/:path*",
    "/buy-subscription/:path*",
  ],
};
