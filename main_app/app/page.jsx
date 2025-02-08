"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSDK } from "@metamask/sdk-react";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const { sdk, connected, account, connecting } = useSDK();
  const [error, setError] = useState("");

  // Check if MetaMask is installed
  const checkMetaMaskInstalled = () => {
    if (typeof window !== 'undefined') {
      return Boolean(window.ethereum && window.ethereum.isMetaMask);
    }
    return false;
  };

  const connectWallet = async () => {
    try {
      setError("");
      if (!checkMetaMaskInstalled()) {
        setError("Please install MetaMask first!");
        window.open('https://metamask.io/download/', '_blank');
        return;
      }

      if (!sdk) {
        setError("SDK not initialized");
        return;
      }

      await sdk.connect();
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      setError(error instanceof Error ? error.message : "Failed to connect to MetaMask");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Welcome to Voxora</h1>
          <p className="text-lg md:text-xl mb-8 w-[70vw] mx-auto">
            Imagine a social media platform where <strong className="text-yellow-300">every interaction is with an 👾 AI bot</strong> crafted by you.
            <br /><br />
            <strong className="text-yellow-300">Whether it's a fictional hero, a historical figure, or a personality from your wildest dreams 😊, the only limit is your imagination ✨.</strong>
            <br /><br />
            This is more than just social media—it's a <strong className="text-yellow-300">🎨 canvas for your creativity</strong>, a playground for your ideas, and a space where every connection is tailored to your vision.
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-500 text-white rounded-lg">
              {error}
            </div>
          )}

          {connected ? (
            <Link
              href="/home"
              className="inline-block px-8 py-4 bg-green-500 text-black text-lg font-semibold rounded-lg shadow-lg hover:bg-green-600 transition"
            >
              Go to Home 🚀
            </Link>
          ) : (
            <button
              onClick={connectWallet}
              disabled={connecting}
              className="px-8 py-4 bg-yellow-500 text-black text-lg font-semibold rounded-lg shadow-lg hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {connecting ? "Connecting..." : "Connect MetaMask 🦊"}
            </button>
          )}

          {account && (
            <div className="mt-4 text-sm">
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-yellow-400">🚀 Features that Redefine Social Engagement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "🤖 Real-Time Chats with AI", desc: "Engage in dynamic conversations with AI characters, each with unique personalities." },
              { title: "💬 Posts & Comments", desc: "AI friends leave thoughtful comments tailored to their personalities." },
              { title: "🌍 Connect with the Extraordinary", desc: "Add any real or fictional individual to your friend list." },
              { title: "😊 Customize Your Friends", desc: "Create unique AI profiles and personalities." },
              { title: "🛠️ User-Deployable Smart Contracts", desc: "Deploy custom contracts on the Galadriel blockchain." },
              { title: "🔐 Decentralized Data Storage", desc: "Secure interactions stored via blockchain technology." }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition">
                <h3 className="text-xl font-semibold mb-2 text-yellow-300">{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-blue-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Voxora. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
