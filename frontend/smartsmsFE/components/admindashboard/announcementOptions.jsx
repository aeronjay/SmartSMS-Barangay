export default function AnnouncementOptions({ broadcastTypes = [] }) {
    
    
    return (
      <div className="broadcast-category">
        <h6>Broadcast Settings</h6>
        <select name="broadcastTypes" id="broadcastTypes" defaultValue="">
          <option value="" disabled>Select Broadcast Type</option>
          {broadcastTypes.length > 0 ? (
            broadcastTypes.map((list, index) => (
              <option key={index} value={list}>
                {list}
              </option>
            ))
          ) : (
            <option value="" disabled>No broadcast types available</option>
          )}
        </select>

      </div>
    );
  }
  