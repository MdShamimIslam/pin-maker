import {
	AlignmentToolbar,
	BlockControls,
	InspectorControls,
} from "@wordpress/block-editor";
import { TabPanel } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useState } from "react";
import { withSelect } from "@wordpress/data";
import { tabController } from "../../../../../Components/utils/functions";
import { updateData } from "../../../utils/functions";
import { generalStyleTabs } from "../../../utils/options";
import General from "./General/General";
import Style from "./Style/Style";
import { BBlocksAds } from "../../../../../bpl-tools/Components";
import { AboutProModal } from "../../../../../bpl-tools/ProControls";

const Settings = ({ attributes, setAttributes, device, isPremium, siteURL }) => {
	const { tour_360 = [], layout } = attributes;
	const { alignSl } = layout;

	const siteLocation = `${siteURL}/wp-admin/edit.php?post_type=bppiv-image-viewer&page=bppiv-support`;

	const [isProModalOpen, setIsProModalOpen] = useState(false);

	const premiumProps = {
		isPremium,
		setIsProModalOpen,
	};

	const props = { attributes, setAttributes, device, premiumProps };

	return (
		<>
			<InspectorControls>
				{!isPremium && <BBlocksAds />}

				{tour_360?.length > 0 && (
					<TabPanel
						className="bPlTabPanel wp-block-b-blocks-pin-creator"
						activeClass="activeTab"
						tabs={generalStyleTabs}
						onSelect={tabController}
					>
						{(tab) => (
							<>
								{"general" === tab.name && <General {...props} />}

								{"style" === tab.name && <Style {...props} />}
							</>
						)}
					</TabPanel>
				)}
			</InspectorControls>

			{tour_360?.length > 0 && (
				<BlockControls>
					<AlignmentToolbar
						value={alignSl[device]}
						onChange={(val) =>
							setAttributes({
								layout: updateData(layout, val, "alignSl", device),
							})
						}
						describedBy={__("Panorama Image Viewer Alignment")}
						alignmentControls={[
							{
								title: __("Panorama in left", "panorama"),
								align: "start",
								icon: "align-left",
							},
							{
								title: __("Panorama in center", "panorama"),
								align: "center",
								icon: "align-center",
							},
							{
								title: __("Panorama in right", "panorama"),
								align: "end",
								icon: "align-right",
							},
						]}
					/>
				</BlockControls>
			)}

			<AboutProModal
				isProModalOpen={isProModalOpen}
				setIsProModalOpen={setIsProModalOpen}
				link={siteLocation}
			>
				<li>
					<strong>{__("Tour ID: ", "panorama")}</strong>
					{__("Unique identifier for the tour.", "panorama")}
				</li>
				<li>
					<strong>{__("Image URL: ", "panorama")}</strong>
					{__("Provide or upload the image URL for the tour.", "panorama")}
				</li>
				<li>
					<strong>{__("Title & Author: ", "panorama")}</strong>
					{__("Option to display title and author info.", "panorama")}
				</li>
				<li>
					<strong>{__("Title: ", "panorama")}</strong>
					{__("Main title of the tour shown to users.", "panorama")}
				</li>
				<li>
					<strong>{__("Author: ", "panorama")}</strong>
					{__("Name of the creator or author of the tour.", "panorama")}
				</li>
				<li>
					<strong>{__(" HotSpot: ", "panorama")}</strong>
					{__("Enable or disable hotspots visibility.", "panorama")}
				</li>
				<li>
					<strong>{__("Target ID: ", "panorama")}</strong>
					{__("ID for the target area in the tour.", "panorama")}
				</li>
				<li>
					<strong>{__(" Default Data: ", "panorama")}</strong>
					{__("Option to show or hide default data.", "panorama")}
				</li>
				<li>
					<strong>{__("Auto Rotate Inactivity Delay: ", "panorama")}</strong>
					{__(
						"Set a delay before auto-rotation stops due to inactivity.",
						"panorama"
					)}
				</li>
				<li>
					<strong>{__("Set As Initial View Button: ", "panorama")}</strong>
					{__(
						"Enable this to set the current view as the initial viewpoint.",
						"panorama"
					)}
				</li>
				<li>
					<strong>{__("Auto Load: ", "panorama")}</strong>
					{__("Automatically load the panorama on page load.", "panorama")}
				</li>
				<li>
					<strong>{__("Draggable: ", "panorama")}</strong>
					{__(
						"Enable or disable dragging to navigate the panorama.",
						"panorama"
					)}
				</li>
				<li>
					<strong>{__("Compass: ", "panorama")}</strong>
					{__("Show or hide the compass overlay for orientation.", "panorama")}
				</li>
				<li>
					<strong>{__("Mouse Zoom: ", "panorama")}</strong>
					{__("Enable or disable zooming using the mouse scroll.", "panorama")}
				</li>
				<li>
					<strong>{__("Disable Keyboard Control: ", "panorama")}</strong>
					{__("Prevent navigation using keyboard controls.", "panorama")}
				</li>
				<li>
					<strong>{__("Double Click Zoom: ", "panorama")}</strong>
					{__("Enable or disable zooming by double-clicking.", "panorama")}
				</li>
			</AboutProModal>
		</>
	);
};

export default withSelect((select) => {
	const { getSite } = select("core");
	return { siteURL: getSite()?.url || "" };
})(Settings);
