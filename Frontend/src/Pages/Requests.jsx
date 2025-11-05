import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { toast } from "sonner";

const RequestsPage = () => {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const {data} = await axiosInstance.get(API_PATHS.SLOT.GET_SWAP_REQ)
       
        console.log(data)
        setIncomingRequests(data.incoming || []);
        setOutgoingRequests(data.outgoing || []);
      } catch (err) {
        console.error("Failed to load swap requests:", err);
      }
    };
    fetchRequests();
  }, []);

  const handleResponse = async (requestId, accept) => {
    try {
      const {data} = await axiosInstance.patch(API_PATHS.SLOT.SWAP_RES(requestId),{accept})
      if (data) {
        toast.success(data?.message);
        setIncomingRequests((prev) =>
          prev.filter((req) => req._id !== requestId)
        );
      } else {
        toast.error("Failed to update swap request");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
  <div className="p-6  min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Swap Requests
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto w-full">
        {/* Incoming Requests */}
        <div className="bg-white shadow-lg rounded-2xl p-4">
          <h2 className="text-lg font-semibold mb-4 text-blue-600 border-b pb-2">
            Incoming Requests
          </h2>
          {incomingRequests.length > 0 ? (
            incomingRequests.map((req) => (
              <div
                key={req._id}
                className="border rounded-lg p-3 mb-3 hover:shadow-md transition"
              >
                <p className="text-sm text-gray-700 mb-1">
                  <strong>{req.fromUser.name}</strong> wants to swap:
                </p>
                <p className="text-sm text-gray-600">
                  Your slot: <strong>{req.mySlot.title}</strong>
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Their slot: <strong>{req.theirSlot.title}</strong>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleResponse(req._id, true)}
                    className="px-4 cursor-pointer py-2 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleResponse(req._id, false)}
                    className="px-4 cursor-pointer py-2 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 italic">No incoming requests</p>
          )}
        </div>

        {/* Outgoing Requests */}
        <div className="bg-white shadow-lg rounded-2xl p-4">
          <h2 className="text-lg font-semibold mb-4 text-green-600 border-b pb-2">
            Outgoing Requests
          </h2>
          {outgoingRequests.length > 0 ? (
            outgoingRequests.map((req) => (
              <div
                key={req._id}
                className="border rounded-lg p-3 mb-3 hover:shadow-md transition"
              >
                <p className="text-sm text-gray-700 mb-1">
                  Sent to <strong>{req.toUser.name}</strong>
                </p>
               <p className="text-sm text-gray-700">
                  You offered your <b>{req.mySlot?.title}</b> (
                  {new Date(req.mySlot?.startTime).toLocaleString()})
                </p>
                <p className="text-sm text-gray-700">
                  In exchange for <b>{req.theirSlot?.title}</b> (
                  {new Date(req.theirSlot?.startTime).toLocaleString()})
                </p>
                <p className="text-sm mt-2">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      req.status === "PENDING"
                        ? "text-yellow-600"
                        : req.status === "ACCEPTED"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {req.status}
                  </span>
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 italic">No outgoing requests</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestsPage;
