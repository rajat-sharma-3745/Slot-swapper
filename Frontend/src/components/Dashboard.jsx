import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../Context/AppContext";
import CreateEventForm from "./EventForm";
import CalendarDayCell from "./CalendarDayCell";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export default function Dashboard() {
  const { user } = useAppContext();
  const [events, setEvents] = useState([]);
  const [openEventForm, setOpenEventForm] = useState(false);
 

  const fetchEvents = async () => {
    try {
    const {data} = await axiosInstance.get(API_PATHS.EVENTS.GET)

  
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  useEffect(() => {

    fetchEvents();
  }, [user]);

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const getEventForDay = (day) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startTime).getDate();
      return eventDate === day;
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">DASHBOARD</h1>
        <button
          onClick={() => setOpenEventForm((p) => !p)}
          className=" cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create Event
        </button>
        {openEventForm && (
          <CreateEventForm fetchEvents={fetchEvents} onClose={() => setOpenEventForm((p) => !p)} />
        )}
      </div>

      <h2 className="text-lg font-semibold mb-3">December 2025</h2>

      <div className="grid grid-cols-7 gap-2 border border-gray-200 rounded-md">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
          <div
            key={day}
            className="text-center font-medium py-2 border-b bg-gray-50"
          >
            {day}
          </div>
        ))}

        {daysInMonth.map((day) => {
          const dayEvents = getEventForDay(day);
          return (
            <CalendarDayCell key={day} day={day} dayEvents={dayEvents} fetchEvents={fetchEvents}/>
            // <div
            //   key={day}
            //   className="h-18 border border-gray-300 p-1 flex flex-col text-sm relative"
            // >
            //   <span className="absolute top-1 right-2 text-gray-700 h-4">
            //     {day}
            //   </span>
             
            //   <div className="mt-4 overflow-y-auto h-10 flex flex-col gap-1">
            //     {dayEvents.length > 0 ? (
            //       dayEvents.map((event) => (
            //         <div
            //           key={event._id}
            //           title={`${event.title} (${event.status})`}
            //           className={`px-2 py-1 text-white rounded text-xs truncate cursor-pointer hover:scale-[1.02] transition-transform duration-150  ${
            //             event.status === "SWAPPABLE"
            //               ? "bg-green-500"
            //               : event.status === "BUSY"
            //               ? "bg-gray-400"
            //               : "bg-yellow-400"
            //           }`}
            //         >
            //           {event.title}
            //         </div>
            //       ))
            //     ) : (
            //       <span className="text-gray-300 text-[10px] italic text-center mt-2">
            //         No events
            //       </span>
            //     )}
            //   </div>
            // </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-sm items-center">
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-green-500 rounded-sm"></span> SWAPPABLE
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-gray-400 rounded-sm"></span> BUSY
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-yellow-400 rounded-sm"></span> SWAP
          PENDING
        </div>
      </div>
    </div>
  );
}
