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
import { ENDPOINTS } from "../helper/endpoints";
import Feed from "../pages/feed";
import Login from "../pages/login";

let testPostTitle;

afterEach(async () => {
  cleanup();
  const token = localStorage.getItem("token");
  localStorage.removeItem("token");

  if (token && testPostTitle) {
    const headers = { Authorization: `Bearer ${token}` };
    const response = await fetch(ENDPOINTS.posts, { headers });
    expect(response.ok).toBe(true);

    const body = await response.json();
    const data = body.data ?? body;
    const posts = Array.isArray(data) ? data : data.posts || [];
    const testPost = posts.find((post) => post.title === testPostTitle);

    if (testPost) {
      expect(testPost.post_id).toBeTruthy();

      const deleteResponse = await fetch(
        `${ENDPOINTS.posts}/${testPost.post_id}`,
        { method: "DELETE", headers },
      );

      if (!deleteResponse.ok) {
        const details = await deleteResponse.text();
        throw new Error(
          `DELETE /posts/${testPost.post_id} failed (${deleteResponse.status}): ${details}`,
        );
      }
    }
  }

  testPostTitle = null;
});

beforeEach(() => {
  localStorage.removeItem("token");
  testPostTitle = null;
});

test("logs in and creates a post in the feed", async () => {
  const h = createElement;
  const title = `Feed integration test ${Date.now()}`;
  testPostTitle = title;
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
