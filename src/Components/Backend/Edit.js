import { useBlockProps } from "@wordpress/block-editor";
import { useState } from "react";
import { withSelect } from "@wordpress/data";
import Style from "../Common/Style";
// import TourViewer from "../Common/TourViewer";
import Settings from "./Settings/Settings";
import EditDelete from "../Common/EditDelete";

const Edit = (props) => {
  const { attributes, setAttributes, clientId, device, isSelected } = props;
const isPremium = true;
const [currentScene, setCurrentScene] = useState(null);
  return (
    <>
    <Settings {...{
            attributes,
            setAttributes,
            device,
            isPremium,
            setCurrentScene
          }} />
      <div {...useBlockProps()}>
        <Style attributes={attributes} id={`block-${clientId}`} device={device}/>

        {!isSelected && <div className="bPlBlockBeforeSelect"></div>}
      
        {/* <TourViewer {...{ attributes, setAttributes }} isBackend={true} /> */}
        <EditDelete {...{ attributes, setAttributes, isBackend: true, currentScene }}/> 
      
      </div>
    </>
  );
};

export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase() || 'desktop',
	};
})(Edit);
