import '../../styles/announcementOptions.css';

export default function AnnouncementOptions({
  broadcastTypes = [],
  broadcastValue,
  setBroadcastOnChange,
  allResidents = [],
  filters,
  setFilters,
}) {
  const getUnique = (arr, key, nested = false) =>
    [...new Set(arr.map(r => nested ? r[key]?.toString() : r[key]).filter(Boolean))];

  // Prepare dropdown options
  const genderOptions = getUnique(allResidents, "gender");
  const maritalOptions = getUnique(allResidents, "marital_status");
  const educationOptions = getUnique(allResidents, "highest_education");
  const registrationOptions = getUnique(allResidents, "resident_type");
  const medicalOptions = [
    ...new Set(
      allResidents
        .flatMap(r => (r.medical_conditions || r.medical_info?.medical_conditions || []))
        .filter(Boolean)
    ),
  ];

  return (
    <div className="broadcast-category">
      <h6>Broadcast Settings</h6>
      <select name="broadcastTypes" id="broadcastTypes" value={broadcastValue} onChange={setBroadcastOnChange} required>
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
      <div>
        <h6>Filters</h6>
      </div>
      <div className="resident-filters" style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16 }}>
        <div>
          <label>Min Age:</label>
          <input
            type="number"
            value={filters.minAge}
            onChange={e => setFilters(f => ({ ...f, minAge: e.target.value }))}
            style={{ width: 60 }}
            min={0}
          />
        </div>
        <div>
          <label>Max Age:</label>
          <input
            type="number"
            value={filters.maxAge}
            onChange={e => setFilters(f => ({ ...f, maxAge: e.target.value }))}
            style={{ width: 60 }}
            min={0}
          />
        </div>
        <div>
          <label>Gender:</label>
          <select value={filters.gender} onChange={e => setFilters(f => ({ ...f, gender: e.target.value }))}>
            <option value="">All</option>
            {genderOptions.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Marital Status:</label>
          <select value={filters.marital_status} onChange={e => setFilters(f => ({ ...f, marital_status: e.target.value }))}>
            <option value="">All</option>
            {maritalOptions.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={filters.address || ""}
            onChange={e => setFilters(f => ({ ...f, address: e.target.value }))}
            placeholder="Enter house # or street"
            style={{ minWidth: 120 }}
          />
        </div>
        <div>
          <label>Education:</label>
          <select value={filters.highest_education} onChange={e => setFilters(f => ({ ...f, highest_education: e.target.value }))}>
            <option value="">All</option>
            {educationOptions.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Resident Type:</label>
          <select value={filters.resident_type} onChange={e => setFilters(f => ({ ...f, resident_type: e.target.value }))}>
            <option value="">All</option>
            {registrationOptions.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Medical Condition:</label>
          <select value={filters.medical_condition} onChange={e => setFilters(f => ({ ...f, medical_condition: e.target.value }))}>
            <option value="">All</option>
            {medicalOptions.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() =>
            setFilters({
              ...filters,
              minAge: "",
              maxAge: "",
              gender: "",
              marital_status: "",
              address: "",
              highest_education: "",
              resident_type: "",
              medical_condition: "",
            })
          }
        >
          Clear
        </button>
      </div>
    </div>
  );
}