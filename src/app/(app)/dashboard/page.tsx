"use server";

import { getUserPresentations } from "@/app/actions/presentation";
import { Button } from "@/components/ui/button";
import { themes } from "@/lib/themes";
import { format } from "date-fns";
import { DeletePresentationButton } from "@/components/delete-presentation-button";
import {
  ChevronRight,
  Clock,
  FileText,
  LayoutGrid,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const presentations = await getUserPresentations();

  return (
    <div className="min-h-screen bg-[#07070A] text-zinc-100 font-sans antialiased relative">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[20%] -top-[20%] h-[60vh] w-[60vh] rounded-full bg-indigo-600/[0.07] blur-[140px]" />
        <div className="absolute -bottom-[15%] -right-[15%] h-[50vh] w-[50vh] rounded-full bg-cyan-500/6 blur-[140px]" />
      </div>

      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/generate" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
            <Sparkles className="h-5 w-5 text-black" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Studio<span className="text-zinc-500">.ai</span>
          </span>
        </Link>
        <Link href="/generate">
          <Button className="rounded-full bg-white text-black hover:bg-zinc-200">
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </Link>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight">
            My Presentations
          </h1>
          <p className="mt-2 text-zinc-400">
            Manage and view your AI-generated decks.
          </p>
        </header>

        {presentations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-900 bg-zinc-900/40 py-24 text-center backdrop-blur">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800">
              <LayoutGrid className="h-8 w-8 text-zinc-500" />
            </div>
            <h3 className="text-xl font-semibold">No presentations yet</h3>
            <p className="mt-2 max-w-xs text-zinc-500">
              Generate your first presentation with AI and it will appear here.
            </p>
            <Link href="/generate" className="mt-8">
              <Button className="h-11 rounded-xl bg-white px-8 font-semibold text-black hover:bg-zinc-200">
                Start Generating
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {presentations.map((ppt) => {
              const theme =
                themes.find((t) => t.id === ppt.themeId) || themes[0];
              const gradStyle = theme.gradient
                ? {
                    background: `linear-gradient(${theme.gradient.angle}deg, #${theme.gradient.from}${theme.gradient.mid ? `, #${theme.gradient.mid}` : ""}, #${theme.gradient.to})`,
                  }
                : { backgroundColor: `#${theme.background}` };

              return (
                <Link
                  key={ppt.id}
                  href={`/view/${ppt.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 transition-all hover:border-zinc-700 hover:bg-zinc-900/80"
                >
                  {/* Thumbnail Preview */}
                  <div
                    className="relative aspect-video w-full overflow-hidden"
                    style={gradStyle}
                  >
                    {/* Decorative mockup */}
                    <div className="absolute inset-0 flex flex-col justify-center gap-2 p-6 text-center">
                      <div
                        className="mx-auto h-2 w-20 rounded-full opacity-40"
                        style={{ backgroundColor: `#${theme.titleColor}` }}
                      />
                      <div
                        className="mx-auto h-5 w-3/4 rounded-md font-bold uppercase"
                        style={{ color: `#${theme.titleColor}`, opacity: 0.8 }}
                      >
                        {/* Mock text preview */}
                      </div>
                      <div
                        className="mx-auto h-1 w-12 rounded-full"
                        style={{ backgroundColor: `#${theme.accentColor}` }}
                      />
                    </div>

                    {theme.layoutType === "split" && (
                      <div
                        className="absolute bottom-0 left-0 top-0 w-[30%]"
                        style={{
                          backgroundColor: `#${theme.secondaryAccent}`,
                          opacity: 0.6,
                        }}
                      />
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
                        <ChevronRight className="h-6 w-6" />
                      </div>
                    </div>

                    {/* Delete button (top right) */}
                    <div className="absolute right-3 top-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-200">
                      <DeletePresentationButton id={ppt.id} />
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="p-5">
                    <h3 className="line-clamp-1 text-lg font-semibold text-zinc-100">
                      {ppt.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5" />
                        <span>{ppt.slideCount} Slides</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {format(new Date(ppt.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="rounded-full border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-[10px] font-medium text-zinc-400 capitalize">
                        {theme.name}
                      </span>
                      {ppt.topic && (
                        <span className="line-clamp-1 flex-1 text-[10px] text-zinc-600 italic">
                          &quot;{ppt.topic}&quot;
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
