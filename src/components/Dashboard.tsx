import {useState, useEffect} from 'react';
import {
    Container,
    Box,
    Grid,
    Typography,
    Button,
    CircularProgress,
    Alert
} from '@mui/material';
import {fetchAllEmissions, type CountryEmissions} from '../api/emissions';
import CountryCard from './CountryCard';
import GenerationMixChart from "./GenerationMixChart.tsx";

const Dashboard = () => {
    const [nzData, setNzData] = useState<CountryEmissions | null>(null);
    const [auData, setAuData] = useState<CountryEmissions | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadEmissions = async () => {
        try {
            setLoading(true);
            setError(null);

            const {nz, au} = await fetchAllEmissions();

            if (!nz || !au) {
                setError('Failed to load emissions data');
                return;
            }

            setNzData(nz);
            setAuData(au);
        } catch (err) {
            setError('Error fetching emissions data');
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEmissions();
    }, []);

    return (
        <Container>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
                <Typography variant="h3" gutterBottom>
                    Live Emissions Dashboard
                </Typography>
                <Button
                    color="primary"
                    onClick={loadEmissions}
                    disabled={loading}
                    sx={{borderRadius: '16px'}}
                >
                    {loading ? 'Refreshing...' : 'Refresh'}
                </Button>
            </Box>

            {/* Error Message */}
            {error && (
                <Alert severity="error" sx={{mb: 2}}>
                    {error}
                </Alert>
            )}

            {/* Loading Spinner */}
            {loading && !nzData && !auData && (
                <Box sx={{display: 'flex', justifyContent: 'center', py: 8}}>
                    <CircularProgress/>
                </Box>
            )}

            {/* Country Cards */}
            {nzData && auData && (
                <Grid container spacing={3} sx={{mt: 1}}>
                    <Grid size={{xs: 12, md: 6}}>
                        <Typography variant="h5" gutterBottom>
                            New Zealand (Aotearoa)
                        </Typography>
                        <CountryCard {...nzData} />
                        <GenerationMixChart data={nzData}/>
                    </Grid>
                    <Grid size={{xs: 12, md: 6}}>
                        <Typography variant="h5" gutterBottom>
                            Australia
                        </Typography>
                        <CountryCard {...auData} />
                        <GenerationMixChart data={auData}/>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
};

export default Dashboard;
