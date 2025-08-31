"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/config";
import { forms, formResponses } from "@/config/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Eye, Share2, Trash2, BarChart3, Copy, FileText } from "lucide-react";
import Link from "next/link";
import moment from "moment";

const FormList = () => {
  const { user } = useUser();
  const [formList, setFormList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responseCounts, setResponseCounts] = useState({});

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

      // Get response counts for each form
      const counts = {};
      for (const form of result) {
        const responses = await db
          .select()
          .from(formResponses)
          .where(eq(formResponses.formId, form.id));
        counts[form.id] = responses.length;
      }
      setResponseCounts(counts);
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
    setLoading(false);
  };

  const deleteForm = async (formId) => {
    if (confirm("Are you sure you want to delete this form? This will also delete all responses.")) {
      try {
        // Delete responses first
        await db.delete(formResponses).where(eq(formResponses.formId, formId));
        // Then delete the form
        await db.delete(forms).where(eq(forms.id, formId));
        GetFormList(); // Refresh the list
      } catch (error) {
        console.error("Error deleting form:", error);
        alert("Error deleting form. Please try again.");
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
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formList.map((form) => {
          const formData = JSON.parse(form.jsonform);
          const responseCount = responseCounts[form.id] || 0;
          
          return (
            <Card key={form.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  {formData.formTitle || "Untitled Form"}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {formData.formSubheading || "No description"}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Created {moment(form.createdAt).fromNow()}</span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {responseCount} responses
                  </span>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Link href={`/edit_form/${form.id}`}>
                    <Button size="sm" variant="outline" className="w-full">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  
                  <Link href={`/form/${form.id}`} target="_blank">
                    <Button size="sm" variant="outline" className="w-full">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                  </Link>

                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyShareLink(form.id)}
                    className="w-full"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy Link
                  </Button>

                  <Link href={`/responses/${form.id}`}>
                    <Button size="sm" variant="outline" className="w-full">
                      <BarChart3 className="w-4 h-4 mr-1" />
                      Responses
                    </Button>
                  </Link>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => deleteForm(form.id)}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete Form
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {formList.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
            <p className="text-gray-600 mb-4">Create your first AI-generated form to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FormList;