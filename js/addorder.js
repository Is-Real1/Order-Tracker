import { db } from "./firebase.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

console.log("DB vlue:", db);

const name = document.getElementById("name");
const phone = document.getElementById("phone");
const item = document.getElementById("item");
const quantity = document.getElementById("quantity");
const message = document.getElementById("message");

document.getElementById("addOrderBtn").addEventListener("click", async () => {
  try {
    await addDoc(collection(db, "orders"), {
      name: name.value.trim(),
      phone: phone.value.trim(),
      item: item.value.trim(),
      quantity: Number(quantity.value),
      status: "Pending",
      createdAt: new Date(),
    });

    message.textContent = "Order added successfully!";
    name.value = phone.value = item.value = quantity.value = "";
  } catch (error) {
    message.textContent = "Error adding order";
    console.error(error);
  }
});
