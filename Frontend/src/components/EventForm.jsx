import { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export default function CreateEventForm({ onClose,fetchEvents }) {
  const [formData, setFormData] = useState({
    title: "",
    startTime: "",
    endTime: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventData = {
      title: formData.title,
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
    };

    try {
      const {data} = await axiosInstance.post(API_PATHS.EVENTS.CREATE,eventData);


      if (data) {
        fetchEvents()
        onClose();
        setFormData({ title: "", startTime: "", endTime: "" });
        console.log('event submitted')
      } 
    } catch (error) {
      console.error("Error:", error?.response?.data?.message);
    }
  };


  return (
    <div className="fixed w-screen h-screen z-51 inset-0 bg-black/30 flex items-center justify-center p-2">
      <div
        className="max-w-lg w-full mx-auto bg-white p-6 rounded-2xl shadow-md"
      >
        <div className="flex mb-4 justify-between items-center ">
        <h2 className="text-xl font-semibold ">Create New Event</h2>
        <RxCross2 onClick={onClose} className="cursor-pointer" size={20}/>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Event Title"
            className="border p-2 rounded"
            required
          />

          <label className="text-sm text-gray-600">Start Time:</label>
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <label className="text-sm text-gray-600">End Time:</label>
          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mt-2"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}
