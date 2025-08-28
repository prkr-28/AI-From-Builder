"use client";

import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import FormEdit from "./Formedit";

const FormUi = ({ jsonform }) => {
  const [formData, setFormData] = useState({});

  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleCheckboxChange = (fieldName, value, isChecked) => {
    setFormData((prev) => {
      // If it's a single checkbox (not in options array)
      if (!value) {
        return {
          ...prev,
          [fieldName]: isChecked,
        };
      }

      // For multiple checkboxes
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
    console.log("Form Data:", formData);
    // Here you would typically send the data to your API
  };

  // Helper function to extract value and label from option
  const getOptionData = (option, index) => {
    if (typeof option === "object" && option !== null) {
      return {
        value:
          option.value && option.value.trim() !== ""
            ? option.value
            : `option-${index}`,
        label: option.label || option.value || `Option ${index + 1}`,
      };
    } else {
      return {
        value:
          option && option.toString().trim() !== ""
            ? option.toString()
            : `option-${index}`,
        label: option || `Option ${index + 1}`,
      };
    }
  };

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
      <form className="space-y-5" onSubmit={handleSubmit}>
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
                <label className="text-sm flex gap-1 items-center font-medium text-gray-700">
                  {field?.label}
                  {field.required && <span className="text-red-500"> *</span>}
                  <div>
                    <FormEdit defaultValue={field} />
                  </div>
                </label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange(field.fieldName, value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={field?.placeholder || "Select option"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {field?.options?.map((option, i) => {
                      const { value, label } = getOptionData(option, i);
                      return (
                        <SelectItem key={i} value={value}>
                          {label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            );
          }

          // ✅ Checkbox Field - Handle both single and multiple checkboxes
          if (field.fieldType === "checkbox") {
            // If it's a single checkbox (like terms acceptance)
            if (!field.options || field.options.length === 0) {
              return (
                <div className="flex gap-1 items-center" key={index}>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={field.fieldName}
                      checked={formData[field.fieldName] || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(field.fieldName, null, checked)
                      }
                      required={field.required}
                    />
                    <Label
                      htmlFor={field.fieldName}
                      className="text-sm font-medium text-gray-700"
                    >
                      <span
                        dangerouslySetInnerHTML={{ __html: field?.label }}
                      />
                      {field.required && (
                        <span className="text-red-500"> *</span>
                      )}
                    </Label>
                  </div>

                  <div>
                    <FormEdit defaultValue={field} />
                  </div>
                </div>
              );
            }

            // If it's multiple checkboxes
            return (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex gap-1 items-center">
                  <label className="text-sm font-medium text-gray-700">
                    {field?.label}
                    {field.required && <span className="text-red-500"> *</span>}
                  </label>
                  <div>
                    <FormEdit defaultValue={field} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {field.options.map((option, i) => {
                    const { value, label } = getOptionData(option, i);
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <Checkbox
                          id={`${field.fieldName}-${i}`}
                          value={value}
                          checked={(formData[field.fieldName] || []).includes(
                            value
                          )}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(
                              field.fieldName,
                              value,
                              checked
                            )
                          }
                        />
                        <Label htmlFor={`${field.fieldName}-${i}`}>
                          {label}
                        </Label>
                      </div>
                    );
                  })}
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
                  {field.required && <span className="text-red-500"> *</span>}
                </label>
                <RadioGroup
                  onValueChange={(value) =>
                    handleInputChange(field.fieldName, value)
                  }
                >
                  {field?.options?.map((option, i) => {
                    const { value, label } = getOptionData(option, i);
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <RadioGroupItem
                          value={value}
                          id={`${field.fieldName}-${i}`}
                        />
                        <Label htmlFor={`${field.fieldName}-${i}`}>
                          {label}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            );
          }

          // ✅ Textarea Field
          if (field.fieldType === "textarea") {
            return (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex gap-1 items-center">
                  <label className="text-sm font-medium text-gray-700">
                    {field?.label}
                    {field.required && <span className="text-red-500"> *</span>}
                  </label>
                  <div>
                    <FormEdit defaultValue={field} />
                  </div>
                </div>
                <Textarea
                  placeholder={field?.placeholder}
                  value={formData[field.fieldName] || ""}
                  onChange={(e) =>
                    handleInputChange(field.fieldName, e.target.value)
                  }
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            );
          }

          // ✅ Default: Input field
          return (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex gap-1 items-center">
                <label className="text-sm font-medium text-gray-700">
                  {field?.label}
                  {field.required && <span className="text-red-500"> *</span>}
                </label>
                <div>
                  <FormEdit defaultValue={field} />
                </div>
              </div>
              <Input
                type={field?.fieldType || "text"}
                placeholder={field?.placeholder}
                value={formData[field.fieldName] || ""}
                onChange={(e) =>
                  handleInputChange(field.fieldName, e.target.value)
                }
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
