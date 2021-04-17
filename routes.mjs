// Import Models

// Import Controllers
import currencyController from './controllers/currency-controller.mjs';

// Main function that binds the routes to the requestes
export default function bindRoutes(app) {
  // initialize the controller functions
  const currencyCntrlr = currencyController();

  // Define the routes
  app.get('/', currencyCntrlr.getCurrencyList);
  app.get('/api/currencies', currencyCntrlr.getCurrencyList);
}
