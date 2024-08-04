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
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/admin/gallery`);
      if (!response.ok) {
        throw new Error("Failed to fetch images.");
      }
      const result = await response.json();
      setImages(result);
    } catch (error) {
      setStatusMessage(error.message || "An error occurred while fetching images.");
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/admin/gallery`, {
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

  // Handle image delete
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/admin/gallery?id=${id}`, {
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
    return <Unauthorized />;
  }

  return (
    <div className="flex w-full h-screen flex-row text-xl">
      <NAV />
      <div className="flex flex-col w-full gap-5 h-screen p-5">
        <h1>Gallery</h1>
        <form onSubmit={handleUpload}>
          <div>
            <label>
              Title:
              <input
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
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Description:
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Image:
              <input type="file" onChange={handleFileChange} accept="image/*" required />
            </label>
          </div>
          <button type="submit">Upload</button>
        </form>
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
                  <button onClick={() => handleDelete(image.imageId)}>Delete</button>
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
