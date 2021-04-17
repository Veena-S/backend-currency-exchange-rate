/**
 * This function handles the requests to get the currency exchange rates.
 * It also communicates with the CurrencyScoop and fetch the values as per the request.
 *
 */
export default function currencyController() {
  const getCurrencyList = async (request, response) => {
    response.send('get currency list request');
  };

  return {
    getCurrencyList,
  };
}
