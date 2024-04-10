import { useState, useEffect } from 'react';
import { db } from '/Users/y.h.lien/Desktop/Github/CourseTracker/src/firebase-config.tsx';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';

const Test = () => {
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState(0);
  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, 'users');

  // Function to add a new user to Firestore
  const createUser = async () => {
    await addDoc(usersCollectionRef, { name: newName, age: Number(newAge) });
  };

  // Function to update the age of a user in Firestore
  const updateUser = async (id, age) => {
    const userDoc = doc(db, 'users', id);
    const newField = { age: age + 1 };
    await updateDoc(userDoc, newField);
  };

  // Function to delete a user from Firestore
  const deleteUser = async (id) => {
    const userDoc = doc(db, 'users', id);
    await deleteDoc(userDoc);
  };

  useEffect(() => {
    // Function to fetch initial users and set up real-time updates
    const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
      const updatedUsers = [];
      snapshot.forEach((doc) => {
        updatedUsers.push({ ...doc.data(), id: doc.id });
      });
      setUsers(updatedUsers);
    });

    // Clean up function to unsubscribe from real-time updates when component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array to run only once when component mounts

  return (
    <div
      className="Test"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <input
          placeholder="Name..."
          onChange={(event) => {
            setNewName(event.target.value);
          }}
        ></input>
        <br />
        <input
          type="number"
          placeholder="Age..."
          onChange={(event) => {
            // @ts-expect-error: Ignore type error since event.target.value is expected to be a string
            setNewAge(event.target.value);
          }}
        ></input>
        <br />
        <button onClick={createUser}>Create User</button>
        <br />
        {users.map((user) => {
          return (
            <div key={user.id}>
              <h1>Name: {user.name}</h1>
              <h1>Age: {user.age}</h1>
              <button
                onClick={() => {
                  updateUser(user.id, user.age);
                }}
              >
                Increase Age
              </button>
              <button
                onClick={() => {
                  deleteUser(user.id);
                }}
              >
                Delete User
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Test;

// const Test = () => {
//   return <div className="App"></div>;
// };

// export default Test;
