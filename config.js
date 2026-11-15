// Change ONLY the relevant flag to true, then stop and restart npm start.
// false = deliberately vulnerable; true = mitigation enabled.
module.exports = Object.freeze({
  sqlInjection: false,
  commandInjection: true,
  reflectedXss: false,
  storedXss: false,
  csrf: true,
});
