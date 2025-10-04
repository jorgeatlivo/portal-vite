import clsx from 'clsx';

interface CalendarDayItemProps {
  day: string;
  isToday: boolean;
  onPress: () => void;
  isOtherMonth: boolean;
  isSelected: boolean;
  selectedColor?: string;
  hasAlert?: boolean;
  hasShifts: boolean;
  disabled?: boolean;
  holiday?: boolean;
}

export const CalendarDayItem: React.FC<CalendarDayItemProps> = ({
  day,
  isToday,
  onPress,
  isOtherMonth,
  isSelected,
  selectedColor,
  hasAlert,
  hasShifts,
  disabled,
  holiday,
}) => {
  const todayClass = 'border-[1px] border-solid border-Divider-Default';
  const selectedClass = clsx(
    selectedColor && `bg-[${selectedColor}]`,
    !selectedColor &&
      (holiday ? 'bg-Purple-400 text-white' : 'bg-Primary-450 text-white')
  );

  const otherMonthClass = 'text-gray-400';
  const holidayClass = 'ring-solid ring-[2px] ring-Purple-400';

  return (
    <button
      type="button"
      className={clsx(
        'relative box-border flex size-xLarge items-center justify-center rounded-[4px] p-tiny transition-colors duration-300 ease-in-out',
        isSelected ? selectedClass : 'hover:bg-Background-Secondary',
        !isSelected && holiday && holidayClass,
        !isSelected && isToday && todayClass,
        !isSelected && isOtherMonth && otherMonthClass
      )}
      disabled={disabled}
      onClick={onPress}
    >
      <div>
        <p
          className={`
                    body-sm
                    w-large
                    text-center
                    ${hasShifts && !isSelected ? 'subtitle-regular text-Primary-500' : ''}
                    ${disabled ? 'text-Text-Light line-through' : ''}
                `}
        >
          {day}
        </p>
        {hasAlert && !isSelected ? (
          <div className="absolute right-[2px] top-tiny size-tiny rounded-full bg-Negative-500" />
        ) : null}
      </div>
    </button>
  );
};
