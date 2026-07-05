import React from "react";
import { render, screen, act } from "@testing-library/react";
import ToastContainer, { showToast } from "../Toast";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("ToastContainer", () => {
  it("renders nothing when there are no toasts", () => {
    const { container } = render(<ToastContainer />);
    expect(container.firstChild).toBeNull();
  });

  it("shows a toast when showToast is called", () => {
    render(<ToastContainer />);

    act(() => {
      showToast("Added to Wishlist");
    });

    expect(screen.getByText("Added to Wishlist")).toBeInTheDocument();
  });

  it("auto-removes toast after 2 seconds", () => {
    render(<ToastContainer />);

    act(() => {
      showToast("Test message");
    });

    expect(screen.getByText("Test message")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2100);
    });

    expect(screen.queryByText("Test message")).not.toBeInTheDocument();
  });

  it("can show multiple toasts", () => {
    render(<ToastContainer />);

    act(() => {
      showToast("First");
      showToast("Second");
    });

    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });
});
