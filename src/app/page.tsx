import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  FileText,
  Palette,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function LandingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const isAuthenticated = !!session;

  return (
    <div className="min-h-screen bg-[#07070A] text-zinc-100 font-sans antialiased relative">
      {/* ━━ ambient blobs ━━ */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[20%] -top-[20%] h-[60vh] w-[60vh] rounded-full bg-indigo-600/[0.07] blur-[140px]" />
        <div className="absolute -bottom-[15%] -right-[15%] h-[50vh] w-[50vh] rounded-full bg-cyan-500/6 blur-[140px]" />
        <div className="absolute right-[20%] top-[30%] h-[30vh] w-[30vh] rounded-full bg-purple-500/4 blur-[120px]" />
      </div>

      {/* ━━━━━ NAV ━━━━━ */}
      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
            <Sparkles className="h-5 w-5 text-black" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Studio<span className="text-zinc-500">.ai</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link href="/generate">
              <Button className="h-9 gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black hover:bg-zinc-200">
                Go to Studio
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="h-9 rounded-full px-4 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="h-9 gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black hover:bg-zinc-200">
                  Get Started
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-32">
        {/* ━━━━━ HERO ━━━━━ */}
        <section className="pt-20 text-center sm:pt-28">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-1.5 text-xs font-medium text-zinc-400 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Advanced Generative AI
            </span>
            <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-[1.08] tracking-tight sm:text-7xl lg:text-8xl">
              Create stunning
              <br />
              <span className="bg-linear-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                presentations
              </span>{" "}
              in seconds
            </h1>
            <p className="mx-auto max-w-xl text-lg leading-relaxed text-zinc-400">
              Type a topic or paste your content — AI will craft a professional
              deck for you, ready to download as .pptx. No design skills needed.
            </p>

            {/* CTA buttons */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href={isAuthenticated ? "/generate" : "/sign-up"}>
                <Button className="h-13 gap-2 rounded-xl bg-white px-8 text-base font-semibold text-black hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10 transition-all">
                  <Wand2 className="h-4 w-4" />
                  Start Creating — Free
                </Button>
              </Link>
              <a href="#features">
                <Button
                  variant="ghost"
                  className="h-13 rounded-xl border border-zinc-800 px-6 text-base text-zinc-300 hover:bg-zinc-900 hover:text-white"
                >
                  Learn More
                </Button>
              </a>
            </div>
          </div>

          {/* ── Hero mockup ── */}
          <div className="mx-auto mt-20 max-w-4xl">
            <div className="relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-1 shadow-2xl shadow-indigo-500/5">
              {/* top bar */}
              <div className="flex items-center gap-2 rounded-t-xl bg-zinc-900/80 px-4 py-3 border-b border-zinc-800/50">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[11px] text-zinc-600">
                    studio.ai/generate
                  </span>
                </div>
              </div>
              {/* slide preview grid */}
              <div className="grid grid-cols-3 gap-3 p-5 bg-zinc-950/50">
                {[
                  {
                    bg: "bg-gradient-to-br from-indigo-600 to-purple-700",
                    label: "Title Slide",
                  },
                  {
                    bg: "bg-gradient-to-br from-zinc-800 to-zinc-900",
                    label: "Key Insights",
                  },
                  {
                    bg: "bg-gradient-to-br from-cyan-800 to-teal-900",
                    label: "Data Points",
                  },
                  {
                    bg: "bg-gradient-to-br from-zinc-800 to-zinc-900",
                    label: "Analysis",
                  },
                  {
                    bg: "bg-gradient-to-br from-zinc-800 to-zinc-900",
                    label: "Summary",
                  },
                  {
                    bg: "bg-gradient-to-br from-emerald-800 to-green-900",
                    label: "Thank You",
                  },
                ].map((slide, i) => (
                  <div
                    key={i}
                    className={`${slide.bg} aspect-video rounded-lg p-4 flex flex-col justify-between border border-white/5`}
                  >
                    <div className="space-y-1">
                      <div className="h-1.5 w-10 rounded-full bg-white/30" />
                      <div className="h-1 w-6 rounded-full bg-white/15" />
                    </div>
                    <span className="text-[8px] text-white/40 font-medium">
                      {slide.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ━━━━━ FEATURES ━━━━━ */}
        <section id="features" className="pt-32 space-y-16">
          <div className="text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-400">
              Features
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need for{" "}
              <span className="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                perfect decks
              </span>
            </h2>
            <p className="mx-auto max-w-lg text-zinc-400">
              From idea to export in under a minute. Our AI handles the
              structure, design, and formatting.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Wand2,
                title: "AI-Powered Generation",
                description:
                  "Just type a topic and our AI creates a fully structured presentation with professional content.",
                gradient: "from-indigo-500/20 to-purple-500/20",
                iconColor: "text-indigo-400",
              },
              {
                icon: Palette,
                title: "10+ Premium Themes",
                description:
                  "Choose from professionally designed themes with unique layouts — bold, editorial, split-screen, and more.",
                gradient: "from-cyan-500/20 to-teal-500/20",
                iconColor: "text-cyan-400",
              },
              {
                icon: FileText,
                title: "Paste & Transform",
                description:
                  "Have existing content? Paste any text — meeting notes, articles, research — and AI structures it into slides.",
                gradient: "from-emerald-500/20 to-green-500/20",
                iconColor: "text-emerald-400",
              },
              {
                icon: Zap,
                title: "Instant Preview",
                description:
                  "See your slides render in real-time with live theme switching. What you see is what you export.",
                gradient: "from-amber-500/20 to-orange-500/20",
                iconColor: "text-amber-400",
              },
              {
                icon: ArrowRight,
                title: "Export as .pptx",
                description:
                  "Download your presentation as a PowerPoint file, ready to present. Compatible with all major tools.",
                gradient: "from-pink-500/20 to-rose-500/20",
                iconColor: "text-pink-400",
              },
              {
                icon: Sparkles,
                title: "Professional Quality",
                description:
                  "Every slide is crafted with proper hierarchy, consistent styling, and polished layout decorations.",
                gradient: "from-violet-500/20 to-purple-500/20",
                iconColor: "text-violet-400",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/50"
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 transition-opacity group-hover:opacity-100`}
                />
                <div className="relative z-10 space-y-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/80 ${feature.iconColor}`}
                  >
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-100">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ━━━━━ CTA ━━━━━ */}
        <section className="pt-32">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/30 p-12 text-center sm:p-16">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-[20%] -top-[40%] h-[60vh] w-[60vh] rounded-full bg-indigo-600/8 blur-[120px]" />
              <div className="absolute -bottom-[30%] -right-[20%] h-[50vh] w-[50vh] rounded-full bg-cyan-500/6 blur-[120px]" />
            </div>
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to create your next{" "}
                <span className="bg-linear-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  masterpiece
                </span>
                ?
              </h2>
              <p className="mx-auto max-w-md text-zinc-400">
                Join thousands of professionals who use Studio.ai to create
                stunning presentations in seconds.
              </p>
              <Link href={isAuthenticated ? "/generate" : "/sign-up"}>
                <Button className="h-13 gap-2 rounded-xl bg-white px-8 text-base font-semibold text-black hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10 transition-all mt-4">
                  <Sparkles className="h-4 w-4" />
                  Get Started for Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ━━ footer ━━ */}
      <footer className="relative z-10 border-t border-zinc-900 bg-zinc-950/80 px-6 py-8 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <p className="text-xs text-zinc-600">© 2026 Studio.ai</p>
          <div className="flex gap-5">
            {["Twitter", "GitHub", "Discord"].map((s) => (
              <a
                key={s}
                href="#"
                className="text-xs text-zinc-600 transition-colors hover:text-zinc-300"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
