import { PortfolioViewer } from "@/components/portfolio-viewer"
import { artworks } from "@/lib/artworks"

export default function Page() {
  return <PortfolioViewer artworks={artworks} />
}
