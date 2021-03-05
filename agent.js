const { ID : userID } = window.Cobalt.User;

const sendUserID = () => {
    window.postMessage({type: "setUserID", value: userID}, "*");
}

(function getUserID() {
    try {
        window.addEventListener("message", ({data}) => data.type === "getUserID" && sendUserID());
    } catch(error) {
        console.error(error);
    }
})();