import { TextControl, __experimentalNumberControl as NumberControl, Button } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { produce } from "immer";
import { InlineMediaUpload } from "../../../../../../bpl-tools/Components";
import { BControlPro } from "../../../../../../bpl-tools/ProControls";
import { PanelRepeater } from "./PanelRepeater/PanelRepeater";
import { updateData } from "../../../../../../bpl-tools/utils/functions";
const Item = ({ attributes, setAttributes, arrKey, index, setActiveIndex = false, premiumProps }) => {
  const { scenes } = attributes;
  const items = attributes[arrKey][index];
  const hotspots = items.hotSpots;

  const updateHotspots = (val, ...props) => {
    setAttributes({ scenes: updateData(scenes, val, index, 'hotSpots', ...props) });
  };

  const handleDelete = (idx) => {
    const newItems = produce(scenes, (draft) => {
      draft[index].hotSpots.splice(idx, 1);
    });

    setAttributes({ scenes: newItems });
  };

  const handleCopy = (idx) => {
    const newItems = produce(scenes, (draft) => {
      draft[index].hotSpots.push(draft[index].hotSpots[idx]);
    });
    setAttributes({ scenes: newItems });
  };

  const addNewItem = () => {
    const newItems = produce(scenes, (draft) => {
      draft[index].hotSpots.push({
        pitch: -2.1,
        yaw: 132.9,
        type: "scene",
        text: "Spring House or Dairy",
        sceneId: "house"
      });
    });

    setAttributes({ scenes: newItems });
  }

  const updateTour = (property, val, childProperty = null) => {
    const newItems = produce(attributes[arrKey], (draft) => {
      if (property === "default_data") {
        draft.forEach((item) => {
          item.default_data = false;
        });
      }

      if (null !== childProperty) {
        draft[index][property][childProperty] = val;
      } else {
        draft[index][property] = val;
      }
    });

    setAttributes({ [arrKey]: newItems });
    setActiveIndex && setActiveIndex(index);
  };

  return (
    <>
      <BControlPro
        label={__("Tour ID", "panorama")}
        help={__("Input Your Unique id. Don't use space!!", "panorama")}
        value={items.tour_id}
        onChange={(v) => updateTour("tour_id", v)}
        Component={TextControl}
        {...premiumProps}
      />

      <BControlPro
        className="mt15"
        label={__("Title", "panorama")}
        value={items.title}
        onChange={(v) => updateTour("title", v)}
        Component={TextControl}
        {...premiumProps}
      />

      <NumberControl
        className="mt15"
        value={items.hfov}
        label={__("Hfov : ", "panorama")}
        labelPosition="left"
        min={-1000}
        max={1000}
        onChange={(v) => updateTour("hfov", parseFloat(v))}
      />

      <NumberControl
        className="mt15"
        value={items.pitch}
        label={__("Pitch : ", "panorama")}
        labelPosition="left"
        min={-1000}
        max={1000}
        onChange={(v) => updateTour("pitch", parseFloat(v))}
      />

      <NumberControl
        className="mt15"
        value={items.yaw}
        label={__("Yaw : ", "panorama")}
        labelPosition="left"
        min={-1000}
        max={1000}
        onChange={(v) => updateTour("yaw", parseFloat(v))}
      />

      <BControlPro
        className="mt15"
        label={__("Enter or upload image URL", "panorama")}
        placeholder={__("Enter or upload image URL", "panorama")}
        value={items.panorama}
        onChange={(v) => updateTour("panorama", v)}
        Component={InlineMediaUpload}
        {...premiumProps}
      />

      
      <div style={{ marginTop: '10px' }}>
        <label>HotSpots</label>
        {hotspots?.map((val, i) =>
          <PanelRepeater 
            className="mt10"
            title={`Item - ${i + 1}`}
            length={hotspots.length} 
            index={i} 
            handleDelete={handleDelete} 
            handleCopy={handleCopy} 
            key={i}
          >
            
            <NumberControl
              value={val?.pitch}
              label={__("Pitch : ", "panorama")}
              labelPosition="left"
              onChange={(value) => updateHotspots(parseFloat(value), i, 'pitch')}
              min={-1000}
              max={1000}
            />

            <NumberControl
            className="mt10"
              value={val?.yaw}
              label={__("Yaw : ", "panorama")}
              labelPosition="left"
              onChange={(value) => updateHotspots(parseFloat(value), i, 'yaw')}
              min={-1000}
              max={1000}
            />

            <BControlPro
              className="mt10"
              label={__("Text", "panorama")}
              value={val?.text}
              onChange={(value) => updateHotspots(value, i, 'text')}
              Component={TextControl}
              {...premiumProps}
            />

            <BControlPro
              className="mt10"
              label={__("Scene ID", "panorama")}
              value={val?.sceneId}
              onChange={(value) => updateHotspots(value, i, 'sceneId')}
              Component={TextControl}
              {...premiumProps}
            />

          </PanelRepeater>
        )}
        <Button style={{background:"#363294", color:"white"}} onClick={addNewItem} >Add Hotspot</Button>
      </div>

    </>
  );
};

export default Item;








// Tour_360
//  <>
//  <BControlPro
//    label={__("Tour ID", "panorama")}
//    help={__("Input Your Unique id. Don't use space!!", "panorama")}
//    value={items[index]?.tour_id}
//    onChange={(v) => updateTour("tour_id", v)}
//    Component={TextControl}
//    {...premiumProps}
//  />

//  <BControlPro
//    className="mt15"
//    label={__("Enter or upload image URL", "panorama")}
//    placeholder={__("Enter or upload image URL", "panorama")}
//    value={items[index]?.tour_img}
//    onChange={(v) => updateTour("tour_img", v)}
//    Component={InlineMediaUpload}
//    {...premiumProps}
//  />

//  <BControlPro
//    className="mt15"
//    label={__("Show Title & Author", "panorama")}
//    checked={items[index]?.tourTitleAuthor}
//    onChange={(v) => updateTour("tourTitleAuthor", v)}
//    Component={ToggleControl}
//    {...premiumProps}
//  />

//  {items[index]?.tourTitleAuthor && (
//    <>
//      <BControlPro
//        className="mt15"
//        label={__("Title", "panorama")}
//        value={items[index]?.title}
//        onChange={(v) => updateTour("title", v)}
//        Component={TextControl}
//        {...premiumProps}
//      />
//      <BControlPro
//        className="mt10"
//        label={__("Author", "panorama")}
//        value={items[index]?.author}
//        onChange={(v) => updateTour("author", v)}
//        Component={TextControl}
//        {...premiumProps}
//      />
//    </>
//  )}

//  <BControlPro
//    className="mt15"
//    label={__("Show/Hide HotSpot", "panorama")}
//    checked={items[index]?.tour_hotSpot}
//    onChange={(v) => updateTour("tour_hotSpot", v)}
//    Component={ToggleControl}
//    {...premiumProps}
//  />

//  {items[index]?.tour_hotSpot && (
//    <>
//      <BControlPro
//        className="mt15"
//        label={__("Title", "panorama")}
//        value={items[index]?.hotSpot_txt}
//        onChange={(v) => updateTour("hotSpot_txt", v)}
//        Component={TextControl}
//        {...premiumProps}
//      />
//      <BControlPro
//        className="mt10"
//        label={__("Target ID", "panorama")}
//        value={items[index]?.target_id}
//        onChange={(v) => updateTour("target_id", v)}
//        Component={TextControl}
//        {...premiumProps}
//      />
//    </>
//  )}

//  <BControlPro
//    className="mt15"
//    label={__("Show/Hide Default Data", "panorama")}
//    checked={items[index]?.default_data}
//    onChange={(v) => updateTour("default_data", v)}
//    Component={ToggleControl}
//    {...premiumProps}
//  />
// </>
