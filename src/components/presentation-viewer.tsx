"use client";

import { PPTData } from "@/app/actions/ai-ppt";
import { Button } from "@/components/ui/button";
import { downloadPPT } from "@/lib/ppt-generator";
import { Theme, themes } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronLeft, Download, LayoutGrid, Sparkles } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface PresentationViewerProps {
  id: string;
  title: string;
  content: PPTData;
  themeId: string;
}

export default function PresentationViewer({
  title,
  content,
  themeId,
}: PresentationViewerProps) {
  const theme = themes.find((t) => t.id === themeId) || themes[0];

  const getGradStyle = (t: Theme): React.CSSProperties =>
    t.gradient
      ? {
          background: `linear-gradient(${t.gradient.angle}deg, #${t.gradient.from}${t.gradient.mid ? `, #${t.gradient.mid}` : ""}, #${t.gradient.to})`,
        }
      : { backgroundColor: `#${t.background}` };

  const handleDownload = async () => {
    try {
      await downloadPPT(content, theme);
      toast.success("Exported!");
    } catch {
      toast.error("Export failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#07070A] text-zinc-100 font-sans antialiased relative">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[20%] -top-[20%] h-[60vh] w-[60vh] rounded-full bg-indigo-600/[0.07] blur-[140px]" />
        <div className="absolute -bottom-[15%] -right-[15%] h-[50vh] w-[50vh] rounded-full bg-cyan-500/6 blur-[140px]" />
      </div>

      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full border border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
              <Sparkles className="h-5 w-5 text-black" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Studio<span className="text-zinc-500">.ai</span>
            </span>
          </div>
        </div>
        <Button
          onClick={handleDownload}
          className="h-10 gap-2 rounded-xl bg-white px-6 font-semibold text-black hover:bg-zinc-200"
        >
          <Download className="h-4 w-4" />
          Export .pptx
        </Button>
      </nav>

      <main className="relative z-10 mx-auto max-w-5xl px-6 py-12">
        <header className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Viewing saved deck · {content.slides.length} slides · {theme.name}
            </div>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">{title}</h1>
          </div>
        </header>

        <div className="grid gap-12">
          {/* TITLE SLIDE */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
              <LayoutGrid className="h-3.5 w-3.5" />
              Title Slide
            </div>
            <SlideFrame style={getGradStyle(theme)}>
              <div
                className={cn(
                  "relative z-10 flex flex-col gap-6",
                  theme.layoutType === "split"
                    ? "items-start pl-[36%] text-left"
                    : "items-center text-center",
                )}
              >
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.45em]"
                  style={{ color: `#${theme.accentColor}` }}
                >
                  A Presentation by Studio.ai
                </span>
                <h2
                  className="max-w-[90%] text-4xl font-bold uppercase leading-tight tracking-tight md:text-5xl"
                  style={{ color: `#${theme.titleColor}` }}
                >
                  {content.title}
                </h2>
                <div
                  className="h-1.5 w-20 rounded-full"
                  style={{ backgroundColor: `#${theme.accentColor}` }}
                />
              </div>
              {theme.layoutType === "split" && (
                <div
                  className="absolute bottom-0 left-0 top-0 w-[32%]"
                  style={{
                    backgroundColor: `#${theme.secondaryAccent}`,
                    opacity: 0.7,
                  }}
                />
              )}
            </SlideFrame>
          </section>

          {/* CONTENT SLIDES */}
          {content.slides.map((slide, i) => (
            <section key={i} className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                <LayoutGrid className="h-3.5 w-3.5" />
                Slide {i + 1}
              </div>
              <SlideFrame style={{ backgroundColor: `#${theme.background}` }}>
                <div
                  className={cn(
                    "relative z-10 flex h-full flex-col",
                    theme.layoutType === "split" ? "pl-[36%]" : "",
                  )}
                >
                  {theme.layoutType === "split" && (
                    <div
                      className="absolute bottom-0 left-0 top-0 w-[32%] flex flex-col justify-center p-8"
                      style={{ backgroundColor: `#${theme.secondaryAccent}` }}
                    >
                      <h3
                        className="text-2xl font-bold leading-tight"
                        style={{ color: `#${theme.titleColor}` }}
                      >
                        {slide.title}
                      </h3>
                      <div
                        className="mt-4 h-0.5 w-12 rounded-full"
                        style={{ backgroundColor: `#${theme.accentColor}` }}
                      />
                    </div>
                  )}

                  {theme.layoutType !== "split" && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between">
                        <h3
                          className="text-2xl font-bold"
                          style={{ color: `#${theme.titleColor}` }}
                        >
                          {slide.title}
                        </h3>
                        <span
                          className="text-xs font-bold opacity-30"
                          style={{ color: `#${theme.contentColor}` }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div
                        className="mt-3 h-0.5 w-12 rounded-full"
                        style={{ backgroundColor: `#${theme.accentColor}` }}
                      />
                    </div>
                  )}

                  <div
                    className={cn(
                      "grid flex-1 content-start gap-4",
                      slide.content.length > 4 ? "grid-cols-2" : "grid-cols-1",
                    )}
                  >
                    {slide.content.map((pt, pi) => (
                      <div
                        key={pi}
                        className="flex items-start gap-3 text-[13px] leading-relaxed"
                      >
                        <span
                          className="mt-1 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md text-[9px] font-bold"
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

                  <div className="mt-auto flex items-center justify-between border-t border-zinc-800 pt-4 opacity-30">
                    <span
                      className="text-[8px] font-bold uppercase tracking-widest"
                      style={{ color: `#${theme.contentColor}` }}
                    >
                      Created with Studio.ai
                    </span>
                    <span
                      className="text-[8px] font-bold"
                      style={{ color: `#${theme.contentColor}` }}
                    >
                      {content.title}
                    </span>
                  </div>
                </div>
              </SlideFrame>
            </section>
          ))}

          {/* CLOSING SLIDE */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
              <LayoutGrid className="h-3.5 w-3.5" />
              Closing Slide
            </div>
            <SlideFrame
              style={
                theme.gradient
                  ? getGradStyle(theme)
                  : { backgroundColor: `#${theme.secondaryAccent}` }
              }
            >
              <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                <h2
                  className="text-5xl font-bold tracking-tight"
                  style={{
                    color: theme.gradient ? "#FFF" : `#${theme.titleColor}`,
                  }}
                >
                  Thank You
                </h2>
                <div
                  className="h-1.5 w-16 rounded-full"
                  style={{ backgroundColor: `#${theme.accentColor}` }}
                />
                <p
                  className="text-lg opacity-70"
                  style={{
                    color: theme.gradient ? "#FFF" : `#${theme.contentColor}`,
                  }}
                >
                  Questions & Discussion
                </p>
              </div>
            </SlideFrame>
          </section>
        </div>
      </main>
    </div>
  );
}

function SlideFrame({
  children,
  style,
}: {
  children: React.ReactNode;
  style: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="relative aspect-video w-full overflow-hidden rounded-3xl border border-zinc-800 p-12 shadow-2xl backdrop-blur-3xl"
      style={style}
    >
      {children}
    </motion.div>
  );
}
