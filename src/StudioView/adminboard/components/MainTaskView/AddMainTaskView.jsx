import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAppStore from "../../../../store/appstore";
import SearchableDropdown from "../../../../UserView/components/UserLandingView/SearchableDropdown";
import axios from "axios";

const API_URL = `/api/maintask/addNewStudioMainTask`;

export default function AddMainTaskView() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { vendors, statuses, fetchVendors, fetchStatuses } = useAppStore();

  useEffect(() => {
    fetchVendors();
    fetchStatuses();
  }, []);

  const [form, setForm] = useState({
    main_task_name: "",
    vendor_id: "",
    task_total_cost: "",
    task_status: "",
    task_signup_amnt: "",
    task_inventroy_adv_amt: "",
    task_withhold_amt: "",
    task_balance_amt: "",
  });

  const [loading, setLoading] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Auto-calculate task_balance_amt
  useEffect(() => {
    const signupAmnt = parseFloat(form.task_signup_amnt) || 0;
    const inventroyAdvAmt = parseFloat(form.task_inventroy_adv_amt) || 0;
    const withholdAmt = parseFloat(form.task_withhold_amt) || 0;
    const totalCost = parseFloat(form.task_total_cost) || 0;

    const balanceAmt = totalCost - signupAmnt - inventroyAdvAmt - withholdAmt;
    
    setForm((prev) => ({
      ...prev,
      task_balance_amt: balanceAmt.toFixed(2)
    }));
  }, [form.task_signup_amnt, form.task_inventroy_adv_amt, form.task_withhold_amt, form.task_total_cost]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create payload in the required format
      const mainTaskData = [
        { key: "project_id", value: parseInt(projectId) },
        { key: "main_task_name", value: form.main_task_name },
        { key: "vendor_id", value: form.vendor_id },
        { key: "task_total_cost", value: parseFloat(form.task_total_cost) || 0 },
        { key: "task_status", value: parseInt(form.task_status) || 0 },
        { key: "task_signup_amnt", value: parseFloat(form.task_signup_amnt) || 0 },
        { key: "task_inventroy_adv_amt", value: parseFloat(form.task_inventroy_adv_amt) || 0 },
        { key: "task_withhold_amt", value: parseFloat(form.task_withhold_amt) || 0 },
        { key: "task_balance_amt", value: parseFloat(form.task_balance_amt) || 0 },
      ];

      const payload = { mainTaskData };

      console.log("Sending request to:", API_URL);
      console.log("Payload:", payload);

      const response = await axios.post(API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Response received:", response.data);

      alert("Main task added successfully!");
      
      // Navigate back to the main tasks page
      navigate(`/base/studio/AdminBoard/projects/${projectId}/tasks`);

    } catch (err) {
      console.error("Error submitting form:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      alert("Failed to add main task. Check console for details. Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/base/studio/AdminBoard/projects/${projectId}/tasks`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-200">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Add New Main Task</h2>
                <p className="text-gray-600 mt-2">Project ID: {projectId}</p>
              </div>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ← Back to Tasks
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main Task Name */}
              <div className="md:col-span-2">
                <label className="block mb-2 font-semibold text-gray-700">
                  Main Task Name *
                </label>
                <input
                  type="text"
                  name="main_task_name"
                  value={form.main_task_name}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter main task name"
                  required
                />
              </div>

              {/* Vendor */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Vendor *
                </label>
                <SearchableDropdown
                  options={vendors.map((vendor) => ({
                    value: vendor.vendor_id,
                    label: vendor.vendor_name,
                  }))}
                  value={form.vendor_id}
                  onChange={handleFormChange}
                  placeholder="Select Vendor"
                  name="vendor_id"
                  displayKey="label"
                  valueKey="value"
                />
              </div>

              {/* Task Status */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Task Status *
                </label>
                <select
                  name="task_status"
                  value={form.task_status}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Status</option>
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.status_code}
                    </option>
                  ))}
                </select>
              </div>

              {/* Total Cost */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Total Cost *
                </label>
                <input
                  type="number"
                  name="task_total_cost"
                  value={form.task_total_cost}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              {/* Signup Amount */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Signup Amount
                </label>
                <input
                  type="number"
                  name="task_signup_amnt"
                  value={form.task_signup_amnt}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>

              {/* Inventory Advance Amount */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Inventory Advance Amount
                </label>
                <input
                  type="number"
                  name="task_inventroy_adv_amt"
                  value={form.task_inventroy_adv_amt}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>

              {/* Withhold Amount */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Withhold Amount
                </label>
                <input
                  type="number"
                  name="task_withhold_amt"
                  value={form.task_withhold_amt}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>

              {/* Balance Amount (Auto-calculated) */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Balance Amount
                </label>
                <input
                  type="number"
                  name="task_balance_amt"
                  value={form.task_balance_amt}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-700"
                  placeholder="Auto-calculated"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-calculated: Total Cost - Signup - Inventory Advance - Withhold
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  loading
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Main Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
