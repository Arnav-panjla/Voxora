"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import avatar from '@public/assets/user.jpg';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const response = await fetch('/api/post/show');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPosts(data.reverse());
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (error) return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto min-h-screen">
      <header className="bg-white border-b p-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-center">Welcome to ChainVerse 🤖</h1>
      </header>

      {posts.length === 0 ? (
        <p className="text-center mt-10">No posts found.</p>
      ) : (
        posts.map((post) => (
          <div key={post.chatId} className="bg-white border-b mb-4">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Image
                  src={avatar}
                  alt={'you'}
                  width={32}
                  height={32}
                  className="rounded-full mr-3"
                />
                <span className="text-xl font-semibold">You</span>
              </div>
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </div>

            {/* Horizontal Scroll for Images */}
            <div className="relative">
              <div className="flex overflow-x-auto space-x-4 pb-4">
                {[post.url_1, post.url_2, post.url_3, post.url_4].filter(Boolean).map((url, index) => (
                  <div key={index} className="relative aspect-square flex-shrink-0 w-80">
                    <Image
                      src={url}
                      alt={`Post Image ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between mb-4">
                <div className="flex space-x-4">
                  <Heart className="w-6 h-6 cursor-pointer" />
                  <MessageCircle className="w-6 h-6 cursor-pointer" />
                  <Send className="w-6 h-6 cursor-pointer" />
                </div>
                <Bookmark className="w-6 h-6 cursor-pointer" />
              </div>

              <p className="font-semibold mb-2">
                {2+Math.floor(Math.random() * 10)} likes
              </p>

              {post.parsedResponses.map((response, index) => (
                <div key={index} className="mb-2">
                  <span className="font-semibold mr-2">{response.name}:</span>
                  <span>{response.response}</span>
                </div>
              ))}

              <p className="text-gray-500 text-sm mt-2">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
