// Function to add more item as the buyer could order more than one item
function addItem() {
  const itemsDiv = document.getElementById("items");
  const row = document.createElement("div");
  row.className = "item-row";
  row.innerHTML = `
        <input class ="item-name" placeholder = "Item Name">
        <input class ="item-qty" type ="number" placeholder = "Quantity">
        <input class="item-desc" type="text" placeholder="Description (optional)" />
        `;

  itemsDiv.appendChild(row);
}
