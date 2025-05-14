
const SaveCancelButtons = ({onSave, onCancel, popupData, hotspotData = [] }) => {
    return (
        <div className='saveAndCancelWrap'>
            {popupData.type && (
                <button
                    onClick={onSave}
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
                onClick={onCancel}
            >
              Cancel
            </button>
        </div>
    );
};

export default SaveCancelButtons;