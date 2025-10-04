import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ActionItem from '@/components/common/ActionItem';
import LivoIcon from '@/components/common/LivoIcon';

import colors from '@/config/color-palette';
import { Typography } from '../atoms/Typography';

interface ShiftDetailsHeaderProps {
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: () => void;
  editable?: boolean;
  recurrent?: boolean;
  enableActions?: boolean;
}

export const ShiftDetailsHeader: React.FC<ShiftDetailsHeaderProps> = ({
  onClose,
  onEdit,
  onDelete,
  editable,
  onCopy,
  recurrent,
  enableActions = true,
}) => {
  const { t } = useTranslation(['shift-claim-details', 'publish-shift']);
  const [editDeleteModalOpen, setEditDeleteModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setEditDeleteModalOpen(false);
      }
    };

    if (editDeleteModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editDeleteModalOpen]);

  return (
    <div className="flex w-full items-center justify-between px-large">
      <button type="button" onClick={onClose}>
        <LivoIcon name="close" size={24} color={colors['Grey-700']} />
      </button>

      {recurrent && (
        <div className="flex items-center space-x-small">
          <LivoIcon name="repeat" size={16} color={colors['Grey-400']} />
          <Typography variant="body/small" color={colors['Text-Subtle']}>
            {t('publish-shift:recurrent_label')}
          </Typography>
        </div>
      )}

      <div className="relative">
        {enableActions && (
          <button
            type="button"
            ref={buttonRef}
            onClick={(e) => {
              e.preventDefault();
              setEditDeleteModalOpen(!editDeleteModalOpen);
            }}
          >
            <LivoIcon name="dots" size={24} color={colors['Grey-700']} />
          </button>
        )}

        {editDeleteModalOpen && (
          <div
            ref={modalRef}
            className="absolute right-full top-0 z-10 mb-[14px] mr-tiny w-[240px] space-y-[14px] rounded-[8px] bg-white p-medium shadow-custom"
          >
            <ActionItem
              label={
                <span className="text-Text-Subtle">
                  {t('duplicate_shift_label')}
                </span>
              }
              iconName="copy"
              onClick={() => {
                onCopy();
                setEditDeleteModalOpen(false);
              }}
            />
            <>
              <ActionItem
                label={t('edit_shift_label')}
                iconName="pencil"
                onClick={() => {
                  onEdit();
                  setEditDeleteModalOpen(false);
                }}
                disabled={!editable}
              />
              <ActionItem
                label={t('delete_shift_label')}
                iconName="trash"
                onClick={(e) => {
                  e?.preventDefault();
                  onDelete();
                  setEditDeleteModalOpen(false);
                }}
                disabled={!editable}
                iconColor={editable ? colors['Red-500'] : undefined}
              />
            </>
          </div>
        )}
      </div>
    </div>
  );
};
