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

const CreateForm = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const handleCreateForm = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: userInput }),
      });

      const data = await res.json(); // ✅ parse JSON properly

      if (data?.form) {
        const resp = await db
          .insert(forms)
          .values({
            jsonform: JSON.stringify(data.form), // ✅ store JSON safely
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
          })
          .returning({ id: forms.id });

        console.log("new form id:", resp);
      }

      console.log("Generated Form JSON (parsed):", data);
    } catch (err) {
      console.error("Error generating form:", err);
    }
    setLoading(false);
    setOpenDialog(false);
  };

  return (
    <div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button
            className="cursor-pointer"
            onClick={() => setOpenDialog(true)}
          >
            + Create Form
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
            <DialogDescription>
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="my-2"
                placeholder="Enter form description..."
              />
              <div className="flex gap-2 my-3 justify-end">
                <Button
                  variant="destructive"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateForm} disabled={loading}>
                  {loading ? "Generating..." : "Create"}
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateForm;
