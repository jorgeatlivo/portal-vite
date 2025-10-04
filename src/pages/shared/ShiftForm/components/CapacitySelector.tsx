import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import { IconUser } from '@tabler/icons-react';
import clsx from 'clsx';

import { CapacityItem } from './CapacityItem';

interface CapacitySelectorProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  maxCapacity: number;
  disabled?: boolean;
}

export const CapacitySelector = <T extends FieldValues>({
  control,
  name,
  maxCapacity,
  disabled = false,
}: CapacitySelectorProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <div className="flex h-12 w-full flex-row items-center gap-4">
        <IconUser
          size={24}
          className={clsx('text-Divider-Subtle', {
            'opacity-50': disabled,
          })}
        />
        {Array.from({ length: maxCapacity }, (_, i) => i + 1).map(
          (capacity) => (
            <CapacityItem
              key={capacity}
              isSelected={capacity === field.value}
              capacity={capacity}
              onPress={field.onChange}
              disabled={disabled}
            />
          )
        )}
      </div>
    )}
  />
);
