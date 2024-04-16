import { db } from "@/config/firebase";
import { format } from "date-fns";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

function setDocRef(stocksMode, currentDateState) {
  const stocksModeCollectionRef = collection(db, "stockModes");
  const stocksModeDocRef = doc(stocksModeCollectionRef, stocksMode);
  const yearCollectionRef = collection(stocksModeDocRef, "years");
  const yearDocRef = doc(yearCollectionRef, format(currentDateState, "yyyy"));
  const monthCollectionRef = collection(yearDocRef, "months");
  const monthDocRef = doc(monthCollectionRef, format(currentDateState, "MMMM"));

  return monthDocRef;
}

export async function getProducts(stocksMode, dateString) {
  const currentDateState = new Date(dateString);
  const monthDocRef = setDocRef(stocksMode, currentDateState);

  const docSnap = await getDoc(monthDocRef);

  if (docSnap.exists()) {
    return docSnap.data().data;
  }

  return [];
}

export async function setProducts({ stocksMode, currentDateState, data }) {
  const monthDocRef = setDocRef(stocksMode, currentDateState);

  return await setDoc(monthDocRef, { data });
}
