/*
* This file handles all the persistent storage for our email system. Right now
* it uses localStorage only, but the site can be changed over to a server
* storage solution in this file alone.
*
* All localStorage read/writing that does not call io.js is very temporary and
* will never involve a server.
*
* @author Justin Gray (A00426753)
* @author Vitor Jeronimo
* @author Jay Patel
*/

/*
* Reads data from storage by a key.
*/
function read(key) {
  if (typeof (window.Storage) === "undefined"){
		// storage not supported by browser
    return "undefined";
  } else {
    // return null or the found value
    return localStorage.getItem(key);
  }
}

/*
* Writes data into storage using a key value pair. Value is written at location
* key. Just like a map.
*/
function write(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(error.name + ": " + error.message);
  }
}
