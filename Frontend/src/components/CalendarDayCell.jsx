import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

// CalendarDayCell.jsx
export default function CalendarDayCell({ day, dayEvents = [], fetchEvents }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleMakeSwappable = async () => {
    try {
      const { data } = await axiosInstance.patch(API_PATHS.EVENTS.UPDATE(selectedEvent?._id),{status:'SWAPPABLE'});

      if (data) {
        fetchEvents();
        setShowModal(false);
        console.log('Swapped')
      } else {
        console.error("Failed to make swappable");
      }
    } catch (err) {
      console.error(err?.response?.data?.message);
    }
  };
  return (
    <div className="relative w-full h-10 sm:h-14 md:h-16 border border-gray-300 rounded-lg bg-white flex flex-col">
      <div className="absolute top-1 right-2 z-20 text-[10px] sm:text-xs text-gray-500 bg-white/90 px-1 rounded pointer-events-none">
        {day}
      </div>

      <div
        className="mt-3 px-1 pb-1 overflow-y-auto"
        style={{ maxHeight: "calc(100% - 0.75rem)" }}
      >
        {dayEvents.length > 0 ? (
          <div className="flex flex-col gap-1">
            {dayEvents.map((event) => (
              <div
                key={event._id}
                onClick={() => handleEventClick(event)}
                title={`${event.title} (${event.status})`}
                className={`px-2 py-1 text-white rounded text-[10px] sm:text-xs truncate cursor-pointer transition-transform duration-150 ${
                  event.status === "SWAPPABLE"
                    ? "bg-green-500"
                    : event.status === "BUSY"
                    ? "bg-gray-400"
                    : "bg-yellow-400"
                }`}
              >
                {event.title}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-300 sm:block hidden text-[10px] sm:text-[11px] italic text-center py-2">
            No events
          </div>
        )}
      </div>
      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-2">
              {selectedEvent.title}
            </h2>
            <p className="text-md text-gray-600 mb-4">
              Current status: <b>{selectedEvent.status}</b>
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="cursor-pointer px-3 py-1 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
              {selectedEvent.status !== "SWAPPABLE" &&selectedEvent.status !== "SWAP_PENDING" && (
                <button
                  onClick={handleMakeSwappable}
                  className="cursor-pointer px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                >
                  Make Swappable
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
