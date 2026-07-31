"use client"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { ArrowLeft, ArrowRight, X } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

import { ArtworkSlice } from "@/components/artwork-slice"
import type { Artwork } from "@/lib/artworks"

type PortfolioViewerProps = {
  artworks: readonly Artwork[]
}

export function PortfolioViewer({ artworks }: PortfolioViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const artworkDialogRef = useRef<HTMLDialogElement>(null)
  const activeArtwork = artworks[activeIndex]

  const selectArtwork = useCallback(
    (index: number) => {
      const nextArtwork = artworks[index]
      if (!nextArtwork) {
        return
      }

      setActiveIndex(index)
      window.history.replaceState(null, "", `#${nextArtwork.slug}`)
    },
    [artworks]
  )

  useEffect(() => {
    const selectFromHash = () => {
      const slug = window.location.hash.slice(1)
      const index = artworks.findIndex((artwork) => artwork.slug === slug)
      if (index >= 0) {
        setActiveIndex(index)
      }
    }

    selectFromHash()
    window.addEventListener("hashchange", selectFromHash)
    return () => window.removeEventListener("hashchange", selectFromHash)
  }, [artworks])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        selectArtwork(activeIndex - 1)
      }

      if (event.key === "ArrowRight") {
        selectArtwork(activeIndex + 1)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeIndex, selectArtwork])

  if (!activeArtwork) {
    return null
  }

  return (
    <div className="flex min-h-svh min-w-80 flex-col overflow-x-clip bg-background text-foreground">
      <header className="grid min-h-16 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-border border-b bg-background px-4 md:px-8">
        <button
          className="w-max cursor-pointer border-0 bg-transparent p-0 font-bold text-[21px] tracking-[-0.06em]"
          type="button"
          onClick={() => selectArtwork(0)}
          aria-label="返回第一件作品"
        >
          VELA
        </button>
        <p className="hidden font-mono text-[11px] tracking-[0.13em] sm:block">AI VISUAL ARCHIVE</p>
        <span aria-hidden="true" />
      </header>

      <main className="flex flex-1 flex-col">
        <ArtworkSlice
          key={activeArtwork.id}
          artwork={activeArtwork}
          priority={activeIndex === 0}
          onOpenArtwork={() => artworkDialogRef.current?.showModal()}
        />

        <nav
          className="flex flex-1 items-center border-border border-t bg-secondary/20 px-4 py-3 md:px-8"
          aria-label="作品快速索引"
        >
          <div className="flex w-full gap-2 overflow-x-auto py-1">
            {artworks.map((artwork, index) => {
              const isActive = index === activeIndex

              return (
                <Button
                  className={cn(
                    "h-auto min-w-48 justify-start gap-3 rounded-none border border-border p-2 text-left shadow-none hover:bg-accent hover:text-accent-foreground",
                    isActive &&
                      "border-primary bg-primary/10 text-foreground hover:border-primary hover:bg-primary/15 hover:text-foreground dark:bg-primary/15 dark:hover:bg-primary/20"
                  )}
                  variant="ghost"
                  type="button"
                  aria-pressed={isActive}
                  aria-label={`查看作品 ${index + 1}/${artworks.length}：${artwork.title}`}
                  onClick={() => selectArtwork(index)}
                  key={artwork.id}
                >
                  <span className="relative block aspect-video w-20 shrink-0 overflow-hidden bg-secondary">
                    <Image src={artwork.image} alt="" fill sizes="80px" className="object-cover" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs">{artwork.title}</span>
                  </span>
                </Button>
              )
            })}
          </div>
        </nav>
      </main>

      <dialog
        ref={artworkDialogRef}
        className="m-0 h-svh max-h-none w-screen max-w-none bg-foreground p-0 text-background backdrop:bg-foreground"
        aria-label={`${activeArtwork.title} 全屏图像`}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close()
          }
        }}
      >
        <div className="absolute inset-x-0 top-16 bottom-16 md:inset-12">
          <Image
            src={activeArtwork.image}
            alt={activeArtwork.alt}
            fill
            sizes="100vw"
            className="object-contain"
          />
        </div>
        <Button
          className="absolute top-4 right-4 z-10 size-11 rounded-full border-background/40 bg-foreground/70 text-background hover:bg-background hover:text-foreground"
          variant="outline"
          size="icon"
          type="button"
          onClick={() => artworkDialogRef.current?.close()}
          aria-label="关闭全屏图像"
        >
          <X aria-hidden="true" />
        </Button>
        <Button
          className="absolute bottom-3 left-4 h-11 rounded-none bg-transparent text-background hover:bg-background hover:text-foreground md:top-1/2 md:bottom-auto md:left-5 md:-translate-y-1/2"
          variant="ghost"
          type="button"
          disabled={activeIndex === 0}
          onClick={() => selectArtwork(activeIndex - 1)}
        >
          <ArrowLeft aria-hidden="true" />
          <span className="md:hidden">上一件</span>
        </Button>
        <Button
          className="absolute right-4 bottom-3 h-11 rounded-none bg-transparent text-background hover:bg-background hover:text-foreground md:top-1/2 md:right-5 md:bottom-auto md:-translate-y-1/2"
          variant="ghost"
          type="button"
          disabled={activeIndex === artworks.length - 1}
          onClick={() => selectArtwork(activeIndex + 1)}
        >
          <span className="md:hidden">下一件</span>
          <ArrowRight aria-hidden="true" />
        </Button>
        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.08em]">
          {activeArtwork.id} · {activeArtwork.englishTitle}
        </p>
      </dialog>
    </div>
  )
}
