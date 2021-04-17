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

  return {
    getCurrencyList,
  };
}
