import { formatINR } from "../currency";

describe("formatINR", () => {
  it("converts USD to INR and returns a string containing the INR value", () => {
    const result = formatINR(10);
    // 10 × 83 = 830
    expect(result).toMatch(/830/);
  });

  it("includes a currency symbol", () => {
    const result = formatINR(10);
    expect(result).toMatch(/₹|INR/);
  });

  it("handles zero", () => {
    const result = formatINR(0);
    expect(result).toMatch(/0/);
  });

  it("returns a string", () => {
    expect(typeof formatINR(25)).toBe("string");
  });

  it("is a pure function (same input → same output)", () => {
    expect(formatINR(25)).toBe(formatINR(25));
  });
});
