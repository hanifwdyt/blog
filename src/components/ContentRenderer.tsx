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
            primaryColor: "#f4f1ea",
            primaryTextColor: "#1c1b18",
            primaryBorderColor: "#ddd6c9",
            lineColor: "#9a5b1f",
            secondaryColor: "#fdfcfa",
            tertiaryColor: "#f6f3ec",
            background: "#fdfcfa",
            mainBkg: "#f4f1ea",
            nodeBorder: "#ddd6c9",
            clusterBkg: "#f6f3ec",
            titleColor: "#1c1b18",
            edgeLabelBackground: "#fdfcfa",
            attributeBackgroundColorOdd: "#f4f1ea",
            attributeBackgroundColorEven: "#f6f3ec",
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
