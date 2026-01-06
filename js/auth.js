import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://wwww.gstatic.com/firebase.js/9.23.0/firebase-auth.js";

import { app } from "./firebase.js";

const auth = getAuth(app);

export function login() {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => (location = "orders.html"))
    .catch(() => alert("Login failed"));
}

onAuthStateChanged(auth, (user) => {
  if (!user && location.pathname.includes("orders")) {
    location = "login.html";
  }
});
