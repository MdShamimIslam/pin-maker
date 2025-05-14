import { PanelBody, 
  // ToggleControl,
  //  RangeControl
   } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useEffect, useState } from "react";
import { ItemsPanel } from "../../../../../../bpl-tools/Components";
import Item from "../Panel/Item";
// import { updateData } from "../../../../../../bpl-tools/utils/functions";
// import { BControlPro } from "../../../../../../bpl-tools/ProControls";


const General = ({ attributes, setAttributes, premiumProps, setCurrentScene }) => {
  const { scenes } = attributes;
  // const {
  //   isRotate,
  //   autoRotateSpeed,
  //   autoRotateInactivityDelay,
  //   hideDefaultCtrl,
  //   initialView,
  //   autoLoad,
  //   draggable,
  //   compass,
  //   mouseZoom,
  //   disableKeyboardCtrl,
  //   doubleClickZoom,
  // } = options || {};

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
      
    scenes[activeIndex] && setCurrentScene(scenes[activeIndex])
  }, [activeIndex])

  return (
    <>
      <PanelBody className="bPlPanelBody" title={__("Tours", "panorama")}>
        <ItemsPanel   
          {...{ attributes, setAttributes, premiumProps, activeIndex, setActiveIndex }}
          arrKey="scenes"
          newItem={{
            "tour_id": "circle",
            "title": "Mason Circle",
            "hfov": 110,
            "pitch": -3,
            "yaw": 117,
            "type": "equirectangular",
            "panorama": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Panorama_of_the_courtyard_of_the_Great_Mosque_of_Kairouan.jpg",
            "hotSpots": [
              {
                "pitch": -2.1,
                "yaw": 132.9,
                "type": "scene",
                "text": "Spring House or Dairy",
                "sceneId": "house"
              }
            ]
          }}
          ItemSettings={Item}
          itemLabel="Scene"
          design="sortable"
        />
      </PanelBody>



      {/* tour_360 */}
      {/* <PanelBody className="bPlPanelBody" title={__("Tours", "panorama")}>
        <ItemsPanel   
          {...{ attributes, setAttributes, premiumProps }}
          arrKey="tour_360"
          newItem={{
            tour_id: "house",
            tour_img: "",
            tourTitleAuthor: true,
            title: "Spring House or Dairy",
            author: "bPlugins",
            tour_hotSpot: true,
            hotSpot_txt: "Spring House",
            target_id: "",
            default_data: false,
          }}
          ItemSettings={Item}
          itemLabel="Tour"
          design="sortable"
        />
      </PanelBody> */}

      {/* <PanelBody className="bPlPanelBody" title={__("Options", "panorama")}>
        <ToggleControl
          className="mt10"
          label={__("Auto Rotate", "panorama")}
          checked={isRotate}
          onChange={(v) =>
            setAttributes({ options: updateData(options, v, "isRotate") })
          }
        />

        {isRotate && (
          <>
            <RangeControl
              className="mt20"
              label={__("Auto Rotate Speed", "panorama")}
              value={autoRotateSpeed}
              allowReset
              onChange={(v) =>
                setAttributes({
                  options: updateData(options, v, "autoRotateSpeed"),
                })
              }
              min={-100}
              max={100}
              step={0.1}
            />
            {autoRotateSpeed !== 0 && (
              <BControlPro
                className="mt20"
                label={__("Auto Rotate Inactivity Delay", "panorama")}
                value={autoRotateInactivityDelay}
                allowReset
                onChange={(v) =>
                  setAttributes({
                    options: updateData(
                      options,
                      v,
                      "autoRotateInactivityDelay"
                    ),
                  })
                }
                min={1000}
                max={60000}
                step={1000}
                Component={RangeControl}
                {...premiumProps}
              />
            )}
          </>
        )}

        <ToggleControl
          className={isRotate ? "mt15" : "mt10"}
          checked={hideDefaultCtrl}
          label={__("Hide Default Control", "panorama")}
          onChange={(v) =>
            setAttributes({
              options: updateData(options, v, "hideDefaultCtrl"),
            })
          }
        />

        <BControlPro
          className="mt10"
          checked={initialView}
          label={__("Set As Initial View Button", "panorama")}
          onChange={(v) =>
            setAttributes({
              options: updateData(options, v, "initialView"),
            })
          }
          Component={ToggleControl}
          {...premiumProps}
        />

        <BControlPro
          className="mt10"
          checked={autoLoad}
          label={__("Auto Load", "panorama")}
          onChange={(v) =>
            setAttributes({ options: updateData(options, v, "autoLoad") })
          }
          Component={ToggleControl}
          {...premiumProps}
        />

        <BControlPro
          className="mt10"
          checked={draggable}
          label={__("Draggable", "panorama")}
          onChange={(v) =>
            setAttributes({
              options: updateData(options, v, "draggable"),
            })
          }
          Component={ToggleControl}
          {...premiumProps}
        />

        <BControlPro
          className="mt10"
          checked={compass}
          label={__("Compass", "panorama")}
          onChange={(v) =>
            setAttributes({
              options: updateData(options, v, "compass"),
            })
          }
          Component={ToggleControl}
          {...premiumProps}
        />

        <BControlPro
          className="mt10"
          checked={mouseZoom}
          label={__("Mouse Zoom", "panorama")}
          onChange={(v) =>
            setAttributes({
              options: updateData(options, v, "mouseZoom"),
            })
          }
          Component={ToggleControl}
          {...premiumProps}
        />

        <BControlPro
          className="mt10"
          checked={disableKeyboardCtrl}
          label={__("Disable Keyboard Control", "panorama")}
          onChange={(v) =>
            setAttributes({
              options: updateData(options, v, "disableKeyboardCtrl"),
            })
          }
          Component={ToggleControl}
          {...premiumProps}
        />

        <BControlPro
          className="mt10"
          checked={doubleClickZoom}
          label={__("Double Click Zoom", "panorama")}
          onChange={(v) =>
            setAttributes({
              options: updateData(options, v, "doubleClickZoom"),
            })
          }
          Component={ToggleControl}
          {...premiumProps}
        />
      </PanelBody> */}

    </>
  );
};

export default General;
