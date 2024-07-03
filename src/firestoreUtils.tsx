import { doc, setDoc } from "firebase/firestore";
import { CourseCategory } from "./pages/Courses";
import { auth, db } from "./firebase-config";

export const updateCourseCategoriesInFirestore = async (
  updatedCategories: CourseCategory[]
) => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      await setDoc(userDocRef, { Advance: updatedCategories }, { merge: true });
      console.log("Categories updated in Firestore.");
    } catch (error) {
      console.error("Error updating categories in Firestore:", error);
    }
  } else {
    console.log("No user is currently logged in.");
  }
};
