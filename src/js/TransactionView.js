import Storage from "./Storage.js";

const uploadedBtn = document.querySelector(".primary-btn");
const tableContainer = document.querySelector(".table-container");
const buttonSection = document.querySelector(".button-section");
const searchForm = document.querySelector(".search-form");
const tableBody = document.querySelector("tbody");

class TransactionView {
  constructor() {
    uploadedBtn.addEventListener("click", (e) => this.showTableView(e));

    this.TransactionsData = [];
  }

  // get transaction from localstorage
  getData() {
    this.TransactionsData = Storage.getAllTransactions();
  }

  showTableView() {
    // remove buttonSection
    buttonSection.classList.add("hidden");

    //show table container anf form search
    searchForm.classList.remove("hidden");
    tableContainer.classList.remove("hidden");

    // add data to table
    this.getData();

    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };

    const optionsHours = {
      hour: "2-digit",
      minute: "2-digit",
    };

    this.TransactionsData.forEach((transaction) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="row-number">${transaction.id}</td>
        <td class="${
          transaction.type === "افزایش اعتبار" ? "credit" : "debit"
        }">
          ${transaction.type}
        </td>
        <td>${transaction.price.toLocaleString()}</td>
        <td>${transaction.refId}</td>
        <td>${new Date(transaction.date).toLocaleString("fa-IR", options)} 
          ساعت  
        ${new Date(transaction.date).toLocaleString("fa-IR", optionsHours)}</td>
      `;
      tableBody.appendChild(row);
    });
  }
}

export default new TransactionView();
