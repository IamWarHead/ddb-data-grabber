// 'use strict';
let payload = {};
let tab = null;

const trimmer = str => str.replace(/\=/g,"");

async function setUserIdListener(data, sender) {
    if (data.type === "setUserID") {
        payload["uid"] = data.userID;
        try {
            const token = await getCobaltSessionToken();
            payload["cbt"] = token;
            await navigator.clipboard.writeText(JSON.stringify(payload));
            payload = null;
        }
        catch(error) {
            console.error("Something went wrong", error);
        }
        return Promise.resolve('done');
    }
}

const getCobaltSessionToken = async () => {
  return new Promise((resolve, reject) => {
    const filter = {
      name: "CobaltSession",
      domain: ".dndbeyond.com",
    };

    chrome.cookies.getAll(filter, function (cookies) {
      if (cookies.length > 0) resolve(cookies[0].value);
      else reject(null);
    });
  });
};

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0].url.indexOf("www.dndbeyond.com") > -1) {
        getDataButton.removeAttribute("disabled");
        description.innerHTML = "<strong>Everything is set!</strong><br/>Click to the button below to copy the data to the clipboard...";
        description.classList.remove("err");
        tab = tabs[0].id;
    } else {
        description.innerText = "You have to be on www.dndbeyond.com...";
        description.classList.add("err");
        getDataButton.setAttribute("disabled", "disabled");
        tab = null;
    }
});

const getDataButton = document.getElementById("getDataButton");
const description = document.getElementById("desc");

const onGetDataButtonClick = () => {
    console.log("GetDataButton clicked");
    if (!tab) console.error("Something went wrong...");
    chrome.tabs.sendMessage(tab, { type: "getUserID" });
}

chrome.runtime.onMessage.addListener(setUserIdListener);
getDataButton.addEventListener("click", onGetDataButtonClick);