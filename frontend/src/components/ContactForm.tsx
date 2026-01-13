"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ContactFormProps {
    onSubmit: (data: ContactFormData) => Promise<void>;
    initialData?: ContactFormData;
    isLoading?: boolean;
    mode: "create" | "edit";
}

export function ContactForm({ onSubmit, initialData, isLoading, mode }: ContactFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: initialData,
    });

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{mode === "create" ? "Add New Contact" : "Edit Contact"}</CardTitle>
                <CardDescription>
                    {mode === "create"
                        ? "Fill in the details to create a new contact"
                        : "Update the contact information"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            {...register("name")}
                            placeholder="John Doe"
                            aria-invalid={errors.name ? "true" : "false"}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            {...register("email")}
                            placeholder="john@example.com"
                            aria-invalid={errors.email ? "true" : "false"}
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                            id="phone"
                            {...register("phone")}
                            placeholder="+1234567890"
                            aria-invalid={errors.phone ? "true" : "false"}
                        />
                        {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={isLoading} className="flex-1">
                            {isLoading ? "Saving..." : mode === "create" ? "Create Contact" : "Update Contact"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
