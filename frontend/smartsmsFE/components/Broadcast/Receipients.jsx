
export default function Receipients(){
    const receipients = [
        {
          "name": "Aeron",
          "street": "St. Mary St.",
          "age": 16,
          "priority": true
        },
        {
          "name": "Asda",
          "street": "St. Mary St.",
          "age": 16,
          "priority": true
        },
        {
          "name": "Jordan",
          "street": "Elm Street",
          "age": 22,
          "priority": false
        },
        {
          "name": "Taylor",
          "street": "Oak Avenue",
          "age": 29,
          "priority": true
        },
        {
          "name": "Morgan",
          "street": "Pine Lane",
          "age": 34,
          "priority": false
        },
        {
          "name": "Casey",
          "street": "Maple Drive",
          "age": 27,
          "priority": true
        },
        {
          "name": "Riley",
          "street": "Cedar Road",
          "age": 19,
          "priority": false
        },
        {
          "name": "Alex",
          "street": "Birch Boulevard",
          "age": 31,
          "priority": true
        },
        {
          "name": "Jamie",
          "street": "Willow Way",
          "age": 25,
          "priority": false
        },
        {
          "name": "Pat",
          "street": "Hickory Court",
          "age": 40,
          "priority": true
        }
    ]
      

    return(
        <div className='broadcast-recipients'>
            <div className="upper-filter">
                <UpperFilter />
                <div className="receipients">
                    {/* Receipeints */}
                </div>
            </div>
        </div>
    )
}

const UpperFilter = () => {
    
    return (
        <div className="receipients-filter">
             <div>
                <h6>Receipients</h6>
            </div>
            <div className="filter-actions">
                {/* FILTER RESIDENT RECEIPIENTS HERE */}
                <a href="#">Select all</a>
            </div>
        </div>
    )
}