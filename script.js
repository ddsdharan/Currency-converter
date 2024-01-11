document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "4296fc0083913d76db06b968"
    const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/codes`;
    const baseCodeSelect = document.getElementById("inputGroupSelect01");
    const targetCodeSelect = document.getElementById("inputGroupSelect02");
    const amountInput = document.getElementById("form-control01");
    const convertButton = document.getElementById("convertButton");
    const resetButton = document.getElementById("resetButton");
    const dateUpdated = document.getElementById("cardFooter");
    const card = document.querySelector(".card");
    const baseValue = document.getElementById("baseValue");
    const targetValue = document.getElementById("targetValue");
    const cardText = document.getElementById("card-text");

    card.style.display = "none";

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.result === "success") {
                data.supported_codes.forEach(code => {
                    const option = document.createElement("option");
                    option.value = code[0];
                    option.text = `${code[0]} - ${code[1]}`;
                    baseCodeSelect.appendChild(option);
                });
            }
            if (data.result === "success") {
                data.supported_codes.forEach(code => {
                    const option = document.createElement("option");
                    option.value = code[0];
                    option.text = `${code[0]} - ${code[1]}`;
                    targetCodeSelect.appendChild(option);
                });
            }
            else {
                console.error("Failed to fetch supported currency codes:", data.result);
            }
        })
        .catch(error => console.error("Error fetching supported currency codes:", error));

    baseCodeSelect.addEventListener("change", function () {
        const selectedBaseCode = baseCodeSelect.value;
        document.getElementById("currencyCode01").textContent = selectedBaseCode;
    });

    convertButton.addEventListener("click", function () {
        const baseCode = baseCodeSelect.value;
        const targetCode = targetCodeSelect.value;
        const amount = amountInput.value;

        if (!baseCode || !targetCode || !amount) {
            alert("Please select both base and target currencies, and enter the amount.");
            return;
        }
        const convertUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${baseCode}/${targetCode}/${amount}`;
        fetch(convertUrl)
            .then(response => response.json())
            .then(data => {
                if (data.result === "success") {
                    const dateTimeParts = data.time_last_update_utc.split(" ");
                    dateUpdated.textContent = `Last updated: ${dateTimeParts[0]} ${dateTimeParts[1]} ${dateTimeParts[2]} ${dateTimeParts[3]}`;
                    baseValue.textContent = `${amountInput.value} ${baseCode}`;
                    targetValue.textContent = `${data.conversion_result} ${targetCode}`;
                    cardText.textContent = `One ${baseCode} = ${data.conversion_rate} ${targetCode}`;
                    card.style.display = "block";
                }
                else {
                    console.error("Conversion failed:", data.result);
                    alert("Conversion failed. Please try again.");
                }
            })
            .catch(error => console.error("Error fetching conversion result:", error));
    });

    resetButton.addEventListener("click", function () {
        baseCodeSelect.value = "";
        targetCodeSelect.value = "";
        amountInput.value = "";
        card.style.display = "none";
    });
});
