const indexedDB = window.indexedDB;

let db;
console.log("db before open budget");
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function ({ target }) {
  let db = target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function ({ target }) {
  db = target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

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
window.addEventListener("online", checkDatabase);
