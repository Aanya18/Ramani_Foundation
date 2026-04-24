"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL, type Article } from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const token = Cookies.get("admin_token");
    const res = await fetch(`${API_URL}/admin/articles`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setArticles(await res.json());
    }
  };

  const handleEdit = (article: Article) => {
    setIsAdding(true);
    setEditingId(String(article.id));
    setTitle(article.title);
    setContent(article.content);
    setCategory(article.category ?? "");
    setImage(null);
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this news article?")) return;
    const token = Cookies.get("admin_token");
    const res = await fetch(`${API_URL}/admin/articles/${String(id)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      fetchArticles();
    } else {
      alert("Failed to delete article");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("admin_token");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (image) formData.append("image", image);

    const url = editingId
      ? `${API_URL}/admin/articles/${editingId}`
      : `${API_URL}/admin/articles`;

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    if (res.ok) {
      setIsAdding(false);
      setEditingId(null);
      // Reset form
      setTitle(""); setContent(""); setCategory(""); setImage(null);
      fetchArticles();
    } else {
      alert(editingId ? "Failed to update article" : "Failed to add article");
    }
  };

  const toggleForm = () => {
    if (isAdding) {
      setIsAdding(false);
      setEditingId(null);
      setTitle(""); setContent(""); setCategory(""); setImage(null);
    } else {
      setIsAdding(true);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-manrope font-bold text-primary">Manage News</h1>
        <Button onClick={toggleForm}>{isAdding ? "Cancel" : "Add News"}</Button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-border mb-8 space-y-4 font-publicSans">
          <div>
            <Label>Title</Label>
            <Input required value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Category</Label>
            <Input value={category} onChange={e => setCategory(e.target.value)} />
          </div>
          <div>
            <Label>Content</Label>
            <Textarea required value={content} onChange={e => setContent(e.target.value)} />
          </div>
          <div>
            <Label>Image (Optional)</Label>
            <Input type="file" onChange={e => setImage(e.target.files?.[0] || null)} />
          </div>
          <Button type="submit">{editingId ? "Update News" : "Save News"}</Button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <table className="w-full text-left font-publicSans">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="p-4 font-semibold">Title</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                <td className="p-4">{article.title}</td>
                <td className="p-4">{article.category}</td>
                <td className="p-4 text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(article)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(article.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
