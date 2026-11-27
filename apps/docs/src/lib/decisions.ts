import decisionsRaw from '../../../../docs/01-decisions.md?raw';

export interface DecisionRow {
  id: string;
  section: 'inherited' | 'nds';
  decision: string;
  consequence: string;
}

export interface OpenQuestionRow {
  id: string;
  question: string;
  defaultPolicy: string;
}

export interface ParsedDecisions {
  intro: string;
  supersededNote: string;
  inherited: DecisionRow[];
  nds: DecisionRow[];
  openQuestions: OpenQuestionRow[];
}

function splitMarkdownRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  const cells: string[] = [];
  let current = '';
  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i]!;
    if (ch === '\\' && trimmed[i + 1] === '|') {
      current += '|';
      i++;
    } else if (ch === '|') {
      cells.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  cells.push(current.trim());
  return cells;
}

function isSeparatorRow(line: string): boolean {
  return /^\|\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|$/.test(line.trim());
}

/** Parses `docs/01-decisions.md` into structured decision and open-question records. */
export function parseDecisionsMarkdown(markdown: string): ParsedDecisions {
  const lines = markdown.split(/\r?\n/);
  let currentSection: 'intro' | 'inherited' | 'superseded' | 'nds' | 'open' = 'intro';
  const introLines: string[] = [];
  const supersededLines: string[] = [];
  const inherited: DecisionRow[] = [];
  const nds: DecisionRow[] = [];
  const openQuestions: OpenQuestionRow[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('# ')) continue;
    if (line.startsWith('## ')) {
      const heading = line.slice(3).trim().toLowerCase();
      if (heading.includes('inherited')) currentSection = 'inherited';
      else if (heading.includes('superseded')) currentSection = 'superseded';
      else if (heading.includes('nds decisions')) currentSection = 'nds';
      else if (heading.includes('open')) currentSection = 'open';
      continue;
    }

    if (currentSection === 'intro') {
      introLines.push(line);
      continue;
    }
    if (currentSection === 'superseded') {
      supersededLines.push(line);
      continue;
    }

    if (!line.startsWith('|') || isSeparatorRow(line)) continue;
    const cells = splitMarkdownRow(line);
    if (cells.length < 3) continue;
    const [col0, col1, col2] = cells as [string, string, string];
    if (col0 === '#') continue;

    if (currentSection === 'inherited') {
      inherited.push({
        id: col0,
        section: 'inherited',
        decision: col1,
        consequence: col2,
      });
    } else if (currentSection === 'nds') {
      nds.push({
        id: col0,
        section: 'nds',
        decision: col1,
        consequence: col2,
      });
    } else if (currentSection === 'open') {
      openQuestions.push({
        id: col0,
        question: col1,
        defaultPolicy: col2,
      });
    }
  }

  return {
    intro: introLines.join(' '),
    supersededNote: supersededLines.join(' '),
    inherited,
    nds,
    openQuestions,
  };
}

export const DECISIONS_DATA: ParsedDecisions = parseDecisionsMarkdown(decisionsRaw);
