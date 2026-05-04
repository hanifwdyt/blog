"use client";

import { useState } from "react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // fallback: select the URL from address bar
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`share-btn label-mono${copied ? " copied" : ""}`}
      aria-label="Copy link to clipboard"
    >
      {copied ? "✓ link copied" : "share"}
    </button>
  );
}
