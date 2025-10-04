import { day, duration } from '@/utils/datetime';

export const calculateTotalPay = (
  price: string | undefined,
  startTime: string,
  endTime: string,
  priceMode?: 'hourly' | 'total'
) => {
  const numericPrice = price ? +price.replace(',', '.') : 0;

  if (priceMode === 'hourly') {
    const hours = duration(day(endTime), day(startTime), 'hour');
    return numericPrice * hours;
  } else {
    return numericPrice;
  }
};
