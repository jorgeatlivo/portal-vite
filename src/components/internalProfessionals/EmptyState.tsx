import { Typography } from '../atoms/Typography';

interface EmptyShiftsStateProps {
  title?: string;
  subtitle?: string;
}
export const EmptyShiftsState: React.FC<EmptyShiftsStateProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="mt-medium flex flex-col p-medium text-center">
      {title && (
        <Typography variant={'heading/small'} className={'mb-small'}>
          {title}
        </Typography>
      )}
      {subtitle && <Typography variant="body/regular">{subtitle}</Typography>}
    </div>
  );
};
