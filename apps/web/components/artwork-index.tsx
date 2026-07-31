"use client"

import { cn } from "@workspace/ui/lib/utils"
import { X } from "lucide-react"
import Image from "next/image"
import type { RefObject } from "react"

import type { Artwork } from "@/lib/artworks"

import styles from "./portfolio-viewer.module.css"

type ArtworkIndexProps = {
  ref: RefObject<HTMLDialogElement | null>
  artworks: readonly Artwork[]
  activeIndex: number
  onSelect: (index: number) => void
}

export function ArtworkIndex({ ref, artworks, activeIndex, onSelect }: ArtworkIndexProps) {
  return (
    <dialog ref={ref} className={styles.indexDialog} aria-label="作品索引">
      <div className="flex h-full flex-col">
        <header className="flex min-h-14 shrink-0 items-center justify-between gap-4 border-white/15 border-b px-5 md:px-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-60">
            Index — 全部作品
          </p>
          <button
            className="inline-flex h-9 cursor-pointer items-center gap-1.5 border border-white/25 bg-transparent px-3 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            type="button"
            onClick={() => ref.current?.close()}
          >
            <X aria-hidden="true" size={14} />
            关闭
          </button>
        </header>

        <div className={cn("min-h-0 flex-1 overflow-y-auto", styles.scrollBody)}>
          <ul className="mx-auto max-w-4xl px-5 py-6 md:px-10 md:py-10">
            {artworks.map((artwork, index) => {
              const isActive = index === activeIndex

              return (
                <li key={artwork.id}>
                  <button
                    className="group flex w-full cursor-pointer items-center gap-5 border-white/12 border-b py-5 text-left transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white md:gap-8 md:py-6"
                    type="button"
                    aria-current={isActive || undefined}
                    onClick={() => {
                      onSelect(index)
                      ref.current?.close()
                    }}
                  >
                    <span className="w-8 shrink-0 font-mono text-[11px] tracking-[0.12em] opacity-60">
                      {artwork.id}
                    </span>
                    <span className="relative block aspect-video w-20 shrink-0 overflow-hidden bg-white/10 md:w-24">
                      <Image
                        src={artwork.image}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn(styles.serif, "block truncate text-2xl md:text-3xl")}>
                        {artwork.title}
                      </span>
                      <span className="mt-1 block truncate font-mono text-[10px] tracking-[0.12em] opacity-60">
                        {artwork.englishTitle} · {artwork.time}
                      </span>
                    </span>
                    {isActive && (
                      <span className="flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-(--color-primary)">
                        <span
                          className="size-2 rounded-full bg-(--color-primary)"
                          aria-hidden="true"
                        />
                        <span className="sr-only">当前作品</span>
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </dialog>
  )
}
