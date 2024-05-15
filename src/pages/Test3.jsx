import { useEffect, useState } from 'react';
import { database } from '/Users/y.h.lien/Desktop/Github/CourseTracker/src/firebase-config.tsx';
import { onValue, ref } from 'firebase/database';

// const syllabusIndex = {
//   a: 'id',
//   b: 'title',
//   c: 'title_jp',
//   d: 'instructor',
//   e: 'instructor_jp',
//   f: 'lang',
//   g: 'type',
//   h: 'term',
//   i: 'occurrences',
//   j: 'min_year',
//   k: 'category',
//   l: 'credit',
//   m: 'level',
//   n: 'eval',
//   o: 'code',
//   p: 'subtitle',
// };

function Test3() {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [schoolName, setSchoolName] = useState('PSE');

  useEffect(() => {
    // Fetch data from Firebase
    const coursesRef = ref(database, schoolName); // Default reference is PSE, this hook will rerender the ui when ever the schoolName is
    onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fullCoursesArray = Object.values(data);
        // const topFiveCourses = fullCoursesArray.slice(0, 5);
        setCourses(fullCoursesArray);
        // setFilteredCourses(topFiveCourses);
      }
    });
  }, [schoolName]);

  useEffect(() => {
    // This hook rerender the ui when ever the input in search input field and the
    const filtered = courses.filter(
      (course) =>
        course.b.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.a.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  const changeSchool = (e) => {
    setSchoolName(e.target.textContent);
    setSearchTerm('');
  };

  const addCourse = (course) => {
    setSelectedCourses((prevSelectedCourses) => {
      // Check if the course is already in the selectedCourses array
      if (prevSelectedCourses.find((c) => c.a === course.a)) {
        return prevSelectedCourses; // Course is already selected, return the current state
      }
      // Return a new array with the added course
      return [...prevSelectedCourses, course];
    });
  };

  const deleteCourse = (course) => {
    setSelectedCourses((prevSelectedCourses) =>
      prevSelectedCourses.filter((c) => c.a !== course.a),
    );
  };

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
        <button onClick={changeSchool}>FSE</button>
        <button onClick={changeSchool}>PSE</button>
        <div>Showing courses of {schoolName}</div>
        <div className="search-section">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="query-outcome">
            {filteredCourses.map((course) => (
              <div key={course.a}>
                <p>Course Title: {course.b}</p>
                <p>Course ID: {course.a}</p>
                <button onClick={() => addCourse(course)}>Add course</button>
              </div>
            ))}
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
            {selectedCourses.map((course) => (
              <div key={course.a}>
                <p>Course Title: {course.b}</p>
                <p>Course ID: {course.a}</p>
                <button onClick={() => deleteCourse(course)}>
                  Delete course
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Test3;
