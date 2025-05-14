const TargetSelect = ({ scenes, popupData, setPopupData, hotspotData, isDropdownOpen, setIsDropdownOpen }) => {
    const hotspot = scenes.find(scene => scene.tour_id === popupData.sceneId) || scenes[0];
    const targetHotspots = hotspot?.hotSpots || [];

    console.log({scenes, hotspot, id: popupData.sceneId});

    return (
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
                            {targetHotspots.map((spot, index) => (
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
    );
};

export default TargetSelect;