// fancy alert (alertType can be either 'info' or 'error')
export class FancyAlert{
    constructor(content, alertType, headerText = 'Error', footer = false) {
        this.content = content;
        this.alertType = alertType;
        this.headerText = headerText;
        this.footer = footer;

        if (this.content) {
            // Get modal-header element
            this.modalHeader = document.getElementsByClassName("modal-header");
            // Get modal-footer element
            this.modalFooter = document.getElementsByClassName("modal-footer");
            // remove any remnant footer
            if (this.modalFooter[0].firstChild) {
                while (this.modalFooter[0].firstChild) {
                    this.modalFooter[0].removeChild(this.modalFooter[0].firstChild);
                }
            }
            // check if modal-header has been previously set (remove H2 if so)
            var hOld = this.modalHeader[0].children[1]; // .children[1] is H2 node ('undefined' if not exists)
            if (document.body.contains(hOld)) {
                this.modalHeader[0].removeChild(hOld);
            }
            // Set modal-header content
            var hNew = document.createElement("H2");
            var t = document.createTextNode(this.headerText);
            hNew.appendChild(t);
            this.modalHeader[0].appendChild(hNew);
            // Set modal-body content
            this.modalBody = document.getElementsByClassName("modal-body")[0];
            this.modalBody.innerHTML = this.content;
            // if specified, set modal-footer content
            if (this.footer) {
                this.modalFooter[0].appendChild(footer);
                this.modalFooter[0].classList.remove("hidden");
            } else {
                this.modalFooter[0].classList.add("hidden");
            }
            // Add style according to alert type
            if (this.alertType === 'error') {
                this.modalHeader[0].classList.add("error-color");
            }
            if (this.alertType === 'info') {
                this.modalHeader[0].classList.add("info-color");
            }
            // Get the modal
            this.modal = document.getElementById('alertModal');
            // Get the <span> element that closes the modal
            this.span = document.getElementsByClassName("close")[0];
            this.modal.style.display = "flex";

            // (https://stackoverflow.com/a/19624214/1979665)
            var _this = this;
            // When the user clicks on <span> (x), close the modal
            this.span.onclick = function() {_this.closeAlert()};

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                if (event.target == _this.modal) {
                    _this.closeAlert();
                }
            }
        }
    }

    closeAlert() {
        // scroll the modal_body to top
        this.modalBody.scrollTop = 0;
        this.modal.style.display = "none";
        // finally remove header content/classes (otherwise next time the old ones still persist)
        this.modalHeader[0].classList.remove("error-color");
        this.modalHeader[0].classList.remove("info-color");
        if (this.footer) {
            this.modalFooter[0].removeChild(this.footer);
        }
    }
}

