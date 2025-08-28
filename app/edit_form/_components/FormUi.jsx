"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const FormUi = ({ jsonform }) => {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-2xl">
      {/* Title */}
      <h2 className="font-bold text-center text-3xl text-primary mb-2">
        {jsonform.formTitle}
      </h2>
      <h3 className="text-sm text-gray-500 text-center mb-6">
        {jsonform.formSubheading}
      </h3>

      {/* Form Fields */}
      <form className="space-y-5">
        {jsonform?.fields?.map((field, index) => {
          // ✅ Section Header
          if (field.fieldType === "section_header") {
            return (
              <div key={index} className="pt-6">
                <h3 className="text-[22px] font-semibold text-gray-800">
                  {field?.label}
                </h3>
                {field?.description && (
                  <p className="text-sm text-gray-500">{field.description}</p>
                )}
                <hr className="my-3 border-gray-200" />
              </div>
            );
          }

          // ✅ Select Field
          if (field.fieldType === "select") {
            return (
              <div key={index} className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  {field?.label}
                </label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={field?.placeholder || "Select option"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {field?.options?.map((option, i) => {
                      const safeValue =
                        option?.toString().trim() || `option-${i}`; // ✅ prevent empty value
                      return (
                        <SelectItem key={i} value={safeValue}>
                          {option || `Option ${i + 1}`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            );
          }

          // ✅ Checkbox Field
          if (field.fieldType === "checkbox") {
            return (
              <div key={index} className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  {field?.label}
                </label>
                <div className="flex flex-col gap-2">
                  {field?.options?.map((option, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Checkbox id={`${field.name}-${i}`} />
                      <Label htmlFor={`${field.name}-${i}`}>
                        {option || `Option ${i + 1}`}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // ✅ Radio Field
          if (field.fieldType === "radio") {
            return (
              <div key={index} className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  {field?.label}
                </label>
                <RadioGroup>
                  {field?.options?.map((option, i) => {
                    const safeValue = option?.toString().trim() || `radio-${i}`;
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <RadioGroupItem
                          value={safeValue}
                          id={`${field.name}-${i}`}
                        />
                        <Label htmlFor={`${field.name}-${i}`}>
                          {option || `Option ${i + 1}`}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            );
          }

          // ✅ Default: Input field
          return (
            <div key={index} className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                {field?.label}
              </label>
              <Input
                type={field?.type || "text"}
                placeholder={field?.placeholder}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          );
        })}

        {/* Submit button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-primary text-white font-medium py-2 rounded-lg hover:bg-primary/90 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormUi;
