import { Box, Typography } from '@mui/material';

interface FuelBreakdownItemProps {
    name: string;
    value: number;
    mw?: number;
    color: string;
}

const FuelBreakdownItem = ({ name, value, mw, color }: FuelBreakdownItemProps) => {
    return (
        <Box
            sx={{
                p: 1.5,
                backgroundColor: '#f5f5f5',
                borderRadius: 1,
                borderLeft: `4px solid ${color}`,
            }}
        >
            <Typography variant="caption" display="block" color="textSecondary">
                {name}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {value}%
            </Typography>
            {mw !== undefined && (
                <Typography variant="caption" color="textSecondary">
                    {mw} MW
                </Typography>
            )}
        </Box>
    );
};

export default FuelBreakdownItem;