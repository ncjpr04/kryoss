"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Contact, ContactsResponse } from "@/lib/types";
import { ContactFormData } from "@/lib/validations";
import api from "@/lib/api";
import { ContactList } from "@/components/ContactList";
import { ContactForm } from "@/components/ContactForm";
import { DeleteDialog } from "@/components/DeleteDialog";
import { SearchBar } from "@/components/SearchBar";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, LogOut, User } from "lucide-react";

export default function HomePage() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteContact, setDeleteContact] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user, page, search, sortBy, sortOrder]);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const response = await api.contacts.list({
        page,
        limit: 10,
        search,
        sortBy,
        sortOrder,
      });
      const data: ContactsResponse = response.data;
      setContacts(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (error: any) {
      const message = error.response?.data?.error?.message || "Failed to fetch contacts";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateContact = async (formData: ContactFormData) => {
    try {
      setIsSaving(true);
      await api.contacts.create(formData);
      toast.success("Contact created successfully");
      setIsFormOpen(false);
      fetchContacts();
    } catch (error: any) {
      const message = error.response?.data?.error?.message || "Failed to create contact";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateContact = async (formData: ContactFormData) => {
    if (!editingContact) return;

    try {
      setIsSaving(true);
      await api.contacts.update(editingContact.id, formData);
      toast.success("Contact updated successfully");
      setEditingContact(null);
      fetchContacts();
    } catch (error: any) {
      const message = error.response?.data?.error?.message || "Failed to update contact";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteContact = async () => {
    if (!deleteContact) return;

    try {
      setIsDeleting(true);
      await api.contacts.delete(deleteContact.id);
      toast.success("Contact deleted successfully");
      setDeleteContact(null);
      fetchContacts();
    } catch (error: any) {
      const message = error.response?.data?.error?.message || "Failed to delete contact";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contacts Manager</h1>
            <p className="text-muted-foreground mt-1">
              Manage your contacts efficiently
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span>{user.name}</span>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchBar
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />
          <Button onClick={() => setIsFormOpen(true)} className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>

        {/* Contact List */}
        <ContactList
          contacts={contacts}
          onEdit={setEditingContact}
          onDelete={setDeleteContact}
          isLoading={isLoading}
        />

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            isLoading={isLoading}
          />
        )}

        {/* Create Contact Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <ContactForm
              mode="create"
              onSubmit={handleCreateContact}
              isLoading={isSaving}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Contact Dialog */}
        <Dialog open={!!editingContact} onOpenChange={() => setEditingContact(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Contact</DialogTitle>
            </DialogHeader>
            {editingContact && (
              <ContactForm
                mode="edit"
                initialData={{
                  name: editingContact.name,
                  email: editingContact.email,
                  phone: editingContact.phone,
                }}
                onSubmit={handleUpdateContact}
                isLoading={isSaving}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        {deleteContact && (
          <DeleteDialog
            open={!!deleteContact}
            onClose={() => setDeleteContact(null)}
            onConfirm={handleDeleteContact}
            contactName={deleteContact.name}
            isDeleting={isDeleting}
          />
        )}
      </div>
    </div>
  );
}
