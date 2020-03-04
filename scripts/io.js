function read(key) {
  if (typeof (window.Storage) === "undefined"){
		// storage not supported by browser
    return "undefined";
  } else {
    // return null or the found value
    return localStorage.getItem(key);
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(error.name + ": " + error.message);
  }
}
