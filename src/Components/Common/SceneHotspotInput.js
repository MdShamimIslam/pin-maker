import SceneSelect from "./SceneSelect";
import TargetSelect from "./TargetSelect";

const SceneHotspotInput = ({ scenes, setAttributes, popupData, setPopupData, hotspotData, isDropdownOpen, setIsDropdownOpen }) => {
    return (
        <>
            {hotspotData.length > 0 ?
                <div className='sceneWrap'>
                    <SceneSelect {...{ scenes, popupData, setPopupData, setAttributes, hotspotData }} />
                    <TargetSelect {...{ scenes,popupData, setPopupData, hotspotData, isDropdownOpen, setIsDropdownOpen }} />
                    <div className="input-container">
                        <label htmlFor="hotspotText" className="input-label">Label : </label>
                        <div>
                            <input
                                id="hotspotText"
                                type="text"
                                placeholder="Input type text..."
                                value={popupData.text}
                                onChange={(e) => setPopupData({ ...popupData, text: e.target.value })}
                                className="input-field"
                            />
                            <p className="input-description"> Enter a label </p>
                        </div>
                    </div>
                </div> : <p className='hotspotAddFirst'> Please add a hotspot first to continue </p>
            }
        </>
    );
};

export default SceneHotspotInput;