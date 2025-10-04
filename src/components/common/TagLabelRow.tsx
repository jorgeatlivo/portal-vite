import { useEffect, useRef, useState } from 'react';

import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';
import { TagLabel } from './TagLabel';

interface TagLabelRowProps {
  tags: string[];
  small?: boolean;
}

export const TagLabelRow: React.FC<TagLabelRowProps> = ({ tags, small }) => {
  const [showRestModalOpen, setShowRestModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(2); // Initial visible tags count

  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const visibleTags = tags.slice(0, visibleCount);
  const restTags = tags.slice(visibleCount);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowRestModalOpen(false);
      }
    };

    if (showRestModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRestModalOpen]);

  useEffect(() => {
    const container = containerRef.current;

    const handleResize = () => {
      if (container) {
        const containerWidth = container.offsetWidth;
        calculateVisibleTags(containerWidth);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (container) {
      resizeObserver.observe(container);
      handleResize(); // Initial check
    }

    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
  }, []);

  const calculateVisibleTags = (containerWidth: number) => {
    let totalWidth = 0;
    let count = 0;
    const tagWidths = Array.from(containerRef.current?.children || []).map(
      (child) => (child as HTMLElement).offsetWidth
    );

    for (const width of tagWidths) {
      if (totalWidth + width <= containerWidth) {
        totalWidth += width;
        count++;
      } else {
        break;
      }
    }

    // Deduct 1 to account for the "more" button if there's any hidden tag
    setVisibleCount(count - (restTags.length > 0 ? 1 : 0));
  };

  return (
    <div ref={containerRef} className="flex flex-row items-center space-x-tiny">
      {visibleTags.map((tag, index) => (
        <TagLabel key={index} text={tag} small={small} />
      ))}
      {restTags.length > 0 && (
        <div className="relative">
          <button
            type="button"
            ref={buttonRef}
            onClick={() => setShowRestModalOpen(!showRestModalOpen)}
            className="cursor-pointer rounded-[4px] p-tiny ring-1 ring-Divider-Default"
          >
            <LivoIcon name="dots" size={16} color={colors['Grey-700']} />
          </button>
          {showRestModalOpen && (
            <div
              ref={modalRef}
              className="absolute -right-1/2 top-full z-10 mb-[14px] mt-tiny space-y-small rounded-[8px] bg-white p-small shadow-custom"
            >
              {restTags.map((tag, index) => (
                <TagLabel key={index} text={tag} small={small} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
