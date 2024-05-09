// import { useState } from 'react';
// import { database } from '/Users/y.h.lien/Desktop/Github/CourseTracker/src/firebase-config.tsx';

// import { ref, query, equalTo, get, onValue } from 'firebase/database';

// function SearchApp() {
//   const [queryText, setQueryText] = useState('');
//   const [results, setResults] = useState([]);

//   const handleSearch = async (event) => {
//     event.preventDefault();

//     const dbRef = ref(db, 'your_data_path'); // Replace 'your_data_path' with the path to your data in Firebase
//     const q = query(dbRef, equalTo('title', queryText));

//     onValue(q, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const searchResults = Object.values(data);
//         setResults(searchResults);
//       } else {
//         setResults([]);
//       }
//     });
//   };

//   const handleInputChange = (event) => {
//     setQueryText(event.target.value);
//   };

//   return (
//     <div>
//       <div>
//         <form onSubmit={handleSearch}>
//           <input
//             type="search"
//             value={queryText}
//             onChange={handleInputChange}
//             placeholder="Search..."
//           />
//           <button type="submit">Search</button>
//         </form>
//       </div>
//       <div>
//         {results.map((result, index) => (
//           <div key={index}>{result.title}</div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default SearchApp;
function Test2() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          backgroundColor: 'lightblue',
          padding: '20px',
          margin: '10px',
          overflowY: 'auto', // Enable scrolling if content exceeds space
          flex: 1, // Expand to fill available space
        }}
      >
        <div className="search-section">
          <form>
            <input type="text" placeholder="Search..." />
            <button>Search</button>
          </form>
          <div className="query-outcome">
            {/* Placeholder for query outcomes */}
            <div>
              <p>Query Outcome 1</p>
              <button> Add course</button>
            </div>
            <div>
              <p>Query Outcome 2</p>
              <button> Add course</button>
            </div>
            <div>
              <p>Query Outcome 3</p>
              <button> Add course</button>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          textAlign: 'center',
          backgroundColor: 'lightgreen',
          padding: '20px',
          margin: '10px',
          overflowY: 'auto', // Enable scrolling if content exceeds space
          flex: 1, // Expand to fill available space
        }}
      >
        <div className="query-section">
          <div className="query-outcome">
            {/* Placeholder for query outcomes */}
            <div>
              <p>Query Outcome 1</p>
              <button> Delete course</button>
            </div>
            <div>
              <p>Query Outcome 2</p>
              <button> Delete course</button>
            </div>
            <div>
              <p>Query Outcome 3</p>
              <button> Delete course</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Test2;
