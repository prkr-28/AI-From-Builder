import { Button } from "@/components/ui/button";
import {
  LibraryBig,
  LineChart,
  MessageSquareQuote,
  Shield,
  Plus,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SideNav = () => {
  const pathname = usePathname();

  const menuList = [
    {
      id: 1,
      name: "My Forms",
      icon: LibraryBig,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Responses",
      icon: MessageSquareQuote,
      path: "/dashboard/responses",
    },
    {
      id: 3,
      name: "Analytics",
      icon: LineChart,
      path: "/dashboard/analytics",
    },
    {
      id: 4,
      name: "Upgrade",
      icon: Shield,
      path: "/dashboard/upgrade",
    },
  ];

  return (
    <div className="h-screen shadow-md border">
      <div className="p-5 cursor-pointer">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-primary">FormAI</span>
          </div>
        </div>

        {menuList.map((item) => (
          <Link href={item.path} key={item.id}>
            <li
              className={`flex items-center gap-3 p-4 mb-3 hover:bg-primary hover:text-white hover:rounded-lg transition-all cursor-pointer ${
                pathname === item.path ? 'bg-primary text-white rounded-lg' : ''
              }`}
            >
              <item.icon className="w-5 h-5 mr-2" />
              <span>{item.name}</span>
            </li>
          </Link>
        ))}
      </div>
      
      <div className="fixed bottom-4 p-6 w-64">
        <Link href="/dashboard">
          <Button className="w-full cursor-pointer mb-4">
            <Plus className="w-4 h-4 mr-2" />
            Create Form
          </Button>
        </Link>
        
        <div className="mt-7">
          <Progress value={75} />
          <h2 className="text-sm font-medium mt-2 text-gray-600">
            <strong>3</strong> Out of <strong>4</strong> Forms Used
          </h2>
          <h2 className="text-[13px] font-medium mt-2 text-gray-500">
            Upgrade your plan for unlimited AI Forms
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SideNav;