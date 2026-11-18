import React, { useState } from "react";
import { studioTailwindStyles } from "../../styles/studioTailwindStyles";

const InvoicesSection = ({ showToast }) => {
  const [invoices, setInvoices] = useState([
    {
      id: "INV-001",
      status: "paid",
      amount: 15000,
      vendor: "BuildCorp Solutions",
      subtask: "Concrete Pouring",
      maintask: "Foundation Work",
      project: "Downtown Plaza",
      user: "John Smith",
    },
    {
      id: "INV-002",
      status: "in-review",
      amount: 8000,
      vendor: "Elite Construction",
      subtask: "Wiring Installation",
      maintask: "Foundation Work",
      project: "Downtown Plaza",
      user: "John Smith",
    },
    {
      id: "INV-003",
      status: "pending",
      amount: 12000,
      vendor: "ProBuild Systems",
      subtask: "Pipe Fitting",
      maintask: "Plumbing System",
      project: "Metro Station",
      user: "John Smith",
    },
  ]);

  const updateInvoiceStatusStyles = (status) => {
    if (status === "pending") return "bg-orange-100 text-orange-800";
    if (status === "in-review") return "bg-blue-100 text-blue-800";
    if (status === "paid") return "bg-green-100 text-green-800";
    return "";
  };

  const handleStatusChange = (id, value) => {
    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) => (invoice.id === id ? { ...invoice, status: value } : invoice))
    );
    showToast("Invoice status updated successfully!");
  };

  const handleAmountChange = (id, value) => {
    if (value < 0) {
      showToast("Amount cannot be negative!");
      return;
    }
    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) => (invoice.id === id ? { ...invoice, amount: parseFloat(value) } : invoice))
    );
    showToast("Invoice amount updated successfully!");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className={studioTailwindStyles.heading_2}>Invoices</h2>
          <div className={studioTailwindStyles.paragraph_2}>
            <span>{invoices.length}</span> invoices found
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {["Invoice ID", "Status", "Amount", "Vendor Name", "Subtask Name", "Main Task Name", "Project Name", "User Name"].map((header) => (
                  <th key={header} className={`text-left py-3 px-4 ${studioTailwindStyles.form_label}`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors" data-invoice-id={invoice.id}>
                  <td className={`py-4 px-4 ${studioTailwindStyles.form_text}`}>{invoice.id}</td>
                  <td className="py-4 px-4">
                    <select
                      className={`px-2 py-1 rounded ${studioTailwindStyles.form_text} border-none ${updateInvoiceStatusStyles(invoice.status)}`}
                      value={invoice.status}
                      onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-review">In Review</option>
                      <option value="paid">Paid</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <input
                      type="number"
                      value={invoice.amount}
                      onChange={(e) => handleAmountChange(invoice.id, e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:border-transparent"
                    />
                  </td>
                  <td className={`py-4 px-4 ${studioTailwindStyles.form_text}`}>{invoice.vendor}</td>
                  <td className={`py-4 px-4 ${studioTailwindStyles.form_text}`}>{invoice.subtask}</td>
                  <td className={`py-4 px-4 ${studioTailwindStyles.form_text}`}>{invoice.maintask}</td>
                  <td className={`py-4 px-4 ${studioTailwindStyles.form_text}`}>{invoice.project}</td>
                  <td className={`py-4 px-4 ${studioTailwindStyles.form_text}`}>{invoice.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoicesSection;