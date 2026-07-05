import "@testing-library/jest-dom";

// Node 14's limited ICU data doesn't support maximumFractionDigits: 0 for
// currency formatting. Polyfill Intl.NumberFormat to avoid RangeError in tests.
const OriginalNumberFormat = Intl.NumberFormat;
const IntlProxy = new Proxy(OriginalNumberFormat, {
  construct(_target, args) {
    const [locale, opts] = args;
    if (
      opts &&
      opts.style === "currency" &&
      typeof opts.maximumFractionDigits === "number" &&
      opts.maximumFractionDigits < 2
    ) {
      return new OriginalNumberFormat(locale, {
        ...opts,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    }
    return new OriginalNumberFormat(locale, opts);
  },
});
Intl.NumberFormat = IntlProxy;
