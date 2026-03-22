import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from "@/components/ui/tooltip";
import ThemeProvider from './components/ThemeProvider.tsx';

// This App is goind to use OpenWeather - a giant API that allows us to get all sorts of accurate 
// real-time and historical weather information.  Refer to https://openweathermap.org/ for API docs   
// https://openweathermap.org/api/one-call-3?collection=one_call_api_3.0
// build and initialize a query client – backbone/context for tanstack query to fetch and retrieve data 
const queryClient = new QueryClient()


// Here initializing query client, after that refer to App.tsx on how to use/implement query
createRoot(document.getElementById('root')!).render(
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </TooltipProvider>

)
