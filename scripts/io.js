function read(key) {
  if (typeof (window.Storage) === "undefined"){
		// storage not supported by browser
    return "undefined";
  } else {
    // return null or the found value
    return JSON.parse(localStorage.getItem(key));
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error.name + ": " + error.message);
  }
}
