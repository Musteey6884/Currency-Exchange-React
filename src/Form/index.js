import React, { useState, useEffect } from 'react';
import CurrencySelector from "./FormField/CurrencySelector"
import FormField from "./FormField"
import ResultField from "./FormField/ResultField"
import { countries } from '../utils/countries';
import Amount from './FormField/Amount';
import {
    FormContainer,
    Fieldset,
    Legend,
    InputWrapper,
    FlagWrapper,
    FlagImage,
    FetchMessage
} from "./styled";
import { useFetch } from "./useFetch";
import Loading from "./Loading";
import MuiAlert from '@material-ui/lab/Alert';

const Form = () => {

    // Use a free public API that provides a wide range of currencies
    const rateData = useFetch("https://api.exchangerate.host/latest?base=PLN");

    useEffect(() => {
        setCurrencies(countries.map(
            (currency) => ({
                ...currency,
                // use optional chaining on rates before indexing to avoid errors when rates is undefined
                rate: rateData.content?.rates?.[currency.shortname]
            })));
        setRateDate(rateData.content?.date);
    }, [rateData.content]);

    const [currencies, setCurrencies] = useState(countries);
    const [rateDate, setRateDate] = useState("");

    const [currencyFromName, setCurrencyFromName] = useState("Euro");
    const onSelectCurrencyFromChange = ({ target }) => setCurrencyFromName(target.value);

    const [currencyToName, setCurrencyToName] = useState("Polish Zloty");
    const onSelectCurrencyToChange = ({ target }) => setCurrencyToName(target.value);

    // default to 1 so users see a non-zero example result right away
    const [amount, setAmount] = useState(1);
    const onAmountChange = ({ target }) => {
        const v = target.value;
        // allow empty input to be treated as 0, otherwise parse a float
        setAmount(v === '' ? '' : parseFloat(v));
    };

    const currencyFrom = currencies.find(({ name }) => name === currencyFromName);
    const currencyTo = currencies.find(({ name }) => name === currencyToName);
    const [fallbackResult, setFallbackResult] = useState(null);
    const [fallbackError, setFallbackError] = useState(null);
    const [converting, setConverting] = useState(false);

    const onFormSubmit = (event) => {
        event.preventDefault();
    };

    const hasRates = typeof currencyTo?.rate === 'number' && typeof currencyFrom?.rate === 'number';
    const numericAmount = amount === '' ? 0 : Number(amount);
    // If both rates exist use cross-rate calculation. Otherwise fallback to convert endpoint if available.
    const calculatedResult = (hasRates && numericAmount) ? numericAmount * currencyTo.rate / currencyFrom.rate : 0;
    const result = hasRates ? calculatedResult : (fallbackResult !== null ? fallbackResult : 0);

    // Shared helper that attempts several proxy/source endpoints in order and returns a Promise<number>
    const performConvert = async (from, to, amount) => {
        const localRapid = `http://localhost:4000/api/convert-rapidapi?from=${from}&to=${to}&amount=${amount}`;
        const localGoogle = `http://localhost:4000/api/convert-google?from=${from}&to=${to}&amount=${amount}`;
        const localProxy = `http://localhost:4000/api/convert?from=${from}&to=${to}&amount=${amount}`;
        const corsAny = `https://cors-anywhere.herokuapp.com/${encodeURIComponent(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`)}`;
        const publicProxy = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`);

        // Try local RapidAPI endpoint
        try {
            const rr = await fetch(localRapid);
            if (rr.ok) {
                const jr = await rr.json();
                if (jr && typeof jr.result === 'number') return jr.result;
            }
        } catch (e) {
            console.warn('local RapidAPI attempt failed', e);
        }

        // Try Google scraping endpoint
        try {
            const rg = await fetch(localGoogle);
            if (rg.ok) {
                const jg = await rg.json();
                if (jg && typeof jg.result === 'number') return jg.result;
            }
        } catch (e) {
            console.warn('local Google attempt failed', e);
        }

        // Try local exchangerate.host proxy
        try {
            const rp = await fetch(localProxy);
            if (rp.ok) {
                const jp = await rp.json();
                if (jp && typeof jp.result === 'number') return jp.result;
            }
        } catch (e) {
            console.warn('local exchangerate proxy failed', e);
        }

        // Try public cors-anywhere
        try {
            const ca = await fetch(corsAny);
            if (ca.ok) {
                const ja = await ca.json();
                if (ja && typeof ja.result === 'number') return ja.result;
            }
        } catch (e) {
            console.warn('cors-anywhere attempt failed', e);
        }

        // Try allorigins
        try {
            const pa = await fetch(publicProxy);
            if (pa.ok) {
                const ja = await pa.json();
                if (ja && typeof ja.result === 'number') return ja.result;
            }
        } catch (e) {
            console.warn('allorigins attempt failed', e);
        }

        throw new Error('All convert attempts failed');
    };

    // Fallback: when rates are missing, ask the convert endpoint for this pair
    useEffect(() => {
        let cancelled = false;
        setFallbackResult(null);
        // Only attempt when we don't have bulk rates and when we have a numeric amount
        if (!hasRates && currencyFrom?.shortname && currencyTo?.shortname && numericAmount > 0) {
            const from = currencyFrom.shortname;
            const to = currencyTo.shortname;
            setFallbackError(null);
            performConvert(from, to, numericAmount)
                .then(res => {
                    if (!cancelled) setFallbackResult(res);
                }).catch(err => {
                    console.error('Automatic convert attempts failed', err);
                    if (!cancelled) setFallbackError(err.message || 'Conversion unavailable');
                });
        }
        return () => { cancelled = true };
    }, [currencyFrom?.shortname, currencyTo?.shortname, numericAmount, hasRates]);

    const handleConvert = async () => {
        setFallbackError(null);
        setConverting(true);
        try {
            if (hasRates && numericAmount) {
                const calc = numericAmount * currencyTo.rate / currencyFrom.rate;
                setFallbackResult(calc);
            } else if (currencyFrom?.shortname && currencyTo?.shortname && numericAmount > 0) {
                const res = await performConvert(currencyFrom.shortname, currencyTo.shortname, numericAmount);
                setFallbackResult(res);
            } else {
                setFallbackError('Please select currencies and enter a valid amount');
            }
        } catch (err) {
            console.error('Manual convert failed', err);
            setFallbackError(err.message || 'Conversion failed');
        } finally {
            setConverting(false);
        }
    };

    return (
        <FormContainer onSubmit={onFormSubmit}>
            <Fieldset>
                <Legend>
                    Converter
                </Legend>
                {!rateData.content
                    ? (
                        <>
                            {rateData.loading
                                ? <MuiAlert elevation={6} variant="filled" severity="info">
                                    Loading...
                                          </MuiAlert>
                                : rateData.error = <MuiAlert elevation={6} variant="filled" severity="error">
                                    "Unable receive data. Try again later"
                                           </MuiAlert>
                            }
                            <FetchMessage>
                                {rateData.loading && <Loading />}
                            </FetchMessage >
                        </>
                    )
                    :
                    <>
                        <InputWrapper>

                            <FormField
                                body=
                                {
                                    <CurrencySelector
                                        labelText="From"
                                        value={currencyFromName}
                                        onChange={onSelectCurrencyFromChange}
                                    />
                                }
                            />
                            <FlagWrapper>
                                <FlagImage
                                    src={currencyFrom?.flagImage || ''}
                                    alt={`Flag of ${currencyFrom?.country || ''}`}
                                />
                            </FlagWrapper>
                            <FormField
                                body=
                                {
                                    <CurrencySelector
                                        labelText="To"
                                        value={currencyToName}
                                        onChange={onSelectCurrencyToChange}
                                    />
                                }
                            />
                            <FlagWrapper>
                                <FlagImage
                                    src={currencyTo?.flagImage || ''}
                                    alt={`Flag of ${currencyTo?.country || ''}`}
                                />
                            </FlagWrapper>
                            <FormField
                                body=
                                {
                                    <Amount
                                        value={amount}
                                        onChange={onAmountChange}
                                    />
                                }
                            />
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 12 }}>
                                <button type="button" onClick={handleConvert} disabled={converting} style={{ padding: '8px 12px', borderRadius: 4, cursor: converting ? 'wait' : 'pointer' }}>
                                    {converting ? 'Converting...' : 'Convert'}
                                </button>
                            </div>
                        </InputWrapper>
                        <FormField
                            type={"result"}
                            body=
                            {
                                    <>
                                        <ResultField
                                            result={result}
                                            LCID={currencyTo?.LCID}
                                            currencyToName={currencyTo?.shortname}
                                            amount={amount}
                                            rateDate={rateDate}
                                        />
                                        {fallbackError && <FetchMessage>
                                            <MuiAlert elevation={6} variant="filled" severity="warning">
                                                {fallbackError}. If this persists, try reloading or run the app from a different network.
                                            </MuiAlert>
                                        </FetchMessage>}
                                    </>
                            }
                        />
                    </>
                }
            </Fieldset>
        </FormContainer>
    )
}

export default Form;