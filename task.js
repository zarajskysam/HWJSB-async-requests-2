let pollTitle = document.getElementById("poll__title");
let pollAnswers = document.getElementById("poll__answers");

let xml = new XMLHttpRequest();
xml.open('GET', 'https://netology-slow-rest.herokuapp.com/poll.php');
xml.send();

xml.onreadystatechange = function() {
    if(xml.readyState === 4 && xml.status === 200) {
        let pollJSON = xml.responseText;
        let pollParce = JSON.parse(pollJSON);
        let pollData = pollParce.data;
        pollTitle.innerText = `${pollData.title}`;
        for (let i = 0; i < pollData.answers.length; i++) {
            pollAnswers.innerHTML += `<button class="poll__answer" data-id=${i}>
                                        ${pollData.answers[i]}
                                    </button>`
        }  
        pollAnswers.addEventListener('click', (event)=>{
            if (event.target.classList.contains("poll__answer")){
                let postReqest = new XMLHttpRequest();
                postReqest.open('POST', 'https://netology-slow-rest.herokuapp.com/poll.php');
                postReqest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                postReqest.send(`vote=${pollParce.id}&answer=${event.target.getAttribute("data-id")}`);
                postReqest.onreadystatechange = function () {
                    if (postReqest.readyState === 4 && postReqest.status === 200) {
                        pollAnswers.remove();
                        let thanks = document.createElement("div");
                        thanks.style = "background-color: rgba(0,0,0,0.5); position: fixed; top: 0; left: 0; right: 0; bottom: 0;";
                        thanks.innerHTML = `<div style="opacity: 1; width: 400px; height: 200px; border-radius: 10px; background-color: white; z-index: 99; position: absolute; top: calc(50px); left: calc(50% - 200px);"> 
                                                <div style="position: absolute; top: 30px; left: 30px; font-weight: 700;">Спасибо, Ваш вопрос засчитан!</div>
                                                <button class="button-ok" style="display:block; position: absolute; bottom: 20px; right: 20px; border:none; background: none; font-style: Arial; color: blue;">Спасибо</button>
                                            </div>`
                        document.body.append(thanks);
                        thanks.addEventListener('click', (event)=>{
                            if (event.target.classList.contains("button-ok")){
                                thanks.remove();
                                let summ = 0;
                                JSON.parse(postReqest.responseText).stat.forEach(function(element) {
                                    summ += element.votes;
                                });
                                console.log(summ);
                                JSON.parse(postReqest.responseText).stat.forEach(function(element) {
                                    document.body.innerHTML += `
                                                                    <div><span style="font-weight: 700">${element.answer}:</span> ${((element.votes/summ)*100).toFixed()}%</div>
                                                                `
                                                                console.log(element.votes);
                                });
                                
                            }
                        
                        })
                    }
                }
            }
        })
    }
}


