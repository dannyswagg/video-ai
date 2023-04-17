import { Slider } from "antd";
import { PlayBold } from "../../assets/icons/PlayBold";
import { MusicBold } from "../../assets/icons/MusicBold";
import { TextBold } from "../../assets/icons/TextBold";
import { ZoomIn } from "../../assets/icons/ZoomIn";
import { ZoomOut } from "../../assets/icons/ZoomOut";
import tl1 from "../../assets/img/tl1.png";
import tl2 from "../../assets/img/tl2.png";
import tl3 from "../../assets/img/tl3.png";
import tl4 from "../../assets/img/tl4.png";
import tl5 from "../../assets/img/tl5.png";
import audioscrub from "../../assets/img/audioscrub.png";
import textscrub from "../../assets/img/textscrub.png";
import "./Timeline.scss";

function Timeline() {
  return (
    <div className="timeline">
      <div className="timeline__left">
        <PlayBold />
        <MusicBold />
        <TextBold />
      </div>
      <div className="timeline__mid">
        <div className="timeline__mid__grid">
          <div>0:00s</div>
          <div>0:20s</div>
          <div>0:40s</div>
          <div>1:00s</div>
          <div>1:20s</div>
          <div>1:40s</div>
          <div>2:00s</div>
          <div>2:20s</div>
          <div>2:40s</div>
          <div>3:00s</div>
          <div>3:20s</div>
          <div>3:40s</div>
          <div>4:00s</div>
          <div>4:20s</div>
          <div>4:40s</div>
          <div>5:00s</div>
          <div>5:20s</div>
          <div>5:40s</div>
          <div>6:00s</div>
          <div>6:20s</div>
          <div>6:40s</div>
          <div>7:00s</div>
          <div>7:20s</div>
          <div>7:40s</div>
        </div>
        <div className="timeline__mid__images">
          <img src={tl1} alt="" />
          <img src={tl2} alt="" />
          <img src={tl3} alt="" />
          <img src={tl4} alt="" />
          <img src={tl5} alt="" />
        </div>
        <div className="timeline__mid__audio">
          <img src={audioscrub} alt="audio" />
        </div>
        <div className="timeline__mid__audio">
          <img src={textscrub} alt="text" />
        </div>
      </div>
      <div className="timeline__right">
        <ZoomIn />
        <div>
          <Slider vertical range step={10} defaultValue={[20, 50]} />
        </div>
        <ZoomOut />
      </div>
    </div>
  );
}

export default Timeline;