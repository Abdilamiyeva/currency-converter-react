import { useEffect, useReducer, useState } from "react";
import Axios from "axios";
import './currency.css'
const API_URL = "https://v6.exchangerate-api.com/v6/5e86382257d907527ecf4f9c/latest/USD";
const DEFAULT_CURRENCY = "Select Currency";

const CurrencyConverter = () => {
  const initialState = {
    fromCurrency: "USD",
    toCurrency: "EUR",
    amount: 1,
    convertedAmount: null,
    exchangeRates: null,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_FROM_CURRENCY":
        return { ...state, fromCurrency: action.payload };
      case "SET_TO_CURRENCY":
        return { ...state, toCurrency: action.payload };
      case "SET_AMOUNT":
        return { ...state, amount: action.payload };
      case "CONVERT":
        const convertedAmount =
          (state.amount / state.exchangeRates[state.fromCurrency]) *
          state.exchangeRates[state.toCurrency];
        return { ...state, convertedAmount };
      case "SET_EXCHANGE_RATES":
        return { ...state, exchangeRates: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [currencies, setCurrencies] = useState([DEFAULT_CURRENCY]);

  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: `SET_${name}`, payload: value });
  };

  const handleAmountChange = (e) => {
    dispatch({ type: "SET_AMOUNT", payload: e.target.value });
  };

  const handleConvert = () => {
    dispatch({ type: "CONVERT" });
  };

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const result = await Axios.get(API_URL);
        const exchangeRates = result.data.conversion_rates;
        dispatch({ type: "SET_EXCHANGE_RATES", payload: exchangeRates });
        setCurrencies([DEFAULT_CURRENCY, ...Object.keys(exchangeRates)]);
      } catch (error) {
        console.error("error data: ", error);
      }
    };

    fetchCurrencies();
  }, []);

  return (
    <div className="currency__container">
      <h1 className="currency__left__content">Currency Converter</h1>
      <div className="currency__right__content">
        <div className="amount">
          <input
            type="number"
            value={state.amount}
            onChange={handleAmountChange}
          />
        </div>
        <div className="select__right__context">
          <label className="select" htmlFor="fromCurrencySelect">
            <select
              className="selected1"
              name="FROM_CURRENCY"
              onChange={handleCurrencyChange}
              value={state.fromCurrency}
              id="fromCurrencySelect"
            >
              {currencies.map((currency) => (
                <option  key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </label>
          <button className="btn" onClick={handleConvert}>
          <i className="fa-solid fa-arrow-right-arrow-left"></i>
          </button>
          <select
          className="to__currency"
            name="TO_CURRENCY"
            onChange={handleCurrencyChange}
            value={state.toCurrency}
          >

            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div className="converted__amount">
          {state.convertedAmount && (
            <div  className="converted__amount__in">
              <input 
            onChange={handleConvert} 
            readOnly
            value={`Converted Amount: ${state.convertedAmount.toFixed(2)}`}></input>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
