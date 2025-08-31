"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import { db } from "@/config";
import { forms } from "@/config/schema";
import moment from "moment";
import { useRouter } from "next/navigation";
import { Plus, Sparkles } from "lucide-react";

const CreateForm = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const handleCreateForm = async () => {
    if (!userInput.trim()) {
      alert("Please enter a form description");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: userInput }),
      });

      const data = await res.json();

      if (data?.form && !data.form.error) {
        const resp = await db
          .insert(forms)
          .values({
            jsonform: JSON.stringify(data.form),
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
          })
          .returning({ id: forms.id });

        if (resp[0].id) {
          router.push(`/edit_form/${resp[0].id}`);
        }
      } else {
        alert("Error generating form. Please try again.");
      }
    } catch (err) {
      console.error("Error generating form:", err);
      alert("Error generating form. Please try again.");
    }
    setLoading(false);
    setOpenDialog(false);
    setUserInput("");
  };

  return (
    <div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button
            className="cursor-pointer"
            onClick={() => setOpenDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Form
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Create New Form
            </DialogTitle>
            <DialogDescription>
              Describe the form you want to create and our AI will generate it for you.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="min-h-[100px]"
              placeholder="Example: Create a contact form with name, email, phone, and message fields..."
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateForm} disabled={loading}>
                {loading ? "Generating..." : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateForm;