/**
 * a simple markdown parser that supports bold and italic
 * Can add more parsers for other markdown syntax like underline, strikethrough, etc.
 * Continuous handling using chain of responsibility pattern
 */

import { Link } from 'react-router-dom';

type MarkdownOutput = (string | JSX.Element)[];

// handle bold
export const parseBold = (input: MarkdownOutput): MarkdownOutput => {
  const regex = /\*\*(.*?)\*\*/g;
  return input.flatMap((part, index) => {
    if (typeof part !== 'string') return [part];
    const segments: (string | JSX.Element)[] = [];
    let match: RegExpExecArray | null;
    let lastIndex = 0;

    while ((match = regex.exec(part)) !== null) {
      if (lastIndex < match.index) {
        segments.push(part.slice(lastIndex, match.index));
      }
      segments.push(<b key={`bold-${index}-${segments.length}`}>{match[1]}</b>);
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < part.length) {
      segments.push(part.slice(lastIndex));
    }

    return segments;
  });
};

// handle italic
export const parseItalic = (input: MarkdownOutput): MarkdownOutput => {
  const regex = /\*(.*?)\*/g;
  return input.flatMap((part, index) => {
    if (typeof part !== 'string') return [part];
    const segments: (string | JSX.Element)[] = [];
    let match: RegExpExecArray | null;
    let lastIndex = 0;

    while ((match = regex.exec(part)) !== null) {
      if (lastIndex < match.index) {
        segments.push(part.slice(lastIndex, match.index));
      }
      segments.push(
        <i key={`italic-${index}-${segments.length}`}>{match[1]}</i>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < part.length) {
      segments.push(part.slice(lastIndex));
    }

    return segments;
  });
};

// handle semi bold
export const parseSemiBold = (input: MarkdownOutput): MarkdownOutput => {
  const regex = /\*\*\*(.*?)\*\*\*/g;
  return input.flatMap((part, index) => {
    if (typeof part !== 'string') return [part];
    const segments: (string | JSX.Element)[] = [];
    let match: RegExpExecArray | null;
    let lastIndex = 0;

    while ((match = regex.exec(part)) !== null) {
      if (lastIndex < match.index) {
        segments.push(part.slice(lastIndex, match.index));
      }
      segments.push(
        <span
          key={`semi-bold-${index}-${segments.length}`}
          className="font-semibold"
        >
          {match[1]}
        </span>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < part.length) {
      segments.push(part.slice(lastIndex));
    }

    return segments;
  });
};

// handle custom color
export const parseColor = (input: MarkdownOutput): MarkdownOutput => {
  const regex = /\{color:(.*?)\}(.*?)\{\/color\}/g;
  return input.flatMap((part, index) => {
    if (typeof part !== 'string') return [part];
    const segments: (string | JSX.Element)[] = [];
    let match: RegExpExecArray | null;
    let lastIndex = 0;

    while ((match = regex.exec(part)) !== null) {
      if (lastIndex < match.index) {
        segments.push(part.slice(lastIndex, match.index));
      }

      const color = match[1];
      const text = match[2];

      segments.push(
        <span key={`color-${index}-${segments.length}`} style={{ color }}>
          {text}
        </span>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < part.length) {
      segments.push(part.slice(lastIndex));
    }

    return segments;
  });
};

/**
 * parse link using advance Markdown standard
 * Supports the format: [text](url){attributes}
 * where attributes can be state, target, rel, etc.
 * @example [Google](https://www.google.com){state=someState target=_blank rel=noreferrer}
 */
export const parseLink = (input: MarkdownOutput): MarkdownOutput => {
  const regex = /\[(.*?)\]\((.*?)\)(?:\{(.*?)\})?/g;
  return input.flatMap((part, index) => {
    if (typeof part !== 'string') return [part];
    const segments: (string | JSX.Element)[] = [];
    let match: RegExpExecArray | null;
    let lastIndex = 0;

    while ((match = regex.exec(part)) !== null) {
      if (lastIndex < match.index) {
        segments.push(part.slice(lastIndex, match.index));
      }

      const attributes =
        match[3]?.split(' ').reduce(
          (acc, attr) => {
            const [key, value] = attr.split('=');
            if (key && value) {
              acc[key] = value.replace(/['"]+/g, '');
            }
            return acc;
          },
          {} as Record<string, string>
        ) || {};

      segments.push(
        <Link
          className="!font-semibold !text-Primary-500 hover:!underline"
          key={`link-${index}-${segments.length}`}
          to={match[2] || '#'}
          state={attributes.state || undefined}
          target={attributes.target || undefined}
          rel={attributes.rel || 'noopener noreferrer'}
        >
          {match[1]}
        </Link>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < part.length) {
      segments.push(part.slice(lastIndex));
    }

    return segments;
  });
};

/**
 * handle newlines (double space + \n, \n, <br />)
 */
export const parseNewLine = (input: MarkdownOutput): MarkdownOutput => {
  const regex = /(?: {2}\n|\n|<br\s*\/?>)/g; // Match '  \n', '\n', or '<br />', '<br>'
  return input.flatMap((part, index) => {
    if (typeof part !== 'string') return [part];
    const segments: (string | JSX.Element)[] = [];
    let match: RegExpExecArray | null;
    let lastIndex = 0;

    while ((match = regex.exec(part)) !== null) {
      if (lastIndex < match.index) {
        segments.push(part.slice(lastIndex, match.index));
      }
      segments.push(<br key={`br-${index}-${segments.length}`} />);
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < part.length) {
      segments.push(part.slice(lastIndex));
    }

    return segments;
  });
};

const chainProcessors = (
  processors: ((input: MarkdownOutput) => MarkdownOutput)[],
  initialInput: string
): MarkdownOutput => {
  return processors.reduce<MarkdownOutput>(
    (output, processor) => processor(output),
    [initialInput]
  );
};

export const markdown = (text: string): MarkdownOutput => {
  return chainProcessors(
    [
      parseSemiBold,
      parseBold,
      parseItalic,
      parseColor,
      parseLink,
      parseNewLine,
    ],
    text
  );
};
