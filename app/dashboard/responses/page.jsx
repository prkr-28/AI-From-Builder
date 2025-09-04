"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/config";
import { forms, formResponses } from "@/config/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, User, BarChart3 } from "lucide-react";
import Link from "next/link";
import moment from "moment";

const AllResponsesPage = () => {
  const { user } = useUser();
  const [formsWithResponses, setFormsWithResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    user && GetAllFormsWithResponses();
  }, [user]);

  const GetAllFormsWithResponses = async () => {
    try {
      // Get all forms by user
      const userForms = await db
        .select()
        .from(forms)
        .where(eq(forms.createdBy, user?.primaryEmailAddress?.emailAddress));

      // Get response counts for each form
      const formsData = [];
      for (const form of userForms) {
        const responses = await db
          .select()
          .from(formResponses)
          .where(eq(formResponses.formId, form.id));
        
        const formData = JSON.parse(form.jsonform);
        formsData.push({
          ...form,
          formData,
          responseCount: responses.length,
          lastResponse: responses.length > 0 ? responses[responses.length - 1] : null
        });
      }

      setFormsWithResponses(formsData);
    } catch (error) {
      console.error("Error fetching forms and responses:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">All Responses</h2>
        <p className="text-gray-600">View responses from all your forms</p>
      </div>

      {formsWithResponses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
            <p className="text-gray-600 mb-4">Create your first form to start collecting responses</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {formsWithResponses.map((form) => (
            <Card key={form.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {form.formData.formTitle || "Untitled Form"}
                  </span>
                  <span className="flex items-center gap-4 text-sm font-normal text-gray-600">
                    <span className="flex items-center gap-1">
                      <BarChart3 className="w-4 h-4" />
                      {form.responseCount} responses
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Created {moment(form.createdAt).fromNow()}
                    </span>
                  </span>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {form.formData.formSubheading || "No description"}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {form.lastResponse ? (
                      <span>Last response: {moment(form.lastResponse.submittedAt).fromNow()}</span>
                    ) : (
                      <span>No responses yet</span>
                    )}
                  </div>
                  <Link href={`/responses/${form.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllResponsesPage;