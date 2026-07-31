"use client"

import { cn } from "@workspace/ui/lib/utils"
import { Check, Copy, X } from "lucide-react"
import { type RefObject, useState } from "react"
import Markdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

import type { Artwork } from "@/lib/artworks"

import styles from "./portfolio-viewer.module.css"

const promptMarkdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mt-8 mb-3 text-xl leading-tight tracking-[-0.02em] first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-8 mb-3 font-mono text-[11px] text-foreground/60 uppercase tracking-[0.12em] first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => <h3 className="mt-6 mb-2 font-medium text-sm leading-6">{children}</h3>,
  p: ({ children }) => (
    <p className="my-4 text-foreground/80 text-sm leading-7 first:mt-0 last:mb-0">{children}</p>
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
    <blockquote className="my-5 border-primary border-l-2 pl-4 text-foreground/70 italic">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul className="my-4 list-disc space-y-2 pl-5 text-foreground/80 text-sm leading-7">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 list-decimal space-y-2 pl-5 text-foreground/80 text-sm leading-7">
      {children}
    </ol>
  ),
  pre: ({ children }) => (
    <pre className="my-5 overflow-x-auto border border-border bg-muted p-4 font-mono text-xs leading-6 [&>code]:bg-transparent [&>code]:p-0">
      {children}
    </pre>
  ),
  code: ({ className, children, ...props }) => (
    <code className={cn("bg-muted px-1 py-0.5 font-mono text-[0.9em]", className)} {...props}>
      {children}
    </code>
  ),
  hr: () => <hr className="my-8 border-border" />,
  table: ({ children }) => (
    <div className="my-5 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-border bg-muted px-3 py-2 font-medium">{children}</th>
  ),
  td: ({ children }) => <td className="border border-border px-3 py-2">{children}</td>,
}

const versoButton =
  "inline-flex h-9 cursor-pointer items-center gap-1.5 border border-foreground/25 bg-transparent px-3 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors hover:bg-foreground hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"

type ArtworkVersoProps = {
  ref: RefObject<HTMLDialogElement | null>
  artwork: Artwork
}

export function ArtworkVerso({ ref, artwork }: ArtworkVersoProps) {
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
    <dialog ref={ref} className={styles.verso} aria-label={`${artwork.title} 原始 prompt`}>
      <div className="flex h-full flex-col">
        <header className="flex min-h-14 shrink-0 items-center justify-between gap-4 border-foreground/15 border-b px-5 md:px-10">
          <p className="font-mono text-[10px] text-foreground/60 uppercase tracking-[0.14em]">
            Verso — Original Prompt
          </p>
          <div className="flex items-center gap-2">
            <button className={versoButton} type="button" onClick={copyPrompt}>
              {copyStatus === "copied" ? (
                <Check aria-hidden="true" size={14} />
              ) : (
                <Copy aria-hidden="true" size={14} />
              )}
              <span aria-live="polite">
                {copyStatus === "copied" ? "已复制" : copyStatus === "error" ? "复制失败" : "复制"}
              </span>
            </button>
            <button className={versoButton} type="button" onClick={() => ref.current?.close()}>
              <X aria-hidden="true" size={14} />
              回到作品
            </button>
          </div>
        </header>

        <div className={cn("min-h-0 flex-1 overflow-y-auto", styles.scrollBody)}>
          <div className="mx-auto max-w-5xl px-5 py-8 md:px-10 md:py-12">
            <h2 className={cn(styles.serif, "text-3xl tracking-[-0.02em] md:text-4xl")}>
              {artwork.title}
              <span className="ml-4 align-middle font-mono text-[11px] text-foreground/60 tracking-[0.14em]">
                {artwork.id} · {artwork.englishTitle}
              </span>
            </h2>
            <div className="mt-8 gap-10 md:columns-2 md:mt-10">
              <Markdown remarkPlugins={[remarkGfm]} components={promptMarkdownComponents}>
                {artwork.originalPrompt}
              </Markdown>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  )
}
