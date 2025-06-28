const dropList = document.querySelectorAll(".drop-list select");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const getButton = document.querySelector("form button");
const exchangeRateTxt = document.querySelector(".exchange-rate");
const amountInput = document.querySelector(".amount input");
const exchangeIcon = document.querySelector(".icon i");  // swap icon

const country_list = {
  USD: "US",
  NPR: "NP",
  INR: "IN",
  PKR: "PK",
  MAD: "MA",
  EUR: "EU",
  GBP: "GB",
  JPY: "JP",
  AUD: "AU",
  CAD: "CA",
  CNY: "CN",
  KES: "KE"
};

// Populate currency dropdowns
dropList.forEach((select, index) => {
  for (let code in country_list) {
    let selected =
      (index === 0 && code === "USD") || (index === 1 && code === "NPR") ? "selected" : "";
    select.insertAdjacentHTML("beforeend", `<option value="${code}" ${selected}>${code}</option>`);
  }
  select.addEventListener("change", e => updateFlag(e.target));
});

// Update flag
function updateFlag(element) {
  const currencyCode = element.value;
  const countryCode = country_list[currencyCode];
  const imgTag = element.parentElement.querySelector("img");
  imgTag.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

// Swap currencies
exchangeIcon.addEventListener("click", () => {
  const tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;
  updateFlag(fromCurrency);
  updateFlag(toCurrency);
  getExchangeRate();
});

// Fetch exchange rate on button click
getButton.addEventListener("click", e => {
  e.preventDefault();
  getExchangeRate();
});

// Get exchange rate using open.er-api.com
function getExchangeRate() {
  let amountVal = amountInput.value.trim();
  if (amountVal === "" || isNaN(amountVal) || Number(amountVal) <= 0) {
    amountVal = 1;
    amountInput.value = "1";
  }
  exchangeRateTxt.innerText = "Getting exchange rate...";
  const from = fromCurrency.value;
  const to = toCurrency.value;

  const url = `https://open.er-api.com/v6/latest/${from}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log("API response:", data);
      if (data && data.result === "success" && data.rates[to]) {
        const rate = data.rates[to];
        const totalExRate = (amountVal * rate).toFixed(2);
        exchangeRateTxt.innerText = `${amountVal} ${from} = ${totalExRate} ${to}`;
      } else {
        exchangeRateTxt.innerText = "Unable to get exchange rate";
      }
    })
    .catch(err => {
      console.error("Fetch error:", err);
      exchangeRateTxt.innerText = "Something went wrong";
    });
}

// Load exchange rate when page loads
window.addEventListener("load", () => {
  getExchangeRate();
});
