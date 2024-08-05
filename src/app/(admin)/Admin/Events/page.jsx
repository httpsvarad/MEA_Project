"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import NAV from "../../Navbar";

export default function ImageUploadForm() {
  const { data: session } = useSession();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [images, setImages] = useState([]);

  // Fetch images function
  const fetchImages = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/admin/event`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch images.");
      }
      const result = await response.json();
      setImages(result);
      setStatusMessage("");
    } catch (error) {
      setStatusMessage(
        error.message || "An error occurred while fetching images."
      );
    }
  };

  // Fetch images on component mount
  useEffect(() => {
    fetchImages();
  }, []);

  // Handle file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setStatusMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("date", date);
    formData.append("description", description);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/admin/event`,
        {
          method: "POST",
          headers: {
            authorization: process.env.NEXT_PUBLIC_API_KEY,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to upload image.");
      }

      setStatusMessage("Image uploaded successfully.");
      setTitle("");
      setDate("");
      setDescription("");
      setFile(null);

      // Refresh images list
      await fetchImages();
    } catch (error) {
      setStatusMessage(
        error.message || "An error occurred while uploading the image."
      );
    }
  };

  // Handle image deletion
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/admin/event?id=${id}`,
        {
          method: "DELETE",
          headers: {
            authorization: process.env.NEXT_PUBLIC_API_KEY,
          },
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to delete image.");
      }

      setStatusMessage("Image deleted successfully.");
      // Refresh images list
      await fetchImages();
    } catch (error) {
      setStatusMessage(
        error.message || "An error occurred while deleting the image."
      );
    }
  };

  // Unauthorized access
  if (session?.user?.role !== "admin") {
    return <div className="text-center text-red-500">Unauthorized access.</div>;
  }

  return (
    <div className="flex w-full h-screen flex-row bg-gray-100">
      <NAV />
      <div className="flex flex-col w-full md:w-4/5 lg:w-3/4 xl:w-2/3 gap-8 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800">Upload Event Image</h1>
        
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-6 flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">
              Title:
              <input
                className="mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">
              Date:
              <input
                className="mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">
              Description:
              <textarea
                className="mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">
              Image:
              <input
                className="mt-1 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                required
              />
            </label>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
            >
              Upload
            </button>
          </div>
        </form>

        {statusMessage && (
          <p className={`mt-4 text-center ${statusMessage.includes("error") ? "text-red-500" : "text-green-500"}`}>
            {statusMessage}
          </p>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Uploaded Images</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.length > 0 ? (
              images.map((image) => (
                <div
                  key={image.eventId}
                  className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
                >
                  <img
                    src={image.image}
                    alt={image.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <p className="mt-2 text-lg font-semibold text-gray-700">{image.title}</p>
                  <button
                    onClick={() => handleDelete(image.eventId)}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No images available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
