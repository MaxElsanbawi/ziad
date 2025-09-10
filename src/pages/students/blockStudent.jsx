import { ArrowRight, UserPlus } from "lucide-react";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const BlockUnblockUserPage = () => {
  const [nationalId, setNationalId] = useState("");
  const [action, setAction] = useState("block"); // Default action is "block"
  const [blockReason, setBlockReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission

    // Validate that block reason is provided when action is "block"
    if (action === "block" && !blockReason.trim()) {
      toast.error("يجب إدخال سبب الحظر", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setIsLoading(true);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestBody = {
      NationalId: nationalId,
      action: action,
    };

    // Only include BlockReason if action is "block"
    if (action === "block") {
      requestBody.BlockReason = blockReason;
    }

    const raw = JSON.stringify(requestBody);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://phpstack-1509731-5843882.cloudwaysapps.com/api/auth/block-user",
        requestOptions
      );
      const result = await response.json();
      console.log(result.message);

      if (response.ok) {
        // Show success toast
        toast.success(result.message, {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        // Reset form on success
        setNationalId("");
        setBlockReason("");
      } else {
        // Show error toast
        toast.error(result.message || "An error occurred", {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error(error);
      // Show error toast for unexpected errors
      toast.error("An error occurred while processing your request.", {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        {/* Toast Container */}
        <ToastContainer
          position="top-left"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {/* Back Button */}
        <button
          onClick={() => navigate("/students")}
          className="flex items-center text-primary hover:text-secondary mb-6"
        >
          <ArrowRight size={20} className="ml-2" />
          العودة إلى قائمة الطلاب
        </button>

        {/* Page Title */}
        <h2 className="text-2xl font-bold mb-6 text-primary flex items-center">
          <UserPlus size={24} className="ml-2" />
          حظر/إلغاء حظر مستخدم
        </h2>

        {/* Block/Unblock User Form */}
        <form onSubmit={handleSubmit}>
          {/* National ID Field */}
          <div className="mb-4">
            <label
              htmlFor="nationalId"
              className="block text-sm font-medium text-gray-700"
            >
              الرقم القومي
            </label>
            <input
              id="nationalId"
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          {/* Action Select */}
          <div className="mb-4">
            <label
              htmlFor="action"
              className="block text-sm font-medium text-gray-700"
            >
              الإجراء
            </label>
            <select
              id="action"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="block">حظر</option>
              <option value="unblock">إلغاء الحظر</option>
            </select>
          </div>

          {/* Block Reason Field (only shown when action is "block") */}
          {action === "block" && (
            <div className="mb-4">
              <label
                htmlFor="blockReason"
                className="block text-sm font-medium text-gray-700"
              >
                سبب الحظر
              </label>
              <textarea
                id="blockReason"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                rows={3}
                required={action === "block"}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {isLoading ? "جاري المعالجة..." : "تأكيد"}
          </button>
        </form>
      </div>
    </>
  );
};

export default BlockUnblockUserPage;