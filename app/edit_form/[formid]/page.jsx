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
  const [jsonFormData, setJsonFormData] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const router = useRouter();

  useEffect(() => {
    user && GetFormData();
  }, [user]);

  const GetFormData = async () => {
    const res = await db
      .select()
      .from(forms)
      .where(
        and(
          eq(forms.id, formid),
          eq(forms.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
      );

    console.log(JSON.parse(res[0].jsonform));

    setJsonFormData(JSON.parse(res[0].jsonform));
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
        <div className="md:col-span-2 border rounded-lg p-5  overflow-y-auto">
          <div className="max-w-3xl mx-auto w-full">
            <FormUi 
              jsonform={jsonFormData} 
              editable={true}
              onUpdate={updateFormInDb}
              key={updateTrigger}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditForm;
