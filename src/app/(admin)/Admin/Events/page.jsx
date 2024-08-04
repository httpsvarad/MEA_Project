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

  // Define fetchImages function
  const fetchImages = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/admin/event`);
      if (!response.ok) {
        throw new Error("Failed to fetch images.");
      }
      const result = await response.json();
      setImages(result);
      setStatusMessage("");
    } catch (error) {
      setStatusMessage(error.message || "An error occurred while fetching images.");
    }
  };

  // Fetch images when the component mounts
  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/admin/event`, {
        method: "POST",
        headers: {
          authorization: process.env.NEXT_PUBLIC_API_KEY,
        },
        body: formData,
      });

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
      setStatusMessage(error.message || "An error occurred while uploading the image.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/admin/event?id=${id}`, {
        method: "DELETE",
        headers: {
          authorization: process.env.NEXT_PUBLIC_API_KEY,
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to delete image.");
      }

      setStatusMessage("Image deleted successfully.");
      // Refresh images list
      await fetchImages();
    } catch (error) {
      setStatusMessage(error.message || "An error occurred while deleting the image.");
    }
  };

  if (session?.user?.role !== "admin") {
    return <div>Unauthorized access.</div>;
  }

  return (
    <div className="flex w-full h-screen flex-row text-xl">
      <NAV />
      <div className="flex flex-col w-full gap-5 items-center  h-screen p-5">
        <h1>Upload Event Image</h1>
        <form onSubmit={handleSubmit} className="w-[70%]  text-white h-[55vh] flex justify-center flex-col gap-5 rounded-xl px-10 bg-blue-500" >
          <div>
            <label>
              Title:
              <input
                className="w-[80%] mx-5 px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72625]"

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
                              className="w-[80%] mx-5 px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72625]"

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
                              className="w-[72%] mx-5 px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72625]"

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
                              className="w-[80%] mx-5 px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[white]"

              type="file" onChange={handleFileChange} accept="image/*" required />
            </label>
          </div>
          <div className="w-full flex justify-center">
          <button type="submit" className="w-[8rem] h-[5vh]  mt-5 text-white bg-green-500 rounded-lg">Upload</button>
          </div>        </form>
        {statusMessage && <p>{statusMessage}</p>}

        <h2>Existing Images</h2>
        <div>
          {images.length > 0 ? (
            <ul>
              {images.map((image) => (
                <li key={image.eventId}>
                  <img
                    src={image.image}
                    alt={image.title}
                    style={{ width: "200px", height: "auto" }}
                  />
                  <p>{image.title}</p>
                  <button onClick={() => handleDelete(image.eventId)}>Delete</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No images available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
