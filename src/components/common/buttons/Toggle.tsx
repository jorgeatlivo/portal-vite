interface ToggleProps {
  option1: {
    label: string;
    value: string;
  };
  option2: {
    label: string;
    value: string;
  };
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  unselectedColor: string;
  unselectedTextColor: string;
  selectedColor: string;
  selectedTextColor: string;
  style?: React.CSSProperties;
}

export const Toggle: React.FC<ToggleProps> = ({
  option1,
  option2,
  selectedOption,
  setSelectedOption,
  unselectedColor,
  unselectedTextColor,
  selectedColor,
  selectedTextColor,
  style,
}) => {
  return (
    <div
      className={'flex flex-row space-x-tiny self-start rounded-full'}
      style={{
        background: unselectedColor,
        ...style,
      }}
    >
      <button
        type="button"
        onClick={() => setSelectedOption(option1.value)}
        className="rounded-full px-medium py-small"
        style={{
          color:
            selectedOption === option1.value
              ? selectedTextColor
              : unselectedTextColor,
          background:
            selectedOption === option1.value ? selectedColor : 'transparent',
        }}
      >
        <p className="action-small">{option1.label}</p>
      </button>
      <button
        type="button"
        onClick={() => setSelectedOption(option2.value)}
        className="rounded-full px-medium py-small"
        style={{
          color:
            selectedOption === option2.value
              ? selectedTextColor
              : unselectedTextColor,
          background:
            selectedOption === option2.value ? selectedColor : 'transparent',
        }}
      >
        <p className="action-small">{option2.label}</p>
      </button>
    </div>
  );
};
