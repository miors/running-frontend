import { useEffect, useState, useContext } from "react";
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
  const [imageUrl, setImageUrl] = useState("");

  function loadPosts() {
    return apiFetch(ENDPOINTS.posts)
      .then((data) => setPosts(Array.isArray(data) ? data : data.posts || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handlePost(e) {
    e.preventDefault();
    setError("");
    if (!title.trim()) return setError("Add a title");
    if (!content.trim()) return setError("Write something first");
    if (!visibility) return setError("Choose Public or Friends-only");

    setPosting(true);
    try {
      await apiFetch(ENDPOINTS.createPost, {
        method: "POST",
        body: JSON.stringify({ title, content, visibility }),
      });
      setTitle("");
      setContent("");
      setVisibility("");
      setImageUrl("");
      await loadPosts();
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Create a new post
        </h2>

        <form onSubmit={handlePost} className="space-y-4">
          <div>
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm font-medium"
            />
          </div>
          <div>
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm resize-none"
            />
          </div>
          <div>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                <input
                  type="radio"
                  name="visibility"
                  value="Public"
                  checked={visibility === "Public"}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                🌐 Public
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                <input
                  type="radio"
                  name="visibility"
                  value="Friends-only"
                  checked={visibility === "Friends-only"}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                👥 Friends only
              </label>
            </div>

            <button
              type="submit"
              disabled={posting}
              className="bg-indigo-600 text-white font-medium text-sm px-5 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm"
            >
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 text-rose-600 text-sm font-medium rounded-lg border border-rose-100">
            ⚠ {error}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Your Feed
        </h1>

        {loading && (
          <p className="text-center text-slate-500 text-sm py-8">
            Loading posts...
          </p>
        )}
        {!loading && posts.length === 0 && (
          <div className="text-center bg-white border border-slate-200 rounded-xl p-8 text-slate-500 text-sm shadow-sm">
            No posts yet. Connect with users to build your feed!
          </div>
        )}

        {posts.map((post) => (
          <article
            key={post.post_id}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {post.title}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
              {post.content}
            </p>
            <div className="flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-400 font-medium">
              <span className="text-indigo-600">
                @{post.username || "anonymous"}
              </span>
              <span>visibility: {post.visibility}</span>
              {post.created_at && (
                <>
                  <span>•</span>
                  <span>{new Date(post.created_at).toLocaleString()}</span>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
