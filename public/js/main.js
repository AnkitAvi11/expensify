
function getTarget(e) {
    if(!e) {
        e = window.event;
    }
    return e.target || e.srcElement;
}

window.addEventListener('load', () => {
    let table = document.getElementsByTagName('table')[0];
    table.addEventListener('click', (e) => {
        let target = getTarget(e);
        let parentNode = target.parentNode;
        document.querySelector("div.modal-body").firstElementChild.textContent=parentNode.firstElementChild.textContent;
    }, false)
}, false);