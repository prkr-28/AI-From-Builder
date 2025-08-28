import { Button } from "@/components/ui/button";
import {
  LibraryBig,
  LineChart,
  MessageSquareQuote,
  Shield,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import React from "react";

const SideNav = () => {
  const menuList = [
    {
      id: 1,
      name: "My Forms",
      icon: LibraryBig,
      path: "/",
    },
    {
      id: 2,
      name: "Responses",
      icon: MessageSquareQuote,
      path: "/",
    },
    {
      id: 3,
      name: "Analytics",
      icon: LineChart,
      path: "/",
    },
    {
      id: 4,
      name: "Upgrade",
      icon: Shield,
      path: "/",
    },
  ];
  return (
    <div className="h-screen shadow-md border">
      <div className="p-5 cursor-pointer">
        {menuList.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 p-4 mb-3 hover:bg-primary hover:text-white hover:rounded-lg"
          >
            <item.icon className="w-5 h-5  mr-2" />
            <span>{item.name}</span>
          </li>
        ))}
      </div>
      <div className="fixed bottom-4 p-6 w-64">
        <Button className="w-full cursor-pointer">+ Create Form</Button>
        <div className="mt-7">
          <Progress value={50} />
          <h2 className="text-sm font-medium mt-2 text-gray-600">
            <strong>2</strong> Out of <strong>4</strong> Files Completed
          </h2>
          <h2 className="text-[13px] font-medium mt-2 text-gray-500">
            Upgrade your plan form unlimited AI Form
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
