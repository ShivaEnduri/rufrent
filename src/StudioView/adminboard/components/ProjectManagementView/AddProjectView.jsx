import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import useAppStore from "../../../../store/appstore"; 
import SearchableDropdown from "../../../../UserView/components/UserLandingView/SearchableDropdown"; 
import axios from "axios";
import { API_BASE, apiPrefixes } from "../../../../config/apiPath";

const API_URL = `${API_BASE}/${apiPrefixes.project}/addstudioproject`;

export default function AddProjectView() {
  const { users, siteManagers, budgets, statuses, fetchUsersAndSiteManagers, fetchBudgets, fetchStatuses } = useAppStore();

  useEffect(() => {
     fetchUsersAndSiteManagers();
     fetchBudgets();
     fetchStatuses();
  }, []);

  // Close calendars when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.calendar-container')) {
        setShowSignupCalendar(false);
        setShowStartCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [currentStep, setCurrentStep] = useState(1);
  const [showSignupCalendar, setShowSignupCalendar] = useState(false);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [form, setForm] = useState({
    project_name: "",
    site_mgr_id: "",
    budget_cat: "",
    cust_id: "",
    cust_flat: "",
    cust_community: "",
    cust_address: "",
    total_cost: "",
    total_paid: "",
    total_balance: "",
    signup_date: "",
    signup_percentage: "",
    weeks_planned: "",
    weeks_buffer: "",
    weeks_total: "",
    tnt_start_date: "",
    est_end_date: "",
    current_status: "",
    documents_path: "",
  });


  const steps = [
    { id: 1, title: "Basic Information", description: "Project details and customer info" },
    { id: 2, title: "Project & Financial Setup", description: "Manager, category, costs and payments" },
    { id: 3, title: "Timeline & Planning", description: "Schedule and duration setup" }
  ];

  // Auto-calculate total_paid, total_balance, weeks_total, est_end_date
  useEffect(() => {
    const total_cost = parseFloat(form.total_cost) || 0;
    const signup_percentage = parseFloat(form.signup_percentage) || 0;
    
    // Calculate total_paid based on total_cost and signup_percentage
    const total_paid = total_cost * (signup_percentage / 100);
    
    const total_balance = total_cost - total_paid;

    const weeks_total =
      (parseInt(form.weeks_planned) || 0) + (parseInt(form.weeks_buffer) || 0);

    let est_end_date = "";
    if (form.tnt_start_date && weeks_total > 0) {
      const startDate = new Date(form.tnt_start_date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + weeks_total * 7);
      est_end_date = endDate.toISOString().split("T")[0]; // format YYYY-MM-DD
    }

    setForm((prev) => ({
      ...prev,
      total_paid,
      total_balance,
      weeks_total,
      est_end_date,
    }));
  }, [form.total_cost, form.signup_percentage, form.weeks_planned, form.weeks_buffer, form.tnt_start_date]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return form.project_name.trim() !== "" && form.cust_id !== "";
      case 2:
        return form.site_mgr_id !== "" && form.budget_cat !== "" && form.current_status !== "";
      case 3:
        return true; // Timeline details are optional
      default:
        return true;
    }
  };

  const isStepValid = validateStep(currentStep);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get next Monday from today
  const getNextMonday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek; // If today is Sunday, next Monday is 1 day away, otherwise calculate days until next Monday
    
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilMonday);
    
    return nextMonday.toISOString().split('T')[0];
  };

  // DayPicker modifiers for Monday-only selection
  const modifiers = {
    mondays: { dayOfWeek: [1] }, // Only Mondays
  };

  const modifiersStyles = {
    mondays: {
      color: '#3b82f6',
      fontWeight: 'bold',
    },
  };

  // Handle date selection from DayPicker
  const handleDateSelect = (date, fieldName) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      setForm((prev) => ({ ...prev, [fieldName]: formattedDate }));
      
      // Close the calendar
      if (fieldName === 'signup_date') {
        setShowSignupCalendar(false);
      } else if (fieldName === 'tnt_start_date') {
        setShowStartCalendar(false);
      }
    }
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateForApi = (date) => {
    if (!date) return null; // send null instead of ""
    return `${date} 00:00:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started...");
    console.log("Current form data:", form);

    try {
      // format dates and numbers
      const formattedForm = {
        ...form,
        budget_cat: parseInt(form.budget_cat) || 0,
        current_status: parseInt(form.current_status) || 0,
        total_cost: parseFloat(form.total_cost) || 0,
        total_paid: parseFloat(form.total_paid) || 0,
        total_balance: parseFloat(form.total_balance) || 0,
        weeks_planned: parseInt(form.weeks_planned) || 0,
        weeks_buffer: parseInt(form.weeks_buffer) || 0,
        weeks_total: parseInt(form.weeks_total) || 0,
        signup_percentage: parseFloat(form.signup_percentage) || 0,
        signup_date: formatDateForApi(form.signup_date),
        tnt_start_date: formatDateForApi(form.tnt_start_date),
        est_end_date: formatDateForApi(form.est_end_date),
      };

      // create correct payload (array of key-value pairs)
      const payload = Object.entries(formattedForm).map(([key, value]) => ({ key, value }));
      console.log("Formatted form data:", formattedForm);
      console.log("Payload to send:", payload);
      
      const formData = new FormData();
      formData.append("projectData", JSON.stringify(payload));

      console.log("Sending request to:", API_URL);
      console.log("FormData contents:", {
        projectData: JSON.stringify(payload)
      });

      const response = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Response received:", response.data);

      // Extract project ID from response if available
      let projectId = null;
      if (response.data && response.data.projectId) {
        projectId = response.data.projectId;
      }

      alert("Project added successfully! Project ID: " + projectId);

      // reset form...
      setForm({
        project_name: "",
        site_mgr_id: "",
        budget_cat: "",
        cust_id: "",
        cust_flat: "",
        cust_community: "",
        cust_address: "",
        total_cost: "",
        total_paid: "",
        total_balance: "",
        signup_date: "",
        signup_percentage: "",
        weeks_planned: "",
        weeks_buffer: "",
        weeks_total: "",
        tnt_start_date: "",
        est_end_date: "",
        current_status: "",
        documents_path: "",
      });
      
    } catch (err) {
      console.error("Error submitting form:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      alert("Failed to add project. Check console for details. Error: " + err.message);
    }
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-center items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Add New Project</h2>
      </div>
      
      <div className="flex justify-between items-start mb-8 px-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center flex-1 relative">
            <div className="flex items-center w-full">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-all duration-300 ${
                  currentStep === step.id
                    ? "bg-blue-600 text-white ring-4 ring-blue-200 scale-110"
                    : currentStep > step.id
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {currentStep > step.id ? "✓" : step.id}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-2 mx-3 rounded-full transition-all duration-300 ${
                    currentStep > step.id ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
            <div className="mt-3 text-center max-w-[120px]">
              <div className={`text-sm font-semibold ${
                currentStep === step.id ? "text-blue-600" : "text-gray-700"
              }`}>{step.title}</div>
              <div className="text-xs text-gray-500 mt-1">{step.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            
            {/* Project Name */}
            <div>
              <label className="block mb-1 font-semibold">Project Name*</label>
              <input
                type="text"
                name="project_name"
                value={form.project_name}
                onChange={handleFormChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter project name"
                required
              />
            </div>

            {/* Customer */}
            <div>
              <label className="block mb-1 font-semibold">Customer*</label>
              <SearchableDropdown
                options={users.map((u) => ({
                  value: u.user_id,
                  label: `${u.user_name} (${u.mobile_no})`,
                }))}
                value={form.cust_id}
                onChange={handleFormChange}
                placeholder="Select Customer"
                name="cust_id"
                displayKey="label"
                valueKey="value"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Flat#</label>
              <input
                type="text"
                name="cust_flat"
                value={form.cust_flat}
                onChange={handleFormChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter flat number"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Community</label>
              <input
                type="text"
                name="cust_community"
                value={form.cust_community}
                onChange={handleFormChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter community name"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Address</label>
              <textarea
                name="cust_address"
                value={form.cust_address}
                onChange={handleFormChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter full address"
                rows="3"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-6">Project & Financial Setup</h3>
            
            {/* Project Setup Section */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="text-md font-semibold text-blue-800 mb-4">Project Setup</h4>
              <div className="space-y-4">
                {/* Site Manager */}
                <div>
                  <label className="block mb-1 font-semibold">Site Manager*</label>
                  <SearchableDropdown
                    options={siteManagers.map((s) => ({
                      value: s.user_id,
                      label: `${s.user_name} (${s.mobile_no})`,
                    }))}
                    value={form.site_mgr_id}
                    onChange={handleFormChange}
                    placeholder="Select Site Manager"
                    name="site_mgr_id"
                    displayKey="label"
                    valueKey="value"
                  />
                </div>

                {/* Budget Category */}
                <div>
                  <label className="block mb-1 font-semibold">Budget Category*</label>
                  <select
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    name="budget_cat"
                    value={form.budget_cat}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {budgets.map((budget) => (
                      <option key={budget.id} value={budget.id}>
                        {budget.budget_cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Current Status */}
                <div>
                  <label className="block mb-1 font-semibold">Current Status*</label>
                  <select
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    name="current_status"
                    value={form.current_status}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select Status</option>
                    {statuses.map((status) => (
                      <option key={status.status_code} value={status.id}>
                        {status.status_code} 
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Financial Details Section */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="text-md font-semibold text-green-800 mb-4">Financial Details</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-semibold">Total Cost</label>
                    <input
                      type="integer"
                      name="total_cost"
                      value={form.total_cost}
                      onChange={handleFormChange}
                      className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter total project cost"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold">Signup Percentage</label>
                    <input
                      type="number"
                      name="signup_percentage"
                      value={form.signup_percentage}
                      onChange={handleFormChange}            
                      className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter signup percentage"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-semibold">Total Paid</label>
                    <input
                      type="number"
                      name="total_paid"
                      value={form.total_paid}
                      readOnly
                      className="w-full border rounded-lg p-3 bg-gray-100 text-gray-700"
                      placeholder="Auto-calculated"
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-calculated from Total Cost × Signup Percentage</p>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold">Total Balance</label>
                    <input
                      type="number"
                      name="total_balance"
                      value={form.total_balance}
                      readOnly
                      className="w-full border rounded-lg p-3 bg-gray-100 text-gray-700"
                      placeholder="Auto-calculated"
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-calculated</p>
                  </div>
                </div>

                <div className="relative calendar-container">
                  <label className="block mb-1 font-semibold">Signup Date </label>
                  <div
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer bg-white hover:bg-gray-50 transition-colors"
                    onClick={() => setShowSignupCalendar(!showSignupCalendar)}
                  >
                    {form.signup_date ? formatDateForDisplay(form.signup_date) : 'Select a Monday'}
                  </div>
                  
                  {showSignupCalendar && (
                    <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 calendar-container">
                      <DayPicker
                        mode="single"
                        selected={form.signup_date ? new Date(form.signup_date) : undefined}
                        onSelect={(date) => handleDateSelect(date, 'signup_date')}
                        modifiers={modifiers}
                        modifiersStyles={modifiersStyles}
                        disabled={{ before: new Date() }}
                        fromMonth={new Date()}
                        toMonth={new Date(new Date().setMonth(new Date().getMonth() + 6))}
                        className="rdp"
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          type="button"
                          onClick={() => setShowSignupCalendar(false)}
                          className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Timeline & Planning</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold">Weeks Planned</label>
                <input
                  type="number"
                  name="weeks_planned"
                  value={form.weeks_planned}
                  onChange={handleFormChange}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter planned weeks"
                  min="0"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">Weeks Buffer</label>
                <input
                  type="number"
                  name="weeks_buffer"
                  value={form.weeks_buffer}
                  onChange={handleFormChange}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter buffer weeks"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-semibold">Weeks Total</label>
              <input
                type="number"
                name="weeks_total"
                value={form.weeks_total}
                readOnly
                className="w-full border rounded-lg p-3 bg-gray-100 text-gray-700"
                placeholder="Auto-calculated"
              />
              <p className="text-sm text-gray-500 mt-1">This field is automatically calculated</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative calendar-container">
                <label className="block mb-1 font-semibold">Tentative Start Date </label>
                <div
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer bg-white hover:bg-gray-50 transition-colors"
                  onClick={() => setShowStartCalendar(!showStartCalendar)}
                >
                  {form.tnt_start_date ? formatDateForDisplay(form.tnt_start_date) : 'Select a Monday'}
                </div>
                
                {showStartCalendar && (
                  <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 calendar-container">
                    <DayPicker
                      mode="single"
                      selected={form.tnt_start_date ? new Date(form.tnt_start_date) : undefined}
                      onSelect={(date) => handleDateSelect(date, 'tnt_start_date')}
                      modifiers={modifiers}
                      modifiersStyles={modifiersStyles}
                      disabled={{ before: new Date() }}
                      fromMonth={new Date()}
                      toMonth={new Date(new Date().setMonth(new Date().getMonth() + 6))}
                      className="rdp"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => setShowStartCalendar(false)}
                        className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-1 font-semibold">Estimated End Date</label>
                <input
                  type="date"
                  name="est_end_date"
                  value={form.est_end_date}
                  readOnly
                  className="w-full border rounded-lg p-3 bg-gray-100 text-gray-700"
                />
                <p className="text-xs text-gray-500 mt-1">Auto-calculated</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 border border-gray-200">
          {renderProgressBar()}
          
          <div className="min-h-[400px] bg-gray-50 rounded-lg p-6 border border-gray-100">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                currentStep === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-600 text-white hover:bg-gray-700 shadow-md hover:shadow-lg"
              }`}
            >
              ← Previous
            </button>

            <div className="flex items-center space-x-2">
              <div className="text-sm font-medium text-gray-600">
                Step {currentStep} of {steps.length}
              </div>
              <div className="flex space-x-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index + 1 <= currentStep ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  !isStepValid
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                }`}
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-3 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-200"
              >
                 Submit Project
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
