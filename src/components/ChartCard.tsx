import GenerationMixChart, {type GenerationMixChartProps} from "./GenerationMixChart.tsx";
import {Card, CardContent} from "@mui/material";

const ChartCard = ({data, chartType}: GenerationMixChartProps) => {
    return (
        <Card sx={{
            mt: 3,
            transition: 'all 0.6s ease',
            '&:hover': {
                transform: 'scale(1.03)',
            }
        }}>
            <CardContent>
                <GenerationMixChart data={data} chartType={chartType} />
            </CardContent>
        </Card>
    )
}

export default ChartCard;