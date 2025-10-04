import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { useQueryClient } from '@tanstack/react-query';

import { PortalProfessionalSearchVo } from '@/services/professionals';
import {
  applySelectedOptions,
  clearSelectedOptionsInFilter,
  resetSelectedOptions,
  selectOptionInFilter,
  unselectOptionInFilter,
} from '@/store/actions/filtersActions';
import { RootState } from '@/store/types';
import { PAGINATED_SHIFT_LIST_QUERY_KEY } from '@/queries/paginated-shift-list';

import { ActionButton } from '@/components/common/ActionButton';
import { FilterComponent } from '@/components/common/FilterComponent';
import { ModalContainer } from '@/components/common/ModalContainer';
import { HeaderComponent } from '@/components/publishShift/HeaderComponent';

import { useProfessionalSearch } from '@/hooks/use-professional-search';

import colors from '@/config/color-palette';
import { Typography } from '../atoms/Typography';
import { ProFilterComponent } from '../common/ProFilterComponent';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterShiftsModal({ isOpen, onClose }: Props) {
  const { t } = useTranslation('shift-claim-list');
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const filters = useSelector((state: RootState) => state.filterShifts.filters);
  const selectedProfessionals =
    useSelector(
      (state: RootState) => state.filterShifts.selectedProfessionals
    ) || [];

  const [professionalFilter, setProfessionalFilter] = useState('');
  const [tempSelectedProfessionals, setTempSelectedProfessionals] = useState<
    PortalProfessionalSearchVo[]
  >(selectedProfessionals);
  const { professionals, isLoading } =
    useProfessionalSearch(professionalFilter);

  const handleProfessionalChange = {
    onFilter: (value: string) => {
      setProfessionalFilter(value);
    },
    onSelect: (professional: PortalProfessionalSearchVo) => {
      if (!tempSelectedProfessionals.find((p) => p.id === professional.id)) {
        setTempSelectedProfessionals([
          ...tempSelectedProfessionals,
          professional,
        ]);
      }
    },
    onClear: () => {
      setTempSelectedProfessionals([]);
    },
    onRemove: (professional: PortalProfessionalSearchVo) => {
      setTempSelectedProfessionals(
        tempSelectedProfessionals.filter((p) => p.id !== professional.id)
      );
    },
  };

  const handleApplyFilters = () => {
    dispatch(applySelectedOptions());
    dispatch({
      type: 'SET_SELECTED_PROFESSIONALS',
      payload: tempSelectedProfessionals,
    });

    queryClient.invalidateQueries({
      queryKey: [PAGINATED_SHIFT_LIST_QUERY_KEY],
    });

    onClose();
  };

  const handleClose = () => {
    dispatch(resetSelectedOptions());
    setTempSelectedProfessionals(selectedProfessionals);
    onClose();
  };

  return (
    <ModalContainer
      isOpen={isOpen}
      style={{
        margin: 'auto',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      onClose={handleClose}
    >
      <div className="flex w-[90vw] max-w-[530px] flex-col rounded-[8px] bg-white">
        <HeaderComponent title={t('filters_label')} onClose={handleClose} />
        <div className="flex-1 overflow-y-auto p-large pb-xLarge">
          <div className="flex flex-col">
            {filters.map((filter, index) => (
              <FilterComponent
                key={index}
                filter={filter}
                selectOptionInFilter={(filter, option) =>
                  dispatch(selectOptionInFilter(filter, option))
                }
                unselectOptionInFilter={(filter, option) =>
                  dispatch(unselectOptionInFilter(filter, option))
                }
                clearSelectedOptionsInFilter={(filter) =>
                  dispatch(clearSelectedOptionsInFilter(filter))
                }
              />
            ))}
            <ProFilterComponent
              title={t('professional_title')}
              placeholder={t('professional_placeholder')}
              value={professionalFilter}
              onChange={handleProfessionalChange.onFilter}
              professionals={professionals}
              isLoading={isLoading}
              onSelect={handleProfessionalChange.onSelect}
              selectedProfessionals={tempSelectedProfessionals}
              onClearSelection={handleProfessionalChange.onClear}
              onRemoveProfessional={handleProfessionalChange.onRemove}
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-end border-t border-Divider-Default p-large">
          <div className="w-56">
            <ActionButton
              isDisabled={false}
              isLoading={false}
              onClick={handleApplyFilters}
            >
              <Typography
                variant="action/regular"
                color={colors['Neutral-000']}
                className="py-small text-center"
              >
                {t('filter_button_label')}
              </Typography>
            </ActionButton>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
}
