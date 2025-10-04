import { Tooltip } from '@mui/material';

import { TagLabel } from '@/components/common/TagLabel';

interface SkillTagsCompactProps {
  skills: string[];
  flexWrap?: boolean;
}

export const SkillTagsCompact: React.FC<SkillTagsCompactProps> = ({
  skills,
  flexWrap = false,
}) => {
  if (!skills || skills.length === 0) return null;

  return (
    <Tooltip
      placement="bottom"
      enterDelay={200}
      enterNextDelay={200}
      title={
        <div className="flex flex-col gap-1 text-left text-s01">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      }
      disableHoverListener={skills.length < 2}
    >
      <div className="group relative">
        <div
          className={`flex flex-row ${flexWrap ? 'flex-wrap gap-1' : 'space-x-small'}`}
        >
          <TagLabel
            key={0}
            text={
              skills[0].length > 15
                ? skills[0].substring(0, 15) + '...'
                : skills[0]
            }
          />
          {skills.length > 1 && (
            <TagLabel
              key={1}
              text={
                skills[1].length > 15
                  ? skills[1].substring(0, 15) + '...'
                  : skills[1]
              }
            />
          )}
          {skills.length > 2 && <TagLabel text={`+${skills.length - 2}`} />}
        </div>
      </div>
    </Tooltip>
  );
};
