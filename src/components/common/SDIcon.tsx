import { IconDTO } from '@/types/common/widgets';
import { resolveIconSize } from '@/utils/uiUtils';

import LivoIcon from './LivoIcon';

interface SDIconProps extends IconDTO {
  className?: string;
}

export function SDIcon({ className, name, width, color }: SDIconProps) {
  return (
    <div className={className}>
      <LivoIcon name={name} size={resolveIconSize(width!)} color={color!} />
    </div>
  );
}
