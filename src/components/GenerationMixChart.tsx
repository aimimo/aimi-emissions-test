import {
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from 'recharts';
import {
    formatGenerationMix,
    calculateRenewablePercentages,
    attachMWValues,
} from '../utils/chartUtils.ts';
import {Box, Card, ToggleButton, ToggleButtonGroup, Typography} from '@mui/material';
import {type CountryEmissions} from '../api/emissions';
import {FUEL_COLORS, renewableFuels} from "../utils/constants.ts";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import {useState} from "react";
import { useTheme } from '@mui/material/styles';

interface GenerationMixChartProps {
    data: CountryEmissions;
    chartType?: 'pie' | 'bar';
}

const GenerationMixChart = ({data, chartType}: GenerationMixChartProps) => {
    const generationMix = data.generationMix || {};
    const chartData = formatGenerationMix(generationMix);
    const {renewablePercentage, nonRenewablePercentage} =
        calculateRenewablePercentages(chartData, renewableFuels);
    const chartDataWithMW = attachMWValues(chartData, data.totalDemandMW);
    const [newChartType, setChartType] = useState<'bar' | 'pie'>(chartType ?? 'bar')
    const theme = useTheme();
    return (
        <Card sx={{p: 3, mt: 2}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2, mb:3}}>
                <Typography variant="h6" gutterBottom>
                    Generation Mix: {data.country}
                </Typography>
                <ToggleButtonGroup
                    onChange={(_, value) => {
                        if (value) {
                            setChartType(value);
                        }
                    }}
                >
                    <ToggleButton value="bar">
                        <BarChartIcon></BarChartIcon>
                    </ToggleButton>
                    <ToggleButton value="pie">
                        <PieChartIcon></PieChartIcon>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Chart */}
            <Box sx={{width: '100%', height: 300, mb: 3}}>
                <ResponsiveContainer width="100%" height="100%">
                    {newChartType == 'pie' ? (
                        <PieChart>
                            <Pie
                                data={chartDataWithMW}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({name, value}) => `${name}: ${value}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                            >
                                {chartDataWithMW.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={FUEL_COLORS[entry.fuel as keyof typeof FUEL_COLORS] || '#9E9E9E'}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number, name: string, props) => {
                                    const mw = props.payload.mw;
                                    return [`${value}% (${mw} MW)`, name];
                                }}
                            />
                            <Legend/>
                        </PieChart>
                    ) : (
                        <BarChart data={chartDataWithMW}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name"/>
                            <YAxis yAxisId="left"
                                   label={{value: 'Percentage (%)', angle: -90, position: 'insideLeft'}}/>
                            <YAxis yAxisId="right" orientation="right"
                                   label={{value: 'Power (MW)', angle: 90, position: 'insideRight'}}/>
                            <Tooltip
                                formatter={(value: number, name: string) => {
                                    if (name === 'value') return [`${value}%`, 'Percentage'];
                                    if (name === 'mw') return [`${value} MW`, 'Power'];
                                    return [value, name];
                                }}
                            />
                            <Legend/>
                            <Bar yAxisId="left" dataKey="value" fill={theme.palette.primary.light} name="Percentage (%)"/>
                            <Bar yAxisId="right" dataKey="mw" fill={theme.palette.secondary.light} name="Power (MW)"/>
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </Box>

            {/* Renewable vs Non-Renewable Breakdown */}
            <Box sx={{display: 'flex', gap: 2, mt: 3}}>
                <Box
                    sx={{
                        flex: 1,
                        p: 2,
                        backgroundColor: '#E8F5E9',
                        borderRadius: 1,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="subtitle2" color="textSecondary">
                        Renewable Energy
                    </Typography>
                    <Typography variant="h5" sx={{color: '#4CAF50', fontWeight: 'bold'}}>
                        {renewablePercentage}%
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        Hydro, Wind, Solar, Geothermal
                    </Typography>
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        p: 2,
                        backgroundColor: '#FFF3E0',
                        borderRadius: 1,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="subtitle2" color="textSecondary">
                        Non-Renewable Energy
                    </Typography>
                    <Typography variant="h5" sx={{color: '#FF9800', fontWeight: 'bold'}}>
                        {nonRenewablePercentage}%
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        Coal, Gas, Oil, Other
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
};

export default GenerationMixChart;