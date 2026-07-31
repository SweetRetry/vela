"use client"

import { cn } from "@workspace/ui/lib/utils"
import Image from "next/image"
import { useMemo } from "react"

import type { Artwork } from "@/lib/artworks"

import styles from "./portfolio-viewer.module.css"

type ArchiveGridProps = {
  artworks: readonly Artwork[]
  onOpen: (index: number) => void
}

type ArchiveGroup = {
  label: string
  labelEn: string
  items: { artwork: Artwork; index: number }[]
}

/** 系列优先，无系列按介质分区；组内保持展线顺序 */
function groupArtworks(artworks: readonly Artwork[]): ArchiveGroup[] {
  const groups = new Map<string, ArchiveGroup>()

  artworks.forEach((artwork, index) => {
    const isVideo = artwork.media.kind === "video"
    const key = artwork.series ?? (isVideo ? "视频" : "图像")
    const group = groups.get(key) ?? {
      label: key,
      labelEn: artwork.series ? "SERIES" : isVideo ? "VIDEO" : "IMAGE",
      items: [],
    }
    group.items.push({ artwork, index })
    groups.set(key, group)
  })

  return [...groups.values()]
}

function mediaThumb(media: Artwork["media"]) {
  return media.kind === "video" ? media.poster : media.src
}

export function ArchiveGrid({ artworks, onOpen }: ArchiveGridProps) {
  const groups = useMemo(() => groupArtworks(artworks), [artworks])

  return (
    <div className="flex min-h-svh min-w-80 flex-col bg-background text-foreground">
      <header className="flex min-h-16 shrink-0 items-center justify-between border-border border-b px-5 md:px-8">
        <span className="font-bold text-[21px] tracking-[-0.06em]">VELA</span>
        <p className="hidden font-mono text-[11px] tracking-[0.13em] sm:block">AI VISUAL ARCHIVE</p>
        <span className="font-mono text-[11px] text-muted-foreground tracking-[0.13em]">
          {artworks.length} 件
        </span>
      </header>

      <main className="flex-1">
        {groups.length === 0 && (
          <p className="grid h-full place-items-center text-muted-foreground text-sm">
            档案暂无作品。
          </p>
        )}

        {groups.map((group) => (
          <section className="px-5 py-8 md:px-8 md:py-10" key={group.label}>
            <header className="flex items-baseline gap-3 border-border border-b pb-3">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.14em]">
                {group.label} · {group.labelEn}
              </h2>
              <span className="font-mono text-[10px] text-muted-foreground">
                {group.items.length} 件
              </span>
            </header>

            <ul className="grid grid-cols-1 gap-x-6 gap-y-10 pt-6 sm:grid-cols-2 xl:grid-cols-3">
              {group.items.map(({ artwork, index }) => (
                <li key={artwork.id}>
                  <button
                    className="group block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4"
                    type="button"
                    onClick={() => onOpen(index)}
                    aria-label={`进入作品：${artwork.title}`}
                  >
                    <span className="relative block aspect-video overflow-hidden bg-secondary">
                      <Image
                        src={mediaThumb(artwork.media)}
                        alt=""
                        fill
                        sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                      />
                      {artwork.media.kind === "video" && artwork.media.duration && (
                        <span className="absolute right-2 bottom-2 bg-foreground/80 px-1.5 py-0.5 font-mono text-[10px] text-background tracking-[0.08em]">
                          {artwork.media.duration}
                        </span>
                      )}
                    </span>
                    <span className="mt-3 flex items-baseline justify-between gap-3">
                      <span
                        className={cn(
                          styles.serif,
                          "text-xl leading-tight transition-colors group-hover:text-primary"
                        )}
                      >
                        {artwork.title}
                      </span>
                      <span className="shrink-0 font-mono text-[10px] text-muted-foreground tracking-[0.12em]">
                        {artwork.id}
                      </span>
                    </span>
                    <span className="mt-1 block truncate font-mono text-[10px] text-muted-foreground tracking-[0.1em]">
                      {artwork.englishTitle} · {artwork.time}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  )
}
