// import { Bucket } from "../../assets/icons/Bucket";
import { Gallery } from "../../assets/icons/Gallery";
import { Text } from "../../assets/icons/Text";
import { Play } from "../../assets/icons/Play";
import "./Sidebar.scss";

function Sidebar({ activeItem, setActiveItem }) {
  return (
    <div className="sidebar">
      <ul className="sidebar__list">
        <li
          className={
            activeItem === "upload"
              ? "sidebar__list__item active upload_nav"
              : "sidebar__list__item upload_nav"
          }
          onClick={() => setActiveItem("upload")}
        >
          <Gallery />
          <span>Upload</span>
        </li>
        <li
          className={
            activeItem === "media"
              ? "sidebar__list__item active media_nav"
              : "sidebar__list__item media_nav"
          }
          onClick={() => setActiveItem("media")}
        >
          <Gallery />
          <span>Images</span>
        </li>
        <li
          className={
            activeItem === "text"
              ? "sidebar__list__item active text_nav"
              : "sidebar__list__item text_nav"
          }
          onClick={() => setActiveItem("text")}
        >
          <Text />
          <span>Text</span>
        </li>

        {/* @TODO : Commenting the Graphics navbar since its not used currently  */}

        <li
          className={
            activeItem === "graphics"
              ? "sidebar__list__item active"
              : "sidebar__list__item"
          }
          onClick={() => setActiveItem("graphics")}
        >
          <Gallery />
          <span>Videos</span>
        </li>

        <li
          className={
            activeItem === "music"
              ? "sidebar__list__item active music_nav"
              : "sidebar__list__item music_nav"
          }
          onClick={() => setActiveItem("music")}
        >
          <Play />
          <span>Music</span>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
