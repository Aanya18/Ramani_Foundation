import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { CheckCircle, Plus } from "lucide-react";

interface Donation {
  id: string;
  donor_name: string;
  email: string;
  amount: string;
  proof_image_url: string;
  verified: boolean;
  created_at: string;
}

export const Route = createFileRoute("/admin/donations")({
  component: AdminDonations,
});

function AdminDonations() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    donor_name: "",
    email: "",
    amount: "",
    proof_image: null as File | null,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !localStorage.getItem("token")) {
      navigate({ to: "/admin/login" });
      return;
    }
    loadDonations();
  }, [navigate]);

  const loadDonations = async () => {
    try {
      const data = await api.getAdminDonations();
      setDonations(data);
    } catch (error) {
      console.error("Failed to load donations", error);
    }
  };

  const handleVerify = async (id: string) => {
    try {
      await api.verifyDonation(id);
      loadDonations();
    } catch (error) {
      console.error("Failed to verify donation", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createDonation(form);
      loadDonations();
      setIsDialogOpen(false);
      setForm({ donor_name: "", email: "", amount: "", proof_image: null });
    } catch (error) {
      console.error("Failed to create donation", error);
    }
  };

  const openAddDialog = () => {
    setForm({ donor_name: "", email: "", amount: "", proof_image: null });
    setIsDialogOpen(true);
  };

  return (
    <div className="container-page py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Donations</h1>
        <Button onClick={openAddDialog}>
          <Plus className="size-4 mr-2" />
          Add Donation
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Donor Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Proof</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donations.map((donation) => (
            <TableRow key={donation.id}>
              <TableCell>{donation.donor_name}</TableCell>
              <TableCell>{donation.email}</TableCell>
              <TableCell>{donation.amount}</TableCell>
              <TableCell>
                <Badge variant={donation.verified ? "default" : "secondary"}>
                  {donation.verified ? "Verified" : "Pending"}
                </Badge>
              </TableCell>
              <TableCell>{new Date(donation.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <a href={donation.proof_image_url} target="_blank" rel="noopener noreferrer">
                  View Proof
                </a>
              </TableCell>
              <TableCell>
                {!donation.verified && (
                  <Button size="sm" onClick={() => handleVerify(donation.id)}>
                    <CheckCircle className="size-4 mr-2" />
                    Verify
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Donation</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="donor_name">Donor Name</Label>
              <Input
                id="donor_name"
                value={form.donor_name}
                onChange={(e) => setForm({ ...form, donor_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="proof_image">Proof Image</Label>
              <Input
                id="proof_image"
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, proof_image: e.target.files?.[0] || null })}
                required
              />
            </div>
            <Button type="submit">Add</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
