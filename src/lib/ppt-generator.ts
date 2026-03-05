import pptxgen from "pptxgenjs";
import { Theme } from "./themes";

export interface Slide {
  title: string;
  content: string[];
}

export interface PPTData {
  title: string;
  slides: Slide[];
}

export const downloadPPT = async (data: PPTData, theme: Theme) => {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_16x9";
  pptx.author = "Studio.ai";
  pptx.title = data.title;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  1. TITLE SLIDE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const titleSlide = pptx.addSlide();

  if (theme.gradient) {
    titleSlide.background = { color: theme.gradient.from };
  } else {
    titleSlide.background = { fill: theme.background };
  }

  // Decorative shapes based on layout
  if (theme.layoutType === "bold" || theme.layoutType === "tech") {
    // Geometric accent shapes
    titleSlide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 0.08,
      h: "100%",
      fill: { color: theme.accentColor },
    });
    titleSlide.addShape(pptx.ShapeType.ellipse, {
      x: 7.5,
      y: -1.5,
      w: 4,
      h: 4,
      fill: { color: theme.accentColor, transparency: 85 },
    });
    titleSlide.addShape(pptx.ShapeType.ellipse, {
      x: -1,
      y: 4,
      w: 3,
      h: 3,
      fill: { color: theme.secondaryAccent, transparency: 60 },
    });
  } else if (theme.layoutType === "split") {
    // Left panel accent
    titleSlide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 3.5,
      h: "100%",
      fill: { color: theme.secondaryAccent },
    });
  } else if (theme.layoutType === "editorial") {
    // Top & bottom rules
    titleSlide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 1.2,
      w: 8.4,
      h: 0.01,
      fill: { color: theme.accentColor },
    });
    titleSlide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: 4.3,
      w: 8.4,
      h: 0.01,
      fill: { color: theme.accentColor },
    });
  }

  // Subtitle tag
  const tagX = theme.layoutType === "split" ? 4 : 1;
  const tagW = theme.layoutType === "split" ? 5.5 : 8;
  titleSlide.addText("A PRESENTATION BY STUDIO.AI", {
    x: tagX,
    y: 1.5,
    w: tagW,
    h: 0.4,
    fontSize: 11,
    color: theme.accentColor,
    align: theme.layoutType === "split" ? "left" : "center",
    fontFace: theme.fontPair.body,
    charSpacing: 5,
    bold: true,
  });

  // Title
  titleSlide.addText(data.title.toUpperCase(), {
    x: tagX,
    y: 2.0,
    w: tagW,
    h: 2,
    fontSize: 44,
    bold: true,
    color: theme.titleColor,
    align: theme.layoutType === "split" ? "left" : "center",
    fontFace: theme.fontPair.heading,
    lineSpacing: 52,
  });

  // Accent bar
  titleSlide.addShape(pptx.ShapeType.rect, {
    x: theme.layoutType === "split" ? tagX : 4,
    y: 4.2,
    w: 2,
    h: 0.06,
    fill: { color: theme.accentColor },
    rectRadius: 0.03,
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  2. CONTENT SLIDES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  data.slides.forEach((slide, idx) => {
    const s = pptx.addSlide();
    s.background = { fill: theme.background };

    // ── Layout-specific decorations ──
    if (theme.layoutType === "bold") {
      s.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 0.06,
        h: "100%",
        fill: { color: theme.accentColor },
      });
      s.addShape(pptx.ShapeType.ellipse, {
        x: 8.5,
        y: -0.8,
        w: 2.5,
        h: 2.5,
        fill: { color: theme.accentColor, transparency: 90 },
      });
    } else if (theme.layoutType === "split") {
      s.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 3.2,
        h: "100%",
        fill: { color: theme.secondaryAccent },
      });
    } else if (theme.layoutType === "editorial") {
      s.addShape(pptx.ShapeType.rect, {
        x: 0.6,
        y: 0,
        w: 0.01,
        h: "100%",
        fill: { color: theme.accentColor, transparency: 70 },
      });
    } else if (theme.layoutType === "tech") {
      s.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: "100%",
        h: 0.04,
        fill: { color: theme.accentColor },
      });
      s.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 5.21,
        w: "100%",
        h: 0.04,
        fill: { color: theme.accentColor, transparency: 60 },
      });
    }

    // ── Slide number ──
    s.addText(`${String(idx + 1).padStart(2, "0")}`, {
      x:
        theme.layoutType === "split"
          ? 0.3
          : theme.layoutType === "editorial"
            ? 0.2
            : 9,
      y: theme.layoutType === "split" ? 0.4 : 0.3,
      w: 0.8,
      h: 0.5,
      fontSize: 12,
      bold: true,
      color: theme.accentColor,
      fontFace: theme.fontPair.body,
      align: theme.layoutType === "split" ? "left" : "right",
    });

    // ── Title placement ──
    if (theme.layoutType === "split") {
      s.addText(slide.title, {
        x: 0.4,
        y: 1.2,
        w: 2.6,
        h: 2.5,
        fontSize: 24,
        bold: true,
        color: theme.titleColor,
        fontFace: theme.fontPair.heading,
        align: "left",
        valign: "top",
      });
      s.addShape(pptx.ShapeType.rect, {
        x: 0.4,
        y: 3.8,
        w: 1.2,
        h: 0.05,
        fill: { color: theme.accentColor },
        rectRadius: 0.025,
      });
    } else {
      s.addText(slide.title, {
        x: theme.layoutType === "editorial" ? 1 : 0.8,
        y: 0.5,
        w: 8,
        h: 0.9,
        fontSize: 28,
        bold: true,
        color: theme.titleColor,
        fontFace: theme.fontPair.heading,
      });
      // Underline
      s.addShape(pptx.ShapeType.rect, {
        x: theme.layoutType === "editorial" ? 1 : 0.8,
        y: 1.35,
        w: 1.5,
        h: 0.04,
        fill: { color: theme.accentColor },
        rectRadius: 0.02,
      });
    }

    // ── Content ──
    const bulletOpts = {
      bullet: { type: "number" as const, color: theme.accentColor },
      indentLevel: 0,
    };

    const cX =
      theme.layoutType === "split"
        ? 3.6
        : theme.layoutType === "editorial"
          ? 1
          : 0.8;
    const cY = theme.layoutType === "split" ? 0.8 : 1.7;
    const cW = theme.layoutType === "split" ? 6 : 8.4;

    if (slide.content.length > 4) {
      const mid = Math.ceil(slide.content.length / 2);
      const col1 = slide.content.slice(0, mid);
      const col2 = slide.content.slice(mid);

      s.addText(
        col1.map((t) => ({ text: t, options: bulletOpts })),
        {
          x: cX,
          y: cY,
          w: cW / 2 - 0.2,
          h: 3.6,
          fontSize: 14,
          color: theme.contentColor,
          valign: "top",
          fontFace: theme.fontPair.body,
          lineSpacing: 22,
        },
      );
      s.addText(
        col2.map((t) => ({ text: t, options: bulletOpts })),
        {
          x: cX + cW / 2 + 0.2,
          y: cY,
          w: cW / 2 - 0.2,
          h: 3.6,
          fontSize: 14,
          color: theme.contentColor,
          valign: "top",
          fontFace: theme.fontPair.body,
          lineSpacing: 22,
        },
      );
    } else {
      s.addText(
        slide.content.map((t) => ({ text: t, options: bulletOpts })),
        {
          x: cX,
          y: cY,
          w: cW,
          h: 3.6,
          fontSize: 16,
          color: theme.contentColor,
          valign: "top",
          fontFace: theme.fontPair.body,
          lineSpacing: 26,
        },
      );
    }

    // ── Footer ──
    s.addText(`${data.title}  ·  Confidential`, {
      x: 0.8,
      y: 5,
      w: 8.4,
      h: 0.3,
      fontSize: 8,
      color: theme.contentColor,
      fontFace: theme.fontPair.body,
      align: "right",
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  3. CLOSING SLIDE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const endSlide = pptx.addSlide();

  if (theme.gradient) {
    endSlide.background = { color: theme.gradient.from };
  } else {
    endSlide.background = { fill: theme.secondaryAccent || theme.background };
  }

  // Same decorative shapes as title slide
  if (theme.layoutType === "bold" || theme.layoutType === "tech") {
    endSlide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 0.08,
      h: "100%",
      fill: { color: theme.accentColor },
    });
  }

  const endTextColor = theme.gradient ? "FFFFFF" : theme.titleColor;

  endSlide.addText("THANK YOU", {
    x: 2,
    y: 1.8,
    w: 6,
    h: 1.2,
    fontSize: 48,
    bold: true,
    color: endTextColor,
    align: "center",
    fontFace: theme.fontPair.heading,
  });

  endSlide.addShape(pptx.ShapeType.rect, {
    x: 4.2,
    y: 3.1,
    w: 1.6,
    h: 0.05,
    fill: { color: theme.accentColor },
    rectRadius: 0.025,
  });

  endSlide.addText("Questions & Discussion", {
    x: 2,
    y: 3.4,
    w: 6,
    h: 0.6,
    fontSize: 18,
    color: theme.gradient ? "CCCCCC" : theme.contentColor,
    align: "center",
    fontFace: theme.fontPair.body,
  });

  endSlide.addText("Created with Studio.ai", {
    x: 2,
    y: 4.5,
    w: 6,
    h: 0.4,
    fontSize: 10,
    color: theme.accentColor,
    align: "center",
    fontFace: theme.fontPair.body,
    charSpacing: 4,
  });

  await pptx.writeFile({ fileName: `${data.title.replace(/\s+/g, "_")}.pptx` });
};
