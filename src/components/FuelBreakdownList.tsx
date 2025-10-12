import { Box } from '@mui/material';
import FuelBreakdownItem from './FuelBreakdownItem';

interface FuelBreakdownListProps {
    items: {
        name: string;
        value: number;
        mw?: number;
        fuel: string;
    }[];
    colors: Record<string, string>;
    sx?: object;
}

const FuelBreakdownList = ({ items, colors, sx }: FuelBreakdownListProps) => {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: 1,
                ...sx,
            }}
        >
            {items.map((item) => (
                <FuelBreakdownItem
                    key={item.fuel}
                    name={item.name}
                    value={item.value}
                    mw={item.mw}
                    color={colors[item.fuel] || '#9E9E9E'}
                />
            ))}
        </Box>
    );
};

export default FuelBreakdownList;