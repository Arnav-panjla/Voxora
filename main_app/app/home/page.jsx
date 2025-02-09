"use client";
import { aiCharactersData, getInitialMessage, getRandomResponse } from '../data/aiCharacters';
import { useRouter } from "next/navigation";
import { useSDK } from "@metamask/sdk-react";
import Modal from "../components/Modal";
import { useState, useEffect, useRef } from "react";
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
  HeartHandshake,
  UserPlus
} from "lucide-react";

export default function HomePage() {
  // Initialize group chat
  const groupChat = {
    id: 'group-1',
    name: 'Innovation Squad',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    status: 'online',
    lastMessage: 'Welcome to the group chat!',
    isGroup: true,
    participants: [
      aiCharactersData.find(char => char.id === 2), // Edison
      aiCharactersData.find(char => char.id === 3), // Thor
    ],
    messages: [
      {
        id: 1,
        sender: 'Edison',
        content: "Hello everyone! Let's collaborate on something amazing!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]
  };

  // Initialize AI characters with message history and include group chat
  const [aiCharacters, setAiCharacters] = useState([
    ...aiCharactersData.map(char => ({
      ...char,
      messages: [
        {
          id: 1,
          sender: char.name,
          content: "Hello!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    })),
    groupChat // Add group chat to the characters list
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState(aiCharacters[0]?.name || "");
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  // Router and SDK
  const router = useRouter();
  const { sdk, connected, account } = useSDK();

  // Navigation Items
const navItems = [
  { icon: Home, label: "Dashboard", color: "text-purple-400" },
  { icon: MessageCircle, label: "Chats", color: "text-blue-400" },
  { icon: Users, label: "Friends", color: "text-green-400" },
  { icon: PlusCircle, label: "Create", color: "text-red-400" },
  { icon: HeartHandshake, label: "Community", color: "text-orange-400" },
  { icon: Settings, label: "Settings", color: "text-purple-400" },
  { icon: LogOut, label: "Logout", color: "text-red-400" }
];

useEffect(() => {
  scrollToBottom();
}, [selectedChat, aiCharacters]);

useEffect(() => {
  if (!connected) {
    router.push('/');
  }
}, [connected, router]);

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

const addNewAiCharacter = (newCharacter) => {
  const characterWithMessages = {
    ...newCharacter,
    messages: []
  };
  setAiCharacters((prev) => [...prev, characterWithMessages]);
};

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Create new user message
      const userMessage = {
        id: Date.now(),
        sender: "You",
        content: newMessage,
        timestamp
      };

      // Update AI characters with new message
      setAiCharacters(prevChars => prevChars.map(char => {
        if (char.name === selectedChat) {
          return {
            ...char,
            lastMessage: newMessage,
            messages: [...char.messages, userMessage]
          };
        }
        return char;
      }));

      setNewMessage("");
      
      // Handle group chat responses
      if (selectedChat === 'Innovation Squad') {
        // Add responses from both group members with delays
        setTimeout(() => {
          const edisonResponse = {
            id: Date.now() + 1,
            sender: "Edison",
            content: getRandomResponse("Edison"),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          setAiCharacters(prevChars => prevChars.map(char => {
            if (char.name === 'Innovation Squad') {
              return {
                ...char,
                lastMessage: edisonResponse.content,
                messages: [...char.messages, edisonResponse]
              };
            }
            return char;
          }));
        }, 1000);

        setTimeout(() => {
          const thorResponse = {
            id: Date.now() + 2,
            sender: "Thor",
            content: getRandomResponse("Thor"),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          setAiCharacters(prevChars => prevChars.map(char => {
            if (char.name === 'Innovation Squad') {
              return {
                ...char,
                lastMessage: thorResponse.content,
                messages: [...char.messages, thorResponse]
              };
            }
            return char;
          }));
        }, 2000);
      } else {
        // Regular single chat response
        setTimeout(() => {
          const aiResponse = {
            id: Date.now() + 1,
            sender: selectedChat,
            content: getRandomResponse(selectedChat),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          setAiCharacters(prevChars => prevChars.map(char => {
            if (char.name === selectedChat) {
              return {
                ...char,
                lastMessage: aiResponse.content,
                messages: [...char.messages, aiResponse]
              };
            }
            return char;
          }));
        }, 1000);
      }
    }
  };

  // Get current chat messages
  const currentChat = aiCharacters.find(char => char.name === selectedChat);
  const currentMessages = currentChat?.messages || [];

  // Render chat header based on chat type
  const renderChatHeader = () => {
    const chat = aiCharacters.find(char => char.name === selectedChat);
    if (!chat) return null;

    return (
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center space-x-3">
          <h2 className="font-semibold text-xl text-gray-200">
            {chat.name}
          </h2>
          {chat.isGroup ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">
                {chat.participants.length + 1} members
              </span>
              <div className="flex -space-x-2">
                {chat.participants.map((participant, index) => (
                  <div
                    key={participant.id}
                    className={`w-6 h-6 rounded-full ${participant.color} flex items-center justify-center ring-2 ring-gray-800`}
                  >
                    <span className="text-xs text-white">{participant.name[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <span className="text-sm text-green-400">online</span>
          )}
        </div>
      </div>
    );
  };

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
       setIsModalOpen(true);  // Open the Create modal
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

  if (!connected) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Hello, this is a Modal! 🎉</h2>
        <p>You can put any content here.</p>
      </Modal>
      
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

        {/* AI Characters and Group Chat List */}
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
                  {char.isGroup ? (
                    <Users className="text-white" size={20} />
                  ) : (
                    <MessageCircle className="text-white" size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-200">{char.name}</h3>
                  <p className="text-sm text-gray-400 truncate">
                  {char.lastMessage.substring(0, 21)}
                  </p>
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
        {renderChatHeader()}

        {/* Messages */}
<div className="flex-1 overflow-y-auto p-4 space-y-4">
  {currentMessages.map((message) => (
    <div
      key={message.id}
      className={`flex ${
        message.sender === "You" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`relative max-w-[70%] rounded-lg p-3 ${
          message.sender === "You"
            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
            : "bg-gray-800 text-gray-200"
        }`}
      >
        <p className="text-sm font-medium mb-1">{message.sender}</p>
        <p>{message.content}</p>
        <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>

        {/* Add a small clickable link at the bottom-right corner */}
        <a
          href="/data/proof.json" // Replace this with the actual path to the JSON file
          target="_blank" // Open the link in a new window/tab
          rel="noopener noreferrer" // Security best practice
          className="absolute bottom-2 right-2 text-xs text-blue-400 hover:underline"
        >
          proof
        </a>
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