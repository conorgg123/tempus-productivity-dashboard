import { createTheme } from '@mui/material/styles';

/**
 * Creates and returns a Material UI theme based on dark mode preference
 * @param {boolean} darkMode - Whether to use dark mode
 * @returns {Object} Material UI theme object
 */
const createAppTheme = (darkMode) => {
  return createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#5068F2', // Blue/purple tone similar to screenshot
        light: '#8a6fff',
        dark: '#3f4dc2',
      },
      secondary: {
        main: '#E74C3C', // Red color similar to "Breaks" category
        light: '#ff6b6b',
        dark: '#c1392b',
      },
      success: {
        main: '#2ECC71', // Green for positive metrics
      },
      warning: {
        main: '#F39C12', // Orange for warnings
      },
      error: {
        main: '#E74C3C', // Red for errors/negative stats
      },
      background: {
        default: darkMode ? '#121212' : '#F5F7FA', // Dark gray in dark mode, light gray in light mode
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#e0e0e0' : '#303030',
        secondary: darkMode ? '#a0a0a0' : '#707070',
      },
      divider: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      subtitle1: {
        fontWeight: 500,
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiAppBar: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
            color: darkMode ? '#e0e0e0' : '#303030',
          }
        }
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
          containedPrimary: {
            '&:hover': {
              backgroundColor: darkMode ? '#3a50c9' : '#6075ff',
            },
          },
        },
      },
      MuiCard: {
        defaultProps: {
          elevation: darkMode ? 1 : 2,
        },
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
            backgroundImage: 'none',
          }
        }
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            color: darkMode ? '#8a6fff' : '#5068F2',
          },
          track: {
            backgroundColor: darkMode ? '#333333' : '#e0e0e0',
          },
          checked: {
            color: darkMode ? '#8a6fff' : '#5068F2',
          }
        }
      },
      MuiLinearProgress: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: darkMode ? '#333333' : '#e0e0e0',
          },
          barColorPrimary: {
            backgroundColor: darkMode ? '#8a6fff' : '#5068F2',
          }
        }
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: darkMode ? '#6b6b6b #2b2b2b' : '#bbb #f5f5f5',
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              backgroundColor: darkMode ? '#2b2b2b' : '#f5f5f5',
              width: '0.4em',
              height: '0.4em',
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: 8,
              backgroundColor: darkMode ? '#6b6b6b' : '#bbb',
              minHeight: 24,
            },
            '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
              backgroundColor: darkMode ? '#959595' : '#999',
            },
            '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
              backgroundColor: darkMode ? '#959595' : '#999',
            },
            '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
              backgroundColor: darkMode ? '#959595' : '#999',
            },
          }
        }
      }
    },
  });
};

export default createAppTheme; 