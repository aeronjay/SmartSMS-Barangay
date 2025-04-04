import SearchInput from "../SearchInput";
import { useEffect, useState } from "react";

export default function Receipients({ receipients = [], selectedResidentsNumber = [], setselectedResidentsNumber }) {

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

  return (
    <div className='broadcast-recipients'>
      <div className="upper-filter">
        <UpperFilter search={search} setSearch={setSearch} />
        <div className="receipients">
          {/* Receipeints */}
          {receipients.map(person => {
            return (<ReceipientsCard
              key={person.id}
              id={person.id}
              name={person.name}
              street={person.street}
              age={person.age}
              number={person.phone}
              addNumber={addNumber}
              removeNumber={removeNumber}
              selectedResidentsNumber={selectedResidentsNumber}
            />)
          })}

        </div>
      </div>
    </div>
  )
}

const UpperFilter = ({ search, setSearch }) => {

  return (
    <div className="main-border">
      <div className="receipients-filter">
        <div className="receipients-filter-main">
          <h6>Receipients</h6>
        </div>
        <div className="filter-actions">
          <a href="#">Select all</a>
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