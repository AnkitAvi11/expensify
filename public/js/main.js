
function getTarget(e) {
    if(!e) {
        e = window.event;
    }
    return e.target || e.srcElement;
}

function createXHR() {
    return new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
}

function getExpenseDetails(id, token) {
    return new Promise((resolve, reject) => {
        
        let xhr = createXHR();

        xhr.onreadystatechange = () => {

            if(xhr.readyState == 4 && xhr.status == 200) {
                resolve(xhr.responseText);
            }

        }

        xhr.onerror = (err) => console.log(err);
        xhr.open("POST", "http://localhost:8080/profile/expense", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send("_csrf="+token+"&id="+id);

    });
}

window.addEventListener('load', () => {
    let card_container = document.querySelector("div#card-collect");
    card_container.addEventListener('click', (e) => {
        let tar = getTarget(e);
        if(tar.tagName.toLowerCase() === "button") {
            let exp_id =tar.id;
            let token = tar.value;
            getExpenseDetails(exp_id, token)
            .then(data => {
                return JSON.parse(data);
            }).then(result => {
                result = result[0];
                let {title, description, amount, type, exp_date} = result;
                document.querySelector("h4.modal-title").textContent = "Expense Details";
                document.getElementById('title').value = title;
                document.getElementById('desc').value = description;
                document.getElementById('amount').value = amount;
                document.getElementById('type').value = type;
            }).catch(err => {
                console.log(err);
            });
        }
        
    }, false);
}, false);