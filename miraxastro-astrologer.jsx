import React, { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// MIRAXASTRO · ASTROLOGER PORTAL
// This portal is ONLY for astrologers. Customers never see this.
// Entry: "Join as Astrologer" link on the customer app login screen.
// ═══════════════════════════════════════════════════════════════

const G="#ffd700";
const BG="linear-gradient(135deg,#0a0015 0%,#0d0028 40%,#010a1a 100%)";

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
@keyframes floatIn{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@keyframes tick{0%{transform:scale(0)}70%{transform:scale(1.2)}100%{transform:scale(1)}}
input::placeholder,textarea::placeholder{color:#4a3a2a}
input:focus,select:focus,textarea:focus{border-color:rgba(255,215,0,.5)!important;outline:none!important}
select option{background:#0d0a1a!important;color:#e8d5b7!important}
select{color:#e8d5b7!important}
button:disabled{opacity:.4;cursor:not-allowed}
.tag{cursor:pointer;transition:all .18s;user-select:none}
.tag:hover{border-color:rgba(255,215,0,.5)!important}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(200,150,50,.3);border-radius:4px}
input[type=file]{display:none}
`;

const cd={background:"rgba(255,255,255,.04)",border:"1px solid rgba(200,150,50,.18)",borderRadius:14,padding:15,marginBottom:12};
const ip={width:"100%",background:"#0d0a1a",border:"1px solid rgba(200,150,50,.28)",borderRadius:11,padding:"12px 13px",color:"#e8d5b7",fontFamily:"sans-serif",fontSize:14,outline:"none",boxSizing:"border-box"};
const bG={background:"linear-gradient(135deg,#c8a000,#ffd700)",color:"#0a0015",border:"none",borderRadius:10,padding:"10px 18px",fontWeight:700,fontFamily:"sans-serif",fontSize:13,cursor:"pointer"};
const bO={background:"transparent",color:G,border:"1px solid rgba(255,215,0,.4)",borderRadius:10,padding:"8px 14px",fontFamily:"sans-serif",fontSize:12,cursor:"pointer"};
const lbl={fontSize:11,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1.3,marginBottom:5,display:"block"};


function PwStrength({pw}){
  if(!pw) return null;
  var checks = [pw.length>=8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)];
  var score = checks.filter(function(c){return c;}).length;
  var colors = ["#636e72","#ff4757","#ffa502","#2ed573","#00b894"];
  var bars = [0,1,2,3];
  return React.createElement("div", {style:{display:"flex",gap:3,margin:"5px 0 10px"}},
    bars.map(function(i){
      return React.createElement("div", {key:i, style:{flex:1,height:2,borderRadius:2,background:i<score?colors[score]:"rgba(255,255,255,.1)"}});
    })
  );
}


const LOGO_SRC="data:image/jpeg;base64,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";
function MXLogo({size=110}){
  return(<img src={LOGO_SRC} alt="MiraXAstro" style={{width:size,height:size,objectFit:"contain",display:"block",margin:"0 auto"}}/>);
}
function MXWordmark({size=22}){
  return(
    <div style={{fontFamily:"Georgia,serif",fontSize:size,fontWeight:300,letterSpacing:size*0.18,lineHeight:1,textAlign:"center"}}>
      <span style={{color:"#e8d5b7"}}>Mira</span>
      <span style={{background:"linear-gradient(135deg,#7b6fc4,#b8aae8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontWeight:400}}>X</span>
      <span style={{color:"#e8d5b7"}}>Astro</span>
    </div>
  );
}
function MXTagline(){
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:4}}>
      <div style={{height:"0.5px",width:18,background:"linear-gradient(90deg,transparent,rgba(232,213,183,.4))"}}/> 
      <span style={{fontSize:7,color:"rgba(232,213,183,.5)",fontFamily:"sans-serif"}}>✦</span>
      <span style={{fontSize:7.5,color:"rgba(232,213,183,.4)",fontFamily:"sans-serif",letterSpacing:1.8}}>ANCIENT WISDOM. MODERN INSIGHT.</span>
      <span style={{fontSize:7,color:"rgba(232,213,183,.5)",fontFamily:"sans-serif"}}>✦</span>
      <div style={{height:"0.5px",width:18,background:"linear-gradient(90deg,rgba(232,213,183,.4),transparent)"}}/>
    </div>
  );
}


const STATES_BY_COUNTRY={
  "Australia":["ACT","NSW","NT","QLD","SA","TAS","VIC","WA"],
  "United States":["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"],
  "India":["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry","Chandigarh"],
  "United Kingdom":["England","Scotland","Wales","Northern Ireland"],
  "Canada":["Alberta","British Columbia","Manitoba","New Brunswick","Newfoundland and Labrador","Northwest Territories","Nova Scotia","Nunavut","Ontario","Prince Edward Island","Quebec","Saskatchewan","Yukon"],
  "New Zealand":["Auckland","Bay of Plenty","Canterbury","Gisborne","Hawke's Bay","Manawatu-Wanganui","Marlborough","Nelson","Northland","Otago","Southland","Taranaki","Tasman","Waikato","Wellington","West Coast"],
  "Singapore":["Central Region","East Region","North Region","North-East Region","West Region"],
  "UAE":["Abu Dhabi","Dubai","Sharjah","Ajman","Umm Al Quwain","Ras Al Khaimah","Fujairah"],
  "Germany":["Baden-Württemberg","Bavaria","Berlin","Brandenburg","Bremen","Hamburg","Hesse","Lower Saxony","Mecklenburg-Vorpommern","North Rhine-Westphalia","Rhineland-Palatinate","Saarland","Saxony","Saxony-Anhalt","Schleswig-Holstein","Thuringia"],
  "France":["Auvergne-Rhône-Alpes","Bourgogne-Franche-Comté","Brittany","Centre-Val de Loire","Corsica","Grand Est","Hauts-de-France","Île-de-France","Normandy","Nouvelle-Aquitaine","Occitanie","Pays de la Loire","Provence-Alpes-Côte d'Azur"],
  "Malaysia":["Johor","Kedah","Kelantan","Kuala Lumpur","Labuan","Melaka","Negeri Sembilan","Pahang","Perak","Perlis","Pulau Pinang","Putrajaya","Sabah","Sarawak","Selangor","Terengganu"],
  "South Africa":["Eastern Cape","Free State","Gauteng","KwaZulu-Natal","Limpopo","Mpumalanga","Northern Cape","North West","Western Cape"],
  "Sri Lanka":["Central","Eastern","North Central","Northern","North Western","Sabaragamuwa","Southern","Uva","Western"],
  "Bangladesh":["Barisal","Chittagong","Dhaka","Khulna","Mymensingh","Rajshahi","Rangpur","Sylhet"],
  "Pakistan":["Azad Kashmir","Balochistan","FATA","Gilgit-Baltistan","Islamabad","Khyber Pakhtunkhwa","Punjab","Sindh"],
  "Nepal":["Bagmati","Gandaki","Karnali","Lumbini","Madhesh","Province No. 1","Sudurpashchim"],
  "Other":[],
};

function AddressFields({d,setF,errs,ipStyle,lblStyle,ErrComp}){
  const countries=["Australia","India","United States","United Kingdom","Canada","New Zealand","Singapore","UAE","Germany","France","Malaysia","South Africa","Sri Lanka","Bangladesh","Pakistan","Nepal","Other"];
  const states=STATES_BY_COUNTRY[d.country]||[];
  return(
    <div>
      <div style={{marginBottom:11}}>
        <label style={lblStyle}>COUNTRY *</label>
        <select value={d.country||""} onChange={e=>{setF("country",e.target.value);setF("state","");}} style={{...ipStyle,cursor:"pointer",background:"#0d0a1a",border:"1px solid "+(errs.country?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}>
          <option value="">Select country</option>
          {countries.map(c=><option key={c}>{c}</option>)}
        </select>
        <ErrComp m={errs.country}/>
      </div>
      {d.country&&(
        <div style={{marginBottom:11}}>
          <label style={lblStyle}>STATE / PROVINCE {states.length>0?"*":""}</label>
          {states.length>0
            ?<select value={d.state||""} onChange={e=>setF("state",e.target.value)} style={{...ipStyle,cursor:"pointer",background:"#0d0a1a",border:"1px solid "+(errs.state?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}>
               <option value="">Select {d.country==="United Kingdom"?"country":"state/province"}</option>
               {states.map(s=><option key={s}>{s}</option>)}
             </select>
            :<input value={d.state||""} onChange={e=>setF("state",e.target.value)} placeholder="State / Province / Region" style={ipStyle}/>
          }
          <ErrComp m={errs.state}/>
        </div>
      )}
      {d.country&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:11}}>
          <div>
            <label style={lblStyle}>CITY *</label>
            <input value={d.city||""} onChange={e=>setF("city",e.target.value)} placeholder="City" style={{...ipStyle,border:"1px solid "+(errs.city?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
            <ErrComp m={errs.city}/>
          </div>
          <div>
            <label style={lblStyle}>POSTCODE *</label>
            <input value={d.postcode||""} onChange={e=>setF("postcode",e.target.value)} placeholder={d.country==="Australia"?"e.g. 2000":d.country==="India"?"e.g. 400001":d.country==="United States"?"e.g. 90210":d.country==="United Kingdom"?"e.g. SW1A 1AA":"Postcode / ZIP"} style={{...ipStyle,fontFamily:"monospace",border:"1px solid "+(errs.postcode?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
            <ErrComp m={errs.postcode}/>
          </div>
        </div>
      )}
      {d.country&&(
        <div style={{marginBottom:11}}>
          <label style={lblStyle}>ADDRESS LINE 1 *</label>
          <input value={d.addr1||""} onChange={e=>setF("addr1",e.target.value)} placeholder="Street address" style={{...ipStyle,border:"1px solid "+(errs.addr1?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
          <ErrComp m={errs.addr1}/>
        </div>
      )}
      {d.country&&(
        <div style={{marginBottom:11}}>
          <label style={lblStyle}>ADDRESS LINE 2</label>
          <input value={d.addr2||""} onChange={e=>setF("addr2",e.target.value)} placeholder="Apartment, suite, unit (optional)" style={ipStyle}/>
        </div>
      )}
    </div>
  );
}

const PHONE_COUNTRIES=[
  {code:"AU",dial:"+61",flag:"🇦🇺",name:"Australia",fmt:"4XX XXX XXX",len:9},
  {code:"IN",dial:"+91",flag:"🇮🇳",name:"India",fmt:"XXXXX XXXXX",len:10},
  {code:"US",dial:"+1",flag:"🇺🇸",name:"USA",fmt:"(XXX) XXX-XXXX",len:10},
  {code:"GB",dial:"+44",flag:"🇬🇧",name:"UK",fmt:"XXXX XXXXXX",len:10},
  {code:"CA",dial:"+1",flag:"🇨🇦",name:"Canada",fmt:"(XXX) XXX-XXXX",len:10},
  {code:"SG",dial:"+65",flag:"🇸🇬",name:"Singapore",fmt:"XXXX XXXX",len:8},
  {code:"AE",dial:"+971",flag:"🇦🇪",name:"UAE",fmt:"XX XXX XXXX",len:9},
  {code:"NZ",dial:"+64",flag:"🇳🇿",name:"New Zealand",fmt:"XX XXX XXXX",len:9},
  {code:"ZA",dial:"+27",flag:"🇿🇦",name:"South Africa",fmt:"XX XXX XXXX",len:9},
  {code:"DE",dial:"+49",flag:"🇩🇪",name:"Germany",fmt:"XXXX XXXXXXX",len:10},
  {code:"FR",dial:"+33",flag:"🇫🇷",name:"France",fmt:"X XX XX XX XX",len:9},
  {code:"MY",dial:"+60",flag:"🇲🇾",name:"Malaysia",fmt:"XX XXXX XXXX",len:10},
  {code:"LK",dial:"+94",flag:"🇱🇰",name:"Sri Lanka",fmt:"XX XXX XXXX",len:9},
  {code:"NP",dial:"+977",flag:"🇳🇵",name:"Nepal",fmt:"XX XXXX XXXX",len:10},
  {code:"BD",dial:"+880",flag:"🇧🇩",name:"Bangladesh",fmt:"XXXX XXXXXX",len:10},
  {code:"PK",dial:"+92",flag:"🇵🇰",name:"Pakistan",fmt:"XXX XXXXXXX",len:10},
  {code:"JP",dial:"+81",flag:"🇯🇵",name:"Japan",fmt:"XX XXXX XXXX",len:10},
  {code:"KR",dial:"+82",flag:"🇰🇷",name:"South Korea",fmt:"XX XXXX XXXX",len:10},
  {code:"CN",dial:"+86",flag:"🇨🇳",name:"China",fmt:"XXX XXXX XXXX",len:11},
  {code:"OTHER",dial:"+",flag:"🌐",name:"Other",fmt:"XXXXXXXXXXX",len:15},
];

function detectDialCode(){
  try{
    const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||"";
    const TZ={"Australia/Sydney":"AU","Australia/Melbourne":"AU","Australia/Brisbane":"AU","Australia/Perth":"AU","Australia/Adelaide":"AU","Asia/Kolkata":"IN","Asia/Calcutta":"IN","America/New_York":"US","America/Chicago":"US","America/Los_Angeles":"US","America/Toronto":"CA","Europe/London":"GB","Asia/Singapore":"SG","Asia/Dubai":"AE","Pacific/Auckland":"NZ","Africa/Johannesburg":"ZA","Europe/Berlin":"DE","Europe/Paris":"FR","Asia/Kuala_Lumpur":"MY","Asia/Colombo":"LK","Asia/Kathmandu":"NP","Asia/Dhaka":"BD","Asia/Karachi":"PK","Asia/Tokyo":"JP","Asia/Seoul":"KR","Asia/Shanghai":"CN"};
    const cc=TZ[tz];
    if(cc) return PHONE_COUNTRIES.find(p=>p.code===cc)||PHONE_COUNTRIES[0];
  }catch(e){}
  return PHONE_COUNTRIES[0];
}

function formatPhone(digits,country){
  if(!digits) return "";
  const d=digits.replace(/\D/g,"").slice(0,country.len);
  if(country.code==="US"||country.code==="CA"){
    if(d.length<=3) return d;
    if(d.length<=6) return "("+d.slice(0,3)+") "+d.slice(3);
    return "("+d.slice(0,3)+") "+d.slice(3,6)+"-"+d.slice(6);
  }
  if(country.code==="AU"){
    if(d.length<=3) return d;
    if(d.length<=6) return d.slice(0,3)+" "+d.slice(3);
    return d.slice(0,3)+" "+d.slice(3,6)+" "+d.slice(6);
  }
  if(country.code==="IN"){
    if(d.length<=5) return d;
    return d.slice(0,5)+" "+d.slice(5);
  }
  if(country.code==="GB"){
    if(d.length<=4) return d;
    return d.slice(0,4)+" "+d.slice(4);
  }
  if(country.code==="SG"){
    if(d.length<=4) return d;
    return d.slice(0,4)+" "+d.slice(4);
  }
  if(country.code==="DE"){
    if(d.length<=4) return d;
    return d.slice(0,4)+" "+d.slice(4);
  }
  if(country.code==="FR"){
    const chunks=[];
    for(let i=0;i<d.length;i+=2) chunks.push(d.slice(i,i+2));
    return chunks.join(" ");
  }
  // Default: split into groups of 3-4
  if(d.length<=4) return d;
  if(d.length<=8) return d.slice(0,4)+" "+d.slice(4);
  return d.slice(0,4)+" "+d.slice(4,8)+" "+d.slice(8);
}

function PhoneInput({value,onChange,error,ipStyle,syncCountry}){
  const init=React.useMemo(()=>detectDialCode(),[]);
  const [selCountry,setSelCountry]=React.useState(init);
  const [open,setOpen]=React.useState(false);
  const [search,setSearch]=React.useState("");
  const [digits,setDigits]=React.useState("");
  const dropRef=React.useRef();

  // Sync country when parent address country changes
  React.useEffect(()=>{
    if(!syncCountry) return;
    const countryMap={"Australia":"AU","India":"IN","United States":"US","United Kingdom":"GB","Canada":"CA","Singapore":"SG","UAE":"AE","New Zealand":"NZ","South Africa":"ZA","Germany":"DE","France":"FR","Malaysia":"MY","Sri Lanka":"LK","Nepal":"NP","Bangladesh":"BD","Pakistan":"PK","Japan":"JP","South Korea":"KR","China":"CN"};
    const code=countryMap[syncCountry];
    if(code){
      const found=PHONE_COUNTRIES.find(p=>p.code===code);
      if(found&&found.code!==selCountry.code){
        setSelCountry(found);
        onChange(found.dial+(digits?" "+formatPhone(digits,found):""));
      }
    }
  },[syncCountry]);

  React.useEffect(()=>{
    function out(e){if(dropRef.current&&!dropRef.current.contains(e.target))setOpen(false);}
    document.addEventListener("mousedown",out);
    return()=>document.removeEventListener("mousedown",out);
  },[]);

  function handleInput(e){
    const d=e.target.value.replace(/\D/g,"").slice(0,selCountry.len);
    setDigits(d);
    onChange(selCountry.dial+(d?" "+formatPhone(d,selCountry):""));
  }

  function pickCountry(c){
    setSelCountry(c);
    setOpen(false);
    setSearch("");
    onChange(c.dial+(digits?" "+formatPhone(digits,c):""));
  }

  const filtered=PHONE_COUNTRIES.filter(c=>
    c.name.toLowerCase().includes(search.toLowerCase())||
    c.dial.includes(search)||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return(
    <div ref={dropRef} style={{position:"relative"}}>
      <div style={{display:"flex",background:"#0d0a1a",border:"1px solid "+(error?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)"),borderRadius:11,overflow:"visible"}}>
        <button type="button" onClick={()=>setOpen(v=>!v)} style={{display:"flex",alignItems:"center",gap:5,padding:"12px 10px",background:"rgba(255,255,255,.04)",border:"none",borderRight:"1px solid rgba(200,150,50,.2)",cursor:"pointer",flexShrink:0,minWidth:90,borderRadius:"11px 0 0 11px"}}>
          <span style={{fontSize:17}}>{selCountry.flag}</span>
          <span style={{fontSize:12,fontWeight:700,color:G,fontFamily:"sans-serif"}}>{selCountry.dial}</span>
          <span style={{fontSize:10,color:"#8a7a6a"}}>{open?"▲":"▼"}</span>
        </button>
        <input
          type="tel"
          value={formatPhone(digits,selCountry)}
          onChange={handleInput}
          placeholder={selCountry.fmt.replace(/X/g,"0")}
          style={{flex:1,background:"transparent",border:"none",padding:"12px 13px",color:"#e8d5b7",fontFamily:"monospace",fontSize:14,outline:"none",letterSpacing:1,borderRadius:"0 11px 11px 0"}}
        />
      </div>
      {open&&(
        <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"#0a0818",border:"1px solid rgba(200,150,50,.35)",borderRadius:11,zIndex:400,boxShadow:"0 8px 32px rgba(0,0,0,.8)",overflow:"hidden"}}>
          <div style={{padding:"8px 10px",borderBottom:"1px solid rgba(200,150,50,.15)"}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search country or dial code..." autoFocus style={{width:"100%",background:"rgba(255,255,255,.06)",border:"1px solid rgba(200,150,50,.2)",borderRadius:8,padding:"7px 10px",color:"#e8d5b7",fontFamily:"sans-serif",fontSize:12,outline:"none",boxSizing:"border-box"}}/>
          </div>
          <div style={{maxHeight:200,overflowY:"auto"}}>
            {filtered.map(c=>(
              <div key={c.code} onClick={()=>pickCountry(c)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 13px",cursor:"pointer",background:selCountry.code===c.code?"rgba(255,215,0,.1)":"transparent",borderBottom:"1px solid rgba(200,150,50,.06)"}}>
                <span style={{fontSize:18,flexShrink:0}}>{c.flag}</span>
                <span style={{fontSize:12,color:"#e8d5b7",fontFamily:"sans-serif",flex:1}}>{c.name}</span>
                <span style={{fontSize:11,color:G,fontFamily:"monospace",fontWeight:700}}>{c.dial}</span>
                {selCountry.code===c.code&&<span style={{color:G,fontSize:13,marginLeft:4}}>&#10003;</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


function Stars(){
  const p=Array.from({length:40},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,r:Math.random()*1.5+.4,d:Math.random()*4,dur:Math.random()*3+2}));
  return(
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
      <svg width="100%" height="100%" style={{position:"absolute"}}>
        {p.map(x=>(
          <circle key={x.id} cx={x.x+"%"} cy={x.y+"%"} r={x.r} fill="white">
            <animate attributeName="opacity" values=".04;.75;.04" dur={x.dur+"s"} begin={x.d+"s"} repeatCount="indefinite"/>
          </circle>
        ))}
      </svg>
    </div>
  );
}

function Sp({size=16,color=G}){
  return <div style={{width:size,height:size,border:"2px solid "+color+"22",borderTop:"2px solid "+color,borderRadius:"50%",animation:"spin .8s linear infinite",flexShrink:0}}/>;
}

function Err({m}){
  return m?<div style={{fontSize:11,color:"#ff4757",fontFamily:"sans-serif",marginTop:3}}>⚠ {m}</div>:null;
}

function avUrl(name,g){
  return"https://api.dicebear.com/7.x/avataaars/svg?seed="+encodeURIComponent(name)+"&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=160&skinColor="+(g==="female"?"d08b5b,edb98a":"ae5d29,d08b5b")+"&top="+(g==="female"?"longHair,longHairBigHair":"shortHairShortFlat,hat,turban")+"&facialHair="+(g==="male"?"beardLight,moustacheFancy,blank":"blank")+"&clothing=blazerAndShirt,hoodie";
}

function Tags({opts,sel,onToggle,max}){
  return(
    <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
      {opts.map(o=>{
        const on=sel.includes(o);
        return(
          <div key={o} className="tag" onClick={()=>onToggle(o,on)} style={{padding:"5px 12px",borderRadius:18,border:"1px solid "+(on?"rgba(255,215,0,.55)":"rgba(200,150,50,.22)"),background:on?"rgba(255,215,0,.12)":"transparent",fontSize:12,fontFamily:"sans-serif",color:on?G:"#8a7a6a"}}>
            {o}
          </div>
        );
      })}
    </div>
  );
}

function ProgressBar({step,steps}){
  return(
    <div style={{marginBottom:18}}>
      <div style={{display:"flex",alignItems:"center",marginBottom:6}}>
        {steps.map((l,i)=>(
          <React.Fragment key={i}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:i<step?"linear-gradient(135deg,#c8a000,#ffd700)":i===step?"rgba(255,215,0,.15)":"rgba(255,255,255,.06)",border:"2px solid "+(i<=step?"rgba(255,215,0,.6)":"rgba(200,150,50,.2)"),display:"flex",alignItems:"center",justifyContent:"center",fontSize:10}}>
                {i<step?<span style={{color:"#0a0015",fontWeight:700}}>✓</span>:<span style={{color:i===step?G:"#636e72",fontWeight:700,fontFamily:"sans-serif"}}>{i+1}</span>}
              </div>
            </div>
            {i<steps.length-1&&<div style={{flex:1,height:2,background:i<step?"rgba(255,215,0,.5)":"rgba(255,255,255,.07)",margin:"0 3px",transition:"all .4s"}}/>}
          </React.Fragment>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        {steps.map((l,i)=>(
          <div key={i} style={{fontSize:8,color:i===step?G:"#636e72",fontFamily:"sans-serif",textAlign:"center",flex:1}}>{l}</div>
        ))}
      </div>
    </div>
  );
}

// -- LANDING -------------------------------------------------------
function Landing({onApply,onLogin}){
  return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"Georgia,serif",color:"#e8d5b7",position:"relative"}}>
      <style>{CSS}</style><Stars/>
      <div style={{position:"relative",zIndex:1,maxWidth:440,margin:"0 auto",padding:"24px 16px 40px",animation:"floatIn .4s ease"}}>

        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:36,marginBottom:8,animation:"pulse 3s ease infinite"}}>🔮</div>
          <MXLogo size={135}/>
        <div style={{marginTop:8}}><MXWordmark size={22}/></div>
        <MXTagline/>
        <div style={{fontSize:20,fontWeight:700,color:G,marginTop:10,marginBottom:4}}>Join MiraXAstro as Astrologer</div>
          <div style={{fontSize:12,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.7}}>Earn from home · 10,000+ customers waiting for you</div>
        </div>
        <div style={{...cd,background:"linear-gradient(135deg,rgba(255,215,0,.1),rgba(10,0,21,.9))",border:"1px solid rgba(255,215,0,.3)",textAlign:"center",marginBottom:14}}>
          <div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif",marginBottom:3}}>AVERAGE MONTHLY EARNINGS</div>
          <div style={{fontSize:28,fontWeight:700,color:G}}>₹50,000+</div>
          <div style={{fontSize:11,color:"#636e72",fontFamily:"sans-serif"}}>Top astrologers earn ₹2 Lakh+ per month</div>
        </div>
        <div style={cd}>
          <div style={{fontSize:13,fontWeight:700,color:G,marginBottom:12}}>Why Join MiraXAstro?</div>
          {[["💰","Earn ₹10-₹500/min - you set your own rate"],["🌍","Customers from India and 20+ countries worldwide"],["⏰","Work from home on your own flexible schedule"],["🛡️","Secure payments with weekly payouts guaranteed"],["⭐","Build reputation with verified customer reviews"],["📱","Simple app - no technical knowledge required"]].map(([icon,text])=>(
            <div key={text} style={{display:"flex",gap:10,marginBottom:8}}>
              <span style={{fontSize:15,flexShrink:0}}>{icon}</span>
              <div style={{fontSize:13,color:"#c8b090",fontFamily:"sans-serif",lineHeight:1.5}}>{text}</div>
            </div>
          ))}
        </div>
        <button style={{...bG,width:"100%",padding:14,fontSize:14,marginBottom:9,display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={onApply}>
          🚀 Apply as Astrologer
        </button>
        <button style={{...bO,width:"100%",padding:11,fontSize:13}} onClick={onLogin}>
          🔑 Already registered? Sign in
        </button>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",marginTop:14}}>
          {["✅ 6,000+ Astrologers","⭐ 4.8 Rating","🌐 20+ Countries","💳 Weekly Payouts"].map(b=>(
            <div key={b} style={{fontSize:10,color:"#3a2a2a",fontFamily:"sans-serif",background:"rgba(255,255,255,.025)",padding:"3px 8px",borderRadius:6,border:"1px solid rgba(200,150,50,.07)"}}>{b}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -- ONBOARDING FORM -----------------------------------------------
function Onboard({onDone}){
  const [step,setStep]=useState(0);
  const [loading,setLoading]=useState(false);
  const [showPw,setShowPw]=useState(false);
  const [langSearch,setLangSearch]=useState("");
  const [langOpen,setLangOpen]=useState(false);
  const langRef=useRef();
  const [otpStep,setOtpStep]=useState(false);
  const [otpVal,setOtpVal]=useState("");
  const [otpErr,setOtpErr]=useState("");
  const [generatedOtp,setGeneratedOtp]=useState("");
  const [countdown,setCountdown]=useState(0);
  const cntRef=useRef();
  const fileRef=useRef();
  const STEPS=["Account","Photo","Expertise","Rates","Banking","Review"];
  const SPECS=["Vedic Astrology","Tarot Reading","Numerology","Kundli","Marriage","Career","Palmistry","Vastu","Lal Kitab","Western Astrology"];
  const ALL_LANGS=["English","Hindi","Tamil","Telugu","Kannada","Malayalam","Gujarati","Marathi","Bengali","Punjabi","Urdu","Sanskrit","Odia","Assamese","Sindhi","Konkani","Nepali","Sinhala","Mandarin","Cantonese","Japanese","Korean","Arabic","Persian","Turkish","Hebrew","French","Spanish","Portuguese","German","Italian","Dutch","Russian","Polish","Ukrainian","Greek","Swedish","Norwegian","Danish","Finnish","Thai","Vietnamese","Indonesian","Malay","Tagalog","Swahili","Afrikaans","Zulu"];
  const COUNTRY_LANGS={
    "India":["Hindi","Tamil","Telugu","Kannada","Malayalam","Gujarati","Marathi","Bengali","Punjabi","Urdu","Odia","Sanskrit","English"],
    "Australia":["English","Hindi","Mandarin","Arabic","Vietnamese","Greek","Italian","Tagalog","Tamil","Punjabi"],
    "United Kingdom":["English","Hindi","Punjabi","Urdu","Bengali","Arabic","Polish","French","Gujarati","Tamil"],
    "United States":["English","Spanish","Hindi","Mandarin","French","Tagalog","Arabic","Vietnamese","Korean","Portuguese"],
    "Canada":["English","French","Hindi","Punjabi","Mandarin","Tagalog","Arabic","Spanish","Tamil","Gujarati"],
    "Singapore":["English","Mandarin","Tamil","Malay","Hindi","Bengali","Telugu","Gujarati","Punjabi"],
    "UAE":["Arabic","English","Hindi","Urdu","Malayalam","Tamil","Tagalog","Bengali","Punjabi","Persian"],
    "New Zealand":["English","Maori","Hindi","Mandarin","Punjabi","Samoan","Tagalog","Arabic","Tamil"],
    "South Africa":["English","Zulu","Afrikaans","Swahili","Hindi","Tamil","Gujarati","Urdu"],
    "Germany":["German","English","Turkish","Arabic","Russian","Polish","Italian","Spanish","Hindi","Persian"],
    "France":["French","Arabic","Spanish","English","Portuguese","Italian","Hindi","Tamil","Turkish"],
    "Malaysia":["Malay","English","Mandarin","Tamil","Telugu","Punjabi","Hindi","Iban"],
    "Sri Lanka":["Sinhala","Tamil","English"],
    "Nepal":["Nepali","Hindi","English","Maithili","Bhojpuri"],
    "Bangladesh":["Bengali","English","Hindi","Urdu"],
    "Pakistan":["Urdu","Punjabi","Sindhi","Hindi","English","Pashto"],
  };
  function getLangsForCountry(country){
    const priority=COUNTRY_LANGS[country]||["English"];
    const rest=ALL_LANGS.filter(l=>!priority.includes(l));
    return [...priority,...rest];
  }
  const SLOTS=["6AM-9AM","9AM-12PM","12PM-3PM","3PM-6PM","6PM-9PM","9PM-12AM","24/7"];
  const DAYS=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const [d,setD]=useState({name:"",email:"",phone:"",gender:"male",pw:"",pw2:"",agreed:false,photo:null,addr1:"",addr2:"",city:"",state:"",postcode:"",country:"",specs:[],langs:[],exp:"",qual:"",bio:"",rateChat:"",rateCall:"",slots:[],days:[],freeFirst:true,bankCountry:"",accountName:"",accountNum:"",bankName:"",branchName:"",ifsc:"",bsb:"",sortCode:"",routingNum:"",iban:"",swiftBic:"",panNum:"",taxId:""});
  const [errs,setErrs]=useState({});

  function setF(k,v){setD(x=>({...x,[k]:v}));}

  function toggleArr(k,v,isOn){
    setD(x=>({...x,[k]:isOn?x[k].filter(i=>i!==v):[...x[k],v]}));
  }

  function validate(s){
    const e={};
    if(s===0){
      if(!d.name.trim())e.name="Required";if(!d.phone||d.phone.replace(/\D/g,"").length<8)e.phone="Valid phone required";if(!d.country)e.country="Required";if(STATES_BY_COUNTRY[d.country]&&STATES_BY_COUNTRY[d.country].length>0&&!d.state)e.state="Please select a state";if(!d.city||!d.city.trim())e.city="Required";if(!d.postcode||!d.postcode.trim())e.postcode="Required";if(!d.addr1||!d.addr1.trim())e.addr1="Required";
      if(!d.email.includes("@"))e.email="Valid email required";
      if(d.pw.length<8)e.pw="Min 8 characters";
      if(d.pw!==d.pw2)e.pw2="Passwords don't match";
      if(!d.agreed)e.agreed="Please accept to continue";
    }
    if(s===2){
      if(!d.specs.length)e.specs="Select at least one";
      if(!d.langs.length)e.langs="Select at least one";
      if(!d.exp)e.exp="Required";
      if(!d.bio||d.bio.length<60)e.bio="Write at least 60 characters";
    }
    if(s===3){
      if(!d.rateChat||Number(d.rateChat)<5)e.rateChat="Min ₹5/min";
      if(!d.rateCall||Number(d.rateCall)<5)e.rateCall="Min ₹5/min";
      if(!d.slots.length)e.slots="Select at least one slot";
      if(!d.days.length)e.days="Select working days";
    }
    setErrs(e);
    return !Object.keys(e).length;
  }

  function next(){if(validate(step))setStep(s=>s+1);}
  function back(){setStep(s=>s-1);}

  function startCountdown(){
    setCountdown(30);
    clearInterval(cntRef.current);
    cntRef.current=setInterval(()=>setCountdown(c=>{if(c<=1){clearInterval(cntRef.current);return 0;}return c-1;}),1000);
  }
  function verifyOtp(){
    if(otpVal.trim()===generatedOtp){
      setOtpStep(false);setOtpVal("");setOtpErr("");
      setStep(1);
    }else{
      setOtpErr("Incorrect code. Please try again.");
    }
  }
  useEffect(()=>{
    function handleClickOutside(e){
      if(langRef.current&&!langRef.current.contains(e.target)){
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown",handleClickOutside);
    return()=>document.removeEventListener("mousedown",handleClickOutside);
  },[]);
  function handlePhoto(file){
    if(!file||!file.type.startsWith("image/"))return;
    const r=new FileReader();
    r.onload=e=>setF("photo",e.target.result);
    r.readAsDataURL(file);
  }

  async function submit(){
    setLoading(true);
    await new Promise(r=>setTimeout(r,2000));
    setLoading(false);
    onDone(d);
  }

  const iE=k=>({...ip,border:"1px solid "+(errs[k]?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")});

  return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"Georgia,serif",color:"#e8d5b7",position:"relative"}}>
      <style>{CSS}</style><Stars/>
      <div style={{position:"sticky",top:0,zIndex:100,background:"rgba(10,0,21,.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(200,150,50,.18)",padding:"0 16px",display:"flex",alignItems:"center",height:56}}>
        <button onClick={()=>step===0?onDone(null):back()} style={{background:"none",border:"none",color:"#8a7a6a",fontSize:17,cursor:"pointer",marginRight:11,padding:0}}>←</button>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:700,background:"linear-gradient(90deg,#e8d5b7,#ffd700,#a29bfe)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>✦ Astrologer Onboarding</div>
          <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif"}}>Step {step+1}/{STEPS.length} - {STEPS[step]}</div>
        </div>
        <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif",background:"rgba(255,71,87,.08)",padding:"3px 9px",borderRadius:7,border:"1px solid rgba(255,71,87,.15)"}}>🔒 Partner Only</div>
      </div>

      <div style={{maxWidth:440,margin:"0 auto",padding:"16px 15px 50px",position:"relative",zIndex:1}}>
        <ProgressBar step={step} steps={STEPS}/>

        {step===0&&(
          <div style={{animation:"floatIn .4s ease"}}>
            <div style={{textAlign:"center",marginBottom:14}}><div style={{fontSize:26,marginBottom:5}}>👤</div><div style={{fontSize:16,fontWeight:700,color:G}}>Create Your Account</div></div>
            {[["FULL NAME *","name","text","Your full name"],["EMAIL *","email","email","your@email.com"]].map(([l,k,t,ph])=>(
              <div key={k} style={{marginBottom:11}}>
                <label style={lbl}>{l}</label>
                <input type={t} value={d[k]} onChange={e=>setF(k,e.target.value)} placeholder={ph} style={iE(k)}/>
                <Err m={errs[k]}/>
              </div>
            ))}
            <div style={{marginBottom:11}}>
              <label style={lbl}>GENDER</label>
              <div style={{display:"flex",gap:7}}>
                {["male","female","other"].map(g=>(
                  <div key={g} onClick={()=>setF("gender",g)} style={{flex:1,padding:"9px",textAlign:"center",borderRadius:10,border:"1px solid "+(d.gender===g?"rgba(255,215,0,.5)":"rgba(200,150,50,.2)"),background:d.gender===g?"rgba(255,215,0,.1)":"transparent",cursor:"pointer",fontFamily:"sans-serif",fontSize:12,color:d.gender===g?G:"#8a7a6a",transition:"all .18s"}}>
                    {g==="male"?"👨 Male":g==="female"?"👩 Female":"🧑 Other"}
                  </div>
                ))}
              </div>
            </div>
            <AddressFields d={d} setF={setF} errs={errs} ipStyle={ip} lblStyle={lbl} ErrComp={Err}/>
            <div style={{marginBottom:11}}>
              <label style={lbl}>PHONE NUMBER *</label>
              <PhoneInput value={d.phone||""} onChange={v=>setF("phone",v)} error={errs.phone} ipStyle={ip} syncCountry={d.country}/>
              <Err m={errs.phone}/>
            </div>
            <div style={{marginBottom:4}}>
              <label style={lbl}>PASSWORD *</label>
              <div style={{position:"relative"}}>
                <input type={showPw?"text":"password"} value={d.pw} onChange={e=>setF("pw",e.target.value)} placeholder="Min 8 characters" style={{...iE("pw"),paddingRight:40}}/>
                <span onClick={()=>setShowPw(v=>!v)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",cursor:"pointer",color:"#8a7a6a",fontSize:14}}>{showPw?"🙈":"👁"}</span>
              </div>
              <Err m={errs.pw}/>
            </div>
            <PwStrength pw={d.pw}/>
            <div style={{marginBottom:11}}>
              <label style={lbl}>CONFIRM PASSWORD *</label>
              <input type="password" value={d.pw2} onChange={e=>setF("pw2",e.target.value)} placeholder="Repeat password" style={iE("pw2")}/>
              <Err m={errs.pw2}/>
            </div>
            <div style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:errs.agreed?4:14,cursor:"pointer"}} onClick={()=>setF("agreed",!d.agreed)}>
              <div style={{width:17,height:17,borderRadius:4,border:"2px solid "+(d.agreed?G:"rgba(200,150,50,.3)"),background:d.agreed?"rgba(255,215,0,.12)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>{d.agreed&&<span style={{fontSize:10,color:G}}>✓</span>}</div>
              <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.5}}>I agree to <span style={{color:G}}>Astrologer Terms</span>, <span style={{color:G}}>Code of Conduct</span> &amp; <span style={{color:G}}>Privacy Policy</span></div>
            </div>
            <Err m={errs.agreed}/>
            <button style={{...bG,width:"100%",padding:13,marginTop:8}} onClick={()=>{
              if(validate(0)){
                const otp=String(Math.floor(100000+Math.random()*900000));
                setGeneratedOtp(otp);setOtpStep(true);startCountdown();
                console.log("Astrologer OTP (demo):",otp);
              }
            }}>Continue → Verify Phone</button>
          </div>
        )}

        {step===1&&(
          <div style={{animation:"floatIn .4s ease"}}>
            <div style={{textAlign:"center",marginBottom:14}}><div style={{fontSize:26,marginBottom:5}}>📸</div><div style={{fontSize:16,fontWeight:700,color:G,marginBottom:3}}>Upload Your Photo</div><div style={{fontSize:12,color:"#8a7a6a",fontFamily:"sans-serif"}}>A real photo increases bookings by <strong style={{color:"#00b894"}}>3×</strong></div></div>
            <div onClick={()=>fileRef.current.click()} style={{border:"2px dashed rgba(200,150,50,.35)",borderRadius:16,padding:"22px 18px",textAlign:"center",cursor:"pointer",marginBottom:12}}>
              {d.photo
                ?<img src={d.photo} alt="You" style={{width:90,height:90,borderRadius:"50%",objectFit:"cover",border:"3px solid rgba(255,215,0,.4)",margin:"0 auto 8px",display:"block"}}/>
                :<div style={{marginBottom:7}}>
                   <img src={avUrl(d.name||"preview",d.gender)} style={{width:76,height:76,borderRadius:"50%",border:"3px dashed rgba(255,215,0,.2)",margin:"0 auto 6px",display:"block",opacity:.55}} alt=""/>
                   <div style={{fontSize:11,color:"#5a4a3a",fontFamily:"sans-serif"}}>Auto-preview - upload your real photo below</div>
                 </div>
              }
              <div style={{fontSize:13,color:d.photo?"#00b894":"#c8a060",fontFamily:"sans-serif",fontWeight:600}}>{d.photo?"✓ Photo uploaded - tap to change":"📸 Tap to Upload Photo"}</div>
              <div style={{fontSize:11,color:"#636e72",fontFamily:"sans-serif",marginTop:3}}>JPG, PNG · Max 5MB · Min 300×300px</div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={e=>handlePhoto(e.target.files[0])}/>
            <div style={{...cd,background:"rgba(0,184,148,.06)",border:"1px solid rgba(0,184,148,.18)",marginBottom:13}}>
              <div style={{fontSize:12,color:"#00b894",fontFamily:"sans-serif",fontWeight:600,marginBottom:6}}>📋 Photo Guidelines</div>
              {[["✅","Clear headshot - face fully visible"],["✅","Good lighting, plain or simple background"],["✅","Traditional attire preferred (saffron, white)"],["❌","No sunglasses, heavy filters, or group photos"]].map(([ic,t])=>(
                <div key={t} style={{display:"flex",gap:7,marginBottom:4}}><span style={{fontSize:11,flexShrink:0}}>{ic}</span><div style={{fontSize:11,color:"#c8b090",fontFamily:"sans-serif",lineHeight:1.4}}>{t}</div></div>
              ))}
            </div>
            <div style={{display:"flex",gap:9}}>
              <button style={{...bO,flex:1}} onClick={back}>← Back</button>
              <button style={{...bG,flex:2}} onClick={()=>setStep(2)}>{d.photo?"Continue →":"Skip for now →"}</button>
            </div>
            {!d.photo&&<div style={{fontSize:11,color:"#fdcb6e",fontFamily:"sans-serif",marginTop:6,textAlign:"center"}}>⚠ Profiles without photos get 3× fewer consultations</div>}
          </div>
        )}

        {step===2&&(
          <div style={{animation:"floatIn .4s ease"}}>
            <div style={{textAlign:"center",marginBottom:14}}><div style={{fontSize:26,marginBottom:5}}>⭐</div><div style={{fontSize:16,fontWeight:700,color:G}}>Your Expertise</div></div>
            <div style={{marginBottom:12}}>
              <label style={lbl}>SPECIALITIES * (up to 5)</label>
              <Tags opts={SPECS} sel={d.specs} onToggle={(v,on)=>{if(on)setF("specs",d.specs.filter(x=>x!==v));else if(d.specs.length<5)setF("specs",[...d.specs,v]);}}/>
              <Err m={errs.specs}/>
            </div>
            <div style={{marginBottom:12}}>
              <label style={lbl}>LANGUAGES * {d.country&&<span style={{color:"#a29bfe",fontSize:9,letterSpacing:0}}>- showing {d.country} languages first</span>}</label>
              <div ref={langRef} style={{position:"relative",marginBottom:7}}>
                <div style={{position:"relative"}}>
                  <input
                    value={langSearch}
                    onChange={e=>{setLangSearch(e.target.value);setLangOpen(true);}}
                    onFocus={()=>setLangOpen(true)}
                    placeholder="Type to search or click to browse..."
                    style={{...ip,paddingRight:32,fontSize:12,cursor:"pointer"}}
                  />
                  <span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",cursor:"pointer",color:"#8a7a6a",fontSize:12,pointerEvents:"none"}}>{langOpen?"▲":"▼"}</span>
                </div>
                {/* Floating dropdown - only when open */}
                {langOpen&&(
                  <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"#0a0818",border:"1px solid rgba(200,150,50,.35)",borderRadius:11,maxHeight:220,overflowY:"auto",zIndex:200,boxShadow:"0 8px 32px rgba(0,0,0,.7)"}}>
                {getLangsForCountry(d.country)
                  .filter(l=>l.toLowerCase().includes(langSearch.toLowerCase()))
                  .map((l,idx)=>{
                    const selected=d.langs.includes(l);
                    const isPriority=d.country&&(COUNTRY_LANGS[d.country]||[]).includes(l);
                    return(
                      <div key={l} onClick={()=>setF("langs",selected?d.langs.filter(x=>x!==l):[...d.langs,l])}
                        style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 13px",borderBottom:"1px solid rgba(200,150,50,.07)",cursor:"pointer",background:selected?"rgba(255,215,0,.07)":"transparent",transition:"background .15s"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          {isPriority&&<span style={{fontSize:8,color:"#a29bfe",fontFamily:"sans-serif",background:"rgba(162,155,254,.1)",padding:"1px 5px",borderRadius:4}}>LOCAL</span>}
                          <span style={{fontSize:13,color:selected?G:"#e8d5b7",fontFamily:"sans-serif",fontWeight:selected?600:400}}>{l}</span>
                        </div>
                        {selected&&<span style={{color:G,fontSize:14}}>✓</span>}
                      </div>
                    );
                  })
                  }
                  </div>
                )}
              </div>
              {/* Selected chips - shown below input always */}
              {d.langs.length>0&&(
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
                  {d.langs.map(l=>(
                    <div key={l} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:16,background:"rgba(255,215,0,.12)",border:"1px solid rgba(255,215,0,.4)",fontSize:11,fontFamily:"sans-serif",color:G}}>
                      {l}
                      <span onClick={()=>setF("langs",d.langs.filter(x=>x!==l))} style={{cursor:"pointer",fontSize:13,color:"#c8a060",lineHeight:1,marginLeft:2}}>×</span>
                    </div>
                  ))}
                </div>
              )}
              <Err m={errs.langs}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:12}}>
              <div>
                <label style={lbl}>EXPERIENCE *</label>
                <select value={d.exp} onChange={e=>setF("exp",e.target.value)} style={{...iE("exp"),cursor:"pointer",color:"#e8d5b7",background:"#0d0a1a"}}>
                  <option value="">Select</option>
                  {["1-2 yrs","3-5 yrs","5-10 yrs","10-15 yrs","15-20 yrs","20+ yrs"].map(v=><option key={v}>{v}</option>)}
                </select>
                <Err m={errs.exp}/>
              </div>
              <div>
                <label style={lbl}>QUALIFICATION</label>
                <select value={d.qual||""} onChange={e=>setF("qual",e.target.value)} style={{...ip,cursor:"pointer",color:"#e8d5b7",background:"#0d0a1a"}}>
                  <option value="">Select</option>
                  {["Family tradition","Diploma","Certificate","B.A.","M.A. Jyotish","Ph.D.","Self-taught"].map(v=><option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <div style={{marginBottom:14}}>
              <label style={lbl}>BIO * ({d.bio?.length||0}/500 · min 60 chars)</label>
              <textarea value={d.bio||""} onChange={e=>setF("bio",e.target.value.slice(0,500))} placeholder="Describe your expertise, approach and what makes your consultations unique…" style={{...iE("bio"),height:95,resize:"none",display:"block"}}/>
              <Err m={errs.bio}/>
            </div>
            <div style={{display:"flex",gap:9}}>
              <button style={{...bO,flex:1}} onClick={back}>← Back</button>
              <button style={{...bG,flex:2}} onClick={next}>Continue → Rates</button>
            </div>
          </div>
        )}

        {step===3&&(
          <div style={{animation:"floatIn .4s ease"}}>
            <div style={{textAlign:"center",marginBottom:14}}><div style={{fontSize:26,marginBottom:5}}>💰</div><div style={{fontSize:16,fontWeight:700,color:G,marginBottom:3}}>Set Your Rates</div><div style={{fontSize:12,color:"#8a7a6a",fontFamily:"sans-serif"}}>You keep 70% · MiraXAstro takes 30% platform fee</div></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:11}}>
              {[["💬","Chat ₹/min","rateChat"],["📞","Call ₹/min","rateCall"]].map(([ic,l,k])=>(
                <div key={k} style={{...cd,marginBottom:0}}>
                  <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",marginBottom:5}}>{ic} {l}</div>
                  <div style={{display:"flex",alignItems:"center",gap:3}}>
                    <span style={{fontSize:14,color:G}}>₹</span>
                    <input type="number" min={5} value={d[k]||""} onChange={e=>setF(k,e.target.value)} placeholder="25" style={{...iE(k),flex:1,padding:"9px",fontSize:16,fontWeight:700,color:G,textAlign:"center"}}/>
                  </div>
                  <Err m={errs[k]}/>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:7,marginBottom:11}}>
              {[["Beginner","₹10-25",15,20],["Mid-level","₹25-50",30,40],["Expert","₹50-200",75,100]].map(([l,r,c,ca])=>(
                <div key={l} onClick={()=>{setF("rateChat",String(c));setF("rateCall",String(ca));}} style={{flex:1,background:"rgba(0,184,148,.08)",border:"1px solid rgba(0,184,148,.2)",borderRadius:9,padding:"8px 5px",textAlign:"center",cursor:"pointer"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#00b894",fontFamily:"sans-serif"}}>{l}</div>
                  <div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif"}}>{r}/min</div>
                </div>
              ))}
            </div>
            {Number(d.rateChat)>=5&&(
              <div style={{...cd,background:"rgba(255,215,0,.07)",border:"1px solid rgba(255,215,0,.22)",marginBottom:11,textAlign:"center"}}>
                <div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif",marginBottom:2}}>EST. MONTHLY EARNINGS</div>
                <div style={{fontSize:20,fontWeight:700,color:G}}>₹{Math.round(Number(d.rateChat)*.7*6*22).toLocaleString("en-IN")}+</div>
                <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif"}}>6 hrs/day · 22 days · 70% your share</div>
              </div>
            )}
            <div style={{marginBottom:11}}>
              <label style={lbl}>AVAILABLE HOURS *</label>
              <Tags opts={SLOTS} sel={d.slots} onToggle={(v,on)=>setF("slots",on?d.slots.filter(x=>x!==v):[...d.slots,v])}/>
              <Err m={errs.slots}/>
            </div>
            <div style={{marginBottom:11}}>
              <label style={lbl}>WORKING DAYS *</label>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day=>{
                  const on=d.days.includes(day);
                  return(
                    <div key={day} onClick={()=>setF("days",on?d.days.filter(v=>v!==day):[...d.days,day])} style={{width:39,height:39,borderRadius:9,border:"1px solid "+(on?"rgba(255,215,0,.5)":"rgba(200,150,50,.2)"),background:on?"rgba(255,215,0,.12)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontFamily:"sans-serif",color:on?G:"#8a7a6a",cursor:"pointer",fontWeight:on?700:400}}>
                      {day}
                    </div>
                  );
                })}
              </div>
              <Err m={errs.days}/>
            </div>
            <div style={{...cd,marginBottom:13,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}} onClick={()=>setF("freeFirst",!d.freeFirst)}>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:"#e8d5b7",fontFamily:"sans-serif"}}>🎁 Free First Minute</div>
                <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",marginTop:1}}>Increases new customer conversions by 40%</div>
              </div>
              <div style={{width:38,height:21,borderRadius:10,background:d.freeFirst?"rgba(0,184,148,.3)":"rgba(255,255,255,.08)",border:"1px solid "+(d.freeFirst?"rgba(0,184,148,.5)":"rgba(200,150,50,.2)"),position:"relative",flexShrink:0}}>
                <div style={{width:15,height:15,borderRadius:"50%",background:d.freeFirst?"#00b894":"#636e72",position:"absolute",top:2,left:d.freeFirst?19:3,transition:"all .25s"}}/>
              </div>
            </div>
            <div style={{display:"flex",gap:9}}>
              <button style={{...bO,flex:1}} onClick={back}>← Back</button>
              <button style={{...bG,flex:2}} onClick={next}>Continue → Banking</button>
            </div>
          </div>
        )}


        {step===4&&(
          <div style={{animation:"floatIn .4s ease"}}>
            <div style={{textAlign:"center",marginBottom:14}}>
              <div style={{fontSize:26,marginBottom:5}}>🏦</div>
              <div style={{fontSize:16,fontWeight:700,color:G,marginBottom:3}}>Bank Details</div>
              <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.6}}>Your earnings will be paid to this account weekly · All details are encrypted and secure</div>
            </div>

            {/* Country selector for bank */}
            <div style={{marginBottom:12}}>
              <label style={lbl}>COUNTRY OF BANK ACCOUNT *</label>
              <select value={d.bankCountry||d.country||""} onChange={e=>setF("bankCountry",e.target.value)} style={{...ip,cursor:"pointer",background:"#0d0a1a",border:"1px solid "+(errs.bankCountry?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}>
                <option value="">Select country</option>
                {["India","Australia","United Kingdom","United States","Canada","Singapore","UAE","New Zealand","Germany","France","Other"].map(c=><option key={c}>{c}</option>)}
              </select>
              <Err m={errs.bankCountry}/>
            </div>

            {/* Common fields for all countries */}
            {(d.bankCountry||d.country)&&(
              <div>
                <div style={{marginBottom:11}}>
                  <label style={lbl}>ACCOUNT HOLDER NAME *</label>
                  <input value={d.accountName||""} onChange={e=>setF("accountName",e.target.value)} placeholder="Full name as on bank account" style={{...ip,border:"1px solid "+(errs.accountName?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
                  <Err m={errs.accountName}/>
                </div>
                <div style={{marginBottom:11}}>
                  <label style={lbl}>BANK ACCOUNT NUMBER *</label>
                  <input value={d.accountNum||""} onChange={e=>setF("accountNum",e.target.value.replace(/\s/g,""))} placeholder="Your bank account number" style={{...ip,border:"1px solid "+(errs.accountNum?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)"),fontFamily:"monospace",letterSpacing:1}}/>
                  <Err m={errs.accountNum}/>
                </div>

                {/* -- INDIA -- */}
                {(d.bankCountry||d.country)==="India"&&(
                  <div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:11}}>
                      <div>
                        <label style={lbl}>BANK NAME *</label>
                        <select value={d.bankName||""} onChange={e=>setF("bankName",e.target.value)} style={{...ip,cursor:"pointer",background:"#0d0a1a"}}>
                          <option value="">Select bank</option>
                          {["HDFC Bank","ICICI Bank","State Bank of India","Axis Bank","Kotak Mahindra","Punjab National Bank","Bank of Baroda","Canara Bank","Union Bank","IndusInd Bank","Yes Bank","IDBI Bank","Federal Bank","South Indian Bank","Other"].map(b=><option key={b}>{b}</option>)}
                        </select>
                        <Err m={errs.bankName}/>
                      </div>
                      <div>
                        <label style={lbl}>BRANCH NAME</label>
                        <input value={d.branchName||""} onChange={e=>setF("branchName",e.target.value)} placeholder="e.g. Andheri West" style={ip}/>
                      </div>
                    </div>
                    <div style={{marginBottom:11}}>
                      <label style={lbl}>IFSC CODE *</label>
                      <input value={d.ifsc||""} onChange={e=>setF("ifsc",e.target.value.toUpperCase().slice(0,11))} placeholder="e.g. HDFC0001234" style={{...ip,fontFamily:"monospace",letterSpacing:2,border:"1px solid "+(errs.ifsc?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
                      <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif",marginTop:3}}>11-character code found on your cheque book or bank statement</div>
                      <Err m={errs.ifsc}/>
                    </div>
                    <div style={{marginBottom:11}}>
                      <label style={lbl}>PAN NUMBER *</label>
                      <input value={d.panNum||""} onChange={e=>setF("panNum",e.target.value.toUpperCase().slice(0,10))} placeholder="e.g. ABCDE1234F" style={{...ip,fontFamily:"monospace",letterSpacing:2,border:"1px solid "+(errs.panNum?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
                      <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif",marginTop:3}}>Required for tax compliance - payments above ₹50,000/year</div>
                      <Err m={errs.panNum}/>
                    </div>
                  </div>
                )}

                {/* -- AUSTRALIA -- */}
                {(d.bankCountry||d.country)==="Australia"&&(
                  <div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:11}}>
                      <div>
                        <label style={lbl}>BANK NAME *</label>
                        <select value={d.bankName||""} onChange={e=>setF("bankName",e.target.value)} style={{...ip,cursor:"pointer",background:"#0d0a1a"}}>
                          <option value="">Select bank</option>
                          {["Commonwealth Bank","ANZ","Westpac","NAB","Bendigo Bank","Macquarie Bank","ING Australia","HSBC Australia","Citibank Australia","Suncorp","Bank of Queensland","Other"].map(b=><option key={b}>{b}</option>)}
                        </select>
                        <Err m={errs.bankName}/>
                      </div>
                      <div>
                        <label style={lbl}>BSB NUMBER *</label>
                        <input value={d.bsb||""} onChange={e=>setF("bsb",e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="e.g. 062000" style={{...ip,fontFamily:"monospace",letterSpacing:2,border:"1px solid "+(errs.bsb?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
                        <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif",marginTop:3}}>6-digit Bank State Branch number</div>
                        <Err m={errs.bsb}/>
                      </div>
                    </div>
                    <div style={{marginBottom:11}}>
                      <label style={lbl}>ABN (if registered business)</label>
                      <input value={d.taxId||""} onChange={e=>setF("taxId",e.target.value.replace(/\D/g,"").slice(0,11))} placeholder="11-digit ABN (optional)" style={{...ip,fontFamily:"monospace",letterSpacing:1}}/>
                    </div>
                  </div>
                )}

                {/* -- UNITED KINGDOM -- */}
                {(d.bankCountry||d.country)==="United Kingdom"&&(
                  <div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:11}}>
                      <div>
                        <label style={lbl}>BANK NAME *</label>
                        <select value={d.bankName||""} onChange={e=>setF("bankName",e.target.value)} style={{...ip,cursor:"pointer",background:"#0d0a1a"}}>
                          <option value="">Select bank</option>
                          {["Barclays","HSBC UK","NatWest","Lloyds Bank","Santander UK","Halifax","Nationwide","Monzo","Starling Bank","TSB","Metro Bank","Other"].map(b=><option key={b}>{b}</option>)}
                        </select>
                        <Err m={errs.bankName}/>
                      </div>
                      <div>
                        <label style={lbl}>SORT CODE *</label>
                        <input value={d.sortCode||""} onChange={e=>setF("sortCode",e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="e.g. 200000" style={{...ip,fontFamily:"monospace",letterSpacing:2,border:"1px solid "+(errs.sortCode?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
                        <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif",marginTop:3}}>6-digit sort code</div>
                        <Err m={errs.sortCode}/>
                      </div>
                    </div>
                  </div>
                )}

                {/* -- UNITED STATES -- */}
                {(d.bankCountry||d.country)==="United States"&&(
                  <div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:11}}>
                      <div>
                        <label style={lbl}>BANK NAME *</label>
                        <select value={d.bankName||""} onChange={e=>setF("bankName",e.target.value)} style={{...ip,cursor:"pointer",background:"#0d0a1a"}}>
                          <option value="">Select bank</option>
                          {["Chase","Bank of America","Wells Fargo","Citibank","US Bank","Truist","PNC Bank","Capital One","TD Bank","BB&T","Other"].map(b=><option key={b}>{b}</option>)}
                        </select>
                        <Err m={errs.bankName}/>
                      </div>
                      <div>
                        <label style={lbl}>ROUTING NUMBER *</label>
                        <input value={d.routingNum||""} onChange={e=>setF("routingNum",e.target.value.replace(/\D/g,"").slice(0,9))} placeholder="9-digit routing number" style={{...ip,fontFamily:"monospace",letterSpacing:2,border:"1px solid "+(errs.routingNum?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
                        <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif",marginTop:3}}>9-digit ABA routing number</div>
                        <Err m={errs.routingNum}/>
                      </div>
                    </div>
                    <div style={{marginBottom:11}}>
                      <label style={lbl}>SSN / ITIN (last 4 digits for tax)</label>
                      <input value={d.taxId||""} onChange={e=>setF("taxId",e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="Last 4 digits only" style={{...ip,fontFamily:"monospace",letterSpacing:2}}/>
                    </div>
                  </div>
                )}

                {/* -- CANADA -- */}
                {(d.bankCountry||d.country)==="Canada"&&(
                  <div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:11}}>
                      <div>
                        <label style={lbl}>BANK NAME *</label>
                        <select value={d.bankName||""} onChange={e=>setF("bankName",e.target.value)} style={{...ip,cursor:"pointer",background:"#0d0a1a"}}>
                          <option value="">Select bank</option>
                          {["RBC Royal Bank","TD Canada Trust","Scotiabank","BMO","CIBC","National Bank","HSBC Canada","Desjardins","Other"].map(b=><option key={b}>{b}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={lbl}>TRANSIT + INSTITUTION *</label>
                        <input value={d.routingNum||""} onChange={e=>setF("routingNum",e.target.value.replace(/\D/g,"").slice(0,8))} placeholder="5+3 digit code" style={{...ip,fontFamily:"monospace",letterSpacing:2,border:"1px solid "+(errs.routingNum?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
                        <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif",marginTop:3}}>5-digit transit + 3-digit institution</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* -- SINGAPORE / UAE / NEW ZEALAND -- */}
                {["Singapore","UAE","New Zealand"].includes(d.bankCountry||d.country)&&(
                  <div>
                    <div style={{marginBottom:11}}>
                      <label style={lbl}>BANK NAME *</label>
                      <input value={d.bankName||""} onChange={e=>setF("bankName",e.target.value)} placeholder="Your bank name" style={{...ip,border:"1px solid "+(errs.bankName?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
                      <Err m={errs.bankName}/>
                    </div>
                    <div style={{marginBottom:11}}>
                      <label style={lbl}>SWIFT / BIC CODE *</label>
                      <input value={d.swiftBic||""} onChange={e=>setF("swiftBic",e.target.value.toUpperCase().slice(0,11))} placeholder="e.g. DBSSSGSG" style={{...ip,fontFamily:"monospace",letterSpacing:2,border:"1px solid "+(errs.swiftBic?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
                      <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif",marginTop:3}}>8 or 11 character SWIFT/BIC code</div>
                      <Err m={errs.swiftBic}/>
                    </div>
                  </div>
                )}

                {/* -- GERMANY / FRANCE / EU -- */}
                {["Germany","France"].includes(d.bankCountry||d.country)&&(
                  <div>
                    <div style={{marginBottom:11}}>
                      <label style={lbl}>BANK NAME *</label>
                      <input value={d.bankName||""} onChange={e=>setF("bankName",e.target.value)} placeholder="Your bank name" style={{...ip,border:"1px solid "+(errs.bankName?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
                      <Err m={errs.bankName}/>
                    </div>
                    <div style={{marginBottom:11}}>
                      <label style={lbl}>IBAN *</label>
                      <input value={d.iban||""} onChange={e=>setF("iban",e.target.value.toUpperCase().replace(/\s/g,"").slice(0,34))} placeholder="e.g. DE89370400440532013000" style={{...ip,fontFamily:"monospace",letterSpacing:1,border:"1px solid "+(errs.iban?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
                      <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif",marginTop:3}}>International Bank Account Number (up to 34 chars)</div>
                      <Err m={errs.iban}/>
                    </div>
                    <div style={{marginBottom:11}}>
                      <label style={lbl}>SWIFT / BIC CODE</label>
                      <input value={d.swiftBic||""} onChange={e=>setF("swiftBic",e.target.value.toUpperCase().slice(0,11))} placeholder="e.g. DEUTDEDB" style={{...ip,fontFamily:"monospace",letterSpacing:2}}/>
                    </div>
                  </div>
                )}

                {/* -- OTHER COUNTRIES -- */}
                {(d.bankCountry||d.country)==="Other"&&(
                  <div>
                    <div style={{marginBottom:11}}>
                      <label style={lbl}>BANK NAME *</label>
                      <input value={d.bankName||""} onChange={e=>setF("bankName",e.target.value)} placeholder="Your bank name" style={{...ip,border:"1px solid "+(errs.bankName?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
                      <Err m={errs.bankName}/>
                    </div>
                    <div style={{marginBottom:11}}>
                      <label style={lbl}>SWIFT / BIC CODE *</label>
                      <input value={d.swiftBic||""} onChange={e=>setF("swiftBic",e.target.value.toUpperCase().slice(0,11))} placeholder="8 or 11 character SWIFT code" style={{...ip,fontFamily:"monospace",letterSpacing:2,border:"1px solid "+(errs.swiftBic?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
                      <Err m={errs.swiftBic}/>
                    </div>
                    <div style={{marginBottom:11}}>
                      <label style={lbl}>IBAN (if applicable)</label>
                      <input value={d.iban||""} onChange={e=>setF("iban",e.target.value.toUpperCase().replace(/\s/g,""))} placeholder="International Bank Account Number" style={{...ip,fontFamily:"monospace",letterSpacing:1}}/>
                    </div>
                  </div>
                )}

                {/* Security note */}
                <div style={{...cd,background:"rgba(0,184,148,.06)",border:"1px solid rgba(0,184,148,.18)",marginBottom:12}}>
                  <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                    <span style={{fontSize:16}}>🔒</span>
                    <div style={{fontSize:11,color:"#c8b090",fontFamily:"sans-serif",lineHeight:1.6}}>Your bank details are encrypted and stored securely. They are only used to process your weekly earnings payments. MiraXAstro will never share your banking information with third parties.</div>
                  </div>
                </div>
              </div>
            )}

            <div style={{display:"flex",gap:9}}>
              <button style={{...bO,flex:1}} onClick={()=>setStep(3)}>← Back</button>
              <button style={{...bG,flex:2}} onClick={()=>{
                const e={};
                const bc=d.bankCountry||d.country;
                if(!bc)e.bankCountry="Select a country";
                if(!d.accountName||!d.accountName.trim())e.accountName="Required";
                if(!d.accountNum||!d.accountNum.trim())e.accountNum="Required";
                if(bc==="India"){if(!d.ifsc||d.ifsc.length!==11)e.ifsc="Must be 11 characters";if(!d.panNum||d.panNum.length!==10)e.panNum="Must be 10 characters";}
                if(bc==="Australia"&&(!d.bsb||d.bsb.length!==6))e.bsb="Must be 6 digits";
                if(bc==="United Kingdom"&&(!d.sortCode||d.sortCode.length!==6))e.sortCode="Must be 6 digits";
                if(["United States","Canada"].includes(bc)&&(!d.routingNum||d.routingNum.length<8))e.routingNum="Invalid routing number";
                if(["Singapore","UAE","New Zealand","Other"].includes(bc)&&(!d.swiftBic||d.swiftBic.length<8))e.swiftBic="Must be 8-11 characters";
                if(["Germany","France"].includes(bc)&&(!d.iban||d.iban.length<15))e.iban="Invalid IBAN";
                if(!d.bankName&&bc!=="Other")e.bankName="Select your bank";
                if(Object.keys(e).length){setErrs(e);return;}
                setStep(5);
              }}>Continue → Review</button>
            </div>
          </div>
        )}
        {step===5&&(
          <div style={{animation:"floatIn .4s ease"}}>
            <div style={{textAlign:"center",marginBottom:14}}><div style={{fontSize:26,marginBottom:5}}>📋</div><div style={{fontSize:16,fontWeight:700,color:G,marginBottom:3}}>Review &amp; Submit</div></div>
            <div style={{...cd,background:"linear-gradient(135deg,rgba(108,92,231,.12),rgba(10,0,21,.9))",border:"1px solid rgba(162,155,254,.25)",textAlign:"center",padding:18,marginBottom:13}}>
              {d.photo
                ?<img src={d.photo} alt={d.name} style={{width:70,height:70,borderRadius:"50%",objectFit:"cover",border:"3px solid rgba(255,215,0,.4)",display:"block",margin:"0 auto 9px"}}/>
                :<img src={avUrl(d.name||"p",d.gender)} style={{width:70,height:70,borderRadius:"50%",border:"3px solid rgba(255,215,0,.25)",display:"block",margin:"0 auto 9px",opacity:.75}} alt=""/>
              }
              <div style={{fontSize:14,fontWeight:700,color:"#e8d5b7"}}>{d.name||"Your Name"}</div>
              <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",marginTop:2,marginBottom:7}}>{d.specs.slice(0,2).join(" · ")||"Astrologer"} · {d.exp||"-"}</div>
              <div style={{display:"flex",justifyContent:"center",gap:6,flexWrap:"wrap"}}>
                {["💬 ₹"+(d.rateChat||"-")+"/min","📞 ₹"+(d.rateCall||"-")+"/min",(d.langs[0]||"-")].map(v=>(
                  <div key={v} style={{fontSize:10,fontFamily:"sans-serif",color:"#8a7a6a",background:"rgba(255,255,255,.05)",padding:"3px 8px",borderRadius:8}}>{v}</div>
                ))}
              </div>
            </div>
            {[["👤 Account",[["Name",d.name],["Email",d.email],["Phone",d.phone],["Address",(d.addr1?d.addr1+", ":"")+( d.city?d.city+", ":"")+( d.country||"")],["Postcode",d.postcode||"-"]]],["📸 Photo",[["Profile Photo",d.photo?"Uploaded ✓":"Not uploaded (avatar used)"]]],["⭐ Expertise",[["Specialities",d.specs.join(", ")||"-"],["Languages",d.langs.join(", ")||"-"],["Experience",d.exp||"-"]]],["💰 Rates",[["Chat","₹"+(d.rateChat||"-")+"/min"],["Call","₹"+(d.rateCall||"-")+"/min"],["Working Days",d.days.join(", ")||"-"],["Free First Min",d.freeFirst?"Yes ✓":"No"]]],["🏦 Banking",[["Account Name",d.accountName||"-"],["Bank",d.bankName||"-"],["Account No","****"+(d.accountNum?d.accountNum.slice(-4):"-")],["Country",d.bankCountry||d.country||"-"],(d.ifsc?["IFSC",d.ifsc]:null),(d.bsb?["BSB",d.bsb]:null),(d.sortCode?["Sort Code",d.sortCode]:null),(d.routingNum?["Routing No",d.routingNum]:null),(d.iban?["IBAN","****"+d.iban.slice(-4)]:null),(d.swiftBic?["SWIFT/BIC",d.swiftBic]:null)].filter(Boolean)]].map(([title,items])=>(
              <div key={title} style={{...cd,marginBottom:9}}>
                <div style={{fontSize:12,fontWeight:700,color:G,marginBottom:8,fontFamily:"sans-serif"}}>{title}</div>
                {items.map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid rgba(200,150,50,.07)"}}>
                    <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif"}}>{k}</div>
                    <div style={{fontSize:11,color:v?.includes("✓")?"#00b894":"#e8d5b7",fontFamily:"sans-serif",fontWeight:600,textAlign:"right",maxWidth:"60%"}}>{v}</div>
                  </div>
                ))}
              </div>
            ))}
            <div style={{...cd,background:"rgba(255,215,0,.06)",border:"1px solid rgba(255,215,0,.2)",marginBottom:13}}>
              <div style={{fontSize:12,fontWeight:700,color:G,marginBottom:8}}>📋 What happens next?</div>
              {[["1","Profile reviewed in 24-48 hours"],["2","Verification call if needed"],["3","Approved → profile live to customers"],["4","Start earning immediately!"]].map(([n,t])=>(
                <div key={n} style={{display:"flex",gap:8,marginBottom:6}}>
                  <div style={{width:17,height:17,borderRadius:"50%",background:"rgba(255,215,0,.15)",border:"1px solid rgba(255,215,0,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:G,fontFamily:"sans-serif",fontWeight:700,flexShrink:0}}>{n}</div>
                  <div style={{fontSize:12,color:"#c8b090",fontFamily:"sans-serif",lineHeight:1.5}}>{t}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:9}}>
              <button style={{...bO,flex:1}} onClick={back}>← Back</button>
              <button disabled={loading} style={{...bG,flex:2,display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={submit}>
                {loading&&<Sp size={15}/>}{loading?"Submitting…":"🚀 Submit for Approval"}
              </button>
            </div>
          </div>
        )}
      </div>
      {otpStep&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.9)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"linear-gradient(180deg,#0f0025,#0a0018)",border:"1px solid rgba(255,215,0,.25)",borderRadius:20,padding:"26px 20px",width:"100%",maxWidth:380,animation:"floatIn .4s ease"}}>
            <div style={{textAlign:"center",marginBottom:18}}>
              <div style={{fontSize:36,marginBottom:8}}>📱</div>
              <div style={{fontSize:18,fontWeight:700,color:G,marginBottom:4}}>Verify Your Phone</div>
              <div style={{fontSize:12,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.6}}>A 6-digit code has been sent to<br/><strong style={{color:"#e8d5b7"}}>{d.phone}</strong></div>
              <div style={{fontSize:10,color:"#a29bfe",fontFamily:"sans-serif",marginTop:6,background:"rgba(162,155,254,.08)",padding:"4px 10px",borderRadius:8,display:"inline-block"}}>Demo mode - check browser console for OTP</div>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1.2,marginBottom:6}}>ENTER 6-DIGIT CODE</div>
              <input value={otpVal} onChange={e=>setOtpVal(e.target.value.replace(/\D/g,"").slice(0,6))} onKeyDown={e=>e.key==="Enter"&&verifyOtp()} placeholder="_ _ _ _ _ _" maxLength={6} style={{width:"100%",background:"rgba(255,255,255,.06)",border:"1px solid rgba(200,150,50,.28)",borderRadius:11,padding:"14px 13px",color:G,fontFamily:"sans-serif",fontSize:24,fontWeight:700,textAlign:"center",letterSpacing:8,outline:"none",boxSizing:"border-box"}}/>
              {otpErr&&<div style={{fontSize:11,color:"#ff4757",fontFamily:"sans-serif",marginTop:4}}>⚠ {otpErr}</div>}
            </div>
            <button onClick={verifyOtp} disabled={otpVal.length!==6} style={{...bG,width:"100%",padding:13,fontSize:15,marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>✓ Verify & Continue</button>
            <div style={{textAlign:"center",marginBottom:10}}>
              {countdown>0
                ?<div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif"}}>Resend code in {countdown}s</div>
                :<button onClick={()=>{const otp=String(Math.floor(100000+Math.random()*900000));setGeneratedOtp(otp);setOtpVal("");setOtpErr("");startCountdown();console.log("New OTP:",otp);}} style={{background:"none",border:"none",color:G,fontFamily:"sans-serif",fontSize:12,cursor:"pointer",textDecoration:"underline"}}>Resend Code</button>
              }
            </div>
            <button onClick={()=>{setOtpStep(false);setOtpVal("");setOtpErr("");}} style={{...bO,width:"100%",padding:10,fontSize:12}}>← Change Phone Number</button>
          </div>
        </div>
      )}
    </div>
  );
}

// -- PENDING -------------------------------------------------------
function Pending({d,onDashboard}){
  return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"Georgia,serif",color:"#e8d5b7",position:"relative"}}>
      <style>{CSS}</style><Stars/>
      <div style={{position:"relative",zIndex:1,maxWidth:440,margin:"0 auto",padding:"28px 16px 40px",animation:"floatIn .4s ease"}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{width:74,height:74,borderRadius:"50%",background:"rgba(0,184,148,.12)",border:"3px solid #00b894",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:32,animation:"tick .5s ease"}}>✓</div>
          <div style={{fontSize:19,fontWeight:700,color:"#00b894",marginBottom:4}}>Profile Submitted!</div>
          <div style={{fontSize:12,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.7}}>Welcome, <strong style={{color:"#c8a060"}}>{d?.name?.split(" ")[0]||"Astrologer"}</strong>!<br/>Your profile is under review (24-48 hrs).</div>
        </div>
        <div style={{...cd,background:"linear-gradient(135deg,rgba(255,215,0,.08),rgba(10,0,21,.9))",border:"1px solid rgba(255,215,0,.25)"}}>
          <div style={{fontSize:13,fontWeight:700,color:G,marginBottom:14}}>📋 Application Status</div>
          {[["Profile Submitted",true,false,"Just now"],["Admin Review",false,true,"24-48 hrs"],["Verification Call",false,false,"If needed"],["Profile Goes Live!",false,false,"After approval"]].map(([label,done,active,time],i,arr)=>(
            <div key={i} style={{display:"flex",gap:10,marginBottom:i<arr.length-1?13:0,alignItems:"flex-start"}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
                <div style={{width:25,height:25,borderRadius:"50%",background:done?"rgba(0,184,148,.2)":active?"rgba(255,215,0,.15)":"rgba(255,255,255,.06)",border:"2px solid "+(done?"#00b894":active?G:"rgba(200,150,50,.2)"),display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>
                  {done?"✓":active?<Sp size={11}/>:i+1}
                </div>
                {i<arr.length-1&&<div style={{width:2,height:12,background:"rgba(200,150,50,.2)",marginTop:3}}/>}
              </div>
              <div style={{paddingTop:2}}>
                <div style={{fontSize:12,fontWeight:600,color:done?"#00b894":active?G:"#636e72",fontFamily:"sans-serif"}}>{label}</div>
                <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif",marginTop:1}}>{time}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{...cd,textAlign:"center"}}>
          {d?.photo?<img src={d.photo} alt={d?.name} style={{width:64,height:64,borderRadius:"50%",objectFit:"cover",border:"3px solid rgba(255,215,0,.4)",display:"block",margin:"0 auto 9px"}}/>:<img src={avUrl(d?.name||"a",d?.gender||"male")} style={{width:64,height:64,borderRadius:"50%",border:"3px solid rgba(255,215,0,.25)",display:"block",margin:"0 auto 9px",opacity:.75}} alt=""/>}
          <div style={{fontSize:14,fontWeight:700,color:"#e8d5b7"}}>{d?.name||"Your Name"}</div>
          <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",marginTop:2}}>{d?.specs?.slice(0,2).join(" · ")||"Astrologer"}</div>
        </div>
        <button style={{...bG,width:"100%",padding:13,fontSize:14}} onClick={onDashboard}>Go to Dashboard →</button>
      </div>
    </div>
  );
}

// -- DASHBOARD -----------------------------------------------------
function Dashboard({d}){
  const [showReport,setShowReport]=React.useState(false);
  const [reportCustomer,setReportCustomer]=React.useState("");
  const [reportReason,setReportReason]=React.useState("");
  const [reportDetails,setReportDetails]=React.useState("");
  const [reportSent,setReportSent]=React.useState(false);

  const RECENT=[
    {name:"Priya R.",time:"Today 2:30 PM",duration:"24 min",coins:"600",rating:5},
    {name:"Ravi S.",time:"Today 10:15 AM",duration:"18 min",coins:"450",rating:4},
    {name:"James M.",time:"Yesterday 6:45 PM",duration:"31 min",coins:"775",rating:5},
    {name:"Wei C.",time:"Yesterday 3:20 PM",duration:"12 min",coins:"300",rating:2},
  ];

  function openReport(customerName){
    setReportCustomer(customerName);
    setReportReason("");
    setReportDetails("");
    setReportSent(false);
    setShowReport(true);
  }

  return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"Georgia,serif",color:"#e8d5b7",position:"relative"}}>
      <style>{CSS}</style><Stars/>
      <div style={{position:"sticky",top:0,zIndex:100,background:"rgba(10,0,21,.93)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(200,150,50,.2)",padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",height:58}}>
        <div style={{fontSize:16,fontWeight:700,background:"linear-gradient(90deg,#e8d5b7,#ffd700,#a29bfe)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>🔮 Astrologer Dashboard</div>
        <div style={{fontSize:11,color:"#fdcb6e",fontFamily:"sans-serif",background:"rgba(253,203,110,.1)",border:"1px solid rgba(253,203,110,.3)",borderRadius:8,padding:"4px 10px"}}>⏳ Pending</div>
      </div>
      <div style={{position:"relative",zIndex:1,maxWidth:460,margin:"0 auto",padding:"16px 14px 40px",animation:"floatIn .35s ease"}}>
        <div style={{...cd,background:"rgba(253,203,110,.07)",border:"1px solid rgba(253,203,110,.25)",display:"flex",gap:12,alignItems:"center",marginBottom:14}}>
          <div style={{fontSize:26}}>⏳</div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"#fdcb6e"}}>Profile Under Review</div>
            <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.6,marginTop:2}}>Our team will review within 24-48 hours. You'll receive an email once approved and your profile goes live to customers.</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,marginBottom:14}}>
          {[["🪙","₹0","Today"],["💬","0","Sessions"],["⭐","-","Rating"]].map(([ic,v,l])=>(
            <div key={l} style={{...cd,textAlign:"center",padding:"11px 6px",marginBottom:0}}>
              <div style={{fontSize:17,marginBottom:3}}>{ic}</div>
              <div style={{fontSize:14,fontWeight:700,color:G,fontFamily:"sans-serif"}}>{v}</div>
              <div style={{fontSize:9,color:"#8a7a6a",fontFamily:"sans-serif"}}>{l}</div>
            </div>
          ))}
        </div>
        {/* Recent Sessions with Report button */}
        <div style={{fontSize:14,fontWeight:700,color:G,marginBottom:10}}>Recent Sessions</div>
        {RECENT.map((s,i)=>(
          <div key={i} style={{...cd,marginBottom:9}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#6c5ce7,#a29bfe)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#fff",fontFamily:"sans-serif",flexShrink:0}}>{s.name[0]}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:"#e8d5b7",fontFamily:"sans-serif"}}>{s.name}</div>
                  <div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif",marginTop:1}}>{s.time} · {s.duration}</div>
                  <div style={{display:"flex",gap:8,marginTop:2}}>
                    <span style={{fontSize:10,color:G,fontFamily:"sans-serif"}}>🪙 {s.coins}</span>
                    <span style={{fontSize:10,fontFamily:"sans-serif",color:s.rating>=4?"#ffd700":s.rating===3?"#fdcb6e":"#ff7675"}}>{"⭐".repeat(s.rating)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={()=>openReport(s.name)}
                style={{background:"rgba(255,71,87,.08)",border:"1px solid rgba(255,71,87,.2)",borderRadius:8,padding:"5px 10px",color:"#ff8a80",fontFamily:"sans-serif",fontSize:11,cursor:"pointer",flexShrink:0}}
              >
                &#9888; Report
              </button>
            </div>
          </div>
        ))}

        {/* Report Customer Modal */}
        {showReport&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:500,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
            <div style={{background:"linear-gradient(180deg,#0f0025,#080618)",border:"1px solid rgba(255,71,87,.25)",borderRadius:"20px 20px 0 0",padding:"22px 18px 36px",width:"100%",maxWidth:480,animation:"slideUp .35s ease"}}>
              {!reportSent?(
                <div>
                  <div style={{textAlign:"center",marginBottom:16}}>
                    <div style={{fontSize:24,marginBottom:6}}>&#9888;</div>
                    <div style={{fontSize:16,fontWeight:700,color:"#ff8a80",marginBottom:4}}>Report Customer</div>
                    <div style={{fontSize:12,color:"#c8a060",fontFamily:"sans-serif",marginBottom:2}}>Reporting: <strong style={{color:"#e8d5b7"}}>{reportCustomer}</strong></div>
                    <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif"}}>This report will be sent to MiraXAstro admin for review</div>
                  </div>
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1,marginBottom:8}}>REASON FOR REPORT *</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:12}}>
                      {["Abusive language","Inappropriate behaviour","Threatening comments","Spam or fake details","Refused to pay","Other"].map(r=>(
                        <div key={r} onClick={()=>setReportReason(r)}
                          style={{padding:"6px 12px",borderRadius:16,border:"1px solid",borderColor:reportReason===r?"rgba(255,71,87,.6)":"rgba(200,150,50,.2)",background:reportReason===r?"rgba(255,71,87,.12)":"transparent",fontSize:11,fontFamily:"sans-serif",color:reportReason===r?"#ff8a80":"#8a7a6a",cursor:"pointer"}}>
                          {r}
                        </div>
                      ))}
                    </div>
                    <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1,marginBottom:6}}>ADDITIONAL DETAILS</div>
                    <textarea
                      value={reportDetails}
                      onChange={e=>setReportDetails(e.target.value)}
                      placeholder="Describe what happened in detail (optional)..."
                      rows={3}
                      style={{width:"100%",background:"#0d0a1a",border:"1px solid rgba(200,150,50,.25)",borderRadius:11,padding:"10px 12px",color:"#e8d5b7",fontFamily:"sans-serif",fontSize:12,outline:"none",resize:"none",boxSizing:"border-box"}}
                    />
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>setShowReport(false)} style={{flex:1,background:"transparent",border:"1px solid rgba(200,150,50,.2)",borderRadius:10,padding:"10px",color:"#8a7a6a",fontFamily:"sans-serif",fontSize:12,cursor:"pointer"}}>Cancel</button>
                    <button
                      disabled={!reportReason}
                      onClick={()=>{if(reportReason)setReportSent(true);}}
                      style={{flex:2,background:reportReason?"linear-gradient(135deg,#c0392b,#e74c3c)":"rgba(100,100,100,.2)",color:reportReason?"white":"#636e72",border:"none",borderRadius:10,padding:"10px",fontWeight:700,fontFamily:"sans-serif",fontSize:12,cursor:reportReason?"pointer":"not-allowed"}}
                    >
                      Submit Report
                    </button>
                  </div>
                </div>
              ):(
                <div style={{textAlign:"center",padding:"20px 0"}}>
                  <div style={{fontSize:40,marginBottom:12}}>&#10003;</div>
                  <div style={{fontSize:16,fontWeight:700,color:"#00b894",marginBottom:8}}>Report Submitted!</div>
                  <div style={{fontSize:12,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.7,marginBottom:18}}>
                    Your report about <strong style={{color:"#e8d5b7"}}>{reportCustomer}</strong> has been sent to MiraXAstro admin.<br/>We will review it within 24 hours and take appropriate action.
                  </div>
                  <button onClick={()=>setShowReport(false)} style={{...bG,padding:"10px 28px"}}>Close</button>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{fontSize:14,fontWeight:700,color:G,marginBottom:10,marginTop:6}}>Features Unlocked After Approval</div>
        {[["💬","Live Chat &amp; Call","Accept consultations from customers in real time"],["💰","Earnings &amp; Payouts","Track earnings, request withdrawals to your bank"],["📅","Session Bookings","Manage your upcoming scheduled sessions"],["⭐","Reviews &amp; Ratings","View and respond to customer feedback"],["📈","Analytics","Profile views, conversion rate, peak hours"]].map(([ic,t,desc])=>(
          <div key={t} style={{...cd,display:"flex",gap:11,alignItems:"flex-start",opacity:.5}}>
            <div style={{fontSize:20,flexShrink:0}}>{ic}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,color:"#e8d5b7",fontFamily:"sans-serif",marginBottom:2}} dangerouslySetInnerHTML={{__html:t}}/>
              <div style={{fontSize:11,color:"#636e72",fontFamily:"sans-serif",lineHeight:1.5}}>{desc}</div>
            </div>
            <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif",background:"rgba(255,255,255,.04)",padding:"2px 7px",borderRadius:6,flexShrink:0}}>Locked</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -- ROOT ----------------------------------------------------------
export default function App(){
  const [view,setView]=useState("land");
  const [astroData,setAstroData]=useState(null);

  if(view==="land")  return <Landing onApply={()=>setView("onboard")} onLogin={()=>setView("dashboard")}/>;
  if(view==="onboard") return <Onboard onDone={data=>{if(data){setAstroData(data);setView("pending");}else setView("land");}}/>;
  if(view==="pending") return <Pending d={astroData} onDashboard={()=>setView("dashboard")}/>;
  if(view==="dashboard") return <Dashboard d={astroData}/>;
  return null;
}
