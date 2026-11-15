const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const state = { champions: [], version: "—", enemy: ["","","","",""] };
const knownProfiles = {
  "Nasus": {tags:["Fighter","Tank"],damage:"physical",mobility:"low",cc:"low",healing:"medium",range:"melee"},
  "Darius": {tags:["Fighter","Tank"],damage:"physical",mobility:"low",cc:"medium",healing:"medium",range:"melee"},
  "Lee Sin": {tags:["Fighter","Assassin"],damage:"physical",mobility:"high",cc:"low",healing:"low",range:"melee"},
  "Zed": {tags:["Assassin"],damage:"physical",mobility:"high",cc:"low",healing:"low",range:"melee"},
  "Yasuo": {tags:["Fighter","Assassin"],damage:"physical",mobility:"high",cc:"medium",healing:"low",range:"melee"},
  "Yone": {tags:["Fighter","Assassin"],damage:"mixed",mobility:"high",cc:"medium",healing:"low",range:"melee"},
  "Ahri": {tags:["Mage","Assassin"],damage:"magic",mobility:"high",cc:"medium",healing:"low",range:"ranged"},
  "Syndra": {tags:["Mage"],damage:"magic",mobility:"low",cc:"medium",healing:"low",range:"ranged"},
  "Lux": {tags:["Mage","Support"],damage:"magic",mobility:"low",cc:"high",healing:"low",range:"ranged"},
  "Brand": {tags:["Mage","Support"],damage:"magic",mobility:"low",cc:"low",healing:"low",range:"ranged"},
  "Veigar": {tags:["Mage"],damage:"magic",mobility:"low",cc:"high",healing:"low",range:"ranged"},
  "Annie": {tags:["Mage"],damage:"magic",mobility:"low",cc:"high",healing:"low",range:"ranged"},
  "Morgana": {tags:["Mage","Support"],damage:"magic",mobility:"low",cc:"high",healing:"low",range:"ranged"},
  "Vayne": {tags:["Marksman","Assassin"],damage:"physical",mobility:"medium",cc:"low",healing:"low",range:"ranged"},
  "Jinx": {tags:["Marksman"],damage:"physical",mobility:"low",cc:"low",healing:"low",range:"ranged"},
  "Caitlyn": {tags:["Marksman"],damage:"physical",mobility:"medium",cc:"low",healing:"low",range:"ranged"},
  "Ashe": {tags:["Marksman","Support"],damage:"physical",mobility:"low",cc:"high",healing:"low",range:"ranged"},
  "Varus": {tags:["Marksman","Mage"],damage:"mixed",mobility:"low",cc:"medium",healing:"low",range:"ranged"},
  "Miss Fortune": {tags:["Marksman"],damage:"physical",mobility:"low",cc:"low",healing:"low",range:"ranged"},
  "Leona": {tags:["Tank","Support"],damage:"magic",mobility:"medium",cc:"high",healing:"low",range:"melee"},
  "Nautilus": {tags:["Tank","Support"],damage:"magic",mobility:"low",cc:"high",healing:"low",range:"melee"},
  "Thresh": {tags:["Support","Tank"],damage:"mixed",mobility:"medium",cc:"high",healing:"low",range:"ranged"},
  "Blitzcrank": {tags:["Tank","Support"],damage:"magic",mobility:"medium",cc:"high",healing:"low",range:"melee"},
  "Rell": {tags:["Tank","Support"],damage:"magic",mobility:"medium",cc:"high",healing:"low",range:"melee"},
  "Maokai": {tags:["Tank","Mage"],damage:"magic",mobility:"low",cc:"high",healing:"low",range:"melee"},
  "Ornn": {tags:["Tank"],damage:"mixed",mobility:"low",cc:"high",healing:"low",range:"melee"},
  "Malphite": {tags:["Tank","Mage"],damage:"magic",mobility:"medium",cc:"high",healing:"low",range:"melee"},
  "Garen": {tags:["Fighter","Tank"],damage:"physical",mobility:"low",cc:"low",healing:"medium",range:"melee"},
  "Sett": {tags:["Fighter","Tank"],damage:"physical",mobility:"low",cc:"medium",healing:"medium",range:"melee"},
  "Aatrox": {tags:["Fighter"],damage:"physical",mobility:"medium",cc:"medium",healing:"high",range:"melee"},
  "Warwick": {tags:["Fighter","Tank"],damage:"mixed",mobility:"medium",cc:"medium",healing:"high",range:"melee"},
  "Vladimir": {tags:["Mage"],damage:"magic",mobility:"low",cc:"low",healing:"high",range:"ranged"},
  "Soraka": {tags:["Support","Mage"],damage:"magic",mobility:"low",cc:"low",healing:"high",range:"ranged"},
  "Yuumi": {tags:["Support","Mage"],damage:"magic",mobility:"low",cc:"low",healing:"high",range:"ranged"},
  "Sylas": {tags:["Mage","Assassin"],damage:"magic",mobility:"medium",cc:"medium",healing:"high",range:"melee"},
  "Katarina": {tags:["Assassin","Mage"],damage:"magic",mobility:"high",cc:"low",healing:"low",range:"melee"},
  "Akali": {tags:["Assassin"],damage:"magic",mobility:"high",cc:"low",healing:"low",range:"melee"},
  "Evelynn": {tags:["Assassin","Mage"],damage:"magic",mobility:"medium",cc:"low",healing:"low",range:"melee"},
  "Kindred": {tags:["Marksman"],damage:"physical",mobility:"medium",cc:"low",healing:"low",range:"ranged"},
  "Graves": {tags:["Marksman"],damage:"physical",mobility:"medium",cc:"low",healing:"low",range:"ranged"},
  "Karthus": {tags:["Mage"],damage:"magic",mobility:"low",cc:"low",healing:"low",range:"ranged"},
  "Rammus": {tags:["Tank"],damage:"magic",mobility:"medium",cc:"medium",healing:"low",range:"melee"},
  "Amumu": {tags:["Tank","Mage"],damage:"magic",mobility:"low",cc:"high",healing:"low",range:"melee"},
  "Hecarim": {tags:["Fighter"],damage:"physical",mobility:"high",cc:"medium",healing:"low",range:"melee"},
  "Nocturne": {tags:["Fighter","Assassin"],damage:"physical",mobility:"high",cc:"low",healing:"low",range:"melee"},
  "Jarvan IV": {tags:["Fighter","Tank"],damage:"physical",mobility:"medium",cc:"high",healing:"low",range:"melee"},
  "Vi": {tags:["Fighter","Assassin"],damage:"physical",mobility:"medium",cc:"high",healing:"low",range:"melee"},
  "Poppy": {tags:["Tank","Fighter"],damage:"physical",mobility:"low",cc:"high",healing:"low",range:"melee"}
};
function navigate(view){$$(".view").forEach(v=>v.classList.toggle("active",v.id===`view-${view}`));$$(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.view===view));window.scrollTo({top:0,behavior:"smooth"});}
$$("[data-view]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.view)));
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.go)));
function canonicalName(name){const raw=(name||"").trim().toLowerCase();return state.champions.find(c=>c.name.toLowerCase()===raw)?.name||Object.keys(knownProfiles).find(n=>n.toLowerCase()===raw)||null;}
async function loadGameData(){
  const list=$("#champion-list");
  try{
    const versions=await fetch("https://ddragon.leagueoflegends.com/api/versions.json").then(r=>{if(!r.ok)throw Error("versions");return r.json()});
    state.version=versions[0]||"—";$("#patch-label").textContent=state.version;
    const data=await fetch(`https://ddragon.leagueoflegends.com/cdn/${state.version}/data/fr_FR/champion.json`).then(r=>{if(!r.ok)throw Error("champions");return r.json()});
    state.champions=Object.values(data.data).map(c=>({id:c.id,name:c.name}));
    list.innerHTML=state.champions.map(c=>`<option value="${escapeHtml(c.name)}"></option>`).join("");
    const select=$("#my-champion");select.innerHTML=state.champions.map(c=>`<option value="${escapeHtml(c.name)}" ${c.name==="Nasus"?"selected":""}>${escapeHtml(c.name)}</option>`).join("");
  }catch(e){$("#patch-label").textContent="Hors ligne";list.innerHTML=Object.keys(knownProfiles).map(n=>`<option value="${escapeHtml(n)}"></option>`).join("");}
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function profile(name){
  if(knownProfiles[name])return knownProfiles[name];
  const champ=state.champions.find(c=>c.name===name);
  return {tags:[],damage:"unknown",mobility:"unknown",cc:"unknown",healing:"unknown",range:"unknown",unclassified:true};
}
function analyze(){
  const names=$$("[data-enemy]").map(i=>canonicalName(i.value)).filter(Boolean);
  if(!names.length){$("#analysis-results").hidden=false;$("#analysis-results").innerHTML='<div class="welcome-note"><span class="note-icon">!</span><div><strong>Ajoute au moins un champion adverse</strong><p>Le coach a besoin d’au moins une sélection pour commencer l’analyse.</p></div></div>';return;}
  const profiles=names.map(name=>({name,...profile(name)}));
  const count=key=>profiles.filter(p=>p[key]===true).length;
  const physical=profiles.filter(p=>p.damage==="physical").length;
  const magic=profiles.filter(p=>p.damage==="magic").length;
  const mixed=profiles.filter(p=>p.damage==="mixed").length;
  const ranged=profiles.filter(p=>p.range==="ranged").length;
  const cc=profiles.filter(p=>p.cc==="high").length;
  const healing=profiles.filter(p=>p.healing==="high").length;
  const mobile=profiles.filter(p=>p.mobility==="high").length;
  const unknown=profiles.filter(p=>p.unclassified).length;
  const tips=[],items=[];
  if(physical>=3){tips.push("La composition semble orientée dégâts physiques : privilégie une option d’armure après ton premier objet offensif.");items.push("Cœur gelé — à envisager si les menaces physiques et les attaques rapides dominent.");}
  if(magic>=2||magic+mixed>=3){tips.push("Les dégâts magiques sont bien représentés : ne retarde pas trop ta résistance magique.");items.push("Visage spirituel — option défensive intéressante pour renforcer ta tenue en combat.");}
  if(cc>=2){tips.push("Plusieurs champions disposent de contrôles importants : évite les entrées sans vision et réfléchis aux bottes adaptées.");items.push("Sandales de Mercure — à considérer si les contrôles et dégâts magiques te gênent réellement.");}
  if(healing>=1){tips.push("Au moins une menace possède un profil de soin élevé : évalue le besoin d’anti-soin selon les soins réellement présents dans la partie.");items.push("Cotte épineuse / Plaque du mort — choix à confirmer selon les sources de soins et le rôle ciblé.");}
  if(ranged>=3||mobile>=2){tips.push("La composition paraît difficile à atteindre : cherche les combats autour des contrôles alliés et garde ton ralentissement pour la cible prioritaire.");}
  if(!tips.length)tips.push("La composition renseignée ne déclenche pas de contre-mesure évidente dans les profils actuellement reconnus. Garde un build équilibré et adapte-toi aux premiers achats adverses.");
  const unclassifiedNote=unknown?'<p class="muted">Note : '+unknown+' champion(s) n’ont pas encore de profil de matchup détaillé. Leur présence est prise en compte, mais les recommandations sont partielles.</p>':"";
  const html=`<div class="result-head"><div><span class="eyebrow">RÉSULTAT DE L'ANALYSE</span><h2>Lecture de la composition adverse</h2></div><span class="build-status">${names.length} / 5 CHAMPIONS</span></div>
  <div class="result-card" style="margin-bottom:12px"><h3>Composition détectée</h3><p>${profiles.map(p=>escapeHtml(p.name)).join(" · ")}</p><p>Physique : ${physical} · Magique : ${magic} · Mixte : ${mixed} · Distance : ${ranged} · Contrôles élevés : ${cc}</p>${unclassifiedNote}</div>
  <div class="result-grid"><div class="result-card"><h3>✦ Conseils prioritaires</h3><ul>${tips.map(t=>`<li>${escapeHtml(t)}</li>`).join("")}</ul></div><div class="result-card"><h3>◈ Objets à considérer</h3><ul>${(items.length?items:["Force de la trinité — base de puissance et de duel.","Bottes défensives — à choisir selon la menace dominante."]).map(t=>`<li>${escapeHtml(t)}</li>`).join("")}</ul></div><div class="result-card"><h3>⚔ Plan de jeu Nasus jungle</h3><ul><li>Privilégie un clear régulier et sécurise tes camps pour accumuler les charges de A.</li><li>Gank lorsque l'ennemi est avancé ou qu'un allié peut assurer le contrôle.</li><li>Prépare les objectifs avec de la vision : évite les combats frontaux sans information.</li></ul></div><div class="result-card"><h3>◎ Limites de cette première analyse</h3><p>Cette version utilise des profils de champions sélectionnés manuellement. Elle ne connaît pas encore les joueurs, les runes adverses, les scores, l'or ou les objets achetés. Les suggestions sont des pistes, pas une garantie de build optimal.</p></div></div>`;
  $("#analysis-results").innerHTML=html;$("#analysis-results").hidden=false;$("#analysis-results").scrollIntoView({behavior:"smooth",block:"start"});
}
$$("[data-enemy]").forEach(input=>input.addEventListener("input",()=>{const n=$$("[data-enemy]").filter(i=>i.value.trim()).length;$("#enemy-counter").textContent=`${n} / 5`; }));
$("#clear-enemies").addEventListener("click",()=>{$$("[data-enemy]").forEach(i=>i.value="");$("#enemy-counter").textContent="0 / 5";$("#analysis-results").hidden=true;});
$("#analyze-btn").addEventListener("click",analyze);
loadGameData();