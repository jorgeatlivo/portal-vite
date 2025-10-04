import { CustomInput } from '@/components/common/CustomInput';

interface SearchBarProps {
  searchText: string;
  setSearchText: (text: string) => void;
  searchPlaceHolder?: string;
  compact?: boolean;
  style?: any;
}
export const SearchBar: React.FC<SearchBarProps> = ({
  searchText,
  setSearchText,
  searchPlaceHolder,
  compact,
  style,
}) => {
  return (
    <div className={'pt-[2px]'}>
      <CustomInput
        setValue={setSearchText}
        selectedValue={searchText}
        iconName={'search'}
        placeHolder={searchPlaceHolder}
        inputStyle={style}
        compact={compact}
      />
    </div>
  );
};
