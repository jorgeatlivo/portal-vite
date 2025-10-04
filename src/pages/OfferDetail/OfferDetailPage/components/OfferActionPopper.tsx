import { useTranslation } from 'react-i18next';

import {
  ClickAwayListener,
  IconButton,
  MenuItem,
  MenuList,
  Popper,
  Tooltip,
} from '@mui/material';
import {
  IconCopy,
  IconDotsVertical,
  IconEdit,
  IconSquareX,
} from '@tabler/icons-react';
import clsx from 'clsx';

import {
  AnimatedPaper,
  useAnimatedPaper,
} from '@/components/common/animation/AnimatedPaper';
import DialogModal from '@/components/common/modal/DialogModal';
import { DIALOG_MODAL_CONTAINER_CLASSES } from '@/components/common/modal/DialogModal/DialogModal';

import { useModal } from '@/hooks/use-modal';
import { OfferDetail } from '@/types/offers';

import { useOfferActions } from '@/pages/OfferDetail/contexts/OfferActionsContext';

interface OfferActionsPopperProps {
  offer?: OfferDetail;
  disabledEdit?: boolean;
  disabledDelete?: boolean;
}

const OfferActionsPopper = ({
  disabledDelete,
  disabledEdit,
  offer,
}: OfferActionsPopperProps) => {
  const { t } = useTranslation('offers');
  const { anchorRef, open, transitioning, handleClose, toggleOpenClose } =
    useAnimatedPaper<HTMLButtonElement>();
  const { openModal } = useModal();
  const { handleEdit, handleDuplicateOffer, handleCloseOffer } =
    useOfferActions();
  const { id: offerId } = offer ?? {};

  const onCloseOffer = (offerId?: number) => {
    if (!Number.isFinite(offerId)) {
      return;
    }

    const confirmFn = () => {
      return handleCloseOffer(offerId!);
    };

    const content = (
      <DialogModal
        confirmLabel={t('close_offer_action')}
        dialogType="delete"
        title={t('close_offer_modal_title')}
        content={t('close_offer_modal_content')}
        onConfirm={confirmFn}
      />
    );
    openModal(content, {
      className: DIALOG_MODAL_CONTAINER_CLASSES,
    });
  };

  return (
    <div className="relative">
      <IconButton ref={anchorRef} onClick={toggleOpenClose}>
        <IconDotsVertical size={20} />
      </IconButton>

      {anchorRef.current && (
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="bottom-end"
          disablePortal
        >
          <ClickAwayListener onClickAway={handleClose}>
            <AnimatedPaper
              className={clsx(
                open && !transitioning ? 'popper-enter' : 'popper-exit',
                'rounded-lg'
              )}
            >
              <MenuList>
                {/* EDIT OFFER */}
                <ActionMenuItem
                  label={t('edit_offer_action')}
                  onClick={() => {
                    handleClose();
                    handleEdit();
                  }}
                  disabled={disabledEdit}
                  activeTooltipMessage=""
                  disabledTooltipMessage={t('tooltip_unable_to_edit_offer')}
                  icon={<IconEdit size={16} />}
                />
                {/* DUPLICATE OFFER */}
                <ActionMenuItem
                  label={t('duplicate_offer_action')}
                  onClick={() => {
                    handleClose();
                    handleDuplicateOffer(offer!);
                  }}
                  disabled={false}
                  activeTooltipMessage=""
                  disabledTooltipMessage=""
                  icon={<IconCopy size={16} />}
                />
                {/* DELETE OFFER */}
                <ActionMenuItem
                  label={t('close_offer_action')}
                  onClick={() => {
                    handleClose();
                    onCloseOffer(offerId);
                  }}
                  disabled={disabledDelete}
                  activeTooltipMessage=""
                  disabledTooltipMessage={t('tooltip_unable_to_close_offer')}
                  className="!text-Action-Notification"
                  icon={<IconSquareX size={16} />}
                />
              </MenuList>
            </AnimatedPaper>
          </ClickAwayListener>
        </Popper>
      )}
    </div>
  );
};

const TOOLTIP_DELAY = 1000;

const ActionMenuItem = ({
  label,
  onClick,
  disabled,
  activeTooltipMessage,
  disabledTooltipMessage,
  className,
  icon,
}: {
  label?: string;
  onClick: () => void;
  disabled?: boolean;
  activeTooltipMessage?: string;
  disabledTooltipMessage?: string;
  className?: string;
  icon?: React.ReactNode;
}) => {
  return (
    <Tooltip
      disableHoverListener={
        // disabled -> turn off tooltip when no disabledTooltipMessage
        // active -> turn off tooltip when no activeTooltipMessage
        disabled ? !disabledTooltipMessage : !activeTooltipMessage
      }
      enterDelay={TOOLTIP_DELAY}
      enterNextDelay={TOOLTIP_DELAY}
      title={disabled ? disabledTooltipMessage : activeTooltipMessage}
      placement="left"
    >
      <div>
        <MenuItem
          disabled={disabled}
          onClick={onClick}
          className={clsx('flex items-center gap-2', className)}
        >
          {icon}
          {label}
        </MenuItem>
      </div>
    </Tooltip>
  );
};

export default OfferActionsPopper;
