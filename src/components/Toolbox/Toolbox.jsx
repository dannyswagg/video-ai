import "./Toolbox.scss";
import MediaToolbox from "./MediaToolbox";
import TextToolbox from "./TextToolbox";
import GraphicToolbox from "./GraphicToolbox";
import UploadToolbox from "./UploadToolbox";
import MusicToolbox from "./MusicToolbox";

function Toolbox({ activeItem: toolbox }) {
  return (
    <div className="toolbox">
      {toolbox === "text" && <TextToolbox />}
      {toolbox === "media" && <MediaToolbox />}
      {toolbox === "graphics" && <GraphicToolbox />}
      {toolbox === "upload" && <UploadToolbox />}
      {toolbox === "music" && <MusicToolbox />}
    </div>
  );
}

export default Toolbox;
