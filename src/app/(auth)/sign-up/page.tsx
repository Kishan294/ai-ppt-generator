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
  Mail,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isValid =
    name.trim().length >= 2 &&
    email.includes("@") &&
    email.includes(".") &&
    password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError("");

    try {
      const { error: authError } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        setError(authError.message || "Sign up failed. Please try again.");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/generate"), 1500);
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
            Create your account
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Start creating stunning presentations with AI
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
                    Account created!
                  </p>
                  <p className="text-xs text-emerald-400/60">
                    Redirecting you to the studio...
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

              {/* Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="signup-name"
                  className="text-xs font-medium text-zinc-400"
                >
                  Full name
                </Label>
                <div className="group relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-zinc-400" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className={cn(
                      "h-11 rounded-xl border-zinc-800 bg-zinc-950/50 pl-11 text-sm text-white placeholder:text-zinc-600",
                      "transition-all duration-200",
                      "focus:border-indigo-500/50 focus:bg-zinc-950/80 focus:ring-1 focus:ring-indigo-500/20",
                    )}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="signup-email"
                  className="text-xs font-medium text-zinc-400"
                >
                  Email address
                </Label>
                <div className="group relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-zinc-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
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
                <Label
                  htmlFor="signup-password"
                  className="text-xs font-medium text-zinc-400"
                >
                  Password
                </Label>
                <div className="group relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
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

                {/* Password strength indicator */}
                <div className="flex gap-1.5 pt-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-all duration-300",
                        password.length === 0
                          ? "bg-zinc-800"
                          : password.length >= level * 3
                            ? level <= 2
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                            : "bg-zinc-800",
                      )}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-zinc-600">
                  {password.length === 0
                    ? "Use 8+ characters with a mix of letters & numbers"
                    : password.length < 8
                      ? `${8 - password.length} more characters needed`
                      : "Strong password ✓"}
                </p>
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
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create account
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-0">
          <Separator className="bg-zinc-800" />
          <Link href="/sign-in" className="w-full">
            <Button
              variant="outline"
              className="h-11 w-full rounded-xl border-zinc-800 bg-transparent text-sm font-medium text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/50 hover:text-white"
            >
              Already have an account? Sign in
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Button>
          </Link>
          <p className="text-center text-[11px] leading-relaxed text-zinc-600">
            By creating an account, you agree to our{" "}
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
