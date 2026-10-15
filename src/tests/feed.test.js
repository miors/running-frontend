import { createElement } from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, test } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AuthProvider from "../components/auth-provider";
import Feed from "../pages/feed";
import Login from "../pages/login";

afterEach(() => {
  cleanup();
  localStorage.removeItem("token");
});

beforeEach(() => {
  localStorage.removeItem("token");
});

test("logs in and creates a post in the feed", async () => {
  const h = createElement;
  const title = `Feed integration test ${Date.now()}`;
  const content = "Post created by the feed integration test.";

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
          h(Route, { path: "/feed", element: h(Feed) }),
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

  await screen.findByRole("heading", { name: "Your Feed" }, { timeout: 15000 });

  fireEvent.change(screen.getByPlaceholderText("Title"), {
    target: { value: title },
  });
  fireEvent.change(screen.getByPlaceholderText("What's on your mind?"), {
    target: { value: content },
  });
  fireEvent.click(screen.getByDisplayValue("Public"));
  fireEvent.click(screen.getByRole("button", { name: "Post" }));

  const postHeading = await screen.findByRole(
    "heading",
    { name: title },
    { timeout: 15000 },
  );
  const postArticle = postHeading.closest("article");

  expect(postArticle).toBeTruthy();
  expect(within(postArticle).getByText(content)).toBeTruthy();
}, 35000);
