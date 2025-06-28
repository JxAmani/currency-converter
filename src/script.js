const dropList = document.querySelectorAll(".drop-list select");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const getButton = document.querySelector("form button");
const exchangeRateTxt = document.querySelector(".exchange-rate");
const amountInput = document.querySelector(".amount input");

const countryCodeMap = {
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
// Load initial flags
dropList.forEach((select, i) => {
  for (let code in country_list) {
    let selected = (i === 0 && code === "USD") || (i === 1 && code === "NPR") ? "selected" : "";
    select.insertAdjacentHTML("beforeend", `<option value="${code}" ${selected}>${code}</option>`);
  }
  select.addEventListener("change", e => updateFlag(e.target));
});

// Update flag when currency changes
function updateFlag(element) {
  let code = element.value;
  let countryCode = country_list[code];
  let imgTag = element.parentElement.querySelector("img");
  imgTag.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}
// Swap currencies on icon click
exchangeIcon.addEventListener("click", () => {
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;
  updateFlag(fromCurrency);
  updateFlag(toCurrency);
  getExchangeRate();
});

// Fetch exchange rate on button click
exchangeBtn.addEventListener("click", e => {
  e.preventDefault();
  getExchangeRate();
});
// Fetch and update exchange rate
function getExchangeRate() {
  let amountVal = amountInput.value;
  if (amountVal === "" || isNaN(amountVal) || amountVal <= 0) {
    amountVal = 1;
    amountInput.value = "1";
  }
  exchangeRateTxt.innerText = "Getting exchange rate...";
  let from = fromCurrency.value;
  let to = toCurrency.value;

  // Use exchangerate.host free API
  let url = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amountVal}`;

  fetch(url)
    .then(res => res.json())
    .then(result => {
      if (result.result) {
        let totalExRate = result.result.toFixed(2);
        exchangeRateTxt.innerText = `${amountVal} ${from} = ${totalExRate} ${to}`;
      } else {
        exchangeRateTxt.innerText = "Unable to get exchange rate";
      }
    })
    .catch(() => {
      exchangeRateTxt.innerText = "Something went wrong";
    });
}

// Auto-load exchange rate on page load
window.addEventListener("load", () => {
  getExchangeRate();
});
