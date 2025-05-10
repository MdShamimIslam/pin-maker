import { useBlockProps } from "@wordpress/block-editor";
import { withSelect } from "@wordpress/data";
import Style from "../Common/Style";
import TourViewer from "../Common/TourViewer";
import Settings from "./Settings/Settings";

const Edit = (props) => {
  const { attributes, setAttributes, clientId, device, isSelected } = props;
const isPremium = true;
  return (
    <>
    <Settings {...{
            attributes,
            setAttributes,
            device,
            isPremium
          }} />
      <div {...useBlockProps()}>
        <Style attributes={attributes} id={`block-${clientId}`} device={device}/>

        {!isSelected && <div className="bPlBlockBeforeSelect"></div>}
      
        <TourViewer {...{ attributes, setAttributes }} isBackend={true} /> 
      
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
