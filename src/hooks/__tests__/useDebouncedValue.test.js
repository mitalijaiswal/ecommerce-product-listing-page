import { renderHook, act } from "@testing-library/react";
import { useDebouncedValue } from "../useDebouncedValue";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("useDebouncedValue", () => {
  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("does not update the value before the delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: "a", delay: 300 } }
    );

    rerender({ value: "b", delay: 300 });
    act(() => jest.advanceTimersByTime(200));

    expect(result.current).toBe("a");
  });

  it("updates the value after the delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: "a", delay: 300 } }
    );

    rerender({ value: "b", delay: 300 });
    act(() => jest.advanceTimersByTime(300));

    expect(result.current).toBe("b");
  });

  it("resets the timer when value changes rapidly", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: "a", delay: 300 } }
    );

    rerender({ value: "b", delay: 300 });
    act(() => jest.advanceTimersByTime(200));

    rerender({ value: "c", delay: 300 });
    act(() => jest.advanceTimersByTime(200));

    // "b" should never have appeared — timer was reset
    expect(result.current).toBe("a");

    act(() => jest.advanceTimersByTime(100));
    expect(result.current).toBe("c");
  });
});
