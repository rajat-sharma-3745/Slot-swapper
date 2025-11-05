import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { toast } from "sonner";

const MarketPlace = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [mySwappableSlots, setMySwappableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [offerSlotId, setOfferSlotId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reqLoading, setReqLoading] = useState(false);

  const fetchSwappableSlots = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(API_PATHS.SLOT.GETSWAPSLOT);
      setAvailableSlots(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSwappableSlots();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axiosInstance.get(API_PATHS.EVENTS.GET);

        const swappable = data?.filter((e) => e.status === "SWAPPABLE");
        setMySwappableSlots(swappable);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleSwapRequest = async () => {
    try {
      setReqLoading(true);
      const { data } = await axiosInstance.post(API_PATHS.SLOT.SWAP_REQ, {
        mySlotId: offerSlotId,
        theirSlotId: selectedSlot._id,
      });
      if (data) {
        toast.success(data?.message);
      setAvailableSlots(prev=>prev.filter((item)=>item._id!==selectedSlot._id))

      } else {
        console.log("Failed to send swap request");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReqLoading(false);
      setShowModal(false);
    }
  };
  return (
    <div className="p-6 max-w-6xl mx-auto w-full">
      <h1 className="text-2xl font-semibold mb-4">Marketplace</h1>
      <p className="text-gray-500 mb-6">
        Browse other users’ swappable slots and request a swap.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="border rounded-xl p-4 shadow-sm bg-white animate-pulse"
            >
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-8 bg-blue-200 rounded w-1/3"></div>
            </div>
          ))
        ) : availableSlots.length > 0 ? (
          availableSlots.map((slot) => (
            <div
              key={slot._id}
              className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition"
            >
              <h3 className="font-medium text-lg">{slot.title}</h3>
              <p className="text-sm text-gray-600">
                {new Date(slot.startTime).toLocaleString()} -{" "}
                {new Date(slot.endTime).toLocaleString()}
              </p>
              <button
                onClick={() => {
                  setSelectedSlot(slot);
                  setShowModal(true);
                }}
                className="mt-3 cursor-pointer px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                Request Swap
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic">No swappable slots available.</p>
        )}
      </div>

      {showModal && selectedSlot && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-2">
              Request Swap for: {selectedSlot.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {new Date(selectedSlot.startTime).toLocaleString()}
            </p>

            <label className="text-sm text-gray-700 mb-1 block">
              Choose one of your swappable slots:
            </label>
            <select
              className="border rounded w-full p-2 mb-4"
              value={offerSlotId}
              onChange={(e) => setOfferSlotId(e.target.value)}
            >
              <option value="">-- Select your slot --</option>
              {mySwappableSlots.map((slot) => (
                <option key={slot._id} value={slot._id}>
                  {slot.title} ({new Date(slot.startTime).toLocaleString()})
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                disabled={!offerSlotId}
                onClick={handleSwapRequest}
                className={`px-3 py-1 rounded text-white ${
                  offerSlotId
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {reqLoading ? "Processing..." : "Confirm Swap"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketPlace;
