"use client";

"use client";

import { useRouter } from "next/navigation";
import { useSDK } from "@metamask/sdk-react";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  MessageCircle, 
  Send, 
  User, 
  Settings, 
  LogOut,
  Home,
  Users,
  Bell,
  Palette,
  BookOpen,
  PlusCircle,
  HeartHandshake
} from "lucide-react";

export default function HomePage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "AI Bot 1", content: "Hello! How are you today?", timestamp: "10:00 AM" },
    { id: 2, sender: "You", content: "I'm doing great, thanks!", timestamp: "10:01 AM" },
    { id: 3, sender: "AI Bot 2", content: "That's wonderful to hear!", timestamp: "10:02 AM" }
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState("AI Bot 1");
  const messagesEndRef = useRef(null);

  const navItems = [
    { icon: Home, label: "Dashboard", color: "text-purple-400" },
    { icon: MessageCircle, label: "Chats", color: "text-blue-400" },
    { icon: Users, label: "Friends", color: "text-green-400" },
    { icon: PlusCircle, label: "Create", color: "text-red-400" },
    { icon: HeartHandshake, label: "Community", color: "text-orange-400" },
    { icon: Settings, label: "Settings", color: "text-purple-400" },
    { icon: LogOut, label: "Logout", color: "text-red-400" }
  ];

  const aiCharacters = [
    { id: 1, name: "AI Bot 1", status: "online", lastMessage: "Hello! How are you today?", color: "bg-gradient-to-r from-purple-500 to-pink-500" },
    { id: 2, name: "AI Bot 2", status: "online", lastMessage: "That's wonderful to hear!", color: "bg-gradient-to-r from-blue-500 to-teal-500" },
    { id: 3, name: "Historical Figure", status: "offline", lastMessage: "Let's chat later", color: "bg-gradient-to-r from-green-500 to-emerald-500" },
    { id: 4, name: "Fictional Hero", status: "online", lastMessage: "Ready for adventure!", color: "bg-gradient-to-r from-orange-500 to-yellow-500" }
  ];

  // Existing functions remain the same
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: "You",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
      
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          sender: selectedChat,
          content: "Thanks for your message! This is a simulated response.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const router = useRouter();
  const { sdk, connected, account } = useSDK();
  const [error, setError] = useState("");

  useEffect(() => {
    // Redirect to landing page if not connected
    if (!connected) {
      router.push('/');
    }
  }, [connected, router]);

  const disconnectWallet = async () => {
    try {
      setError("");
      if (sdk) {
        await sdk.terminate();
        localStorage.removeItem('metamask-connected');
        router.push('/');
      }
    } catch (error) {
      console.error("Error disconnecting from MetaMask:", error);
      setError(error instanceof Error ? error.message : "Failed to disconnect from MetaMask");
    }
  };

  if (!connected) {
    return null; // or a loading state while redirecting
  }


  const handleButtonClick = (item) => {
    console.log(`Button clicked: ${item.label}`);
  
    if (item.label === 'Dashboard') {
      router.push('/dashboard');  // Navigate to the Dashboard page
    }
  
    if (item.label === 'Chats') {
      router.push('/chats');  // Navigate to the Chats page
    }
  
    if (item.label === 'Friends') {
      router.push('/friends');  // Navigate to the Friends page
    }
  
    if (item.label === 'Create') {
      router.push('/create');  // Navigate to the Create page
    }
  
    if (item.label === 'Community') {
      window.location.href = 'https://github.com/Arnav-panjla/Voxora';  // Navigate to the GitHub page for the Community
    }
  
    if (item.label === 'Settings') {
      router.push('/settings');  // Navigate to the Settings page
    }
  
    if (item.label === 'Logout') {
      disconnectWallet();  // Call the logout function to disconnect the wallet
    }
  };
  

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Navigation Bar */}
      <div className="w-20 bg-gray-900 border-r border-gray-700 flex flex-col items-center py-4 space-y-8">
        {/* App Logo */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">Vx</span>
        </div>

        {/* Nav Items */}
        <div className="flex-1 space-y-6">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleButtonClick(item)}
              className="w-12 h-12 rounded-xl hover:bg-gray-800 flex flex-col items-center justify-center group transition-all duration-300"
            >
              <item.icon className={`${item.color} group-hover:scale-110 transition-transform duration-300`} size={20} />
              <span className="text-xs mt-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700">
        {/* User Profile */}
        <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="text-gray-300" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-200">{account?.slice(0, 6)}....{account?.slice(-5)}</h2>
              <p className="text-sm text-green-400">Online</p>
            </div>
          </div>
        </div>

        {/* AI Characters List */}
        <div className="overflow-y-auto h-[calc(100vh-180px)]">
          {aiCharacters.map((char) => (
            <div
              key={char.id}
              onClick={() => setSelectedChat(char.name)}
              className={`p-4 hover:bg-gray-700 cursor-pointer transition-all duration-300 ${
                selectedChat === char.name ? "bg-gray-700" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full ${char.color} flex items-center justify-center`}>
                  <MessageCircle className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-200">{char.name}</h3>
                  <p className="text-sm text-gray-400 truncate">{char.lastMessage}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  char.status === 'online' ? 'bg-green-400' : 'bg-gray-500'
                }`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-900">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center space-x-3">
            <h2 className="font-semibold text-xl text-gray-200">
              {selectedChat}
            </h2>
            <span className="text-sm text-green-400">online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "You" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === "You"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                    : "bg-gray-800 text-gray-200"
                }`}
              >
                <p className="text-sm font-medium mb-1">{message.sender}</p>
                <p>{message.content}</p>
                <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 bg-gray-700 border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder-gray-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center space-x-2 transition-all duration-300"
            >
              <Send size={20} />
              <span>Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}