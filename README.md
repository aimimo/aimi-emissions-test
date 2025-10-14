# Live Emissions & Generation Mix Dashboard
A real-time dashboard for monitoring electricity generation and carbon emissions, showing renewable vs non-renewable contributions in Australia and New Zealand.

## Features
- Live emissions & generation mix per country (AU & NZ)
- Interactive charts (bar & pie)

## Tech Stack
- **Frontend:** React + TypeScript
- **UI Framework:** Material UI v7
- **Charts:** Recharts
- **Backend:** Node.js + Express
- **Data Sources:**
    - New Zealand: EM6 API (Transpower)
    - Australia: OpenElectricity API via backend proxy

## Setting up
1. Clone the repository

```git clone <your-repo-url>```

```cd <project-folder>```

2. Install frontend dependencies
   ```npm install```

3. Install backend dependencies
   ```cd server```

```npm install```

4. Configure environment variables:

### Create a new `.env` file in the project root directory
To get an API key,
- Register at [platform.openelectricity.org.au](https://platform.openelectricity.org.au)
- Copy your API key to the .env file, following the structure below.

```
OPENNEM_API_KEY={your OpenElectricity API key}
```
For example:
```
OPENNEM_API_KEY=ex4mpl3_kEy_ABCDEFmpjdQleU2F083dd
```

Note that without this, mock Australian data will be used instead of real data.

## Running the Application
1. Start the backend server
   ```cd server```

```npm start```

Backend runs on http://localhost:3001

2. Start the frontend (in a new terminal)
   ```npm run dev```

Frontend runs on http://localhost:5173 (or the port shown in terminal)

3. Open your browser and navigate to the frontend URL.

---

### API Endpoints
Backend:
- `GET /api/emissions/australia` : Returns emissions data for all Australian states within the National Electricity Market (NEM)

External APIs:
- NZ Data: EM6 API
- AU Data: OpenElectricity API (proxied through backend)

### AI Usage Disclosure
This project was developed with some assistance from Claude (Anthropic) and ChatGPT, namely for:

- Generating mock data structures and initial type definitions
- Providing calculation templates for emissions aggregation (adapted for project needs)
- Code review and optimization suggestions

All generated code was reviewed, tested, and modified to meet project requirements. Core architectural and design decisions were made independently.