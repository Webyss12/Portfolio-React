import { useState } from 'react';
import { ASSETS } from '../data/content';
import { ART_ALT } from '../art/alt';
import { ChatbotArt, FileserverArt, PortfolioArt, ScoreboardArt, SmartledArt, StatementArt, WaterworksArt } from '../art/svgs';
import type { ArtKey } from '../types';

const ART = {
  statement: StatementArt,
  scoreboard: ScoreboardArt,
  smartled: SmartledArt,
  chatbot: ChatbotArt,
  waterworks: WaterworksArt,
  fileserver: FileserverArt,
  portfolio: PortfolioArt,
} satisfies Record<ArtKey, unknown>;

interface ArtworkProps {
  name: ArtKey;
  className?: string;
  /** true when the artwork shows project content and needs a text description */
  labelled?: boolean;
}

// Shows the built-in SVG, or an image from ASSETS if one is set (falling back to the SVG if it fails to load).
export function Artwork({ name, className, labelled = false }: ArtworkProps) {
  const [failed, setFailed] = useState(false);
  const override = ASSETS[name];
  const alt = labelled ? ART_ALT[name] : undefined;

  if (override && !failed) {
    return <img src={override} alt={alt ?? ''} className={`${className ?? ''} object-contain`} onError={() => setFailed(true)} />;
  }
  const Svg = ART[name];
  return <Svg className={className} title={alt} />;
}
