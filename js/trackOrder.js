function trackOrder() {
  const value = document.getElementById("search").value.trim();
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "Checking...";

  if (!value) {
    resultDiv.innerHTML = "⚠ Please enter Order ID or Phone Number";
    return;
  }

  resultDiv.innerHTML = "Checking...";

  let queryRef;

  // Detect Order ID (starts with ORD-)
  if (value.toUpperCase().startsWith("ORD-")) {
    queryRef = db
      .collection("orders")
      .where("orderId", "==", value.toUpperCase());
  } else {
    // Otherwise treat as phone number
    queryRef = db.collection("orders").where("phone", "==", value);
  }

  queryRef
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        resultDiv.innerHTML = "❌ No order found";
        return;
      }

      resultDiv.innerHTML = "";

      snapshot.forEach((doc) => {
        const data = doc.data();
        // Item Display
        const itemsHtml = (data.items || [])
          .map((i) => `<li>${i.name} * ${i.qty}</li>`)
          .join("");
        resultDiv.innerHTML += `
              <div class="result">
                <p><strong>Order ID:</strong>${data.orderId}</p>
                <p><strong>Status:</strong> ${data.status}</p>

                <h4>Items:</h4>
                <ul>${itemsHtml}</ul>
              </div>
            `;
      });
    })
    .catch((err) => {
      console.error(err);
      resultDiv.innerHTML = err.message;
    });
}
