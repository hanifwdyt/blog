"use client";

import { useEffect, useRef } from "react";

interface Props {
  html: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function ContentRenderer({ html, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // ── Mermaid diagrams ─────────────────────────────────────────
    const mermaidCodes = ref.current.querySelectorAll<HTMLElement>(
      "pre code.language-mermaid, code.language-mermaid"
    );
    if (mermaidCodes.length > 0) {
      import("mermaid").then((mod) => {
        const mermaid = mod.default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          themeVariables: {
            primaryColor: "#1a1710",
            primaryTextColor: "#e4d9c2",
            primaryBorderColor: "#2a2318",
            lineColor: "#c4911e",
            secondaryColor: "#0d0b08",
            tertiaryColor: "#1a1710",
            background: "#070604",
            mainBkg: "#0d0b08",
            nodeBorder: "#2a2318",
            clusterBkg: "#0f0d09",
            titleColor: "#e4d9c2",
            edgeLabelBackground: "#0d0b08",
            attributeBackgroundColorOdd: "#0d0b08",
            attributeBackgroundColorEven: "#0f0d09",
          },
          fontFamily: "var(--font-mono, monospace)",
          fontSize: 13,
          flowchart: { curve: "basis", padding: 20 },
          sequence: { actorMargin: 50 },
        });

        const containers: HTMLElement[] = [];
        mermaidCodes.forEach((codeEl) => {
          const code = (codeEl.textContent || "").trim();
          const wrapper = document.createElement("div");
          wrapper.className = "mermaid-block";
          wrapper.textContent = code;

          const pre = codeEl.closest("pre") || codeEl;
          pre.replaceWith(wrapper);
          containers.push(wrapper);
        });

        if (containers.length > 0) {
          mermaid.run({ nodes: containers }).catch(() => {
            containers.forEach((c) => {
              c.innerHTML = `<pre class="mermaid-error">${c.textContent}</pre>`;
            });
          });
        }
      });
    }

    // ── Syntax highlighting ───────────────────────────────────────
    const codeBlocks = ref.current.querySelectorAll<HTMLElement>(
      "pre code:not(.language-mermaid)"
    );
    if (codeBlocks.length > 0) {
      import("highlight.js").then((mod) => {
        const hljs = mod.default;
        codeBlocks.forEach((block) => {
          if (!block.dataset.highlighted) {
            hljs.highlightElement(block);
          }
        });
      });
    }
  }, [html]);

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
