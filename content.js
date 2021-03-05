const sendUserId = (userID) => chrome.runtime.sendMessage(chrome.runtime.id, {type: "setUserID", userID});
const registerListener = () => window.addEventListener("message", ({data}) => data.type ==="setUserID" && sendUserId(data.value));
const getUserId = () => window.postMessage({type: "getUserID"});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type === "getUserID") {
      getUserId();
      sendResponse('done');
    }
  }
);

function injectScript(file_path, tag) {
    registerListener();
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.appendChild(script);
}

injectScript(chrome.extension.getURL('agent.js'), 'body');