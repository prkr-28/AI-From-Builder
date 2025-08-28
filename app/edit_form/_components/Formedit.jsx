import { Edit, Trash } from "lucide-react";
import React, { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FormEdit = ({ defaultValue }) => {
  const [label, setLabel] = useState("");
  const [placeholder, setPlaceholder] = useState("");
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

          <div className="flex items-center justify-center pt-4">
            <Button size="sm">Update</Button>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger>
          <Trash className="w-4 h-4 text-gray-500 cursor-pointer" />
        </PopoverTrigger>
        <PopoverContent>
          <h2>Are you sure you want to delete this item?</h2>
          <div className="flex justify-end">
            <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-400 cursor-pointer">
              Delete
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FormEdit;
