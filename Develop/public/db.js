console.log("db.js loaded");
// const { all } = require("../routes/api");

const indexedDB = window.indexedDB;

let db;
console.log("db before open budget");
const request = indexedDB.open("budget", 1);

// google notes for what it does
request.onupgradeneeded = function ({ target }) {
  let db = target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

// google notes for what it does
request.onsuccess = function ({ target }) {
  db = target.result;

  //need to check to see if app is online ===> before reaching out to db (if statement)

  if (navigator.onLine) {
    checkDatabase();
  }
};

// google notes for what it does
request.onerror = function (event) {
  console.log("There was an error");
};

function saveRecord(record) {
  console.log("---> ", record);
  const transaction = db.transaction(["pending"], "readWrite");
  const store = transaction.objectStore("pending");

  store.add(record);
}

function checkDatabase() {
  const transaction = db.transaction(["pending"], "readWrite");
  const store = transaction.objectStore("pending");
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          // console.log(res);
          return res.json;
        })
        .then(() => {
          const transaction = db.transaction(["pending"], "readWrite");
          const store = transaction.objectStore("pending");
          store.clear();
          location.reload();
        });
    }
  };
}
// listen for app coming back online
window.addEventListener("online", checkDatabase);
