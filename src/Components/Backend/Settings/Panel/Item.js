import { TextControl, ToggleControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { produce } from "immer";
import { InlineMediaUpload } from "../../../../../../bpl-tools/Components";
import { BControlPro } from "../../../../../../bpl-tools/ProControls";
const Item = ({
  attributes,
  setAttributes,
  arrKey,
  index,
  setActiveIndex = false,
  premiumProps
}) => {
  const items = attributes[arrKey];

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
        value={items[index]?.tour_id}
        onChange={(v) => updateTour("tour_id", v)}
        Component={TextControl}
        {...premiumProps}
      />

      <BControlPro
        className="mt15"
        label={__("Enter or upload image URL", "panorama")}
        placeholder={__("Enter or upload image URL", "panorama")}
        value={items[index]?.tour_img}
        onChange={(v) => updateTour("tour_img", v)}
        Component={InlineMediaUpload}
        {...premiumProps}
      />

      <BControlPro
        className="mt15"
        label={__("Show Title & Author", "panorama")}
        checked={items[index]?.tourTitleAuthor}
        onChange={(v) => updateTour("tourTitleAuthor", v)}
        Component={ToggleControl}
        {...premiumProps}
      />

      {items[index]?.tourTitleAuthor && (
        <>
          <BControlPro
            className="mt15"
            label={__("Title", "panorama")}
            value={items[index]?.title}
            onChange={(v) => updateTour("title", v)}
            Component={TextControl}
            {...premiumProps}
          />
          <BControlPro
            className="mt10"
            label={__("Author", "panorama")}
            value={items[index]?.author}
            onChange={(v) => updateTour("author", v)}
            Component={TextControl}
            {...premiumProps}
          />
        </>
      )}

      <BControlPro
        className="mt15"
        label={__("Show/Hide HotSpot", "panorama")}
        checked={items[index]?.tour_hotSpot}
        onChange={(v) => updateTour("tour_hotSpot", v)}
        Component={ToggleControl}
        {...premiumProps}
      />

      {items[index]?.tour_hotSpot && (
        <>
          <BControlPro
            className="mt15"
            label={__("Title", "panorama")}
            value={items[index]?.hotSpot_txt}
            onChange={(v) => updateTour("hotSpot_txt", v)}
            Component={TextControl}
            {...premiumProps}
          />
          <BControlPro
            className="mt10"
            label={__("Target ID", "panorama")}
            value={items[index]?.target_id}
            onChange={(v) => updateTour("target_id", v)}
            Component={TextControl}
            {...premiumProps}
          />
        </>
      )}

      <BControlPro
        className="mt15"
        label={__("Show/Hide Default Data", "panorama")}
        checked={items[index]?.default_data}
        onChange={(v) => updateTour("default_data", v)}
        Component={ToggleControl}
        {...premiumProps}
      />
    </>
  );
};

export default Item;
