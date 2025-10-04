import React from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

const CurrencyFormat: React.FC = React.forwardRef<
  HTMLInputElement,
  NumericFormatProps
>((props, ref) => {
  const { onChange, ...rest } = props;

  return (
    <NumericFormat
      {...rest}
      getInputRef={ref}
      valueIsNumericString
      thousandSeparator="."
      decimalSeparator=","
      allowNegative={false} // Disable negative numbers (can be adjusted if needed)
      decimalScale={2} // Limit to 2 decimal places
      // fixedDecimalScale // Always show 2 decimal places even for whole numbers
      // prefix="€ "  // or suffix=" €" if you want to display currency symbol
      onValueChange={(values) => {
        onChange &&
          onChange({
            target: {
              name: props.name,
              value: values.value, // Keep only the number, without currency symbol
            },
          } as React.ChangeEvent<HTMLInputElement>);
      }}
    />
  );
});

export default CurrencyFormat;
