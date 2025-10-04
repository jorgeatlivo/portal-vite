import * as React from 'react';

import {
  IconAdjustmentsAlt,
  IconAdjustmentsHorizontal,
  IconAlertCircle,
  IconAlertSquare,
  IconAlertTriangle,
  IconAlertTriangleFilled,
  IconArrowLeft,
  IconArrowNarrowRight,
  IconBabyCarriage,
  IconBell,
  IconBlockquote,
  IconBooks,
  IconBriefcase,
  IconBuildingCommunity,
  IconBuildingHospital,
  IconBuildings,
  IconCalendar,
  IconCalendarDue,
  IconCalendarEvent,
  IconCalendarMonth,
  IconCalendarSearch,
  IconCar,
  IconCashBanknote,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconCircle,
  IconCircleCheck,
  IconCircleCheckFilled,
  IconCircleDotFilled,
  IconCircleMinus,
  IconClockHour5,
  IconCloudOff,
  IconConfetti,
  IconCopy,
  IconDeviceMobileMessage,
  IconDots,
  IconDownload,
  IconExclamationCircle,
  IconEye,
  IconFileCheck,
  IconFileText,
  IconFileTime,
  IconFirstAidKit,
  IconGift,
  IconHash,
  IconHeart,
  IconHeartbeat,
  IconHeartFilled,
  IconHeartHandshake,
  IconHistory,
  IconHome,
  IconHourglassHigh,
  IconIdBadge2,
  IconInfoCircle,
  IconKey,
  IconLanguage,
  IconLogout,
  IconMail,
  IconMap,
  IconMapPin,
  IconMenu2,
  IconMinus,
  IconMoon,
  IconNotes,
  IconNurse,
  IconPencil,
  IconPercentage,
  IconPlus,
  IconRefresh,
  IconRepeat,
  IconReplace,
  IconReportMedical,
  IconRobotFace,
  IconRocket,
  IconSchool,
  IconSearch,
  IconServer,
  IconSettings,
  IconShare2,
  IconShield,
  IconShirt,
  IconSparkles,
  IconSquare,
  IconStar,
  IconStarFilled,
  IconStethoscope,
  IconSun,
  IconSunset,
  IconToolsKitchen2,
  IconTrash,
  IconUrgent,
  IconUser,
  IconUserCheck,
  IconUserCircle,
  IconUserPlus,
  IconUserSearch,
  IconUsers,
  IconUserX,
  IconVaccine,
  IconWorld,
  IconX,
} from '@tabler/icons-react';

import { IconLivo } from '@/components/common/icons/IconLivo';
import { IconLivoFull } from '@/components/common/icons/IconLivoFull';

import { DisclaimerTypeEnum } from '@/types/common/disclaimers';

import colors from '@/config/color-palette';
import { IconCIF } from './icons/IconCIF';
import { IconDocument } from './icons/IconDocument';
import { IconPatientInBed } from './icons/IconPatientInBed';
import { IconPortalTabs } from './icons/IconPortalTabs';

interface LivoIconProps {
  name: string;
  size: number;
  color: string;
  style?: any;
}

const LivoIcon: React.FC<LivoIconProps> = ({ name, size, color, style }) => {
  const getSvg = (
    path: string,
    pathProps: any = {},
    originalRatio?: number
  ) => (
    <div
      style={{
        height: size,
        width: size,
        ...style,
      }}
    >
      <svg
        width={'100%'}
        height={'100%'}
        viewBox={`0 0 ${originalRatio || size} ${originalRatio || size}`}
        fill="none"
      >
        <path d={path} {...pathProps} />
      </svg>
    </div>
  );

  const LIVO_ICONS = {
    'clock-filled': getSvg(
      'M17.6523 3.79888C19.1606 4.66973 20.4153 5.9194 21.2922 7.42418C22.169 8.92895 22.6377 10.6366 22.6518 12.3782C22.6658 14.1198 22.2248 15.8348 21.3724 17.3536C20.5199 18.8723 19.2856 20.1421 17.7916 21.0372C16.2976 21.9323 14.5957 22.4217 12.8544 22.4569C11.1132 22.4922 9.39289 22.072 7.8639 21.2381C6.3349 20.4042 5.05021 19.1854 4.13701 17.7024C3.22381 16.2194 2.71375 14.5236 2.65734 12.7829L2.65234 12.4589L2.65734 12.1349C2.71335 10.4079 3.21589 8.72484 4.11598 7.24987C5.01608 5.7749 6.283 4.55833 7.79324 3.71876C9.30347 2.87919 11.0055 2.44527 12.7333 2.45931C14.4612 2.47336 16.1559 2.93487 17.6523 3.79888ZM12.6523 6.45888C12.4074 6.45891 12.171 6.54883 11.988 6.71159C11.8049 6.87435 11.688 7.09863 11.6593 7.34188L11.6523 7.45888V12.4589L11.6613 12.5899C11.6841 12.7634 11.7521 12.9279 11.8583 13.0669L11.9453 13.1669L14.9453 16.1669L15.0393 16.2489C15.2147 16.3849 15.4304 16.4588 15.6523 16.4588C15.8743 16.4588 16.09 16.3849 16.2653 16.2489L16.3593 16.1659L16.4423 16.0719C16.5784 15.8965 16.6523 15.6808 16.6523 15.4589C16.6523 15.2369 16.5784 15.0212 16.4423 14.8459L16.3593 14.7519L13.6523 12.0439V7.45888L13.6453 7.34188C13.6167 7.09863 13.4998 6.87435 13.3167 6.71159C13.1337 6.54883 12.8973 6.45891 12.6523 6.45888Z',
      {
        fill: color,
      }
    ),
    'exclamation-circle': <IconExclamationCircle size={size} color={color} />,
    'circle-check': <IconCircleCheck size={size} color={color} />,
    'circle-check-filled': <IconCircleCheckFilled size={size} color={color} />,
    'info-circle': <IconInfoCircle size={size} color={color} />,
    shield: <IconShield size={size} color={color} />,
    notes: <IconNotes size={size} color={color} />,
    urgent: <IconUrgent size={size} color={color} />,
    refresh: <IconRefresh size={size} color={color} />,
    'icon-user-x': <IconUserX size={size} color={color} />,
    history: <IconHistory size={size} color={color} />,
    'file-time': <IconFileTime size={size} color={color} />,
    'file-check': <IconFileCheck size={size} color={color} />,
    'first-aid-kit': <IconFirstAidKit size={size} color={color} />,
    'calendar-due': <IconCalendarDue size={size} color={color} />,
    home: <IconHome size={size} color={color} />,
    user: <IconUser size={size} color={color} />,
    clock: <IconClockHour5 size={size} color={color} />,
    'adjustments-horizontal': (
      <IconAdjustmentsHorizontal size={size} color={color} />
    ),
    close: <IconX size={size} color={color} />,
    'chevron-up': <IconChevronUp size={size} color={color} />,
    'chevron-down': <IconChevronDown size={size} color={color} />,
    'chevron-right': <IconChevronRight size={size} color={color} />,
    'chevron-left': <IconChevronLeft size={size} color={color} />,
    'calendar-search': <IconCalendarSearch size={size} color={color} />,
    'checkbox-unchecked': <IconSquare size={size} color={color} />,
    'checkbox-checked': getSvg(
      'M18.333 2c1.96 0 3.56 1.537 3.662 3.472l.005.195v12.666c0 1.96-1.537 3.56-3.472 3.662l-.195.005H5.667a3.667 3.667 0 01-3.662-3.472L2 18.333V5.667c0-1.96 1.537-3.56 3.472-3.662L5.667 2h12.666zm-2.626 7.293a1 1 0 00-1.414 0L11 12.585l-1.293-1.292-.094-.083a1 1 0 00-1.32 1.497l2 2 .094.083a1 1 0 001.32-.083l4-4 .083-.094a1 1 0 00-.083-1.32z',
      {
        fill: color,
      }
    ),
    'calendar-2': getSvg(
      'M30.667 56H16a5.333 5.333 0 01-5.333-5.333v-32A5.333 5.333 0 0116 13.333h32a5.333 5.333 0 015.333 5.334v16M42.667 8v10.667M21.333 8v10.667M10.667 29.333h42.666m-12 11.908h6.75a2.25 2.25 0 012.25 2.25v4.5a2.25 2.25 0 01-2.25 2.25h-4.5a2.25 2.25 0 00-2.25 2.25v4.5a2.25 2.25 0 002.25 2.25h6.75',
      {
        stroke: colors['Primary-500'],
        strokeWidth: 5.33333,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        scale: size / 24,
      }
    ),
    livo: <IconLivo size={size} color={color} />,
    'livo-full': <IconLivoFull size={size} color={color} />,
    hourglass: <IconHourglassHigh size={size} color={color} />,

    document: <IconDocument size={size} color={color} />,
    share: <IconShare2 size={size} color={color} />,
    gift: <IconGift size={size} color={color} />,
    city: <IconBuildings size={size} color={color} />,
    cif: <IconCIF size={size} color={color} />,
    'building-community': <IconBuildingCommunity size={size} color={color} />,
    'internal-hospital': <IconBuildingHospital size={size} color={color} />,
    pencil: <IconPencil size={size} color={color} />,
    sunrise: <IconSun size={size} color={color} />,
    sunset: <IconSunset size={size} color={color} />,
    moon: <IconMoon size={size} color={color} />,
    'arrow-right': <IconArrowNarrowRight size={size} color={color} />,
    'arrow-left': <IconArrowLeft size={size} color={color} />,
    'calendar-month': <IconCalendarMonth size={size} color={color} />,
    star: <IconStar size={size} color={color} />,
    'robot-face': <IconRobotFace size={size} color={color} />,
    check: <IconCheck size={size} color={color} />,
    'check-circle': <IconCircleCheck size={size} color={color} />,
    mail: <IconMail size={size} color={color} />,
    confetti: <IconConfetti size={size} color={color} />,
    'shield-check-filled': getSvg(
      'M7.999 1.333l.078.005.04.005.04.009.074.022c.051.02.1.044.145.075l.07.055.17.145a7.333 7.333 0 004.792 1.691l.228-.006a.667.667 0 01.67.478 8.666 8.666 0 01-6.139 10.833.666.666 0 01-.334 0 8.667 8.667 0 01-6.14-10.833.667.667 0 01.67-.478 7.333 7.333 0 005.02-1.685l.176-.15.064-.05a.662.662 0 01.145-.075l.075-.022a.648.648 0 01.079-.014l.077-.005zm2.473 4.862a.666.666 0 00-.943 0L7.333 8.39l-.862-.862-.062-.055a.667.667 0 00-.88.998l1.333 1.333.063.056a.666.666 0 00.88-.056l2.666-2.666.056-.063a.667.667 0 00-.056-.88z',
      {
        fill: color,
      }
    ),
    'radio-filled': <IconCircleDotFilled size={size} color={color} />,
    'square-check-filled': getSvg(
      'M18.333 2c1.96 0 3.56 1.537 3.662 3.472l.005.195v12.666c0 1.96-1.537 3.56-3.472 3.662l-.195.005H5.667a3.667 3.667 0 01-3.662-3.472L2 18.333V5.667c0-1.96 1.537-3.56 3.472-3.662L5.667 2h12.666zm-2.626 7.293a1 1 0 00-1.414 0L11 12.585l-1.293-1.292-.094-.083a1 1 0 00-1.32 1.497l2 2 .094.083a1 1 0 001.32-.083l4-4 .083-.094a1 1 0 00-.083-1.32z',
      {
        fill: color,
        scale: size / 24,
      },
      24
    ),
    'star-filled': <IconStarFilled size={size} color={color} />,
    circle: <IconCircle size={size} color={color} />,
    square: <IconSquare size={size} color={color} />,
    'icon-device-mobile-message': (
      <IconDeviceMobileMessage size={size} color={color} />
    ),
    'report-medical': <IconReportMedical size={size} color={color} />,
    briefcase: <IconBriefcase size={size} color={color} />,
    calendar: <IconCalendar size={size} color={color} />,
    'log-out': <IconLogout size={size} color={color} />,
    'file-text': <IconFileText size={size} color={color} />,
    users: <IconUsers size={size} color={color} />,
    plus: <IconPlus size={size} color={color} />,
    nurse: <IconNurse size={size} color={color} />,
    blockquote: <IconBlockquote size={size} color={color} />,
    stethoscope: <IconStethoscope size={size} color={color} />,
    'cash-banknote': <IconCashBanknote size={size} color={color} />,
    eye: <IconEye size={size} color={color} />,
    dots: <IconDots size={size} color={color} />,
    'user-search': <IconUserSearch size={size} color={color} />,
    trash: <IconTrash size={size} color={color} />,
    minus: <IconMinus size={size} color={color} />,
    bell: <IconBell size={size} color={color} />,
    'id-badge-2': <IconIdBadge2 size={size} color={color} />,
    copy: <IconCopy size={size} color={color} />,
    settings: <IconSettings size={size} color={color} />,
    map: <IconMap size={size} color={color} />,
    'map-pin': <IconMapPin size={size} color={color} />,
    key: <IconKey size={size} color={color} />,
    'alert-triangle-filled': (
      <IconAlertTriangleFilled size={size} color={color} />
    ),
    repeat: <IconRepeat size={size} color={color} />,
    'cloud-off': <IconCloudOff size={size} color={color} />,
    'user-check': <IconUserCheck size={size} color={color} />,
    hash: <IconHash size={size} color={color} />,
    download: <IconDownload size={size} color={color} />,
    'adjustments-alt': <IconAdjustmentsAlt size={size} color={color} />,
    menu: <IconMenu2 size={size} color={color} />,
    search: <IconSearch size={size} color={color} />,
    'user-plus': <IconUserPlus size={size} color={color} />,
    'user-circle': <IconUserCircle size={size} color={color} />,
    replace: <IconReplace size={size} color={color} />,
    'circle-minus': <IconCircleMinus size={size} color={color} />,
    filter: getSvg('M1.5 4.5H15.5M4 8H13M7 11.5H10', {
      fill: color,
      stroke: color,
      strokeWidth: '1.33333',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }),
    heart: <IconHeart size={size} color={color} />,
    heartbeat: <IconHeartbeat size={size} color={color} />,
    'heart-handshake': <IconHeartHandshake size={size} color={color} />,
    'heart-filled': <IconHeartFilled size={size} color={color} />,
    uniform: <IconShirt size={size} color={color} />,
    parking: <IconCar size={size} color={color} />,
    'patient-in-bed': <IconPatientInBed size={size} color={color} />,
    meal: <IconToolsKitchen2 size={size} color={color} />,
    locker: (
      <IconServer
        size={size}
        color={color}
        style={{ transform: 'rotate(90deg)' }}
      />
    ),
    rocket: <IconRocket size={size} color={color} />,
    books: <IconBooks size={size} color={color} />,
    'baby-carriage': <IconBabyCarriage size={size} color={color} />,
    percentage: <IconPercentage size={size} color={color} />,
    'graduation-hat': <IconSchool size={size} color={color} />,
    'portal-tabs': <IconPortalTabs size={size} color={color} />,
    sparkles: <IconSparkles size={size} color={color} />,
    error: <IconAlertSquare size={size} color={color} />,
    warning: <IconAlertTriangle size={size} color={color} />,
    info: <IconAlertCircle size={size} color={color} />,
    'alert-triangle': <IconAlertTriangle size={size} color={color} />,
    description: <IconBlockquote size={size} color={color} />,
    'calendar-event': <IconCalendarEvent size={size} color={color} />,
    lang: <IconLanguage size={size} color={color} />,
    vaccine: <IconVaccine size={size} color={color} />,
    world: <IconWorld size={size} color={color} />,
  };

  return name in LIVO_ICONS
    ? LIVO_ICONS[name as keyof typeof LIVO_ICONS]
    : null;
};

export default LivoIcon;

export const DisclaimerIconMap = {
  [DisclaimerTypeEnum.ERROR]: {
    name: 'error',
    color: colors['Warning-500'],
  },
  [DisclaimerTypeEnum.WARNING]: {
    name: 'warning',
    color: colors['Warning-500'],
  },
  [DisclaimerTypeEnum.INFO]: {
    name: 'info',
    color: colors['Warning-500'],
  },
};
