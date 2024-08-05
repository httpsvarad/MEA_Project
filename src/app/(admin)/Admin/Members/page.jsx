"use client";
import React, { useEffect, useState } from "react";
import NAV from "../../Navbar";
import { useSession } from "next-auth/react";
import Unauthorized from "../../Unauthorized";

export default function Page() {
  const { data: session } = useSession();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/admin/members`,
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

    fetchMembers();
  }, []);

  const deleteMember = async (memberId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/admin/members/edit/?id=${memberId}`,
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

      // Remove the deleted member from the state
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.memberId !== memberId)
      );
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  return (
    <>
      {session?.user?.role === "admin" ? (
        <div className="flex w-full h-screen flex-row">
          <NAV />
          <div className="flex flex-col w-full px-6 py-6 gap-6 h-screen overflow-y-auto bg-gray-100">
            <h1 className="text-4xl font-bold text-gray-800">Members</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member) => (
                <div
                  key={member.memberId}
                  className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 flex flex-col justify-between"
                >
                  <div>
                    <p className="text-lg text-gray-700">
                      <strong className="font-semibold">Name:</strong>{" "}
                      {member.fullName}
                    </p>
                    <p className="text-lg text-gray-700">
                      <strong className="font-semibold">Email:</strong>{" "}
                      {member.email}
                    </p>
                    <p className="text-lg text-gray-700">
                      <strong className="font-semibold">Contact Number:</strong>{" "}
                      {member.contactNumber}
                    </p>
                    <p className="text-lg text-gray-700">
                      <strong className="font-semibold">Designation:</strong>{" "}
                      {member.designation}
                    </p>
                  </div>
                  <button
                    className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition duration-300 ease-in-out"
                    onClick={() => deleteMember(member.memberId)}
                  >
                    Delete
                  </button>
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
