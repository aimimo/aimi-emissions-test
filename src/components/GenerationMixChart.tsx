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
import {Box, Card, Typography} from '@mui/material';
import {type CountryEmissions} from '../api/emissions';
import {FUEL_COLORS, renewableFuels} from "../utils/constants.ts";

interface GenerationMixChartProps {
    data: CountryEmissions;
    chartType?: 'pie' | 'bar';
}

const GenerationMixChart = ({data}: GenerationMixChartProps) => {
    const generationMix = data.generationMix || {};
    const chartType = data.chartType;
    const chartData = formatGenerationMix(generationMix);
    const {renewablePercentage, nonRenewablePercentage} =
        calculateRenewablePercentages(chartData, renewableFuels);
    const chartDataWithMW = attachMWValues(chartData, data.totalDemandMW);

    return (
        <Card sx={{p: 3, mt: 2}}>
            <Typography variant="h6" gutterBottom>
                Generation Mix - {data.country}
            </Typography>

            {/* Chart */}
            <Box sx={{width: '100%', height: 300, mb: 3}}>
                <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'pie' ? (
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
                            >
                                {chartDataWithMW.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={FUEL_COLORS[entry.fuel as keyof typeof FUEL_COLORS] || '#9E9E9E'}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number, name: string) => {
                                    if (name === 'value') return [`${value}%`, 'Percentage'];
                                    if (name === 'mw') return [`${value} MW`, 'Power'];
                                    return [value, name];
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
                            <Bar yAxisId="left" dataKey="value" fill="#1976d2" name="Percentage (%)"/>
                            <Bar yAxisId="right" dataKey="mw" fill="#FF9800" name="Power (MW)"/>
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