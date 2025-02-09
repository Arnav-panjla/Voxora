"use client";

import { useEffect, useState } from "react";

const Modal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    profile: '',
    description: ''
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Generate a new character entry
    const newCharacter = {
      id: Date.now(), // Generate a unique ID using timestamp
      name: formData.name,
      status: "online", // Default status
      lastMessage: "Hello! How are you today?", // Default last message
      color: "bg-gradient-to-r from-purple-500 to-pink-500", // Default color
      personality: formData.description,
      responses: [
        // Generate some default responses based on the description
        `As ${formData.name}, I'm here to ${formData.description}`,
        "How can I assist you today?"
      ]
    };

    try {
      const response = await fetch("http://localhost:5173/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCharacter),
      });

      const result = await response.json();

      if (response.ok) {
        if (onSave) {
          onSave(newCharacter); // Pass the new character data to parent component
        }
        alert("Bot saved successfully!");
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error saving bot:", error);
      alert("Failed to save bot. Please try again.");
    }
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full relative transform scale-100 transition-all duration-300 ease-in-out">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          Create New AI Bot
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Bot Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              placeholder="Enter bot name"
            />
          </div>

          <div>
            <label htmlFor="profile" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Profile Picture URL (Optional)
            </label>
            <input
              type="url"
              id="profile"
              name="profile"
              value={formData.profile}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Personality Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 resize-none"
              placeholder="Describe your bot's personality and expertise..."
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
            >
              Create Bot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;