import {Box, Typography} from '@mui/material';

interface FuelBreakdownItemProps {
    name: string;
    value: number;
    mw?: number;
    color: string;
    showPercentage?: boolean;
}

const FuelBreakdownItem = ({name, value, mw, color, showPercentage = false}: FuelBreakdownItemProps) => {
    return (
        <Box
            sx={{
                p: 0.8,
                backgroundColor: '#f5f5f5',
                borderRadius: 2,
                borderLeft: `8px solid ${color}`,
            }}
        >
            <Typography variant="caption" display="block" color="textSecondary">
                {name}
            </Typography>
            {showPercentage && <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                {value}%
            </Typography>}
            {mw !== undefined && (
                <Typography variant="caption" color="textSecondary">
                    {mw} MW
                </Typography>
            )}
        </Box>
    );
};

export default FuelBreakdownItem;