//  function to get the targe
function getTarget(e) {
    if(!e) {
        e = window.event;
    }
    return e.target || e.srcElement;
}

//  function to create an XHR 
function createXHR() {
    return new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
}

//  function to get the expenseDetails for the Modal
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

//  function getDoughnat
function getDoughnat () {
    fetch("http://localhost:8080/profile/getdoughnat", {
        method :"GET"
    })
    .then(res => {
        return res.json();
    }).then(data => {
        //  creating the doughnat at the home page
        var ctx = document.getElementById('myChart').getContext('2d');
        let mydata = {
            labels: ['EXPENSE', 'INCOME'],
            datasets: [{
                label: 'INCOME VS EXPENSE',
                data: data.expense,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        };

        var myDoughnutChart = new Chart(ctx, {
            type: 'doughnut',
            data: mydata
        });
    }).catch(err => {
        console.log(err);
    });
}

//  window load event listener
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

    //  calling out the dougnat function
    getDoughnat();

}, false);

function createBarGraph() {
    fetch("http://localhost:8080/profile/gethomebargraph")
    .then(res => {
        return res.json();
    }).then(data => {
        let req_days = [];
        let data_to_show = [];
        
        let cdate=data.date, lastdate=data.lastdate;
        while(cdate>=lastdate){
            let date = new Date();
            date.setDate(cdate);
            req_days.push(date.toDateString().split(" ")[0])
            cdate--;
        }
        
        req_days.reverse();

        req_days.forEach(el => {
            let index = data.result.findIndex(e => e.day == el);
            if(index<0) {
                data_to_show.push(0);
            }else{
                data_to_show.push(data.result[index].amount);
            }
        });

        console.log(data_to_show)

        var ctx = document.getElementById('barGraph').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: req_days,
                datasets: [{
                    label: 'Weekly Expenses',
                    data: data_to_show,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

    }).catch(err => {
        console.log(err);
    });
    
}

window.addEventListener('load', function() {
    createBarGraph();
    
}, false);

