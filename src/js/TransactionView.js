import Storage from "./Storage.js";

const uploadedBtn = document.querySelector(".primary-btn");
const tableContainer = document.querySelector(".table-container");
const buttonSection = document.querySelector(".button-section");
const searchForm = document.querySelector(".search-form");
const tableBody = document.querySelector("tbody");
const searchInput = document.querySelector("#search-input");
const PriceSortBtn = document.querySelector("#price-sort");
const DateSortBtn = document.querySelector("#Date-sort");

class TransactionView {
  constructor() {
    uploadedBtn.addEventListener("click", (e) => this.showTableView(e));
    searchInput.addEventListener("input", (e) => this.searchTransaction(e));
    PriceSortBtn.addEventListener("click", (e) => this.sortPrice(e));
    DateSortBtn.addEventListener("click", (e) => this.sortDate(e));

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

    // remove innet table
    tableBody.innerHTML = "";

    axios
      .get(`http://localhost:3000/transactions?refId_like=${query}`)
      .then((res) => {
        const searchedtransactions = res.data;

        // save to local storage
        Storage.saveTransactions(searchedtransactions);

        // add data to table
        this.uiTransaction(searchedtransactions);
      })
      .catch((err) => console.log(err));
  }

  sortPrice(e) {
    e.preventDefault();

    const query = searchInput.value.trim();

    const isAscending = e.target.dataset.order === "asc";
    const sortOrder = isAscending ? "desc" : "asc";

    //new dataset
    e.target.dataset.order = sortOrder;

    // change direction icon
    e.target.classList.toggle("down", !isAscending);
    e.target.classList.toggle("up", isAscending);

    if (query) {
      // remove innet table
      tableBody.innerHTML = "";

      axios
        .get(
          ` http://localhost:3000/transactions?refId_like=${query}&_sort=price&_order=${sortOrder}`
        )
        .then((res) => {
          const searchedtransactions = res.data;

          // save to local storage
          Storage.saveTransactions(searchedtransactions);

          // add data to table
          this.uiTransaction(searchedtransactions);
        })
        .catch((err) => console.log(err));
    } else {
      //api
      axios
        .get(
          `http://localhost:3000/transactions?_sort=price&_order=${sortOrder}`
        )
        .then((res) => {
          const sortedTransactions = res.data;

          //save to local storage
          Storage.saveTransactions(sortedTransactions);
          // Ipdated UI
          this.uiTransaction(sortedTransactions);
        })
        .catch((err) => console.error(err));
    }
  }

  sortDate(e) {
    const isAscending = e.target.dataset.order === "asc";
    const sortOrder = isAscending ? "desc" : "asc";

    //new dataset
    e.target.dataset.order = sortOrder;

    // change direction icon
    e.target.classList.toggle("down", !isAscending);
    e.target.classList.toggle("up", isAscending);

    if (e.target.dataset.order === "desc") {
      this.TransactionsData = this.TransactionsData.sort((a, b) => {
        return new Date(a.date) > new Date(b.date) ? -1 : 1;
      });
    } else {
      this.TransactionsData = this.TransactionsData.sort((a, b) => {
        return new Date(a.date) > new Date(b.date) ? 1 : -1;
      });
    }
    //save to local storage
    Storage.saveTransactions(this.TransactionsData);

    // Ipdated UI
    this.uiTransaction(this.TransactionsData);
  }
}

export default new TransactionView();
