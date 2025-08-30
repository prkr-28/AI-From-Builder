import { Edit, Trash } from "lucide-react";
import React, { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FormEdit = ({ defaultValue, onUpdate, onDelete }) => {
  const [label, setLabel] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [required, setRequired] = useState(defaultValue?.required || false);
  return (
    <div className="flex gap-2 ml-2">
      <Popover>
        <PopoverTrigger>
          <Edit className="w-4 h-4 text-gray-500 cursor-pointer" />
        </PopoverTrigger>
        <PopoverContent>
          <h2 className="text-xl text-primary">Edit Form</h2>
          <div>
            <label className="text-xs text-gray-700">Label name</label>
            <Input
              defaultValue={defaultValue?.label}
              onChange={(e) => setLabel(e.target.value)}
              type="text"
            />
          </div>

          <div>
            <label className="text-xs text-gray-700">Placeholder name</label>
            <Input
              defaultValue={defaultValue?.placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              type="text"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="required"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="required" className="text-xs text-gray-700">
              Required field
            </label>
          </div>
          <div className="flex items-center justify-center pt-4">
            <Button 
              onClick={() => onUpdate({ 
                label: label || defaultValue?.label, 
                placeholder: placeholder || defaultValue?.placeholder,
                required 
              })} 
              size="sm"
            >
              Update
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
            <h2 className="text-sm font-medium mb-3">Are you sure you want to delete this field?</h2>
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
