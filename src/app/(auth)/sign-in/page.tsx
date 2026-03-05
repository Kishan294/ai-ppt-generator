"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isValid =
    email.includes("@") && email.includes(".") && password.length >= 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError("");

    try {
      const { error: authError } = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        setError(authError.message || "Invalid credentials. Please try again.");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/generate"), 1200);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-zinc-800/60 bg-zinc-900/40 backdrop-blur-xl shadow-2xl shadow-black/20">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Welcome back
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Sign in to your Studio.ai account to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Success state */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 mb-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-400">
                    Signed in successfully!
                  </p>
                  <p className="text-xs text-emerald-400/60">
                    Redirecting to the studio...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="signin-email"
                  className="text-xs font-medium text-zinc-400"
                >
                  Email address
                </Label>
                <div className="group relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-zinc-400" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    autoFocus
                    className={cn(
                      "h-11 rounded-xl border-zinc-800 bg-zinc-950/50 pl-11 text-sm text-white placeholder:text-zinc-600",
                      "transition-all duration-200",
                      "focus:border-indigo-500/50 focus:bg-zinc-950/80 focus:ring-1 focus:ring-indigo-500/20",
                    )}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="signin-password"
                    className="text-xs font-medium text-zinc-400"
                  >
                    Password
                  </Label>
                  <a
                    href="#"
                    className="text-[11px] text-zinc-500 transition-colors hover:text-indigo-400"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="group relative">
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className={cn(
                      "h-11 rounded-xl border-zinc-800 bg-zinc-950/50 pr-11 text-sm text-white placeholder:text-zinc-600",
                      "transition-all duration-200",
                      "focus:border-indigo-500/50 focus:bg-zinc-950/80 focus:ring-1 focus:ring-indigo-500/20",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors hover:text-zinc-400"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading || !isValid}
                className={cn(
                  "group h-11 w-full rounded-xl text-sm font-semibold transition-all duration-300",
                  isValid
                    ? "bg-white text-black hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10"
                    : "bg-zinc-800 text-zinc-500",
                )}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-0">
          <Separator className="bg-zinc-800" />
          <Link href="/sign-up" className="w-full">
            <Button
              variant="outline"
              className="h-11 w-full rounded-xl border-zinc-800 bg-transparent text-sm font-medium text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/50 hover:text-white"
            >
              Don&apos;t have an account? Create one
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Button>
          </Link>
          <p className="text-center text-[11px] leading-relaxed text-zinc-600">
            By signing in, you agree to our{" "}
            <a href="#" className="text-zinc-400 underline hover:text-zinc-300">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-zinc-400 underline hover:text-zinc-300">
              Privacy Policy
            </a>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
