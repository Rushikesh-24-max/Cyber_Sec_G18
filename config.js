// Change ONLY the relevant flag to true, then stop and restart npm start.
// false = deliberately vulnerable; true = mitigation enabled.
// No browser switch: the implementation is selected here in the source code.
module.exports = Object.freeze({
  sqlInjection: true,
  commandInjection: false,
  reflectedXss: false,
  storedXss: false,
  csrf: false,
});
