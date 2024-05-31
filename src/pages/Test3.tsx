import { useEffect, useState } from 'react';
import { database } from '../firebase-config.tsx';
import { onValue, ref } from 'firebase/database';
import { Course } from './Courses.tsx';

// const syllabusIndex = {
//   a: 'id', !
//   b: 'title', !
//   c: 'title_jp', !
//   d: 'instructor',
//   e: 'instructor_jp',
//   f: 'lang',
//   g: 'type',
//   h: 'term',
//   i: 'occurrences',
//   j: 'min_year',
//   k: 'category',
//   l: 'credit', !
//   m: 'level',
//   n: 'eval',
//   o: 'code',
//   p: 'subtitle',
// };
// ADD A SEPARATE SCHOOL ATTRIBUTE

// FirebaseCourse interface matching the structure
interface FirebaseCourse {
  a: string; // id
  b: string; // title
  c: string; // title_jp
  d: string; // instructor
  e: string; // instructor_jp
  f: string; // lang
  g: string; // type
  h: string; // term
  i: string; // occurrences
  j: string; // min_year
  k: string; // category
  l: number; // credit
  m: string; // level
  n: string; // eval
  o: string; // code
  p: string; // subtitle
}

function Test3() {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<FirebaseCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<FirebaseCourse[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [schoolName, setSchoolName] = useState('PSE');

  useEffect(() => {
    // Fetch data from Firebase
    const coursesRef = ref(database, schoolName); // Default reference is PSE, this hook will rerender the ui when ever the schoolName is
    onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fullCoursesArray: FirebaseCourse[] = Object.values(data);
        setCourses(fullCoursesArray);
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

  const changeSchool = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSchoolName(e.currentTarget.textContent || ' ');
    setSearchTerm('');
  };

  const addCourse = (course: FirebaseCourse) => {
    // Convert FirebaseCourse to Course
    const newCourse: Course = {
      id: course.a,
      name: course.b,
      name_jp: course.c,
      credit: course.l,
      progress: 0, // Default progress value, incomplete
      school: schoolName,
    };

    if (!selectedCourses.find((c) => c.id === course.a)) {
      // Course is not already selected, add it to the state
      setSelectedCourses((prevSelectedCourses) => [
        ...prevSelectedCourses,
        newCourse,
      ]);
    }
  };

  const deleteCourse = (courseToDelete: Course) => {
    setSelectedCourses((prevSelectedCourses) =>
      prevSelectedCourses.filter((c) => c.id !== courseToDelete.id),
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
              <div key={course.id}>
                <p>Course Title: {course.name}</p>
                <p>Course ID: {course.id}</p>
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
