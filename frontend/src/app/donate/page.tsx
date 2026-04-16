"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { API_URL } from "@/lib/api";

const formSchema = z.object({
  donor_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  amount: z.string().min(1, "Amount is required"),
  proof_image: z.any()
    .refine((file) => file?.length === 1, "Proof of payment is required.")
    .refine((file) => {
      if (!file || file.length === 0) return true; // skip validation if not required, but it is required above
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      return allowedTypes.includes(file[0].type);
    }, "Only .jpg, .png, and .webp formats are supported.")
});

export default function Donate() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      donor_name: "",
      email: "",
      amount: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("donor_name", values.donor_name);
      formData.append("email", values.email);
      formData.append("amount", values.amount);
      formData.append("proof_image", values.proof_image[0]);

      const res = await fetch(`${API_URL}/public/donations`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to submit donation proof");
      setSuccess(true);
      form.reset();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto py-16 px-4 max-w-4xl">
      <h1 className="text-4xl font-manrope font-bold text-primary mb-8 text-center">Support Our Cause</h1>
      <p className="text-center text-gray-600 mb-12 font-publicSans max-w-2xl mx-auto">
        Your generous contributions help us continue our mission to empower communities. Please transfer your donation using the details below and upload the proof of payment.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Payment Details */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-border flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-manrope font-bold text-primary mb-6">Bank Transfer details</h2>
          <div className="mb-6">
            <p className="font-publicSans text-gray-700"><strong>Bank Name:</strong> Global NGO Bank</p>
            <p className="font-publicSans text-gray-700"><strong>Account Name:</strong> Ramani Foundation</p>
            <p className="font-publicSans text-gray-700"><strong>Account Number:</strong> 1234567890</p>
            <p className="font-publicSans text-gray-700"><strong>Routing/SWIFT:</strong> GLBNG001</p>
          </div>
          <div className="w-48 h-48 bg-gray-200 border border-gray-300 flex items-center justify-center rounded-lg relative overflow-hidden">
             {/* Placeholder for QR Code */}
             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlN2U1ZTQiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2YjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5RUiBDb2RlIFBsYWNlaG9sZGVyPC90ZXh0Pjwvc3ZnPg==')] bg-cover bg-center"></div>
          </div>
          <p className="mt-4 text-sm text-gray-500 font-publicSans">Scan to donate via Mobile App</p>
        </div>

        {/* Upload Form */}
        <div>
          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-lg text-center h-full flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-4 font-manrope">Thank You for Your Generosity!</h3>
              <p className="font-publicSans">Your proof of payment has been submitted successfully. We will verify it shortly and send you a receipt.</p>
              <Button className="mt-8 bg-primary hover:bg-primary/90" onClick={() => setSuccess(false)}>Submit Another Donation</Button>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-border">
              <h2 className="text-2xl font-manrope font-bold text-primary mb-6">Submit Proof of Payment</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="donor_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Donation Amount</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. $100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proof_image"
                    render={({ field: { onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Proof of Payment (Image)</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/jpeg, image/png, image/webp"
                            onChange={(e) => onChange(e.target.files)}
                            {...fieldProps}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Proof"}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
