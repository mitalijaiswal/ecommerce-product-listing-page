import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "../Pagination";

describe("Pagination", () => {
  it("renders nothing when totalPages is 1", () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} onPageChange={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders Prev and Next buttons", () => {
    render(<Pagination page={1} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByText("Prev")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("disables Prev button on first page", () => {
    render(<Pagination page={1} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByText("Prev")).toBeDisabled();
    expect(screen.getByText("Next")).not.toBeDisabled();
  });

  it("disables Next button on last page", () => {
    render(<Pagination page={5} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByText("Next")).toBeDisabled();
    expect(screen.getByText("Prev")).not.toBeDisabled();
  });

  it("highlights the current page button", () => {
    render(<Pagination page={3} totalPages={5} onPageChange={() => {}} />);
    const currentPageBtn = screen.getByText("3");
    expect(currentPageBtn.className).toContain("bg-pink-600");
  });

  it("calls onPageChange with correct page when clicking a page button", async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();
    render(<Pagination page={1} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByText("2"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with page-1 on Prev click", async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();
    render(<Pagination page={3} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByText("Prev"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with page+1 on Next click", async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();
    render(<Pagination page={3} totalPages={5} onPageChange={onPageChange} />);

    await user.click(screen.getByText("Next"));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("shows ellipsis for large page gaps", () => {
    render(<Pagination page={1} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByText("…")).toBeInTheDocument();
  });
});
