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

        alert("You need at least one article.");

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

        alert(
            "Please enter P₀, P₁, Q₀ and Q₁ for every article."
        );

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

            alert("Results copied!");

        })
        .catch(() => {

            alert("Unable to copy results.");

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
