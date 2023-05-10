import React from "react";
import { DeleteOutlined } from "@ant-design/icons";
import useSlidesStore from "../../store/useSlidesStore";
import "../Toolbox/searchBar.css";

const ASPECT_RATIO = 16 / 9;
const DEFAULT_HEIGHT = 250;

function UploadToolbox() {
  // Use current slide to display here
  const slides = useSlidesStore((state) => state.slides);
  const currentSlide = useSlidesStore((state) => state.currentSlide);
  const currentSlideIndex = useSlidesStore((state) => state.currentSlideIndex);
  const updateCurrentSlide = useSlidesStore(
    (state) => state.updateCurrentSlide
  );
  const updateSlides = useSlidesStore((state) => state.updateSlides);

  // This function is to handle image file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (
      !(file?.type?.startsWith("image/") || file?.type?.startsWith("video/"))
    ) {
      console.log("Please select an image file.");
      return;
    }
    let isImage = file?.type?.startsWith("image/");
    const url = window.URL.createObjectURL(file);
    const element = isImage
      ? new window.Image()
      : document.createElement("video");
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
      source.type = "video/ogg";
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
  };

  // This function is used to delete the image media on click of delete
  const deleteImageItem = (index) => {
    const newImageList = [...currentSlide.images];
    newImageList.splice(index, 1);
    const newPreviewImageList = [...currentSlide.previewImages];
    newPreviewImageList.splice(index, 1);
    const newSlide = {
      ...currentSlide,
      images: newImageList,
      previewImages: newPreviewImageList,
    };
    updateCurrentSlide(newSlide);
    const idx = currentSlideIndex;
    const newSlides =
      slides?.map((obj, i) => (idx === idx ? newSlide : obj)) ?? [];
    updateSlides(newSlides);
  };

  return (
    <>
      <div className="toolbox_title">Add Media</div>
      <div className="image_toolbox_container">
        <label htmlFor="Upload image">Image File</label>
        <input
          onChange={handleFileSelect}
          accept="image/*,video/*"
          type="file"
        />
        {currentSlide?.previewImages?.length ? (
          <div className="image_list video_list">
            {currentSlide?.previewImages?.map((file, i) => (
              <div className="image_item" key={i}>
                {file.image.nodeName == "IMG" ? (
                  <img
                    alt="preview"
                    src={URL.createObjectURL(file.previewImage)}
                    width="60"
                    height="60"
                  />
                ) : (
                  <video width="60" height="60">
                    <source
                      src={URL.createObjectURL(file.previewImage)}
                      width="60"
                      height="60"
                    />
                  </video>
                )}
                <DeleteOutlined onClick={() => deleteImageItem(i)} />
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default UploadToolbox;
