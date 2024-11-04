"use client";

import React from "react";
import { useGeneralStore } from "../../stores/generalStore";
import { EmailShare, FacebookShare, RedditShare, TelegramShare, TwitterShare, WhatsappShare } from "react-share-kit";
import OverlayLayout from "./OverlayLayout";

export default function ShareOverlay() {
  const { shareUrl, setShare, shareAction, isShareOpen } = useGeneralStore();
  return (
    <OverlayLayout isOpen={isShareOpen} close={() => setShare(false)}>
      <FacebookShare url={shareUrl} onClick={() => shareAction()} />
      <TwitterShare url={shareUrl} onClick={() => shareAction()} />
      <RedditShare url={shareUrl} onClick={() => shareAction()} />
      <WhatsappShare url={shareUrl} onClick={() => shareAction()} />
      <TelegramShare url={shareUrl} onClick={() => shareAction()} />
      <EmailShare url={shareUrl} onClick={() => shareAction()} />
    </OverlayLayout>
  );
}
