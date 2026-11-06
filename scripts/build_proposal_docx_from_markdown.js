const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  WidthType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  PageBreak,
} = require("docx");

// Margins (in dxa: 1 cm = 567 dxa, 1 inch = 1440 dxa)
const MARGIN_LEFT = 2268;   // 4 cm (Standard Academic Left Margin for Binding)
const MARGIN_TOP = 1701;    // 3 cm
const MARGIN_RIGHT = 1701;  // 3 cm
const MARGIN_BOTTOM = 1701; // 3 cm
const CONTENT_WIDTH = 11906 - (MARGIN_LEFT + MARGIN_RIGHT); // A4 Width ~7937 dxa

const mdPath = path.join(__dirname, "..", "PROPOSAL_PERANCANGAN_WEBSITE_YULIS_VAULT.md");
const outDocxPath = path.join(__dirname, "..", "PROPOSAL_PERANCANGAN_WEBSITE_YULIS_VAULT.docx");

const mdContent = fs.readFileSync(mdPath, "utf-8");
const lines = mdContent.split(/\r?\n/);

const children = [];

let inCodeBlock = false;
let codeBlockBuffer = [];

let inTable = false;
let tableRowsBuffer = [];

function flushCodeBlock() {
  if (codeBlockBuffer.length === 0) return;
  const codeText = codeBlockBuffer.join("\n");
  children.push(
    new Paragraph({
      spacing: { before: 120, after: 120, line: 240 },
      children: [
        new TextRun({
          text: codeText,
          font: "Consolas",
          size: 18, // 9pt
          color: "2A1810",
        }),
      ],
      border: {
        top: { style: BorderStyle.SINGLE, size: 6, color: "DECFC0" },
        bottom: { style: BorderStyle.SINGLE, size: 6, color: "DECFC0" },
        left: { style: BorderStyle.SINGLE, size: 18, color: "8B5A2B" },
        right: { style: BorderStyle.SINGLE, size: 6, color: "DECFC0" },
      },
      shading: { fill: "FBF8F5" },
    })
  );
  codeBlockBuffer = [];
}

function flushTable() {
  if (tableRowsBuffer.length === 0) return;
  // Parse rows
  const parsedRows = tableRowsBuffer
    .filter((r) => !r.trim().match(/^\|(\s*[-:]+[-|\s:]*)\|$/)) // skip separator row
    .map((r) => {
      const trimmed = r.trim().replace(/^\|/, "").replace(/\|$/, "");
      return trimmed.split("|").map((c) => c.trim());
    });

  if (parsedRows.length === 0) {
    tableRowsBuffer = [];
    return;
  }

  const colCount = Math.max(...parsedRows.map((r) => r.length));
  const colWidth = Math.floor(CONTENT_WIDTH / colCount);

  const docxRows = parsedRows.map((cells, rowIndex) => {
    const isHeader = rowIndex === 0;
    return new TableRow({
      tableHeader: isHeader,
      children: cells.map((cellText, cellIndex) => {
        // Strip markdown bold/italic
        const cleanText = cellText.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");
        return new TableCell({
          width: { size: colWidth, type: WidthType.DXA },
          shading: isHeader ? { fill: "EFE6DD" } : cellIndex % 2 === 0 ? { fill: "FFFFFF" } : { fill: "FAF5EE" },
          margins: { top: 100, bottom: 100, left: 140, right: 140 },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 4, color: "D6C5B3" },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: "D6C5B3" },
            left: { style: BorderStyle.SINGLE, size: 4, color: "D6C5B3" },
            right: { style: BorderStyle.SINGLE, size: 4, color: "D6C5B3" },
          },
          children: [
            new Paragraph({
              spacing: { before: 40, after: 40, line: 240 },
              children: [
                new TextRun({
                  text: cleanText,
                  bold: isHeader,
                  font: "Times New Roman",
                  size: isHeader ? 21 : 20, // 10.5pt / 10pt
                  color: isHeader ? "3D2517" : "1E140E",
                }),
              ],
            }),
          ],
        });
      }),
    });
  });

  children.push(
    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      rows: docxRows,
    })
  );
  children.push(new Paragraph({ spacing: { before: 100, after: 100 } }));
  tableRowsBuffer = [];
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Code blocks ```
  if (line.trim().startsWith("```")) {
    if (inCodeBlock) {
      inCodeBlock = false;
      flushCodeBlock();
    } else {
      if (inTable) {
        inTable = false;
        flushTable();
      }
      inCodeBlock = true;
    }
    continue;
  }

  if (inCodeBlock) {
    codeBlockBuffer.push(line);
    continue;
  }

  // Table rows | ... |
  if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
    inTable = true;
    tableRowsBuffer.push(line);
    continue;
  } else if (inTable) {
    inTable = false;
    flushTable();
  }

  // Horizontal Rule ---
  if (line.trim() === "---") {
    // Add page break or separator
    continue;
  }

  // Heading 1: # BAB ... or Title
  if (line.startsWith("# ")) {
    const text = line.replace(/^# /, "").trim();
    const isBab = text.startsWith("BAB ");
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        alignment: isBab ? AlignmentType.CENTER : AlignmentType.CENTER,
        spacing: { before: isBab ? 360 : 200, after: 160, line: 300 },
        children: [
          new TextRun({
            text: text,
            bold: true,
            font: "Times New Roman",
            size: isBab ? 28 : 32, // 14pt / 16pt
            color: "2A1810",
          }),
        ],
      })
    );
    continue;
  }

  // Heading 2: ## ...
  if (line.startsWith("## ")) {
    const text = line.replace(/^## /, "").trim();
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 280, after: 120, line: 280 },
        children: [
          new TextRun({
            text: text,
            bold: true,
            font: "Times New Roman",
            size: 24, // 12pt
            color: "3D2517",
          }),
        ],
      })
    );
    continue;
  }

  // Heading 3: ### ...
  if (line.startsWith("### ")) {
    const text = line.replace(/^### /, "").trim().replace(/\*(.*?)\*/g, "$1");
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 80, line: 260 },
        children: [
          new TextRun({
            text: text,
            bold: true,
            font: "Times New Roman",
            size: 22, // 11pt
            color: "4A2E1B",
          }),
        ],
      })
    );
    continue;
  }

  // Bullets: - ... or * ... or 1. ...
  if (line.trim().match(/^[-*]\s+/)) {
    const clean = line.trim().replace(/^[-*]\s+/, "");
    // Parse bold segments
    const parts = clean.split(/(\*\*.*?\*\*)/g);
    const textRuns = parts.map((part) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return new TextRun({
          text: part.slice(2, -2),
          bold: true,
          font: "Times New Roman",
          size: 22, // 11pt
          color: "1E140E",
        });
      }
      return new TextRun({
        text: part,
        font: "Times New Roman",
        size: 22,
        color: "1E140E",
      });
    });

    children.push(
      new Paragraph({
        bullet: { level: 0 },
        spacing: { before: 60, after: 60, line: 300 }, // 1.25 - 1.5 line spacing
        children: textRuns,
      })
    );
    continue;
  }

  // Numbered list: 1. ...
  if (line.trim().match(/^\d+\.\s+/)) {
    const clean = line.trim();
    const parts = clean.split(/(\*\*.*?\*\*)/g);
    const textRuns = parts.map((part) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return new TextRun({
          text: part.slice(2, -2),
          bold: true,
          font: "Times New Roman",
          size: 22,
          color: "1E140E",
        });
      }
      return new TextRun({
        text: part,
        font: "Times New Roman",
        size: 22,
        color: "1E140E",
      });
    });

    children.push(
      new Paragraph({
        spacing: { before: 60, after: 60, line: 300 },
        indent: { left: 400 },
        children: textRuns,
      })
    );
    continue;
  }

  // Empty line
  if (!line.trim()) {
    continue;
  }

  // Regular paragraph
  const clean = line.trim();
  const parts = clean.split(/(\*\*.*?\*\*)/g);
  const textRuns = parts.map((part) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return new TextRun({
        text: part.slice(2, -2),
        bold: true,
        font: "Times New Roman",
        size: 24, // 12pt standard academic
        color: "1E140E",
      });
    }
    return new TextRun({
      text: part,
      font: "Times New Roman",
      size: 24, // 12pt
      color: "1E140E",
    });
  });

  children.push(
    new Paragraph({
      alignment: AlignmentType.JUSTIFY,
      spacing: { before: 100, after: 100, line: 360 }, // 1.5 line spacing
      indent: { firstLine: 567 }, // 1 cm first-line indent (Standar Skripsi / Proposal)
      children: textRuns,
    })
  );
}

// Ensure buffers are flushed
if (inCodeBlock) flushCodeBlock();
if (inTable) flushTable();

const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: "Times New Roman",
          size: 24, // 12pt
          color: "1E140E",
        },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: {
            top: MARGIN_TOP,
            bottom: MARGIN_BOTTOM,
            left: MARGIN_LEFT,
            right: MARGIN_RIGHT,
          },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: "Yuli's Vault — Proposal Perancangan Sistem Informasi Akademik Pribadi",
                  font: "Times New Roman",
                  size: 18, // 9pt
                  color: "8B5A2B",
                  italics: true,
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: "Halaman ",
                  font: "Times New Roman",
                  size: 18,
                  color: "666666",
                }),
                new TextRun({
                  children: [PageNumber.CURRENT],
                  font: "Times New Roman",
                  size: 18,
                  color: "666666",
                  bold: true,
                }),
                new TextRun({
                  text: " dari ",
                  font: "Times New Roman",
                  size: 18,
                  color: "666666",
                }),
                new TextRun({
                  children: [PageNumber.TOTAL_PAGES],
                  font: "Times New Roman",
                  size: 18,
                  color: "666666",
                }),
              ],
            }),
          ],
        }),
      },
      children: children,
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outDocxPath, buffer);
  // Also copy to artifact directory
  const artifactDocx = "C:\\Users\\hp envy\\.gemini\\antigravity\\brain\\9f985953-fa86-4103-abb9-9a564021a241\\PROPOSAL_PERANCANGAN_WEBSITE_YULIS_VAULT.docx";
  fs.writeFileSync(artifactDocx, buffer);
  console.log("Successfully generated formal DOCX proposal from updated Markdown:", outDocxPath);
});
