import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import axios from "axios";
import { afterEach, expect, test, vi } from "vitest";
import Home from "./page";

afterEach(cleanup);

// Mock axios
vi.mock("axios");
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
};

const mockUserStats = {
  totalCount: 10,
  totalForks: 5,
  languages: {
    JavaScript: 3,
    TypeScript: 2,
  },
};

test("renders Home component", () => {
  render(<Home />);
  expect(screen.getByText("Home")).toBeDefined();
  expect(screen.getByText("User Name:")).toBeDefined();
});

test("displays error when username is not provided", async () => {
  render(<Home />);
  const button = screen.getByText("Go");
  fireEvent.click(button);

  await waitFor(() => {
    expect(screen.getByText("Please enter a user name")).toBeDefined();
  });
});

test("fetches and displays user stats", async () => {
  render(<Home />);
  mockedAxios.get.mockResolvedValueOnce({ data: mockUserStats });

  const input = screen.getByRole("textbox");
  const button = screen.getByText("Go");

  fireEvent.change(input, { target: { value: "testuser" } });
  fireEvent.click(button);

  await waitFor(() => {
    expect(screen.getByText("Total Repositories: 10")).toBeDefined();
    expect(screen.getByText("Total Forks: 5")).toBeDefined();
    expect(screen.getByText("Languages:")).toBeDefined();
    expect(screen.getByText("JavaScript: 3")).toBeDefined();
    expect(screen.getByText("TypeScript: 2")).toBeDefined();
  });
});

test("displays error when API call fails", async () => {
  render(<Home />);
  mockedAxios.get.mockRejectedValueOnce({
    response: {
      status: 404,
      data: "User not found",
    },
  });

  const input = screen.getByRole("textbox");
  const button = screen.getByText("Go");

  fireEvent.change(input, { target: { value: "unknownuser" } });
  fireEvent.click(button);

  await waitFor(() => {
    expect(screen.getByText("User not found")).toBeDefined();
  });
});
