import {
  LibraryBig,
  LineChart,
  MessageSquareQuote,
  Shield,
} from "lucide-react";
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
      <div className="p-5">
        {menuList.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 p-4 hover:bg-primary hover:text-white hover:rounded-lg"
          >
            <item.icon className="w-5 h-5 mr-2" />
            <span>{item.name}</span>
          </li>
        ))}
      </div>
    </div>
  );
};

export default SideNav;
