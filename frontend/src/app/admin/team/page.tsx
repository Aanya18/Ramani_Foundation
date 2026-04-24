"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL, type TeamMember } from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";

export default function AdminTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    const token = Cookies.get("admin_token");
    const res = await fetch(`${API_URL}/admin/team`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setMembers(await res.json());
    }
  };

  const handleEdit = (member: TeamMember) => {
    setIsAdding(true);
    setEditingId(String(member.id));
    setName(member.name);
    setRole(member.role);
    setBio(member.bio ?? "");
    setImage(null);
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) return;
    const token = Cookies.get("admin_token");
    const res = await fetch(`${API_URL}/admin/team/${String(id)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      fetchTeam();
    } else {
      alert("Failed to delete team member");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("admin_token");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("role", role);
    formData.append("bio", bio);
    if (image) formData.append("image", image);

    const url = editingId
      ? `${API_URL}/admin/team/${editingId}`
      : `${API_URL}/admin/team`;

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
      setName(""); setRole(""); setBio(""); setImage(null);
      fetchTeam();
    } else {
      alert(editingId ? "Failed to update team member" : "Failed to add team member");
    }
  };

  const toggleForm = () => {
    if (isAdding) {
      setIsAdding(false);
      setEditingId(null);
      setName(""); setRole(""); setBio(""); setImage(null);
    } else {
      setIsAdding(true);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-manrope font-bold text-primary">Manage Team</h1>
        <Button onClick={toggleForm}>{isAdding ? "Cancel" : "Add Team Member"}</Button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-border mb-8 space-y-4 font-publicSans">
          <div>
            <Label>Name</Label>
            <Input required value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <Label>Role</Label>
            <Input required value={role} onChange={e => setRole(e.target.value)} />
          </div>
          <div>
            <Label>Bio</Label>
            <Textarea value={bio} onChange={e => setBio(e.target.value)} />
          </div>
          <div>
            <Label>Image (Optional)</Label>
            <Input type="file" onChange={e => setImage(e.target.files?.[0] || null)} />
          </div>
          <Button type="submit">{editingId ? "Update Member" : "Save Member"}</Button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <table className="w-full text-left font-publicSans">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                <td className="p-4">{member.name}</td>
                <td className="p-4">{member.role}</td>
                <td className="p-4 text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(member)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(member.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
