"use client"

import { cn } from "@workspace/ui/lib/utils"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

import { ArtworkIndex } from "@/components/artwork-index"
import { ArtworkVerso } from "@/components/artwork-verso"
import type { Artwork } from "@/lib/artworks"

import styles from "./portfolio-viewer.module.css"

const chromeButton =
  "inline-flex h-9 cursor-pointer items-center gap-1.5 border border-(--hairline) bg-transparent px-3 font-mono text-[10px] uppercase tracking-[0.12em] text-(--ink) transition-colors hover:bg-(--ink) hover:text-(--paper) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)"

type PortfolioViewerProps = {
  artworks: readonly Artwork[]
}

export function PortfolioViewer({ artworks }: PortfolioViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const versoRef = useRef<HTMLDialogElement>(null)
  const indexRef = useRef<HTMLDialogElement>(null)
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
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      // 阅读层打开时，方向键留给滚动与 Esc
      if (versoRef.current?.open || indexRef.current?.open) {
        return
      }

      if (event.key === "ArrowLeft") {
        selectArtwork(activeIndex - 1)
      } else if (event.key === "ArrowRight") {
        selectArtwork(activeIndex + 1)
      } else if (event.key === "i" || event.key === "I") {
        indexRef.current?.showModal()
      } else if (event.key === "p" || event.key === "P") {
        versoRef.current?.showModal()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeIndex, selectArtwork])

  if (!activeArtwork) {
    return (
      <div className="grid h-svh place-items-center bg-background text-muted-foreground text-sm">
        档案暂无作品。
      </div>
    )
  }

  const isFirst = activeIndex === 0
  const isLast = activeIndex === artworks.length - 1
  const previousArtwork = artworks[activeIndex - 1]
  const nextArtwork = artworks[activeIndex + 1]
  const toneClass = activeArtwork.tone === "dark" ? styles.toneDark : styles.toneLight

  return (
    <div className={cn(styles.viewer, toneClass)}>
      {/* 环境底：作品自身放大模糊，填满画幅之外的空白 */}
      <div className={styles.backdrop} aria-hidden="true">
        <Image
          key={`backdrop-${activeArtwork.id}`}
          src={activeArtwork.image}
          alt=""
          fill
          sizes="100vw"
          className={styles.backdropImage}
        />
        <div className={styles.backdropVeil} />
      </div>

      {/* 作品层：key 触发"洇开"转场 */}
      <figure key={activeArtwork.id} className={styles.stage}>
        <Image
          src={activeArtwork.image}
          alt={activeArtwork.alt}
          fill
          priority
          sizes="100vw"
          className="object-contain"
        />
      </figure>

      <div className={styles.scrimTop} aria-hidden="true" />
      <div className={styles.scrimBottom} aria-hidden="true" />
      <div className={styles.scrimSide} aria-hidden="true" />

      {/* 顶栏 */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4 md:px-8">
        <button
          className="cursor-pointer border-0 bg-transparent p-0 font-bold text-[21px] text-(--ink) tracking-[-0.06em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--ink)"
          type="button"
          onClick={() => selectArtwork(0)}
          aria-label="返回第一件作品"
        >
          VELA
        </button>
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[10px] text-(--ink-soft) tracking-[0.14em] sm:inline">
            {activeArtwork.id} / {String(artworks.length).padStart(3, "0")}
          </span>
          <button
            className={chromeButton}
            type="button"
            onClick={() => indexRef.current?.showModal()}
          >
            索引
          </button>
          <button
            className={chromeButton}
            type="button"
            onClick={() => versoRef.current?.showModal()}
          >
            配方
          </button>
        </div>
      </header>

      {/* 题款：竖排标题落在画面右缘 */}
      <div className="pointer-events-none absolute top-1/2 right-5 z-10 -translate-y-1/2 md:right-10">
        <h1
          className={cn(
            styles.verticalTitle,
            styles.serif,
            "text-[clamp(48px,10vh,96px)] text-(--ink)"
          )}
        >
          {activeArtwork.title}
        </h1>
      </div>

      {/* 题跋：英文名、述要、时间尺寸 */}
      <div className="pointer-events-none absolute bottom-5 left-5 z-10 max-w-[68vw] md:bottom-8 md:left-8 md:max-w-sm">
        <p className="font-mono text-[11px] text-(--ink) tracking-[0.18em]">
          {activeArtwork.englishTitle}
        </p>
        <p className="mt-2 text-(--ink-soft) text-sm leading-6">{activeArtwork.summary}</p>
        <p className="mt-3 font-mono text-[10px] text-(--ink-soft) tracking-[0.08em]">
          {activeArtwork.time} · {activeArtwork.dimensions}
        </p>
      </div>

      {/* 印章：作品编号 */}
      <span
        className={cn(styles.seal, "absolute right-5 bottom-5 z-10 md:right-8 md:bottom-8")}
        aria-hidden="true"
      >
        {activeArtwork.id}
      </span>

      {/* 键盘提示 */}
      <p
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 font-mono text-[10px] text-(--ink-soft) tracking-[0.1em] lg:block"
        aria-hidden="true"
      >
        ← → 切换 · I 索引 · P 配方
      </p>

      {/* 边缘导航 */}
      <button
        className="group absolute inset-y-0 left-0 z-20 grid w-12 cursor-pointer place-items-center disabled:cursor-default md:w-20"
        type="button"
        disabled={isFirst}
        onClick={() => selectArtwork(activeIndex - 1)}
        aria-label={previousArtwork ? `上一件：${previousArtwork.title}` : "没有上一件作品"}
      >
        <span className="grid size-10 place-items-center rounded-full border border-(--hairline) text-(--ink) opacity-0 transition-opacity group-hover:opacity-100 group-disabled:opacity-0 max-md:opacity-60">
          <ArrowLeft aria-hidden="true" size={18} />
        </span>
      </button>
      <button
        className="group absolute inset-y-0 right-0 z-20 grid w-12 cursor-pointer place-items-center disabled:cursor-default md:w-20"
        type="button"
        disabled={isLast}
        onClick={() => selectArtwork(activeIndex + 1)}
        aria-label={nextArtwork ? `下一件：${nextArtwork.title}` : "没有下一件作品"}
      >
        <span className="grid size-10 place-items-center rounded-full border border-(--hairline) text-(--ink) opacity-0 transition-opacity group-hover:opacity-100 group-disabled:opacity-0 max-md:opacity-60">
          <ArrowRight aria-hidden="true" size={18} />
        </span>
      </button>

      <ArtworkVerso ref={versoRef} artwork={activeArtwork} />
      <ArtworkIndex
        ref={indexRef}
        artworks={artworks}
        activeIndex={activeIndex}
        onSelect={selectArtwork}
      />
    </div>
  )
}
