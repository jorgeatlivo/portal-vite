import { CustomInput } from '../../components/common/CustomInput';

interface SearchBarProps {
  searchText: string;
  setSearchText: (text: string) => void;
  searchPlaceHolder?: string;
  style?: any;
}
export const SearchBar: React.FC<SearchBarProps> = ({
  searchText,
  setSearchText,
  searchPlaceHolder,
  style,
}) => {
  return (
    <CustomInput
      setValue={setSearchText}
      selectedValue={searchText}
      iconName={'search'}
      placeHolder={searchPlaceHolder}
      inputStyle={style}
    />
  );
};
