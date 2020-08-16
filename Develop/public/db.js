const { all } = require("../routes/api");

const indexedDB = window.indexedDB;

let db;

const request = indexedDB.open("budget", 1);

//23, 21
//mongoose onupgradeneeded

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
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");

  store.add(record);
}

function checkDatabase() {
  const transaction = db.transaction(["pending"], "readwrite");
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
          const transaction = db.transaction(["pending"], "readwrite");
          const store = transaction.objectStore("pending");
          store.clear();
        });
    }
  };
}

window.addeventlistener("online", checkDatabase());

//last things missing ===> three more functions

//savRecord (passing param or record)
//transaction varible
//store varible
//what am i returning (set store varilbe) store.add(record);

// checkDatabasze (called on 23) run before we make db connection

//check 3 var
//transaction ===> async db.transaction({"pending"}) [array, "readWrite")]

//store is the same as save record (transaction.objectStore("pending"))

// const = getAll() ===> store.getAll(); (still in check db function)

// call 3 vars (getAll.onsuccess = (dummy fucnton) function() {
// if (getAll.result.length > 0) {
// then do a fetch("api/transaction/bulk", {
// method: post, next is body: jsonSTRINGIFY(getAll.result)
//headers({accept json format})
// }

//.then((res) => {
//return res.json()
// })
//.then(() => {
//checking to see if the records have been deleted
//transaction ===> async db.transaction({"pending"}) [array, "readWrite")]
//store is the same as save record (transaction.objectStore("pending"))
//DONT FORGET STORE.CLEARALL()
// })
// )
// }
// } )

//listen for the app to come online once they come back online
//window.addeventlistener("online", checkDatabase())
