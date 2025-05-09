import SearchInput from "../SearchInput";
import { useEffect, useState } from "react";

export default function Receipients({ receipients = [], selectedResidentsNumber = [], setselectedResidentsNumber }) {

  const allNumbers = receipients.map(r => r.phone);
  const allSelected = allNumbers.length > 0 && allNumbers.every(num => selectedResidentsNumber.includes(num));

  const [search, setSearch] = useState('');
  const addNumber = (number) => {
    setselectedResidentsNumber([...selectedResidentsNumber, number])

  }
  const removeNumber = (number) => {
    if (selectedResidentsNumber.some((residentNum) => residentNum === number)) {
      const newNumbers = selectedResidentsNumber.filter((residentNum) => residentNum !== number)
      setselectedResidentsNumber(newNumbers)
    }
  }

  const handleSelectAll = () => {
    if (allSelected) {
      setselectedResidentsNumber([]);
    } else {
      setselectedResidentsNumber(allNumbers);
    }
  };

  return (
    <div className='broadcast-recipients'>
      <div className="upper-filter">
        <UpperFilter search={search} setSearch={setSearch} allSelected={allSelected} handleSelectAll={handleSelectAll} />
        <div className="receipients">
          {displayResidents(receipients, search, addNumber, removeNumber, selectedResidentsNumber)}
        </div>
      </div>
    </div>
  )
}

const UpperFilter = ({ search, setSearch, allSelected, handleSelectAll }) => {

  return (
    <div className="main-border">
      <div className="receipients-filter">
        <div className="receipients-filter-main">
          <h6>Receipients</h6>
        </div>
        <div className="filter-actions">
        <a href="#" onClick={e => { e.preventDefault(); handleSelectAll(); }}>
            {allSelected ? "Deselect all" : "Select all"}
          </a>
        </div>
      </div>
      <div style={{ padding: "10px 20px" }}>
        <SearchInput search={search} setSearch={setSearch} />
      </div>
    </div>
  )
}

const ReceipientsCard = ({ id, name, street, age, priority, number, addNumber, removeNumber, selectedResidentsNumber }) => {
  const [isChecked, setIsChecked] = useState(false); // Initialize state from prop

  const handleToggle = () => {
    const newCheckedState = !isChecked
    setIsChecked(newCheckedState)

    if (newCheckedState) {
      addNumber(number)
    } else {
      removeNumber(number)
    }
  };

  useEffect(() => {
    setIsChecked(selectedResidentsNumber.includes(number));
  }, [selectedResidentsNumber, number]);

  return (
    <div className="check-sample" onClick={handleToggle} style={{ cursor: "pointer" }}>
      <div>
        <input
          type="checkbox"
          id={id}
          name={id}
          checked={isChecked}
          onChange={handleToggle}
        />
      </div>
      <div className="Infos">
        <div className="receipient-name">
          {name}
        </div>
        <div className="receipient-name-infos">
          {street} • {age} years old • {priority ? "Priority" : ""}
        </div>
      </div>
    </div>
  );
};

const displayResidents = (receipients, search, addNumber, removeNumber, selectedResidentsNumber) => {
  // If search is not empty, filter residents whose name includes the search term
  const filteredResidents = search !== ""
    ? receipients.filter(person => person.name.toLowerCase().includes(search.toLowerCase()))
    : receipients;

  // Map the filtered residents to components
  return filteredResidents.map(person => (
    <ReceipientsCard
      key={person.id}
      id={person.id}
      name={person.name}
      street={person.street}
      age={person.age}
      number={person.phone}
      addNumber={addNumber}
      removeNumber={removeNumber}
      selectedResidentsNumber={selectedResidentsNumber}
    />
  ));
};