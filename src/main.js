import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436d99", "#2d57f2"],
    mastercard: ["#df6f29", "#c69347"],
    default: ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

const securityCode = document.querySelector("#security-code")
const securityCodePattern = { mask: "0000" }
const securityCodeMasked = IMask(securityCode, securityCodePattern)

securityCodeMasked.on("accept", () => {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText =
    securityCodeMasked.value.length > 0 ? securityCodeMasked.value : "123"
})

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

expirationDateMasked.on("accept", () => {
  const ccExpiration = document.querySelector(".cc-expiration .value")
  ccExpiration.innerText =
    expirationDateMasked.value.length > 0 ? expirationDateMasked.value : "12/26"
})

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    { mask: "0000 0000 0000 0000", regex: /^4\d{0,15}/, cardType: "visa" },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard",
    },
    { mask: "0000 0000 0000 0000", cardType: "default" },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")

    return dynamicMasked.compiledMasks.find(({ regex }) => number.match(regex))
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

cardNumberMasked.on("accept", () => {
  const ccNumber = document.querySelector(".cc-number")
  setCardType(cardNumberMasked.masked.currentMask.cardType)
  ccNumber.innerText =
    cardNumberMasked.value.length > 0
      ? cardNumberMasked.value
      : "1234 5678 9012 3456"
})

const cardHoler = document.querySelector("#card-holder")
cardHoler.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerText =
    cardHoler.value.length > 0 ? cardHoler.value : "fulano da silva"
})

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

window.setCardType = setCardType
