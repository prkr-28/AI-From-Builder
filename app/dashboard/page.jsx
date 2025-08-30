import React from "react";
import CreateForm from "./_components/CreateForm";
import FormList from "./_components/FormList";

const Dashboard = () => {
  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-bold text-3xl text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Manage your AI-generated forms</p>
        </div>
        <CreateForm />
      </div>
      <FormList />
    </div>
  );
};

export default Dashboard;
