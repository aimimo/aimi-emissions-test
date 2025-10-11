// import './App.css'
import {ThemeProvider} from '@mui/material/styles';
import {Box, Container, CssBaseline, Grid, Typography} from "@mui/material";
import CountryCard from './components/CountryCard';
import {theme} from './theme'

function App() {
    const mockNZData = {
        country: 'NZ' as const,
        carbonIntensity_gCO2kWh: 85,
        timestamp: new Date().toISOString(),
        generationMix: {
            hydro: 60,
            wind: 25,
            geothermal: 10,
            gas: 5,
        },
        totalDemandMW: 4500,
    }

    const mockAUData = {
        country: 'AU' as const,
        carbonIntensity_gCO2kWh: 320,
        timestamp: new Date().toISOString(),
        generationMix: {
            coal: 40,
            wind: 30,
            solar: 20,
            gas: 10,
        },
        totalDemandMW: 18000,
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Container>
                <Box sx={{py: 4}}>
                    <Typography variant="h3" gutterBottom>
                        Live Emissions Dashboard
                    </Typography>

                    <Grid container spacing={3} sx={{mt: 1}}>
                        <Grid size={{xs: 12, md: 4}}>
                            <CountryCard {...mockNZData} />
                        </Grid>
                        <Grid size={{xs: 12, md: 4}}>
                            <CountryCard {...mockAUData} />
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default App
