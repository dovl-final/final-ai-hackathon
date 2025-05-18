// src/app/api/auth/[...nextauth]/route.ts
// All NextAuth functionality has been removed to make the site fully public.

export async function GET() {
  return new Response("Authentication is disabled.", { status: 404 });
}

export async function POST() {
  return new Response("Authentication is disabled.", { status: 404 });
}
