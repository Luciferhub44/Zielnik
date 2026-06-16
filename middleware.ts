import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPatientRoute = createRouteMatcher(['/patient(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isPatientRoute(req)) await auth.protect()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/__clerk/:path*',
    '/(api|trpc)(.*)',
  ],
}
