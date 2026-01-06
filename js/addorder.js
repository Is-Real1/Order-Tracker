const params = new URLSearchParams(window.location.search);
const editId = params.get("editId") || params.get("edit");

if (editId) {
  window.currentEditId = editId;
  // Use Firestore v8 style API consistent with the rest of the project
  // Guard in case db is not available (e.g., during tests)
  if (typeof db !== "undefined" && db && db.collection) {
    db.collection("orders")
      .doc(editId)
      .get()
      .then((docSnap) => {
        const data = (docSnap && typeof docSnap.data === "function") ? (docSnap.data() || {}) : {};

        // Store orderId for sharing
        window.lastOrderId = data.orderId || null;

        const nameInput = document.getElementById("name");
        if (nameInput) nameInput.value = data.name || "";
        const phoneInput = document.getElementById("phone");
        if (phoneInput) phoneInput.value = data.phone || "";

        const container = document.getElementById("items");
        if (container) {
          container.innerHTML = ""; // Clear existing items

          (data.items || []).forEach((item) => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "item-row";
            itemDiv.innerHTML = `
      <input type="text" class="item-name" value="${item.name}" required>
      <input type="number" class="item-qty" value="${item.qty}" min="1" required>
      <input type="text" class="item-desc" value="${(item.description || "").replace(/`/g, '\\`')}" placeholder="Description (optional)">
    `;
            container.appendChild(itemDiv);
          });
        }
        const submitBtn = document.getElementById("submitBtn");
        if (submitBtn) submitBtn.innerText = "Update Order";
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

//wrote this to make sure we can recieve more than one order from one customer
function addOrder() {
  // e.preventDefault(); Not necessary becos we used the onclick() in the html
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();

  const itemNames = document.querySelectorAll(".item-name");
  const itemQtys = document.querySelectorAll(".item-qty");
  const itemDescs = document.querySelectorAll(".item-desc");

  const items = [];

  // With this we store each item inputed into the items array
  itemNames.forEach((input, index) => {
    const name = input.value.trim();
    const qty = Number(itemQtys[index].value);
    const descInput = itemDescs && itemDescs[index];
    const description = descInput ? descInput.value.trim() : "";

    if (name && qty > 0) {
      const itemObj = { name, qty };
      if (description) itemObj.description = description;
      items.push(itemObj);
    }
  });

  if (!name || !phone || items.length === 0) {
    alert("Please fill all required fields");
    return;
  }

  if (window.currentEditId) {
    // Update existing order
    db.collection("orders")
      .doc(window.currentEditId)
      .update({
        name,
        phone,
        items,
      })
      .then(() => {
        window.currentEditId = null;
        const btn = document.getElementById("submitBtn");
        if (btn) btn.innerText = "Add Order";
        const msg = document.getElementById("message");
        if (msg) msg.innerHTML = "✅ Order updated successfully";
        // alert("Order updated successfully");
      });
  } else {
    // Generating a unique order ID

    const orderId = "ORD-" + Date.now().toString().slice(-6);

    // Where we actually added the orders
    db.collection("orders")
      .add({
        orderId,
        name,
        phone,
        // item: document.getElementById("item").value,
        // quantity: Number(document.getElementById("quantity").value),
        items,
        status: "Pending",
        createdAt: new Date(),
      })
      .then(() => {
        // Store for sharing
        window.lastOrderId = orderId;
        document.getElementById("message").innerHTML =
          "✅ Order added <br><strong>Order ID:</strong>" + orderId;
      })
      .catch((err) => {
        console.error(err);
        document.getElementById("message").textContent = err.message;
      });
  }
}
