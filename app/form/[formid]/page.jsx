"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/config";
import { forms, formResponses } from "@/config/schema";
import { eq } from "drizzle-orm";
import { useParams } from "next/navigation";
import FormUi from "../../edit_form/_components/FormUi";
import moment from "moment";
import { CheckCircle } from "lucide-react";

const PublicForm = () => {
  const { formid } = useParams();
  const [jsonFormData, setJsonFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      }
    } catch (error) {
      console.error("Error fetching form:", error);
    }
    setLoading(false);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await db.insert(formResponses).values({
        formId: formid,
        jsonResponse: JSON.stringify(formData),
        submittedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!jsonFormData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h1>
          <p className="text-gray-600">The form you're looking for doesn't exist.</p>
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
          <p className="text-gray-600">Your response has been submitted successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <PublicFormUi 
          jsonform={jsonFormData} 
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </div>
    </div>
  );
};

const PublicFormUi = ({ jsonform, onSubmit, submitting }) => {
  const [formData, setFormData] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getOptionData = (option, index) => {
    if (typeof option === "object" && option !== null) {
      return {
        value: option.value && option.value.trim() !== "" ? option.value : `option-${index}`,
        label: option.label || option.value || `Option ${index + 1}`,
      };
    } else {
      return {
        value: option && option.toString().trim() !== "" ? option.toString() : `option-${index}`,
        label: option || `Option ${index + 1}`,
      };
    }
  };

  return (
    <FormUi 
      jsonform={jsonform} 
      editable={false}
      onFormSubmit={handleSubmit}
      formData={formData}
      onInputChange={handleInputChange}
      onCheckboxChange={handleCheckboxChange}
      submitting={submitting}
    />
  );
};

export default PublicForm;