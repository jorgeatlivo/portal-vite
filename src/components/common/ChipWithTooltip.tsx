import { Tooltip } from '@mui/material';

import Chip, { ChipProps } from '@/components/common/Chip';

/**
 * a Custom Chip component to replace MUI Chip
 */
function ChipWithTooltip(props: ChipProps) {
  const shouldTrim =
    !!props.trimLength && (props.label?.length ?? 0) > props.trimLength;
  return (
    <Tooltip
      placement="bottom"
      disableHoverListener={!shouldTrim}
      enterDelay={200}
      enterNextDelay={200}
      title={props.label ?? ''}
    >
      <div>
        <Chip {...props} />
      </div>
    </Tooltip>
  );
}

export default ChipWithTooltip;
