// The Configurations of the database of the app
const firebaseConfig = {
  apiKey: "AIzaSyDlcwFnHnBb9bRv5xoUEb-2sTSjQcyz84E",
  authDomain: "order-tracker-51471.firebaseapp.com",
  projectId: "order-tracker-51471",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const tableBody = document.getElementById("ordersTable");

// Generally try to get the data from the stored files in the firebase domain
db.collection("orders")
  .orderBy("createdAt", "desc")
  .onSnapshot((snapshot) => {
    tableBody.innerHTML = "";

    // const name = document.getElementById("name").value.trim();
    // const phone = document.getElementById("phone").value.trim();

    snapshot.forEach((doc) => {
      const data = doc.data();

      // Iterate through each item in order to list them appropraitely.
      // If there is no item in the database it displays "No item"
      const itemList = (data.items || []).length
        ? data.items
            .map((i) => {
              const desc = i.description ? `<div class="small">${i.description}</div>` : "";
              return `<div><div>${i.name} (x${i.qty})</div>${desc}</div>`;
            })
            .join("")
        : "<em>No item</em>";

      // Here we create a new <tr> element to be appended after the <thead> element inside the <tbody> with the id odersTable making it row by row of items purchased as it loops through the item in the database.
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${data.orderId}</td>
          <td>${data.name}</td>
          <td>${data.phone}</td>
          <td>${itemList}</td>
          <select onchange="updateStatus('${doc.id}', this.value)">
            <option ${
              data.status === "Pending" ? "selected" : ""
            }>Pending</option>
              <option ${
                data.status === "Processing" ? "selected" : ""
              }>Processing</option>
              <option ${
                data.status === "Ready" ? "selected" : ""
              }>Ready</option>
              <option ${
                data.status === "Delivered" ? "selected" : ""
              }>Delivered</option>
              </select>
              </td>
              <td>
                <button onclick ="editOrder('${doc.id}')">Edit</button>
                <button onclick ="printOrder('${doc.id}')">Print</button>
    
              <td>
        `;

      tableBody.appendChild(row);
    });
  });

function updateStatus(id, status) {
  db.collection("orders").doc(id).update({ status });
}

window.currentEditId = null;

// Function to edit existing order
window.editOrder = function (orderId) {
  location.href = `admin.html?edit=${orderId}`;
  window.currentEditId = orderId;

  db.collection("orders")
    .doc(orderId)
    .get()
    .then((doc) => {
      const data = doc.data();

      document.getElementById("name").value = data.name;
      document.getElementById("phone").value = data.phone;

      const container = document.getElementById("itemsContainer");
      container.innerHTML = "";

      (data.items || []).forEach((item) => {
        const div = document.createElement("div");
        div.className = "items-row";
        div.innerHTML = `
              <input class = "item-name" value = "${item.name}"
              <input type = "number" class = "item-qty" value = "${item.qty}"
              `;
        container.appendChild(div);
      });

      document.getElementById("submitBtn").innerText = "Update Order";
    });

  if (currentEditId) {
    db.collection("orders")
      .doc(currentEditId)
      .update({
        name,
        phone,
        items,
      })
      .then(() => {
        currentEditId = null;
        submitBtn.innerText = "Add Order";
        alert("Order updated successfully");
      });
  }
};

// Function to print order details
window.printOrder = function (orderId) {
  db.collection("orders")
    .doc(orderId)
    .get()
    .then((doc) => {
      const d = doc.data();

      const items = (d.items || [])
        .map((i) => `<li><div class="line"><span>${i.name}</span><span>x${i.qty}</span></div>${i.description ? `<div class=\"desc\">${i.description}</div>` : ""}</li>`)
        .join("");

      const win = window.open("", "", "width=480,height=700");
      const now = new Date();

      const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Order Slip - ${d.orderId || ''}</title>
    <link rel="stylesheet" href="${location.origin + location.pathname.replace(/\\[^\\/]*$/, '')}/index.css" />
    <style>
      /* Print-specific adjustments */
      @page { margin: 8mm; }
      body { background: #fff !important; }
      .print-container { max-width: 380px; margin: 0 auto; }
      .print-card { box-shadow: none; border-radius: 10px; border: 1px solid var(--border); padding: 14px; }
      .print-header { text-align: center; margin-bottom: 8px; }
      .brand { font-weight: 700; font-size: 16px; letter-spacing: .02em; }
      .meta { color: var(--text-muted); font-size: 11px; }
      .divider { border: none; border-top: 1px solid var(--border); margin: 8px 0 10px; }
      .kv { display: grid; grid-template-columns: 110px 1fr; gap: 6px 10px; font-size: 12px; }
      .kv .label { color: var(--text-muted); }
      .items { margin-top: 8px; }
      .items ul { list-style: none; padding: 0; margin: 0; }
      .items li { padding: 4px 0; border-bottom: 1px dashed var(--border); }
      .items li .line { display:flex; justify-content: space-between; }
      .items li .desc { color: var(--text-muted); font-size: 11px; margin-top: 2px; }
      .items li:last-child { border-bottom: none; }
      .foot { margin-top: 16px; color: var(--text-muted); font-size: 12px; text-align: center; }
      .noprint { display: none; }
      @media screen { .noprint { display: inline-block; margin-top: 16px; } }
    </style>
  </head>
  <body>
    <div class="print-container">
      <div class="print-card">
        <div class="print-header">
          <div class="brand">Order Slip</div>
          <div class="meta">${now.toLocaleString()}</div>
        </div>
        <hr class="divider" />
        <div class="kv">
          <div class="label">Order ID</div><div>${d.orderId || ''}</div>
          <div class="label">Name</div><div>${d.name || ''}</div>
          <div class="label">Phone</div><div>${d.phone || ''}</div>
          <div class="label">Status</div><div>${d.status || ''}</div>
        </div>
        <div class="items">
          <h3 style="margin:8px 0 6px; font-size:14px;">Items</h3>
          <ul>${items}</ul>
        </div>
        <div class="foot">Thank you for your order.</div>
        <button class="noprint" onclick="window.print()">Print</button>
      </div>
    </div>
    <script>setTimeout(function(){ window.print(); }, 50);<\/script>
  </body>
</html>`;

      win.document.open();
      win.document.write(html);
      win.document.close();
    });
};
