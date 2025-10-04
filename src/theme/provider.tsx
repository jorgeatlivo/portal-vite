import { Box } from '@mui/material'; // Import Box
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';
import { IconSquare, IconSquareCheckFilled } from '@tabler/icons-react';

import colors from '@/config/color-palette';

const theme = createTheme({
  palette: {
    background: {
      paper: '#fff',
    },
    text: {
      primary: colors['Text-Default'],
    },
    action: {
      active: colors['Secondary-900'],
    },
    primary: {
      main: colors['Secondary-600'],
      dark: colors['Secondary-900'],
    },
    secondary: {
      main: colors['Secondary-200'],
      light: colors['Secondary-050'],
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          legend: {
            transition: 'padding-right 0.2s ease', // Hiệu ứng mượt hơn khi thay đổi
          },
        },
        root: {
          '& fieldset': {
            borderColor: colors['Divider-Default'],
          },
          '&:hover:not(:has(.Mui-disabled)) .MuiOutlinedInput-notchedOutline': {
            borderColor: colors['Action-Secondary'],
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors['Action-Secondary'],
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.MuiInputLabel-shrink:has(.MuiFormLabel-asterisk) + .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline legend':
            {
              paddingRight: 'min(calc(2px + 0.3ch), 4px)',
            },
          '&.MuiInputLabel-shrink:not(:has(.MuiFormLabel-asterisk)) + .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline legend':
            {
              paddingRight: '0px',
            },
          color: 'gray',
          '&.Mui-focused': {
            color: colors['Action-Secondary'],
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            backgroundColor: '#D3D3D3',
            color: '#A9A9A9',
            border: '2px solid #C8C8C8',
          },
          backgroundColor: colors['Action-Secondary'],
          minHeight: 48,
          color: colors['Neutral-000'],
          borderRadius: 50,
          padding: '12px 32px',
          fontWeight: 'bold',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: colors['Secondary-900'],
          },
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          '& .MuiStepIcon-root': {
            color: colors['Mint-100'],
            transition:
              'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
          },
          '& .MuiStepLabel-label': {
            display: 'none', // Hide step numbers
          },
          '& .Mui-active .MuiStepIcon-root': {
            color: colors['Action-Secondary'],
            transition:
              'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
          },
          '& .Mui-completed .MuiStepIcon-root': {
            color: colors['Action-Secondary'],
            transition:
              'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
          },
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          '&.Mui-active': {
            fill: colors['Action-Secondary'],
          },
          '&.Mui-completed': {
            fill: colors['Action-Secondary'],
          },
        },
      },
    },
    MuiCheckbox: {
      defaultProps: {
        icon: <IconSquare className="animate-zoomIn" />,
        checkedIcon: (
          <Box component="span" className="animate-zoomIn">
            <IconSquareCheckFilled />
          </Box>
        ),
      },
      styleOverrides: {
        root: {
          color: 'gray',
          transition: 'color 0.2s ease-in-out',
          '&.Mui-checked': {
            color: colors['Action-Primary'],
          },
        },
      },
    },
  },
});

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}
