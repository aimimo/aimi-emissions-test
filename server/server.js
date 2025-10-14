require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const OPENNEM_API_KEY = process.env.OPENNEM_API_KEY;
const OPENNEM_BASE_URL = 'https://api.openelectricity.org.au/v4/data/network/NEM';

const fetchRegionData = async () => {
    try {
        const response = await axios.get(OPENNEM_BASE_URL, {
            headers: {
                'Authorization': `Bearer ${OPENNEM_API_KEY}`,
                'Accept': 'application/json',
            },
            params: {
                metrics: ['power', 'emissions'],
                interval: '5m',
                primary_grouping: 'network_region',
                secondary_grouping: 'fueltech_group'
            },
            paramsSerializer: (params) => {
                const parts = [];
                for (const key in params) {
                    if (Array.isArray(params[key])) {
                        params[key].forEach(val => {
                            parts.push(`${key}=${val}`);
                        });
                    } else {
                        parts.push(`${key}=${params[key]}`);
                    }
                }
                return parts.join('&');
            }
        });

        const networkData = response.data;
        const powerData = networkData.data.find(d => d.metric === 'power');
        const emissionsData = networkData.data.find(d => d.metric === 'emissions');
        console.log("DEBUG AU emissions raw:", {
            sampleEmissionSeries: emissionsData.results[0],
            samplePowerSeries: powerData.results[0],
        });

        if (!powerData || !emissionsData) {
            console.error('Missing power or emissions data');
            return null;
        }
        const latestPowerSeries = powerData.results[0];
        const latestTimestamp = latestPowerSeries.data[latestPowerSeries.data.length - 1][0];

        const regionMix = {};
        powerData.results.forEach(series => {
            const region = series.columns.region;
            const fueltech = series.columns.fueltech_group;
            const latestValue = series.data[series.data.length - 1][1];

            if (!regionMix[region]) {
                regionMix[region] = {};
            }
            regionMix[region][fueltech] = latestValue;
        });

        const generationMix = {};
        let totalDemandMW = 0;
        let totalEmissions = 0;

        powerData.results.forEach(series => {
            const fueltech = series.columns.fueltech_group;
            const latestValue = series.data[series.data.length - 1][1];

            generationMix[fueltech] = (generationMix[fueltech] || 0) + latestValue;
            totalDemandMW += latestValue;
        });

        // Convert to percentages
        Object.entries(generationMix).forEach(([fueltech, value]) => {
            generationMix[fueltech] = totalDemandMW > 0
                ? Math.round((value / totalDemandMW) * 100)
                : 0;
        });

        // Calculate total emissions
        emissionsData.results.forEach(series => {
            const latestEmission = series.data[series.data.length - 1][1];
            totalEmissions += latestEmission;
        });

        const carbonIntensity = totalDemandMW > 0
            ? Math.round((totalEmissions / totalDemandMW) * 1000 * 100) / 100
            : 0;

        const ausData = {
            country: 'AU',
            timestamp: latestTimestamp,
            totalDemandMW: Math.round(totalDemandMW * 100) / 100,
            carbonIntensity_gCO2kWh: carbonIntensity,
            generationMix
        };

        console.log('AU data fetched successfully:', ausData);
        return ausData;

    } catch (error) {
        console.error("Error caught");
        console.error("Error message:", error.message);
        console.error("Error code:", error.code);
        console.error("Response status:", error.response?.status);
    }
}

const generateMockData = () => {
    const totalDemandMW = Math.floor(Math.random() * 10000) + 15000;
    const carbonIntensity_gCO2kWh = Math.floor(Math.random() * 200) + 250;

    const coal = Math.floor(Math.random() * 30) + 30;   // 30-60%
    const wind = Math.floor(Math.random() * 20) + 15;   // 15-35%
    const solar = Math.floor(Math.random() * 20) + 10;  // 10-30%
    const gas = Math.floor(Math.random() * 15) + 5;     // 5-20%
    const other = 100 - (coal + wind + solar + gas);    // whatever is left to sum to 100%

    return {
        country: 'AU',
        timestamp: new Date().toISOString(),
        totalDemandMW,
        carbonIntensity_gCO2kWh,
        generationMix: {
            coal,
            wind,
            solar,
            gas,
            other
        },
    };
};

app.get('/api/emissions/australia', async (req, res) => {
    const generationData = await fetchRegionData();
    if (generationData) {
        res.json(generationData);
        console.log("AU Fetch success");
    } else {
        const mockData = generateMockData()
        console.warn("Falling back to mock AU data...")
        return res.json(mockData);
    }
});

app.get('/', (req, res) => {
    res.send('AU Emissions Backend is running!');
});

app.listen(PORT, () => {
    console.log(`AU Emissions Backend running at http://localhost:${PORT}`);
});