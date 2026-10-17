import { createElement } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AuthProvider from "../components/auth-provider";
import Login from "../pages/login";

function jsonResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

afterEach(() => {
  cleanup();
  localStorage.removeItem("token");
  vi.unstubAllGlobals();
});

beforeEach(() => {
  localStorage.removeItem("token");
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(jsonResponse({ token: "test-token" })),
  );
});

test("logs in and navigates to the feed", async () => {
  const h = createElement;

  render(
    h(
      AuthProvider,
      null,
      h(
        MemoryRouter,
        { initialEntries: ["/login"] },
        h(
          Routes,
          null,
          h(Route, { path: "/login", element: h(Login) }),
          h(Route, {
            path: "/feed",
            element: h("p", null, "Login completed"),
          }),
        ),
      ),
    ),
  );

  fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
    target: { value: "demo8@gmail.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "demo8" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Log in" }));

  expect(
    await screen.findByText("Login completed", {}, { timeout: 15000 }),
  ).toBeTruthy();
  expect(localStorage.getItem("token")).toBeTruthy();
}, 20000);
