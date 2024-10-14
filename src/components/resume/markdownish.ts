export interface TextSpan {
  text: string;
  bold?: boolean;
  href?: string;
}

const LINK = /\[(?<text>[^[\]]+)]\((?<href>[^()]+)\)/g;
export function parseHighlight(highlight: string): TextSpan[] {
  const parts: TextSpan[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = LINK.exec(highlight)) !== null) {
    const startIndex = lastIndex;
    const endIndex = LINK.lastIndex;

    // Push plain text
    parts.push({ text: highlight.slice(startIndex, match.index) });

    // Push link text
    const { text, href } = match.groups!;
    parts.push({
      text,
      href,
    });

    lastIndex = endIndex;
  }
  parts.push({ text: highlight.slice(lastIndex) });

  return parts;
}
