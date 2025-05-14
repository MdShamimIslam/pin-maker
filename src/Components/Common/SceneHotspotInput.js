import {SelectControl} from '@wordpress/components';

const SceneHotspotInput = ({scenes,setAttributes,popupData,setPopupData,hotspotData,isDropdownOpen,setIsDropdownOpen}) => {
    return (
        <>
            {hotspotData.length > 0 ?
                <div className='sceneWrap'>
                    <div className='sceneWrapChild'>
                        <label htmlFor="hotspotText" className='label'>Scene : </label>
                        <div>
                        <SelectControl
                                className="sceneSlBtn"
                                value={popupData.sceneId || ''}
                                onChange={(val) => {
                                    setPopupData({ 
                                        ...popupData, 
                                        sceneId: val,
                                        type: 'scene'
                                    });
                                    const updatedHotspotData = hotspotData.map(spot => {
                                        if (spot === popupData.targetHotspot) {
                                            return {
                                                ...spot,
                                                sceneId: val,
                                                type: 'scene'
                                            };
                                        }
                                        return spot;
                                    });
                                    setAttributes({ hotspotData: updatedHotspotData });
                                }}
                                options={scenes.map(scene => ({
                                    label: scene.tour_id,
                                    value: scene.tour_id
                                }))}
                            />
                            <p className="dropdown-label">Choose the Scene</p>
                        </div>
                    </div>
                    <div className='sceneWrapChild'>
                        <label htmlFor="hotspotText" className='label'>Target : </label>
                        <div>
                            <div className="dropdown-container">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="sceneSlBtn"
                                >
                                    <div className="icon-container">
                                        {popupData.targetHotspot
                                            ? popupData.targetHotspot.text || `Hotspot ${hotspotData.indexOf(popupData.targetHotspot) + 1}`
                                            : 'Select a target'}
                                    </div>
                                    <span className="dropdown-arrow">▼</span>
                                </button>

                                {isDropdownOpen && (
                                    <div className="dropdown-list">
                                        {hotspotData.map((spot, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setPopupData({
                                                        ...popupData,
                                                        text: spot.text || `Hotspot ${index + 1}`,
                                                        targetHotspot: spot
                                                    });
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`dropdown-item ${spot === popupData.targetHotspot ? 'active' : ''}`}
                                            >
                                                <span className={`hotspot-icon ${spot.type === 'scene' ? 'scene' : 'info'}`}>
                                                    {spot.type === 'scene' ? '↑' : 'i'}
                                                </span>
                                                {spot.text || `Hotspot ${index + 1}`}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <p className="dropdown-label">Choose the target</p>
                        </div>
                    </div>
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
                            <p className="input-description">
                                Enter a label
                            </p>
                        </div>
                    </div>
                </div> : <p className='hotspotAddFirst'> Please add a hotspot first to continue </p>
            }
        </>

    );
};

export default SceneHotspotInput;