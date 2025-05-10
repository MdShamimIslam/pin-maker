import React, { useState, useEffect, useRef } from 'react';
import panoImg from '../../../public/assets/panorama.jpg';

const TourViewer = ({ attributes, setAttributes, isBackend = false }) => {
    const { hotspotData = [] } = attributes;
    const panoRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [tempHotspot, setTempHotspot] = useState(null);
    const [popupData, setPopupData] = useState(null);
    const [isDraggingHotspot, setIsDraggingHotspot] = useState(false);
    const viewerRef = useRef(null);
    const clickStartCoords = useRef(null);
    const isDraggingRef = useRef(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = panoImg;
        img.onload = () => setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!isLoaded || !window.pannellum || !panoRef.current) return;

        const prevViewer = panoRef.current.viewerInstance;
        let currentPitch = 0;
        let currentYaw = 0;
        let currentHfov = 100;

        if (prevViewer) {
            currentPitch = prevViewer.getPitch();
            currentYaw = prevViewer.getYaw();
            currentHfov = prevViewer.getHfov();
            prevViewer.destroy();
        }

        const viewer = window.pannellum.viewer(panoRef.current, {
            type: "equirectangular",
            panorama: panoImg,
            autoLoad: true,
            hotSpots: hotspotData.map((spot) => ({
                pitch: spot.pitch,
                yaw: spot.yaw,
                type: spot.type || "info",
                text: spot.text,
                clickHandlerFunc: () => {
                    if (spot.type === 'scene' && spot.lookAt) {
                        viewer.lookAt(spot.lookAt.pitch, spot.lookAt.yaw);
                    } else {
                        viewer.lookAt(spot.pitch, spot.yaw);
                    }
                },
            })),
        });
        window.viewer = viewer;

        viewerRef.current = viewer;
        viewer.lookAt(currentPitch, currentYaw, currentHfov);
        panoRef.current.viewerInstance = viewer;

        if (tempHotspot) {
            addTempHotspot(viewer, tempHotspot);
        }

        viewer.on("mousedown", (event) => {
            if (popupData || isDraggingHotspot) return;

            clickStartCoords.current = {
                x: event.clientX,
                y: event.clientY,
                time: Date.now(),
            };
        });

        viewer.on("mouseup", (event) => {
            if (!clickStartCoords.current || popupData || isDraggingHotspot) return;

            const isClick =
                Math.abs(event.clientX - clickStartCoords.current.x) < 5 &&
                Math.abs(event.clientY - clickStartCoords.current.y) < 5 &&
                Date.now() - clickStartCoords.current.time < 200;

            if (isClick) {
                const coords = viewer.mouseEventToCoords(event);
                setTempHotspot({
                    pitch: coords[0],
                    yaw: coords[1],
                });
            }

            clickStartCoords.current = null;
        });

        return () => {
            if (viewer) viewer.destroy();
        };
    }, [isLoaded, hotspotData]);

    useEffect(() => {
        if (isBackend && tempHotspot && viewerRef.current) {
            addTempHotspot(viewerRef.current, tempHotspot);
        }
    }, [tempHotspot]);

    const addTempHotspot = (viewer, hotspot) => {
        viewer.removeHotSpot("temp-hotspot");

        viewer.addHotSpot({
            id: "temp-hotspot",
            pitch: hotspot.pitch,
            yaw: hotspot.yaw,
            type: "custom",
            cssClass: "add-hotspot-icon",
            createTooltipFunc: (hotSpotDiv) => {
                hotSpotDiv.innerHTML = "+";
                hotSpotDiv.style.cursor = "move";

                let startX, startY;
                let startPitch, startYaw;

                const handleMouseDown = (e) => {
                    e.stopPropagation();
                    isDraggingRef.current = false;
                    startX = e.clientX;
                    startY = e.clientY;
                    startPitch = hotspot.pitch;
                    startYaw = hotspot.yaw;
                    setIsDraggingHotspot(false);
                };

                const handleMouseMove = (e) => {
                    const dx = Math.abs(e.clientX - startX);
                    const dy = Math.abs(e.clientY - startY);

                    if (dx > 5 || dy > 5) {
                        isDraggingRef.current = true;
                        setIsDraggingHotspot(true);

                        const sensitivity = 0.3;
                        const moveX = (e.clientX - startX) * sensitivity;
                        const moveY = (startY - e.clientY) * sensitivity;

                        const newPitch = Math.max(-90, Math.min(90, startPitch + moveY));
                        const newYaw = (startYaw + moveX) % 360;

                        setTempHotspot({ pitch: newPitch, yaw: newYaw });
                    }
                };

                const handleMouseUp = () => {
                    if (!isDraggingRef.current) {
                        setPopupData({
                            pitch: hotspot.pitch,
                            yaw: hotspot.yaw,
                            text: "",
                        });
                    }
                    isDraggingRef.current = false;
                    setIsDraggingHotspot(false);
                    document.removeEventListener("mousemove", handleMouseMove);
                    document.removeEventListener("mouseup", handleMouseUp);
                };

                hotSpotDiv.addEventListener("mousedown", (e) => {
                    handleMouseDown(e);
                    document.addEventListener("mousemove", handleMouseMove);
                    document.addEventListener("mouseup", handleMouseUp);
                });
            },
            clickHandlerFunc: (event) => {
                event.stopPropagation();
            },
        });
    };

    const handleSaveHotspot = () => {
        if (!popupData.type) return;

        const newHotspot = {
            pitch: popupData.pitch,
            yaw: popupData.yaw,
            text: popupData.text,
            type: popupData.type,
            ...(popupData.type === 'scene' && popupData.targetHotspot && {
                lookAt: {
                    pitch: popupData.targetHotspot.pitch,
                    yaw: popupData.targetHotspot.yaw,
                }
            })
        };
        const updatedHotspots = [...hotspotData, newHotspot];
        setAttributes({ hotspotData: updatedHotspots });
        setPopupData(null);
        setTempHotspot(null);
    };

    return (
        <div style={{ position: "relative" }} >
            <div ref={panoRef} style={{ width: "100%", height: "500px" }}></div>
            {popupData && (
                <div className="popupWrapper">
                    <div style={{
                        color: '#fff',
                        marginBottom: '15px',
                        fontSize: '20px'
                    }}>
                        What do you want to add in this point?
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        marginBottom: '15px'
                    }}>
                        <button
                            onClick={() => setPopupData({ ...popupData, type: 'info' })}
                            style={{
                                flex: 1,
                                padding: '10px',
                                background: popupData.type === 'info' ? '#1e90ff' : '#2a4e6f',
                                border: 'none',
                                borderRadius: '3px',
                                color: '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '5px'
                            }}
                        >
                            <span style={{
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid #fff',
                                borderRadius: '50%'
                            }}>
                                i
                            </span>
                            Info Hotspot
                        </button>
                        <button
                            onClick={() => setPopupData({ ...popupData, type: 'scene' })}
                            style={{
                                flex: 1,
                                padding: '10px',
                                background: popupData.type === 'scene' ? '#1e90ff' : '#2a4e6f',
                                border: 'none',
                                borderRadius: '3px',
                                color: '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '5px'
                            }}
                        >
                            <span
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px solid #fff',
                                    borderRadius: '50%'
                                }}>
                                ↑
                            </span>
                            Scene
                        </button>
                    </div>

                    {/* show info input start */}
                    {popupData.type === 'info' && (
                        <div style={{ background: 'rgb(41 73 88 / 45%)', padding: '1px 15px', borderRadius: '5px', marginBottom: '15px' }}>
                            <h3 style={{
                                color: '#fff',
                                fontSize: '18px',
                                marginTop: '10px',
                                marginBottom: '10px',
                                fontFamily: 'sans-serif'
                            }}>
                                Setup Info Hotspot
                            </h3>
                            <hr />
                            <div style={{ display: 'flex', alignContent: 'center', gap: '5px', marginTop: '20px', }}>
                                <label
                                    htmlFor="hotspotText"
                                    style={{
                                        color: '#fff',
                                        display: 'block',
                                        marginTop: '5px',
                                        fontSize: '14px',
                                    }}
                                >
                                    Label :
                                </label>
                                <div>
                                    <input
                                        id="hotspotText"
                                        type="text"
                                        placeholder="Input type text..."
                                        value={popupData.text}
                                        onChange={(e) => setPopupData({ ...popupData, text: e.target.value })}
                                        style={{
                                            width: "284px",
                                            marginBottom: "5px",
                                            border: "none",
                                            borderRadius: "3px",
                                            background: "rgb(0 0 0 / 55%)",
                                            color: "#fff"
                                        }}
                                    />
                                    <p
                                        style={{
                                            color: '#ccc',
                                            fontSize: '12px',
                                            margin: '0',
                                            marginBottom: '10px'
                                        }}
                                    >
                                        Enter a label
                                    </p>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* show info input end */}

                    {/* show scene and info list start */}
                    {popupData.type === 'scene' && (
                        // <div style={{ 
                        //     maxHeight: '150px', 
                        //     overflowY: 'auto',
                        //     background: 'rgb(0 0 0 / 55%)',
                        //     padding: '10px',
                        //     borderRadius: '3px',
                        //     marginBottom: '10px'
                        // }}>
                        //     {hotspotData.length > 0 ? (
                        //         hotspotData.map((spot, index) => (
                        //             <button
                        //                 key={index}
                        //                 onClick={() => setPopupData({
                        //                     ...popupData,
                        //                     text: spot.text || `Hotspot ${index + 1}`,
                        //                     targetHotspot: spot
                        //                 })}
                        //                 style={{
                        //                     width: '100%',
                        //                     padding: '8px',
                        //                     marginBottom: '5px',
                        //                     background: spot === popupData.targetHotspot ? '#447e79' : '#273332',
                        //                     border: 'none',
                        //                     borderRadius: '3px',
                        //                     color: '#fff',
                        //                     cursor: 'pointer',
                        //                     display: 'flex',
                        //                     alignItems: 'center',
                        //                     gap: '10px'
                        //                 }}
                        //             >
                        //                 <span style={{
                        //                     width: '20px',
                        //                     height: '20px',
                        //                     display: 'flex',
                        //                     alignItems: 'center',
                        //                     justifyContent: 'center',
                        //                     border: '2px solid #fff',
                        //                     borderRadius: '50%'
                        //                 }}>
                        //                     {spot.type === 'scene' ? '↑' : 'i'}
                        //                 </span>
                        //                 {spot.text || `Hotspot ${index + 1}`}
                        //             </button>
                        //         ))
                        //     ) : (
                        //         <p style={{ color: '#fff', margin: 0, textAlign: 'center' }}>
                        //            There is no hotspot information. Please add a new one.
                        //         </p>
                        //     )}
                        // </div>
                        <>
                        {hotspotData.length > 0 ? <div style={{ background: 'rgb(41 73 88 / 45%)', padding: '1px 15px', borderRadius: '5px', marginBottom: '15px' }}>
                            <h3 style={{
                                color: '#fff',
                                fontSize: '18px',
                                marginTop: '10px',
                                marginBottom: '10px',
                                fontFamily: 'sans-serif'
                            }}>
                                Set Scene
                            </h3>
                            <hr />
                            {/* dropdown of scene */}
                            <div style={{ display: 'flex', alignContent: 'center', gap: '5px', marginTop: '20px', }}>
                                <label
                                    htmlFor="hotspotText"
                                    style={{
                                        color: '#fff',
                                        display: 'block',
                                        marginTop: '5px',
                                        fontSize: '14px',
                                    }}
                                >
                                    Target :
                                </label>
                                {/* <div>
                              <select
                                        id="hotspotText"
                                        value={popupData.targetHotspot ? JSON.stringify(popupData.targetHotspot) : ''}
                                        onChange={(e) => {
                                            const spot = e.target.value ? JSON.parse(e.target.value) : null;
                                            setPopupData({
                                                ...popupData,
                                                text: spot ? (spot.text || `Hotspot ${hotspotData.indexOf(spot) + 1}`) : '',
                                                targetHotspot: spot
                                            });
                                        }}
                                        style={{
                                            width: "279px",
                                            padding: "8px",
                                            marginBottom: "5px",
                                            border: "none",
                                            borderRadius: "3px",
                                            background: "rgb(0 0 0 / 55%)",
                                            color: "#fff",
                                            appearance: "none",
                                            backgroundImage: "url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2014%2014%22%3E%3Cpath%20d%3D%22M7%2011L1%205h12z%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fsvg%3E\")",
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "right 8px center",
                                            paddingRight: "30px"
                                        }}
                                    >
                                        <option value="">Select a target</option>
                                        {hotspotData.map((spot, index) => (
                                            <option 
                                                key={index} 
                                                value={JSON.stringify(spot)}
                                            >
                                              <span>{spot.type === 'scene' ? '↑' : 'i'}</span>  {" "}
                                            <span>{spot.text || `Hotspot ${index + 1}`}</span> 
                                            </option>
                                        ))}
                                    </select>
                                    <p 
                                        style={{
                                            color: '#ccc',
                                            fontSize: '12px',
                                            margin: '0',
                                            marginBottom: '10px' }}
                                            >
                                    Choose the target
                                    </p>
                              </div> */}
                                <div>
                                    <div
                                        style={{
                                            position: 'relative',
                                            width: "279px"
                                        }}
                                    >
                                        <button
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            style={{
                                                width: "100%",
                                                padding: "8px",
                                                marginBottom: "5px",
                                                border: "none",
                                                borderRadius: "3px",
                                                background: "rgb(0 0 0 / 55%)",
                                                color: "#fff",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                textAlign: "left"
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {popupData.targetHotspot && (
                                                    <span style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        border: '2px solid',
                                                        borderColor: popupData.targetHotspot.type === 'scene' ? '#4CAF50' : '#2196F3',
                                                        borderRadius: '50%',
                                                        backgroundColor: popupData.targetHotspot.type === 'scene' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(33, 150, 243, 0.1)'
                                                    }}>
                                                        {popupData.targetHotspot.type === 'scene' ? '↑' : 'i'}
                                                    </span>
                                                )}
                                                {popupData.targetHotspot ?
                                                    (popupData.targetHotspot.text || `Hotspot ${hotspotData.indexOf(popupData.targetHotspot) + 1}`)
                                                    : 'Select a target'
                                                }
                                            </div>
                                            <span style={{ marginLeft: '10px', fontSize: '12px' }}>▼</span>
                                        </button>

                                        {isDropdownOpen && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: 0,
                                                width: '100%',
                                                background: 'rgb(0 0 0 / 75%)',
                                                borderRadius: '3px',
                                                maxHeight: '187px',
                                                overflowY: 'auto',
                                                zIndex: 1000
                                            }}>
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
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px',
                                                            background: spot === popupData.targetHotspot ? 'rgb(30 144 255 / 30%)' : 'transparent',
                                                            border: 'none',
                                                            color: '#fff',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '10px',
                                                            textAlign: 'left'
                                                        }}
                                                    >
                                                        <span style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            border: '2px solid',
                                                            borderColor: spot.type === 'scene' ? '#4CAF50' : '#2196F3',
                                                            borderRadius: '50%',
                                                            backgroundColor: spot.type === 'scene' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(33, 150, 243, 0.1)'
                                                        }}>
                                                            {spot.type === 'scene' ? '↑' : 'i'}
                                                        </span>
                                                        {spot.text || `Hotspot ${index + 1}`}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <p
                                        style={{
                                            color: '#ccc',
                                            fontSize: '12px',
                                            margin: '0',
                                            marginBottom: '10px'
                                        }}
                                    >
                                        Choose the target
                                    </p>
                                </div>
                            </div>
                            {/* Input filed of scene */}
                            <div style={{ display: 'flex', alignContent: 'center', gap: '5px', marginTop: '20px', }}>
                                <label
                                    htmlFor="hotspotText"
                                    style={{
                                        color: '#fff',
                                        display: 'block',
                                        marginTop: '5px',
                                        fontSize: '14px',
                                    }}
                                >
                                    Label :
                                </label>
                                <div>
                                    <input
                                        id="hotspotText"
                                        type="text"
                                        placeholder="Input type text..."
                                        value={popupData.text}
                                        onChange={(e) => setPopupData({ ...popupData, text: e.target.value })}
                                        style={{
                                            width: "284px",
                                            marginBottom: "5px",
                                            border: "none",
                                            borderRadius: "3px",
                                            background: "rgb(0 0 0 / 55%)",
                                            color: "#fff"
                                        }}
                                    />
                                    <p
                                        style={{
                                            color: '#ccc',
                                            fontSize: '12px',
                                            margin: '0',
                                            marginBottom: '10px'
                                        }}
                                    >
                                        Enter a label
                                    </p>
                                </div>
                            </div>

                        </div> : <p style={{ 
                                            color: '#fff', 
                                            margin: '5px 0px 10px', 
                                            fontSize: '14px',
                                            background: 'rgb(220 53 69 / 30%)',
                                            padding: '8px 12px',
                                            borderRadius: '3px',
                                            width: '100%'
                                        }}>
                                            Please add a hotspot first to continue
                                        </p>}
                        </>
                    )}
                    {/* show scene and info list end */}

                    {/* show save and cancel button start */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {popupData.type && (
                            <button
                                onClick={handleSaveHotspot}
                                className="saveBtn"
                                disabled={popupData.type === 'scene' && !popupData.targetHotspot}
                                style={{
                                    display: (popupData.type === 'scene' && hotspotData.length === 0) ? 'none' : 'block'
                                }}
                            >
                                {popupData.type === 'scene' ? 'Save Scene' : 'Save Info'}
                            </button>
                        )}
                        <button
                            className="closeBtn"
                            // style={{marginLeft:'5px'}}
                            onClick={() => {
                                setPopupData(null);
                                setTempHotspot(null);
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                    {/* show save and cancel button end */}

                </div>
            )}
        </div>
    );
};

export default TourViewer;
