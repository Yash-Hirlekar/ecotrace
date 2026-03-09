import { useState, useRef, useEffect, createContext, useContext } from "react";

if(typeof document!=="undefined"&&!document.getElementById("lf-preload")){
  ["https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css",
   "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"
  ].forEach((href,i)=>{
    const l=document.createElement("link");l.id=i===0?"lf-preload":"lf-preload-js";
    l.rel="preload";l.href=href;l.as=i===0?"style":"script";document.head.appendChild(l);
  });
}

/* ── THEMES ─────────────────────────────────── */
const LIGHT={
  bg:"#F7F3EE",bgDeep:"#EFE9E1",surface:"#FFFFFF",surface2:"#FBF8F4",
  terra:"#C1623F",terraL:"#D4795A",terraG:"linear-gradient(135deg,#A84F30,#C1623F,#D4795A)",
  sage:"#6B8C6E",moss:"#4A6741",sand:"#C9A87A",clay:"#8B5E3C",amber:"#B8860B",red:"#C0392B",
  text:"#2C1F0E",text2:"#6B5744",text3:"#A8917A",
  border:"rgba(139,94,60,0.13)",borderH:"rgba(193,98,63,0.35)",glow:"rgba(193,98,63,0.18)",
  mapBg:"#e8e0d5",mapFilter:"sepia(15%) saturate(90%) brightness(102%)",
  shadow:"rgba(44,31,14,.08)",shadowMd:"rgba(44,31,14,.13)",
};
const DARK={
  bg:"#130E08",bgDeep:"#1C1409",surface:"#1F1710",surface2:"#251D12",
  terra:"#D4795A",terraL:"#E08A6A",terraG:"linear-gradient(135deg,#C1623F,#D4795A,#E08A6A)",
  sage:"#89A88C",moss:"#6BAF6E",sand:"#C9A87A",clay:"#C49A72",amber:"#D4A017",red:"#E05252",
  text:"#F5EDE3",text2:"#C4A882",text3:"#7A6248",
  border:"rgba(212,121,90,0.15)",borderH:"rgba(212,121,90,0.40)",glow:"rgba(212,121,90,0.22)",
  mapBg:"#1a120a",mapFilter:"sepia(40%) saturate(60%) brightness(55%) hue-rotate(5deg)",
  shadow:"rgba(0,0,0,.35)",shadowMd:"rgba(0,0,0,.5)",
};
const ThemeCtx=createContext({C:LIGHT,dark:false,toggle:()=>{}});
const useTheme=()=>useContext(ThemeCtx);

function buildCSS(C){return `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:${C.bg};font-family:'DM Sans',sans-serif;color:${C.text}}
  input,textarea,button{font-family:'DM Sans',sans-serif}
  input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
  ::-webkit-scrollbar{width:4px;background:transparent}
  ::-webkit-scrollbar-thumb{background:${C.border};border-radius:4px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes treePop{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:scale(1)}}
  @keyframes softPulse{0%,100%{box-shadow:0 0 0 0 ${C.glow}}50%{box-shadow:0 0 0 8px rgba(193,98,63,0)}}
  @keyframes notifSlide{from{opacity:0;transform:translateX(110%)}to{opacity:1;transform:translateX(0)}}
  @keyframes notifOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(110%)}}
  .fadeUp{animation:fadeUp .4s cubic-bezier(.22,.68,0,1.15) both}
  .fadeUp2{animation:fadeUp .4s cubic-bezier(.22,.68,0,1.15) .07s both}
  .fadeUp3{animation:fadeUp .4s cubic-bezier(.22,.68,0,1.15) .14s both}
  .slideDown{animation:slideDown .22s ease both}
  .btn-primary{background:${C.terraG};color:#fff;border:none;border-radius:14px;padding:14px 20px;font-size:15px;font-weight:700;cursor:pointer;width:100%;box-shadow:0 4px 18px ${C.glow};transition:transform .15s,box-shadow .15s,opacity .15s}
  .btn-primary:hover{transform:translateY(-1px);box-shadow:0 8px 28px ${C.glow}}
  .btn-primary:active{transform:translateY(0)}
  .btn-primary:disabled{opacity:.35;cursor:not-allowed;transform:none}
  .btn-ghost{background:${C.surface};color:${C.terra};border:1.5px solid ${C.borderH};border-radius:12px;padding:11px 18px;font-size:13px;font-weight:700;cursor:pointer;transition:all .15s}
  .btn-ghost:hover{background:${C.bgDeep}}
  .input-field{width:100%;background:${C.surface};border:1.5px solid ${C.border};border-radius:12px;padding:13px 16px;font-size:14px;color:${C.text};outline:none;transition:border-color .2s,box-shadow .2s}
  .input-field:focus{border-color:${C.terra};box-shadow:0 0 0 3px ${C.glow}}
  .input-field::placeholder{color:${C.text3}}
  .tab-btn{flex:1;padding:13px 6px;border:none;background:transparent;color:${C.text3};font-size:11px;font-weight:700;cursor:pointer;border-bottom:2.5px solid transparent;transition:color .2s,border-color .2s;white-space:nowrap;letter-spacing:.3px;text-transform:uppercase}
  .tab-btn.active{color:${C.terra};border-bottom-color:${C.terra}}
  .tab-btn:hover:not(.active){color:${C.text2}}
  .card{background:${C.surface};border:1px solid ${C.border};border-radius:18px;padding:18px}
  .leaflet-container{background:${C.mapBg}!important}
  .leaflet-tile-pane{filter:${C.mapFilter}}
  .leaflet-control-zoom a{background:${C.surface}!important;color:${C.text2}!important;border-color:${C.border}!important}
  .leaflet-control-zoom a:hover{background:${C.surface2}!important;color:${C.text}!important}
  .leaflet-bar{border:none!important;box-shadow:0 2px 12px ${C.shadow}!important}
  .leaflet-control-attribution{background:${C.surface}cc!important;color:${C.text3}!important;font-size:9px!important}
  .leaflet-control-attribution a{color:${C.terra}!important}
  .leaflet-popup-content-wrapper{background:${C.surface}!important;border:1px solid ${C.border}!important;border-radius:14px!important;box-shadow:0 4px 24px ${C.shadowMd}!important;color:${C.text}!important}
  .leaflet-popup-tip{background:${C.surface}!important}
  .leaflet-popup-close-button{color:${C.text3}!important;font-size:18px!important}
  .leaflet-popup-close-button:hover{color:${C.text}!important;background:none!important}
  @keyframes uPulse{0%{transform:translate(-50%,-50%) scale(.3);opacity:1}100%{transform:translate(-50%,-50%) scale(3);opacity:0}}
  .u-pulse::after{content:'';position:absolute;top:50%;left:50%;width:20px;height:20px;border-radius:50%;background:${C.glow};animation:uPulse 2s ease-out infinite;pointer-events:none}
`;}

/* ── CONSTANTS ──────────────────────────────── */
const STATUS_FLOW=["Submitted","Under Review","Action Taken","Resolved"];
const getStatusMeta=C=>({
  "Submitted":    {bg:`rgba(184,134,11,.1)`, text:C.amber,dot:C.amber},
  "Under Review": {bg:`rgba(107,140,110,.12)`,text:C.moss, dot:C.sage},
  "Action Taken": {bg:`${C.terra}18`,        text:C.terra,dot:C.terra},
  "Resolved":     {bg:`rgba(74,103,65,.1)`,  text:C.moss, dot:C.moss},
});
const getHazardMeta=C=>({
  "Low":   {bg:`rgba(107,140,110,.1)`,text:C.moss, bar:C.sage},
  "Medium":{bg:`rgba(184,134,11,.1)`, text:C.amber,bar:C.amber},
  "High":  {bg:`rgba(192,57,43,.1)`,  text:C.red,  bar:C.red},
});
const CAT_ICONS={"Recyclable":"♻️","Reusable":"🔄","Organic":"🌿","Hazardous":"⚠️","Electronic":"🔌","General Waste":"🗑️","Construction":"🧱","Medical":"🏥"};
const FACILITY_TYPES=[
  {type:"Recycling Centre",icon:"♻️",color:"#6B8C6E"},{type:"Waste Transfer",icon:"🚛",color:"#8B5E3C"},
  {type:"Hazardous Waste", icon:"⚠️",color:"#C0392B"},{type:"Composting",    icon:"🌿",color:"#4A6741"},
  {type:"E-Waste",         icon:"🔌",color:"#5B7FA6"},
];
const FACILITIES=[
  {id:1,name:"Dharavi Recycling Hub",     type:"Recycling Centre",lat:19.0422,lng:72.8543,address:"Dharavi, Mumbai",    hours:"Mon–Sat 7am–6pm",    phone:"022-2401-1234"},
  {id:2,name:"Deonar Dumping Ground",     type:"Waste Transfer",  lat:19.0568,lng:72.9265,address:"Deonar, Mumbai",    hours:"24 Hours",           phone:"022-2552-8900"},
  {id:3,name:"Mulund Composting Facility",type:"Composting",      lat:19.1750,lng:72.9500,address:"Mulund, Mumbai",    hours:"Mon–Fri 8am–5pm",    phone:"022-2567-3300"},
  {id:4,name:"MCGM E-Waste Drop-off",     type:"E-Waste",         lat:19.0760,lng:72.8777,address:"Bandra, Mumbai",    hours:"Tue/Thu/Sat 9am–3pm",phone:"022-2641-7800"},
  {id:5,name:"Kanjurmarg Waste Plant",    type:"Waste Transfer",  lat:19.1195,lng:72.9398,address:"Kanjurmarg, Mumbai",hours:"24 Hours",           phone:"022-2578-4100"},
  {id:6,name:"Versova Hazardous Facility",type:"Hazardous Waste", lat:19.1305,lng:72.8120,address:"Versova, Mumbai",   hours:"Mon–Fri 9am–4pm",    phone:"022-2632-5500"},
  {id:7,name:"Goregaon Recycling Centre", type:"Recycling Centre",lat:19.1663,lng:72.8526,address:"Goregaon, Mumbai",  hours:"Mon–Sat 8am–6pm",    phone:"022-2879-2100"},
  {id:8,name:"Powai E-Waste Collection",  type:"E-Waste",         lat:19.1176,lng:72.9060,address:"Powai, Mumbai",     hours:"Wed/Sat 10am–4pm",   phone:"022-2857-6300"},
];
const WASTE_TYPES=[
  {id:"plastic",  label:"Plastic",  icon:"🧴",color:"#5B7FA6",co2:2.5},
  {id:"paper",    label:"Paper",    icon:"📄",color:"#8B5E3C",co2:1.1},
  {id:"glass",    label:"Glass",    icon:"🫙",color:"#6B8C6E",co2:0.3},
  {id:"metal",    label:"Metal",    icon:"🥫",color:"#7A7A7A",co2:4.0},
  {id:"ewaste",   label:"E-Waste",  icon:"📱",color:"#5B7FA6",co2:8.0},
  {id:"organic",  label:"Organic",  icon:"🍂",color:"#4A6741",co2:0.5},
  {id:"textile",  label:"Textile",  icon:"👕",color:"#C1623F",co2:1.8},
  {id:"batteries",label:"Batteries",icon:"🔋",color:"#B8860B",co2:6.0},
];
const CO2_TREE=21,CO2_KM=0.21,CO2_PHONE=0.005,CO2_SHOWER=0.5;
const STATUS_NOTIF={
  "Under Review":{icon:"🔍",msg:"Your complaint is now under review by local authorities."},
  "Action Taken":{icon:"🚛",msg:"A cleanup crew has been dispatched to the location."},
  "Resolved":    {icon:"✅",msg:"The dump site has been cleaned up. Thank you for reporting!"},
};

/* ── UTILS ──────────────────────────────────── */
function genId(){return `ET-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2,5).toUpperCase()}`;}
function km(a,b){const R=6371,dL=(b.lat-a.lat)*Math.PI/180,dG=(b.lng-a.lng)*Math.PI/180,x=Math.sin(dL/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dG/2)**2;return(R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))).toFixed(1);}
function ecoLevel(co2,C){
  if(co2<10)  return{label:"Seedling",icon:"🌱",color:C.sage,next:10};
  if(co2<50)  return{label:"Sapling", icon:"🌿",color:C.sage,next:50};
  if(co2<150) return{label:"Tree",    icon:"🌳",color:C.moss,next:150};
  if(co2<500) return{label:"Forest",  icon:"🌲",color:C.moss,next:500};
  return            {label:"Guardian",icon:"🌍",color:C.clay,next:Infinity};
}
function useCountUp(target,dur=1100){
  const [v,sv]=useState(0);const r=useRef();
  useEffect(()=>{const s=performance.now();const f=n=>{const p=Math.min((n-s)/dur,1);sv(target*(1-Math.pow(1-p,3)));if(p<1)r.current=requestAnimationFrame(f);};r.current=requestAnimationFrame(f);return()=>cancelAnimationFrame(r.current);},[target]);
  return v;
}
function isOpenNow(h){
  if(!h||h==="24 Hours")return h==="24 Hours"?true:null;
  try{
    const now=new Date(),day=now.getDay(),cur=now.getHours()*60+now.getMinutes();
    const toMin=s=>{const[t,ap]=s.trim().split(/(am|pm)/i);const[h,m="0"]=t.split(":");let hr=+h;if(ap?.toLowerCase()==="pm"&&hr!==12)hr+=12;if(ap?.toLowerCase()==="am"&&hr===12)hr=0;return hr*60+(+m);};
    const rng=h.match(/(\d+(?::\d+)?\s*(?:am|pm))[\s–\-]+(\d+(?::\d+)?\s*(?:am|pm))/i);
    if(!rng)return null;
    return cur>=toMin(rng[1])&&cur<toMin(rng[2]);
  }catch{return null;}
}
let _saved=null;
try{const s=sessionStorage.getItem("et_u");if(s)_saved=JSON.parse(s);}catch{}

/* ── NOTIFICATION SYSTEM ────────────────────── */
const NotifCtx=createContext({push:()=>{}});
function NotifProvider({children}){
  const [notifs,setNotifs]=useState([]);
  const push=(title,msg,icon="🔔",color="#C1623F")=>{
    const id=Date.now();
    setNotifs(p=>[...p,{id,title,msg,icon,color,out:false}]);
    setTimeout(()=>setNotifs(p=>p.map(n=>n.id===id?{...n,out:true}:n)),4200);
    setTimeout(()=>setNotifs(p=>p.filter(n=>n.id!==id)),4700);
  };
  return(
    <NotifCtx.Provider value={{push}}>
      {children}
      <div style={{position:"fixed",top:16,right:16,zIndex:99999,display:"flex",flexDirection:"column",gap:10,maxWidth:300,pointerEvents:"none"}}>
        {notifs.map(n=>(
          <NotifToast key={n.id} n={n}/>
        ))}
      </div>
    </NotifCtx.Provider>
  );
}
function NotifToast({n}){
  const {C}=useTheme();
  return(
    <div style={{background:C.surface,border:`1.5px solid ${n.color}44`,borderRadius:16,padding:"12px 15px",boxShadow:`0 8px 32px ${C.shadowMd},0 0 0 1px ${n.color}22`,display:"flex",gap:11,alignItems:"flex-start",animation:n.out?"notifOut .4s ease forwards":"notifSlide .35s cubic-bezier(.22,.68,0,1.2) forwards",pointerEvents:"auto"}}>
      <div style={{width:36,height:36,borderRadius:11,background:`${n.color}18`,border:`1px solid ${n.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{n.icon}</div>
      <div style={{minWidth:0}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:3}}>{n.title}</div>
        <div style={{fontSize:12,color:C.text2,lineHeight:1.45}}>{n.msg}</div>
      </div>
    </div>
  );
}
const useNotif=()=>useContext(NotifCtx);

/* ── THEME TOGGLE ───────────────────────────── */
function ThemeToggle(){
  const {C,dark,toggle}=useTheme();
  return(
    <button onClick={toggle} style={{width:44,height:26,borderRadius:13,border:`1.5px solid ${C.border}`,background:dark?C.terra:`${C.terra}18`,cursor:"pointer",position:"relative",transition:"all .3s",flexShrink:0,padding:0}}>
      <div style={{position:"absolute",top:3,left:dark?20:3,width:18,height:18,borderRadius:"50%",background:dark?"#fff":C.terra,transition:"left .25s cubic-bezier(.34,1.56,.64,1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,lineHeight:1}}>
        {dark?"🌙":"☀️"}
      </div>
    </button>
  );
}

/* ── SHARED ATOMS ───────────────────────────── */
function Badge({status}){
  const {C}=useTheme();const m=getStatusMeta(C)[status]||getStatusMeta(C)["Submitted"];
  return <span style={{background:m.bg,color:m.text,borderRadius:20,padding:"4px 11px",fontSize:11,fontWeight:700,display:"inline-flex",alignItems:"center",gap:5}}><span style={{width:6,height:6,borderRadius:"50%",background:m.dot,display:"block",flexShrink:0}}/>{status}</span>;
}
function StatusRail({status}){
  const {C}=useTheme();const idx=STATUS_FLOW.indexOf(status);
  return(
    <div style={{display:"flex",alignItems:"center",width:"100%",margin:"14px 0 6px"}}>
      {STATUS_FLOW.map((s,i)=>(
        <div key={s} style={{display:"flex",alignItems:"center",flex:i<STATUS_FLOW.length-1?1:"none"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:i<=idx?C.terraG:`${C.text}0a`,border:i===idx?"none":`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:i===idx?`0 0 0 4px ${C.glow}`:"none",transition:"all .3s"}}>
              {i<idx?<svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>:<span style={{width:6,height:6,borderRadius:"50%",background:i<=idx?"#fff":C.text3,display:"block"}}/>}
            </div>
            <span style={{fontSize:8,color:i<=idx?C.terra:C.text3,fontWeight:i===idx?800:600,whiteSpace:"nowrap",letterSpacing:.5,textTransform:"uppercase"}}>{s}</span>
          </div>
          {i<STATUS_FLOW.length-1&&<div style={{flex:1,height:1.5,background:i<idx?C.terra:C.border,margin:"0 3px",marginBottom:20,borderRadius:2,transition:"background .3s"}}/>}
        </div>
      ))}
    </div>
  );
}

/* ── AI CALL ────────────────────────────────── */
async function callAI(b64){
  let raw="";
  try{
    const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCSh-QiI-xZUFKfr2C5zjw5HSGBKfG46uI`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        contents:[{parts:[
          {inline_data:{mime_type:"image/jpeg",data:b64}},
          {text:`Analyze this image for waste and trash items. Reply with only a JSON object, no explanation, no markdown. Use this exact shape:
{"wasteType":"string","primaryCategory":"General Waste","tags":["a","b"],"reusable":false,"recyclable":true,"compostable":false,"hazardLevel":"Low","disposalSteps":["step1"],"environmentalImpact":"string","recommendedFacilityType":"Recycling Centre","confidence":"High","sceneDescription":"string","estimatedVolume":"Medium (1-5 bags)","trashItems":[{"name":"string","category":"Plastic","recyclable":true,"quantity":"few","notes":"string"}]}`}
        ]}]
      })
    });
    const d=await r.json();
    if(d.error) throw new Error(d.error.message);
    raw=d.candidates?.[0]?.content?.parts?.[0]?.text||"";
    const match=raw.match(/\{[\s\S]*\}/);
    if(!match) throw new Error(`No JSON found. Model said: ${raw.slice(0,300)}`);
    return JSON.parse(match[0]);
  }catch(err){
    throw new Error(err.message||"Unknown error");
  }
}

/* ── TRASH IDENTIFIER PANEL ─────────────────── */
const CAT_COLOR={
  Plastic:"#5B7FA6",Glass:"#6B8C6E",Metal:"#7A7A7A",Paper:"#8B5E3C",
  Organic:"#4A6741",Hazardous:"#C0392B",Electronic:"#5B7FA6",Textile:"#C1623F",Mixed:"#9B7EA6"
};
const CAT_ICON={Plastic:"🧴",Glass:"🫙",Metal:"🥫",Paper:"📄",Organic:"🍂",Hazardous:"⚠️",Electronic:"📱",Textile:"👕",Mixed:"🗑️"};
const QTY_DOT={single:1,few:3,many:5};

function TrashIdentifierPanel({items,sceneDescription,estimatedVolume}){
  const {C}=useTheme();
  const [open,setOpen]=useState(true);
  const [selCat,setSelCat]=useState("All");
  if(!items?.length)return null;
  const cats=["All",...[...new Set(items.map(i=>i.category))]];
  const filtered=selCat==="All"?items:items.filter(i=>i.category===selCat);
  const recycCount=items.filter(i=>i.recyclable).length;
  const hazCount=items.filter(i=>i.category==="Hazardous").length;
  return(
    <div style={{background:C.surface,border:`1.5px solid ${C.borderH}`,borderRadius:18,overflow:"hidden",boxShadow:`0 2px 14px ${C.shadow}`}}>
      <div onClick={()=>setOpen(o=>!o)} style={{padding:"14px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",background:C.surface2}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:11,background:C.terraG,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0,boxShadow:`0 2px 8px ${C.glow}`}}>🔎</div>
          <div>
            <div style={{fontWeight:800,fontSize:14,color:C.text}}>Trash Identifier</div>
            <div style={{fontSize:11,color:C.text3,marginTop:1}}>{items.length} item{items.length!==1?"s":""} detected · {recycCount} recyclable{hazCount>0?` · ⚠️ ${hazCount} hazardous`:""}</div>
          </div>
        </div>
        <span style={{color:C.text3,fontSize:12,fontWeight:700}}>{open?"▲":"▼"}</span>
      </div>
      {open&&(
        <div className="slideDown">
          {(sceneDescription||estimatedVolume)&&(
            <div style={{padding:"10px 16px",background:`${C.terra}08`,borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
              {sceneDescription&&<div style={{fontSize:12,color:C.text2,lineHeight:1.5,flex:1,fontStyle:"italic"}}>"{sceneDescription}"</div>}
              {estimatedVolume&&<div style={{background:`${C.clay}12`,border:`1px solid ${C.clay}28`,borderRadius:8,padding:"4px 10px",fontSize:11,fontWeight:700,color:C.clay,whiteSpace:"nowrap",flexShrink:0}}>📦 {estimatedVolume}</div>}
            </div>
          )}
          {cats.length>2&&(
            <div style={{padding:"10px 16px 0",display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none"}}>
              {cats.map(cat=>{
                const col=cat==="All"?C.terra:CAT_COLOR[cat]||C.terra;
                const active=selCat===cat;
                return(
                  <button key={cat} onClick={()=>setSelCat(cat)} style={{flexShrink:0,padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:700,border:`1.5px solid ${active?col:C.border}`,background:active?`${col}14`:C.surface,color:active?col:C.text3,cursor:"pointer",transition:"all .15s"}}>
                    {cat==="All"?"🗂 All":`${CAT_ICON[cat]||"🗑️"} ${cat}`}
                  </button>
                );
              })}
            </div>
          )}
          <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:8}}>
            {filtered.map((item,i)=>{
              const col=CAT_COLOR[item.category]||C.terra;
              const icon=CAT_ICON[item.category]||"🗑️";
              const dots=QTY_DOT[item.quantity]||1;
              return(
                <div key={i} style={{display:"flex",gap:11,alignItems:"flex-start",background:C.surface2,border:`1px solid ${col}22`,borderRadius:13,padding:"11px 13px",animation:`fadeUp .3s ease ${i*.05}s both`}}>
                  <div style={{width:38,height:38,borderRadius:11,background:`${col}12`,border:`1px solid ${col}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                      <div style={{fontWeight:700,fontSize:13,color:C.text,lineHeight:1.3}}>{item.name}</div>
                      <div style={{display:"flex",gap:4,flexShrink:0,alignItems:"center"}}>
                        {Array.from({length:dots}).map((_,d)=><span key={d} style={{width:5,height:5,borderRadius:"50%",background:col,display:"block",opacity:.7+d*.1}}/>)}
                      </div>
                    </div>
                    <div style={{display:"flex",gap:5,marginTop:5,flexWrap:"wrap"}}>
                      <span style={{background:`${col}10`,border:`1px solid ${col}28`,color:col,borderRadius:6,padding:"2px 8px",fontSize:10,fontWeight:700}}>{item.category}</span>
                      <span style={{background:item.recyclable?`${C.moss}10`:`${C.red}0d`,border:`1px solid ${item.recyclable?C.moss:C.red}28`,color:item.recyclable?C.moss:C.red,borderRadius:6,padding:"2px 8px",fontSize:10,fontWeight:700}}>{item.recyclable?"♻️ Recyclable":"🚫 Non-recyclable"}</span>
                    </div>
                    {item.notes&&<div style={{fontSize:11,color:C.text3,marginTop:5,lineHeight:1.45}}>💡 {item.notes}</div>}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{margin:"0 16px 14px",background:C.bgDeep,border:`1px solid ${C.border}`,borderRadius:11,padding:"10px 14px",display:"flex",justifyContent:"space-around"}}>
            {[
              {v:items.length,l:"Total Items",c:C.terra,e:"🗂"},
              {v:recycCount,l:"Recyclable",c:C.moss,e:"♻️"},
              {v:items.filter(i=>i.category==="Organic").length,l:"Organic",c:C.sage,e:"🌿"},
              {v:hazCount,l:"Hazardous",c:C.red,e:"⚠️"},
            ].map(s=>(
              <div key={s.l} style={{textAlign:"center"}}>
                <div style={{fontSize:11}}>{s.e}</div>
                <div style={{fontSize:16,fontWeight:900,color:s.c,lineHeight:1.1}}>{s.v}</div>
                <div style={{fontSize:9,color:C.text3,letterSpacing:.4,textTransform:"uppercase",marginTop:1}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── ANALYSIS CARD ──────────────────────────── */
function AnalysisCard({analysis,loading}){
  const {C}=useTheme();
  if(loading)return(
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:18,padding:20}}>
      <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:16}}>
        <div style={{width:46,height:46,borderRadius:14,background:C.terraG,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,animation:"softPulse 1.8s ease-in-out infinite"}}>🔬</div>
        <div><div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:4}}>Analysing with Claude Vision</div><div style={{fontSize:12,color:C.text3}}>Identifying waste & disposal guidance…</div></div>
      </div>
      <div style={{display:"flex",gap:8}}>{[70,45,85].map((w,i)=><div key={i} style={{height:6,borderRadius:3,flex:1,background:`linear-gradient(90deg,${C.bgDeep},${C.terra}22,${C.bgDeep})`,backgroundSize:"200% 100%",animation:`shimmer 1.6s ease-in-out ${i*.18}s infinite`}}/>)}</div>
    </div>
  );
  if(!analysis)return null;
  const hz=getHazardMeta(C)[analysis.hazardLevel]||getHazardMeta(C)["Low"];
  const hPct={Low:18,Medium:58,High:92}[analysis.hazardLevel]||18;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}} className="fadeUp">
      <div style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:18,padding:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div><div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,color:C.terra,textTransform:"uppercase",marginBottom:5}}>AI Analysis</div><div style={{fontWeight:800,fontSize:19,color:C.text,letterSpacing:-.4,lineHeight:1.2}}>{analysis.wasteType}</div></div>
          <div style={{fontSize:38,lineHeight:1}}>{CAT_ICONS[analysis.primaryCategory]||"🗑️"}</div>
        </div>
        <div style={{display:"flex",gap:6,marginTop:12,flexWrap:"wrap"}}>{analysis.tags?.map(t=><span key={t} style={{background:C.bgDeep,border:`1px solid ${C.border}`,borderRadius:20,padding:"4px 11px",fontSize:11,fontWeight:600,color:C.text2}}>{t}</span>)}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        {[{l:"Reusable",v:analysis.reusable,e:"🔄"},{l:"Recyclable",v:analysis.recyclable,e:"♻️"},{l:"Compostable",v:analysis.compostable,e:"🌿"}].map(({l,v,e})=>(
          <div key={l} style={{background:v?`rgba(74,103,65,.08)`:`rgba(192,57,43,.05)`,border:`1px solid ${v?"rgba(74,103,65,.2)":"rgba(192,57,43,.15)"}`,borderRadius:13,padding:"13px 8px",textAlign:"center"}}>
            <div style={{fontSize:22,marginBottom:4}}>{e}</div>
            <div style={{fontWeight:800,fontSize:12,color:v?C.moss:C.red}}>{v?"Yes":"No"}</div>
            <div style={{fontSize:10,color:C.text3,marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}><span style={{fontWeight:700,fontSize:13,color:C.text}}>Hazard Level</span><span style={{background:hz.bg,color:hz.text,borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:700}}>{analysis.hazardLevel}</span></div>
        <div style={{background:C.bgDeep,borderRadius:6,height:7,overflow:"hidden"}}><div style={{width:`${hPct}%`,height:"100%",background:hz.bar,borderRadius:6,transition:"width .9s cubic-bezier(.34,1.56,.64,1)"}}/></div>
      </div>
      <div className="card">
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:11}}>Disposal Steps</div>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {analysis.disposalSteps?.map((step,i)=>(
            <div key={i} style={{display:"flex",gap:11,alignItems:"flex-start"}}>
              <div style={{width:23,height:23,borderRadius:"50%",background:C.terraG,color:"#fff",fontSize:11,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{i+1}</div>
              <div style={{fontSize:13,color:C.text2,lineHeight:1.6}}>{step}</div>
            </div>
          ))}
        </div>
      </div>
      {analysis.trashItems?.length>0&&<TrashIdentifierPanel items={analysis.trashItems} sceneDescription={analysis.sceneDescription} estimatedVolume={analysis.estimatedVolume}/>}
      {analysis.environmentalImpact&&<div style={{background:`${C.amber}14`,border:`1px solid ${C.amber}33`,borderRadius:15,padding:"14px 16px"}}><div style={{fontWeight:700,color:C.amber,fontSize:13,marginBottom:5}}>🌍 Environmental Impact</div><div style={{fontSize:13,color:C.text2,lineHeight:1.6}}>{analysis.environmentalImpact}</div></div>}
      {analysis.recommendedFacilityType&&<div style={{background:`${C.sage}12`,border:`1px solid ${C.sage}33`,borderRadius:15,padding:"13px 16px",display:"flex",alignItems:"center",gap:11}}><div style={{fontSize:26}}>🏭</div><div><div style={{fontSize:10,color:C.sage,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,marginBottom:2}}>Recommended Drop-off</div><div style={{fontSize:14,fontWeight:700,color:C.text}}>{analysis.recommendedFacilityType}</div></div></div>}
      <div style={{textAlign:"center",fontSize:11,color:C.text3}}>Confidence: {analysis.confidence||"High"} · Claude Vision</div>
    </div>
  );
}

/* ── SHARE MODAL ────────────────────────────── */
function ShareModal({complaint,onClose}){
  const {C}=useTheme();
  const canvasRef=useRef();
  const [copied,setCopied]=useState(false);
  const [generated,setGenerated]=useState(false);

  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");
    const W=640,H=400;canvas.width=W;canvas.height=H;
    ctx.fillStyle="#F7F3EE";ctx.fillRect(0,0,W,H);
    const grad=ctx.createLinearGradient(0,0,W,0);
    grad.addColorStop(0,"#A84F30");grad.addColorStop(.5,"#C1623F");grad.addColorStop(1,"#D4795A");
    ctx.fillStyle=grad;ctx.fillRect(0,0,W,80);
    ctx.fillStyle="rgba(255,255,255,.2)";ctx.beginPath();ctx.arc(48,40,28,0,Math.PI*2);ctx.fill();
    ctx.font="bold 28px sans-serif";ctx.fillStyle="#fff";ctx.textAlign="center";ctx.textBaseline="middle";
    ctx.fillText("🌍",48,42);
    ctx.fillStyle="#fff";ctx.font="bold 22px DM Sans,sans-serif";ctx.textAlign="left";ctx.textBaseline="middle";
    ctx.fillText("EcoTrace Complaint Report",90,40);
    ctx.fillStyle="rgba(255,255,255,.18)";roundRect(ctx,W-180,20,160,40,8);ctx.fill();
    ctx.fillStyle="#fff";ctx.font="bold 13px DM Mono,monospace";ctx.textAlign="center";
    ctx.fillText(complaint.id,W-100,40);
    ctx.fillStyle="#2C1F0E";ctx.font="bold 18px DM Sans,sans-serif";ctx.textAlign="left";ctx.textBaseline="top";
    ctx.fillText(complaint.analysis?.wasteType||"Waste Report",32,106);
    const sColors={"Submitted":"#B8860B","Under Review":"#6B8C6E","Action Taken":"#C1623F","Resolved":"#4A6741"};
    const sc=sColors[complaint.status]||"#C1623F";
    ctx.fillStyle=sc+"22";roundRect(ctx,32,134,120,28,14);ctx.fill();
    ctx.strokeStyle=sc+"66";ctx.lineWidth=1.5;roundRect(ctx,32,134,120,28,14);ctx.stroke();
    ctx.fillStyle=sc;ctx.font="bold 12px DM Sans,sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";
    ctx.fillText(complaint.status,92,148);
    const rows=[
      ["📍",complaint.address||`${complaint.lat?.toFixed(4)||"?"}, ${complaint.lng?.toFixed(4)||"?"}`],
      ["📅",complaint.submittedAt||"Unknown date"],
      ["⚠️",`Hazard: ${complaint.analysis?.hazardLevel||"N/A"}`],
      ["🏭",`Facility: ${complaint.analysis?.recommendedFacilityType||"N/A"}`],
    ];
    rows.forEach(([icon,text],i)=>{
      const y=106+60+i*38;
      ctx.fillStyle="#EFE9E1";roundRect(ctx,32,y,W-64,30,8);ctx.fill();
      ctx.font="15px sans-serif";ctx.fillStyle="#2C1F0E";ctx.textAlign="left";ctx.textBaseline="middle";
      ctx.fillText(icon,46,y+15);
      ctx.font="13px DM Sans,sans-serif";ctx.fillStyle="#6B5744";
      ctx.fillText(text.length>56?text.substring(0,56)+"…":text,70,y+15);
    });
    ctx.fillStyle="#EFE9E1";ctx.fillRect(0,H-44,W,44);
    ctx.fillStyle="#A8917A";ctx.font="12px DM Sans,sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";
    ctx.fillText("Generated by EcoTrace · AI-powered waste reporting · Mumbai",W/2,H-22);
    setGenerated(true);
  },[]);

  function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();}

  const downloadPNG=()=>{const a=document.createElement("a");a.download=`EcoTrace-${complaint.id}.png`;a.href=canvasRef.current.toDataURL("image/png");a.click();};
  const copyId=()=>{try{navigator.clipboard.writeText(complaint.id).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);});}catch{}};
  const shareText=`EcoTrace Report\nID: ${complaint.id}\nWaste: ${complaint.analysis?.wasteType||"N/A"}\nLocation: ${complaint.address||"N/A"}\nStatus: ${complaint.status}`;
  const canShare=navigator.share!=null;

  return(
    <div style={{position:"fixed",inset:0,zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.5)",backdropFilter:"blur(8px)",padding:16}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="fadeUp" style={{width:"100%",maxWidth:460,background:C.surface,borderRadius:22,boxShadow:`0 24px 64px ${C.shadowMd}`,border:`1px solid ${C.border}`,overflow:"hidden",maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{height:3,background:C.terraG}}/>
        <div style={{padding:"20px 20px 24px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div><div style={{fontWeight:800,fontSize:16,color:C.text}}>📤 Share Report</div><div style={{fontSize:12,color:C.text3,marginTop:2}}>Export or share your complaint</div></div>
            <button onClick={onClose} style={{background:C.bgDeep,border:"none",color:C.text3,borderRadius:9,width:32,height:32,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>✕</button>
          </div>
          <div style={{borderRadius:14,overflow:"hidden",border:`1px solid ${C.border}`,marginBottom:16,background:C.bgDeep,display:"flex",alignItems:"center",justifyContent:"center",minHeight:120}}>
            {!generated&&<div style={{padding:20,color:C.text3,fontSize:13}}>Generating preview…</div>}
            <canvas ref={canvasRef} style={{width:"100%",display:generated?"block":"none"}}/>
          </div>
          <div style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:13,padding:"12px 14px",marginBottom:16,display:"flex",flexDirection:"column",gap:6}}>
            {[["🆔","ID",complaint.id],["📍","Location",complaint.address||"N/A"],["🗓","Date",complaint.submittedAt],["📊","Status",complaint.status]].map(([icon,label,val])=>(
              <div key={label} style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontSize:14,flexShrink:0}}>{icon}</span>
                <span style={{fontSize:11,color:C.text3,fontWeight:700,minWidth:56,letterSpacing:.3,textTransform:"uppercase"}}>{label}</span>
                <span style={{fontSize:12,color:C.text,fontWeight:600,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{val}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            <button onClick={downloadPNG} className="btn-primary" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>⬇️ Download as Image (.png)</button>
            <div style={{display:"flex",gap:9}}>
              <button onClick={copyId} style={{flex:1,background:copied?`${C.moss}14`:C.surface2,border:`1.5px solid ${copied?C.moss:C.border}`,color:copied?C.moss:C.text2,borderRadius:12,padding:"11px 0",fontSize:13,fontWeight:700,cursor:"pointer",transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>{copied?"✅ Copied!":"📋 Copy ID"}</button>
              {canShare&&(<button onClick={()=>navigator.share({title:`EcoTrace Report ${complaint.id}`,text:shareText}).catch(()=>{})} style={{flex:1,background:C.surface2,border:`1.5px solid ${C.border}`,color:C.text2,borderRadius:12,padding:"11px 0",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>🔗 Share</button>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── COMPLAINT CARD ─────────────────────────── */
function ComplaintCard({complaint,onAdvance}){
  const {C}=useTheme();
  const {push}=useNotif();
  const [open,setOpen]=useState(false);
  const [showShare,setShowShare]=useState(false);

  const handleAdvance=()=>{
    const cur=complaint.status;
    onAdvance(complaint.id);
    const ni=Math.min(STATUS_FLOW.indexOf(cur)+1,STATUS_FLOW.length-1);
    const next=STATUS_FLOW[ni];
    if(next!==cur&&STATUS_NOTIF[next]){
      const n=STATUS_NOTIF[next];
      push(`Status: ${next}`,n.msg,n.icon,C.terra);
    }
  };

  return(
    <>
      <div style={{borderRadius:16,border:`1px solid ${open?C.borderH:C.border}`,overflow:"hidden",background:C.surface,transition:"border-color .2s",boxShadow:`0 1px 4px ${C.shadow}`}}>
        <div style={{padding:"14px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}} onClick={()=>setOpen(o=>!o)}>
          <div style={{flex:1,minWidth:0,marginRight:12}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:C.terra,fontWeight:600,letterSpacing:.5,marginBottom:4}}>#{complaint.id}</div>
            <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{complaint.analysis?.wasteType||complaint.address||"Location recorded"}</div>
            <div style={{fontSize:11,color:C.text3}}>{complaint.submittedAt}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0}}>
            <Badge status={complaint.status}/>
            <span style={{fontSize:11,color:C.text3}}>{open?"▲":"▼"}</span>
          </div>
        </div>
        {open&&(
          <div className="slideDown" style={{borderTop:`1px solid ${C.border}`,padding:"14px 16px",display:"flex",flexDirection:"column",gap:11}}>
            {complaint.photo&&<img src={complaint.photo} alt="" style={{width:"100%",borderRadius:10,maxHeight:180,objectFit:"cover"}}/>}
            {complaint.analysis&&<AnalysisCard analysis={complaint.analysis} loading={false}/>}
            <div style={{fontSize:12,color:C.text3}}>📍 {complaint.lat?`${complaint.lat.toFixed(5)}, ${complaint.lng.toFixed(5)}`:complaint.address||"N/A"}</div>
            <StatusRail status={complaint.status}/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={handleAdvance} className="btn-ghost" style={{flex:1,fontSize:12,padding:"9px 0"}}>Advance Status →</button>
              <button onClick={()=>setShowShare(true)} style={{flex:1,background:C.surface2,border:`1.5px solid ${C.border}`,color:C.text2,borderRadius:12,padding:"9px 0",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .15s",display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.borderH;e.currentTarget.style.color=C.terra;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.text2;}}>📤 Share</button>
            </div>
          </div>
        )}
      </div>
      {showShare&&<ShareModal complaint={complaint} onClose={()=>setShowShare(false)}/>}
    </>
  );
}

/* ── HEATMAP ────────────────────────────────── */
function HeatmapView({complaints}){
  const {C}=useTheme();
  const mapElRef=useRef(null),mapRef=useRef(null),markersRef=useRef([]),heatRef=useRef(null),initedRef=useRef(false);
  const [lfReady,setLfReady]=useState(!!window.L);
  const [mode,setMode]=useState("heat");

  useEffect(()=>{
    if(window.L){setLfReady(true);return;}
    if(!document.getElementById("lf-css")){const l=document.createElement("link");l.id="lf-css";l.rel="stylesheet";l.href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";document.head.appendChild(l);}
    if(!document.getElementById("lf-js")){const s=document.createElement("script");s.id="lf-js";s.src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";s.onload=()=>{window.L.Icon.Default.imagePath="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/";setLfReady(true);};document.head.appendChild(s);}
  },[]);

  useEffect(()=>{
    if(!lfReady||!mapElRef.current||initedRef.current)return;
    initedRef.current=true;
    const L=window.L;
    const map=L.map(mapElRef.current,{zoomControl:false,preferCanvas:true}).setView([19.076,72.877],12);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'© OpenStreetMap',maxZoom:19,crossOrigin:true}).addTo(map);
    L.control.zoom({position:"bottomright"}).addTo(map);
    mapRef.current=map;
    setTimeout(()=>map.invalidateSize(),200);
  },[lfReady]);

  useEffect(()=>{
    if(!mapRef.current||!window.L)return;
    const L=window.L,map=mapRef.current;
    markersRef.current.forEach(m=>m.remove());markersRef.current=[];
    if(heatRef.current){heatRef.current.remove();heatRef.current=null;}
    const pts=[...FACILITIES.map(f=>({lat:f.lat,lng:f.lng,type:"facility",label:f.name})),...complaints.filter(c=>c.lat).map(c=>({lat:c.lat,lng:c.lng,type:"complaint",label:c.analysis?.wasteType||"Waste Report",status:c.status,hazard:c.analysis?.hazardLevel}))];
    if(mode==="heat"){
      const overlay=L.imageOverlay("",map.getBounds(),{opacity:.7});
      const canvas=document.createElement("canvas");
      canvas.width=600;canvas.height=400;
      const ctx2=canvas.getContext("2d");
      const bounds=map.getBounds();
      const toXY=(lat,lng)=>{
        const x=((lng-bounds.getWest())/(bounds.getEast()-bounds.getWest()))*600;
        const y=((bounds.getNorth()-lat)/(bounds.getNorth()-bounds.getSouth()))*400;
        return[x,y];
      };
      complaints.filter(c=>c.lat).forEach(c=>{
        const [x,y]=toXY(c.lat,c.lng);
        const intensity=c.analysis?.hazardLevel==="High"?80:c.analysis?.hazardLevel==="Medium"?55:38;
        const color=c.analysis?.hazardLevel==="High"?"255,80,50":c.analysis?.hazardLevel==="Medium"?"220,160,0":"100,160,100";
        const g=ctx2.createRadialGradient(x,y,0,x,y,intensity);
        g.addColorStop(0,`rgba(${color},.55)`);g.addColorStop(.4,`rgba(${color},.25)`);g.addColorStop(1,`rgba(${color},0)`);
        ctx2.fillStyle=g;ctx2.fillRect(0,0,600,400);
      });
      FACILITIES.forEach(f=>{
        const [x,y]=toXY(f.lat,f.lng);
        ctx2.fillStyle="rgba(193,98,63,.7)";ctx2.beginPath();ctx2.arc(x,y,5,0,Math.PI*2);ctx2.fill();
        ctx2.strokeStyle="#fff";ctx2.lineWidth=1.5;ctx2.stroke();
      });
      overlay.setUrl(canvas.toDataURL());overlay.setBounds(map.getBounds());overlay.addTo(map);
      heatRef.current=overlay;
      complaints.filter(c=>c.lat).forEach(c=>{
        const col=c.analysis?.hazardLevel==="High"?"#E05252":c.analysis?.hazardLevel==="Medium"?"#D4A017":"#6BAF6E";
        const m=L.circleMarker([c.lat,c.lng],{radius:7,fillColor:col,fillOpacity:.9,color:"#fff",weight:2}).addTo(map);
        m.bindPopup(`<div style="font-family:DM Sans,sans-serif;min-width:160px"><div style="font-weight:700;font-size:13px;color:#2C1F0E;margin-bottom:4px">${c.analysis?.wasteType||"Waste Report"}</div><div style="font-size:11px;color:#6B5744">${c.address||""}</div><div style="font-size:11px;margin-top:4px;color:${col};font-weight:700">${c.status}</div></div>`);
        markersRef.current.push(m);
      });
    } else {
      pts.forEach(p=>{
        const isFac=p.type==="facility";
        const col=isFac?"#C1623F":p.hazard==="High"?"#C0392B":p.hazard==="Medium"?"#B8860B":"#6B8C6E";
        const m=L.circleMarker([p.lat,p.lng],{radius:isFac?9:7,fillColor:col,fillOpacity:.85,color:"#fff",weight:2}).addTo(map);
        m.bindPopup(`<div style="font-family:DM Sans,sans-serif;min-width:150px"><div style="font-weight:700;font-size:13px;color:#2C1F0E">${p.label}</div>${p.status?`<div style="font-size:11px;color:${col};font-weight:700;margin-top:4px">${p.status}</div>`:""}</div>`);
        markersRef.current.push(m);
      });
    }
  },[lfReady,complaints,mode]);

  const hazardCounts={High:complaints.filter(c=>c.analysis?.hazardLevel==="High").length,Medium:complaints.filter(c=>c.analysis?.hazardLevel==="Medium").length,Low:complaints.filter(c=>c.analysis?.hazardLevel==="Low"||(!c.analysis?.hazardLevel&&c.lat)).length};
  const resolved=complaints.filter(c=>c.status==="Resolved").length;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8}}>
        {[{l:"Total",v:complaints.length,c:C.terra,e:"🗂"},{l:"High Risk",v:hazardCounts.High,c:C.red,e:"⚠️"},{l:"Medium",v:hazardCounts.Medium,c:C.amber,e:"🟡"},{l:"Resolved",v:resolved,c:C.moss,e:"✅"}].map(s=>(
          <div key={s.l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:13,padding:"11px 8px",textAlign:"center",boxShadow:`0 1px 4px ${C.shadow}`}}>
            <div style={{fontSize:18,marginBottom:4}}>{s.e}</div>
            <div style={{fontSize:18,fontWeight:900,color:s.c,lineHeight:1}}>{s.v}</div>
            <div style={{fontSize:9,color:C.text3,marginTop:3,letterSpacing:.5,textTransform:"uppercase"}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",background:C.bgDeep,borderRadius:12,padding:4,gap:4}}>
        {[["heat","🌡 Heatmap"],["pins","📍 Pins"]].map(([k,l])=>(
          <button key={k} onClick={()=>setMode(k)} style={{flex:1,padding:"9px 0",border:"none",borderRadius:9,fontSize:13,fontWeight:700,cursor:"pointer",transition:"all .2s",background:mode===k?C.surface:"transparent",color:mode===k?C.terra:C.text3,boxShadow:mode===k?`0 1px 6px ${C.shadow}`:"none"}}>
            {l}
          </button>
        ))}
      </div>
      <div style={{borderRadius:18,overflow:"hidden",border:`1.5px solid ${C.border}`,boxShadow:`0 4px 24px ${C.shadow}`}}>
        <div ref={mapElRef} style={{width:"100%",height:360}}/>
        {!lfReady&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:40,color:C.text3,gap:10}}><span style={{width:22,height:22,border:`3px solid ${C.border}`,borderTopColor:C.terra,borderRadius:"50%",display:"block",animation:"spin .9s linear infinite"}}/>Loading map…</div>}
      </div>
      <div className="card" style={{display:"flex",gap:16,flexWrap:"wrap",justifyContent:"center",padding:"12px 16px"}}>
        <div style={{fontSize:10,fontWeight:700,color:C.text3,letterSpacing:1.2,textTransform:"uppercase",width:"100%",marginBottom:2}}>Legend</div>
        {[{color:"#E05252",label:"High Hazard"},{color:"#D4A017",label:"Medium Hazard"},{color:"#6BAF6E",label:"Low Hazard"},{color:"#C1623F",label:"Facility"}].map(l=>(
          <div key={l.label} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:C.text2,fontWeight:600}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:l.color,border:"1.5px solid rgba(255,255,255,.5)",boxShadow:`0 0 6px ${l.color}66`}}/>
            {l.label}
          </div>
        ))}
      </div>
      {complaints.length===0&&(
        <div style={{textAlign:"center",padding:"24px 0",color:C.text3}}>
          <div style={{fontSize:40,marginBottom:8,opacity:.35}}>🗺</div>
          <div style={{fontSize:13,fontWeight:600,color:C.text2,marginBottom:4}}>No reports on the map yet</div>
          <div style={{fontSize:12}}>Submit complaints to see the community heatmap</div>
        </div>
      )}
    </div>
  );
}

/* ── FACILITY MAP ───────────────────────────── */
function FacilityMap({userLocation,defaultFilter}){
  const {C}=useTheme();
  const mapElRef=useRef(null),mapRef=useRef(null),markersRef=useRef({}),uMarkerRef=useRef(null),uCircleRef=useRef(null),routeRef=useRef(null),initedRef=useRef(false);
  const [lfReady,setLfReady]=useState(!!window.L);
  const [filter,setFilter]=useState(defaultFilter||"all");
  const [sel,setSel]=useState(null);
  const [uPos,setUPos]=useState(userLocation||null);
  const [locating,setLocating]=useState(false);
  const [tall,setTall]=useState(false);
  const [search,setSearch]=useState("");
  const [dirModal,setDirModal]=useState(null);
  const [dirAddr,setDirAddr]=useState("");
  const [dirLoc,setDirLoc]=useState(false);

  useEffect(()=>{
    if(window.L){setLfReady(true);return;}
    if(!document.getElementById("lf-css")){const l=document.createElement("link");l.id="lf-css";l.rel="stylesheet";l.href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";document.head.appendChild(l);}
    if(!document.getElementById("lf-js")){const s=document.createElement("script");s.id="lf-js";s.src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";s.onload=()=>{window.L.Icon.Default.imagePath="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/";setLfReady(true);};document.head.appendChild(s);}
  },[]);

  useEffect(()=>{
    const css=buildCSS(C);
    const el=document.getElementById("lf-extra");
    if(el)el.textContent=css;else{const st=document.createElement("style");st.id="lf-extra";st.textContent=css;document.head.appendChild(st);}
  },[C]);

  useEffect(()=>{
    if(!lfReady||!mapElRef.current||initedRef.current)return;
    initedRef.current=true;
    const L=window.L,center=uPos?[uPos.lat,uPos.lng]:[19.076,72.877];
    const map=L.map(mapElRef.current,{zoomControl:false,preferCanvas:true}).setView(center,12);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'© OpenStreetMap',maxZoom:19,crossOrigin:true}).addTo(map);
    L.control.zoom({position:"bottomright"}).addTo(map);
    mapRef.current=map;setTimeout(()=>map.invalidateSize(),200);
    if(uPos)_placeUser(map,uPos);_syncPins(map,filter,null);map.on("click",()=>setSel(null));
  },[lfReady]);

  useEffect(()=>{if(!mapRef.current)return;setTimeout(()=>mapRef.current.invalidateSize(),320);},[tall]);
  useEffect(()=>{if(!mapRef.current)return;_syncPins(mapRef.current,filter,sel);},[filter]);
  useEffect(()=>{
    if(!mapRef.current||!window.L)return;
    Object.entries(markersRef.current).forEach(([id,m])=>{const f=FACILITIES.find(x=>String(x.id)===String(id));if(!f)return;const ft=FACILITY_TYPES.find(t=>t.type===f.type)||{color:C.terra,icon:"🏭"};m.setIcon(_pinIcon(ft.color,ft.icon,sel?.id===f.id));});
  },[sel]);
  useEffect(()=>{if(!userLocation)return;setUPos(userLocation);if(mapRef.current){_placeUser(mapRef.current,userLocation);mapRef.current.flyTo([userLocation.lat,userLocation.lng],13,{duration:.8});}},[userLocation]);

  function _pinIcon(color,emoji,active){
    const sz=active?42:34,ht=active?54:44;
    return window.L.divIcon({className:"",iconSize:[sz,ht],iconAnchor:[sz/2,ht],popupAnchor:[0,-(ht+4)],
      html:`<div style="width:${sz}px;height:${ht}px;position:relative;filter:drop-shadow(0 ${active?5:2}px ${active?12:6}px rgba(0,0,0,.3))"><svg viewBox="0 0 36 46" width="${sz}" height="${ht}" fill="none"><path d="M18 0C8.06 0 0 8.06 0 18c0 14 18 28 18 28S36 32 36 18C36 8.06 27.94 0 18 0z" fill="${color}" opacity="${active?1:.9}"/><circle cx="18" cy="18" r="${active?11:9}" fill="rgba(255,255,255,.3)"/>${active?'<circle cx="18" cy="18" r="5" fill="rgba(255,255,255,.7)"/>':""}
      </svg><span style="position:absolute;top:${active?9:7}px;left:50%;transform:translateX(-50%);font-size:${active?16:13}px;line-height:1">${emoji}</span></div>`
    });
  }
  function _userIcon(){return window.L.divIcon({className:"",iconSize:[22,22],iconAnchor:[11,11],html:`<div class="u-pulse" style="position:relative;width:22px;height:22px"><div style="width:22px;height:22px;background:${C.terraG};border:2.5px solid #fff;border-radius:50%;box-shadow:0 0 0 3px ${C.glow},0 2px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center"><div style="width:5px;height:5px;background:#fff;border-radius:50%"></div></div></div>`});}
  function _placeUser(map,pos){
    if(uMarkerRef.current)uMarkerRef.current.remove();if(uCircleRef.current)uCircleRef.current.remove();
    uMarkerRef.current=window.L.marker([pos.lat,pos.lng],{icon:_userIcon(),zIndexOffset:3000}).addTo(map);
    uCircleRef.current=window.L.circle([pos.lat,pos.lng],{radius:800,color:C.terra,fillColor:C.terra,fillOpacity:.05,weight:1.5,dashArray:"5,5"}).addTo(map);
  }
  function _syncPins(map,ft,activeSel){
    Object.values(markersRef.current).forEach(m=>m.remove());markersRef.current={};
    const show=ft==="all"?FACILITIES:FACILITIES.filter(f=>f.type===ft);
    show.forEach(f=>{const t=FACILITY_TYPES.find(t=>t.type===f.type)||{color:C.terra,icon:"🏭"};const marker=window.L.marker([f.lat,f.lng],{icon:_pinIcon(t.color,t.icon,activeSel?.id===f.id),zIndexOffset:activeSel?.id===f.id?1000:0}).addTo(map);marker.on("click",e=>{window.L.DomEvent.stopPropagation(e);setSel(prev=>{const next=prev?.id===f.id?null:f;if(next)map.flyTo([f.lat,f.lng],15,{duration:.7});return next;});});markersRef.current[f.id]=marker;});
  }

  const locate=()=>{setLocating(true);navigator.geolocation.getCurrentPosition(p=>{const pos={lat:p.coords.latitude,lng:p.coords.longitude};setUPos(pos);if(mapRef.current){_placeUser(mapRef.current,pos);mapRef.current.flyTo([pos.lat,pos.lng],14,{duration:.9});}setLocating(false);},()=>setLocating(false),{enableHighAccuracy:true,timeout:8000});};
  const fitAll=()=>{if(!mapRef.current||!window.L)return;const pts=displayList.map(f=>[f.lat,f.lng]);if(pts.length)mapRef.current.flyToBounds(window.L.latLngBounds(pts),{padding:[44,44],duration:.8,maxZoom:14});};

  const baseList=(filter==="all"?FACILITIES:FACILITIES.filter(f=>f.type===filter)).map(f=>({...f,dist:uPos?Number(km(uPos,{lat:f.lat,lng:f.lng})):null,open:isOpenNow(f.hours)})).sort((a,b)=>(a.dist??999)-(b.dist??999));
  const displayList=search.trim()?baseList.filter(f=>f.name.toLowerCase().includes(search.toLowerCase())||f.type.toLowerCase().includes(search.toLowerCase())):baseList;
  const selFt=sel?FACILITY_TYPES.find(t=>t.type===sel.type)||{color:C.terra,icon:"🏭"}:null;
  const selOpen=sel?isOpenNow(sel.hours):null;
  const ov={position:"absolute",zIndex:1000,background:`${C.surface}ee`,backdropFilter:"blur(8px)",border:`1px solid ${C.border}`,borderRadius:10,fontSize:11,fontWeight:700,cursor:"pointer",transition:"color .15s"};

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{position:"relative"}}>
        <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:14,pointerEvents:"none",opacity:.4}}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search facilities…" style={{width:"100%",background:C.surface,border:`1.5px solid ${search?C.borderH:C.border}`,borderRadius:13,padding:"11px 14px 11px 38px",fontSize:13,color:C.text,outline:"none",boxSizing:"border-box",transition:"border-color .2s",fontFamily:"inherit"}} onFocus={e=>e.target.style.borderColor=C.borderH} onBlur={e=>{if(!search)e.target.style.borderColor=C.border;}}/>
        {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.text3,cursor:"pointer",fontSize:15,padding:2}}>✕</button>}
      </div>
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2,scrollbarWidth:"none"}}>
        {[{type:"all",icon:"🗺️",color:C.terra},...FACILITY_TYPES].map(ft=>{const active=filter===ft.type;const cnt=ft.type==="all"?FACILITIES.length:FACILITIES.filter(f=>f.type===ft.type).length;return(<button key={ft.type} onClick={()=>{setFilter(ft.type);setSel(null);}} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"7px 12px",borderRadius:20,fontSize:12,fontWeight:700,border:`1.5px solid ${active?ft.color:C.border}`,background:active?`${ft.color}14`:C.surface,color:active?ft.color:C.text3,cursor:"pointer",transition:"all .15s",whiteSpace:"nowrap",flexShrink:0}}>{ft.icon}&nbsp;{ft.type==="all"?"All":ft.type.split(" ")[0]}<span style={{background:active?`${ft.color}20`:C.bgDeep,borderRadius:10,padding:"1px 6px",fontSize:10,fontWeight:800}}>{cnt}</span></button>);})}
      </div>
      <div style={{borderRadius:20,overflow:"hidden",border:`1.5px solid ${C.border}`,position:"relative",boxShadow:`0 4px 24px ${C.shadow}`}}>
        <div ref={mapElRef} style={{width:"100%",height:tall?520:360,display:"block"}}/>
        {!lfReady&&<div style={{position:"absolute",inset:0,background:C.bgDeep,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,zIndex:10}}><span style={{width:28,height:28,border:`3px solid ${C.border}`,borderTopColor:C.terra,borderRadius:"50%",display:"block",animation:"spin .9s linear infinite"}}/><div style={{fontSize:12,color:C.text3,fontWeight:600}}>Loading map…</div></div>}
        <div style={{...ov,top:12,left:12,padding:"6px 11px",pointerEvents:"none",display:"flex",alignItems:"center",gap:6,cursor:"default"}}><span style={{width:6,height:6,borderRadius:"50%",background:C.terra,display:"block"}}/>{displayList.length} facilit{displayList.length===1?"y":"ies"}</div>
        <button onClick={fitAll} style={{...ov,top:12,right:12,padding:"6px 10px",color:C.text2}} onMouseEnter={e=>e.currentTarget.style.color=C.terra} onMouseLeave={e=>e.currentTarget.style.color=C.text2}>⊞ Fit All</button>
        <button onClick={locate} disabled={locating} style={{position:"absolute",bottom:52,right:12,zIndex:1000,width:38,height:38,borderRadius:"50%",background:uPos?C.moss:locating?`${C.terra}88`:C.terraG,border:"2px solid rgba(255,255,255,.5)",color:"#fff",fontSize:16,cursor:locating?"wait":"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 2px 12px ${C.shadow}`,transition:"all .3s"}}>
          {locating?<span style={{width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",display:"block",animation:"spin .7s linear infinite"}}/>:uPos?"✅":"📍"}
        </button>
        <button onClick={()=>setTall(t=>!t)} style={{...ov,bottom:52,left:12,padding:"7px 10px",color:C.text2}} onMouseEnter={e=>e.currentTarget.style.color=C.terra} onMouseLeave={e=>e.currentTarget.style.color=C.text2}>{tall?"⤡ Compact":"⤢ Expand"}</button>
      </div>
      {sel&&selFt&&(
        <div className="fadeUp" style={{borderRadius:18,overflow:"hidden",border:`1.5px solid ${selFt.color}44`,background:C.surface,boxShadow:`0 4px 20px ${C.shadow}`}}>
          <div style={{height:3,background:`linear-gradient(90deg,${selFt.color},${selFt.color}55,transparent)`}}/>
          <div style={{padding:"16px 18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div style={{display:"flex",gap:12,alignItems:"center",flex:1,minWidth:0}}>
                <div style={{width:46,height:46,borderRadius:14,background:`${selFt.color}14`,border:`1px solid ${selFt.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{selFt.icon}</div>
                <div style={{minWidth:0}}><div style={{fontWeight:800,fontSize:14,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sel.name}</div><div style={{fontSize:12,color:C.text2,marginTop:2}}>{sel.address}</div></div>
              </div>
              <button onClick={()=>setSel(null)} style={{background:C.bgDeep,border:"none",color:C.text3,borderRadius:8,width:28,height:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,marginLeft:10}}>✕</button>
            </div>
            <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:14}}>
              {uPos&&<div style={{background:`${selFt.color}10`,border:`1px solid ${selFt.color}30`,borderRadius:9,padding:"5px 11px",fontSize:12,fontWeight:700,color:selFt.color}}>📍 {km(uPos,{lat:sel.lat,lng:sel.lng})} km</div>}
              <div style={{background:selOpen===true?`${C.moss}14`:selOpen===false?`${C.red}0d`:`${C.amber}14`,border:`1px solid ${selOpen===true?C.moss:selOpen===false?C.red:C.amber}33`,borderRadius:9,padding:"5px 11px",fontSize:12,fontWeight:700,color:selOpen===true?C.moss:selOpen===false?C.red:C.amber,display:"flex",alignItems:"center",gap:5}}>
                <span style={{width:5,height:5,borderRadius:"50%",background:selOpen===true?C.moss:selOpen===false?C.red:C.amber,display:"block"}}/>{selOpen===true?"Open Now":selOpen===false?"Closed Now":"Hours Vary"}
              </div>
            </div>
            <div style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",marginBottom:14,display:"flex",flexDirection:"column",gap:9}}>
              {[{icon:"🕐",label:"Hours",val:sel.hours,href:null},{icon:"📞",label:"Phone",val:sel.phone,href:`tel:${sel.phone}`}].map(({icon,label,val,href},i)=>(
                <div key={label}>{i>0&&<div style={{height:1,background:C.border,marginBottom:9}}/>}<div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:28,height:28,borderRadius:8,background:C.bgDeep,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{icon}</div><div><div style={{fontSize:9,color:C.text3,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:2}}>{label}</div>{href?<a href={href} style={{color:selFt.color,fontWeight:700,textDecoration:"none",fontSize:13}}>{val}</a>:<div style={{fontSize:13,color:C.text,fontWeight:600}}>{val}</div>}</div></div></div>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{setDirModal(sel);setDirAddr(uPos?`${uPos.lat.toFixed(5)},${uPos.lng.toFixed(5)}`:"");}} style={{flex:2,background:`linear-gradient(135deg,${selFt.color}cc,${selFt.color})`,color:"#fff",border:"none",borderRadius:12,padding:"12px 0",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>🧭 Get Directions</button>
              <a href={`https://www.openstreetmap.org/?mlat=${sel.lat}&mlon=${sel.lng}&zoom=16`} target="_blank" rel="noopener noreferrer" style={{flex:1,background:C.surface2,border:`1px solid ${C.border}`,color:C.text2,borderRadius:12,padding:"11px 0",fontSize:13,fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>🗺 OSM</a>
            </div>
          </div>
        </div>
      )}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:10,fontWeight:700,color:C.text3,letterSpacing:1.5,textTransform:"uppercase"}}>{uPos?"Nearest first":"All"} · {displayList.length}</div>{search&&<div style={{fontSize:11,color:C.terra,fontWeight:700}}>"{search}"</div>}</div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {displayList.length===0?<div style={{textAlign:"center",padding:"32px 0",color:C.text3}}><div style={{fontSize:36,marginBottom:8,opacity:.3}}>🏭</div><div style={{fontSize:13}}>No facilities match.</div></div>
          :displayList.map((f,idx)=>{const ft=FACILITY_TYPES.find(t=>t.type===f.type)||{color:C.terra,icon:"🏭"};const isSel=sel?.id===f.id;return(
            <div key={f.id} onClick={()=>{setSel(isSel?null:f);if(mapRef.current&&!isSel)mapRef.current.flyTo([f.lat,f.lng],15,{duration:.7});}} style={{background:isSel?`${ft.color}08`:C.surface,border:`1.5px solid ${isSel?ft.color:C.border}`,borderRadius:15,padding:"13px 15px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:isSel?`0 0 0 3px ${ft.color}12,0 2px 12px ${C.shadow}`:`0 1px 4px ${C.shadow}`,transition:"all .2s",animation:`fadeUp .3s ease ${idx*.04}s both`}} onMouseEnter={e=>{if(!isSel){e.currentTarget.style.borderColor=C.borderH;e.currentTarget.style.boxShadow=`0 2px 12px ${C.shadowMd}`;} }} onMouseLeave={e=>{if(!isSel){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow=`0 1px 4px ${C.shadow}`;}}}>
              <div style={{display:"flex",gap:12,alignItems:"center",flex:1,minWidth:0}}>
                <div style={{width:38,height:38,borderRadius:11,background:`${ft.color}12`,border:`1px solid ${ft.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{ft.icon}</div>
                <div style={{minWidth:0}}><div style={{fontWeight:700,fontSize:13,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</div><div style={{display:"flex",alignItems:"center",gap:7,marginTop:3}}><span style={{fontSize:10,color:C.text3}}>{f.hours}</span>{f.open!==null&&<span style={{fontSize:10,fontWeight:700,color:f.open?C.moss:C.red,display:"flex",alignItems:"center",gap:3}}><span style={{width:4,height:4,borderRadius:"50%",background:f.open?C.moss:C.red,display:"block"}}/>{f.open?"Open":"Closed"}</span>}</div></div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,flexShrink:0,marginLeft:10}}>{f.dist!=null&&<div style={{background:`${ft.color}12`,color:ft.color,borderRadius:7,padding:"3px 9px",fontSize:12,fontWeight:700}}>{f.dist} km</div>}<div style={{fontSize:10,color:C.text3,fontWeight:600}}>{ft.type.split(" ")[0]}</div></div>
            </div>
          );})}
      </div>
      {dirModal&&(()=>{
        const ft=FACILITY_TYPES.find(t=>t.type===dirModal.type)||{color:C.terra,icon:"🏭"};
        const getGPS=()=>{setDirLoc(true);navigator.geolocation.getCurrentPosition(p=>{const pos={lat:p.coords.latitude,lng:p.coords.longitude};setUPos(pos);setDirAddr(`${pos.lat.toFixed(5)},${pos.lng.toFixed(5)}`);if(mapRef.current)_placeUser(mapRef.current,pos);setDirLoc(false);},()=>setDirLoc(false),{enableHighAccuracy:true,timeout:8000});};
        const go=()=>{
          if(!dirAddr.trim())return;
          const dest=encodeURIComponent(`${dirModal.name}, ${dirModal.address}`);
          window.open(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(dirAddr.trim())}&destination=${dest}&travelmode=driving`,"_blank","noopener,noreferrer");
          if(mapRef.current&&window.L){const pts=dirAddr.trim().split(",");if(pts.length===2&&!isNaN(pts[0])&&!isNaN(pts[1])){if(routeRef.current)routeRef.current.remove();routeRef.current=window.L.polyline([[+pts[0],+pts[1]],[dirModal.lat,dirModal.lng]],{color:ft.color,weight:3,opacity:.7,dashArray:"8,6"}).addTo(mapRef.current);mapRef.current.flyToBounds(routeRef.current.getBounds(),{padding:[44,44],duration:.9});}}
          setDirModal(null);
        };
        return(
          <div style={{position:"fixed",inset:0,zIndex:9999,display:"flex",alignItems:"flex-end",justifyContent:"center",background:"rgba(0,0,0,.45)",backdropFilter:"blur(6px)"}} onClick={e=>{if(e.target===e.currentTarget)setDirModal(null);}}>
            <div className="fadeUp" style={{width:"100%",maxWidth:480,background:C.surface,borderRadius:"22px 22px 0 0",boxShadow:`0 -4px 40px ${C.shadowMd}`,border:`1px solid ${C.border}`,maxHeight:"90vh",overflowY:"auto"}}>
              <div style={{height:3,background:`linear-gradient(90deg,${ft.color},${ft.color}55,transparent)`,borderRadius:"22px 22px 0 0"}}/>
              <div style={{display:"flex",justifyContent:"center",padding:"10px 0 0"}}><div style={{width:36,height:4,borderRadius:2,background:C.border}}/></div>
              <div style={{padding:"12px 20px 32px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                  <div style={{display:"flex",gap:12,alignItems:"center",flex:1,minWidth:0}}>
                    <div style={{width:44,height:44,borderRadius:13,background:`${ft.color}12`,border:`1px solid ${ft.color}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{ft.icon}</div>
                    <div style={{minWidth:0}}><div style={{fontSize:10,color:C.terra,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",marginBottom:2}}>Directions to</div><div style={{fontWeight:800,fontSize:14,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{dirModal.name}</div></div>
                  </div>
                  <button onClick={()=>setDirModal(null)} style={{background:C.bgDeep,border:"none",color:C.text3,borderRadius:8,width:30,height:30,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,marginLeft:10}}>✕</button>
                </div>
                <button onClick={getGPS} disabled={dirLoc} style={{width:"100%",background:uPos?`${C.moss}12`:C.terraG,color:uPos?C.moss:"#fff",border:uPos?`1.5px solid ${C.moss}33`:"none",borderRadius:11,padding:"12px 0",fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .2s"}}>
                  {dirLoc?<><span style={{width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",display:"block",animation:"spin .7s linear infinite"}}/> Detecting…</>:uPos?`✅ GPS locked`:<>📍 Use My GPS Location</>}
                </button>
                <div style={{display:"flex",alignItems:"center",gap:10,margin:"0 0 10px"}}><div style={{flex:1,height:1,background:C.border}}/><span style={{fontSize:11,color:C.text3,fontWeight:600}}>or type an address</span><div style={{flex:1,height:1,background:C.border}}/></div>
                <input value={dirAddr} onChange={e=>setDirAddr(e.target.value)} placeholder="Address or lat,lng…" onKeyDown={e=>e.key==="Enter"&&go()} style={{width:"100%",background:C.surface2,border:`1.5px solid ${dirAddr?C.borderH:C.border}`,borderRadius:11,padding:"12px 14px",fontSize:13,color:C.text,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginBottom:13,transition:"border-color .2s"}}/>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={go} disabled={!dirAddr.trim()} style={{flex:1,background:dirAddr.trim()?C.terraG:`${C.text}0a`,border:"none",borderRadius:12,padding:"13px 0",fontSize:14,fontWeight:700,color:dirAddr.trim()?"#fff":C.text3,cursor:dirAddr.trim()?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .2s"}}>🧭 Open in Google Maps</button>
                  <button onClick={()=>setDirModal(null)} style={{background:C.bgDeep,border:`1px solid ${C.border}`,color:C.text2,borderRadius:12,padding:"13px 15px",fontSize:13,fontWeight:700,cursor:"pointer"}}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ── CARBON TRACKER ─────────────────────────── */
function CarbonTracker(){
  const {C}=useTheme();
  const [entries,setEntries]=useState([{id:0,wasteId:"plastic",kg:10,co2Saved:25,date:"Demo"}]);
  const [ct,setCt]=useState("dash");const [type,setType]=useState("plastic");const [kg,setKg]=useState("");const [flash,setFlash]=useState(false);
  const total=Math.max(0,entries.reduce((s,e)=>s+(Number(e.co2Saved)||0),0));
  const totalKg=Math.max(0,entries.reduce((s,e)=>s+(Number(e.kg)||0),0));
  const trees=total/CO2_TREE;const lvl=ecoLevel(total,C);const pct=lvl.next===Infinity?100:Math.min((total/lvl.next)*100,100);const anim=useCountUp(total);const wt=WASTE_TYPES.find(w=>w.id===type)||WASTE_TYPES[0];
  const add=()=>{const k=parseFloat(kg);if(!k||k<=0)return;setEntries(p=>[{id:Date.now(),wasteId:type,kg:k,co2Saved:k*wt.co2,date:new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short"})},...p]);setKg("");setFlash(true);setTimeout(()=>setFlash(false),2200);setCt("dash");};
  const eqv=[{icon:"🚗",label:"km not driven",val:(total/CO2_KM).toFixed(0),color:C.terra},{icon:"📱",label:"phone charges",val:Math.round(total/CO2_PHONE).toLocaleString(),color:C.sand},{icon:"🚿",label:"showers offset",val:(total/CO2_SHOWER).toFixed(1),color:C.sage},{icon:"🌳",label:"trees equiv.",val:trees.toFixed(2),color:C.moss}];
  return(
    <div style={{borderRadius:22,overflow:"hidden",border:`1px solid ${C.border}`,background:C.surface,boxShadow:`0 2px 16px ${C.shadow}`}}>
      <div style={{padding:"20px 20px 0",borderBottom:`1px solid ${C.border}`,background:C.surface2}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div><div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,color:C.terra,textTransform:"uppercase",marginBottom:4}}>Carbon Impact</div><div style={{fontSize:20,fontWeight:800,color:C.text,letterSpacing:-.5}}>🌿 Eco Tracker</div><div style={{fontSize:12,color:C.text3,marginTop:2}}>Every kg recycled counts</div></div>
          <div style={{background:`${lvl.color}14`,border:`1px solid ${lvl.color}30`,borderRadius:14,padding:"9px 12px",textAlign:"center"}}><div style={{fontSize:22,lineHeight:1}}>{lvl.icon}</div><div style={{fontSize:9,fontWeight:800,color:lvl.color,letterSpacing:1,marginTop:3,textTransform:"uppercase"}}>{lvl.label}</div></div>
        </div>
        {lvl.next!==Infinity&&<div style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.text3,marginBottom:5}}><span>{total.toFixed(1)} kg CO₂</span><span>→ {lvl.next}kg · {ecoLevel(lvl.next,C).label}</span></div><div style={{background:C.bgDeep,borderRadius:4,height:5,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:C.terraG,borderRadius:4,transition:"width 1.2s cubic-bezier(.34,1.56,.64,1)"}}/></div></div>}
        <div style={{display:"flex"}}>{[["dash","📊 Impact"],["log","➕ Log"],["hist","📋 History"]].map(([k,l])=><button key={k} onClick={()=>setCt(k)} className={`tab-btn${ct===k?" active":""}`} style={{fontSize:11}}>{l}</button>)}</div>
      </div>
      <div style={{padding:16}}>
        {ct==="dash"&&<div style={{display:"flex",flexDirection:"column",gap:14}}>
          {flash&&<div className="slideDown" style={{background:`${C.moss}14`,border:`1px solid ${C.moss}33`,borderRadius:12,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:18}}>✅</span><span style={{fontSize:13,fontWeight:700,color:C.moss}}>Added! Your forest is growing.</span></div>}
          <div style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:18,padding:22,textAlign:"center"}}><div style={{fontSize:10,color:C.text3,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>CO₂ Prevented</div><div style={{fontSize:52,fontWeight:900,color:C.terra,lineHeight:1,letterSpacing:-2}}>{Number(anim).toFixed(1)}</div><div style={{fontSize:13,color:C.text3,marginTop:2}}>kilograms</div><div style={{marginTop:7,fontSize:12,color:C.text3}}>from <span style={{color:C.text,fontWeight:700}}>{totalKg.toFixed(1)} kg</span> recycled</div></div>
          <div className="card"><div style={{fontSize:10,fontWeight:700,color:C.text3,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12}}>Impact Chain</div><div style={{display:"flex",alignItems:"center"}}>{[{val:`${totalKg.toFixed(1)}kg`,label:"Recycled",color:C.terra,icon:"♻️"},{val:`${total.toFixed(1)}kg`,label:"CO₂ Saved",color:C.sage,icon:"💨"},{val:trees.toFixed(1),label:"Trees",color:C.moss,icon:"🌳"}].map((it,i)=><div key={i} style={{display:"flex",alignItems:"center",flex:1}}><div style={{flex:1,textAlign:"center"}}><div style={{fontSize:20,marginBottom:3}}>{it.icon}</div><div style={{fontSize:15,fontWeight:900,color:it.color,lineHeight:1}}>{it.val}</div><div style={{fontSize:9,color:C.text3,marginTop:3,letterSpacing:.4,textTransform:"uppercase"}}>{it.label}</div></div>{i<2&&<span style={{color:C.border,fontSize:16,flexShrink:0}}>→</span>}</div>)}</div></div>
          <div style={{background:C.surface2,border:`1px solid ${C.sage}22`,borderRadius:18,padding:18}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{fontSize:10,fontWeight:700,color:C.text3,letterSpacing:1.5,textTransform:"uppercase"}}>Your Forest</div><div style={{background:`${C.moss}14`,border:`1px solid ${C.moss}28`,borderRadius:8,padding:"3px 10px",fontSize:12,fontWeight:700,color:C.moss}}>{trees.toFixed(2)} trees</div></div>{trees>0?<div style={{display:"flex",flexWrap:"wrap",gap:3,justifyContent:"center",padding:"4px 0"}}>{Array.from({length:Math.min(Math.max(Math.ceil(trees),1),32)}).map((_,i)=>{const full=Math.floor(trees),op=i<full?1:Math.max(0,Math.min(1,trees-full));return <div key={i} style={{fontSize:20,opacity:op||1,animation:`treePop .4s ease ${i*.04}s both`}}>🌳</div>;})}{Math.ceil(trees)>32&&<span style={{fontSize:11,color:C.moss,fontWeight:700,alignSelf:"center"}}>+{Math.ceil(trees)-32}</span>}</div>:<div style={{textAlign:"center",padding:"10px 0",color:C.text3,fontSize:12}}>Log waste to plant your first tree 🌱</div>}<div style={{fontSize:10,color:C.text3,textAlign:"center",marginTop:8}}>1 tree absorbs ~{CO2_TREE}kg CO₂/year</div></div>
          {total>0&&<div className="card"><div style={{fontSize:10,fontWeight:700,color:C.text3,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12}}>That's Equivalent To…</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{eqv.map(it=><div key={it.label} style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px",display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:22}}>{it.icon}</span><div><div style={{fontSize:16,fontWeight:900,color:it.color,lineHeight:1}}>{it.val}</div><div style={{fontSize:10,color:C.text3,marginTop:3}}>{it.label}</div></div></div>)}</div></div>}
          <button className="btn-primary" onClick={()=>setCt("log")}>➕ Log Recycled Waste</button>
        </div>}
        {ct==="log"&&<div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="card"><div style={{fontSize:10,fontWeight:700,color:C.text3,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12}}>Waste Type</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{WASTE_TYPES.map(w=><button key={w.id} onClick={()=>setType(w.id)} style={{background:type===w.id?`${w.color}0e`:C.surface2,border:`1.5px solid ${type===w.id?w.color:C.border}`,borderRadius:11,padding:"10px 11px",display:"flex",alignItems:"center",gap:9,cursor:"pointer",transition:"all .15s"}}><span style={{fontSize:18}}>{w.icon}</span><div style={{textAlign:"left"}}><div style={{fontSize:12,fontWeight:700,color:type===w.id?w.color:C.text2}}>{w.label}</div><div style={{fontSize:10,color:C.text3,marginTop:1}}>{w.co2}× CO₂/kg</div></div></button>)}</div></div>
          <div className="card"><div style={{fontSize:10,fontWeight:700,color:C.text3,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>Amount (kg)</div><div style={{position:"relative"}}><input type="number" min=".1" step=".1" value={kg} onChange={e=>setKg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="0.0" className="input-field" style={{paddingRight:44,fontSize:22,fontWeight:800,fontFamily:"'DM Mono',monospace"}}/><span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",fontSize:13,color:C.text3,fontWeight:700}}>kg</span></div><div style={{display:"flex",gap:6,marginTop:9,flexWrap:"wrap"}}>{[0.5,1,2,5,10,20].map(v=><button key={v} onClick={()=>setKg(String(v))} style={{background:kg==v?`${wt.color}12`:C.bgDeep,border:`1px solid ${kg==v?wt.color:C.border}`,borderRadius:8,padding:"5px 11px",fontSize:12,fontWeight:700,color:kg==v?wt.color:C.text3,cursor:"pointer",transition:"all .15s"}}>{v}kg</button>)}</div>
          {kg&&parseFloat(kg)>0&&<div className="slideDown" style={{marginTop:11,background:C.surface2,border:`1px solid ${C.border}`,borderRadius:11,padding:"11px 13px"}}><div style={{fontSize:10,color:C.text3,marginBottom:6,letterSpacing:1,textTransform:"uppercase"}}>Preview</div><div style={{display:"flex",justifyContent:"space-around",alignItems:"center"}}>{[{v:`${parseFloat(kg).toFixed(1)}kg`,l:wt.label,c:wt.color},{v:`${(parseFloat(kg)*wt.co2).toFixed(2)}kg`,l:"CO₂ saved",c:C.sage},{v:`${((parseFloat(kg)*wt.co2)/CO2_TREE).toFixed(3)}`,l:"trees",c:C.moss}].map((it,i)=><div key={i} style={{display:"flex",alignItems:"center"}}>{i>0&&<span style={{color:C.border,margin:"0 8px",fontSize:13}}>→</span>}<div style={{textAlign:"center"}}><div style={{fontSize:14,fontWeight:800,color:it.c,lineHeight:1}}>{it.v}</div><div style={{fontSize:9,color:C.text3,marginTop:2}}>{it.l}</div></div></div>)}</div></div>}
          </div>
          <button className="btn-primary" onClick={add} disabled={!kg||parseFloat(kg)<=0} style={{background:kg&&parseFloat(kg)>0?`linear-gradient(135deg,${wt.color}cc,${wt.color})`:`${C.text}0a`,color:kg&&parseFloat(kg)>0?"#fff":C.text3}}>{wt.icon} Add {kg||"0"}kg {wt.label}</button>
        </div>}
        {ct==="hist"&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
          {entries.length===0?<div style={{textAlign:"center",padding:"36px 0",color:C.text3,fontSize:13}}><div style={{fontSize:38,marginBottom:10}}>📋</div>No entries yet.</div>
            :<>{<div style={{display:"flex",justifyContent:"space-between",padding:"0 2px",marginBottom:4}}><span style={{fontSize:10,fontWeight:700,color:C.text3,letterSpacing:1.5,textTransform:"uppercase"}}>{entries.length} entries</span><span style={{fontSize:11,color:C.terra,fontWeight:700}}>{Number(total).toFixed(2)} kg CO₂</span></div>}{entries.map(e=>{const w=WASTE_TYPES.find(x=>x.id===e.wasteId);if(!w)return null;return(<div key={e.id} style={{display:"flex",alignItems:"center",gap:11,background:C.surface2,border:`1px solid ${C.border}`,borderRadius:12,padding:"11px 13px"}}><span style={{fontSize:18}}>{w.icon}</span><div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:C.text}}>{w.label}</div><div style={{fontSize:10,color:C.text3,marginTop:1}}>{e.date}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:12,fontWeight:700,color:w.color}}>{Number(e.kg).toFixed(1)}kg</div><div style={{fontSize:11,color:C.moss}}>−{Number(e.co2Saved).toFixed(2)} CO₂</div></div><button onClick={()=>setEntries(p=>p.filter(x=>x.id!==e.id))} style={{background:"none",border:"none",color:C.text3,cursor:"pointer",fontSize:15,padding:"0 0 0 4px",lineHeight:1,transition:"color .15s"}} onMouseEnter={ev=>ev.target.style.color=C.red} onMouseLeave={ev=>ev.target.style.color=C.text3}>✕</button></div>);})}</>}
        </div>}
      </div>
    </div>
  );
}

/* ── LOGIN ──────────────────────────────────── */
function LoginPage({onLogin,onGuest}){
  const {C}=useTheme();
  const [mode,setMode]=useState("login");const [name,setName]=useState("");const [email,setEmail]=useState(_saved?.email||"");const [pw,setPw]=useState("");const [rem,setRem]=useState(!!_saved);const [showPw,setShowPw]=useState(false);const [err,setErr]=useState("");const [busy,setBusy]=useState(false);
  const UK="et_users";const getU=()=>{try{return JSON.parse(sessionStorage.getItem(UK)||"[]");}catch{return[];}};const setU=u=>{try{sessionStorage.setItem(UK,JSON.stringify(u));}catch{}};
  const go=()=>{setErr("");setBusy(true);setTimeout(()=>{const users=getU();if(mode==="signup"){if(!name.trim()){setErr("Name is required.");setBusy(false);return;}if(!email.includes("@")){setErr("Enter a valid email.");setBusy(false);return;}if(pw.length<6){setErr("Password must be 6+ characters.");setBusy(false);return;}if(users.find(u=>u.email===email)){setErr("Email already exists — sign in.");setBusy(false);return;}const u={name:name.trim(),email,password:pw};setU([...users,u]);if(rem)try{sessionStorage.setItem("et_u",JSON.stringify({email,name:u.name}));}catch{}onLogin(u);}else{const u=users.find(u=>u.email===email&&u.password===pw);if(!u){setErr("Incorrect email or password.");setBusy(false);return;}if(rem)try{sessionStorage.setItem("et_u",JSON.stringify({email,name:u.name}));}catch{}else try{sessionStorage.removeItem("et_u");}catch{}onLogin(u);}setBusy(false);},600);};
  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"}}>
      {[["rgba(193,98,63,.06)","12%","8%","320px"],["rgba(107,140,110,.05)","70%","60%","280px"],["rgba(201,168,122,.07)","30%","75%","200px"]].map(([c,l,t,s],i)=><div key={i} style={{position:"absolute",left:l,top:t,width:s,height:s,borderRadius:"50%",background:`radial-gradient(circle,${c} 0%,transparent 70%)`,pointerEvents:"none"}}/>)}
      <div style={{position:"absolute",top:20,right:20}}><ThemeToggle/></div>
      <div style={{width:"100%",maxWidth:380,position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:40}} className="fadeUp">
          <div style={{width:72,height:72,borderRadius:24,background:C.terraG,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:34,marginBottom:16,boxShadow:`0 8px 32px ${C.glow}`,animation:"softPulse 3s ease-in-out infinite"}}>🌍</div>
          <h1 style={{fontSize:28,fontWeight:800,color:C.text,letterSpacing:-1,marginBottom:5}}>EcoTrace</h1>
          <p style={{fontSize:13,color:C.text3}}>AI waste reporting · Carbon tracking</p>
        </div>
        <div className="fadeUp2" style={{background:C.surface,borderRadius:24,padding:28,boxShadow:`0 4px 40px ${C.shadow}`,border:`1px solid ${C.border}`}}>
          <div style={{display:"flex",background:C.bgDeep,borderRadius:12,padding:4,marginBottom:24,gap:4}}>{["login","signup"].map(m=><button key={m} onClick={()=>{setMode(m);setErr("");}} style={{flex:1,padding:"10px 0",border:"none",borderRadius:9,fontSize:13,fontWeight:700,cursor:"pointer",transition:"all .2s",background:mode===m?C.surface:"transparent",color:mode===m?C.terra:C.text3,boxShadow:mode===m?`0 1px 6px ${C.shadow}`:"none"}}>{m==="login"?"Sign In":"Create Account"}</button>)}</div>
          <div style={{display:"flex",flexDirection:"column",gap:15}}>
            {mode==="signup"&&<div className="fadeUp"><label style={{fontSize:11,fontWeight:700,color:C.text3,letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:7}}>Full Name</label><input className="input-field" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></div>}
            <div><label style={{fontSize:11,fontWeight:700,color:C.text3,letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:7}}>Email</label><input className="input-field" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" onKeyDown={e=>e.key==="Enter"&&go()}/></div>
            <div><label style={{fontSize:11,fontWeight:700,color:C.text3,letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:7}}>Password</label><div style={{position:"relative"}}><input className="input-field" type={showPw?"text":"password"} value={pw} onChange={e=>setPw(e.target.value)} placeholder={mode==="signup"?"Min. 6 characters":"••••••••"} style={{paddingRight:44}} onKeyDown={e=>e.key==="Enter"&&go()}/><button onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:15,color:C.text3,padding:0}}>{showPw?"🙈":"👁"}</button></div></div>
            <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setRem(r=>!r)}><div style={{width:19,height:19,borderRadius:5,border:`1.5px solid ${rem?C.terra:C.border}`,background:rem?C.terra:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",flexShrink:0}}>{rem&&<svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6l2.5 2.5L10 3.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}</div><span style={{fontSize:13,color:C.text2,userSelect:"none"}}>Remember me</span></div>
            {err&&<div className="slideDown" style={{background:`rgba(192,57,43,.08)`,border:`1px solid rgba(192,57,43,.25)`,borderRadius:10,padding:"10px 13px",fontSize:13,color:C.red,display:"flex",alignItems:"center",gap:8}}><span>⚠</span>{err}</div>}
            <button className="btn-primary" onClick={go} disabled={busy} style={{marginTop:4}}>{busy?<span style={{display:"inline-flex",alignItems:"center",gap:8}}><span style={{width:15,height:15,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin .7s linear infinite"}}/>Working…</span>:mode==="login"?"Sign In →":"Create Account →"}</button>
          </div>
        </div>
        <div className="fadeUp3" style={{display:"flex",alignItems:"center",gap:12,margin:"20px 0 0"}}><div style={{flex:1,height:1,background:C.border}}/><span style={{fontSize:12,color:C.text3,fontWeight:600}}>or</span><div style={{flex:1,height:1,background:C.border}}/></div>
        <button onClick={onGuest} className="btn-ghost fadeUp3" style={{width:"100%",marginTop:12,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>👤 Continue as Guest</button>
        <p style={{textAlign:"center",fontSize:11,color:C.text3,marginTop:10}}>Guest data isn't saved across sessions</p>
      </div>
    </div>
  );
}

/* ── ROOT ───────────────────────────────────── */
export default function App(){
  const [dark,setDark]=useState(false);
  const C=dark?DARK:LIGHT;
  const [user,setUser]=useState(_saved?{name:_saved.name,email:_saved.email}:null);
  const styleRef=useRef(null);
  useEffect(()=>{
    const css=buildCSS(C);
    if(!styleRef.current){const el=document.createElement("style");el.id="et-global";document.head.appendChild(el);styleRef.current=el;}
    styleRef.current.textContent=css;document.body.style.background=C.bg;document.body.style.color=C.text;
  },[dark]);
  const ctx={C,dark,toggle:()=>setDark(d=>!d)};
  return(
    <ThemeCtx.Provider value={ctx}>
      <NotifProvider>
        {!user?<LoginPage onLogin={u=>setUser(u)} onGuest={()=>setUser({name:"Guest",email:"",isGuest:true})}/>:<Main user={user} onLogout={()=>{try{sessionStorage.removeItem("et_u");}catch{}_saved=null;setUser(null);}}/>}
      </NotifProvider>
    </ThemeCtx.Provider>
  );
}

/* ── MAIN ───────────────────────────────────── */
function Main({user,onLogout}){
  const {C}=useTheme();
  const [tab,setTab]=useState("report");const [preview,setPreview]=useState(null);const [hasPhoto,setHasPhoto]=useState(false);const [loc,setLoc]=useState(null);const [locLoad,setLocLoad]=useState(false);const [locErr,setLocErr]=useState("");const [addr,setAddr]=useState("");const [desc,setDesc]=useState("");const [complaints,setComplaints]=useState([]);const [sub,setSub]=useState(false);const [done,setDone]=useState(null);const [trackId,setTrackId]=useState("");const [found,setFound]=useState(null);const [findErr,setFindErr]=useState("");const [analysis,setAnalysis]=useState(null);const [analysing,setAnalysing]=useState(false);const [aErr,setAErr]=useState("");const [mFilter,setMFilter]=useState("all");const [menu,setMenu]=useState(false);
  const fileRef=useRef(),camRef=useRef();
  const runAnalysis=dataUrl=>{setAnalysing(true);setAErr("");callAI(dataUrl.split(",")[1]).then(a=>{setAnalysis(a);if(a.recommendedFacilityType)setMFilter(a.recommendedFacilityType);}).catch(e=>{console.error(e);setAErr(e.message||"Analysis failed — tap Retry or submit anyway.");}).finally(()=>setAnalysing(false));};
  const onPhoto=e=>{const f=e.target.files[0];if(!f)return;setHasPhoto(true);setAnalysis(null);setAErr("");const r=new FileReader();r.onload=ev=>{setPreview(ev.target.result);runAnalysis(ev.target.result);};r.readAsDataURL(f);};
  const getGPS=()=>{setLocLoad(true);setLocErr("");if(!navigator.geolocation){setLocErr("Geolocation not supported.");setLocLoad(false);return;}navigator.geolocation.getCurrentPosition(p=>{setLoc({lat:p.coords.latitude,lng:p.coords.longitude});setAddr(`${p.coords.latitude.toFixed(5)}, ${p.coords.longitude.toFixed(5)}`);setLocLoad(false);},()=>{setLocErr("Please allow location access.");setLocLoad(false);},{enableHighAccuracy:true,timeout:8000});};
  const submit=()=>{if(!hasPhoto&&!loc)return;setSub(true);setTimeout(()=>{const c={id:genId(),photo:preview,lat:loc?.lat,lng:loc?.lng,address:addr||"Unknown",description:desc,analysis,status:"Submitted",submittedAt:new Date().toLocaleString()};setComplaints(p=>[c,...p]);setDone(c);setSub(false);setHasPhoto(false);setPreview(null);setLoc(null);setAddr("");setDesc("");setAnalysis(null);},700);};
  const advance=id=>{const nxt=c=>{const i=STATUS_FLOW.indexOf(c.status);return{...c,status:STATUS_FLOW[Math.min(i+1,STATUS_FLOW.length-1)]};};setComplaints(p=>p.map(c=>c.id===id?nxt(c):c));setFound(p=>p?.id===id?nxt(p):p);};
  const canSubmit=(hasPhoto||loc)&&!analysing&&!sub;
  const TABS=[["report","📸","Report"],["map","🗺","Map"],["heatmap","🌡","Heatmap"],["impact","🌿","Impact"],["track","🔍","Track"],["history","📋",complaints.length?`(${complaints.length})`:"Log"]];
  const inp={background:C.surface,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"12px 15px",fontSize:13,color:C.text,outline:"none",fontFamily:"'DM Sans',sans-serif",width:"100%",boxSizing:"border-box",transition:"border-color .2s"};
  return(
    <div style={{fontFamily:"'DM Sans',sans-serif",minHeight:"100vh",background:C.bg,color:C.text,paddingBottom:40}} onClick={()=>menu&&setMenu(false)}>
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:30,boxShadow:`0 1px 8px ${C.shadow}`}}>
        <div style={{maxWidth:480,margin:"0 auto",padding:"0 16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 0 10px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:34,height:34,borderRadius:10,background:C.terraG,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,boxShadow:`0 2px 10px ${C.glow}`}}>🌍</div><div><div style={{fontWeight:800,fontSize:15,color:C.text,letterSpacing:-.3}}>EcoTrace</div><div style={{fontSize:10,color:C.text3}}>Mumbai · AI-powered 🌿</div></div></div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {[{v:complaints.length,l:"Reports"},{v:complaints.filter(c=>c.status==="Resolved").length,l:"Resolved"}].map(s=><div key={s.l} style={{textAlign:"center",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:10,padding:"5px 10px",minWidth:50}}><div style={{fontSize:14,fontWeight:800,color:C.terra,lineHeight:1}}>{s.v}</div><div style={{fontSize:9,color:C.text3,marginTop:1,letterSpacing:.4}}>{s.l}</div></div>)}
              <ThemeToggle/>
              <div style={{position:"relative"}}>
                <button onClick={e=>{e.stopPropagation();setMenu(m=>!m);}} style={{width:34,height:34,borderRadius:"50%",background:C.terraG,border:"2px solid rgba(255,255,255,.4)",color:"#fff",fontWeight:800,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 2px 10px ${C.glow}`}}>{user.isGuest?"👤":user.name[0].toUpperCase()}</button>
                {menu&&<div className="slideDown" style={{position:"absolute",right:0,top:42,borderRadius:14,padding:8,boxShadow:`0 8px 32px ${C.shadowMd}`,minWidth:170,zIndex:50,background:C.surface,border:`1px solid ${C.border}`}}><div style={{padding:"8px 12px 10px",borderBottom:`1px solid ${C.border}`,marginBottom:4}}><div style={{fontWeight:700,fontSize:13,color:C.text}}>{user.name}</div>{user.email&&<div style={{fontSize:11,color:C.text3,marginTop:1}}>{user.email}</div>}{user.isGuest&&<div style={{fontSize:11,color:C.sand,marginTop:1}}>Guest session</div>}</div><button onClick={()=>{setMenu(false);onLogout();}} style={{width:"100%",background:`${C.red}0a`,border:"none",padding:"9px 12px",textAlign:"left",fontSize:13,fontWeight:600,color:C.red,cursor:"pointer",borderRadius:8,display:"flex",alignItems:"center",gap:8}}>🚪 Sign Out</button></div>}
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:0,overflowX:"auto",marginBottom:-1}}>{TABS.map(([k,ic,lb])=><button key={k} onClick={()=>{setTab(k);setDone(null);}} className={`tab-btn${tab===k?" active":""}`}>{ic} {lb}</button>)}</div>
        </div>
      </div>

      <div style={{maxWidth:480,margin:"0 auto",padding:"20px 16px"}}>
        {tab==="report"&&!done&&(
          <div style={{display:"flex",flexDirection:"column",gap:15}} className="fadeUp">
            <div style={{background:C.surface,border:`2px dashed ${C.border}`,borderRadius:20,padding:20,textAlign:"center",cursor:"pointer",transition:"border-color .2s,background .2s"}} onClick={()=>fileRef.current.click()} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.borderH;e.currentTarget.style.background=C.surface2;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.surface;}}>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={onPhoto}/>
              <input ref={camRef}  type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={onPhoto}/>
              {preview?<div><img src={preview} alt="" style={{width:"100%",borderRadius:12,maxHeight:240,objectFit:"cover",boxShadow:`0 4px 20px ${C.shadowMd}`}}/><div style={{fontSize:12,color:C.terra,marginTop:10,fontWeight:600}}>Tap to change photo</div></div>
                :<div><div style={{width:64,height:64,borderRadius:18,background:C.terraG,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:28,marginBottom:12,boxShadow:`0 4px 18px ${C.glow}`}}>📷</div><div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:4}}>Photo the dump site</div><div style={{fontSize:12,color:C.text3,marginBottom:14}}>AI instantly identifies waste & disposal steps</div><button onClick={e=>{e.stopPropagation();camRef.current.click();}} className="btn-ghost" style={{width:"auto",padding:"9px 18px",fontSize:13}}>📷 Camera</button></div>}
            </div>
            {aErr&&<div style={{background:`${C.amber}12`,border:`1px solid ${C.amber}33`,borderRadius:11,padding:"10px 13px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}><div style={{fontSize:13,color:C.amber}}>⚠ {aErr}</div>{preview&&<button onClick={()=>runAnalysis(preview)} style={{background:C.terraG,border:"none",color:"#fff",borderRadius:9,padding:"7px 13px",fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0}}>↺ Retry</button>}</div>}
            {(analysing||analysis)&&<AnalysisCard analysis={analysis} loading={analysing}/>}
            {analysis?.recommendedFacilityType&&<button onClick={()=>setTab("map")} className="card" style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer",border:`1px solid ${C.borderH}`,padding:"13px 16px",textAlign:"left",background:C.surface2}}><div style={{width:40,height:40,borderRadius:12,background:C.terraG,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🗺</div><div><div style={{fontWeight:700,color:C.text,fontSize:13}}>Find nearest {analysis.recommendedFacilityType}</div><div style={{fontSize:11,color:C.text3,marginTop:1}}>View pre-filtered facility map →</div></div></button>}
            <div className="card"><div style={{fontWeight:700,color:C.text,marginBottom:10,fontSize:13}}>📍 Location</div><button onClick={getGPS} disabled={locLoad} style={{width:"100%",background:loc?`${C.moss}10`:C.terraG,color:loc?C.moss:"#fff",border:loc?`1.5px solid ${C.moss}33`:"none",borderRadius:11,padding:"12px 0",fontSize:13,fontWeight:700,cursor:locLoad?"wait":"pointer",transition:"all .2s"}}>{locLoad?"📡 Locating…":loc?`✅ ${addr}`:"📡 Auto-detect GPS"}</button>{locErr&&<div style={{color:C.red,fontSize:12,marginTop:7}}>{locErr}</div>}<input value={addr} onChange={e=>setAddr(e.target.value)} placeholder="Or type address / landmark" style={{...inp,marginTop:10,background:C.surface2}} onFocus={e=>e.target.style.borderColor=C.terra} onBlur={e=>e.target.style.borderColor=C.border}/></div>
            <div className="card"><div style={{fontWeight:700,color:C.text,marginBottom:9,fontSize:13}}>📝 Notes <span style={{color:C.text3,fontWeight:400}}>(optional)</span></div><textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Describe the dump site…" rows={3} style={{...inp,resize:"none"}} onFocus={e=>e.target.style.borderColor=C.terra} onBlur={e=>e.target.style.borderColor=C.border}/></div>
            <button className="btn-primary" onClick={submit} disabled={!canSubmit} style={{opacity:canSubmit?1:.35,cursor:canSubmit?"pointer":"not-allowed",fontSize:15,padding:"15px 0"}}>{sub?<span style={{display:"inline-flex",alignItems:"center",gap:8}}><span style={{width:15,height:15,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin .7s linear infinite"}}/>Submitting…</span>:analysing?"🔬 Analysing…":"🚨 Submit Complaint"}</button>
            {!hasPhoto&&!loc&&<div style={{textAlign:"center",fontSize:12,color:C.text3}}>Add a photo or enable GPS to submit</div>}
          </div>
        )}
        {tab==="report"&&done&&(
          <div style={{textAlign:"center",padding:"24px 0"}} className="fadeUp">
            <div style={{width:80,height:80,borderRadius:24,background:C.terraG,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:36,marginBottom:16,boxShadow:`0 8px 32px ${C.glow}`,animation:"softPulse 3s ease-in-out infinite"}}>✅</div>
            <div style={{fontWeight:900,fontSize:22,color:C.text,marginBottom:5,letterSpacing:-.5}}>Complaint Submitted!</div>
            <div style={{fontSize:13,color:C.text2,marginBottom:20}}>Your report is logged and under review.</div>
            <div style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:16,padding:"16px 20px",marginBottom:20,display:"inline-block",width:"100%"}}><div style={{fontSize:10,color:C.terra,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Complaint ID</div><div style={{fontFamily:"'DM Mono',monospace",fontSize:18,color:C.text,fontWeight:600,letterSpacing:.3}}>{done.id}</div><div style={{fontSize:11,color:C.text3,marginTop:5}}>Save this to track your report</div></div>
            {done.analysis&&<div style={{marginBottom:16,textAlign:"left"}}><AnalysisCard analysis={done.analysis} loading={false}/></div>}
            <StatusRail status="Submitted"/>
            <div style={{display:"flex",gap:8,marginTop:20,flexWrap:"wrap"}}>
              <button onClick={()=>{setTab("track");setTrackId(done.id);setFound(done);}} className="btn-ghost" style={{flex:1,minWidth:80}}>🔍 Track</button>
              <button onClick={()=>setTab("map")} className="btn-ghost" style={{flex:1,minWidth:80}}>🗺 Map</button>
              <button onClick={()=>setTab("heatmap")} className="btn-ghost" style={{flex:1,minWidth:80}}>🌡 Heatmap</button>
              <button className="btn-primary" onClick={()=>setDone(null)} style={{flex:"1 0 100%",marginTop:2}}>+ New Report</button>
            </div>
          </div>
        )}
        {tab==="map"&&<div className="fadeUp"><FacilityMap userLocation={loc} defaultFilter={mFilter}/></div>}
        {tab==="heatmap"&&<div className="fadeUp"><HeatmapView complaints={complaints}/></div>}
        {tab==="impact"&&<div className="fadeUp"><CarbonTracker/></div>}
        {tab==="track"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}} className="fadeUp">
            <div className="card"><div style={{fontWeight:700,color:C.text,marginBottom:11,fontSize:14}}>🔍 Track Complaint</div>
              <div style={{display:"flex",gap:8}}><input value={trackId} onChange={e=>setTrackId(e.target.value)} placeholder="Enter Complaint ID" style={{...inp,flex:1,fontFamily:"'DM Mono',monospace",background:C.surface2}} onFocus={e=>e.target.style.borderColor=C.terra} onBlur={e=>e.target.style.borderColor=C.border} onKeyDown={e=>{if(e.key==="Enter"){setFindErr("");setFound(null);const f=complaints.find(c=>c.id.toUpperCase()===trackId.trim().toUpperCase());if(f)setFound(f);else setFindErr("No complaint with that ID.");}}}/>
              <button className="btn-primary" onClick={()=>{setFindErr("");setFound(null);const f=complaints.find(c=>c.id.toUpperCase()===trackId.trim().toUpperCase());if(f)setFound(f);else setFindErr("No complaint with that ID.");}} style={{width:"auto",padding:"12px 20px"}}>Go</button></div>
              {findErr&&<div style={{color:C.red,fontSize:12,marginTop:8}}>{findErr}</div>}
            </div>
            {found&&<ComplaintCard complaint={found} onAdvance={advance}/>}
          </div>
        )}
        {tab==="history"&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}} className="fadeUp">
            {complaints.length===0?<div style={{textAlign:"center",color:C.text3,padding:"52px 0",fontSize:14}}><div style={{fontSize:48,marginBottom:12,opacity:.3}}>📭</div><div style={{fontWeight:700,color:C.text2,marginBottom:5}}>No reports yet</div><div style={{fontSize:12}}>Submit your first complaint to get started.</div></div>
              :complaints.map(c=><ComplaintCard key={c.id} complaint={c} onAdvance={advance}/>)}
          </div>
        )}
      </div>
    </div>
  );
}