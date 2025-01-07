import Storage from "./Storage.js";
import TransactionView from "./TransactionView.js";

document.addEventListener("DOMContentLoaded", () => {
  axios
    .get("http://localhost:3000/transactions")
    .then((res) => {
      const transactions = res.data;

      // save to local storage
      Storage.saveTransactions(transactions);
    })
    .catch((err) => console.log(err));
});
