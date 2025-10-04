import { useEffect, useRef, useState } from 'react';

import colors from '@/config/color-palette';
import LivoIcon from '../common/LivoIcon';

interface InternalProfessionalHeaderProps {
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  editable?: boolean;
}

export const InternalProfessionalHeader: React.FC<
  InternalProfessionalHeaderProps
> = ({ onClose, onEdit, onDelete, editable = true }) => {
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
    <div className="flex w-full items-center px-large">
      <div className="flex w-full items-center justify-start">
        <button type="button" onClick={onClose}>
          <LivoIcon name="close" size={24} color={colors['Grey-700']} />
        </button>
      </div>

      {editable ? (
        <div className="relative">
          <button
            type="button"
            ref={buttonRef}
            onClick={(e) => {
              e.preventDefault();
              setEditDeleteModalOpen(!editDeleteModalOpen);
            }}
          >
            <LivoIcon size={24} name="dots" color={colors['Grey-700']} />
          </button>
          {editDeleteModalOpen && (
            <div
              ref={modalRef}
              className="absolute right-full top-0 z-10 mb-[14px] mr-tiny w-[240px] space-y-[14px] rounded-[8px] bg-white p-medium shadow-custom"
            >
              <button
                type="button"
                className="pv-tiny flex w-full items-center justify-between px-small"
                onClick={() => {
                  onEdit();
                  setEditDeleteModalOpen(false);
                }}
              >
                <p className="body-regular mr-small text-Text-Subtle">
                  Editar información
                </p>
                <LivoIcon size={24} name="pencil" color={colors['Grey-700']} />
              </button>
              <button
                type="button"
                className="pv-tiny flex w-full items-center justify-between px-small"
                onClick={(e) => {
                  e.preventDefault();
                  onDelete();
                  setEditDeleteModalOpen(false);
                }}
              >
                <p className="body-regular mr-small text-Negative-500">
                  Dar de baja
                </p>
                <LivoIcon name="trash" size={24} color={colors['Red-500']} />
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
