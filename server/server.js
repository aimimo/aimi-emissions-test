const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock data for one AU region
const generateRegionData = () => {
    const totalDemandMW = Math.floor(Math.random() * 10000) + 15000;
    const carbonIntensity_gCO2kWh = Math.floor(Math.random() * 200) + 250;

    const coal = Math.floor(Math.random() * 30) + 30;   // 30-60%
    const wind = Math.floor(Math.random() * 20) + 15;   // 15-35%
    const solar = Math.floor(Math.random() * 20) + 10;  // 10-30%
    const gas = Math.floor(Math.random() * 15) + 5;     // 5-20%
    const other = 100 - (coal + wind + solar + gas);    // whatever is left to sum to 100%

    return {
        totalDemandMW,
        carbonIntensity_gCO2kWh,
        generationMix: {
            coal,
            wind,
            solar,
            gas,
            other
        },
        timestamp: new Date().toISOString()
    };
};

app.get('/api/emissions/australia', (req, res) => {
    const data = {
        QLD: generateRegionData(),
        NSW: generateRegionData(),
        VIC: generateRegionData(),
        SA: generateRegionData(),
        TAS: generateRegionData(),
    };
    res.json(data);
});

app.listen(PORT, () => {
    console.log(`AU Emissions Backend running at http://localhost:${PORT}`);
});