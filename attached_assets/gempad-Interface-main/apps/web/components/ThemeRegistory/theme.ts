'use client';

import { createTheme, responsiveFontSizes, ThemeOptions } from '@mui/material/styles';
import { montserrat } from './font';
import { red } from '@mui/material/colors';
import { Gilroy } from '@/constants';

const primaryColor = '#22CDA6';
const secondaryColor = '#11B6DB';

// eslint-disable-next-line import/no-mutable-exports
export let theme = createTheme({
    palette: {
        mode: 'dark',
        common: {
            black: '#000',
            white: '#fff',
            zink: secondaryColor,
            blue: '#11B6DB',
        },
        primary: {
            main: primaryColor,
        },
        secondary: {
            main: '#252136',
        },

        error: {
            main: red.A400,
        },
        text: {
            primary: '#ffffff',
        },
    },

    typography: {
        fontFamily: montserrat.style.fontFamily,
        // fontFamily: Gilroy.style.fontFamily,
        h1: {
            fontSize: '64px',
            fontWeight: 700,
            color: '#ffffff',
        },
        h2: {
            fontSize: '48px',
            fontWeight: 700,
            color: '#ffffff',
        },
        h3: {
            fontSize: '32px',
            fontWeight: 700,
            color: '#ffffff',
        },
        h4: {
            fontSize: '28px',
            fontWeight: 600,
            color: '#ffffff',
        },
        h5: {
            fontSize: '16px',
            fontWeight: 500,
            color: '#ffffff',
        },
        subtitle1: {
            fontSize: '24px',
            fontWeight: 400,
            color: '#ffffff',
        },
        subtitle2: {
            fontSize: '20px',
            fontWeight: 400,
            color: '#ffffff',
        },
        body1: {
            fontSize: '16px',
            fontWeight: 400,
            color: '#ffffff',
        },
        body2: {
            fontSize: '13px',
            fontWeight: 500,
            color: '#FF0B22',
        },
    },
    components: {
        MuiIconButton: {
            styleOverrides: {
                sizeMedium: {
                    color: '#fff',
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: `
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active  {
          -webkit-transition-delay: 9999s;
          transition-delay: 9999s;
          
        }
      `,
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: '#0B0B0B',
                    borderRadius: '10px',
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': {
                        // borderColor: "#AFAFAF",
                    },
                    '& .MuiOutlinedInput-input': {
                        padding: '13px 10px',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '999px',
                    height: 'auto',
                    textTransform: 'capitalize',
                    paddingInline: '40px',
                    fontWeight: 500,
                    ':disabled': {
                        backgroundColor: '#797979',
                        color: '#ABABAB',
                    },
                },
                outlined: {
                    border: `2px solid ${primaryColor}`,
                    '&:hover': {
                        border: `2px solid ${primaryColor}`,
                    },
                },
                contained: {
                    fontWeight: 600,
                },
            },
        },

        // MuiFormHelperText: {
        //   styleOverrides: {
        //     root: {
        //       marginLeft: "6px",
        //     },
        //   },
        // },
        // MuiModal: {
        //   defaultProps: {
        //     slotProps: {
        //       backdrop: {
        //         style: {
        //           backgroundColor: `#${bodyColor}bd`,
        //         },
        //       },
        //     },
        //   },
        // },
    },

    overrides: {
        MuiOutlinedInput: {
            input: {
                '&:-webkit-autofill': {
                    '-webkit-box-shadow': '0 0 0 100px #000 inset',
                    '-webkit-text-fill-color': '#fff',
                },
                '&:-webkit-outer-spin-button': {
                    '-webkit-appearance': 'none',
                },
                '&:-webkit-inner-spin-button': {
                    '-webkit-appearance': 'none',
                },
            },
        },
    },
} as ThemeOptions);

theme = responsiveFontSizes(theme);
