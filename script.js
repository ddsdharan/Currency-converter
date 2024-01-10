const apiUrl = "http://data.fixer.io/api/";
const symbols = "symbols";
const apiKey = "564c52274b85463985e1effa243f8c19";

fetch(`${apiUrl}${symbols}?access_key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        const selectElement01 = document.getElementById('inputGroupSelect01');
        const selectElement02 = document.getElementById('inputGroupSelect02');
        const currencyCodeElement01 = document.getElementById('currencyCode01');
        const currencyCodeElement02 = document.getElementById('currencyCode02');

        for (const symbol in data.symbols) {
            const option = document.createElement('option');
            option.value = symbol;
            option.textContent = `${symbol} - ${data.symbols[symbol]}`;
            selectElement01.appendChild(option);
        }

        selectElement01.addEventListener('change', (event) => {
            const selectedFSymbol = event.target.value;
            currencyCodeElement01.textContent = selectedFSymbol;
        })

        for (const symbol in data.symbols) {
            const option = document.createElement('option');
            option.value = symbol;
            option.textContent = `${symbol} - ${data.symbols[symbol]}`;
            selectElement02.appendChild(option);
        }

        selectElement02.addEventListener('change', (event) => {
            const selectedTSymbol = event.target.value;
            currencyCodeElement02.textContent = selectedTSymbol;
        })

        const button = document.getElementById('convertButton');
        button.addEventListener('click', handleConvert);

        function handleConvert() {
            const from = document.getElementById('currencyCode01').innerText;
            const to = document.getElementById('currencyCode02').innerText;
            const amount = document.getElementById('form-control01').value;
            const outputAmount = document.getElementById('form-control02');

            const latest = "latest";
            const convertUrl = `${apiUrl}${latest}?access_key=${apiKey}`;

            fetch(convertUrl)
                .then(response => response.json())
                .then(data => {
                    const exchangeRates = data.rates;

                    const timestamp = data.timestamp;
                    const formattedDateTime = convertTimestamp(timestamp);
                    console.log(formattedDateTime);
                    const dateTime = document.getElementById('date');
                    dateTime.textContent = "Last updated on " + formattedDateTime;

                    if (exchangeRates.hasOwnProperty(from) && exchangeRates.hasOwnProperty(to)) {
                        const convertedAmount = convertCurrency(amount, from, to, exchangeRates);
                        outputAmount.value = convertedAmount;
                    } else {
                        console.log("Currency conversion is not supported for the selected currencies.");
                    }
                })
                .catch(error => console.log('Error:', error));
        }
        function convertCurrency(amount, fromCurrency, toCurrency, exchangeRates) {
            const eurAmount = amount / exchangeRates[fromCurrency];
            const convertedAmount = eurAmount * exchangeRates[toCurrency];
            return convertedAmount;
        }
        function convertTimestamp(unixTimestamp) {
            const milliseconds = unixTimestamp * 1000;
            const dateObject = new Date(milliseconds);
            const formattedDateTime = dateObject.toLocaleString();
            return formattedDateTime;
        }
    })
    .catch(error => console.log('Error:', error));