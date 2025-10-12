import {
    Card,
    CardContent,
    Typography,
    Box
} from '@mui/material';
import type {CountryEmissions} from "../api/emissions.ts";
import FuelBreakdownList from "./FuelBreakdownList.tsx";
import { FUEL_COLORS } from "../utils/constants.ts";
import { formatGenerationMix, attachMWValues } from "../utils/chartUtils.ts";

interface CountryProps extends CountryEmissions {
    chartType?: "pie" | "bar" | undefined;
    generationMWh?: Record<string, number>
}

const CountryCard = (props: CountryProps) => {
    const chartData = formatGenerationMix(props.generationMix || {});
    const chartDataWithMW = attachMWValues(chartData, props.totalDemandMW);

    return (
        <Card sx={{height: '100%'}}>
            <CardContent>
                {/* Header with country name */}
                <Typography variant="h5" gutterBottom>
                    {props.country}
                </Typography>

                {/* Carbon intensity */}
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

                {/* Total Demand */}
                {props.totalDemandMW && (
                    <Box sx={{marginTop: 2}}>
                        <Typography variant="body2">
                            Total Demand: <strong>{props.totalDemandMW.toFixed(2)} MW</strong>
                        </Typography>
                    </Box>
                )}

                {/* Last Updated */}
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

                <Box sx={{marginTop: 3}}>
                    <FuelBreakdownList items={chartDataWithMW} colors={FUEL_COLORS} />
                </Box>
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