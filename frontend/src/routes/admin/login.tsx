import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/api";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      if (typeof window !== 'undefined') {
        localStorage.setItem("token", data.access_token);
      }
      navigate({ to: "/admin/dashboard" });
    } catch {
      setError("Invalid credentials");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-soft">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Username</Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoggingIn}
                autoComplete="username"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoggingIn}
                autoComplete="current-password"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
