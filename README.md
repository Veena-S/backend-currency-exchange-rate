# Backend for Currency Exchange Rate App

### Description

This is the backend server for the application that gets currency exchange rates.

The server communicates with CurrecyScoop to get the currency details and the exchange rates.

### Setup

1. Clone the repo
2. Install all the dependencies through `npm install`
3. Run the server using `npx nodemon index.mjs`

#### Port

The default PORT number is taken as 3004, if the env variable PORT is not set.

Server will be running on the URL "http://localhost:3004/".

#### API Endpoints

The endpoints provided by the server are the following:

1. To get the complete list of supported currencies: `http://localhost:3004/api/currencies`
2. To get the real time exchange rates: `http://localhost:3004/api/latest-rate`.
   1. `base` is required. This is the base currency that will be used to get the rates. Complete URL: `http://localhost:3004/api/latest-rate/base`.
   2. To get the real time exchange rates for specific currencies: `http://localhost:3004/api/latest-rate/base?currencies=USD,SGD`. This will give the exchange rates for USD and SGD only.
3. To get the historical exchange rates for a time-period for a specific currency: `http://localhost:3004/api/historical-rate/base/days?currencies=`.

### Design

Backend implementation is based on MVC model.

Controller files handles the business logic and also handles the HTTP requests and responses to and from the server. Model is the logical component that is generally responsible for handling the structure of data. It also manipulates the data in database, if there is any.

Express is used to handle HTTP requests.

Axios is used to communicate with CurrencyScoop.

Other than models and controllers, the application has route file that connects the requests to controllers.
