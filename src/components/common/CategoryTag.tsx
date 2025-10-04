import { Typography } from '@/components/atoms/Typography';

interface CategoryTagProps {
  text: string;
}

export const CategoryTag: React.FC<CategoryTagProps> = ({ text }) => {
  return (
    <div className="flex size-fit items-center justify-start gap-2 rounded border border-Neutral-600 bg-white p-1">
      <Typography variant="body/small" className="text-Text-Default">
        {text}
      </Typography>
    </div>
  );
};
