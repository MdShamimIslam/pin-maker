
const InfoHotspotInput = ({ popupData, setPopupData }) => {
    return (
        <div className='infoWrap'>
            <h3> Setup Info Hotspot </h3>
            <hr />
            <div className='infoChildWrap'>
                <label className='label' htmlFor="hotspotText"> Label : </label>
                <div>
                    <input
                        id="hotspotText"
                        type="text"
                        placeholder="Input type text..."
                        value={popupData.text}
                        onChange={(e) => setPopupData({ ...popupData, text: e.target.value })}
                        className='infoInput'
                    />
                    <p> Enter a label </p>
                </div>
            </div>
        </div>
    );
};

export default InfoHotspotInput;