import React, { useState, useEffect } from "react";
// import { DeleteOutlined } from "@ant-design/icons";
import useSlidesStore from "../../store/useSlidesStore";
import "../Toolbox/searchBar.css";
import axios from "axios";

const ASPECT_RATIO = 16 / 9;
const DEFAULT_HEIGHT = 250;
const API_KEY = "JERuP3DyRWnvRki7QMAEoWwXveDZw4RWsSwrT5IyMXRHcOiGRGvsK6gC";
const API_URL = "https://api.pexels.com/v1/search";

function MediaToolbox() {
  const [curatedPhotos, setCuratedPhotos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Use current slide to display here
  const slides = useSlidesStore((state) => state.slides);
  const currentSlide = useSlidesStore((state) => state.currentSlide);
  const currentSlideIndex = useSlidesStore((state) => state.currentSlideIndex);
  const updateCurrentSlide = useSlidesStore(
    (state) => state.updateCurrentSlide
  );
  const updateSlides = useSlidesStore((state) => state.updateSlides);

  // Load curated photos on component mount
  useEffect(() => {
    axios
      .get("https://api.pexels.com/v1/curated?per_page=12", {
        headers: { Authorization: API_KEY },
      })
      .then((response) => setCuratedPhotos(response.data.photos))
      .catch((error) => console.error(error));
  }, []);

  //This function is to get photos from pexels api starts here
  const handleSearch = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setSearchResults([]);
      setPage(1);
      if (searchTerm) {
        setLoading(true);
        try {
          const response = await fetch(
            `${API_URL}?query=${searchTerm}&page=1&per_page=12`,
            {
              headers: {
                Authorization: API_KEY,
              },
            }
          );
          const data = await response.json();
          setSearchResults(data.photos);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleLoadMore = async () => {
    setPage(page + 1);
    try {
      const response = await fetch(
        `${API_URL}?query=${searchTerm}&page=${page + 1}&per_page=12`,
        {
          headers: {
            Authorization: API_KEY,
          },
        }
      );
      const data = await response.json();
      setSearchResults(data.photos);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page > 1) {
      handleLoadMore();
    }
  }, [page]);
  //This function is to get photos from pexels api ends here

  // This function is to handle image file selection
  const handleImageFileSelect = (event) => {
    const locate = new URL(event.target.src);
    fetch(locate)
      .then((response) => response.blob())
      .then((blob) => {
        const file = new File([blob], "filename", { type: blob.type });
        const url = window.URL.createObjectURL(file);
        const img = new window.Image();
        const newImage = {
          id: Date.now(),
          image: img,
          previewImage: file,
          x: 0,
          y: 0,
          height: DEFAULT_HEIGHT,
          width: DEFAULT_HEIGHT * ASPECT_RATIO,
        };
        let slide = { ...currentSlide };
        slide = {
          ...slide,
          images: [...slide.images, newImage],
          previewImages: [...slide.previewImages, newImage],
        };
        img.onload = () => {
          window.URL.revokeObjectURL(url);
          // Update the slides array
          const index = currentSlideIndex;
          const newSlides =
            slides?.map((obj, idx) => (idx === index ? slide : obj)) ?? [];
          updateSlides(newSlides);
        };
        img.src = url;
        updateCurrentSlide(slide);
        updateSlides();
      });
  };

  // This function is used to delete the image media on click of delete
  // const deleteImageItem = (index) => {
  //   const newImageList = [...currentSlide.images];
  //   newImageList.splice(index, 1);
  //   const newPreviewImageList = [...currentSlide.previewImages];
  //   newPreviewImageList.splice(index, 1);
  //   const newSlide = {
  //     ...currentSlide,
  //     images: newImageList,
  //     previewImages: newPreviewImageList,
  //   };
  //   updateCurrentSlide(newSlide);
  //   const idx = currentSlideIndex;
  //   const newSlides =
  //     slides?.map((obj, i) => (idx === idx ? newSlide : obj)) ?? [];
  //   updateSlides(newSlides);
  // };

  return (
    <>
      <div className="toolbox_title">Search Images</div>
      <div className="image_toolbox_container">
        {/*
        <label htmlFor="Upload image">Image File</label>
        <input
          onChange={handleImageFileSelect}
          accept="image/*"
          type="file"
          name=""
          id=""
        />
        {currentSlide?.previewImages?.length ? (
          <div className="image_list">
            {currentSlide?.previewImages?.map((img, i) => (
              <div className="image_item" key={i}>
                <img
                  alt="preview"
                  src={URL.createObjectURL(img.previewImage)}
                  width="60"
                  height="60"
                />
                <DeleteOutlined onClick={() => deleteImageItem(i)} />
              </div>
            ))}
          </div>
        ) : (
          ''
        )} */}
        <input
          className="input-select"
          onKeyPress={handleSearch}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          placeholder="Search for images"
        />
        {loading ? (
          <h5>Fetching Images...</h5>
        ) : searchResults.length > 0 ? (
          <div className="card">
            {searchResults.map((item) => {
              return (
                <div key={item.id} style={{ width: "100%" }}>
                  <img
                    onClick={handleImageFileSelect}
                    src={item.src.large}
                    alt={item.id}
                    width={130}
                    height={130}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card">
            {curatedPhotos.map((photo) => (
              <img
                onClick={handleImageFileSelect}
                key={photo.id}
                src={photo.src.large}
                alt={photo.photographer}
                width={130}
                height={130}
              />
            ))}
          </div>
        )}
        {searchResults.length > 0 && (
          <button onClick={handleLoadMore} className="ant-btn ant-btn-primary">
            Load more
          </button>
        )}
      </div>
    </>
  );
}

export default MediaToolbox;
