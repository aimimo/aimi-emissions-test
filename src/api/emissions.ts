export interface CountryEmissions {
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
    generation_type: GenerationType[];
}

interface NZPriceResponse {
    items: NZPriceItem[];
}

interface NZCarbonIntensityResponse {
    items: NZCarbonIntensityItem[]
}

interface NZCarbonIntensityItem {
    timestamp: string;
    nz_carbon_gkwh: number;
}

export const fetchNZEmissions = async (): Promise<CountryEmissions | null> => {
    try {
        const priceResponse = await fetch(
            'https://api.em6.co.nz/ords/em6/data_api/free/price'
        );
        if (!priceResponse.ok) {
            console.error('NZ API error:', priceResponse.status);
            console.log('Falling back to mock NZ data');
            return generateMockNZData();
        }

        const priceData = (await priceResponse.json()) as NZPriceResponse;
        const latestPrice = priceData.items?.[priceData.items.length - 1];
        if (!latestPrice || !latestPrice.generation_type) {
            console.log('No generation data available, falling back to mock NZ data');
            return generateMockNZData();
        }

        // Parse generation mix
        const generation = {
            battery: latestPrice.generation_type.reduce((sum, g) => sum + (g.bat_mwh ?? 0), 0),
            hydro: latestPrice.generation_type.reduce((sum, g) => sum + (g.hyd_mwh ?? 0), 0),
            wind: latestPrice.generation_type.reduce((sum, g) => sum + (g.win_mwh ?? 0), 0),
            solar: latestPrice.generation_type.reduce((sum, g) => sum + (g.sol_mwh ?? 0), 0),
            gas: latestPrice.generation_type.reduce((sum, g) => sum + (g.gas_mwh ?? 0), 0),
            geothermal: latestPrice.generation_type.reduce((sum, g) => sum + (g.geo_mwh ?? 0), 0),
            coal: latestPrice.generation_type.reduce((sum, g) => sum + (g.cg_mwh ?? 0), 0),
            coGen: latestPrice.generation_type.reduce((sum, g) => sum + (g.cog_mwh ?? 0), 0),
            dieselOil: latestPrice.generation_type.reduce((sum, g) => sum + (g.liq_mwh ?? 0), 0),
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

        const carbonIntensityResponse = await fetch(
            'https://api.em6.co.nz/ords/em6/data_api/current_carbon_intensity'
        );
        if (!carbonIntensityResponse.ok) {
            console.error('NZ Carbon Intensity API error:', carbonIntensityResponse.status);
            console.warn('Falling back to mock NZ data');
            return generateMockNZData();
        }

        const carbonIntensityData = (await carbonIntensityResponse.json() as NZCarbonIntensityResponse);
        const latestCarbonIntensityData = carbonIntensityData.items[0]

        const emissions: CountryEmissions = {
            country: 'NZ',
            timestamp: latestCarbonIntensityData.timestamp,
            totalDemandMW: totalGeneration,
            carbonIntensity_gCO2kWh: latestCarbonIntensityData.nz_carbon_gkwh,
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

export const fetchAUEmissions = async (): Promise<CountryEmissions | null> => {
    try {
        const response = await fetch(
            'http://localhost:3001/api/emissions/australia'
        );

        if (response.ok) {
            console.log("we got em");
        }
        const data = await response.json();

        const emissions: CountryEmissions = {
            country: data.country,
            timestamp: data.timestamp,
            totalDemandMW: data.totalDemandMW,
            carbonIntensity_gCO2kWh: data.carbonIntensity_gCO2kWh,
            generationMix: data.generationMix
        };

        console.log('AU data fetched successfully (frontend):', emissions);
        return emissions;
    } catch (error) {
        console.error('Error fetching AU emissions:', error);
        console.warn('Falling back to mock AU data');
        return null;
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