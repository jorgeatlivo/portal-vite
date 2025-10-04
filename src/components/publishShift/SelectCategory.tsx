import { usePostHog } from 'posthog-js/react';

import LivoIcon from '@/components/common/LivoIcon';

import { Category } from '@/types/common/category';

import { CategoryTag } from '../../components/common/CategoryTag';

interface SelectCategoryProps {
  categories: Category[];
  onSelectingCategory: (category: Category) => void;
}
export const SelectCategory: React.FC<SelectCategoryProps> = ({
  categories,
  onSelectingCategory,
}) => {
  const posthog = usePostHog();

  return (
    <div className="flex w-full flex-col justify-start space-y-small px-large py-xLarge">
      {categories.map((category, index) => {
        return (
          <div
            key={index}
            onClick={() => {
              posthog.capture(category.code);
              onSelectingCategory(category);
            }}
            className="ring-solid flex w-full cursor-pointer items-center justify-start space-x-small rounded-[8px] px-medium py-large ring-1 ring-Divider-Subtle hover:bg-gray-100"
          >
            <div className="flex w-full items-center space-x-small">
              <CategoryTag text={category.acronym} />
              <p className="body-regular leading-none text-Text-Subtle">
                {category.displayText}
              </p>
            </div>
            <LivoIcon name="chevron-right" size={24} color="#000"></LivoIcon>
          </div>
        );
      })}
    </div>
  );
};
