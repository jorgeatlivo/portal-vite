import colors from '@/config/color-palette';

export const TogglerOn = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="21"
      fill="none"
      viewBox="0 0 36 21"
    >
      <rect width="36" height="20" fill={colors['Primary-500']} rx="10"></rect>
      <g filter="url(#filter0_d_940_11538)">
        <rect width="16" height="16" x="18" y="2" fill="#fff" rx="8"></rect>
      </g>
      <defs>
        <filter
          id="filter0_d_940_11538"
          width="20"
          height="20"
          x="16"
          y="1"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          ></feColorMatrix>
          <feOffset dy="1"></feOffset>
          <feGaussianBlur stdDeviation="1"></feGaussianBlur>
          <feComposite in2="hardAlpha" operator="out"></feComposite>
          <feColorMatrix values="0 0 0 0 0.0627 0 0 0 0 0.0942333 0 0 0 0 0.1573 0 0 0 0.05 0"></feColorMatrix>
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_940_11538"
          ></feBlend>
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_940_11538"
            result="shape"
          ></feBlend>
        </filter>
      </defs>
    </svg>
  );
};
