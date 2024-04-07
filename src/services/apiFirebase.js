import { db } from "@/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function getProducts(collection, id) {
  const docSnap = await getDoc(doc(db, collection, id));

  if (docSnap.exists()) {
    return docSnap.data().data;
  }

  return [];
}

export async function setProducts({ collection, id, data }) {
  return await setDoc(doc(db, collection, id), { data });
}
