import { Edit, Trash, Plus } from "lucide-react";
import React, { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormEdit = ({ defaultValue, onUpdate, onDelete }) => {
  const [label, setLabel] = useState(defaultValue?.label || "");
  const [placeholder, setPlaceholder] = useState(defaultValue?.placeholder || "");
  const [required, setRequired] = useState(defaultValue?.required || false);
  const [fieldType, setFieldType] = useState(defaultValue?.fieldType || "text");
  const [options, setOptions] = useState(defaultValue?.options || []);
  const [description, setDescription] = useState(defaultValue?.description || "");

  const fieldTypes = [
    { value: "text", label: "Text" },
    { value: "email", label: "Email" },
    { value: "number", label: "Number" },
    { value: "tel", label: "Phone" },
    { value: "textarea", label: "Textarea" },
    { value: "select", label: "Select" },
    { value: "radio", label: "Radio" },
    { value: "checkbox", label: "Checkbox" },
    { value: "date", label: "Date" },
    { value: "section_header", label: "Section Header" },
  ];

  const addOption = () => {
    setOptions([...options, { label: "", value: "" }]);
  };

  const updateOption = (index, field, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setOptions(updatedOptions);
  };

  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleUpdate = () => {
    const updatedField = {
      label,
      placeholder,
      required,
      fieldType,
      ...(fieldType === "section_header" && { description }),
      ...(["select", "radio", "checkbox"].includes(fieldType) && { options }),
    };
    onUpdate(updatedField);
  };

  return (
    <div className="flex gap-2 ml-2">
      <Popover>
        <PopoverTrigger>
          <Edit className="w-4 h-4 text-gray-500 cursor-pointer hover:text-primary" />
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <h2 className="text-lg font-semibold text-primary mb-4">Edit Field</h2>
          
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-gray-700">Field Type</Label>
              <Select value={fieldType} onValueChange={setFieldType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fieldTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-gray-700">Label</Label>
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter field label"
              />
            </div>

            {fieldType === "section_header" && (
              <div>
                <Label className="text-xs text-gray-700">Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter section description"
                  rows={2}
                />
              </div>
            )}

            {fieldType !== "section_header" && (
              <div>
                <Label className="text-xs text-gray-700">Placeholder</Label>
                <Input
                  value={placeholder}
                  onChange={(e) => setPlaceholder(e.target.value)}
                  placeholder="Enter placeholder text"
                />
              </div>
            )}

            {["select", "radio", "checkbox"].includes(fieldType) && (
              <div>
                <Label className="text-xs text-gray-700 mb-2 block">Options</Label>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        placeholder="Option label"
                        value={option.label || ""}
                        onChange={(e) => updateOption(index, "label", e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        value={option.value || ""}
                        onChange={(e) => updateOption(index, "value", e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(index)}
                      >
                        <Trash className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    className="w-full"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Option
                  </Button>
                </div>
              </div>
            )}

            {fieldType !== "section_header" && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={required}
                  onChange={(e) => setRequired(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="required" className="text-xs text-gray-700">
                  Required field
                </Label>
              </div>
            )}

            <Button onClick={handleUpdate} size="sm" className="w-full">
              Update Field
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {onDelete && (
        <Popover>
          <PopoverTrigger>
            <Trash className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700" />
          </PopoverTrigger>
          <PopoverContent>
            <h2 className="text-sm font-medium mb-3">Delete Field</h2>
            <p className="text-xs text-gray-600 mb-3">
              Are you sure you want to delete this field? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm">Cancel</Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={onDelete}
              >
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default FormEdit;