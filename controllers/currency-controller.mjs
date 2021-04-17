// const axios = require('axios').default;
import axios from 'axios';

// set access key
const API_KEY = '43142c72cdf44ba4f7b84e68cdf0066e';
const API_KEY_QUERY = `api_key=${API_KEY}`;
const BASE_CURRENCY_SCOOP_URL = 'https://api.currencyscoop.com/v1/';

/**
 * This function handles the requests to get the currency exchange rates.
 * It also communicates with the CurrencyScoop and fetch the values as per the request.
 *
 */
export default function currencyController() {
  /**
   * This function gets the latest currency list from CurrencyScoop
   * @param request - HTTP request param
   * @param response - HTTP response that an Express app sends when it gets an HTTP request.
   */
  const getCurrencyList = async (request, response) => {
    // Create the URL
    // Syntax: https://api.currencyscoop.com/v1/currencies?api_key=<API_KEY>
    const urlCurrencyList = `${BASE_CURRENCY_SCOOP_URL}currencies?${API_KEY_QUERY}`;

    // Create Axios request
    axios.get(urlCurrencyList)
      .then((result) => {
        // The request to Currency Scoop is a success
        // The returned result can be obtained from result.data
        console.log('Result Code: ', result.data.meta.code);
        console.log('Result Response: ', result.data.response);
        // console.log('Full result: ', result.data);
        response.status(result.data.meta.code).send(result.data.response.fiats);
      })
      .catch((error) => {
        // Error is returned from Currecy Scoop API
        // Get the error status code and text and send it to the client
        console.log(error);
        console.log('Result Code: ', error.response.status);
        console.log('Result Status Text: ', error.response.statusText);
        const errorMessage = `Failed to get the currency list. Error: ${error.response.statusText}`;
        response.status(error.response.status).send(errorMessage);
      });
  };

  /**
   * This function gets the real time exchange rate from CurrencyScoop,
   * based on the currency specified as "base"
   * @param request - HTTP request param. It holds the query parameter for the base currency
   * @param response - HTTP response that an Express app sends when it gets an HTTP request.
   */
  const getRealTimeExchangeRates = async (request, response) => {
    // base = the base currency which should be as the base value for exchange rates
    const { base } = request.params;
    // Currencies for which exchange rates has to be found
    // query: { currencies: 'USD' },
    // query: { currencies: 'USD,AUD' },
    // query: { currencies: '' },
    const { currencies } = request.query;
    console.log(typeof (currencies));
    // if the currencies is empty, get the rates for all the currencies
    // if not empty append it to the url

    // Create the URL
    // Syntax: https://api.currencyscoop.com/v1/latest?api_key=<API_KEY>&base=<>
    let urlLatestRate = `${BASE_CURRENCY_SCOOP_URL}latest?${API_KEY_QUERY}&base=${base}`;
    if (currencies !== undefined && currencies.length !== 0) {
      urlLatestRate += `&symbols=${currencies}`;
    }

    console.log(urlLatestRate);

    // Create Axios request
    axios.get(urlLatestRate)
      .then((result) => {
        // The request to Currency Scoop is a success
        // The returned result can be obtained from result.data
        console.log('Result Code: ', result.data.meta.code);
        console.log('Result Response: ', result.data.response);
        // console.log('Full result: ', result.data);

        // Check whether base currency returned in the response is same as the requested
        if (base !== result.data.response.base) {
          // If they are not same return error
          const errMsg = `Failed to get the exchange rates for the base currency: ${base}.`;
          response.status(422).send(errMsg);
        }
        else {
          // Got the response correctly.
          // Send the complete response data
          // This response object has the structure:
          /**
           response: {
             date: '2021-04-17T14:04:42Z',
             base: 'USD',
             rates: {
               AED: 3.6725,
               AFN: 77.49777256,
               ....
             }
           }
           */
          response.status(result.data.meta.code).send(result.data.response);
        }
      })
      .catch((error) => {
        // Error is returned from Currecy Scoop API
        // Get the error status code and text and send it to the client
        console.log(error);
        console.log('Result Code: ', error.response.status);
        console.log('Result Status Text: ', error.response.statusText);
        const errorMessage = `Failed to get the real time exchange rate. Error: ${error.response.statusText}`;
        response.status(error.response.status).send(errorMessage);
      });
  };

  /**
   * This function gets the historical time exchange rate  from CurrencyScoop, based on the
   * "base" for specified currency list, in a particular time period.
   * @param request - HTTP request param. It holds the query parameter for the base currency
   * @param response - HTTP response that an Express app sends when it gets an HTTP request.
   */
  const getTimePeriodExchangeRates = async (request, response) => {

  };

  return {
    getCurrencyList,
    getRealTimeExchangeRates,
    getTimePeriodExchangeRates,
  };
}
