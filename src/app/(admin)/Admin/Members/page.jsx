"use client"
import React, { useEffect, useState } from 'react';
import NAV from "../../Navbar";

export default function Page() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/admin/members`, {
          method: 'GET',
          headers: {
            authorization: process.env.NEXT_PUBLIC_API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, []);

  const deleteMember = async (memberId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/admin/members/edit/?id=${memberId}`, {
        method: 'DELETE',
        headers: {
          authorization: process.env.NEXT_PUBLIC_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Remove the deleted member from the state
      setMembers((prevMembers) => prevMembers.filter((member) => member.memberId !== memberId));
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  return (
    <>
      <div className="flex w-full h-screen flex-row text-xl">
        <NAV />
        <div className='flex flex-col w-full gap-5 h-screen'>
          <h1>Members</h1>
          <div>
            {members.map((member) => (
              <div key={member.memberId} className="p-4 border-b border-gray-300">
                <p>
                  <strong>Name:</strong> {member.fullName}
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
                <button
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
                  onClick={() => deleteMember(member.memberId)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
