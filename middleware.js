import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public routes (accessible without auth)
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)", // allow sign-in
  "/sign-up(.*)", // allow sign-up
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
