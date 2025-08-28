import React from "react";
import CreateForm from "./_components/CreateForm";

const Dashboard = () => {
  return (
    <div className="p-10 flex items-center justify-between">
      <h2 className="font-bold text-3xl">Dashboard</h2>
      <CreateForm />
    </div>
  );
};

export default Dashboard;
