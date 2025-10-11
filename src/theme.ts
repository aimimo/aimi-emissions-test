import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light', // or 'dark'
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        }
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h3: {
            fontWeight: 600,
            fontSize: '2rem',
        },
        h5: {
            fontWeight: 500,
            fontSize: '1.5rem',
        },
        body1: {
            fontSize: '1rem',
        },
    },
    components: {
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
