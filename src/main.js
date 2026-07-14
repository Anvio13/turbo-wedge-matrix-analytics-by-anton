import { dates, funnels } from "./funnels.js";

const avg=a=>a.reduce((s,v)=>s+v,0)/a.length;
const header=(mean=false)=>`<thead><tr><th>Событие</th>${dates.map(d=>`<th>${d}</th>`).join("")}${mean?"<th>Среднее</th>":""}</tr></thead>`;
const heat=(v,max)=>{const x=Math.sqrt(Math.max(0,Math.min(1,v/max)));return `hsl(${x*120} 76% ${87-x*11}%)`;};

function render(id){
  const {title,steps:S,values:V}=funnels[id];
  const L=V.slice(0,-1).map((r,i)=>r.map((v,c)=>v===0?null:(v-V[i+1][c])/v*100));
  const all=L.flat().filter(v=>v!==null),lo=Math.min(...all),hi=Math.max(...all);
  const leadRows=[funnels.test.values.at(-1),funnels.universities.values.at(-1),funnels.preparation.values.at(-1)];
  const exportedLeads=[0,5,8,9,1,1,0,2,1,1,5];
  const mixedLeads=dates.map((_,c)=>exportedLeads[c]-leadRows.reduce((sum,row)=>sum+row[c],0));
  const leadFoot=mean=>`<tfoot class="lead-summary"><tr><th>Всего лидов в день</th>${exportedLeads.map(v=>`<td>${v}</td>`).join("")}${mean?"<td>—</td>":""}</tr><tr><th>Тесты / универы / подготовка / смешанная</th>${dates.map((_,c)=>`<td title="Смешанная = отдельная выгрузка лидов минус три явных пути">${leadRows.map(row=>row[c]).join(" / ")} / <span class="${mixedLeads[c]<0?"mixed-negative":""}">${mixedLeads[c]}</span></td>`).join("")}${mean?"<td>—</td>":""}</tr></tfoot>`;
  const cell=(v,ref,c)=>c===0||v===ref?"":v>ref?" above-average":" below-average";
  const basic=color=>`<table>${header()}<tbody>${S.map((s,r)=>`<tr><th>${s}</th>${V[r].map((v,c)=>`<td${color?` style="background:${heat(v,V[0][c])}" title="${(v/V[0][c]*100).toFixed(1)}% от максимума дня"`:""}>${v}</td>`).join("")}</tr>`).join("")}</tbody>${leadFoot()}</table>`;
  const delta=()=>{let rows=[];S.forEach((s,r)=>{rows.push(`<tr class="event-row"><th>${s}</th>${V[r].map(v=>`<td>${v}</td>`).join("")}</tr>`);if(r<S.length-1)rows.push(`<tr class="delta-row"><th>Потеря к следующему шагу</th>${V[r].map((v,c)=>`<td>${V[r+1][c]-v}</td>`).join("")}</tr>`)});return `<table>${header()}<tbody>${rows.join("")}</tbody>${leadFoot()}</table>`};
  const percent=compare=>{let rows=[];S.forEach((s,r)=>{const am=avg(V[r].slice(1));rows.push(`<tr class="event-row"><th>${s}</th>${V[r].map((v,c)=>`<td class="${compare?cell(v,am,c):""}">${v}</td>`).join("")}<td class="average-cell">${am.toFixed(1)}</td></tr>`);if(r<S.length-1){const la=avg(L[r].slice(1).filter(v=>v!==null)),cs=V[r].map((v,c)=>{if(v===0)return"<td>—</td>";const z=L[r][c],h=120*(1-(z-lo)/(hi-lo));return `<td class="${compare?cell(z,la,c):""}" style="background:hsl(${h} 76% 85%)">${z.toFixed(1)}%</td>`});const h=120*(1-(la-lo)/(hi-lo));cs.push(`<td class="average-cell" style="background:hsl(${h} 76% 85%)">${la.toFixed(1)}%</td>`);rows.push(`<tr class="delta-row"><th>Потеря к следующему шагу, %</th>${cs.join("")}</tr>`)}});let foot=leadFoot(true);if(compare)foot=`<tfoot><tr class="comparison-summary"><th>Синие / красные ячейки</th>${dates.map((_,c)=>{if(c===0)return"<td>—</td>";let b=0,r=0;S.forEach((_,i)=>{const a=avg(V[i].slice(1));if(V[i][c]>a)b++;if(V[i][c]<a)r++;if(i<S.length-1&&L[i][c]!==null){const q=avg(L[i].slice(1).filter(v=>v!==null));if(L[i][c]>q)b++;if(L[i][c]<q)r++}});return `<td><span class="blue-count">${b}</span> / <span class="red-count">${r}</span></td>`}).join("")}<td>—</td></tr></tfoot>`+leadFoot(true);return `<table class="${compare?"comparison-table":"percent-table"}">${header(true)}<tbody>${rows.join("")}</tbody>${foot}</table>`};
  document.querySelector("#funnel-title").textContent=`${title}: воронка 3–13 июля`;
  document.querySelector("#base-matrix").innerHTML=basic();
  document.querySelector("#heat-matrix").innerHTML=basic(true);
  document.querySelector("#delta-matrix").innerHTML=delta();
  document.querySelector("#percent-matrix").innerHTML=percent();
  document.querySelector("#comparison-matrix").innerHTML=percent(true);
  document.querySelectorAll("[data-funnel]").forEach(b=>b.classList.toggle("active",b.dataset.funnel===id));
}
document.querySelectorAll("[data-funnel]").forEach(b=>b.addEventListener("click",()=>render(b.dataset.funnel)));
render("test");
