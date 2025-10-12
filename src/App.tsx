import {ThemeProvider} from '@mui/material/styles';
import {CssBaseline} from "@mui/material";
import {theme} from './theme'
import Dashboard from "./components/Dashboard.tsx";
import './App.css';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Dashboard></Dashboard>
        </ThemeProvider>
    )
}

export default App