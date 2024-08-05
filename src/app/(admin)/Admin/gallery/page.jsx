"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Unauthorized from "../../Unauthorized";
import NAV from "../../Navbar";

export default function GalleryPage() {
  const { data: session } = useSession();
  const [images, setImages] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  // Fetch images function
  const fetchImages = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/admin/gallery`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch images.");
      }
      const result = await response.json();
      setImages(result);
    } catch (error) {
      setStatusMessage(
        error.message || "An error occurred while fetching images."
      );
    }
  };

  // Fetch images when the component mounts
  useEffect(() => {
    fetchImages();
  }, []);

  // Handle file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle image upload
  const handleUpload = async (e) => {
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
        `${process.env.NEXT_PUBLIC_HOST}/api/admin/gallery`,
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

  // Handle image delete
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/admin/gallery?id=${id}`,
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

  if (session?.user?.role !== "admin") {
    return <Unauthorized />;
  }

  return (
    <div className="flex w-full h-[100vh] flex-row text-xl">
      <NAV />
      <div className="flex flex-col w-[80%] gap-5 items-center  h-[100vh] p-5">
        <h1>Gallery</h1>
        <form
          onSubmit={handleUpload}
          className="w-[70%] py-19   text-white flex h-[80vh] justify-center flex-col gap-5 rounded-xl px-10 bg-[#c72626]"
        >
          <div className="">
            <label className="">
              Title:
              <input
                className="w-[80%] text-black mx-5 px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72625]"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Date:
              <input
                className="w-[80%] text-black mx-5 px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72625]"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label className="flex items-center">
              Description:
              <textarea
                className="w-[72%] mx-5 text-black px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72625]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Image:
              <input
                className="w-[80%] text-black mx-5 px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[white]"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                required
              />
            </label>
          </div>
          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="w-[8rem] h-[5vh]   text-white bg-green-500 rounded-lg"
            >
              Upload
            </button>
          </div>
        </form>
        {statusMessage && <p>{statusMessage}</p>}

        <div className="w-[90%] h-[80vh] overflow-x-auto justify-start flex flex-col items-start">
          <div className=" flex   ">
            {images.length > 0 ? (
              <div className="w-[100%] flex h-[20vh] gap-10 items-start">
                {images.map((image) => (
                  <div
                    key={image.eventId}
                    className="w-[19rem] justify-center h-auto p-5 flex flex-col border-[2px] items-center"
                  >
                    <img
                      src={image.image}
                      alt={image.title}
                      style={{ width: "200px", height: "auto" }}
                    />
                    <p>{image.title}</p>
                    <button
                      className="w-[5rem] h-[2rem] text-white rounded-md bg-red-600"
                      onClick={() => handleDelete(image.imageId)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No images available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
