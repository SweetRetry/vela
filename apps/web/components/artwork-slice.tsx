"use client"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { Check, Copy, Expand } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import Markdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

import type { Artwork } from "@/lib/artworks"

import styles from "./artwork-slice.module.css"

const promptMarkdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mt-6 mb-3 text-lg leading-tight tracking-[-0.02em] first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-6 mb-2 font-mono text-[10px] text-foreground/70 uppercase tracking-[0.06em] first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => <h3 className="mt-5 mb-2 font-medium text-xs leading-5">{children}</h3>,
  p: ({ children }) => (
    <p className="my-3 text-foreground/75 text-xs leading-6 first:mt-0 last:mb-0">{children}</p>
  ),
  a: ({ children, ...props }) => (
    <a
      className="text-primary underline underline-offset-4 hover:text-foreground"
      target="_blank"
      rel="noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-primary border-l-2 pl-3 text-foreground/70 italic">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul className="my-3 list-disc space-y-1.5 pl-4 text-foreground/75 text-xs leading-6">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-3 list-decimal space-y-1.5 pl-4 text-foreground/75 text-xs leading-6">
      {children}
    </ol>
  ),
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto border border-border bg-muted p-3 font-mono text-[10px] leading-5 [&>code]:bg-transparent [&>code]:p-0">
      {children}
    </pre>
  ),
  code: ({ className, children, ...props }) => (
    <code className={cn("bg-muted px-1 py-0.5 font-mono text-[0.9em]", className)} {...props}>
      {children}
    </code>
  ),
  hr: () => <hr className="my-6 border-border" />,
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-left text-xs">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-border bg-muted px-2 py-1.5 font-medium">{children}</th>
  ),
  td: ({ children }) => <td className="border border-border px-2 py-1.5">{children}</td>,
}

type ArtworkSliceProps = {
  artwork: Artwork
  priority: boolean
  onOpenArtwork: () => void
}

export function ArtworkSlice({ artwork, priority, onOpenArtwork }: ArtworkSliceProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle")

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(artwork.originalPrompt)
      setCopyStatus("copied")
    } catch {
      setCopyStatus("error")
    }
  }

  return (
    <section
      className="grid min-h-0 gap-5 bg-background px-4 py-5 text-foreground md:px-8 md:py-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8"
      id={artwork.slug}
      aria-labelledby={`artwork-${artwork.id}-title`}
    >
      <figure className="min-w-0 self-start">
        <div
          className={cn(
            "relative aspect-video overflow-hidden border border-border bg-muted",
            styles.frame
          )}
        >
          <Image
            src={artwork.image}
            alt={artwork.alt}
            fill
            priority={priority}
            sizes="(max-width: 1023px) 100vw, calc(100vw - 400px)"
            className="object-contain"
          />
          <Button
            className="absolute right-3 bottom-3 z-10 h-9 rounded-none border border-border bg-background/90 px-3 font-mono text-[10px] text-foreground uppercase shadow-none backdrop-blur-sm hover:bg-foreground hover:text-background"
            variant="outline"
            type="button"
            onClick={onOpenArtwork}
          >
            <Expand aria-hidden="true" strokeWidth={1.7} />
            全屏查看
          </Button>
        </div>
      </figure>

      <aside
        className={cn(
          "flex min-w-0 flex-col border-border border-t pt-5 lg:border-t-0 lg:pt-0",
          styles.details
        )}
      >
        <h1
          className={cn(
            "font-normal text-[clamp(44px,12vw,68px)] leading-[0.88] tracking-[-0.07em] lg:text-[64px]",
            styles.display
          )}
          id={`artwork-${artwork.id}-title`}
        >
          <span className="block">{artwork.englishTitle}</span>
        </h1>

        <p className="mt-6 max-w-[42ch] text-foreground/75 text-sm leading-7">{artwork.summary}</p>

        <dl className="mt-6 border-border border-t text-xs">
          <div className="grid grid-cols-[64px_1fr] gap-3 border-border border-b py-3">
            <dt className="text-muted-foreground">时间</dt>
            <dd>{artwork.time}</dd>
          </div>
          <div className="grid grid-cols-[64px_1fr] gap-3 border-border border-b py-3">
            <dt className="text-muted-foreground">尺寸</dt>
            <dd>{artwork.dimensions}</dd>
          </div>
        </dl>

        <section
          className="mt-4 flex min-h-0 flex-col border-border border-t lg:flex-1"
          aria-labelledby={`prompt-${artwork.id}-title`}
        >
          <header className="flex min-h-11 shrink-0 items-center justify-between gap-3 border-border border-b px-1">
            <h2
              className="font-mono text-[10px] text-primary uppercase tracking-[0.07em]"
              id={`prompt-${artwork.id}-title`}
            >
              Original prompt
            </h2>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] text-muted-foreground tracking-[0.04em]">
                滚动查看
              </span>
              <Button
                className="h-8 rounded-none px-2 font-mono text-[10px] uppercase"
                variant="ghost"
                type="button"
                onClick={copyPrompt}
              >
                {copyStatus === "copied" ? (
                  <Check aria-hidden="true" />
                ) : (
                  <Copy aria-hidden="true" />
                )}
                <span aria-live="polite">
                  {copyStatus === "copied"
                    ? "已复制"
                    : copyStatus === "error"
                      ? "复制失败"
                      : "复制"}
                </span>
              </Button>
            </div>
          </header>
          <div className={styles.promptViewport}>
            <section
              className={cn(
                "h-full max-h-72 overflow-y-auto overscroll-contain pt-3 pr-2 pb-10 lg:max-h-none",
                styles.promptBody
              )}
              aria-label={`${artwork.title}原始 prompt 正文`}
            >
              <Markdown remarkPlugins={[remarkGfm]} components={promptMarkdownComponents}>
                {artwork.originalPrompt}
              </Markdown>
            </section>
          </div>
        </section>
      </aside>
    </section>
  )
}
