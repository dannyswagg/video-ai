import React from "react";
import { useState, useEffect } from "react";
// import search from "../../assets/img/search.png";
import "./searchBar.css";
import useSlidesStore from "../../store/useSlidesStore";
import axios from "axios";

const ASPECT_RATIO = 16 / 9;
const DEFAULT_HEIGHT = 250;
const API_KEY = "JERuP3DyRWnvRki7QMAEoWwXveDZw4RWsSwrT5IyMXRHcOiGRGvsK6gC";
const API_URL = "https://api.pexels.com/videos/search";

const GraphicToolbox = () => {
  const [curatedVideos, setCuratedVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  console.log(searchResults);

  // Use current slide to display here
  const slides = useSlidesStore((state) => state.slides);
  const currentSlide = useSlidesStore((state) => state.currentSlide);
  const currentSlideIndex = useSlidesStore((state) => state.currentSlideIndex);
  const updateCurrentSlide = useSlidesStore(
    (state) => state.updateCurrentSlide
  );
  const updateSlides = useSlidesStore((state) => state.updateSlides);
  // console.log(data);

  // Load curated photos on component mount
  React.useEffect(() => {
    axios
      .get("https://api.pexels.com/videos/popular?per_page=10&quality=low", {
        headers: { Authorization: API_KEY },
      })
      .then((response) => setCuratedVideos(response.data.videos))
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
            `${API_URL}?query=${searchTerm}&page=1&per_page=10&quality=low`,
            {
              headers: {
                Authorization: API_KEY,
              },
            }
          );
          const data = await response.json();
          setSearchResults(data.videos);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const handleLoadMore = async () => {
    setPage(page + 1);
    try {
      const response = await fetch(
        `${API_URL}?query=${searchTerm}&page=${
          page + 1
        }&per_page=10&quality=low`,
        {
          headers: {
            Authorization: API_KEY,
          },
        }
      );
      const data = await response.json();
      setSearchResults(data.url);
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

  // This function is to handle image file selection REAL
  const handleVideoFile = (videoLink) => {
    console.log(videoLink);
    // const locate = new URL(event.target.src);
    fetch(videoLink)
      .then((response) => response.blob())
      .then((blob) => {
        const file = new File([blob], "filename.mp4", {
          type: "video/mp4",
        });
        let isImage = file?.type?.startsWith("image/");
        const url = window.URL.createObjectURL(file);
        const element = document.createElement("video");
        const newImage = {
          id: Date.now(),
          image: element,
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
        if (!isImage) {
          let source = document.createElement("source");
          source.type = "video/mp4";
          source.url = url;
          element.appendChild(source);
        }
        element.onload = () => {
          window.URL.revokeObjectURL(url);
          // Update the slides array
          const index = currentSlideIndex;
          const newSlides =
            slides?.map((obj, idx) => (idx === index ? slide : obj)) ?? [];
          updateSlides(newSlides);
        };
        if (isImage) {
          element.src = url;
        } else {
          element.getElementsByTagName("source")[0].src = url;
          element.play();
        }
        updateCurrentSlide(slide);
        updateSlides();
      });
  };

  // const handleVideoFile = (event) => {
  //   const videoUrl = new URL(event.target.src);
  //   fetch(videoUrl)
  //     .then((response) => response.blob())
  //     .then((blob) => {
  //       const file = new File([blob], "filename", {
  //         type: blob.type,
  //       });
  //       const url = window.URL.createObjectURL(file);
  //       const element = document.createElement("video");
  //       const newVideo = {
  //         id: Date.now(),
  //         video: element,
  //         previewImage: file,
  //         x: 0,
  //         y: 0,
  //         height: DEFAULT_HEIGHT,
  //         width: DEFAULT_HEIGHT * ASPECT_RATIO,
  //       };
  //       let slide = { ...currentSlide };
  //       slide = {
  //         ...slide,
  //         images: [...slide.images, newVideo],
  //         previewImages: [...slide.previewImages, newVideo],
  //       };

  //       const source = document.createElement("source");
  //       source.type = "video/mp4";
  //       source.src = url;
  //       element.appendChild(source);

  //       element.onload = () => {
  //         window.URL.revokeObjectURL(url);
  //         // Update the slides array
  //         const index = currentSlideIndex;
  //         const newSlides =
  //           slides?.map((obj, idx) => (idx === index ? slide : obj)) ?? [];
  //         updateSlides(newSlides);
  //       };

  //       element.getElementsByTagName("source")[0].src = url;
  //       element.play();
  //       updateCurrentSlide(slide);
  //       updateSlides();
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     })
  //     .finally(() => {
  //       console.log("Request Complete");
  //     });
  // };

  // const handleImageFileSelect = (event) => {
  //   const file = event.target.files[0];
  //   if (!file?.type?.startsWith("image/")) {
  //     console.log("Please select an image file.");
  //     return;
  //   }
  //   const url = window.URL.createObjectURL(file);
  //   const img = new window.Image();
  //   const newImage = {
  //     id: Date.now(),
  //     image: img,
  //     previewImage: file,
  //     x: 0,
  //     y: 0,
  //     height: DEFAULT_HEIGHT,
  //     width: DEFAULT_HEIGHT * ASPECT_RATIO,
  //   };
  //   let slide = { ...currentSlide };
  //   slide = {
  //     ...slide,
  //     images: [...slide.images, newImage],
  //     previewImages: [...slide.previewImages, newImage],
  //   };
  //   img.onload = () => {
  //     window.URL.revokeObjectURL(url);
  //     // Update the slides array
  //     const index = currentSlideIndex;
  //     const newSlides =
  //       slides?.map((obj, idx) => (idx === index ? slide : obj)) ?? [];
  //     updateSlides(newSlides);
  //   };
  //   img.src = url;
  //   updateCurrentSlide(slide);
  //   updateSlides();
  // };

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
      <div className="toolbox_title">Search Videos</div>
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
          placeholder="Search Videos Here"
        />
        {loading ? (
          <h5>Loading Videos</h5>
        ) : searchResults.length > 0 ? (
          <div className="card">
            {searchResults.map((item) => {
              return (
                <div onClick={() => console.log("Hello World")}>
                  <video
                    className="video"
                    key={item.video_files[0].id}
                    width={130}
                    height={130}
                  >
                    <source
                      src={item.video_files[0].link}
                      onClick={() => handleVideoFile(item.video_files[0].link)}
                      type={item.video_files.file_type}
                    />
                  </video>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card">
            {curatedVideos.map((item) => (
              <div onClick={() => handleVideoFile(item.video_files[0].link)}>
                <video
                  className="video"
                  key={item.video_files[0].id}
                  width={130}
                  height={130}
                >
                  <source
                    src={item.video_files[0].link}
                    onClick={() => handleVideoFile(item.video_files[0].link)}
                    type={item.video_files.file_type}
                  />
                </video>
              </div>
            ))}
          </div>
        )}
        {searchResults.length > 0 && (
          <button onClick={handleLoadMore} className="ant-btn ant-btn-primary">
            Load More
          </button>
        )}
      </div>
    </>
  );
};
export default GraphicToolbox;
