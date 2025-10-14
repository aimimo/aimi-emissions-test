import {
    Card,
    CardContent,
    Typography,
    Box
} from '@mui/material';
import type {CountryEmissions} from "../api/emissions.ts";
import FuelBreakdownList from "./FuelBreakdownList.tsx";
import {FUEL_COLORS} from "../utils/constants.ts";
import {formatGenerationMix, attachMWValues} from "../utils/chartUtils.ts";

interface CountryProps extends CountryEmissions {
    chartType?: "pie" | "bar" | undefined;
    generationMWh?: Record<string, number>
}

const CountryCard = (props: CountryProps) => {
    const chartData = formatGenerationMix(props.generationMix || {});
    const chartDataWithMW = attachMWValues(chartData, props.totalDemandMW);

    return (
        <Card sx={{
            transition: 'all 0.6s ease',
            '&:hover': {
                transform: 'scale(1.03)',
            }
        }}>
            <CardContent>
                {/* Carbon intensity */}
                <Typography variant="h6" marginBottom={"10px"}>Carbon Intensity</Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 2,
                        p: 2,
                        borderRadius: 1,
                        backgroundColor: getIntensityColor(props.carbonIntensity_gCO2kWh),
                        color: getIntensityTextColor(props.carbonIntensity_gCO2kWh),
                    }}
                >
                    <Typography variant="h4" sx={{fontWeight: 'bold'}}>
                        {props.carbonIntensity_gCO2kWh} gCO₂/kWh
                    </Typography>
                </Box>

                {/* Total Demand */}
                {props.totalDemandMW && (
                    <Box sx={{marginTop: 2}}>
                        <Typography variant="body2">
                            Total Demand: <strong>{props.totalDemandMW.toLocaleString()} MW</strong>
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
                    <FuelBreakdownList items={chartDataWithMW} colors={FUEL_COLORS}/>
                </Box>
            </CardContent>
        </Card>
    );
}

const getIntensityColor = (intensity: number): string => {
    if (intensity < 100) return '#729c37';
    if (intensity < 500) return '#ffe246';
    return '#e33131'
}

const getIntensityTextColor = (intensity: number): string => {
    if (intensity < 100 || intensity > 500) return 'white';
    return '#736002'
}

export default CountryCard;