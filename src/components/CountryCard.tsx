import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
} from '@mui/material';
import type {CountryEmissions} from "../api/emissions.ts";

const fuelColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
    hydro: 'primary',
    wind: 'info',
    solar: 'success',
    gas: 'warning',
    coal: 'default',
    geothermal: 'secondary',
    battery: 'default',
    coGen: 'default',
    dieselOil: 'default',
};

interface CountryProps extends CountryEmissions {
    generationMWh?: Record<string, number>
}

const CountryCard = (props: CountryProps) => {
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

                <Typography variant="caption" color="textSecondary">
                    Updated: {new Intl.DateTimeFormat('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: 'Pacific/Auckland',
                    timeZoneName: 'shortGeneric'
                }).format(new Date(props.timestamp))}

                </Typography>

                {/* Generation mix */}
                <Box sx={{marginTop: 2}}>
                    <Typography variant="subtitle2" gutterBottom>
                        Generation Mix:
                    </Typography>
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                        {Object.entries(props.generationMix).map(([fuel, percent]) => (
                            <Chip
                                key={fuel}
                                label={`${fuel.charAt(0).toUpperCase() + fuel.slice(1)}: ${percent}%`}
                                color={fuelColors[fuel]}
                                variant="outlined"
                            />
                        ))}
                    </Box>
                </Box>

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