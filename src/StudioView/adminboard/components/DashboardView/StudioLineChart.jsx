import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const StudioLineChart = () => {
  // Sample data for studio projects over time
  const data = [
    { month: "Jan", projects: 12, completed: 8 },
    { month: "Feb", projects: 19, completed: 12 },
    { month: "Mar", projects: 15, completed: 10 },
    { month: "Apr", projects: 22, completed: 18 },
    { month: "May", projects: 18, completed: 15 },
    { month: "Jun", projects: 25, completed: 20 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="projects" 
            stroke="#3B82F6" 
            strokeWidth={2}
            name="Total Projects"
          />
          <Line 
            type="monotone" 
            dataKey="completed" 
            stroke="#10B981" 
            strokeWidth={2}
            name="Completed Projects"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudioLineChart;
