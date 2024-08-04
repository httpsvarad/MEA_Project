"use client"
import React, { useEffect, useState } from 'react';
import NAV from "../../Navbar";
import { useSession } from "next-auth/react";
import Unauthorized from "../../Unauthorized"

export default function Page() {
  const [replies, setReplies] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/admin/contact`, {
          method: 'GET',
          headers: {
            authorization: process.env.NEXT_PUBLIC_API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setReplies(data);
      } catch (error) {
        console.error('Error fetching replies:', error);
      }
    };

    fetchReplies();
  }, []);

  return (
    <>
    {session?.user?.role === 'admin' ? (  
      <div className="flex w-full h-screen flex-row text-3xl">
        <NAV />
        <div className='flex flex-col w-full gap-5 h-screen'>
          <h1>Replies</h1>
          <div>
            {replies.map((reply) => (
              <div key={reply.replyId} className="p-4 border-b border-gray-300">
                <p><strong>Name:</strong> {reply.fullName}</p>
                <p><strong>Email:</strong> {reply.email}</p>
                <p><strong>Contact Number:</strong> {reply.contactNumber}</p>
                <p><strong>Address:</strong> {reply.address}</p>
                <p><strong>Message:</strong> {reply.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      ) : (
        <Unauthorized />
      )}
    </>
  );
}
