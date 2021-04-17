// const axios = require('axios').default;
import axios from 'axios';
import moment from 'moment';

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
           response: { date: '2021-04-17', base: 'USD',
                       rates: { AED: 3.6725, AFN: 77.49777256, .... }
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
   * This function gets the historical data for a single day
   * @param urlHistoricalRate - URL
   * @returns - returns the response from the URL access
   */
  const getSingleHistoricalRate = async (urlHistoricalRate) => {
    try {
      const result = await axios.get(urlHistoricalRate);
      // Send the complete response data
      // This response object has the structure:
      /**
           response: { date: '2021-04-17', base: 'USD',
                       rates: { AED: 3.6725, AFN: 77.49777256, .... }
                    }
           */
      return result;
    } catch (error) {
      return error;
    }
  };

  /**
   * This function gets all the historical data based on the number of days mentioned in the request
   * @param request - HTTP request param
   * @returns - ReturnData: { status: 200, statusText: 'Success',
   *                          data: {[yyyy-mm-dd]: {status: 200, statusText: 'Success',
   *                                                response: {date: '2021-04-17', base: 'SGD',
   *                                                           rates: {  AED: 2.75196681,....}},
   *                                 [yyyy-mm-dd]:{status: 200, statusText: 'Success',
   *                                           response:{<data returned from axios call to URL>}}} }
   */
  const getAllHistoricalRates = async (request) => {
    // request params and the specified currencies as query in the url
    // Date Format: YYYY-MM-DD
    // to disable the const error shown for base
    // eslint-disable-next-line prefer-const
    let { base, days } = request.params;
    const { currencies } = request.query;

    // Create the URL
    // Syntax: https://api.currencyscoop.com/v1/historical?api_key=<API_KEY>&base=<>&date=<YYYY-MM-DD>&symbols=SGD,USD
    let urlHistoricalRate = `${BASE_CURRENCY_SCOOP_URL}historical?${API_KEY_QUERY}&base=${base}`;
    if (currencies !== undefined && currencies.length !== 0) {
      urlHistoricalRate += `&symbols=${currencies}`;
    }

    // Data to be returned is stored in this.
    // Key will be the historical date queried and the value will be the whole data
    // It also stores the status of the complete operation
    const returnData = { status: 200, statusText: 'Success', data: {} };
    // Get the historical data for each day
    const lastDate = new Date();
    while (days > 0) {
      // Calculate the previous day starting from today
      lastDate.setDate(lastDate.getDate() - 1);
      // Convert the date into the required form of 'YYYY-MM-DD' for the url
      const historicalDate = moment(lastDate).format('YYYY-MM-DD');

      urlHistoricalRate += `&date=${historicalDate}`;

      // Call to CurrencyScoop
      // eslint-disable-next-line no-await-in-loop
      const historicalRateResult = await getSingleHistoricalRate(urlHistoricalRate);
      console.log('historicalRateResult: ', historicalRateResult);
      if (historicalRateResult.status === 200) {
        returnData.data[historicalDate] = {};
        // Got the response correctly.
        // Check whether base currency returned in the response is same as the requested
        if (base !== historicalRateResult.data.response.base) {
          // If they are not same return error
          const errMsg = `Failed to get the exchange rates for the base currency: ${base}.`;
          returnData.data[historicalDate].status = 422;
          returnData.data[historicalDate].statusText = errMsg;
        }
        else if (historicalDate !== historicalRateResult.data.response.date) {
          const errMsg = `Failed to get the exchange rates for the date: ${historicalDate}. Check the date specified again.`;
          returnData.data[historicalDate].status = 422;
          returnData.data[historicalDate].statusText = errMsg;
        }
        else {
          returnData.data[historicalDate].status = historicalRateResult.data.meta.code;
          returnData.data[historicalDate].statusText = 'Success';
          returnData.data[historicalDate].response = historicalRateResult.data.response;
        }
      }
      else {
        console.log(`Error: ${urlHistoricalRate}`);
        // Error is returned from Currecy Scoop API
        // Get the error status code and text and send it to the client
        console.log(historicalRateResult);
        console.log('Result Code: ', historicalRateResult.response.status);
        console.log('Result Status Text: ', historicalRateResult.response.statusText);
        const errMsg = `Failed to get the real time exchange rate. Error: ${historicalRateResult.response.statusText}`;
        // response.status(error.response.status).send(errMsg);
        returnData.status = 422;
        returnData.statusText = errMsg;
        // If an error is returned from CurrencyScoop, no need to continue further
        return returnData;
      }
      days -= 1;
    }
    console.log('Returning Result');
    // Represents the general status of the complete process
    returnData.status = 200;
    returnData.statusText = 'Success';
    return returnData;
  };

  /**
   * This function gets the historical time exchange rate  from CurrencyScoop, based on the
   * "base" for specified currency list, in a particular time period.
   * @param request - HTTP request param. It holds the query parameter for the base currency
   * @param response - HTTP response that an Express app sends when it gets an HTTP request.
   */
  const getTimePeriodExchangeRates = async (request, response) => {
    const returnData = await getAllHistoricalRates(request);
    response.status(200).send(returnData);
  };

  return {
    getCurrencyList,
    getRealTimeExchangeRates,
    getTimePeriodExchangeRates,
  };
}
