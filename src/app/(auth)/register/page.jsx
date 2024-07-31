"use client";
import OnScrollAnimation from "../../../Components/OnScrollAnimmation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [fullName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setNumber] = useState("");
  const [designation, setDesignation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  
  const form = useRef();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("/api/memberReg", {
        method: "POST",
        body: JSON.stringify({ fullName, email, contactNumber, designation, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok){
        setName('');
        setEmail('');
        setNumber('');
        setDesignation('');
        setPassword('');
        setConfirmPassword('');
        alert("Register successful , wait till admin accept your request")
        router.push('/login');
      }
      else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (error) {
      setError("Failed to submit the form. Please try again.");
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      // will run in client's browser only
      const hiddenElements1 = document.querySelectorAll(".hidden3");
      const hiddenElements4 = document.querySelectorAll(".hidden4");
      const hiddenElements2 = document.querySelectorAll(".hidden2");
      const hiddenElements3 = document.querySelectorAll(".hidden1");

      OnScrollAnimation(hiddenElements1);
      OnScrollAnimation(hiddenElements4);
      OnScrollAnimation(hiddenElements2);
      OnScrollAnimation(hiddenElements3);
    }
  }, []);

  return (
    <>
      <main>
        <section className="h-44 bg-[#232323] flex justify-center items-center flex-col text-white">
          <h1 className="text-5xl p-3">Register</h1>
        </section>
        <section className="flex justify-center items-center min-h-screen hidden1 flex-col ">
          <form onSubmit={handleSubmit} ref={form} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Member Register</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={fullName}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72625]"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72625]"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Contact Number</label>
              <input
                type="number"
                name="contactNumber"
                value={contactNumber}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72625]"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Designation</label>
              <input
                type="text"
                name="designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72625]"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72625]"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72625]"
                required
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button type="submit" className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-[#C72625]">
              Register
            </button>
          </form>
          <div className='m-2'>
            <p>Already have an account? <span className='text-blue-700'>
              <Link href={'/login'}>
                Login
              </Link>
            </span></p>
          </div>
        </section>
      </main>
    </>
  );
}
