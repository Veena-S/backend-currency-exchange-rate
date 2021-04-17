// Import Models

// Import Controllers
import currencyController from './controllers/currency-controller.mjs';

// Main function that binds the routes to the requestes
export default function bindRoutes(app) {
  // initialize the controller functions
  const currencyCntrlr = currencyController();

  // Define the routes
  // Root - returns the list of currencies
  app.get('/', currencyCntrlr.getCurrencyList);
  // API to return the list of currencies
  app.get('/api/currencies', currencyCntrlr.getCurrencyList);
  // API to return the real-time exchange rates for a set of currencies
  app.get('/api/latest-rate/:base', currencyCntrlr.getRealTimeExchangeRates);
}
