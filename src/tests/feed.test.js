import { createElement } from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AuthProvider from "../components/auth-provider";
import { ENDPOINTS } from "../helper/endpoints";
import Feed from "../pages/feed";
import Login from "../pages/login";

let posts;

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
  posts = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url, options = {}) => {
      if (url === ENDPOINTS.login) {
        return jsonResponse({ token: "test-token" });
      }

      if (url === ENDPOINTS.posts && options.method === "POST") {
        const postData =
          options.body instanceof FormData
            ? Object.fromEntries(options.body.entries())
            : JSON.parse(options.body);
        const post = {
          post_id: posts.length + 1,
          title: postData.title,
          content: postData.content,
          visibility: postData.visibility,
          img_url: null,
          created_at: new Date().toISOString(),
          user_id: 1,
          username: "test-user",
        };

        posts.unshift(post);
        return jsonResponse(post, 201);
      }

      if (url === ENDPOINTS.posts) {
        return jsonResponse(posts);
      }

      throw new Error(`Unexpected request to ${url}`);
    }),
  );
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
