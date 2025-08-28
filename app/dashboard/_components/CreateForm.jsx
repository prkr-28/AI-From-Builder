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

const CreateForm = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [formJson, setFormJson] = useState(null);

  const handleCreateForm = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: userInput }),
      });

      const data = await res.json();
      setFormJson(data.form);
      console.log("Generated Form JSON:", data.form);
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
