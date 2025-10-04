import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ExpandableTextProps {
  text: string;
  maxLines: number;
  className?: string;
  textClassName?: string;
}

export const ExpandableText: React.FC<ExpandableTextProps> = ({
  text,
  maxLines,
  className,
  textClassName,
}) => {
  const { t } = useTranslation('professional-claim');
  const [expanded, setExpanded] = useState(false);
  const [shouldExpand, setShouldExpand] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [collapsedHeight, setCollapsedHeight] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      // Calculate the height of the element when it's expanded
      const expandedHeight = element.scrollHeight;

      // Set the max-height to the height of the text at maxLines
      element.style.maxHeight = 'none';
      element.style.display = '-webkit-box';
      element.style.webkitLineClamp = maxLines.toString();
      element.style.webkitBoxOrient = 'vertical';
      element.style.overflow = 'hidden';

      // Measure the height when constrained to maxLines
      const lineHeight = window.getComputedStyle(element).lineHeight;
      const lineHeightPx = parseFloat(lineHeight);
      const collapsedHeight = lineHeightPx * maxLines;

      setCollapsedHeight(collapsedHeight);
      setShouldExpand(expandedHeight > collapsedHeight);
    }
  }, [maxLines]);

  return (
    <div className={className}>
      <p
        ref={textRef}
        className={textClassName}
        style={{
          maxHeight: expanded ? undefined : collapsedHeight,
          display: expanded ? 'block' : '-webkit-box',
          WebkitLineClamp: expanded ? undefined : maxLines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          transition: 'max-height 0.2s ease',
        }}
      >
        {text}
      </p>
      {shouldExpand && (
        <button
          type="button"
          className="text-Primary-500"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          <p className="action-sm">
            {expanded ? t('view_less') : t('view_more')}
          </p>
        </button>
      )}
    </div>
  );
};
