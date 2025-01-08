import Storage from "./Storage.js";

const uploadedBtn = document.querySelector(".primary-btn");
const tableContainer = document.querySelector(".table-container");
const buttonSection = document.querySelector(".button-section");
const searchForm = document.querySelector(".search-form");
const tableBody = document.querySelector("tbody");
const searchInput = document.querySelector("#search-input");

class TransactionView {
  constructor() {
    uploadedBtn.addEventListener("click", (e) => this.showTableView(e));
    searchInput.addEventListener("input", (e) => this.searchTransaction(e));

    this.TransactionsData = [];
  }

  // get transaction from localstorage
  getData() {
    this.TransactionsData = Storage.getAllTransactions();
    return this.TransactionsData;
  }

  showTableView() {
    // remove buttonSection
    buttonSection.classList.add("hidden");

    //show table container anf form search
    searchForm.classList.remove("hidden");

    tableContainer.classList.remove("hidden");

    // add data to table
    this.TransactionsData = this.getData();
    this.uiTransaction(this.TransactionsData);
  }

  uiTransaction(datas) {
    tableBody.innerHTML = "";

    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };

    const optionsHours = {
      hour: "2-digit",
      minute: "2-digit",
    };

    datas.forEach((transaction) => {
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

  searchTransaction(e) {
    e.preventDefault();
    const query = e.target.value.trim();

    // just number
    if (!/^\d*$/.test(query)) {
      console.log("فقط اعداد مجاز هستند.");
      tableBody.innerHTML = "";
      // tableBody.innerHTML = "<div>فقط اعداد مجاز هستند.</div>";
      return;
    }
    // empty
    if (query === "") {
      this.uiTransaction(this.TransactionsData);
      return;
    }

    // remove innet table
    tableBody.innerHTML = "";

    axios
      .get(`http://localhost:3000/transactions?refId_like=${query}`)
      .then((res) => {
        const searchedtransactions = res.data;

        console.log(searchedtransactions);

        // save to local storage
        Storage.saveTransactions(searchedtransactions);

        // add data to table
        this.uiTransaction(searchedtransactions);
      })
      .catch((err) => console.log(err));
  }
}

export default new TransactionView();
