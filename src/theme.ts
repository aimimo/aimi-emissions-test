import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light', // or 'dark'
        primary: {
            main: '#102517',
            light: '#4f7350',
        },
        secondary: {
            main: '#4f7350',
            light: '#d3ae62',
        },
        background: {
            default: '#e9f0dd',
        },
        text: {
            primary: '#102517',
            secondary: '#4f7350',
        }
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
        h2: {
            fontWeight: 600,
            fontSize: '3rem',
        },
        h3: {
            fontWeight: 700,
            fontSize: '2rem',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        body1: {
            fontSize: '1rem',
            fontWeight: 500,
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: 'linear-gradient(51deg, #add080, #f4d872)',
                    backgroundAttachment: 'fixed',
                    minHeight: '100vh',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    padding: '16px',
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                gutterBottom: {
                    marginBottom: '16px',
                },
            },
        },
    },
});

export { theme };
