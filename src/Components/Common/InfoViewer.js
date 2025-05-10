import React, { useState, useEffect, useRef } from 'react';
import panoImg from '../../../public/assets/panorama.jpg';

const InfoViewer = ({ attributes, setAttributes, isBackend = false }) => {
  const { hotspotData = [] } = attributes;
  const panoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tempHotspot, setTempHotspot] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [isDraggingHotspot, setIsDraggingHotspot] = useState(false);
  const viewerRef = useRef(null);
  const clickStartCoords = useRef(null);
  const isDraggingRef = useRef(false);

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
        type: "info",
        text: spot.text,
        clickHandlerFunc: () => {
          if (spot.lookAt) {
            viewer.lookAt(spot.lookAt.pitch, spot.lookAt.yaw);
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

  const hotspotTextBtnGroup = <div className="hotspotWrapper">
    <div className="header">Hotspot</div>

    <div className="btnGroup">
      {hotspotData?.map((spot, index) => (
        <button
          key={index}
          className="infoButton"
          onClick={() => {
            if (viewerRef.current) {
              viewerRef.current.lookAt(spot.pitch, spot.yaw);
            }
          }}
        >
          {spot.text}
        </button>
      ))}
    </div>
  </div>;

  const handleSaveHotspot = () => {
    const newHotspot = {
      pitch: popupData.pitch,
      yaw: popupData.yaw,
      text: popupData.text,
      lookAt: {
        pitch: popupData.pitch,
        yaw: popupData.yaw,
      },
    };
    const updatedHotspots = [...hotspotData, newHotspot];
    setAttributes({ hotspotData: updatedHotspots });
    setPopupData(null);
    setTempHotspot(null);
  };

  return (
    <div style={{ position: "relative", display: 'flex', gap: '10px' }} >
      <div ref={panoRef} style={{ width: "100%", height: "500px" }}></div>
      {hotspotData?.length > 0 && hotspotTextBtnGroup}

      {popupData && (
        <div className="popupWrapper">
          <input
            type="text"
            placeholder="Enter hotspot text..."
            value={popupData.text}
            onChange={(e) =>
              setPopupData({ ...popupData, text: e.target.value })
            }
          />
          <button onClick={isBackend && handleSaveHotspot} className="saveBtn"> Save </button>
          <button className="closeBtn" onClick={() => setPopupData(null)}> Cancel </button>
        </div>
      )}
    </div>
  );
};

export default InfoViewer;
