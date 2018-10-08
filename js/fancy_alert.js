// fancy alert for errors
export function fancyAlert(headerText, content, alertType) {
    if (content) {
        // Get modal-header element
        var modalHeader = document.getElementsByClassName("modal-header");
        // check if modal-header has been previously set (remove H2 if so)
        var hOld = modalHeader[0].children[1]; // .children[1] is H2 node ('undefined' if not exists)
        if (document.contains(hOld)) {
            modalHeader[0].removeChild(hOld);
        }
        // Set modal-header content
        var hNew = document.createElement("H2");
        var t = document.createTextNode(headerText);
        hNew.appendChild(t);
        modalHeader[0].appendChild(hNew);
        // Set modal-body content
        document.getElementsByClassName("modal-body")[0].innerHTML = content;
        // Add style according to alert type
        if (alertType === 'error') {
            modalHeader[0].classList.add("error-color");
        }
        if (alertType === 'info') {
            modalHeader[0].classList.add("info-color");
        }
        // Get the modal
        var modal = document.getElementById('alertModal');
        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];
        modal.style.display = "block";
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
            // finally remove info/error classes (otherwise next time the old ones still persist)
            modalHeader[0].classList.remove("error-color");
            modalHeader[0].classList.remove("info-color");
        }
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
                // finally remove info/error classes (otherwise next time the old ones still persist)
                modalHeader[0].classList.remove("error-color");
                modalHeader[0].classList.remove("info-color");
            }
        }
    }
};