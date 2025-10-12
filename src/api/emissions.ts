export interface CountryEmissions {
    chartType?: 'pie' | 'bar';
    country: 'NZ' | 'AU';
    timestamp: string;
    totalDemandMW: number;
    carbonIntensity_gCO2kWh: number;
    generationMix: {
        hydro?: number;
        wind?: number;
        solar?: number;
        gas?: number;
        coal?: number;
        geothermal?: number;
        other?: number;
        battery?: number;
        coGen?: number;
        dieselOil?: number;
    };
}

const generateMockAUData = (): CountryEmissions => {
    return {
        country: 'AU',
        timestamp: new Date().toISOString(),
        totalDemandMW: Math.floor(Math.random() * 10000) + 15000,
        carbonIntensity_gCO2kWh: Math.floor(Math.random() * 200) + 250,
        generationMix: {
            coal: Math.floor(Math.random() * 30) + 30,
            wind: Math.floor(Math.random() * 20) + 15,
            solar: Math.floor(Math.random() * 20) + 10,
            gas: Math.floor(Math.random() * 15) + 5,
            other: Math.floor(Math.random() * 10) + 5,
        },
    };
};

const generateMockNZData = (): CountryEmissions => {
    return {
        country: 'NZ',
        timestamp: new Date().toISOString(),
        totalDemandMW: Math.floor(Math.random() * 1000) + 4000,
        carbonIntensity_gCO2kWh: Math.floor(Math.random() * 50) + 50,
        generationMix: {
            hydro: Math.floor(Math.random() * 20) + 50,
            wind: Math.floor(Math.random() * 20) + 15,
            geothermal: Math.floor(Math.random() * 10) + 5,
            gas: Math.floor(Math.random() * 10) + 5,
            other: Math.floor(Math.random() * 5),
        },
    };
};

interface GenerationType {
    hyd_mwh?: number;
    win_mwh?: number;
    sol_mwh?: number;
    gas_mwh?: number;
    geo_mwh?: number;
    cg_mwh?: number;
    cog_mwh?: number;
    liq_mwh?: number;
    bat_mwh?: number;
}

interface NZPriceItem {
    trading_date: string;
    generation_type: GenerationType[];
}

interface NZPriceResponse {
    items: NZPriceItem[];
}

export const fetchNZEmissions = async (): Promise<CountryEmissions | null> => {
    try {
        const response = await fetch(
            'https://api.em6.co.nz/ords/em6/data_api/free/price'
        );

        if (!response.ok) {
            console.error('NZ API error:', response.status);
            console.log('Falling back to mock NZ data');
            return generateMockNZData();
        }

        const data = (await response.json()) as NZPriceResponse;

        // grab latest date
        const latestItem = data.items?.[data.items.length - 1];
        if (!latestItem || !latestItem.generation_type) {
            console.log('No generation data available, falling back to mock');
            return generateMockNZData();
        }

        console.log(latestItem.trading_date);

        // Parse generation mix from the generation_type array
        const generation = {
            battery: latestItem.generation_type.reduce((sum, g) => sum + (g.bat_mwh ?? 0), 0),
            hydro: latestItem.generation_type.reduce((sum, g) => sum + (g.hyd_mwh ?? 0), 0),
            wind: latestItem.generation_type.reduce((sum, g) => sum + (g.win_mwh ?? 0), 0),
            solar: latestItem.generation_type.reduce((sum, g) => sum + (g.sol_mwh ?? 0), 0),
            gas: latestItem.generation_type.reduce((sum, g) => sum + (g.gas_mwh ?? 0), 0),
            geothermal: latestItem.generation_type.reduce((sum, g) => sum + (g.geo_mwh ?? 0), 0),
            coal: latestItem.generation_type.reduce((sum, g) => sum + (g.cg_mwh ?? 0), 0),
            coGen: latestItem.generation_type.reduce((sum, g) => sum + (g.cog_mwh ?? 0), 0),
            dieselOil: latestItem.generation_type.reduce((sum, g) => sum + (g.liq_mwh ?? 0), 0),
        };

        const totalGeneration = Object.values(generation).reduce((sum: number, val: number) => sum + val, 0);

        // Normalize to percentages
        const generationMix = {
            battery: totalGeneration > 0 ? Math.round((generation.battery / totalGeneration) * 100) : 0,
            hydro: totalGeneration > 0 ? Math.round((generation.hydro / totalGeneration) * 100) : 0,
            wind: totalGeneration > 0 ? Math.round((generation.wind / totalGeneration) * 100) : 0,
            solar: totalGeneration > 0 ? Math.round((generation.solar / totalGeneration) * 100) : 0,
            gas: totalGeneration > 0 ? Math.round((generation.gas / totalGeneration) * 100) : 0,
            coal: totalGeneration > 0 ? Math.round((generation.coal / totalGeneration) * 100) : 0,
            coGen: totalGeneration > 0 ? Math.round((generation.coGen / totalGeneration) * 100) : 0,
            geothermal: totalGeneration > 0 ? Math.round((generation.geothermal / totalGeneration) * 100) : 0,
            dieselOil: totalGeneration > 0 ? Math.round((generation.dieselOil / totalGeneration) * 100) : 0,
        };
        console.log('Generation Mix:', generationMix);
        console.log('Sum of percentages:', Object.values(generationMix).reduce((a, b) => a + b, 0));

        // Estimate carbon intensity based on fuel mix
        const estimateCarbonIntensity = (mix: typeof generationMix): number => {
            // Rough emission factors (gCO2/MWh)
            const factors = {
                hydro: 0,
                wind: 0,
                solar: 0,
                geothermal: 5,
                gas: 500,
                coal: 800,
                coGen: 600,
                dieselOil: 700,
                battery: 0,
            };

            const totalEmissions = Object.entries(mix).reduce((sum, [fuel, percentage]) => {
                return sum + (factors[fuel as keyof typeof factors] || 0) * (percentage / 100);
            }, 0);

            return Math.round(totalEmissions);
        };

        const emissions: CountryEmissions = {
            country: 'NZ',
            timestamp: latestItem.trading_date || new Date().toISOString(),
            totalDemandMW: totalGeneration,
            carbonIntensity_gCO2kWh: estimateCarbonIntensity(generationMix),
            generationMix,
        };

        console.log('NZ data fetched successfully:', emissions);
        return emissions;
    } catch (error) {
        console.error('Error fetching NZ emissions:', error);
        console.log('Falling back to mock NZ data');
        return generateMockNZData();
    }
};

interface AURegionData {
    totalDemandMW: number;
    carbonIntensity_gCO2kWh: number;
    generationMix?: {
        hydro?: number;
        wind?: number;
        solar?: number;
        gas?: number;
        coal?: number;
        geothermal?: number;
        other?: number;
        battery?: number;
        coGen?: number;
        dieselOil?: number;
    };
}

type AUApiResponse = Record<string, AURegionData>;

export const fetchAUEmissions = async (): Promise<CountryEmissions | null> => {
    try {
        const response = await fetch(
            'http://localhost:3001/api/emissions/australia'
        );

        if (!response.ok) {
            console.error('AU API error:', response.status);
            console.log('Falling back to mock AU data');
            return generateMockAUData();
        } else {
            console.log('AU API response:', response);
        }

        const data = (await response.json()) as AUApiResponse;

        const totalDemand =
            Object.values(data).reduce((sum, region) => {
                return sum + (region.totalDemandMW || 0);
            }, 0) || 0;

        const aggregatedMix: Record<string, number> = {};
        Object.values(data).forEach(region => {
            Object.entries(region.generationMix || {}).forEach(([fuel, percent]) => {
                aggregatedMix[fuel] = (aggregatedMix[fuel] || 0) + percent;
            });
        });

        const avgCarbon =
            Object.values(data).reduce((sum, region) => {
                return sum + (region.carbonIntensity_gCO2kWh || 0);
            }, 0) / Object.keys(data).length || 0;

        const totalPercent = Object.values(aggregatedMix).reduce((a, b) => a + b, 0);

        const normalizedMix = Object.fromEntries(
            Object.entries(aggregatedMix).map(([fuel, val]) => [fuel, Math.round((val / totalPercent) * 100)])
        );

        const emissions: CountryEmissions = {
            country: 'AU',
            timestamp: new Date().toISOString(),
            totalDemandMW: totalDemand,
            carbonIntensity_gCO2kWh: Math.round(avgCarbon),
            generationMix: normalizedMix
        };

        return emissions;
    } catch (error) {
        console.error('Error fetching AU emissions:', error);
        console.log('Falling back to mock AU data');
        return generateMockAUData();
    }
};

export const fetchAllEmissions = async (): Promise<{
    nz: CountryEmissions | null;
    au: CountryEmissions | null;
}> => {
    const [nz, au] = await Promise.all([
        fetchNZEmissions(),
        fetchAUEmissions(),
    ]);

    return {nz, au};
};