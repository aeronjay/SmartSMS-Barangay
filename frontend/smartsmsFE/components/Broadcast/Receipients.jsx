import SearchInput from "../SearchInput";
import { useState } from "react";

export default function Receipients() {
  const recipients = [
    { id: 1, name: "Juan Dela Cruz", street: "st mary", age: 65 , priority: true, checked: true },
    { id: 2, name: "Maria Santos", street: "st lukes", age: 25 , priority: true, checked: false },
    { id: 3, name: "Pedro Reyes", street: "street 142", age: 42 , priority: true, checked: true },
    { id: 4, name: "Ana Gonzales", street: "street 142", age: 18, checked: false },
    { id: 5, name: "Roberto Lim", street: "street 142", age: 70, checked: true },
    { id: 6, name: "Elena Cruz", street: "street 142", age: 35 , priority: true, checked: false },
    { id: 7, name: "Jose Garcia", street: "street 142", age: 28, checked: true },
    { id: 9, name: "Carmen Reyes", street: "street 142", age: 68, checked: false },
    { id: 10, name: "Carmen Reyes", street: "street 142", age: 68, checked: false },
    { id: 11, name: "Carmen Reyes", street: "street 142", age: 68, checked: false },
    { id: 12, name: "Carmen Reyes", street: "street 142", age: 68, checked: false },
    { id: 13, name: "Carmen Reyes", street: "street 142", age: 68, checked: false },
];


  return (
    <div className='broadcast-recipients'>
      <div className="upper-filter">
        <UpperFilter />
        <div className="receipients">
          {/* Receipeints */}
          {recipients.map(person => {
            return (<ReceipientsCard 
                        key={person.id} 
                        id={person.id} 
                        name={person.name} 
                        street={person.street} 
                        age={person.age} 
                        priority={person.priority} 
                        />)
          })}
        </div>
      </div>
    </div>
  )
}

const UpperFilter = () => {

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
        <SearchInput />
      </div>
    </div>
  )
}

const ReceipientsCard = ({ id, name, street, age, priority, }) => {
  const [isChecked, setIsChecked] = useState(false); // Initialize state from prop

  // Toggle function for checkbox
  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

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