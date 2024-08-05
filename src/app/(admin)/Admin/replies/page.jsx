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
      <div className="flex w-full h-screen flex-row text-[1.5rem]">
        <NAV />
        <div className='flex flex-col w-full gap-5 h-screen items-center  overflow-y-auto px-5 py-5'>
          <h1>Replies</h1>
          <div className='flex gap-5 flex-col w-full'>        
                {replies.map((reply) => (
              <div key={reply.replyId} className="container gap-2 w-full p-4 border-[2px] rounded-xl flex flex-col justify-center  border-gray-300">
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
