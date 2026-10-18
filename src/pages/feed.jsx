import { useCallback, useEffect, useState, useContext, useRef } from "react";
import { ENDPOINTS } from "../helper/endpoints";
import AuthContext from "../context/AuthContext";

export default function Feed() {
  const { apiFetch } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("");
  const [posting, setPosting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const imageInputRef = useRef(null);

  const loadPosts = useCallback(() => {
    return apiFetch(ENDPOINTS.posts)
      .then((data) => setPosts(Array.isArray(data) ? data : data.posts || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [apiFetch]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  async function handlePost(e) {
    e.preventDefault();
    setError("");
    if (!title.trim()) return setError("Add a title");
    if (!content.trim()) return setError("Write something first");
    if (!visibility) return setError("Choose Public or Friends-only");
    if (imageFile && !imageFile.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (imageFile && imageFile.size > 2 * 1024 * 1024) {
      setError("Image must be 2 MB or smaller.");
      return;
    }
    setPosting(true);
    try {
      let body;

      if (imageFile) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("visibility", visibility);
        formData.append("image", imageFile);
        body = formData;
      } else {
        body = JSON.stringify({ title, content, visibility });
      }

      await apiFetch(ENDPOINTS.createPost, {
        method: "POST",
        body,
      });

      setTitle("");
      setContent("");
      setVisibility("");
      setImageFile(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      await loadPosts();
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="feed-page">
      <section className="feed-hero" aria-labelledby="feed-title">
        <div className="feed-hero__copy">
          <p className="eyebrow">RUNNING FRIENDS CLUB</p>
          <h1 id="feed-title">Your Feed</h1>
          <p>
            Good miles are better shared. Catch up with your running community.
          </p>
        </div>
      </section>

      <div className="feed-layout">
        <section className="compose-panel" aria-labelledby="compose-title">
          <div className="panel-heading">
            <p className="section-kicker">YOUR NEXT UPDATE</p>
            <h2 id="compose-title">Share a run</h2>
            <p>Tell your people what’s happening out there.</p>
          </div>

          <form onSubmit={handlePost} className="post-form">
            <div className="field-group">
              <label className="field-label" htmlFor="post-title">
                Title
              </label>
              <input
                id="post-title"
                className="field-input"
                placeholder="A short headline"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="post-content">
                Your update
              </label>
              <textarea
                id="post-content"
                className="field-textarea"
                placeholder="How did the run go?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
              />
            </div>

            <div className="field-group">
              <span className="field-label">Add a photo</span>
              <label className="upload-control" htmlFor="post-image">
                <span className="upload-copy">
                  {imageFile ? imageFile.name : "Choose an image"}
                  <small>JPG, PNG or WebP · up to 2 MiB</small>
                </span>
                <input
                  ref={imageInputRef}
                  id="post-image"
                  className="file-input"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setImageFile(event.target.files?.[0] ?? null)
                  }
                />
              </label>
            </div>

            <div className="visibility-row">
              <span className="field-label">Who can see this?</span>
              <div className="visibility-choices">
                <label className="visibility-option">
                  <input
                    type="radio"
                    name="visibility"
                    value="Public"
                    checked={visibility === "Public"}
                    onChange={(e) => setVisibility(e.target.value)}
                  />
                  Public
                </label>
                <label className="visibility-option">
                  <input
                    type="radio"
                    name="visibility"
                    value="Friends-only"
                    checked={visibility === "Friends-only"}
                    onChange={(e) => setVisibility(e.target.value)}
                  />
                  Friends only
                </label>
              </div>
            </div>

            <button
              className="button-primary publish-button"
              type="submit"
              disabled={posting}
            >
              <span aria-hidden="true">+</span>
              {posting ? "Publishing..." : "Publish update"}
            </button>
          </form>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
        </section>

        <section className="feed-stream" aria-labelledby="stream-title">
          <div className="stream-heading">
            <h2 id="stream-title">Community feed</h2>
            <span className="stream-label">Latest updates</span>
          </div>

          {loading && (
            <div className="loading-state" role="status">
              <p>Loading your community feed...</p>
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="empty-state">
              <strong>A fresh start.</strong>
              <p>Your community’s updates will show up here.</p>
            </div>
          )}

          <div className="post-list">
            {posts.map((post) => (
              <article key={post.post_id} className="post-card">
                <div className="post-author-row">
                  <span className="post-avatar" aria-hidden="true">
                    {(post.username || "A").slice(0, 1).toUpperCase()}
                  </span>
                  <div className="post-author">
                    <strong>@{post.username || "anonymous"}</strong>
                    {post.created_at && (
                      <span className="post-date">
                        {new Date(post.created_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="visibility-badge">{post.visibility}</span>
                </div>
                <h3>{post.title}</h3>
                <p className="post-content">{post.content}</p>
                {post.img_url && (
                  <img
                    className="post-image"
                    src={post.img_url}
                    alt={`Image for ${post.title}`}
                  />
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
