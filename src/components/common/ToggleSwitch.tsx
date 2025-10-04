interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
}

export default function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`h-[20px] w-[36px] rounded-full transition-colors duration-200 ${
        checked ? 'bg-Primary-500' : 'bg-gray-300'
      }`}
    >
      <div
        className={`size-large rounded-full bg-white transition-transform duration-200 ${
          checked ? 'translate-x-[18px]' : 'translate-x-[2px]'
        }`}
      />
    </button>
  );
}
