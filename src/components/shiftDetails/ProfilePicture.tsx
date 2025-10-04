import { useSelector } from 'react-redux';

import { Avatar } from '@mui/material';

import { RootState } from '@/store/types';

import LivoIcon from '@/components/common/LivoIcon';

import { modalityTags } from '@/utils/constants';

import { ShiftModalityEnum } from '@/types';

interface ProfilePictureProps {
  profilePictureUrl?: string;
  modality: ShiftModalityEnum | null;
  style?: any;
  size: number;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({
  profilePictureUrl,
  modality,
  size,
  style,
}) => {
  const { accountInfo } = useSelector((state: RootState) => state.account);
  const poolAndInternalOnboarded =
    accountInfo?.livoPoolOnboarded && accountInfo?.livoInternalOnboarded;

  return (
    <div style={{ width: size, height: size, ...style }} className="relative">
      <Avatar
        src={profilePictureUrl}
        sx={{
          width: size,
          height: size,
          borderRadius: '8px',
        }}
        variant="rounded"
        alt="Profile picture"
      />

      {modality && poolAndInternalOnboarded && (
        <div
          className="absolute -bottom-tiny -right-tiny flex items-center justify-center rounded-full border-2 border-solid border-white"
          style={{
            backgroundColor: modalityTags[modality].backgroundColor,
            width: size / 2,
            height: size / 2,
          }}
        >
          <LivoIcon
            name={modalityTags[modality].icon}
            size={size / 4}
            color={modalityTags[modality].color}
          />
        </div>
      )}
    </div>
  );
};
