import React, { useEffect, useRef } from "react";
import panoImg from '../../../public/assets/panorama.jpg';

const hotSpots = [
    {
        id: "window",
        pitch: -10,
        yaw: 20,
        text: "Hotspot 1",
        targetPitch: 5,
        targetYaw: -30,
    },
    {
        id: "windowView",
        pitch: 5,
        yaw: -30,
        text: "Hotspot 2",
        targetPitch: 15,
        targetYaw: 60,
    },
    {
        id: "wallPainting",
        pitch: 15,
        yaw: 60,
        text: "Hotspot 3",
        targetPitch: -10,
        targetYaw: 20,
    },
];

const SceneViewer = () => {
    const tourContainerRef = useRef();
    const viewerInstance = useRef(null);
    
    useEffect(() => {
        if (!window.pannellum || !tourContainerRef.current) return;

        viewerInstance.current = window.pannellum.viewer(tourContainerRef.current, {
            type: "equirectangular",
            panorama: panoImg,
            autoLoad: true,
            hfov: 110,
            yaw: 5,
            hotSpots: hotSpots.map(hs => ({
                pitch: hs.pitch,
                yaw: hs.yaw,
                type: "info",
                // type: "scene",
                // sceneId: hs.id,
                text: hs.text,
                clickHandlerFunc: () => {
                    viewerInstance.current.lookAt(hs.targetPitch, hs.targetYaw, 1000);
                }
            })),
        });

        return () => {
            viewerInstance.current.destroy();
        };
    }, []);

    return  <div className="tourContainer" style={{ width: "100%", height: "500px" }} ref={tourContainerRef}/>;
};

export default SceneViewer;



