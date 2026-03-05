"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { downloadPPT } from "@/lib/ppt-generator";
import { themes, type Theme } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ClipboardPaste,
  Download,
  Lightbulb,
  Loader2,
  LogOut,
  Sparkles,
  User,
  Wand2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  generatePPTContent,
  generatePPTFromContent,
  type PPTData,
} from "@/app/actions/ai-ppt";
import { savePresentation } from "@/app/actions/presentation";
import Link from "next/link";

/* ─── helpers ─── */
const getGradStyle = (t: Theme): React.CSSProperties =>
  t.gradient
    ? {
        background: `linear-gradient(${t.gradient.angle}deg, #${t.gradient.from}${t.gradient.mid ? `, #${t.gradient.mid}` : ""}, #${t.gradient.to})`,
      }
    : { backgroundColor: `#${t.background}` };

/* ─── animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
};

export default function GeneratePage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [pastedContent, setPastedContent] = useState("");
  const [mode, setMode] = useState<"topic" | "content">("topic");
  const [generating, setGenerating] = useState(false);
  const [pptData, setPptData] = useState<PPTData | null>(null);
  const [theme, setTheme] = useState<Theme>(themes[0]);
  const [signingOut, setSigningOut] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  /* ── sign out ── */
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

  /* ── generate ── */
  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "topic" && !topic.trim())
      return toast.error("Enter a topic first");
    if (mode === "content" && !pastedContent.trim())
      return toast.error("Paste your content first");
    setGenerating(true);
    try {
      const data =
        mode === "topic"
          ? await generatePPTContent(topic)
          : await generatePPTFromContent(pastedContent);
      setPptData(data);

      // Auto-save to database
      await savePresentation({
        title: data.title,
        topic: mode === "topic" ? topic : undefined,
        themeId: theme.id,
        slideCount: data.slides.length,
        content: data,
      });

      toast.success("PPT created!");
      setTimeout(
        () => previewRef.current?.scrollIntoView({ behavior: "smooth" }),
        400,
      );
    } catch (error) {
      console.error(error);
      toast.error("Generation failed — check your API key.");
    } finally {
      setGenerating(false);
    }
  };

  /* ── download ── */
  const download = async () => {
    if (!pptData) return;
    try {
      await downloadPPT(pptData, theme);
      toast.success("Exported!");
    } catch {
      toast.error("Export failed");
    }
  };

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
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
            <Sparkles className="h-5 w-5 text-black" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Studio<span className="text-zinc-500">.ai</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 text-xs text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800"
            >
              My Presentations
            </Button>
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-400 backdrop-blur">
            <User className="h-3.5 w-3.5" />
            <span>Account</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            disabled={signingOut}
            className="h-9 gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 text-xs text-zinc-400 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          >
            {signingOut ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <LogOut className="h-3.5 w-3.5" />
            )}
            Sign out
          </Button>
        </motion.div>
      </nav>

      <main className="relative z-10 mx-auto max-w-6xl space-y-28 px-6 pb-32">
        {/* ━━━━━ HERO ━━━━━ */}
        <section className="pt-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-5"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-1 text-xs font-medium text-zinc-400 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Powered by Gemini
            </span>
            <h1 className="mx-auto max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight sm:text-7xl">
              Create stunning
              <br />
              <span className="bg-linear-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                presentations
              </span>{" "}
              in seconds
            </h1>
            <p className="mx-auto max-w-xl text-lg text-zinc-400">
              Type a topic or paste your content — AI will craft a professional
              deck for you, ready to download as .pptx.
            </p>
          </motion.div>

          {/* ── mode tabs + input ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mx-auto mt-10 max-w-2xl space-y-4"
          >
            {/* Mode Toggle */}
            <div className="flex items-center justify-center gap-1 rounded-full border border-zinc-800 bg-zinc-900/60 p-1 w-fit mx-auto backdrop-blur">
              <button
                onClick={() => setMode("topic")}
                className={cn(
                  "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all",
                  mode === "topic"
                    ? "bg-white text-black shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200",
                )}
              >
                <Lightbulb className="h-3.5 w-3.5" />
                Topic
              </button>
              <button
                onClick={() => setMode("content")}
                className={cn(
                  "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all",
                  mode === "content"
                    ? "bg-white text-black shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200",
                )}
              >
                <ClipboardPaste className="h-3.5 w-3.5" />
                Paste Content
              </button>
            </div>

            <form onSubmit={generate} className="group relative">
              <div className="absolute -inset-px rounded-2xl bg-linear-to-r from-indigo-500/40 via-cyan-500/40 to-emerald-500/40 opacity-0 blur-sm transition-opacity duration-700 group-focus-within:opacity-100" />

              <AnimatePresence mode="wait">
                {mode === "topic" ? (
                  <motion.div
                    key="topic"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="relative flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-2 pl-5 backdrop-blur-2xl"
                  >
                    <Wand2 className="h-5 w-5 shrink-0 text-zinc-500" />
                    <Input
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      disabled={generating}
                      placeholder="Describe your presentation topic…"
                      className="h-12 border-none bg-transparent text-base placeholder:text-zinc-600 focus-visible:ring-0"
                    />
                    <Button
                      type="submit"
                      disabled={generating || !topic.trim()}
                      className="h-11 shrink-0 rounded-xl bg-white px-6 font-semibold text-black hover:bg-zinc-200"
                    >
                      {generating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Generate"
                      )}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="relative flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 backdrop-blur-2xl"
                  >
                    <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                      <ClipboardPaste className="h-3.5 w-3.5" />
                      Paste your article, notes, or any text below
                    </div>
                    <textarea
                      value={pastedContent}
                      onChange={(e) => setPastedContent(e.target.value)}
                      disabled={generating}
                      placeholder={
                        "Paste your content here…\n\nFor example: meeting notes, blog post, research paper, article, course outline, or any raw text. AI will analyze it and create a structured presentation."
                      }
                      rows={7}
                      className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 text-sm leading-relaxed text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-700 focus:outline-none focus:ring-0"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-zinc-600">
                        {pastedContent.length > 0
                          ? `${pastedContent.split(/\s+/).filter(Boolean).length} words`
                          : "No content pasted yet"}
                      </span>
                      <Button
                        type="submit"
                        disabled={generating || !pastedContent.trim()}
                        className="h-10 shrink-0 rounded-xl bg-white px-6 font-semibold text-black hover:bg-zinc-200"
                      >
                        {generating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Generate from Content"
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </section>

        {/* ━━━━━ THEME PICKER ━━━━━ */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Visual Styles</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Choose a theme — the preview updates instantly.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {themes.map((t, i) => {
              const selected = theme.id === t.id;
              return (
                <motion.button
                  key={t.id}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  custom={i}
                  onClick={() => setTheme(t)}
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-xl border transition-all duration-200",
                    selected
                      ? "border-indigo-500 ring-2 ring-indigo-500/30"
                      : "border-zinc-800 hover:border-zinc-700",
                  )}
                >
                  {/* swatch */}
                  <div
                    className="relative aspect-video overflow-hidden"
                    style={getGradStyle(t)}
                  >
                    {/* mini slide mockup */}
                    <div className="absolute inset-0 flex flex-col justify-between p-3">
                      <div className="space-y-1">
                        <div
                          className="h-2 w-14 rounded-full"
                          style={{
                            backgroundColor: `#${t.titleColor}`,
                            opacity: 0.7,
                          }}
                        />
                        <div
                          className="h-1 w-8 rounded-full"
                          style={{
                            backgroundColor: `#${t.accentColor}`,
                            opacity: 0.5,
                          }}
                        />
                      </div>
                      <div className="space-y-[3px]">
                        <div
                          className="h-[3px] w-12 rounded-full"
                          style={{
                            backgroundColor: `#${t.contentColor}`,
                            opacity: 0.35,
                          }}
                        />
                        <div
                          className="h-[3px] w-9 rounded-full"
                          style={{
                            backgroundColor: `#${t.contentColor}`,
                            opacity: 0.25,
                          }}
                        />
                        <div
                          className="h-[3px] w-6 rounded-full"
                          style={{
                            backgroundColor: `#${t.contentColor}`,
                            opacity: 0.2,
                          }}
                        />
                      </div>
                    </div>
                    {/* layout-specific mockup details */}
                    {t.layoutType === "split" && (
                      <div
                        className="absolute bottom-0 left-0 top-0 w-[28%]"
                        style={{
                          backgroundColor: `#${t.secondaryAccent}`,
                          opacity: 0.5,
                        }}
                      />
                    )}
                    {t.layoutType === "editorial" && (
                      <div
                        className="absolute left-3 right-3 top-[20%] h-px"
                        style={{
                          backgroundColor: `#${t.accentColor}`,
                          opacity: 0.4,
                        }}
                      />
                    )}
                    {t.layoutType === "tech" && (
                      <div
                        className="absolute left-0 right-0 top-0 h-[4px]"
                        style={{
                          backgroundColor: `#${t.accentColor}`,
                          opacity: 0.7,
                        }}
                      />
                    )}
                    {t.layoutType === "bold" && (
                      <div
                        className="absolute left-0 top-0 bottom-0 w-[4px]"
                        style={{
                          backgroundColor: `#${t.accentColor}`,
                          opacity: 0.8,
                        }}
                      />
                    )}
                  </div>
                  {/* info */}
                  <div className="bg-zinc-900/80 px-3 py-2.5 text-left">
                    <p className="text-xs font-semibold text-zinc-200">
                      {t.name}
                    </p>
                    <p className="mt-0.5 text-[10px] text-zinc-500">{t.tag}</p>
                    {/* color dots */}
                    <div className="mt-1.5 flex gap-1">
                      {[
                        t.accentColor,
                        t.titleColor,
                        t.contentColor,
                        t.secondaryAccent,
                      ].map((c, ci) => (
                        <span
                          key={ci}
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: `#${c}` }}
                        />
                      ))}
                    </div>
                  </div>
                  {/* selected mark */}
                  {selected && (
                    <motion.div
                      layoutId="sel"
                      className="absolute right-2 top-2 rounded-full bg-indigo-500 p-1 shadow-lg shadow-indigo-500/40"
                    >
                      <Check className="h-2.5 w-2.5 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* ━━━━━ LIVE PREVIEW ━━━━━ */}
        <AnimatePresence>
          {pptData && (
            <motion.section
              ref={previewRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              {/* header bar */}
              <div className="flex flex-col gap-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live Preview · {pptData.slides.length} slides · {theme.name}
                  </div>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                    {pptData.title}
                  </h2>
                </div>
                <Button
                  onClick={download}
                  className="h-12 gap-2 rounded-xl bg-white px-6 font-semibold text-black hover:bg-zinc-200"
                >
                  <Download className="h-4 w-4" />
                  Export .pptx
                </Button>
              </div>

              {/* slide grid */}
              <div className="grid gap-8 md:grid-cols-2">
                {/* ── TITLE SLIDE ── */}
                <SlideFrame style={getGradStyle(theme)} idx={-1}>
                  {/* decorations */}
                  {(theme.layoutType === "bold" ||
                    theme.layoutType === "tech") && (
                    <>
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1"
                        style={{ backgroundColor: `#${theme.accentColor}` }}
                      />
                      <div
                        className="absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-10 blur-2xl"
                        style={{ backgroundColor: `#${theme.accentColor}` }}
                      />
                    </>
                  )}
                  {theme.layoutType === "split" && (
                    <div
                      className="absolute bottom-0 left-0 top-0 w-[32%]"
                      style={{
                        backgroundColor: `#${theme.secondaryAccent}`,
                        opacity: 0.6,
                      }}
                    />
                  )}
                  {theme.layoutType === "editorial" && (
                    <>
                      <div
                        className="absolute left-[8%] right-[8%] top-[22%] h-px"
                        style={{
                          backgroundColor: `#${theme.accentColor}`,
                          opacity: 0.5,
                        }}
                      />
                      <div
                        className="absolute bottom-[22%] left-[8%] right-[8%] h-px"
                        style={{
                          backgroundColor: `#${theme.accentColor}`,
                          opacity: 0.5,
                        }}
                      />
                    </>
                  )}
                  <div
                    className={cn(
                      "relative z-10 flex flex-col gap-5",
                      theme.layoutType === "split"
                        ? "items-start pl-[36%] text-left"
                        : "items-center text-center",
                    )}
                  >
                    <span
                      className="text-[9px] font-bold uppercase tracking-[0.35em]"
                      style={{ color: `#${theme.accentColor}` }}
                    >
                      A Presentation by Studio.ai
                    </span>
                    <h3
                      className="max-w-[85%] text-3xl font-bold uppercase leading-tight tracking-tight md:text-4xl"
                      style={{ color: `#${theme.titleColor}` }}
                    >
                      {pptData.title}
                    </h3>
                    <div
                      className="h-1 w-16 rounded-full"
                      style={{ backgroundColor: `#${theme.accentColor}` }}
                    />
                  </div>
                </SlideFrame>

                {/* ── CONTENT SLIDES ── */}
                {pptData.slides.map((slide, i) => (
                  <SlideFrame
                    key={i}
                    style={{ backgroundColor: `#${theme.background}` }}
                    idx={i}
                  >
                    {/* layout decorations */}
                    {theme.layoutType === "bold" && (
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1"
                        style={{ backgroundColor: `#${theme.accentColor}` }}
                      />
                    )}
                    {theme.layoutType === "split" && (
                      <div
                        className="absolute bottom-0 left-0 top-0 w-[32%] flex flex-col justify-center p-5"
                        style={{ backgroundColor: `#${theme.secondaryAccent}` }}
                      >
                        <span
                          className="text-lg font-bold leading-snug"
                          style={{ color: `#${theme.titleColor}` }}
                        >
                          {slide.title}
                        </span>
                        <div
                          className="mt-3 h-0.5 w-10 rounded-full"
                          style={{ backgroundColor: `#${theme.accentColor}` }}
                        />
                      </div>
                    )}
                    {theme.layoutType === "editorial" && (
                      <div
                        className="absolute bottom-0 left-[5%] top-0 w-px opacity-30"
                        style={{ backgroundColor: `#${theme.accentColor}` }}
                      />
                    )}
                    {theme.layoutType === "tech" && (
                      <>
                        <div
                          className="absolute left-0 right-0 top-0 h-0.5"
                          style={{ backgroundColor: `#${theme.accentColor}` }}
                        />
                        <div
                          className="absolute bottom-0 left-0 right-0 h-0.5 opacity-40"
                          style={{ backgroundColor: `#${theme.accentColor}` }}
                        />
                      </>
                    )}

                    <div
                      className={cn(
                        "relative z-10 flex h-full flex-col",
                        theme.layoutType === "split" ? "pl-[36%]" : "",
                      )}
                    >
                      {/* title (skip for split — shown in sidebar) */}
                      {theme.layoutType !== "split" && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between">
                            <h4
                              className="text-lg font-bold"
                              style={{ color: `#${theme.titleColor}` }}
                            >
                              {slide.title}
                            </h4>
                            <span
                              className="text-[10px] font-semibold opacity-30"
                              style={{ color: `#${theme.contentColor}` }}
                            >
                              {String(i + 1).padStart(2, "0")}
                            </span>
                          </div>
                          <div
                            className="mt-2 h-0.5 w-10 rounded-full"
                            style={{ backgroundColor: `#${theme.accentColor}` }}
                          />
                        </div>
                      )}

                      {/* bullet points */}
                      <div
                        className={cn(
                          "grid flex-1 content-start gap-3",
                          slide.content.length > 4
                            ? "grid-cols-2"
                            : "grid-cols-1",
                        )}
                      >
                        {slide.content.map((pt, pi) => (
                          <div
                            key={pi}
                            className="flex items-start gap-2.5 text-[11px] leading-relaxed"
                          >
                            <span
                              className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded text-[8px] font-bold"
                              style={{
                                backgroundColor: `#${theme.accentColor}22`,
                                color: `#${theme.accentColor}`,
                              }}
                            >
                              {pi + 1}
                            </span>
                            <span style={{ color: `#${theme.contentColor}` }}>
                              {pt}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* footer */}
                      <div
                        className="mt-auto flex items-center justify-between border-t pt-2 opacity-25"
                        style={{ borderColor: `#${theme.contentColor}22` }}
                      >
                        <div className="flex gap-0.5">
                          {[1, 2, 3].map((d) => (
                            <div
                              key={d}
                              className="h-1 w-1 rounded-full"
                              style={{
                                backgroundColor:
                                  d === 1
                                    ? `#${theme.accentColor}`
                                    : `#${theme.contentColor}44`,
                              }}
                            />
                          ))}
                        </div>
                        <span
                          className="text-[7px] font-bold uppercase tracking-widest"
                          style={{ color: `#${theme.contentColor}` }}
                        >
                          Confidential
                        </span>
                      </div>
                    </div>
                  </SlideFrame>
                ))}

                {/* ── CLOSING SLIDE ── */}
                <SlideFrame
                  style={
                    theme.gradient
                      ? getGradStyle(theme)
                      : { backgroundColor: `#${theme.secondaryAccent}` }
                  }
                  idx={pptData.slides.length}
                >
                  {(theme.layoutType === "bold" ||
                    theme.layoutType === "tech") && (
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{ backgroundColor: `#${theme.accentColor}` }}
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                    <span
                      className="text-[9px] font-bold uppercase tracking-[0.4em] opacity-60"
                      style={{
                        color: theme.gradient
                          ? "#FFFFFF"
                          : `#${theme.accentColor}`,
                      }}
                    >
                      End of Presentation
                    </span>
                    <h3
                      className="text-4xl font-bold tracking-tight"
                      style={{
                        color: theme.gradient
                          ? "#FFFFFF"
                          : `#${theme.titleColor}`,
                      }}
                    >
                      Thank You
                    </h3>
                    <div
                      className="h-1 w-12 rounded-full"
                      style={{ backgroundColor: `#${theme.accentColor}` }}
                    />
                    <p
                      className="text-sm opacity-70"
                      style={{
                        color: theme.gradient
                          ? "#FFFFFF"
                          : `#${theme.contentColor}`,
                      }}
                    >
                      Questions & Discussion
                    </p>
                  </div>
                </SlideFrame>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
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

/* ─────────────────────────────────────────────
   SlideFrame — reusable slide preview wrapper
   ───────────────────────────────────────────── */
function SlideFrame({
  children,
  style,
  idx,
}: {
  children: React.ReactNode;
  style: React.CSSProperties;
  idx: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.08 * (idx + 1),
        duration: 0.5,
        ease: [0.25, 1, 0.5, 1],
      }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      className="group relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-2xl p-8 shadow-xl ring-1 ring-white/6"
      style={style}
    >
      {children}
    </motion.div>
  );
}
