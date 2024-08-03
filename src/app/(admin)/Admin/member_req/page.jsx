"use client";
import React, { useEffect, useState } from "react";
import NAV from "../../Navbar";

export default function Page() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/admin`,
          {
            method: "GET",
            headers: {
              authorization: process.env.NEXT_PUBLIC_API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchReplies();
  }, []);

  const handleAccept = async (id) => {
    try {
      // Example: Send a POST request to accept the member
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/admin/members/?id=${id}`,
        {
          method: "POST",
          headers: {
            authorization: process.env.NEXT_PUBLIC_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Optionally update state to reflect changes
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.id !== id)
      );
      handleDecline(id)
    } catch (error) {
      console.error("Error accepting member:", error);
    }
  };

  const handleDecline = async (id) => {
    try {
      // Example: Send a DELETE request to decline the member
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/admin/members/?id=${id}`,
        {
          method: "DELETE",
          headers: {
            authorization: process.env.NEXT_PUBLIC_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Optionally update state to reflect changes
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.id !== id)
      );
    } catch (error) {
      console.error("Error declining member:", error);
    }
  };

  return (
    <div className="flex w-full h-screen flex-row text-xl">
      <NAV />
      <div className='flex flex-col w-full gap-5 h-screen'>
        <h1>Members Requested</h1>
        {members.length === 0 ? (
          <p>No members found.</p>
        ) : (
          members.map((member) => (
            <div key={member.id} className="p-4 border-b border-gray-300">
              <p>
                <strong>Name:</strong> {member.fullName}
              </p>
              <p>
                <strong>ID:</strong> {member.id}
              </p>
              <p>
                <strong>Email:</strong> {member.email}
              </p>
              <p>
                <strong>Contact Number:</strong> {member.contactNumber}
              </p>
              <p>
                <strong>Designation:</strong> {member.designation}
              </p>
              <p>
                <strong>Role:</strong> {member.Role}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(member.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDecline(member.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
