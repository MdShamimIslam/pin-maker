/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Components/Common/Style.js":
/*!****************************************!*\
  !*** ./src/Components/Common/Style.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const Style = ({
  attributes,
  id,
  device = "desktop"
}) => {
  const {
    alignSl,
    width,
    height
  } = attributes.layout;
  const mainSl = `#${id}`;
  const blockSl = `${mainSl} .bBlocksTourViewer`;
  const tourContainerSl = `${blockSl} .tourContainer`;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("style", {
    dangerouslySetInnerHTML: {
      __html: `
			${blockSl} { align-items: ${alignSl[device]}; }
			${tourContainerSl} { width: ${width[device]}; height: ${height[device]}; }
	
			@media only screen and (min-width:641px) and (max-width: 1024px) {
			  ${blockSl} { align-items: ${alignSl.tablet}; }
			  ${tourContainerSl} { width: ${width.tablet}; height: ${height.tablet}; }
			}
	
			@media only screen and (max-width:640px) {
			  ${blockSl} { align-items: ${alignSl.mobile}; }
			  ${tourContainerSl} { width: ${width.mobile}; height: ${height.mobile}; }
			}
		  `
    }
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Style);

/***/ }),

/***/ "./src/Components/Common/TourViewer.js":
/*!*********************************************!*\
  !*** ./src/Components/Common/TourViewer.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _public_assets_panorama_jpg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../public/assets/panorama.jpg */ "./public/assets/panorama.jpg");



const TourViewer = ({
  attributes,
  setAttributes,
  isBackend = false
}) => {
  const {
    hotspotData = []
  } = attributes;
  const panoRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [isLoaded, setIsLoaded] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [tempHotspot, setTempHotspot] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [popupData, setPopupData] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [isDraggingHotspot, setIsDraggingHotspot] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const viewerRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const clickStartCoords = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const isDraggingRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const [isDropdownOpen, setIsDropdownOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const img = new Image();
    img.src = _public_assets_panorama_jpg__WEBPACK_IMPORTED_MODULE_1__;
    img.onload = () => setIsLoaded(true);
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
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
      panorama: _public_assets_panorama_jpg__WEBPACK_IMPORTED_MODULE_1__,
      autoLoad: true,
      hotSpots: hotspotData.map(spot => ({
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
        }
      }))
    });
    window.viewer = viewer;
    viewerRef.current = viewer;
    viewer.lookAt(currentPitch, currentYaw, currentHfov);
    panoRef.current.viewerInstance = viewer;
    if (tempHotspot) {
      addTempHotspot(viewer, tempHotspot);
    }
    viewer.on("mousedown", event => {
      if (popupData || isDraggingHotspot) return;
      clickStartCoords.current = {
        x: event.clientX,
        y: event.clientY,
        time: Date.now()
      };
    });
    viewer.on("mouseup", event => {
      if (!clickStartCoords.current || popupData || isDraggingHotspot) return;
      const isClick = Math.abs(event.clientX - clickStartCoords.current.x) < 5 && Math.abs(event.clientY - clickStartCoords.current.y) < 5 && Date.now() - clickStartCoords.current.time < 200;
      if (isClick) {
        const coords = viewer.mouseEventToCoords(event);
        setTempHotspot({
          pitch: coords[0],
          yaw: coords[1]
        });
      }
      clickStartCoords.current = null;
    });
    return () => {
      if (viewer) viewer.destroy();
    };
  }, [isLoaded, hotspotData]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
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
      createTooltipFunc: hotSpotDiv => {
        hotSpotDiv.innerHTML = "+";
        hotSpotDiv.style.cursor = "move";
        let startX, startY;
        let startPitch, startYaw;
        const handleMouseDown = e => {
          e.stopPropagation();
          isDraggingRef.current = false;
          startX = e.clientX;
          startY = e.clientY;
          startPitch = hotspot.pitch;
          startYaw = hotspot.yaw;
          setIsDraggingHotspot(false);
        };
        const handleMouseMove = e => {
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
            setTempHotspot({
              pitch: newPitch,
              yaw: newYaw
            });
          }
        };
        const handleMouseUp = () => {
          if (!isDraggingRef.current) {
            setPopupData({
              pitch: hotspot.pitch,
              yaw: hotspot.yaw,
              text: ""
            });
          }
          isDraggingRef.current = false;
          setIsDraggingHotspot(false);
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };
        hotSpotDiv.addEventListener("mousedown", e => {
          handleMouseDown(e);
          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
        });
      },
      clickHandlerFunc: event => {
        event.stopPropagation();
      }
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
          yaw: popupData.targetHotspot.yaw
        }
      })
    };
    const updatedHotspots = [...hotspotData, newHotspot];
    setAttributes({
      hotspotData: updatedHotspots
    });
    setPopupData(null);
    setTempHotspot(null);
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      position: "relative"
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ref: panoRef,
    style: {
      width: "100%",
      height: "500px"
    }
  }), popupData && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "popupWrapper"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      color: '#fff',
      marginBottom: '15px',
      fontSize: '20px'
    }
  }, "What do you want to add in this point?"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      display: 'flex',
      gap: '10px',
      marginBottom: '15px'
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: () => setPopupData({
      ...popupData,
      type: 'info'
    }),
    style: {
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
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    style: {
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid #fff',
      borderRadius: '50%'
    }
  }, "i"), "Info Hotspot"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: () => setPopupData({
      ...popupData,
      type: 'scene'
    }),
    style: {
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
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    style: {
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid #fff',
      borderRadius: '50%'
    }
  }, "\u2191"), "Scene")), popupData.type === 'info' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      background: 'rgb(41 73 88 / 45%)',
      padding: '1px 15px',
      borderRadius: '5px',
      marginBottom: '15px'
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
    style: {
      color: '#fff',
      fontSize: '18px',
      marginTop: '10px',
      marginBottom: '10px',
      fontFamily: 'sans-serif'
    }
  }, "Setup Info Hotspot"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("hr", null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      display: 'flex',
      alignContent: 'center',
      gap: '5px',
      marginTop: '20px'
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: "hotspotText",
    style: {
      color: '#fff',
      display: 'block',
      marginTop: '5px',
      fontSize: '14px'
    }
  }, "Label :"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    id: "hotspotText",
    type: "text",
    placeholder: "Input type text...",
    value: popupData.text,
    onChange: e => setPopupData({
      ...popupData,
      text: e.target.value
    }),
    style: {
      width: "284px",
      marginBottom: "5px",
      border: "none",
      borderRadius: "3px",
      background: "rgb(0 0 0 / 55%)",
      color: "#fff"
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    style: {
      color: '#ccc',
      fontSize: '12px',
      margin: '0',
      marginBottom: '10px'
    }
  }, "Enter a label")))), popupData.type === 'scene' &&
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
  (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, hotspotData.length > 0 ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      background: 'rgb(41 73 88 / 45%)',
      padding: '1px 15px',
      borderRadius: '5px',
      marginBottom: '15px'
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
    style: {
      color: '#fff',
      fontSize: '18px',
      marginTop: '10px',
      marginBottom: '10px',
      fontFamily: 'sans-serif'
    }
  }, "Set Scene"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("hr", null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      display: 'flex',
      alignContent: 'center',
      gap: '5px',
      marginTop: '20px'
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: "hotspotText",
    style: {
      color: '#fff',
      display: 'block',
      marginTop: '5px',
      fontSize: '14px'
    }
  }, "Target :"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      position: 'relative',
      width: "279px"
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: () => setIsDropdownOpen(!isDropdownOpen),
    style: {
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
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, popupData.targetHotspot && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    style: {
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid',
      borderColor: popupData.targetHotspot.type === 'scene' ? '#4CAF50' : '#2196F3',
      borderRadius: '50%',
      backgroundColor: popupData.targetHotspot.type === 'scene' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(33, 150, 243, 0.1)'
    }
  }, popupData.targetHotspot.type === 'scene' ? '↑' : 'i'), popupData.targetHotspot ? popupData.targetHotspot.text || `Hotspot ${hotspotData.indexOf(popupData.targetHotspot) + 1}` : 'Select a target'), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    style: {
      marginLeft: '10px',
      fontSize: '12px'
    }
  }, "\u25BC")), isDropdownOpen && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      width: '100%',
      background: 'rgb(0 0 0 / 75%)',
      borderRadius: '3px',
      maxHeight: '187px',
      overflowY: 'auto',
      zIndex: 1000
    }
  }, hotspotData.map((spot, index) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    key: index,
    onClick: () => {
      setPopupData({
        ...popupData,
        text: spot.text || `Hotspot ${index + 1}`,
        targetHotspot: spot
      });
      setIsDropdownOpen(false);
    },
    style: {
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
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    style: {
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid',
      borderColor: spot.type === 'scene' ? '#4CAF50' : '#2196F3',
      borderRadius: '50%',
      backgroundColor: spot.type === 'scene' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(33, 150, 243, 0.1)'
    }
  }, spot.type === 'scene' ? '↑' : 'i'), spot.text || `Hotspot ${index + 1}`)))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    style: {
      color: '#ccc',
      fontSize: '12px',
      margin: '0',
      marginBottom: '10px'
    }
  }, "Choose the target"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      display: 'flex',
      alignContent: 'center',
      gap: '5px',
      marginTop: '20px'
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: "hotspotText",
    style: {
      color: '#fff',
      display: 'block',
      marginTop: '5px',
      fontSize: '14px'
    }
  }, "Label :"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    id: "hotspotText",
    type: "text",
    placeholder: "Input type text...",
    value: popupData.text,
    onChange: e => setPopupData({
      ...popupData,
      text: e.target.value
    }),
    style: {
      width: "284px",
      marginBottom: "5px",
      border: "none",
      borderRadius: "3px",
      background: "rgb(0 0 0 / 55%)",
      color: "#fff"
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    style: {
      color: '#ccc',
      fontSize: '12px',
      margin: '0',
      marginBottom: '10px'
    }
  }, "Enter a label")))) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    style: {
      color: '#fff',
      margin: '5px 0px 10px',
      fontSize: '14px',
      background: 'rgb(220 53 69 / 30%)',
      padding: '8px 12px',
      borderRadius: '3px',
      width: '100%'
    }
  }, "Please add a hotspot first to continue")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      display: 'flex',
      gap: '10px'
    }
  }, popupData.type && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: handleSaveHotspot,
    className: "saveBtn",
    disabled: popupData.type === 'scene' && !popupData.targetHotspot,
    style: {
      display: popupData.type === 'scene' && hotspotData.length === 0 ? 'none' : 'block'
    }
  }, popupData.type === 'scene' ? 'Save Scene' : 'Save Info'), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    className: "closeBtn"
    // style={{marginLeft:'5px'}}
    ,
    onClick: () => {
      setPopupData(null);
      setTempHotspot(null);
    }
  }, "Cancel"))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TourViewer);

/***/ }),

/***/ "./src/style.scss":
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/react-dom/client.js":
/*!******************************************!*\
  !*** ./node_modules/react-dom/client.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



var m = __webpack_require__(/*! react-dom */ "react-dom");
if (false) {} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  exports.createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  exports.hydrateRoot = function(c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}


/***/ }),

/***/ "./public/assets/panorama.jpg":
/*!************************************!*\
  !*** ./public/assets/panorama.jpg ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/panorama.647177f9.jpg";

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = window["ReactDOM"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/style.scss");
/* harmony import */ var _Components_Common_Style__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Components/Common/Style */ "./src/Components/Common/Style.js");
/* harmony import */ var _Components_Common_TourViewer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Components/Common/TourViewer */ "./src/Components/Common/TourViewer.js");





document.addEventListener('DOMContentLoaded', () => {
  const blockNameEls = document.querySelectorAll('.wp-block-b-blocks-pin-creator');
  blockNameEls.forEach(blockNameEl => {
    const attributes = JSON.parse(blockNameEl.dataset.attributes);
    (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(blockNameEl).render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Common_Style__WEBPACK_IMPORTED_MODULE_3__["default"], {
      attributes: attributes,
      id: blockNameEl.id
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_Common_TourViewer__WEBPACK_IMPORTED_MODULE_4__["default"], {
      attributes
    })));
    blockNameEl?.removeAttribute('data-attributes');
  });
});
/******/ })()
;
//# sourceMappingURL=view.js.map