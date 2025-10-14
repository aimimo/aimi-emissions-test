import type {GenerationType} from '../api/emissions';

/**
 * Sums MWh for each fuel type in the generation_type array
 */
export const parseGenerationMix = (
    generationData: GenerationType[],
    fuelKeyMap: Record<string, keyof GenerationType>
): Record<string, number> => {
    const generation: Record<string, number> = {};

    for (const [friendlyName, apiKey] of Object.entries(fuelKeyMap)) {
        generation[friendlyName] = generationData.reduce(
            (sum, g) => sum + (g[apiKey] ?? 0),
            0
        );
    }

    return generation;
};

/**
 * Convert MWh totals to percentages
 */
export const normalizeGenerationMix = (generation: Record<string, number>): Record<string, number> => {
    const totalGeneration = getTotalGeneration(generation);
    if (totalGeneration === 0) return Object.fromEntries(Object.keys(generation).map(k => [k, 0]));

    return Object.fromEntries(
        Object.entries(generation).map(([key, val]) => [key, Math.round((val / totalGeneration) * 100)])
    );
};

export const getTotalGeneration = (generation: Record<string, number>) : number => {
    return Object.values(generation).reduce((sum, val) => sum + val, 0);
}