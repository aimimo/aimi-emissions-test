export const formatGenerationMix = (generationMix: Record<string, number>) => {
    return Object.entries(generationMix)
        .filter(([, value]) => value && value > 0)
        .map(([fuel, percentage]) => ({
            name: fuel.charAt(0).toUpperCase() + fuel.slice(1),
            value: percentage,
            fuel,
        }));
};

export const calculateRenewablePercentages = (
    chartData: { fuel: string; value: number }[],
    renewableFuels: string[]
) => {
    const renewablePercentage = chartData
        .filter((item) => renewableFuels.includes(item.fuel))
        .reduce((sum, item) => sum + item.value, 0);

    const nonRenewablePercentage = 100 - renewablePercentage;

    return { renewablePercentage, nonRenewablePercentage };
};

export const attachMWValues = (
    chartData: { value: number; fuel: string; name: string }[],
    totalMW: number
) => {
    return chartData.map((item) => ({
        ...item,
        mw: Math.round((item.value / 100) * totalMW),
    }));
};
