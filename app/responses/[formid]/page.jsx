"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/config";
import { forms, formResponses } from "@/config/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Eye, Calendar, User, FileText, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import moment from "moment";

const ResponsesPage = () => {
  const { formid } = useParams();
  const { user } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    user && GetFormAndResponses();
  }, [user]);

  const GetFormAndResponses = async () => {
    try {
      // Get form data
      const formResult = await db
        .select()
        .from(forms)
        .where(
          and(
            eq(forms.id, formid),
            eq(forms.createdBy, user?.primaryEmailAddress?.emailAddress)
          )
        );

      if (formResult.length > 0) {
        setFormData(JSON.parse(formResult[0].jsonform));
      }

      // Get responses
      const responsesResult = await db
        .select()
        .from(formResponses)
        .where(eq(formResponses.formId, formid));

      setResponses(responsesResult);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const exportToCSV = () => {
    if (responses.length === 0) return;

    const headers = formData?.fields?.map(field => field.label || field.fieldName) || [];
    const csvContent = [
      ["Submission Date", ...headers].join(","),
      ...responses.map(response => {
        const responseData = JSON.parse(response.jsonResponse);
        const row = [
          moment(response.submittedAt).format("YYYY-MM-DD HH:mm:ss"),
          ...headers.map(header => {
            const fieldName = formData.fields.find(f => f.label === header)?.fieldName;
            const value = responseData[fieldName];
            return Array.isArray(value) ? value.join("; ") : (value || "");
          })
        ];
        return row.map(cell => `"${cell}"`).join(",");
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData?.formTitle || 'form'}_responses.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/form/${formid}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Share link copied to clipboard!");
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2
            onClick={() => router.back()}
            className="flex gap-2 items-center cursor-pointer hover:text-primary transition-all text-2xl font-bold"
          >
            <ArrowLeft className="w-6 h-6" />
            Form Responses
          </h2>
          <p className="text-gray-600 mt-1">
            {formData?.formTitle || "Untitled Form"} • {responses.length} responses
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={exportToCSV} disabled={responses.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Link href={`/form/${formid}`}>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              View Form
            </Button>
          </Link>
          <Button variant="outline" onClick={copyShareLink}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Form
          </Button>
        </div>
      </div>

      {responses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No responses yet</h3>
            <p className="text-gray-600 mb-4">Share your form to start collecting responses</p>
            <Button onClick={copyShareLink}>
              <Share2 className="w-4 h-4 mr-2" />
              Copy Share Link
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {responses.map((response, index) => {
            const responseData = JSON.parse(response.jsonResponse);
            return (
              <Card key={response.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Response #{responses.length - index}
                    </span>
                    <span className="flex items-center gap-2 text-sm font-normal text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {moment(response.submittedAt).format("MMM DD, YYYY HH:mm")}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {formData?.fields?.map((field, fieldIndex) => {
                      const value = responseData[field.fieldName];
                      if (value === undefined || value === null || value === "") return null;

                      return (
                        <div key={fieldIndex} className="border-b border-gray-100 pb-3 last:border-b-0">
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            {field.label}
                          </label>
                          <div className="text-gray-900">
                            {Array.isArray(value) ? (
                              <div className="flex flex-wrap gap-1">
                                {value.map((item, i) => (
                                  <span key={i} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                                    {item}
                                  </span>
                                ))}
                              </div>
                            ) : typeof value === "boolean" ? (
                              <span className={`px-2 py-1 rounded text-sm ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {value ? "Yes" : "No"}
                              </span>
                            ) : (
                              <span className="break-words">{value}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResponsesPage;