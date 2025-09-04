"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/config";
import { forms } from "@/config/schema";
import { eq } from "drizzle-orm";
import { useParams } from "next/navigation";
import FormUi from "../../edit_form/_components/FormUi";
import { CheckCircle, AlertCircle } from "lucide-react";

const PublicForm = () => {
  const { formid } = useParams();
  const [jsonFormData, setJsonFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    GetFormData();
  }, []);

  const GetFormData = async () => {
    try {
      const res = await db
        .select()
        .from(forms)
        .where(eq(forms.id, formid));

      if (res.length > 0) {
        setJsonFormData(JSON.parse(res[0].jsonform));
      } else {
        setError("Form not found");
      }
    } catch (error) {
      console.error("Error fetching form:", error);
      setError("Error loading form");
    }
    setLoading(false);
  };

  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleCheckboxChange = (fieldName, value, isChecked) => {
    setFormData((prev) => {
      if (!value) {
        return {
          ...prev,
          [fieldName]: isChecked,
        };
      }

      const currentValues = prev[fieldName] || [];
      if (isChecked) {
        return {
          ...prev,
          [fieldName]: [...currentValues, value],
        };
      } else {
        return {
          ...prev,
          [fieldName]: currentValues.filter((v) => v !== value),
        };
      }
    });
  };

  const handleSubmit = async (submittedFormData) => {
    setSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formId: formid,
          formData: submittedFormData,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Network error. Please try again.");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-gray-600 mb-6">Your response has been submitted successfully.</p>
          <p className="text-sm text-gray-500">You can now close this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {jsonFormData && (
          <FormUi 
            jsonform={jsonFormData} 
            editable={false}
            onFormSubmit={handleSubmit}
            formData={formData}
            onInputChange={handleInputChange}
            onCheckboxChange={handleCheckboxChange}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  );
};

export default PublicForm;