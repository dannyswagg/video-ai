import Konva from 'konva';
import React, { useEffect, useRef, useState } from 'react';
import { Layer, Rect, Stage, Text } from 'react-konva';
import useSlidesStore from '../../store/useSlidesStore';
import ResizableImage from '../ImageResize/ResizableImage';
import './Viewport.scss';

function Viewport() {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  });
  const play = useSlidesStore((state) => state.play);
  const updatePlay = useSlidesStore((state) => state.updatePlay);
  const isRecording = useSlidesStore((state) => state.isRecording);
  const updateIsRecording = useSlidesStore((state) => state.updateIsRecording);
  const totalDuration = useSlidesStore((state) => state.totalDuration);
  const audioSelected = useSlidesStore((state) => state.audio);

  // Use current slide to display here
  const slides = useSlidesStore((state) => state.slides);
  const currentSlide = useSlidesStore((state) => state.currentSlide);
  const currentSlideIndex = useSlidesStore((state) => state.currentSlideIndex);
  const updateCurrentSlide = useSlidesStore(
    (state) => state.updateCurrentSlide
  );
  const updateSlides = useSlidesStore((state) => state.updateSlides);
  const divRef = useRef(null);
  const stageRef = useRef(null);
  const myRefs = useRef([]);
  const textRef = useRef(null);

  useEffect(() => {
    if (divRef.current?.offsetHeight && divRef.current?.offsetWidth) {
      setDimensions({
        width: divRef.current.offsetWidth,
        height: divRef.current.offsetHeight
      });
    }
  }, []);

  // This function is called after text dragging is ended
  const handleTextDragEnd = (event, index) => {
    const textNode = event.target;
    const newTextList = [...currentSlide.texts];
    const text = {
      ...newTextList[index],
      x: textNode.attrs.x,
      y: textNode.attrs.y
    };

    newTextList[index] = text;
    const newSlide = {
      ...currentSlide,
      texts: newTextList
    };
    updateCurrentSlide(newSlide);
    const newSlides =
      slides?.map((obj, i) => (i === currentSlideIndex ? newSlide : obj)) ?? [];
    updateSlides(newSlides);
  };

  // This function is called after image dragging is ended

  const handleImageDragEnd = (event, img, index) => {
    const imageNode = event.target;
    const newImageList = [...currentSlide.images];
    const image = {
      ...newImageList[index],
      x: imageNode.attrs.x,
      y: imageNode.attrs.y
    };

    newImageList[index] = image;
    const newPreviewImageList = [...currentSlide.previewImages];
    newPreviewImageList[index] = image;

    const newSlide = {
      ...currentSlide,
      images: newImageList,
      previewImages: newPreviewImageList
    };
    updateCurrentSlide(newSlide);
    const newSlides =
      slides?.map((obj, i) => (i === currentSlideIndex ? newSlide : obj)) ?? [];
    updateSlides(newSlides);
  };

  // This function is used to remove the text and set size to minimum so the animation can work on those text
  const removeAnimationBeforePlaying = () => {
    const allTexts = currentSlide?.texts?.map((text) => {
      return { ...text, fontSize: 1 };
    });
    const newSlide = { ...currentSlide, texts: allTexts };
    updateCurrentSlide(newSlide);
  };

  const playAnimation = () => {
    removeAnimationBeforePlaying();
    setTimeout(() => {
      startAnimation();
    }, 500);
  };

  const startAnimation = () => {
    const t = currentSlide?.texts?.map((text, i) => {
      // Render Animation in two steps first remove the animation by
      // adding font 0 and then add the new font
      const tween = new Konva.Tween({
        node: myRefs?.current[i],
        duration: text.duration,
        easing: Konva.Easings[text.inAnimation],
        fontSize: parseInt(text.size)
      });

      tween.play();
      return { ...text, fontSize: text.size, size: text.size };
    });

    const newTween = new Konva.Tween({
      node: textRef.current,
      duration: parseInt(currentSlide.duration + 1),
      easing: Konva.Easings['EaseIn'],
      fontSize: 2,
      onFinish: async () => {
        updatePlay(false);
      }
    });
    newTween.play();
    const newSlide = { ...currentSlide, texts: t };
    updateCurrentSlide(newSlide);
    const index = currentSlideIndex;
    const newSlides = slides.map((obj, idx) =>
      idx === index ? newSlide : obj
    );
    updateSlides(newSlides);
    setTimeout(() => {
      console.log('Playing animation stopped');
      updatePlay(false);
    }, parseInt(totalDuration - 0.5) * 1000);
  };

  const recordVideo = async () => {
    try {
      if (!audioSelected) {
        updatePlay(false);
        updateIsRecording(false);
        alert('No Audio Selecte, Audio is mandatory');
        return;
      }
    } catch (error) {
      alert('Failed to record video');
      updatePlay(false);
      updateIsRecording(false);
    }
  };

  const handleResizeimage = (event, img, index) => {
    const newImageList = [...currentSlide.images];
    const image = {
      ...img
    };

    newImageList[index] = image;
    const newPreviewImageList = [...currentSlide.previewImages];
    newPreviewImageList[index] = image;
    const newSlide = {
      ...currentSlide,
      images: newImageList,
      previewImages: newPreviewImageList
    };
    updateCurrentSlide(newSlide);
    const newSlides =
      slides?.map((obj, i) => (i === currentSlideIndex ? newSlide : obj)) ?? [];
    updateSlides(newSlides);
  };

  useEffect(() => {
    if (play) {
      playAnimation();
    }
  }, [play]);

  useEffect(() => {
    if (isRecording) {
      recordVideo();
    }
  }, [isRecording]);

  return (
    <div ref={divRef} className="viewport">
      <Stage
        className="konvajs_stage  konva_current_canvas"
        width={dimensions.width}
        height={dimensions.height}
        ref={stageRef}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            fill={currentSlide?.backgroundColor ?? '#fff'}
            width={dimensions.width - 3}
            height={dimensions.height - 3}
          ></Rect>

          {currentSlide?.images?.map((img, i) => (
            <React.Fragment key={i}>
              <ResizableImage
                src={img.image}
                onChange={handleResizeimage}
                onDragEnd={handleImageDragEnd}
                imageDetails={img}
                index={i}
              />
            </React.Fragment>
          ))}
          {currentSlide?.texts.map((text, i) => (
            <Text
              key={i}
              ref={(el) => (myRefs.current[i] = el)}
              onDragEnd={(e) => handleTextDragEnd(e, i)}
              text={text.text}
              fontSize={text.fontSize}
              fill={text.colour}
              draggable={true}
              x={text.x}
              y={text.y}
              textDecoration={text.textDecoration}
              fontStyle={text.fontStyle}
              align={text.align}
              onDblClick={(e) => {
                let element = e.target;
                element.hide();
                var textarea = document.createElement("textarea");
                var px = 0;
                var isFirefox =
                  navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
                if (isFirefox) {
                  px += 2 + Math.round(element.fontSize() / 20);
                }
                let rect = document
                  .getElementsByTagName("canvas")[0]
                  .getBoundingClientRect();
                document.body.appendChild(textarea);
                textarea.value = element.attrs.text;
                textarea.style.fontSize = element.fontSize() + "px";
                textarea.style.position = "absolute";
                textarea.style.top = element.attrs.y + rect.y + "px";
                textarea.style.left = element.attrs.x + rect.x + "px";
                textarea.addEventListener("keydown", function (e) {
                  if (e.keyCode === 13) {
                    element.text(textarea.value);
                    document.body.removeChild(textarea);
                    element.show();
                  }
                });
              }}
              />
          ))}

          <Text
            fontStyle="italic"
            key={'123'}
            fontSize={1}
            text="."
            ref={textRef}
            draggable={true}
            x={0}
            y={0}
          ></Text>
        </Layer>
      </Stage>
    </div>
  );
}

export default Viewport;
