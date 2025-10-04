import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import {
  applySelectedOptionsInProfessionalFilter,
  clearSelectedProfessionalSpecificFilter,
  resetSelectedOptionsInProfessionalFilter,
  selectOptionInProfessionalFilter,
  unselectOptionInProfessionalFilter,
} from '@/store/actions/professionalFiltersAction';
import { RootState } from '@/store/types';

import { ActionButton } from '@/components/common/ActionButton';
import { FilterComponent } from '@/components/common/FilterComponent';
import { ModalContainer } from '@/components/common/ModalContainer';
import { HeaderComponent } from '@/components/publishShift/HeaderComponent';

interface FilterProfessionalsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterProfessionalsModal({
  isOpen,
  onClose,
}: FilterProfessionalsModalProps) {
  const { t } = useTranslation('shift-claim-list');
  const filters = useSelector(
    (state: RootState) => state.professionalFilters.filters
  );
  const dispatch = useDispatch();

  return (
    <ModalContainer isOpen={isOpen}>
      <div className="flex h-[500px] w-[90vw] max-w-[530px] flex-col justify-between overflow-y-auto rounded-[8px] bg-white">
        <div>
          <HeaderComponent
            title={t('filters_label')}
            onClose={() => {
              dispatch(resetSelectedOptionsInProfessionalFilter());
              onClose();
            }}
          />
          <div className="m-medium flex flex-col">
            {filters.map((filter, index) => (
              <FilterComponent
                key={index}
                filter={filter}
                selectOptionInFilter={(filter, option) =>
                  dispatch(selectOptionInProfessionalFilter(filter, option))
                }
                unselectOptionInFilter={(filter, option) =>
                  dispatch(unselectOptionInProfessionalFilter(filter, option))
                }
                clearSelectedOptionsInFilter={(filter) =>
                  dispatch(clearSelectedProfessionalSpecificFilter(filter))
                }
              />
            ))}
          </div>
        </div>
        <div className="flex flex-row items-center justify-end border-t border-Divider-Default p-large">
          <div className="bg-Primary-Default flex text-white">
            <ActionButton
              isDisabled={false}
              isLoading={false}
              onClick={() => {
                dispatch(applySelectedOptionsInProfessionalFilter());
                onClose();
              }}
            >
              <p className="action-regular w-[175px] py-small text-center">
                {t('filter_button_label')}
              </p>
            </ActionButton>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
}
