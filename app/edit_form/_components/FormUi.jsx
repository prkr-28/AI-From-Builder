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
import { Button } from "@/components/ui/button";
import FormEdit from "./Formedit";

const FormUi = ({ 
  jsonform, 
  editable = false, 
  onUpdate, 
  selectedTheme = "default",
  onFormSubmit,
  formData: externalFormData,
  onInputChange: externalInputChange,
  onCheckboxChange: externalCheckboxChange,
  submitting = false
}) => {
  const [internalFormData, setInternalFormData] = useState({});

  // Use external form data if provided (for public forms), otherwise use internal state
  const formData = externalFormData || internalFormData;
  const handleInputChange = externalInputChange || ((fieldName, value) => {
    setInternalFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  });

  const handleCheckboxChange = externalCheckboxChange || ((fieldName, value, isChecked) => {
    setInternalFormData((prev) => {
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
  });

  const updateField = (index, updatedField) => {
    if (!editable || !onUpdate) return;
    
    const updatedFields = [...jsonform.fields];
    updatedFields[index] = { ...updatedFields[index], ...updatedField };
    
    const updatedForm = {
      ...jsonform,
      fields: updatedFields,
    };
    
    onUpdate(updatedForm);
  };

  const deleteField = (index) => {
    if (!editable || !onUpdate) return;
    
    const updatedFields = jsonform.fields.filter((_, i) => i !== index);
    const updatedForm = {
      ...jsonform,
      fields: updatedFields,
    };
    
    onUpdate(updatedForm);
  };

  const addNewField = () => {
    if (!editable || !onUpdate) return;
    
    const newField = {
      fieldName: `field_${Date.now()}`,
      fieldType: "text",
      label: "New Field",
      placeholder: "Enter value",
      required: false
    };
    
    const updatedForm = {
      ...jsonform,
      fields: [...(jsonform.fields || []), newField],
    };
    
    onUpdate(updatedForm);
  };

  const getThemeClasses = () => {
    const theme = jsonform?.theme || selectedTheme;
    const background = jsonform?.background || "white";
    const borderRadius = jsonform?.borderRadius || "rounded";
    const fontFamily = jsonform?.fontFamily || "default";
    
    let themeClass = "bg-white text-gray-900";
    let borderClass = "rounded-lg";
    let backgroundClass = "bg-white";
    let fontClass = "font-sans";
    
    switch (theme) {
      case "dark":
        themeClass = "bg-gray-900 text-white";
        break;
      case "blue":
        themeClass = "bg-blue-50 text-blue-900";
        break;
      case "green":
        themeClass = "bg-green-50 text-green-900";
        break;
      case "purple":
        themeClass = "bg-purple-50 text-purple-900";
        break;
    }
    
    switch (background) {
      case "gray":
        backgroundClass = "bg-gray-50";
        break;
      case "gradient":
        backgroundClass = "bg-gradient-to-br from-purple-50 to-blue-50";
        break;
    }
    
    switch (borderRadius) {
      case "sharp":
        borderClass = "rounded-none";
        break;
      case "extra-rounded":
        borderClass = "rounded-3xl";
        break;
    }

    switch (fontFamily) {
      case "serif":
        fontClass = "font-serif";
        break;
      case "mono":
        fontClass = "font-mono";
        break;
      case "sans":
        fontClass = "font-sans";
        break;
    }
    
    return `${themeClass} ${backgroundClass} ${borderClass} ${fontClass}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onFormSubmit) {
      onFormSubmit(formData);
    } else {
      console.log("Form Data:", formData);
    }
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

  if (!jsonform || !jsonform.fields) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <p className="text-gray-500">No form data available</p>
      </div>
    );
  }

  return (
    <div className={`max-w-2xl mx-auto p-8 shadow-lg border ${getThemeClasses()}`}>
      {/* Title */}
      <h2 className="font-bold text-center text-3xl mb-2" style={{ color: 'var(--primary)' }}>
        {jsonform.formTitle || "Untitled Form"}
      </h2>
      <h3 className="text-sm opacity-70 text-center mb-6">
        {jsonform.formSubheading || "Please fill out this form"}
      </h3>

      {/* Form Fields */}
      <form className="space-y-5" onSubmit={handleSubmit}>
        {jsonform?.fields?.map((field, index) => {
          // Section Header
          if (field.fieldType === "section_header") {
            return (
              <div key={index} className="pt-6">
                <h3 className="text-xl font-semibold">
                  {field?.label}
                </h3>
                {field?.description && (
                  <p className="text-sm opacity-70">{field.description}</p>
                )}
                <hr className="my-3 opacity-20" />
                {editable && (
                  <div className="flex justify-end">
                    <FormEdit 
                      defaultValue={field} 
                      onUpdate={(updatedField) => updateField(index, updatedField)}
                      onDelete={() => deleteField(index)}
                    />
                  </div>
                )}
              </div>
            );
          }

          // Select Field
          if (field.fieldType === "select") {
            return (
              <div key={index} className="flex flex-col gap-2">
                <label className="text-sm flex gap-1 items-center font-medium">
                  {field?.label}
                  {field.required && <span className="text-red-500"> *</span>}
                  {editable && (
                    <FormEdit 
                      defaultValue={field} 
                      onUpdate={(updatedField) => updateField(index, updatedField)}
                      onDelete={() => deleteField(index)}
                    />
                  )}
                </label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange(field.fieldName, value)
                  }
                  required={field.required}
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

          // Checkbox Field
          if (field.fieldType === "checkbox") {
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
                      className="text-sm font-medium"
                    >
                      {field?.label}
                      {field.required && (
                        <span className="text-red-500"> *</span>
                      )}
                    </Label>
                  </div>

                  {editable && (
                    <FormEdit 
                      defaultValue={field} 
                      onUpdate={(updatedField) => updateField(index, updatedField)}
                      onDelete={() => deleteField(index)}
                    />
                  )}
                </div>
              );
            }

            return (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex gap-1 items-center">
                  <label className="text-sm font-medium">
                    {field?.label}
                    {field.required && <span className="text-red-500"> *</span>}
                  </label>
                  {editable && (
                    <FormEdit 
                      defaultValue={field} 
                      onUpdate={(updatedField) => updateField(index, updatedField)}
                      onDelete={() => deleteField(index)}
                    />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {field.options.map((option, i) => {
                    const { value, label } = getOptionData(option, i);
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <Checkbox
                          id={`${field.fieldName}-${i}`}
                          value={value}
                          checked={(formData[field.fieldName] || []).includes(value)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(field.fieldName, value, checked)
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

          // Radio Field
          if (field.fieldType === "radio") {
            return (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex gap-1 items-center">
                  <label className="text-sm font-medium">
                    {field?.label}
                    {field.required && <span className="text-red-500"> *</span>}
                  </label>
                  {editable && (
                    <FormEdit 
                      defaultValue={field} 
                      onUpdate={(updatedField) => updateField(index, updatedField)}
                      onDelete={() => deleteField(index)}
                    />
                  )}
                </div>
                <RadioGroup
                  onValueChange={(value) =>
                    handleInputChange(field.fieldName, value)
                  }
                  required={field.required}
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

          // Textarea Field
          if (field.fieldType === "textarea") {
            return (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex gap-1 items-center">
                  <label className="text-sm font-medium">
                    {field?.label}
                    {field.required && <span className="text-red-500"> *</span>}
                  </label>
                  {editable && (
                    <FormEdit 
                      defaultValue={field} 
                      onUpdate={(updatedField) => updateField(index, updatedField)}
                      onDelete={() => deleteField(index)}
                    />
                  )}
                </div>
                <Textarea
                  placeholder={field?.placeholder}
                  value={formData[field.fieldName] || ""}
                  onChange={(e) =>
                    handleInputChange(field.fieldName, e.target.value)
                  }
                  required={field.required}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            );
          }

          // Default: Input field
          return (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex gap-1 items-center">
                <label className="text-sm font-medium">
                  {field?.label}
                  {field.required && <span className="text-red-500"> *</span>}
                </label>
                {editable && (
                  <FormEdit 
                    defaultValue={field} 
                    onUpdate={(updatedField) => updateField(index, updatedField)}
                    onDelete={() => deleteField(index)}
                  />
                )}
              </div>
              <Input
                type={field?.fieldType || "text"}
                placeholder={field?.placeholder}
                value={formData[field.fieldName] || ""}
                onChange={(e) =>
                  handleInputChange(field.fieldName, e.target.value)
                }
                required={field.required}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          );
        })}

        {/* Add Field Button for editable forms */}
        {editable && (
          <div className="pt-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={addNewField}
              className="w-full"
            >
              + Add Field
            </Button>
          </div>
        )}

        {/* Submit button for non-editable forms */}
        {!editable && (
          <div className="pt-4">
            <Button
              type="submit"
              disabled={submitting}
              className="w-full font-medium py-3 rounded-lg transition"
              style={{ 
                backgroundColor: 'var(--primary)', 
                color: 'var(--primary-foreground)' 
              }}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default FormUi;