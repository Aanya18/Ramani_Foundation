import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { Mail, Phone } from "lucide-react";
import { toast } from "sonner";

interface ContactSubmission {
  id: string;
  type: string;
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  source?: string | null;
  is_active: boolean;
  created_at: string;
}

export const Route = createFileRoute("/admin/contacts")({
  component: AdminContacts,
});

function AdminContacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !localStorage.getItem("token")) {
      navigate({ to: "/admin/login" });
      return;
    }
    loadContacts();
  }, [navigate]);

  const loadContacts = async () => {
    try {
      const data = await api.getContactSubmissions();
      setContacts(data);
    } catch (error) {
      console.error("Failed to load contact submissions", error);
      toast.error("Failed to load contact submissions");
    }
  };

  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Contact Submissions</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Messages submitted through the public contact form.
        </p>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>
                  <div className="space-y-1 text-sm">
                    <a className="flex items-center gap-2 hover:underline" href={`mailto:${contact.email}`}>
                      <Mail className="size-4" />
                      {contact.email}
                    </a>
                    {contact.phone && (
                      <a className="flex items-center gap-2 hover:underline" href={`tel:${contact.phone}`}>
                        <Phone className="size-4" />
                        {contact.phone}
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell className="max-w-xl">
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                    {contact.message || "-"}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge variant={contact.is_active ? "default" : "secondary"}>
                    {contact.is_active ? "Active" : "Closed"}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(contact.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {contacts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No contact submissions yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
