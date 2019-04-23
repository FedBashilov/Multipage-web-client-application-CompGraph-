document.getElementById("burger").addEventListener("click", () => {openAndClose("menu")}, false);

document.getElementById("help").addEventListener("click", () => {openAndClose("topic_help")}, false);


function openAndClose(windowId) {
  let popUpWindow = document.getElementById(windowId);
  
  if(popUpWindow.classList.contains("close")) {
    popUpWindow.classList.remove("close");
    popUpWindow.classList.add("open");
  }
  else{
    popUpWindow.classList.remove("open");
    popUpWindow.classList.add("close");
  }
}