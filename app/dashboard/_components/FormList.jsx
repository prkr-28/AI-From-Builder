"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/config";
import { forms } from "@/config/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Share2, Trash2, BarChart3 } from "lucide-react";
import Link from "next/link";
import moment from "moment";

const FormList = () => {
  const { user } = useUser();
  const [formList, setFormList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    user && GetFormList();
  }, [user]);

  const GetFormList = async () => {
    try {
      const result = await db
        .select()
        .from(forms)
        .where(eq(forms.createdBy, user?.primaryEmailAddress?.emailAddress));
      
      setFormList(result);
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
    setLoading(false);
  };

  const deleteForm = async (formId) => {
    if (confirm("Are you sure you want to delete this form?")) {
      try {
        await db.delete(forms).where(eq(forms.id, formId));
        GetFormList(); // Refresh the list
      } catch (error) {
        console.error("Error deleting form:", error);
      }
    }
  };

  const copyShareLink = (formId) => {
    const shareUrl = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Share link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {formList.map((form) => {
        const formData = JSON.parse(form.jsonform);
        return (
          <div key={form.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {formData.formTitle || "Untitled Form"}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {formData.formSubheading || "No description"}
              </p>
              <p className="text-xs text-gray-500">
                Created {moment(form.createdAt).fromNow()}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href={`/edit_form/${form.id}`}>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </Link>
              
              <Link href={`/form/${form.id}`}>
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
              </Link>

              <Button 
                size="sm" 
                variant="outline"
                onClick={() => copyShareLink(form.id)}
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>

              <Link href={`/responses/${form.id}`}>
                <Button size="sm" variant="outline">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Responses
                </Button>
              </Link>

              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => deleteForm(form.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      })}

      {formList.length === 0 && !loading && (
        <div className="col-span-full text-center py-12">
          <div className="text-gray-400 mb-4">
            <Edit className="w-16 h-16 mx-auto mb-4 opacity-50" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
          <p className="text-gray-600 mb-4">Create your first AI-generated form to get started</p>
        </div>
      )}
    </div>
  );
};

export default FormList;