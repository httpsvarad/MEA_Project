"use client";
import React, { useEffect, useState } from "react";
import NAV from "../../Navbar";
import { useSession } from "next-auth/react";
import Unauthorized from "../../Unauthorized";

export default function Page() {
  const [members, setMembers] = useState([]);
  const { data: session } = useSession();

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/admin/members?id=${id}`,
        {
          method: "POST",
          headers: {
            authorization: process.env.NEXT_PUBLIC_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      } else {
        handleDecline(id);
      }

      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.id !== id)
      );
    } catch (error) {
      console.error("Error accepting member:", error);
    }
  };

  const handleDecline = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/admin/members?id=${id}`,
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

      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.id !== id)
      );
    } catch (error) {
      console.error("Error declining member:", error);
    }
  };

  return (
    <>
      {session?.user?.role === "admin" ? (
        <div className="flex w-full h-screen flex-row text-xl bg-gray-100">
          <NAV />
          <div className="flex flex-col w-full gap-8 px-8 py-6 h-screen overflow-y-auto">
            <h1 className="text-3xl font-bold text-gray-800 text-center">
              Requested Members List
            </h1>
            {members.length === 0 ? (
              <p className="text-gray-600 text-lg">No members found.</p>
            ) : (
              members.map((member) => (
                <div
                  key={member.id}
                  className="bg-white shadow-md rounded-lg p-6 border border-gray-200 flex flex-col justify-between"
                >
                  <div>
                    <p className="text-lg text-gray-700">
                      <strong className="font-semibold">Name:</strong>{" "}
                      {member.fullName}
                    </p>
                    <p className="text-lg text-gray-700">
                      <strong className="font-semibold">ID:</strong> {member.id}
                    </p>
                    <p className="text-lg text-gray-700">
                      <strong className="font-semibold">Email:</strong>{" "}
                      {member.email}
                    </p>
                    <p className="text-lg text-gray-700">
                      <strong className="font-semibold">
                        Contact Number:
                      </strong>{" "}
                      {member.contactNumber}
                    </p>
                    <p className="text-lg text-gray-700">
                      <strong className="font-semibold">Designation:</strong>{" "}
                      {member.designation}
                    </p>
                    <p className="text-lg text-gray-700">
                      <strong className="font-semibold">Role:</strong>{" "}
                      {member.Role}
                    </p>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => handleAccept(member.id)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition duration-300 ease-in-out"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecline(member.id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition duration-300 ease-in-out"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <Unauthorized />
      )}
    </>
  );
}
