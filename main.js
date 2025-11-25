// Select Elements 
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");


// Set Options 
let CurrentIndex = 0;
let rightAnswers = 0;
let countdownInterval = 0;

function getQusetions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionObject = JSON.parse(this.responseText);
            let qCount = questionObject.length;
            
            // Create Bullets + Set Questions Count 
            createBullets(qCount);

            // Add Question Data
            addQuestionData(questionObject[CurrentIndex], qCount);

            // Start CounDown 
            countdown(20, qCount);

            // Click On Submit 
            submitButton.onclick = () => {

                // Get Right Answer 
                let theRightAnswer = questionObject[CurrentIndex].right_answer;
                
                // Increase Index 
                CurrentIndex++;

                // Check The Answer
                checkAnswer(theRightAnswer, qCount);

                // Remove Previous Question
                quizArea.innerHTML = '';
                answersArea.innerHTML = '';

                // Add Question Data
                addQuestionData(questionObject[CurrentIndex], qCount);
                
                // Handel Bullets Class
                handelBullets();

                // Start CounDown 
                clearInterval(countdownInterval);
                countdown(20, qCount);
                
                // Show Results 
                showResults(qCount);
            };
        } 
    };

    myRequest.open("Get", "html_questions.json", true);
    myRequest.send();
}

getQusetions();

function createBullets(num) {
    countSpan.innerHTML = num;

    // Create Spans 
    for (let i = 0; i < num; i++) {
        // Create Bullets
        let theBullet = document.createElement("span");

        // Check If It The First Span
        if (i === 0) {
            theBullet.className = "on";
        }

        // Append Bullets To Main Bullet Container 
        bulletsSpanContainer.appendChild(theBullet);
    }
}

function addQuestionData(obj, count) {
    if (CurrentIndex < count) {
        // Create H2 Question Title 
    let questionTilte = document.createElement("h2");

    // Create Question Text 
    let questionText = document.createTextNode(obj.title);

    // Append Text To H2 
    questionTilte.appendChild(questionText);

    // Append The H2 To The Quiz Area 
    quizArea.appendChild(questionTilte);

    // Create The Answers 
    for (let i = 1; i <= 4; i++) {
        // Create Main Answer Div 
        let mainDiv = document.createElement("div");

        // Add Class To Main Div 
        mainDiv.className = "answer";

        // Create Radio Input 
        let radioInput = document.createElement("input");

        // Add Type + Name + Id + Data-Attribute 
        radioInput.name = "question";
        radioInput.type = "radio";
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer = obj[`answer_${i}`];

        // Make First Option Selected 
        if (i === 1) {
            radioInput.checked = true;
        }

        // Create Label 
        let theLabel = document.createElement("label");

        // Add For Attribute 
        theLabel.htmlFor = `answer_${i}`;

        // Create Label Text 
        let theLabelText = document.createTextNode(obj[`answer_${i}`]);

        // Add The Text To Label 
        theLabel.appendChild(theLabelText);

        // Add Input + Label To Main Div 
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);

        // Append All Divs To Answers Area 
        answersArea.appendChild(mainDiv);
    }
    }
} 

function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++) {

        if (answers[i].checked) {
            
            theChoosenAnswer = answers[i].dataset.answer;

        }

    }
    
    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
    }
}

function handelBullets() {
    
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {

        if (CurrentIndex === index) {
            span.className = "on";
        }

    });
}

function showResults(count) {
    let theResults;
    if (CurrentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        submitButton.remove();
        bullets.remove();

        if (rightAnswers > (count / 2) && rightAnswers < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}.`;
        } else if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfect</span>, All Answers Are Good.`;
        } else {
            theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}.`;
        }

        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = "10px";
        resultsContainer.style.backgroundColor = "white";
        resultsContainer.style.marginTop = "10px";
    }
}

function countdown(duration, count) {
    if (CurrentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function () {
            
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownElement.innerHTML = `${minutes} : ${seconds}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
                
            }

        }, 1000);
    }
}