import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAppStore from "../../../../store/appstore";
import SearchableDropdown from "../../../../UserView/components/UserLandingView/SearchableDropdown";
import axios from "axios";
import { API_BASE, apiPrefixes } from "../../../../config/apiPath";

const API_URL = `${API_BASE}/${apiPrefixes.subtask}/addNewStudioSubTask`;

export default function AddSubtaskView() {
  const { projectId, mainTaskId } = useParams();
  const navigate = useNavigate();
  const { vendors, statuses, fetchVendors, fetchStatuses } = useAppStore();

  console.log("AddSubtaskView rendered with projectId:", projectId, "mainTaskId:", mainTaskId);

  useEffect(() => {
    fetchVendors();
    fetchStatuses();
  }, []);

  const [form, setForm] = useState({
    sub_task_name: "",
    sub_task_description: "",
    vendor_id: "",
    percent_complete: "",
    approver_id: "",
    week_no: "",
    approval_status: "",
    subtask_cost: "",
    subtask_approved_amount: "",
  });

  const [loading, setLoading] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Auto-calculate subtask_approved_amount based on percent_complete
  useEffect(() => {
    const cost = parseFloat(form.subtask_cost) || 0;
    const percent = parseFloat(form.percent_complete) || 0;
    
    const approvedAmount = (cost * percent) / 100;
    
    setForm((prev) => ({
      ...prev,
      subtask_approved_amount: approvedAmount.toFixed(2)
    }));
  }, [form.subtask_cost, form.percent_complete]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create payload in the required format
      const subTaskData = [
        { key: "main_task", value: parseInt(mainTaskId) },
        { key: "vendor_id", value: form.vendor_id },
        { key: "percent_complete", value: parseFloat(form.percent_complete) || 0 },
        { key: "approver_id", value: form.approver_id },
        { key: "sub_task_name", value: form.sub_task_name },
        { key: "sub_task_description", value: form.sub_task_description },
        { key: "week_no", value: parseInt(form.week_no) || 0 },
        { key: "approval_status", value: parseInt(form.approval_status) || 0 },
        { key: "subtask_cost", value: parseFloat(form.subtask_cost) || 0 },
        { key: "subtask_approved_amount", value: parseFloat(form.subtask_approved_amount) || 0 },
      ];

      const payload = { subTaskData };

      console.log("Sending request to:", API_URL);
      console.log("Payload:", payload);

      const response = await axios.post(API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Response received:", response.data);

      alert("Subtask added successfully!");
      
      // Navigate back to the main task page
      navigate(`/base/studio/AdminBoard/projects/${projectId}/tasks/${mainTaskId}`);

    } catch (err) {
      console.error("Error submitting form:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      alert("Failed to add subtask. Check console for details. Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/base/studio/AdminBoard/projects/${projectId}/tasks/${mainTaskId}`);
  };

  // Generate week options (1-52)
  const weekOptions = Array.from({ length: 52 }, (_, i) => ({
    value: i + 1,
    label: `Week ${i + 1}`
  }));

  // Debug: Check if component is rendering
  if (!projectId || !mainTaskId) {
    return (
      <div className="min-h-screen bg-red-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-800">Missing Parameters</h1>
          <p className="text-red-600">Project ID: {projectId}</p>
          <p className="text-red-600">Main Task ID: {mainTaskId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-200">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Add New Subtask</h2>
                <p className="text-gray-600 mt-2">Project ID: {projectId} | Main Task ID: {mainTaskId}</p>
              </div>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ← Back to Main Task
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subtask Name */}
              <div className="md:col-span-2">
                <label className="block mb-2 font-semibold text-gray-700">
                  Subtask Name *
                </label>
                <input
                  type="text"
                  name="sub_task_name"
                  value={form.sub_task_name}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter subtask name"
                  required
                />
              </div>

              {/* Subtask Description */}
              <div className="md:col-span-2">
                <label className="block mb-2 font-semibold text-gray-700">
                  Subtask Description *
                </label>
                <textarea
                  name="sub_task_description"
                  value={form.sub_task_description}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter subtask description"
                  rows="3"
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

              {/* Approver */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Approver *
                </label>
                <SearchableDropdown
                  options={vendors.map((vendor) => ({
                    value: vendor.vendor_id,
                    label: vendor.vendor_name,
                  }))}
                  value={form.approver_id}
                  onChange={handleFormChange}
                  placeholder="Select Approver"
                  name="approver_id"
                  displayKey="label"
                  valueKey="value"
                />
              </div>

              {/* Week Number */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Week Number *
                </label>
                <SearchableDropdown
                  options={weekOptions}
                  value={form.week_no}
                  onChange={handleFormChange}
                  placeholder="Select Week"
                  name="week_no"
                  displayKey="label"
                  valueKey="value"
                />
              </div>

              {/* Approval Status */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Approval Status *
                </label>
                <select
                  name="approval_status"
                  value={form.approval_status}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

              {/* Percent Complete */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Percent Complete *
                </label>
                <input
                  type="number"
                  name="percent_complete"
                  value={form.percent_complete}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  max="100"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Enter percentage (0-100)</p>
              </div>

              {/* Subtask Cost */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Subtask Cost *
                </label>
                <input
                  type="number"
                  name="subtask_cost"
                  value={form.subtask_cost}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              {/* Approved Amount (Auto-calculated) */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Approved Amount
                </label>
                <input
                  type="number"
                  name="subtask_approved_amount"
                  value={form.subtask_approved_amount}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-700"
                  placeholder="Auto-calculated"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-calculated: (Cost × Percent Complete) ÷ 100
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
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Subtask"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
