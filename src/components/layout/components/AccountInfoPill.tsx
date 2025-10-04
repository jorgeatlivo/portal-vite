import { AccountInfo } from '@/services/account';

import LivoIcon from '../../common/LivoIcon';

export const AccountInfoPill = ({
  accountInfo,
}: {
  accountInfo: AccountInfo;
}) => (
  <div className="flex cursor-pointer items-center space-x-tiny self-start rounded-full p-small ">
    <LivoIcon size={24} name="user-circle" color="#FFFF" />
    <p className="subtitle-regular text-Text-Inverse">
      {accountInfo.firstName} {accountInfo.lastName}
    </p>
  </div>
);
