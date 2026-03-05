"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Calendar,
  ShieldCheck,
  LogOut,
  Sparkles,
  ChevronLeft,
  Settings,
  CreditCard,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AccountPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await authClient.signOut();
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
    } finally {
      setSigningOut(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07070A]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) return null;

  const user = session.user;

  return (
    <div className="min-h-screen bg-[#07070A] text-zinc-100 font-sans antialiased relative">
      {/* ━━ ambient blobs ━━ */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[70vh] w-[70vh] rounded-full bg-indigo-600/5 blur-[140px]" />
        <div className="absolute -bottom-[20%] -right-[10%] h-[60vh] w-[60vh] rounded-full bg-emerald-500/5 blur-[140px]" />
      </div>

      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/60 text-zinc-400 transition-colors group-hover:border-zinc-700 group-hover:text-white">
            <ChevronLeft className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200">
            Back to Dashboard
          </span>
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
            <Sparkles className="h-5 w-5 text-black" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Studio<span className="text-zinc-500">.ai</span>
          </span>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-4xl px-6 py-12 sm:py-20">
        <div className="grid gap-10 md:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-2">
            <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Settings
            </div>
            {[
              { icon: User, label: "Profile", active: true },
              { icon: ShieldCheck, label: "Security", active: false },
              { icon: Bell, label: "Notifications", active: false },
              { icon: CreditCard, label: "Billing", active: false },
            ].map((item) => (
              <button
                key={item.label}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  item.active
                    ? "bg-white/5 text-white ring-1 ring-white/10"
                    : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
            <div className="pt-4">
              <Button
                variant="ghost"
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full justify-start gap-3 rounded-xl px-4 py-6 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </aside>

          {/* Content */}
          <div className="space-y-8">
            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 backdrop-blur sm:p-10">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-linear-to-br from-indigo-500 to-purple-600 text-3xl font-bold text-white shadow-xl shadow-indigo-500/20">
                    {user.name?.[0].toUpperCase()}
                  </div>
                  <div className="absolute -bottom-2 -right-2 rounded-xl bg-zinc-900 p-1.5 ring-1 ring-zinc-800">
                    <Settings className="h-4 w-4 text-zinc-400" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold tracking-tight">
                    {user.name}
                  </h1>
                  <p className="text-zinc-400">{user.email}</p>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      Pro Member
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-12 grid gap-6 border-t border-zinc-800/50 pt-10 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    <Mail className="h-3 w-3" />
                    Email Address
                  </label>
                  <p className="text-sm font-medium text-zinc-200">
                    {user.email}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    <Calendar className="h-3 w-3" />
                    Member Since
                  </label>
                  <p className="text-sm font-medium text-zinc-200">
                    {user.createdAt
                      ? format(new Date(user.createdAt), "MMMM d, yyyy")
                      : "N/A"}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 backdrop-blur">
              <h2 className="text-lg font-semibold">Account Usage</h2>
              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Presentations Created</span>
                    <span className="text-zinc-300 font-medium">8 / ∞</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-zinc-800">
                    <div className="h-full w-[15%] rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">AI Tokens Used</span>
                    <span className="text-zinc-300 font-medium">
                      12.4k / 50k
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-zinc-800">
                    <div className="h-full w-[25%] rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}
