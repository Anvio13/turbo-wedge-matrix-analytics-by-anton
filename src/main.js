import "./styles.css";

const dates = ["3 июл", "4 июл", "5 июл", "6 июл", "7 июл", "8 июл", "9 июл", "10 июл", "11 июл", "12 июл", "13 июл"];
const steps = [
  "01 Test intent selected", "02 Subjects selected", "03 Test subject selected", "04 Phone gate viewed",
  "05 Phone verified", "06 Test intro reached", "07 Test started", "08 Test completed", "09 Test result viewed",
  "10 Preparation answers saved", "11 Post-test offer viewed", "12 Post-test offer clicked",
  "13 Trial value page viewed", "14 Free trial booking clicked", "15 Trial booking screen viewed",
  "16 Trial slot selected", "17 Trial booking submit clicked", "18 Trial booking confirmed"
];
const values = [
  [35,155,206,264,190,167,183,186,128,138,141], [32,143,193,241,174,155,169,170,116,124,129],
  [32,143,192,239,173,158,174,173,118,126,130], [32,139,192,238,173,154,166,151,108,115,125],
  [23,111,157,182,128,110,113,120,90,84,99], [23,112,155,182,129,114,122,135,101,91,104],
  [23,111,155,177,129,111,120,133,99,92,102], [18,97,130,148,115,91,99,117,82,76,88],
  [17,96,128,148,114,89,95,113,80,75,84], [14,80,94,96,65,57,58,69,44,40,53],
  [13,75,84,89,60,56,58,65,44,40,52], [3,20,13,21,10,14,9,5,7,5,13],
  [2,10,9,13,8,11,8,5,5,4,11], [2,10,4,9,5,6,1,2,3,1,6],
  [2,10,4,9,5,6,1,2,3,1,6], [1,4,2,4,2,4,0,0,2,1,5],
  [0,2,2,2,0,1,0,0,0,0,1], [0,2,2,2,0,1,0,0,0,0,1]
];

const head = () => `<thead><tr><th scope="col">Событие</th>${dates.map(d => `<th scope="col">${d}</th>`).join("")}</tr></thead>`;
const color = (value, max) => {
  const hue = Math.max(0, Math.min(120, (value / max) * 120));
  return `hsl(${hue} 68% 87%)`;
};
function standardMatrix(colored = false) {
  return `<table>${head()}<tbody>${steps.map((step, row) => `<tr><th scope="row">${step}</th>${values[row].map((value, column) => {
    const max = values[0][column];
    const style = colored ? ` style="background:${color(value, max)}"` : "";
    return `<td${style}>${value}</td>`;
  }).join("")}</tr>`).join("")}</tbody></table>`;
}
function deltaMatrix() {
  const rows = [];
  steps.forEach((step, row) => {
    rows.push(`<tr class="event-row"><th scope="row">${step}</th>${values[row].map(v => `<td>${v}</td>`).join("")}</tr>`);
    if (row < steps.length - 1) {
      rows.push(`<tr class="delta-row"><th scope="row">Потеря к следующему шагу</th>${values[row].map((v, col) => `<td>${values[row + 1][col] - v}</td>`).join("")}</tr>`);
    }
  });
  return `<table>${head()}<tbody>${rows.join("")}</tbody></table>`;
}
document.querySelector("#base-matrix").innerHTML = standardMatrix();
document.querySelector("#heat-matrix").innerHTML = standardMatrix(true);
document.querySelector("#delta-matrix").innerHTML = deltaMatrix();
