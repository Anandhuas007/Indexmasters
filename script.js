// ==========================================
// IndexMaster V3 - Calculator
// ==========================================


// ------------------------------------------
// ADD ARTICLE
// ------------------------------------------

function addArticle() {

    const tbody = document.getElementById("articleRows");

    const row = document.createElement("tr");

    const articleNumber = tbody.rows.length + 1;

    row.innerHTML = `
        <td>${articleNumber}</td>

        <td>
            <input
                type="number"
                class="data-input p0"
                placeholder="P₀"
                step="any"
            >
        </td>

        <td>
            <input
                type="number"
                class="data-input p1"
                placeholder="P₁"
                step="any"
            >
        </td>

        <td>
            <input
                type="number"
                class="data-input q0"
                placeholder="Q₀"
                step="any"
            >
        </td>

        <td>
            <input
                type="number"
                class="data-input q1"
                placeholder="Q₁"
                step="any"
            >
        </td>

        <td>
            <button
                class="delete-btn"
                onclick="removeArticle(this)"
            >
                ×
            </button>
        </td>
    `;

    tbody.appendChild(row);

    updateArticleNumbers();
}


// ------------------------------------------
// REMOVE ARTICLE
// ------------------------------------------

function removeArticle(button) {

    const tbody = document.getElementById("articleRows");

    // Don't allow the user to remove the final row
    if (tbody.rows.length <= 1) {

showAlert("You need at least one article.");

        return;
    }

    button.closest("tr").remove();

    updateArticleNumbers();
}


// ------------------------------------------
// UPDATE ARTICLE NUMBERS
// ------------------------------------------

function updateArticleNumbers() {

    const rows = document.querySelectorAll("#articleRows tr");

    rows.forEach((row, index) => {

        row.cells[0].textContent = index + 1;

    });
}


// ------------------------------------------
// GET USER DATA
// ------------------------------------------

function getArticleData() {

    const rows = document.querySelectorAll("#articleRows tr");

    const articles = [];

    let valid = true;

    rows.forEach((row, index) => {

        const p0 = parseFloat(
            row.querySelector(".p0").value
        );

        const p1 = parseFloat(
            row.querySelector(".p1").value
        );

        const q0 = parseFloat(
            row.querySelector(".q0").value
        );

        const q1 = parseFloat(
            row.querySelector(".q1").value
        );


        // Check for missing values
if (
    isNaN(p0) ||
    isNaN(p1) ||
    isNaN(q0) ||
    isNaN(q1)
) {

    showAlert(
    `Please complete all fields for Article ${index + 1}.`
);

    valid = false;

    return;
}


// Check for zero or negative values
if (
    p0 <= 0 ||
    p1 <= 0 ||
    q0 <= 0 ||
    q1 <= 0
) {

    showAlert(
    `Article ${index + 1}: prices and quantities must be greater than zero.`
);

    valid = false;

    return;
}


        articles.push({
            number: index + 1,
            p0: p0,
            p1: p1,
            q0: q0,
            q1: q1
        });

    });


   if (!valid) {
    return null;
}


    return articles;
}


// ------------------------------------------
// CALCULATE INDEX NUMBERS
// ------------------------------------------

function calculateIndex() {

    const articles = getArticleData();

    if (!articles) {
        return;
    }


    // --------------------------------------
    // VARIABLES FOR TOTALS
    // --------------------------------------

    let sumP0Q0 = 0;
    let sumP1Q0 = 0;

    let sumP0Q1 = 0;
    let sumP1Q1 = 0;

    let sumP1Q0Q1 = 0;
    let sumP0Q0Q1 = 0;


    // --------------------------------------
    // CALCULATION TABLE
    // --------------------------------------

    const calculationRows =
        document.getElementById("calculationRows");

    calculationRows.innerHTML = "";


    articles.forEach(article => {

        const p0q0 = article.p0 * article.q0;

        const p1q0 = article.p1 * article.q0;

        const p0q1 = article.p0 * article.q1;

        const p1q1 = article.p1 * article.q1;

        const p1q0q1 =
            article.p1 * (article.q0 + article.q1);

        const p0q0q1 =
            article.p0 * (article.q0 + article.q1);


        // Add to totals

        sumP0Q0 += p0q0;
        sumP1Q0 += p1q0;

        sumP0Q1 += p0q1;
        sumP1Q1 += p1q1;

        sumP1Q0Q1 += p1q0q1;
        sumP0Q0Q1 += p0q0q1;


        // Add row to calculation table

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${article.number}</td>

            <td>${formatNumber(p0q0)}</td>

            <td>${formatNumber(p1q0)}</td>

            <td>${formatNumber(p0q1)}</td>

            <td>${formatNumber(p1q1)}</td>

            <td>${formatNumber(p1q0q1)}</td>

            <td>${formatNumber(p0q0q1)}</td>
        `;

        calculationRows.appendChild(row);

    });


    // --------------------------------------
    // INDEX FORMULAS
    // --------------------------------------

    // Laspeyres
    //
    // L = ΣP₁Q₀ / ΣP₀Q₀ × 100

    const laspeyres =
        (sumP1Q0 / sumP0Q0) * 100;


    // Paasche
    //
    // P = ΣP₁Q₁ / ΣP₀Q₁ × 100

    const paasche =
        (sumP1Q1 / sumP0Q1) * 100;


    // Fisher
    //
    // F = √(L × P)

    const fisher =
        Math.sqrt(laspeyres * paasche);


    // Marshall-Edgeworth
    //
    // ME =
    // ΣP₁(Q₀+Q₁)
    // ---------------- × 100
    // ΣP₀(Q₀+Q₁)

    const marshall =
        (sumP1Q0Q1 / sumP0Q0Q1) * 100;


    // --------------------------------------
    // DISPLAY RESULTS
    // --------------------------------------

    document.getElementById("laspeyresResult")
        .textContent = formatNumber(laspeyres);

    document.getElementById("paascheResult")
        .textContent = formatNumber(paasche);

    document.getElementById("fisherResult")
        .textContent = formatNumber(fisher);

    document.getElementById("marshallResult")
        .textContent = formatNumber(marshall);


    // --------------------------------------
    // TOTALS ROW
    // --------------------------------------

    const totals =
        document.getElementById("calculationTotals");

    totals.innerHTML = `
        <tr>
            <th>Σ Total</th>
            <th>${formatNumber(sumP0Q0)}</th>
            <th>${formatNumber(sumP1Q0)}</th>
            <th>${formatNumber(sumP0Q1)}</th>
            <th>${formatNumber(sumP1Q1)}</th>
            <th>${formatNumber(sumP1Q0Q1)}</th>
            <th>${formatNumber(sumP0Q0Q1)}</th>
        </tr>
    `;


    // --------------------------------------
    // STEP-BY-STEP SOLUTION
    // --------------------------------------

    generateSolution(
        sumP0Q0,
        sumP1Q0,
        sumP0Q1,
        sumP1Q1,
        sumP1Q0Q1,
        sumP0Q0Q1,
        laspeyres,
        paasche,
        fisher,
        marshall
    );

// --------------------------------------
// UPDATE VISUAL COMPARISON
// --------------------------------------

updateComparison(
    laspeyres,
    paasche,
    fisher,
    marshall
);
    // --------------------------------------
    // SHOW RESULTS
    // --------------------------------------

    const resultsSection =
        document.getElementById("resultsSection");

    resultsSection.classList.remove("hidden");


    // Scroll smoothly to results

    resultsSection.scrollIntoView({
        behavior: "smooth"
    });

}


// ------------------------------------------
// STEP-BY-STEP SOLUTION
// ------------------------------------------

function generateSolution(
    sumP0Q0,
    sumP1Q0,
    sumP0Q1,
    sumP1Q1,
    sumP1Q0Q1,
    sumP0Q0Q1,
    laspeyres,
    paasche,
    fisher,
    marshall
) {

    const solution =
        document.getElementById("solutionContent");


    solution.innerHTML = `

        <div class="solution-step">

            <h3>1. Laspeyres Price Index</h3>

            <p class="formula">
                L =
                <span>ΣP₁Q₀</span>
                /
                <span>ΣP₀Q₀</span>
                × 100
            </p>

            <p>
                L =
                ${formatNumber(sumP1Q0)}
                /
                ${formatNumber(sumP0Q0)}
                × 100
            </p>

            <p class="solution-answer">
                L = <strong>${formatNumber(laspeyres)}</strong>
            </p>

        </div>


        <div class="solution-step">

            <h3>2. Paasche Price Index</h3>

            <p class="formula">
                P =
                <span>ΣP₁Q₁</span>
                /
                <span>ΣP₀Q₁</span>
                × 100
            </p>

            <p>
                P =
                ${formatNumber(sumP1Q1)}
                /
                ${formatNumber(sumP0Q1)}
                × 100
            </p>

            <p class="solution-answer">
                P = <strong>${formatNumber(paasche)}</strong>
            </p>

        </div>


        <div class="solution-step">

            <h3>3. Fisher's Ideal Index</h3>

            <p class="formula">
                F = √(L × P)
            </p>

            <p>
                F =
                √(
                ${formatNumber(laspeyres)}
                ×
                ${formatNumber(paasche)}
                )
            </p>

            <p class="solution-answer">
                F = <strong>${formatNumber(fisher)}</strong>
            </p>

        </div>


        <div class="solution-step">

            <h3>4. Marshall–Edgeworth Price Index</h3>

            <p class="formula">
                ME =
                ΣP₁(Q₀ + Q₁)
                /
                ΣP₀(Q₀ + Q₁)
                × 100
            </p>

            <p>
                ME =
                ${formatNumber(sumP1Q0Q1)}
                /
                ${formatNumber(sumP0Q0Q1)}
                × 100
            </p>

            <p class="solution-answer">
                ME = <strong>${formatNumber(marshall)}</strong>
            </p>

        </div>

    `;
}


// ------------------------------------------
// FORMAT NUMBERS
// ------------------------------------------

function formatNumber(number) {

    return Number(number).toFixed(2);

}


// ------------------------------------------
// RESET CALCULATOR
// ------------------------------------------

function resetCalculator() {

    const tbody =
        document.getElementById("articleRows");

    tbody.innerHTML = `

        <tr>

            <td>1</td>

            <td>
                <input
                    type="number"
                    class="data-input p0"
                    placeholder="P₀"
                    step="any"
                >
            </td>

            <td>
                <input
                    type="number"
                    class="data-input p1"
                    placeholder="P₁"
                    step="any"
                >
            </td>

            <td>
                <input
                    type="number"
                    class="data-input q0"
                    placeholder="Q₀"
                    step="any"
                >
            </td>

            <td>
                <input
                    type="number"
                    class="data-input q1"
                    placeholder="Q₁"
                    step="any"
                >
            </td>

            <td>
                <button
                    class="delete-btn"
                    onclick="removeArticle(this)"
                >
                    ×
                </button>
            </td>

        </tr>

    `;


    document.getElementById("resultsSection")
        .classList.add("hidden");

}


// ------------------------------------------
// COPY RESULTS
// ------------------------------------------

function copyResults() {

    const laspeyres =
        document.getElementById("laspeyresResult").textContent;

    const paasche =
        document.getElementById("paascheResult").textContent;

    const fisher =
        document.getElementById("fisherResult").textContent;

    const marshall =
        document.getElementById("marshallResult").textContent;


    const text = `
IndexMaster - Index Number Results

Laspeyres: ${laspeyres}
Paasche: ${paasche}
Fisher: ${fisher}
Marshall–Edgeworth: ${marshall}
    `.trim();


    navigator.clipboard.writeText(text)
        .then(() => {

           showAlert("Results copied!", "Success!");

        })
        .catch(() => {

           showAlert("Unable to copy results.", "Copy failed");
        });

}
// ==========================================
// VISUAL COMPARISON
// ==========================================

function updateComparison(
    laspeyres,
    paasche,
    fisher,
    marshall
) {

    const values = [
        laspeyres,
        paasche,
        fisher,
        marshall
    ];

    const maximum = Math.max(...values);


    // Display numbers

    document.getElementById("chartLaspeyres")
        .textContent = formatNumber(laspeyres);

    document.getElementById("chartPaasche")
        .textContent = formatNumber(paasche);

    document.getElementById("chartFisher")
        .textContent = formatNumber(fisher);

    document.getElementById("chartMarshall")
        .textContent = formatNumber(marshall);


    // Calculate bar widths

    document.getElementById("barLaspeyres")
        .style.width =
        `${(laspeyres / maximum) * 100}%`;

    document.getElementById("barPaasche")
        .style.width =
        `${(paasche / maximum) * 100}%`;

    document.getElementById("barFisher")
        .style.width =
        `${(fisher / maximum) * 100}%`;

    document.getElementById("barMarshall")
        .style.width =
        `${(marshall / maximum) * 100}%`;
}
// ==========================================
// CUSTOM ALERT POPUP
// ==========================================

function showAlert(message, title = "Check your input") {

    document.getElementById("alertTitle")
        .textContent = title;

    document.getElementById("alertMessage")
        .textContent = message;

    document.getElementById("alertOverlay")
        .classList.add("show");
}


function closeAlert() {

    document.getElementById("alertOverlay")
        .classList.remove("show");

}
// ==========================================
// SAVE CALCULATION
// ==========================================

function saveCalculation() {

    const articles = getArticleData();

    if (!articles) {
        return;
    }

    const calculation = {
        date: new Date().toLocaleString(),

        articles: articles,

        results: {
            laspeyres: document.getElementById("laspeyresResult").textContent,
            paasche: document.getElementById("paascheResult").textContent,
            fisher: document.getElementById("fisherResult").textContent,
            marshall: document.getElementById("marshallResult").textContent
        }
    };

    let savedCalculations =
        JSON.parse(localStorage.getItem("indexMasterCalculations")) || [];

    savedCalculations.push(calculation);

  localStorage.setItem(
    "indexMasterCalculations",
    JSON.stringify(savedCalculations)
);

loadSavedCalculations();

showAlert(
    "Your calculation has been saved successfully.",
    "Saved!"
);
}
// ==========================================
// LOAD SAVED CALCULATIONS
// ==========================================

function loadSavedCalculations() {

    const container =
        document.getElementById("savedCalculationsList");

    if (!container) {
        return;
    }

    const savedCalculations =
        JSON.parse(
            localStorage.getItem("indexMasterCalculations")
        ) || [];

    // Nothing saved yet
    if (savedCalculations.length === 0) {

        container.innerHTML = `
            <div class="empty-saved">
                <p>📂 No saved calculations yet.</p>
                <small>
                    Calculate an index number and save it to see it here.
                </small>
            </div>
        `;

        return;
    }

    container.innerHTML = "";

    savedCalculations.forEach((calculation, index) => {

        const card = document.createElement("div");

        card.className = "saved-card";

        card.innerHTML = `
            <div class="saved-card-info">

                <h3>Calculation ${index + 1}</h3>

                <p class="saved-date">
                    ${calculation.date}
                </p>

                <div class="saved-results">

                    <span>
                        Laspeyres:
                        <strong>${calculation.results.laspeyres}</strong>
                    </span>

                    <span>
                        Paasche:
                        <strong>${calculation.results.paasche}</strong>
                    </span>

                    <span>
                        Fisher:
                        <strong>${calculation.results.fisher}</strong>
                    </span>

                    <span>
                        Marshall–Edgeworth:
                        <strong>${calculation.results.marshall}</strong>
                    </span>

                </div>

            </div>

            <button
                class="delete-saved-btn"
                onclick="deleteSavedCalculation(${index})"
            >
                🗑 Delete
            </button>
        `;

        container.appendChild(card);

    });
}
// ==========================================
// LOAD SAVED CALCULATIONS WHEN PAGE OPENS
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    loadSavedCalculations();
});
// ==========================================
// DELETE SAVED CALCULATION
// ==========================================

function deleteSavedCalculation(index) {

    let savedCalculations =
        JSON.parse(
            localStorage.getItem("indexMasterCalculations")
        ) || [];

    savedCalculations.splice(index, 1);

    localStorage.setItem(
        "indexMasterCalculations",
        JSON.stringify(savedCalculations)
    );

    loadSavedCalculations();
}
/* ==========================================
   PRACTICE SYSTEM
   ========================================== */

const practicePage = document.getElementById("startPracticeBtn");

if (practicePage) {

    let currentQuestion = null;

let questionsAttempted = 0;
let correctAnswers = 0;

let currentQuestionNumber = 0;
const totalQuestions = 10;

    /* ------------------------------------------
       RANDOM NUMBER
       ------------------------------------------ */

    function randomNumber(min, max, decimals = 0) {

        const number =
            Math.random() * (max - min) + min;

        return Number(number.toFixed(decimals));

    }


    /* ------------------------------------------
       GENERATE QUESTION
       ------------------------------------------ */

    function generateQuestion() {
currentQuestionNumber++;

if (currentQuestionNumber > totalQuestions) {
    showFinalScore();
    return;
}
        const difficulty =
            document.getElementById("difficulty").value;

        const selectedMethod =
            document.getElementById("practiceMethod").value;


        let method = selectedMethod;


        /* Random method */

        if (method === "random") {

            const methods = [
                "laspeyres",
                "paasche",
                "fisher",
                "marshall"
            ];

            method =
                methods[Math.floor(Math.random() * methods.length)];

        }


        /* Number of articles */

        let articleCount = 3;

        if (difficulty === "medium") {
            articleCount = 4;
        }

        if (difficulty === "hard") {
            articleCount = 5;
        }


       /* Generate articles */

const articles = [];

for (let i = 0; i < articleCount; i++) {

    let p0;
    let p1;
    let q0;
    let q1;


    /* EASY */

    if (difficulty === "easy") {

        p0 = randomNumber(5, 15, 0);
        p1 = randomNumber(5, 15, 0);

        q0 = randomNumber(2, 10, 0);
        q1 = randomNumber(2, 10, 0);

    }


    /* MEDIUM */

    else if (difficulty === "medium") {

        p0 = randomNumber(5, 30, 2);
        p1 = randomNumber(5, 30, 2);

        q0 = randomNumber(5, 25, 0);
        q1 = randomNumber(5, 25, 0);

    }


    /* HARD */

    else {

        p0 = randomNumber(10, 100, 2);
        p1 = randomNumber(10, 100, 2);

        q0 = randomNumber(10, 75, 0);
        q1 = randomNumber(10, 75, 0);

    }


    articles.push({
        p0,
        p1,
        q0,
        q1
    });

}


        /* Calculate answer */

        let answer = 0;


        let sumP1Q0 = 0;
        let sumP0Q0 = 0;

        let sumP1Q1 = 0;
        let sumP0Q1 = 0;

        let sumP1QQ = 0;
        let sumP0QQ = 0;


        articles.forEach(article => {

            sumP1Q0 +=
                article.p1 * article.q0;

            sumP0Q0 +=
                article.p0 * article.q0;

            sumP1Q1 +=
                article.p1 * article.q1;

            sumP0Q1 +=
                article.p0 * article.q1;

            sumP1QQ +=
                article.p1 * (article.q0 + article.q1);

            sumP0QQ +=
                article.p0 * (article.q0 + article.q1);

        });


        if (method === "laspeyres") {

            answer =
                (sumP1Q0 / sumP0Q0) * 100;

        }


        if (method === "paasche") {

            answer =
                (sumP1Q1 / sumP0Q1) * 100;

        }


        if (method === "fisher") {

            const laspeyres =
                sumP1Q0 / sumP0Q0;

            const paasche =
                sumP1Q1 / sumP0Q1;

            answer =
                Math.sqrt(
                    laspeyres * paasche
                ) * 100;

        }


        if (method === "marshall") {

            answer =
                (sumP1QQ / sumP0QQ) * 100;

        }


        currentQuestion = {
            articles,
            method,
            answer,
            sumP1Q0,
            sumP0Q0,
            sumP1Q1,
            sumP0Q1,
            sumP1QQ,
            sumP0QQ
        };


        displayQuestion();

    }


    /* ------------------------------------------
       DISPLAY QUESTION
       ------------------------------------------ */

    function displayQuestion() {

        const questionSection =
            document.getElementById("questionSection");

        const tableBody =
            document.getElementById("questionTableBody");

        const questionTitle =
            document.getElementById("questionTitle");

        const questionText =
            document.getElementById("questionText");


        const methodNames = {

            laspeyres: "Laspeyres Price Index",

            paasche: "Paasche Price Index",

            fisher: "Fisher's Ideal Price Index",

            marshall: "Marshall–Edgeworth Price Index"

        };
document.getElementById("questionNumber").textContent =
    currentQuestionNumber;

document.getElementById("practiceProgressBar").style.width =
    `${(currentQuestionNumber / totalQuestions) * 100}%`;

        questionTitle.textContent =
            methodNames[currentQuestion.method];


        questionText.textContent =
            `Calculate the ${methodNames[currentQuestion.method]} using the data below. Give your answer to 2 decimal places.`;


        tableBody.innerHTML = "";


        currentQuestion.articles.forEach(
            (article, index) => {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        Article ${index + 1}
                    </td>

                    <td>
                        ${article.p0}
                    </td>

                    <td>
                        ${article.p1}
                    </td>

                    <td>
                        ${article.q0}
                    </td>

                    <td>
                        ${article.q1}
                    </td>

                `;


                tableBody.appendChild(row);

            }
        );


        questionSection.style.display = "block";


        document.getElementById("answerInput").value = "";

        document.getElementById("answerResult").style.display = "none";

        document.getElementById("solutionArea").style.display = "none";


        questionSection.scrollIntoView({
            behavior: "smooth"
        });

    }


    /* ------------------------------------------
       CHECK ANSWER
       ------------------------------------------ */

    function checkAnswer() {

        const input =
            document.getElementById("answerInput");

        const userAnswer =
            Number(input.value);


        if (!input.value) {

            alert("Please enter an answer.");

            return;

        }


        questionsAttempted++;


        const difference =
            Math.abs(
                userAnswer -
                currentQuestion.answer
            );


        const isCorrect =
            difference <= 0.05;


        const resultBox =
            document.getElementById("answerResult");

        const resultTitle =
            document.getElementById("resultTitle");

        const resultMessage =
            document.getElementById("resultMessage");


        if (isCorrect) {

            correctAnswers++;

            resultTitle.textContent =
                "Correct! 🎉";

            resultMessage.textContent =
                `Your answer of ${userAnswer.toFixed(2)} is correct.`;

        }


        else {

            resultTitle.textContent =
                "Not quite.";

            resultMessage.textContent =
                `Your answer was ${userAnswer.toFixed(2)}. The correct answer is ${currentQuestion.answer.toFixed(2)}.`;

        }


        resultBox.style.display = "block";


        updateProgress();

    }


    /* ------------------------------------------
       SHOW SOLUTION
       ------------------------------------------ */

    function showSolution() {

        if (!currentQuestion) return;


        const solutionArea =
            document.getElementById("solutionArea");

        const solutionContent =
            document.getElementById("solutionContent");


        const q =
            currentQuestion;


        let html = "";


        if (q.method === "laspeyres") {

            html = `

                <p>
                    First calculate ΣP₁Q₀ and ΣP₀Q₀.
                </p>

                <div class="solution-formula">
                    ΣP₁Q₀ = ${q.sumP1Q0.toFixed(2)}
                </div>

                <div class="solution-formula">
                    ΣP₀Q₀ = ${q.sumP0Q0.toFixed(2)}
                </div>

                <p>
                    Apply the Laspeyres formula:
                </p>

                <div class="solution-formula">
                    L = (${q.sumP1Q0.toFixed(2)} /
                    ${q.sumP0Q0.toFixed(2)}) × 100
                    = ${q.answer.toFixed(2)}
                </div>

            `;

        }


        else if (q.method === "paasche") {

            html = `

                <p>
                    First calculate ΣP₁Q₁ and ΣP₀Q₁.
                </p>

                <div class="solution-formula">
                    ΣP₁Q₁ = ${q.sumP1Q1.toFixed(2)}
                </div>

                <div class="solution-formula">
                    ΣP₀Q₁ = ${q.sumP0Q1.toFixed(2)}
                </div>

                <p>
                    Apply the Paasche formula:
                </p>

                <div class="solution-formula">
                    P = (${q.sumP1Q1.toFixed(2)} /
                    ${q.sumP0Q1.toFixed(2)}) × 100
                    = ${q.answer.toFixed(2)}
                </div>

            `;

        }


        else if (q.method === "fisher") {

            const L =
                (q.sumP1Q0 / q.sumP0Q0) * 100;

            const P =
                (q.sumP1Q1 / q.sumP0Q1) * 100;


            html = `

                <p>
                    First calculate the Laspeyres and
                    Paasche indices.
                </p>

                <div class="solution-formula">
                    L = ${L.toFixed(2)}
                </div>

                <div class="solution-formula">
                    P = ${P.toFixed(2)}
                </div>

                <p>
                    Then apply Fisher's formula:
                </p>

                <div class="solution-formula">
                    F = √(L × P)
                    = √(${L.toFixed(2)} × ${P.toFixed(2)})
                    = ${q.answer.toFixed(2)}
                </div>

            `;

        }


        else {

            html = `

                <p>
                    First calculate ΣP₁(Q₀ + Q₁)
                    and ΣP₀(Q₀ + Q₁).
                </p>

                <div class="solution-formula">
                    ΣP₁(Q₀ + Q₁) =
                    ${q.sumP1QQ.toFixed(2)}
                </div>

                <div class="solution-formula">
                    ΣP₀(Q₀ + Q₁) =
                    ${q.sumP0QQ.toFixed(2)}
                </div>

                <p>
                    Apply the Marshall–Edgeworth formula:
                </p>

                <div class="solution-formula">
                    ME =
                    (${q.sumP1QQ.toFixed(2)} /
                    ${q.sumP0QQ.toFixed(2)})
                    × 100
                    = ${q.answer.toFixed(2)}
                </div>

            `;

        }


        solutionContent.innerHTML = html;

        solutionArea.style.display = "block";

    }


    /* ------------------------------------------
       PROGRESS
       ------------------------------------------ */

    function updateProgress() {

        document.getElementById(
            "questionsAttempted"
        ).textContent =
            questionsAttempted;


        document.getElementById(
            "correctAnswers"
        ).textContent =
            correctAnswers;


        const accuracy =
            questionsAttempted === 0
                ? 0
                : (correctAnswers / questionsAttempted) * 100;


        document.getElementById(
            "accuracy"
        ).textContent =
            `${accuracy.toFixed(0)}%`;

    }


    /* ------------------------------------------
       BUTTON EVENTS
       ------------------------------------------ */

    document.getElementById(
        "startPracticeBtn"
    ).addEventListener(
        "click",
        generateQuestion
    );


    document.getElementById(
        "checkAnswerBtn"
    ).addEventListener(
        "click",
        checkAnswer
    );


    document.getElementById(
        "showSolutionBtn"
    ).addEventListener(
        "click",
        showSolution
    );


    document.getElementById(
        "nextQuestionBtn"
    ).addEventListener(
        "click",
        generateQuestion
    );
function showFinalScore() {

    document.getElementById("questionSection").style.display = "none";

    document.getElementById("finalScoreSection").style.display = "block";

    document.getElementById("progressSection").style.display = "none";

    document.getElementById("finalScore").textContent =
        `${correctAnswers} / ${totalQuestions}`;

    const finalAccuracy =
        (correctAnswers / totalQuestions) * 100;

    document.getElementById("finalAccuracy").textContent =
        `${finalAccuracy.toFixed(0)}% Accuracy`;

    if (finalAccuracy === 100) {

        document.getElementById("finalMessage").textContent =
            "Perfect score! 🔥 You got every question correct.";

    }

    else if (finalAccuracy >= 70) {

        document.getElementById("finalMessage").textContent =
            "Great work! Keep practicing to improve even further.";

    }

    else {

        document.getElementById("finalMessage").textContent =
            "Keep practicing. Review the formulas in the Learn section and try again.";

    }

}
}
