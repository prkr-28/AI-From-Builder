"use client";

import { db } from "@/config";
import { forms } from "@/config/schema";
import { useUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import FormUi from "../_components/FormUi";
import FormController from "../_components/FormController";
import moment from "moment";

const EditForm = () => {
  const { formid } = useParams();
  const { user } = useUser();
  const [jsonFormData, setJsonFormData] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    user && GetFormData();
  }, [user]);

  const GetFormData = async () => {
    try {
      const res = await db
        .select()
        .from(forms)
        .where(
          and(
            eq(forms.id, formid),
            eq(forms.createdBy, user?.primaryEmailAddress?.emailAddress)
          )
        );

      if (res.length > 0) {
        console.log("Form data:", JSON.parse(res[0].jsonform));
        setJsonFormData(JSON.parse(res[0].jsonform));
      }
    } catch (error) {
      console.error("Error fetching form:", error);
    }
    setLoading(false);
  };

  const updateFormInDb = async (updatedForm) => {
    try {
      await db
        .update(forms)
        .set({
          jsonform: JSON.stringify(updatedForm),
          updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        })
        .where(eq(forms.id, formid));
      
      setJsonFormData(updatedForm);
      setUpdateTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Error updating form:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="md:col-span-2 h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10">
      <h2
        onClick={() => router.back()}
        className="flex gap-2 my-5 cursor-pointer hover:font-semibold transition-all items-center"
      >
        <ArrowLeft />
        Back
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <FormController 
            jsonForm={jsonFormData} 
            updateForm={updateFormInDb}
            formId={formid}
          />
        </div>
        <div className="md:col-span-2 border rounded-lg p-5 overflow-y-auto">
          <div className="max-w-3xl mx-auto w-full">
            {jsonFormData && (
              <FormUi 
                jsonform={jsonFormData} 
                editable={true}
                onUpdate={updateFormInDb}
                key={updateTrigger}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditForm;