import { useState } from 'react';

import { CategoryTag } from '@/components/common/CategoryTag';
import LivoIcon from '@/components/common/LivoIcon';
import { ModalContainer } from '@/components/common/ModalContainer';
import { HeaderComponent } from '@/components/publishShift/HeaderComponent';
import { SelectCategory } from '@/components/publishShift/SelectCategory';

import { Category } from '@/types/common/category';

interface EditCategoryComponentProps {
  selectedCategory: Category;
  availableCategories: Category[];
  setSelectedCategory: (category: Category) => void;
  hasChanged?: boolean;
}
export const EditCategoryComponent: React.FC<EditCategoryComponentProps> = ({
  selectedCategory,
  availableCategories,
  setSelectedCategory,
  hasChanged,
}) => {
  const [selectCategoryModalOpen, setSelectCategoryModalOpen] = useState(false);

  const selectCategoryModal = (
    <ModalContainer isOpen={selectCategoryModalOpen}>
      <div className="flex w-[700px] flex-col rounded-[16px] max-h-[80vh]  bg-Background-Primary">
        <HeaderComponent
          title={'Cambiar profesión'}
          onClose={() => setSelectCategoryModalOpen(false)}
        />
        <div className="flex-1 min-h-0 overflow-y-auto mb-5 justify-start">
          <SelectCategory
            categories={availableCategories}
            onSelectingCategory={(category) => {
              setSelectedCategory(category);
              setSelectCategoryModalOpen(false);
            }}
          />
        </div>
      </div>
    </ModalContainer>
  );
  return (
    <>
      <div
        onClick={() => setSelectCategoryModalOpen(true)}
        className="ring-solid flex w-full cursor-pointer items-center justify-start space-x-small rounded-[8px] px-small py-medium ring-1 ring-Divider-Subtle hover:bg-gray-100"
      >
        <div className="flex w-full items-center space-x-small">
          {hasChanged ? (
            <div className="size-small rounded-full bg-Primary-500" />
          ) : null}
          {selectedCategory ? (
            <CategoryTag text={selectedCategory.acronym} />
          ) : null}
          <p className="body-regular leading-none text-Text-Subtle">
            {selectedCategory?.displayText || 'Seleccionar profesión'}
          </p>
        </div>
        <LivoIcon name="chevron-down" size={24} color="#000"></LivoIcon>
      </div>
      {selectCategoryModal}
    </>
  );
};
