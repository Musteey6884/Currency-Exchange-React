
![SCE-logo](https://raw.githubusercontent.com/TSypko/Currency-Exchange-React/master/share-mini.png)
# SIMPLE CURRENCY EXCHANGE
LIVE LINK: [https://tsypko.github.io/SCE-Simple-Currency-Exchange-App/](https://tsypko.github.io/Currency-Exchange-React/)

 v. 1.8.0

## DESCRIPTION
Simple, lightweight currency converter created during ,*,Become A Front End Developer"* course provided by *Youcode Academy*.
It allows you to instantly convert currencies based on the exchange rate of the day*.
Supported currencies: 

 - ✅ PLN - Polish Zloty
 - ✅ EUR - Euro
 - ✅ USD - US Dollar
 - ✅ GBP - British Pound
 - ✅ CHF - Swiss Franc
 - ✅ DKK - Danish krone
 - ✅ NOK - Norwegian krone
 - ✅ SEK - Swedish krona
 - ✅ RUB - Russian rouble
 - ✅ CZK - Czech koruna
 - ✅ BGN - Bulgarian lev
 - ✅ HUF - Hungarian forint
 - ✅ RON - Romanian leu
 - ✅ ISK - Icelandic krona
 - ✅ CAD - Canadian dollar
 - ✅ TRY - Turkish lira
 - ✅ AUD - Australian dollar
 - ✅ BRL - Brazilian real
 - ✅ HKD - Hong Kong dollar
 - ✅ IDR - Indonesian rupiah
 - ✅ ILS - Israeli shekel
 - ✅ INR - Indian rupee
 - ✅ KRW - South Korean won
 - ✅ MXN - Mexican peso
 - ✅ MYR - Malaysian ringgit
 - ✅ NZD - New Zealand Dollar
 - ✅ PHP - Phlilippine peso
 - ✅ SGD - Singapore dollar
 - ✅ THB - Thai baht
 - ✅ ZAR - South Afrifcan rand

### TECHNOLOGIES USED:

- React.js
- create-react-app
- HTML
- CSS
- JavaScript ES6+
- Styled Components
- Material UI
- Custom Hooks

### METHODOLOGIES USED:

- JSX
- Fetch API

### API:

[https://exchangeratesapi.io/](https://exchangeratesapi.io)

Foreign exchange rates API
with currency conversion
Exchange rates API is a free service for current and historical foreign exchange rates
published by the [European Central Bank](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html/)

### HOW TO USE

1. Choose a currency type you wish to convert from **FROM** field.
2. Choose a currency type you wish to convert to from **TO** field.
3. Write an amount that you want to convert in **AMOUNT** field.
4. Result of conversion will appear instantly at **RESULT** field.
5. Optional, you can switch currencies to check other conversions.

![usage gif](https://raw.githubusercontent.com/TSypko/Currency-Exchange-React/master/sce__usage.gif)

6. When data import fails, following message will be shown:

![error message](https://raw.githubusercontent.com/TSypko/Currency-Exchange-React/master/error.png)

### AUTHOR
[Tomasz Sypko](https://tsypko.github.io/homepage/). Pre Junior Front End Developer from Rzeszów, Poland. 
### CONTACT:
Please feel free to contact with author: [tsypko@gmail.com](tsypko@gmail.com)

### VERSION HISTORY

v. 1.8.0:

- added Material UI library
- Clock component refactored
- New Information & Error message design
- API source information style changed
- RESULT display changed
- Background changed

v. 1.7.0:

Currencies added:
 - [+] BRL - Brazilian real
 - [+] HKD - Hong Kong dollar
 - [+] IDR - Indonesian rupiah
 - [+] ILS - Israeli shekel
 - [+] INR - Indian rupee
 - [+] KRW - South Korean won
 - [+] MXN - Mexican peso
 - [+] MYR - Malaysian ringgit
 - [+] NZD - New Zealand Dollar
 - [+] PHP - Phlilippine peso
 - [+] SGD - Singapore dollar
 - [+] THB - Thai baht
 - [+] ZAR - South Afrifcan rand

v. 1.6.6:

- added result display in according to local language ID,

v. 1.6.5:

- added possible error Type to message,

v. 1.6.4:

- added loading animation from 'ract-loading' library

v. 1.6.3:

- added *Loading* message while loading data
- added <span style="color: red">***Unable to receive data***</span> error message while loading data

v. 1.6.2:

- added Styled Components

v. 1.6.1:

- added custom hooks

v. 1.6.0:

Currencies added:
 - [+] BGN - Bulgarian lev
 - [+] HUF - Hungarian forint
 - [+] RON - Romanian leu
 - [+] ISK - Icelandic krona
 - [+] CAD - Canadian dollar
 - [+] TRY - Turkish lira
 - [+] AUD - Australian dollar

v. 1.5.0:
- added API integration
- [-] UAH - Ukrainian hryvnia currency removed due to the lack of API support

v. 1.4.0  :
- added Date and Time display

v. 1.3.0

Currencies added:
 - [+] JPY - Japanese Yen
 - [+] HRK - Croatian Kuna

v. 1.2.0

Currencies added:
 - [+] DKK - Danish krone
 - [+] NOK - Norwegian krone
 - [+] SEK - Swedish krona
 - [+] RUB - Russian rouble
 - [+] UAH - Ukrainian hryvnia
 - [+] CZK - Czech koruna

v. 1.1.0

Application exported to React.JS

v. 1.0.2
- JavaScript code thoroughly refactored,

v. 1.0.1
- JavaScript amendment,
- Styling amendment,

v. 1.0.0


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Local proxy & RapidAPI (development)

This project includes a small local proxy server used in development to avoid CORS issues and to optionally call third-party APIs server-side.

1) Create a `.env` file in the project root (or set the environment variable in your shell) with your RapidAPI key:

```
# .env
RAPIDAPI_KEY=your_rapidapi_key_here
```

2) Install dependencies and start the proxy server (in one terminal):

```powershell
npm install
$env:RAPIDAPI_KEY = 'your_rapidapi_key_here'  # PowerShell example for current session
npm run start:server
```

3) Start the React dev server in another terminal:

```powershell
npm start
```

The app will first try to use the local RapidAPI endpoint (`/api/convert-rapidapi`) and then fall back to other local or public proxies. This is intended for development and debugging only.