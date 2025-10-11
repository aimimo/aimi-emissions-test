import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
} from '@mui/material';

interface CountryEmissions {
    country: "NZ" | "AU";
    timestamp: string;
    totalDemandMW: number;
    carbonIntensity_gCO2kWh: number;
    generationMix: {
        hydro?: number;
        wind?: number;
        solar?: number;
        gas?: number;
        coal?: number;
        geothermal?: number;
        other?: number;
    };
}

const CountryCard = (props: CountryEmissions) => {
    return (
        <Card sx={{height: '100%'}}>
            <CardContent>
                {/* Header with country name */}
                <Typography variant="h5" gutterBottom>
                    {props.country}
                </Typography>

                {/* Carbon intensity card */}
                <Box
                    sx={{
                        backgroundColor: getIntensityColor(props.carbonIntensity_gCO2kWh),
                        padding: 2,
                        borderRadius: 1,
                        color: 'white',
                        marginY: 2,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h3" sx={{fontWeight: 'bold'}}>
                        {props.carbonIntensity_gCO2kWh}
                    </Typography>
                    <Typography variant="body2">
                        gCO₂/kWh
                    </Typography>
                </Box>

                {/* Timestamp */}
                <Typography variant="caption" color="textSecondary">
                    Updated: {new Date(props.timestamp).toLocaleTimeString()}
                </Typography>

                {/* Generation mix */}
                <Box sx={{marginTop: 2}}>
                    <Typography variant="subtitle2" gutterBottom>
                        Generation Mix:
                    </Typography>
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                        {props.generationMix.hydro && (
                            <Chip
                                label={`Hydro: ${props.generationMix.hydro}%`}
                                color="primary"
                                variant="outlined"
                            />
                        )}
                        {props.generationMix.wind && (
                            <Chip
                                label={`Wind: ${props.generationMix.wind}%`}
                                color="info"
                                variant="outlined"
                            />
                        )}
                        {props.generationMix.solar && (
                            <Chip
                                label={`Solar: ${props.generationMix.solar}%`}
                                variant="outlined"
                            />
                        )}
                        {props.generationMix.gas && (
                            <Chip
                                label={`Gas: ${props.generationMix.gas}%`}
                                color="warning"
                                variant="outlined"
                            />
                        )}
                        {props.generationMix.coal && (
                            <Chip
                                label={`Coal: ${props.generationMix.coal}%`}
                                variant="outlined"
                            />
                        )}
                        {props.generationMix.geothermal && (
                            <Chip
                                label={`Geothermal: ${props.generationMix.geothermal}%`}
                                variant="outlined"
                            />
                        )}
                    </Box>
                </Box>

                {/* Total demand */}
                {props.totalDemandMW && (
                    <Box sx={{marginTop: 2}}>
                        <Typography variant="body2">
                            Total Demand: <strong>{props.totalDemandMW} MW</strong>
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}

const getIntensityColor = (intensity: number): string => {
    if (intensity < 100) return '#729c37';
    if (intensity < 500) return '#f4d436';
    return '#e33131'
}

export default CountryCard;