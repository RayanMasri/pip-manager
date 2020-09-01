// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
// Setup file logging
const { ipcRenderer } = require('electron')
const packageDiv = document.getElementById("packages");

// Renders a template string into an HTMLElement
const render = (template, parent) => {
  // Create element
  let element = document.createElement('template');
  element.innerHTML = template;

  // Extract references
  let references = {}

  Array.from(element.content.querySelectorAll("*")).map(element => {
      let reference = element.getAttribute("ref");
      if(reference) {                
          references[reference] = element;
          element.removeAttribute("ref");
      }
  })

  // Append template to parent
  parent.appendChild(element.content);

  return {
      element: element,
      references: references
  }
}

// Sends an asyncronous message to the main process to catch a list of pip packages
const refreshList = (callback) => {
  ipcRenderer.on('asynchronous-reply', (event, response) => {
    if(response.startsWith("stdout")) {
      let data = response.split(":")[1].split("\n");
  
      let result = data.slice(2).map(pkg => {
        let [name, version] = pkg.replace(/\s+/g,' ').trim().split(" ");
        if(version) {
          return {
            name: name,
            version: version
          };
        }
      })
  
      callback(result);
    } else {    
      callback(undefined);
    }
  })
  ipcRenderer.send('asynchronous-message', 'cmd-pip list')
}

// Catches the response sent back from the main process
// const catchList = (data) => {
//   if(data) {

//   } else {
//     console.log("Failed to catch list");
//   }
// }

refreshList((list) => {
  for(let element of list) {
    if(element) {
      let {name, version} = element;
      render(`
        <div class="package">        
          <div class="package-data">
            <div class="package-name">${name}</div>
            <div class="package-version">${version}</div>
          </div>    
        </div>
      `, packageDiv); 
    }
  }
});
