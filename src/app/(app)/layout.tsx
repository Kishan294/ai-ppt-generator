import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lightweight check: verify session cookie exists as a fallback guard
  // The proxy.ts handles the primary redirect logic
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token");

  if (!sessionToken) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}
