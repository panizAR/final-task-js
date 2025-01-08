export default class Storage {
  // save in localstorage
  static saveTransactions(transactions) {
    localStorage.setItem("Transaction", JSON.stringify(transactions));
  }

  // get transaction from storage
  static getAllTransactions() {
    const savedTransaction =
      JSON.parse(localStorage.getItem("Transaction")) || [];

    // sort=> نزولی des
    savedTransaction.sort((a, b) => {
      return a.id > b.id ? 1 : -1;
    });

    return savedTransaction;
  }
}
