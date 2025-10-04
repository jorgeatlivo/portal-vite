import { CSSProperties } from 'react';

import { TextDTO } from '@/types/common/widgets';
import { resolveTypographyStyles } from '@/utils/uiUtils';

import { SDIcon } from './SDIcon';

interface SDTextProps extends TextDTO {
  style?: CSSProperties;
}

export function SDText(props: SDTextProps) {
  return (
    <div className="flex flex-row items-center" style={props.style}>
      {props.icon && <SDIcon {...props.icon} className="mr-1" />}
      <div className="flex flex-col items-start">
        {props.displayText.split('\n').map((textLine, index) => (
          <p
            key={`${textLine}-${index}`}
            style={{
              color: props.color,
              backgroundColor: props.backgroundColor,
              ...resolveTypographyStyles(
                props.typographyStyle || 'body',
                props.typographySize || 'regular'
              ),
            }}
          >
            {textLine}
          </p>
        ))}
      </div>
    </div>
  );
}
