import * as React from 'react';

import Switch, { SwitchProps } from '@mui/material/Switch';
import { styled } from '@mui/material/styles';

const WIDTH = 42;
const HEIGHT = 24;
const MARGIN = 2;
const DOT_SIZE = HEIGHT - MARGIN * 2;
const TRANSITION = WIDTH - DOT_SIZE - MARGIN * 2;
const COLOR_BG = '#3ab0f9';
const COLOR_2 = '#149ef2';
const COLOR_3 = '#0277c8';

const AnimatedSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: WIDTH,
  height: HEIGHT,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: MARGIN,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: `translateX(${TRANSITION}px)`,
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: COLOR_BG,
        opacity: 1,
        border: 0,
        ...theme.applyStyles('dark', {
          backgroundColor: COLOR_2,
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: COLOR_3,
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[600],
      }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.3,
      }),
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: DOT_SIZE,
    height: DOT_SIZE,
  },
  '& .MuiSwitch-track': {
    borderRadius: HEIGHT / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: '#39393D',
    }),
  },
}));

export default AnimatedSwitch;
