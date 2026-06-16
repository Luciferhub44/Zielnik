import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPatientRoute = createRouteMatcher(['/patient(.*)'])
const isPublicRoute = createRouteMatcher(['/', '/search(.*)', '/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req) && isPatientRoute(req)) await auth.protect()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/__clerk/:path*',
    '/(api|trpc)(.*)',
  ],
}
