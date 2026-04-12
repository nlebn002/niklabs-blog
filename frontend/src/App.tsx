import { FormEvent, useEffect, useState } from "react";
import { deletePost, getAdminPosts, getPublishedPosts, savePost } from "./api";
import type { Post, UpsertPostRequest } from "./types";

const emptyForm: UpsertPostRequest = {
  title: "",
  excerpt: "",
  contentMarkdown: "",
  coverImageUrl: "",
  isPublished: true
};

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [adminPosts, setAdminPosts] = useState<Post[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | undefined>();
  const [form, setForm] = useState<UpsertPostRequest>(emptyForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadPublicPosts() {
    try {
      setPosts(await getPublishedPosts());
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function loadAdminPosts() {
    try {
      setAdminPosts(await getAdminPosts());
      setMessage("Admin posts loaded.");
      setError("");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    void loadPublicPosts();
  }, []);

  const selectedPost = adminPosts.find((post) => post.id === selectedPostId);

  useEffect(() => {
    if (!selectedPost) {
      setForm(emptyForm);
      return;
    }

    setForm({
      title: selectedPost.title,
      excerpt: selectedPost.excerpt,
      contentMarkdown: selectedPost.contentMarkdown,
      coverImageUrl: selectedPost.coverImageUrl ?? "",
      isPublished: selectedPost.isPublished
    });
  }, [selectedPost]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    try {
      await savePost(form, selectedPostId);
      setMessage(selectedPostId ? "Post updated." : "Post created.");
      setSelectedPostId(undefined);
      setForm(emptyForm);
      await Promise.all([loadPublicPosts(), loadAdminPosts()]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(postId: string) {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      await deletePost(postId);
      setMessage("Post deleted.");
      if (selectedPostId === postId) {
        setSelectedPostId(undefined);
        setForm(emptyForm);
      }
      await Promise.all([loadPublicPosts(), loadAdminPosts()]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(217,119,6,0.16),transparent_34%),linear-gradient(180deg,_#f8f5ee,_#fffef9)] text-ink">
      <main className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-10 lg:px-10">
        <section className="grid gap-6 rounded-[2rem] border border-amber-200/60 bg-white/80 p-8 shadow-card backdrop-blur lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.3em] text-clay">niklabs.cloud</p>
            <h1 className="max-w-2xl text-5xl font-black leading-tight">
              Shipping notes, experiments, and lessons from the lab.
            </h1>
            <p className="max-w-2xl text-lg text-slate-600">
              A lean MVP blog with a .NET backend, PostgreSQL, and an admin panel in the same page.
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-ink p-6 text-slate-100">
            <h2 className="text-xl font-semibold">Admin panel</h2>
            <p className="mt-2 text-sm text-slate-300">
              Manage posts directly while the backend stays simplified.
            </p>
            <button
              className="mt-4 rounded-full bg-clay px-5 py-3 font-semibold text-white transition hover:brightness-95"
              onClick={() => void loadAdminPosts()}
              disabled={busy}
            >
              Load admin posts
            </button>
          </div>
        </section>

        {(error || message) && (
          <section
            className={`rounded-2xl border px-5 py-4 text-sm ${
              error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {error || message}
          </section>
        )}

        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <h2 className="text-2xl font-bold">Published posts</h2>
            {posts.length === 0 && (
              <div className="rounded-2xl border border-fog bg-white p-6 text-slate-500">
                No published posts yet.
              </div>
            )}

            {posts.map((post) => (
              <article key={post.id} className="overflow-hidden rounded-[1.5rem] border border-fog bg-white shadow-card">
                {post.coverImageUrl && (
                  <img src={post.coverImageUrl} alt={post.title} className="h-56 w-full object-cover" />
                )}
                <div className="space-y-3 p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-pine">
                    {post.publishedAtUtc ? new Date(post.publishedAtUtc).toLocaleDateString() : "Draft"}
                  </p>
                  <h3 className="text-2xl font-bold">{post.title}</h3>
                  <p className="text-slate-600">{post.excerpt}</p>
                  <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {post.contentMarkdown}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="space-y-6">
            <section className="rounded-[1.5rem] border border-fog bg-white p-6 shadow-card">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{selectedPostId ? "Edit post" : "Create post"}</h2>
                <button
                  className="text-sm font-semibold text-pine"
                  onClick={() => {
                    setSelectedPostId(undefined);
                    setForm(emptyForm);
                  }}
                  type="button"
                >
                  Reset
                </button>
              </div>

              <form className="mt-5 space-y-4" onSubmit={(event) => void onSubmit(event)}>
                <input
                  className="w-full rounded-xl border border-fog px-4 py-3"
                  placeholder="Title"
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                />
                <textarea
                  className="min-h-24 w-full rounded-xl border border-fog px-4 py-3"
                  placeholder="Excerpt"
                  value={form.excerpt}
                  onChange={(event) => setForm({ ...form, excerpt: event.target.value })}
                />
                <textarea
                  className="min-h-56 w-full rounded-xl border border-fog px-4 py-3"
                  placeholder="Markdown content"
                  value={form.contentMarkdown}
                  onChange={(event) => setForm({ ...form, contentMarkdown: event.target.value })}
                />
                <input
                  className="w-full rounded-xl border border-fog px-4 py-3"
                  placeholder="Cover image URL"
                  value={form.coverImageUrl}
                  onChange={(event) => setForm({ ...form, coverImageUrl: event.target.value })}
                />
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(event) => setForm({ ...form, isPublished: event.target.checked })}
                  />
                  Publish immediately
                </label>
                <button
                  className="rounded-full bg-ink px-5 py-3 font-semibold text-white"
                  disabled={busy}
                  type="submit"
                >
                  {busy ? "Saving..." : selectedPostId ? "Update post" : "Create post"}
                </button>
              </form>
            </section>

            <section className="rounded-[1.5rem] border border-fog bg-white p-6 shadow-card">
              <h2 className="text-2xl font-bold">Admin posts</h2>
              <div className="mt-4 space-y-3">
                {adminPosts.length === 0 && <p className="text-sm text-slate-500">Load admin posts to manage content.</p>}
                {adminPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between gap-3 rounded-2xl border border-fog p-4">
                    <div>
                      <p className="font-semibold">{post.title}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        {post.isPublished ? "Published" : "Draft"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="rounded-full border border-pine px-4 py-2 text-sm font-semibold text-pine"
                        type="button"
                        onClick={() => setSelectedPostId(post.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-600"
                        type="button"
                        onClick={() => void onDelete(post.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
