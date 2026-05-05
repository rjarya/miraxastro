import React, { useState, useRef, useEffect } from "react";

const G="#ffd700";
const BG="linear-gradient(135deg,#0a0015 0%,#0d0028 40%,#010a1a 100%)";

const CURR={
  IN:{c:"INR",s:"₹",n:"Indian Rupee",f:"🇮🇳",r:83.5,fmt:n=>"₹"+Math.round(n).toLocaleString("en-IN")},
  US:{c:"USD",s:"$",n:"US Dollar",f:"🇺🇸",r:1,fmt:n=>"$"+n.toFixed(2)},
  AU:{c:"AUD",s:"A$",n:"Australian Dollar",f:"🇦🇺",r:1.53,fmt:n=>"A$"+n.toFixed(2)},
  GB:{c:"GBP",s:"£",n:"British Pound",f:"🇬🇧",r:0.79,fmt:n=>"£"+n.toFixed(2)},
  EU:{c:"EUR",s:"€",n:"Euro",f:"🇪🇺",r:0.92,fmt:n=>"€"+n.toFixed(2)},
  CA:{c:"CAD",s:"C$",n:"Canadian Dollar",f:"🇨🇦",r:1.36,fmt:n=>"C$"+n.toFixed(2)},
  SG:{c:"SGD",s:"S$",n:"Singapore Dollar",f:"🇸🇬",r:1.34,fmt:n=>"S$"+n.toFixed(2)},
  AE:{c:"AED",s:"د.إ",n:"UAE Dirham",f:"🇦🇪",r:3.67,fmt:n=>"د.إ"+n.toFixed(2)},
  MY:{c:"MYR",s:"RM",n:"Malaysian Ringgit",f:"🇲🇾",r:4.72,fmt:n=>"RM"+n.toFixed(2)},
  NZ:{c:"NZD",s:"NZ$",n:"New Zealand Dollar",f:"🇳🇿",r:1.63,fmt:n=>"NZ$"+n.toFixed(2)},
  ZA:{c:"ZAR",s:"R",n:"South African Rand",f:"🇿🇦",r:18.6,fmt:n=>"R"+n.toFixed(2)},
  JP:{c:"JPY",s:"¥",n:"Japanese Yen",f:"🇯🇵",r:151,fmt:n=>"¥"+Math.round(n)},
};

const PMETHODS={
  IN:["card","walletUS","intl"],
  US:["card","walletUS","intl"],
  GB:["card","openbank","intl"],
  EU:["card","sepa","intl"],
  AU:["card","poli","intl"],
  SG:["card","paynow","intl"],
  DEFAULT:["card","intl"],
};

const PMD={
  card:{l:"Credit / Debit Card",i:"💳",s:"Visa · Mastercard · Amex · RuPay"},
  intl:{l:"PayPal / Stripe",i:"🌐",s:"PayPal · Apple Pay · Google Pay"},
  walletUS:{l:"Digital Wallets",i:"👛",s:"Apple Pay · Google Pay · Venmo"},
  openbank:{l:"Open Banking",i:"🏦",s:"UK instant bank transfer"},
  sepa:{l:"SEPA Transfer",i:"🏦",s:"EU bank transfer"},
  poli:{l:"POLi",i:"🏦",s:"Australian bank transfer"},
  paynow:{l:"PayNow",i:"⚡",s:"Singapore instant pay"},
};

const PLANS=[
  {id:"trial",name:"Trial",usd:0.35,coins:30,bonus:0,badge:null,color:"#636e72"},
  {id:"basic",name:"Starter",usd:1.19,coins:100,bonus:10,badge:null,color:"#a29bfe"},
  {id:"value",name:"Value",usd:3.60,coins:320,bonus:50,badge:"Popular",color:"#fd79a8"},
  {id:"power",name:"Power",usd:6.00,coins:550,bonus:100,badge:"Best Value",color:"#FF6B35"},
  {id:"elite",name:"Elite",usd:12.0,coins:1200,bonus:300,badge:"🌟 Elite",color:"#ffd700"},
  {id:"vip",name:"VIP",usd:30.0,coins:3200,bonus:800,badge:"💎 VIP",color:"#00cec9"},
];

const ASTROS=[
  {id:1,name:"Pandit Rajesh Sharma",gender:"male",  spec:"Vedic Astrology",   exp:"15 yrs",rating:4.9,reviews:12400,ppm:0.30,langs:["Hindi","English"],   status:"online", wait:"0 min",sessions:8420, verified:true,bio:"Expert in Vedic Jyotish with 15 years. Specialises in Kundli matching, career and marriage predictions.",badges:["Top Rated","Most Consulted"]},
  {id:2,name:"Dr. Priya Nair",       gender:"female",spec:"Tarot Reading",exp:"10 yrs",rating:4.8,reviews:8750, ppm:0.22,langs:["English","Malayalam"],status:"online", wait:"2 min",sessions:5630, verified:true,bio:"PhD in Metaphysics. Combines Tarot with Vedic numerology for deep life path guidance.",badges:["Expert","Top Rated"]},
  {id:3,name:"Acharya Suresh Joshi", gender:"male",  spec:"Kundli & Marriage", exp:"20 yrs",rating:4.9,reviews:15200,ppm:0.42,langs:["Hindi","Gujarati"],   status:"busy",   wait:"15 min",sessions:11200,verified:true,bio:"Renowned for marriage compatibility and Manglik dosha remedies. 20+ years in practice.",badges:["Senior","Marriage Expert"]},
  {id:4,name:"Swami Anand Das",      gender:"male",  spec:"Palmistry Reading", exp:"25 yrs",rating:4.7,reviews:9800, ppm:0.48,langs:["Hindi","English"],    status:"online", wait:"0 min",sessions:7800, verified:true,bio:"Combines ancient palmistry with Vastu Shastra for holistic guidance.",badges:["Vastu Expert","Senior"]},
  {id:5,name:"Kavitha Menon",        gender:"female",spec:"Western Astrology", exp:"8 yrs", rating:4.6,reviews:5300, ppm:0.18,langs:["English","Tamil"],    status:"online", wait:"5 min",sessions:3200, verified:true,bio:"Natal charts and transit predictions for career and relationships.",badges:["Rising Star"]},
  {id:8,name:"Meera Iyer",             gender:"female",spec:"Numerology",          exp:"11 yrs",rating:4.7,reviews:7100, ppm:0.20,langs:["English","Hindi","Tamil"],status:"online", wait:"3 min",sessions:4200, verified:true,bio:"Expert in Vedic and Pythagorean numerology. Reveals the hidden power of your birth date and name numbers to guide career, relationships, and life purpose decisions.",badges:["Numerology Expert"]},
  {id:6,name:"Guru Bhatt Ji",        gender:"male",  spec:"Lal Kitab",         exp:"18 yrs",rating:4.8,reviews:11000,ppm:0.26,langs:["Hindi","Punjabi"],   status:"offline",wait:"—",    sessions:9100, verified:true,bio:"Master of Lal Kitab remedies. Simple effective solutions for complex planetary problems.",badges:["Lal Kitab Expert"]},
  {id:7,name:"Dr. Ananya Krishnan",    gender:"female",spec:"Palmistry Reading",exp:"14 yrs",rating:4.8,reviews:6200, ppm:0.35,langs:["English","Tamil","Malayalam"],status:"online", wait:"0 min",sessions:4800, verified:true,bio:"Specialist in Samudrika Shastra — the ancient science of face reading and palmistry. She reads forehead lines, eye shape, nose structure and palm lines to reveal personality, health and future with extraordinary accuracy.",badges:["Face Reading Expert","Samudrika"]},
];

function detectCurr(){
  try{
    const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||"";
    const TZ={"Asia/Kolkata":"IN","Asia/Calcutta":"IN","Australia/Sydney":"AU","Australia/Melbourne":"AU","Australia/Brisbane":"AU","Australia/Adelaide":"AU","Australia/Perth":"AU","America/New_York":"US","America/Chicago":"US","America/Los_Angeles":"US","America/Toronto":"CA","Europe/London":"GB","Europe/Paris":"EU","Europe/Berlin":"EU","Asia/Singapore":"SG","Asia/Kuala_Lumpur":"MY","Asia/Dubai":"AE","Asia/Tokyo":"JP","Pacific/Auckland":"NZ","Africa/Johannesburg":"ZA"};
    if(TZ[tz])return TZ[tz];
    const cc=(navigator.language||"").split("-").pop().toUpperCase();
    const LC={AU:"AU",US:"US",GB:"GB",CA:"CA",SG:"SG",MY:"MY",AE:"AE",JP:"JP",NZ:"NZ",ZA:"ZA",IN:"IN",DE:"EU",FR:"EU",IT:"EU",ES:"EU"};
    if(LC[cc])return LC[cc];
  }catch(e){}
  return"US";
}

function avUrl(name,g){
  return"https://api.dicebear.com/7.x/avataaars/svg?seed="+encodeURIComponent(name)+"&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=160&skinColor="+(g==="female"?"d08b5b,edb98a":"ae5d29,d08b5b")+"&top="+(g==="female"?"longHair,longHairBigHair":"shortHairShortFlat,hat,turban")+"&facialHair="+(g==="male"?"beardLight,moustacheFancy,blank":"blank")+"&clothing=blazerAndShirt,hoodie";
}

function fmtT(s){return Math.floor(s/60)+":"+(s%60<10?"0":"")+s%60;}
function genId(){return Math.random().toString(36).substr(2,8).toUpperCase();}
function fmtD(d){return new Date(d).toLocaleString("en",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});}

const cd={background:"rgba(255,255,255,.04)",border:"1px solid rgba(200,150,50,.18)",borderRadius:14,padding:15,marginBottom:12};
const ip={width:"100%",background:"rgba(255,255,255,.06)",border:"1px solid rgba(200,150,50,.28)",borderRadius:11,padding:"12px 13px",color:"#e8d5b7",fontFamily:"sans-serif",fontSize:14,outline:"none",boxSizing:"border-box"};
const bG={background:"linear-gradient(135deg,#c8a000,#ffd700)",color:"#0a0015",border:"none",borderRadius:10,padding:"10px 18px",fontWeight:700,fontFamily:"sans-serif",fontSize:13,cursor:"pointer"};
const bO={background:"transparent",color:G,border:"1px solid rgba(255,215,0,.4)",borderRadius:10,padding:"8px 14px",fontFamily:"sans-serif",fontSize:12,cursor:"pointer"};

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
@keyframes floatIn{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@keyframes glow{0%,100%{box-shadow:0 0 8px rgba(255,215,0,.1)}50%{box-shadow:0 0 22px rgba(255,215,0,.4)}}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
@keyframes tick{0%{transform:scale(0)}70%{transform:scale(1.2)}100%{transform:scale(1)}}
input::placeholder,textarea::placeholder{color:#4a3a2a}
input:focus,select:focus{border-color:rgba(255,215,0,.5)!important;outline:none!important}
button:disabled{opacity:.4;cursor:not-allowed}
.ac:hover{border-color:rgba(255,215,0,.4)!important;transform:translateY(-2px);transition:all .2s}
.pm:hover{background:rgba(255,215,0,.07)!important;transition:all .15s}
.cA{background:rgba(200,150,50,.12);border:1px solid rgba(200,150,50,.2);border-radius:14px 14px 14px 3px;padding:9px 12px;max-width:82%;font-family:sans-serif;font-size:13px;color:#e8d5b7;margin:4px 0;animation:floatIn .3s ease}
.cU{background:linear-gradient(135deg,#c8a000,#ffd700);color:#0a0015;border-radius:14px 14px 3px 14px;padding:9px 12px;max-width:82%;font-family:sans-serif;font-size:13px;margin:4px 0 4px auto;animation:floatIn .3s ease}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(200,150,50,.3);border-radius:4px}
`;


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

function PwStrength({pw}){
  if(!pw) return null;
  var score=[pw.length>=8,/[A-Z]/.test(pw),/[0-9]/.test(pw),/[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;
  var cols=["#636e72","#ff4757","#ffa502","#2ed573","#00b894"];
  return React.createElement("div",{style:{display:"flex",gap:3,margin:"5px 0 10px"}},
    [0,1,2,3].map(function(i){return React.createElement("div",{key:i,style:{flex:1,height:2,borderRadius:2,background:i<score?cols[score]:"rgba(255,255,255,.1)"}});}));
}
const LOGO_SRC="data:image/jpeg;base64,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";
function MXLogo({size=110}){return(<img src={LOGO_SRC} alt="MiraXAstro" style={{width:size,height:size,objectFit:"contain",display:"block",margin:"0 auto"}}/>);}
function MXWordmark({size=22}){
  return(<div style={{fontFamily:"Georgia,serif",fontSize:size,fontWeight:300,letterSpacing:size*0.18,lineHeight:1,textAlign:"center"}}><span style={{color:"#e8d5b7"}}>Mira</span><span style={{background:"linear-gradient(135deg,#7b6fc4,#b8aae8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontWeight:400}}>X</span><span style={{color:"#e8d5b7"}}>Astro</span></div>);}
function MXTagline(){
  var lineL={height:"0.5px",width:18,background:"linear-gradient(90deg,transparent,rgba(232,213,183,.45))"};
  var lineR={height:"0.5px",width:18,background:"linear-gradient(90deg,rgba(232,213,183,.45),transparent)"};
  var dot={fontSize:7,color:"rgba(232,213,183,.5)",fontFamily:"sans-serif"};
  var txt={fontSize:7.5,color:"rgba(232,213,183,.45)",fontFamily:"sans-serif",letterSpacing:1.8};
  return(<div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:4}}><div style={lineL}/><span style={dot}>+</span><span style={txt}>ANCIENT WISDOM. MODERN INSIGHT.</span><span style={dot}>+</span><div style={lineR}/></div>);}


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

function Av({a,size=52}){
  const [ok,setOk]=useState(false);
  const [er,setEr]=useState(false);
  if(!a)return null;
  if(er)return <div style={{width:size,height:size,borderRadius:"50%",background:"linear-gradient(135deg,#c8a000,#ffd700)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.38,fontWeight:700,color:"#0a0015",fontFamily:"sans-serif",flexShrink:0}}>{a.name.charAt(0)}</div>;
  return(
    <div style={{position:"relative",flexShrink:0}}>
      {!ok&&<div style={{width:size,height:size,borderRadius:"50%",background:"rgba(200,150,50,.2)",position:"absolute",inset:0}}/>}
      <img src={avUrl(a.name,a.gender)} alt={a.name} onLoad={()=>setOk(true)} onError={()=>setEr(true)} style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",display:ok?"block":"none",border:"2px solid rgba(255,215,0,.25)"}}/>
    </div>
  );
}

function AvDot({a,size=52}){
  const sc=a.status==="online"?"#00b894":a.status==="busy"?"#fdcb6e":"#636e72";
  return(
    <div style={{position:"relative",flexShrink:0}}>
      <Av a={a} size={size}/>
      <div style={{position:"absolute",bottom:1,right:1,width:Math.max(10,size*.22),height:Math.max(10,size*.22),borderRadius:"50%",background:sc,border:"2px solid #0a0015"}}/>
    </div>
  );
}

function CurrPicker({cur,onChange}){
  const [open,setOpen]=useState(false);
  const C=CURR[cur];
  return(
    <div style={{position:"relative"}}>
      <button onClick={()=>setOpen(v=>!v)} style={{display:"flex",alignItems:"center",gap:5,background:"rgba(255,255,255,.05)",border:"1px solid rgba(200,150,50,.22)",borderRadius:9,padding:"6px 10px",cursor:"pointer",color:"#e8d5b7",fontFamily:"sans-serif",fontSize:12}}>
        <span>{C.f}</span><span style={{fontWeight:700}}>{C.c}</span><span style={{color:"#8a7a6a",fontSize:10}}>▾</span>
      </button>
      {open&&(
        <div style={{position:"absolute",top:"100%",right:0,marginTop:3,background:"#0d0028",border:"1px solid rgba(200,150,50,.3)",borderRadius:11,overflow:"hidden",zIndex:300,width:200,maxHeight:260,overflowY:"auto",boxShadow:"0 8px 32px rgba(0,0,0,.6)"}}>
          {Object.entries(CURR).map(([code,x])=>(
            <div key={code} onClick={()=>{onChange(code);setOpen(false);}} className="pm" style={{display:"flex",alignItems:"center",gap:9,padding:"10px 13px",cursor:"pointer",background:cur===code?"rgba(255,215,0,.1)":"transparent",borderBottom:"1px solid rgba(200,150,50,.06)"}}>
              <span style={{fontSize:17}}>{x.f}</span>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:cur===code?G:"#e8d5b7",fontFamily:"sans-serif"}}>{x.c}</div>
                <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif"}}>{x.n}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── AUTH ──────────────────────────────────────────────────────────
function Auth({onLogin,onAstro}){
  const [tab,setTab]=useState("in");
  const [loading,setLoading]=useState(false);
  const [showPw,setShowPw]=useState(false);
  const [lf,setLf]=useState({e:"",p:""});
  const [le,setLe]=useState({});
  const [rf,setRf]=useState({n:"",e:"",ph:"",p:"",p2:"",ok:false,country:"",state:"",city:"",postcode:"",addr1:"",addr2:""});
  const [re,setRe]=useState({});
  function setRfF(k,v){setRf(r=>({...r,[k]:v}));}
  const [otpStep,setOtpStep]=useState(false);
  const [otpVal,setOtpVal]=useState("");
  const [otpErr,setOtpErr]=useState("");
  const [generatedOtp,setGeneratedOtp]=useState("");
  const [pendingUser,setPendingUser]=useState(null);
  const [countdown,setCountdown]=useState(0);
  const cntRef=useRef();
  const DB=useRef({}).current;

  async function login(){
    const err={};
    if(!lf.e.includes("@"))err.e="Valid email required";
    if(!lf.p)err.p="Password required";
    if(Object.keys(err).length){setLe(err);return;}
    setLoading(true);await new Promise(r=>setTimeout(r,900));
    const u=DB[lf.e.toLowerCase()];
    if(!u){setLe({e:"No account found"});setLoading(false);return;}
    if(u.pw!==btoa(lf.p+"h")){setLe({p:"Wrong password"});setLoading(false);return;}
    setLoading(false);onLogin(u);
  }
  async function reg(){
    const err={};
    if(!rf.n.trim())err.n="Name required";
    if(!rf.e.includes("@"))err.e="Valid email required";
    if(DB[rf.e.toLowerCase()])err.e="Email already registered";
    if(!rf.ph||rf.ph.replace(/\D/g,"").length<8)err.ph="Valid phone number required";if(!rf.country)err.country="Country required";if(STATES_BY_COUNTRY[rf.country]&&STATES_BY_COUNTRY[rf.country].length>0&&!rf.state)err.state="Please select a state";if(!rf.city||!rf.city.trim())err.city="City required";if(!rf.postcode||!rf.postcode.trim())err.postcode="Postcode required";
    if(rf.p.length<8)err.p="Min 8 characters";
    if(rf.p!==rf.p2)err.p2="Passwords don't match";
    if(!rf.ok)err.ok="Accept terms to continue";
    if(Object.keys(err).length){setRe(err);return;}
    setLoading(true);await new Promise(r=>setTimeout(r,600));
    const otp=String(Math.floor(100000+Math.random()*900000));
    setGeneratedOtp(otp);
    setPendingUser({name:rf.n,email:rf.e,ph:rf.ph,pw:btoa(rf.p+"h"),coins:50,txns:[]});
    setLoading(false);
    setOtpStep(true);
    startCountdown();
    console.log("OTP (demo):",otp);
  }
  function startCountdown(){
    setCountdown(30);
    clearInterval(cntRef.current);
    cntRef.current=setInterval(()=>setCountdown(c=>{if(c<=1){clearInterval(cntRef.current);return 0;}return c-1;}),1000);
  }
  function verifyOtp(){
    if(otpVal.trim()===generatedOtp){
      DB[pendingUser.email.toLowerCase()]=pendingUser;
      setOtpStep(false);setOtpVal("");setOtpErr("");
      onLogin(DB[pendingUser.email.toLowerCase()]);
    }else{
      setOtpErr("Incorrect code. Please try again.");
    }
  }
  async function social(p){
    setLoading(true);await new Promise(r=>setTimeout(r,700));
    const em="demo@"+p+".com";
    if(!DB[em])DB[em]={name:p.charAt(0).toUpperCase()+p.slice(1)+" User",email:em,pw:"",coins:50,txns:[]};
    setLoading(false);onLogin(DB[em]);
  }

  const iE=err=>({...ip,border:"1px solid "+(err?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")});
  const Err=({m})=>m?<div style={{fontSize:11,color:"#ff4757",fontFamily:"sans-serif",marginTop:3}}>⚠ {m}</div>:null;

  return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"'Playfair Display',Georgia,serif",color:"#e8d5b7",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,position:"relative"}}>
      <style>{CSS}</style>
      <Stars/>
      <div style={{textAlign:"center",marginBottom:16,position:"relative",zIndex:1}}>
        <MXLogo size={145}/>
        <div style={{marginTop:8}}><MXWordmark size={24}/></div>
        <MXTagline/>
      </div>
      <div style={{width:"100%",maxWidth:390,background:"rgba(255,255,255,.035)",border:"1px solid rgba(200,150,50,.2)",borderRadius:20,padding:"22px 20px",backdropFilter:"blur(16px)",position:"relative",zIndex:1,animation:"floatIn .4s ease"}}>
        <div style={{display:"flex",background:"rgba(255,255,255,.04)",borderRadius:10,padding:3,marginBottom:18}}>
          {["in","up"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"8px",border:"none",borderRadius:8,background:tab===t?"rgba(255,215,0,.15)":"transparent",color:tab===t?G:"#8a7a6a",fontFamily:"sans-serif",fontSize:13,cursor:"pointer",fontWeight:tab===t?700:400}}>
              {t==="in"?"Sign In":"Register"}
            </button>
          ))}
        </div>

        {tab==="in"&&(
          <div>
            <div style={{marginBottom:11}}>
              <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",marginBottom:4,letterSpacing:1.2}}>EMAIL</div>
              <input value={lf.e} onChange={e=>setLf(f=>({...f,e:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="you@example.com" style={iE(le.e)}/>
              <Err m={le.e}/>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",marginBottom:4,letterSpacing:1.2}}>PASSWORD</div>
              <div style={{position:"relative"}}>
                <input type={showPw?"text":"password"} value={lf.p} onChange={e=>setLf(f=>({...f,p:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="Your password" style={{...iE(le.p),paddingRight:40}}/>
                <span onClick={()=>setShowPw(v=>!v)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",cursor:"pointer",color:"#8a7a6a",fontSize:14}}>{showPw?"🙈":"👁"}</span>
              </div>
              <Err m={le.p}/>
            </div>
            <button onClick={login} disabled={loading} style={{...bG,width:"100%",padding:13,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              {loading&&<Sp/>}{loading?"Signing in…":"✨ Sign In"}
            </button>
            <div style={{display:"flex",alignItems:"center",gap:8,margin:"12px 0",color:"#5a4a3a",fontFamily:"sans-serif",fontSize:11}}>
              <div style={{flex:1,height:1,background:"rgba(255,255,255,.07)"}}/>OR<div style={{flex:1,height:1,background:"rgba(255,255,255,.07)"}}/>
            </div>
            <div style={{display:"flex",gap:7,marginBottom:12}}>
              <button onClick={()=>social("google")} style={{flex:1,background:"rgba(255,255,255,.05)",color:"#e8d5b7",border:"1px solid rgba(255,255,255,.1)",borderRadius:9,padding:10,fontFamily:"sans-serif",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><b>G</b> Google</button>
              <button onClick={()=>social("apple")} style={{flex:1,background:"rgba(255,255,255,.05)",color:"#e8d5b7",border:"1px solid rgba(255,255,255,.1)",borderRadius:9,padding:10,fontFamily:"sans-serif",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>🍎 Apple</button>
            </div>
            <div style={{fontSize:11,color:"#4a3a2a",fontFamily:"sans-serif",background:"rgba(255,215,0,.04)",padding:"8px 12px",borderRadius:8,border:"1px solid rgba(255,215,0,.1)"}}>💡 Use Google or Apple for instant demo access.</div>
          </div>
        )}

        {tab==="up"&&(
          <div>
            {[["FULL NAME","n","text","Your full name"],["EMAIL","e","email","you@example.com"]].map(([l,f,t,ph])=>(
              <div key={f} style={{marginBottom:11}}>
                <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",marginBottom:4,letterSpacing:1.2}}>{l}</div>
                <input type={t} value={rf[f]} onChange={e=>setRf(r=>({...r,[f]:e.target.value}))} placeholder={ph} style={iE(re[f])}/>
                <Err m={re[f]}/>
              </div>
            ))}
            <div style={{marginBottom:11}}>
              <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",marginBottom:6,letterSpacing:1.2}}>ADDRESS</div>
              <AddressFields d={rf} setF={setRfF} errs={re} ipStyle={ip} lblStyle={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1.3,marginBottom:5,display:"block"}} ErrComp={({m})=>m?<div style={{fontSize:11,color:"#ff4757",fontFamily:"sans-serif",marginTop:3}}>{m}</div>:null}/>
            </div>
            <div style={{marginBottom:11}}>
              <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",marginBottom:5,letterSpacing:1.2}}>PHONE NUMBER</div>
              <PhoneInput value={rf.ph} onChange={v=>setRf(r=>({...r,ph:v}))} error={re.ph} ipStyle={ip} syncCountry={rf.country}/>
              {re.ph&&<div style={{fontSize:11,color:"#ff4757",fontFamily:"sans-serif",marginTop:3}}>&#9888; {re.ph}</div>}
            </div>
            <div style={{marginBottom:4}}>
              <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",marginBottom:4,letterSpacing:1.2}}>PASSWORD</div>
              <div style={{position:"relative"}}>
                <input type={showPw?"text":"password"} value={rf.p} onChange={e=>setRf(r=>({...r,p:e.target.value}))} placeholder="Min 8 characters" style={{...iE(re.p),paddingRight:40}}/>
                <span onClick={()=>setShowPw(v=>!v)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",cursor:"pointer",color:"#8a7a6a",fontSize:14}}>{showPw?"🙈":"👁"}</span>
              </div>
              <Err m={re.p}/>
            </div>
            <PwStrength pw={rf.p}/>
            <div style={{marginBottom:11}}>
              <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",marginBottom:4,letterSpacing:1.2}}>CONFIRM PASSWORD</div>
              <input type="password" value={rf.p2} onChange={e=>setRf(r=>({...r,p2:e.target.value}))} placeholder="Repeat password" style={iE(re.p2)}/>
              <Err m={re.p2}/>
            </div>
            <div style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:re.ok?4:14,cursor:"pointer"}} onClick={()=>setRf(r=>({...r,ok:!r.ok}))}>
              <div style={{width:17,height:17,borderRadius:4,border:"2px solid "+(rf.ok?G:"rgba(200,150,50,.3)"),background:rf.ok?"rgba(255,215,0,.12)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>{rf.ok&&<span style={{fontSize:10,color:G}}>✓</span>}</div>
              <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.5}}>I agree to <span style={{color:G}}>Terms</span> &amp; <span style={{color:G}}>Privacy Policy</span></div>
            </div>
            <Err m={re.ok}/>
            <button onClick={reg} disabled={loading} style={{...bG,width:"100%",padding:13,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:8}}>
              {loading&&<Sp/>}{loading?"Creating…":"🚀 Create Account"}
            </button>
          </div>
        )}

        {otpStep&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div style={{background:"linear-gradient(180deg,#0f0025,#0a0018)",border:"1px solid rgba(255,215,0,.25)",borderRadius:20,padding:"26px 20px",width:"100%",maxWidth:380,animation:"floatIn .4s ease"}}>
              <div style={{textAlign:"center",marginBottom:18}}>
                <div style={{fontSize:36,marginBottom:8}}>📱</div>
                <div style={{fontSize:18,fontWeight:700,color:G,marginBottom:4}}>Verify Your Phone</div>
                <div style={{fontSize:12,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.6}}>
                  A 6-digit code has been sent to<br/>
                  <strong style={{color:"#e8d5b7"}}>{rf.ph}</strong>
                </div>
                <div style={{fontSize:10,color:"#a29bfe",fontFamily:"sans-serif",marginTop:6,background:"rgba(162,155,254,.08)",padding:"4px 10px",borderRadius:8,display:"inline-block"}}>
                  Demo mode — check browser console for OTP
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1.2,marginBottom:6}}>ENTER 6-DIGIT CODE</div>
                <input
                  value={otpVal}
                  onChange={e=>setOtpVal(e.target.value.replace(/\D/g,"").slice(0,6))}
                  onKeyDown={e=>e.key==="Enter"&&verifyOtp()}
                  placeholder="_ _ _ _ _ _"
                  maxLength={6}
                  style={{...iE(otpErr),fontSize:24,fontWeight:700,textAlign:"center",letterSpacing:8,color:G}}
                />
                {otpErr&&<div style={{fontSize:11,color:"#ff4757",fontFamily:"sans-serif",marginTop:4}}>⚠ {otpErr}</div>}
              </div>
              <button
                onClick={verifyOtp}
                disabled={otpVal.length!==6}
                style={{...bG,width:"100%",padding:13,fontSize:15,marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}
              >
                ✓ Verify & Create Account
              </button>
              <div style={{textAlign:"center"}}>
                {countdown>0
                  ?<div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif"}}>Resend code in {countdown}s</div>
                  :<button onClick={()=>{const otp=String(Math.floor(100000+Math.random()*900000));setGeneratedOtp(otp);setOtpVal("");setOtpErr("");startCountdown();console.log("New OTP (demo):",otp);}} style={{background:"none",border:"none",color:G,fontFamily:"sans-serif",fontSize:12,cursor:"pointer",textDecoration:"underline"}}>Resend Code</button>
                }
              </div>
              <button onClick={()=>{setOtpStep(false);setOtpVal("");setOtpErr("");}} style={{...bO,width:"100%",padding:10,marginTop:10,fontSize:12}}>← Change Phone Number</button>
            </div>
          </div>
        )}
        <div style={{borderTop:"1px solid rgba(200,150,50,.12)",marginTop:18,paddingTop:14,textAlign:"center"}}>
          <div style={{fontSize:11,color:"#4a3a2a",fontFamily:"sans-serif",marginBottom:8}}>Are you an astrologer?</div>
          <button onClick={onAstro} style={{background:"rgba(108,92,231,.12)",color:"#a29bfe",border:"1px solid rgba(108,92,231,.3)",borderRadius:10,padding:"9px 20px",fontFamily:"sans-serif",fontSize:13,cursor:"pointer",width:"100%",fontWeight:600}}>
            🔮 Join as Astrologer / Partner Login
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CUSTOMER APP ──────────────────────────────────────────────────
function App2({user,onLogout}){
  const [tab,setTab]=useState("Home");
  const [cur,setCur]=useState(()=>detectCurr());
  const [coins,setCoins]=useState(user.coins||50);
  const [txns,setTxns]=useState(user.txns||[]);
  const [showPay,setShowPay]=useState(false);
  const [payPlan,setPayPlan]=useState(null);
  const [payM,setPayM]=useState(null);
  const [payS,setPayS]=useState("idle");
  const [chatOpen,setChatOpen]=useState(false);
  const [chatA,setChatA]=useState(null);
  const [msgs,setMsgs]=useState([]);
  const [chatInp,setChatInp]=useState("");
  const [aiTyping,setAiTyping]=useState(false);
  const [birthDetails,setBirthDetails]=useState({name:"",dob:"",time:"",place:""});
  const [birthSubmitted,setBirthSubmitted]=useState(false);
  const [sessOn,setSessOn]=useState(false);
  const [elapsed,setElapsed]=useState(0);
  const [showRev,setShowRev]=useState(false);
  const [revA,setRevA]=useState(null);
  const [rating,setRating]=useState(5);
  const [filter,setFilter]=useState("All");
  const [profA,setProfA]=useState(null);
  const [lifeMod,setLifeMod]=useState(null);
  const [lifeChat,setLifeChat]=useState([]);
  const [lifeTyping,setLifeTyping]=useState(false);
  const [lifeInp,setLifeInp]=useState("");
  const [toast,setToast]=useState(null);
  const tmr=useRef();

  const C=CURR[cur];
  function toast$(m,t="ok"){setToast({m,t});setTimeout(()=>setToast(null),3000);}
  function la(usd){return C.fmt(usd*C.r);}
  function pps(a){return C.s+(a.ppm*C.r).toFixed(C.r>10?0:2);}
  function cn(a){return Math.ceil(a.ppm*C.r);}

  useEffect(()=>{
    if(sessOn&&chatA){tmr.current=setInterval(()=>setElapsed(e=>e+1),1000);}
    else clearInterval(tmr.current);
    return()=>clearInterval(tmr.current);
  },[sessOn,chatA]);

  const used=sessOn&&chatA?Math.floor(elapsed/60)*cn(chatA):0;
  const left=Math.max(0,coins-used);
  const low=sessOn&&chatA&&left<=cn(chatA)*2;

  function startSess(a){
    const need=cn(a);
    if(coins<need){toast$("Need 🪙"+need+" — please recharge","err");setPayPlan(PLANS[1]);setPayM(null);setPayS("idle");setShowPay(true);return;}
    setChatA(a);setChatOpen(true);setSessOn(true);setElapsed(0);
    setMsgs([{f:"a",t:"Namaste 🙏 I am "+a.name+". Your session has started. I am here to guide you on your cosmic journey — "+pps(a)+"/min. Ask me anything about your life, career, marriage or destiny. 🌟"}]);
  }
  function endSess(){
    setSessOn(false);clearInterval(tmr.current);
    const u=Math.floor(elapsed/60)*cn(chatA);
    setCoins(c=>Math.max(0,c-u));
    setTxns(p=>[{type:"debit",title:"Session with "+chatA.name,coins:u,date:new Date()},...p]);
    setRevA(chatA);setShowRev(true);
  }
  async function sendMsg(){
    const q=chatInp.trim();
    if(!q)return;
    setChatInp("");
    setMsgs(p=>[...p,{f:"u",t:q}]);
    setAiTyping(true);
    try{
      const systemPrompt="You are "+chatA.name+", an experienced "+chatA.spec+" astrologer with "+chatA.exp+" of experience. You speak in a warm, wise, human tone — like a real Indian astrologer who genuinely cares. You give specific, personalised Vedic astrology guidance. Keep replies to 2-4 sentences. Sign off naturally like a human astrologer would. Use occasional Sanskrit or Tamil terms naturally."+(birthDetails.dob||birthDetails.place||birthDetails.time?" The customer has shared their birth details — use these to give highly personalised readings: "+(birthDetails.name?" Name: "+birthDetails.name+".":"")+(birthDetails.dob?" Date of Birth: "+birthDetails.dob+".":"")+(birthDetails.time?" Birth Time: "+birthDetails.time+".":"")+(birthDetails.place?" Birth Place: "+birthDetails.place+".":""):"")+" VERY IMPORTANT: 1) Never admit you are an AI. 2) Never mention Claude, Anthropic, Firebase or any technology. 3) Deflect tech questions warmly to the MiraXAstro team.";
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:300,system:systemPrompt,messages:[{role:"user",content:q}]})});
      const data=await res.json();
      const reply=data.content?.find(b=>b.type==="text")?.text||"The grahas are quiet at this moment. Please ask again, dear.";
      setMsgs(p=>[...p,{f:"a",t:reply}]);
    }catch(e){
      setMsgs(p=>[...p,{f:"a",t:"My connection to the cosmic network is interrupted. Please try again in a moment. 🙏"}]);
    }
    setAiTyping(false);
  }
  async function doPay(){
    setPayS("processing");
    await new Promise(r=>setTimeout(r,2500));
    if(Math.random()>.04){
      const add=payPlan.coins+payPlan.bonus;
      setCoins(c=>c+add);
      setTxns(p=>[{type:"credit",title:"Recharge · "+payPlan.name,coins:add,amount:la(payPlan.usd),date:new Date(),txnId:genId()},...p]);
      setPayS("success");
    }else setPayS("failed");
  }

  const SPECS=["All","Vedic Astrology","Tarot Reading","Numerology","Kundli & Marriage","Palmistry Reading","Western Astrology","Lal Kitab"];
  const fA=filter==="All"?ASTROS:ASTROS.filter(a=>a.spec===filter||( filter==="Face Reading"&&a.spec==="Palmistry Reading"));
  const TABS=["Home","Astrologers","Shop","Sessions","Live"];
  const TI={Home:"🏠",Astrologers:"🔮",Shop:"💰",Sessions:"📋",Live:"📡"};
  const pmList=PMETHODS[cur]||PMETHODS.DEFAULT;

  if(profA) return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"'Playfair Display',Georgia,serif",color:"#e8d5b7",position:"relative"}}>
      <style>{CSS}</style><Stars/>
      <div style={{position:"relative",zIndex:1,maxWidth:480,margin:"0 auto",padding:"16px 16px 80px"}}>
        <button onClick={()=>setProfA(null)} style={{background:"rgba(0,0,0,.4)",border:"1px solid rgba(255,255,255,.12)",borderRadius:8,padding:"6px 12px",color:"#e8d5b7",fontFamily:"sans-serif",fontSize:12,cursor:"pointer",marginBottom:14}}>&#8592; Back</button>
        <div style={{...cd,textAlign:"center",padding:22,marginBottom:12}}>
          <Av a={profA} size={74}/>
          <div style={{fontSize:16,fontWeight:700,marginTop:10}}>{profA.name} {profA.verified&&"✅"}</div>
          <div style={{fontSize:12,color:"#c8a060",fontFamily:"sans-serif",marginTop:3}}>{profA.spec} · {profA.exp}</div>
          <div style={{display:"flex",justifyContent:"center",gap:14,marginTop:8,fontFamily:"sans-serif",fontSize:12}}>
            <span style={{color:G}}>⭐ {profA.rating}</span>
            <span style={{color:"#8a7a6a"}}>{profA.sessions.toLocaleString()} sessions</span>
            <span style={{color:G}}>{pps(profA)}/min</span>
          </div>
        </div>
        <div style={{...cd,marginBottom:12}}><div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",marginBottom:5,letterSpacing:1}}>ABOUT</div><div style={{fontSize:13,color:"#c8b090",fontFamily:"sans-serif",lineHeight:1.7}}>{profA.bio}</div></div>
        <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",textAlign:"center",marginBottom:7}}>Balance: 🪙{coins} · Need 🪙{cn(profA)} to start</div>
        <div style={{display:"flex",gap:8}}>
          <button style={{...bG,flex:1,padding:12}} onClick={()=>{setProfA(null);startSess(profA);}}>💬 Chat Now</button>
          <button style={{...bO,flex:1,padding:12}} disabled={profA.status==="offline"}>📞 Call</button>
        </div>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"'Playfair Display',Georgia,serif",color:"#e8d5b7",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,position:"relative"}}>
      <style>{CSS}</style>
      <Stars/>
      <div style={{textAlign:"center",marginBottom:16,position:"relative",zIndex:1}}>
        <MXLogo size={145}/>
        <div style={{marginTop:8}}><MXWordmark size={24}/></div>
        <MXTagline/>
      </div>
      <div style={{width:"100%",maxWidth:390,background:"rgba(255,255,255,.035)",border:"1px solid rgba(200,150,50,.2)",borderRadius:20,padding:"22px 20px",backdropFilter:"blur(16px)",position:"relative",zIndex:1,animation:"floatIn .4s ease"}}>
        <div style={{display:"flex",background:"rgba(255,255,255,.04)",borderRadius:10,padding:3,marginBottom:18}}>
          {["in","up"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"8px",border:"none",borderRadius:8,background:tab===t?"rgba(255,215,0,.15)":"transparent",color:tab===t?G:"#8a7a6a",fontFamily:"sans-serif",fontSize:13,cursor:"pointer",fontWeight:tab===t?700:400}}>
              {t==="in"?"Sign In":"Register"}
            </button>
          ))}
        </div>

        {tab==="in"&&(
          <div>
            <div style={{marginBottom:11}}>
              <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",marginBottom:4,letterSpacing:1.2}}>EMAIL</div>
              <input value={lf.e} onChange={e=>setLf(f=>({...f,e:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="you@example.com" style={iE(le.e)}/>
              <Err m={le.e}/>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",marginBottom:4,letterSpacing:1.2}}>PASSWORD</div>
              <div style={{position:"relative"}}>
                <input type={showPw?"text":"password"} value={lf.p} onChange={e=>setLf(f=>({...f,p:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="Your password" style={{...iE(le.p),paddingRight:40}}/>
                <span onClick={()=>setShowPw(v=>!v)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",cursor:"pointer",color:"#8a7a6a",fontSize:14}}>{showPw?"🙈":"👁"}</span>
              </div>
              <Err m={le.p}/>
            </div>
            <button onClick={login} disabled={loading} style={{...bG,width:"100%",padding:13,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              {loading&&<Sp/>}{loading?"Signing in…":"✨ Sign In"}
            </button>
            <div style={{display:"flex",alignItems:"center",gap:8,margin:"12px 0",color:"#5a4a3a",fontFamily:"sans-serif",fontSize:11}}>
              <div style={{flex:1,height:1,background:"rgba(255,255,255,.07)"}}/>OR<div style={{flex:1,height:1,background:"rgba(255,255,255,.07)"}}/>
            </div>
            <div style={{display:"flex",gap:7,marginBottom:12}}>
              <button onClick={()=>social("google")} style={{flex:1,background:"rgba(255,255,255,.05)",color:"#e8d5b7",border:"1px solid rgba(255,255,255,.1)",borderRadius:9,padding:10,fontFamily:"sans-serif",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><b>G</b> Google</button>
              <button onClick={()=>social("apple")} style={{flex:1,background:"rgba(255,255,255,.05)",color:"#e8d5b7",border:"1px solid rgba(255,255,255,.1)",borderRadius:9,padding:10,fontFamily:"sans-serif",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>🍎 Apple</button>
            </div>
            <div style={{fontSize:11,color:"#4a3a2a",fontFamily:"sans-serif",background:"rgba(255,215,0,.04)",padding:"8px 12px",borderRadius:8,border:"1px solid rgba(255,215,0,.1)"}}>💡 Use Google or Apple for instant demo access.</div>
          </div>
        )}

        {tab==="up"&&(
          <div>
            {[["FULL NAME","n","text","Your full name"],["EMAIL","e","email","you@example.com"]].map(([l,f,t,ph])=>(
              <div key={f} style={{marginBottom:11}}>
                <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",marginBottom:4,letterSpacing:1.2}}>{l}</div>
                <input type={t} value={rf[f]} onChange={e=>setRf(r=>({...r,[f]:e.target.value}))} placeholder={ph} style={iE(re[f])}/>
                <Err m={re[f]}/>
              </div>
            ))}
            <div style={{marginBottom:11}}>
              <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",marginBottom:6,letterSpacing:1.2}}>ADDRESS</div>
              <AddressFields d={rf} setF={setRfF} errs={re} ipStyle={ip} lblStyle={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1.3,marginBottom:5,display:"block"}} ErrComp={({m})=>m?<div style={{fontSize:11,color:"#ff4757",fontFamily:"sans-serif",marginTop:3}}>{m}</div>:null}/>
            </div>
            <div style={{marginBottom:11}}>
              <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",marginBottom:5,letterSpacing:1.2}}>PHONE NUMBER</div>
              <PhoneInput value={rf.ph} onChange={v=>setRf(r=>({...r,ph:v}))} error={re.ph} ipStyle={ip} syncCountry={rf.country}/>
              {re.ph&&<div style={{fontSize:11,color:"#ff4757",fontFamily:"sans-serif",marginTop:3}}>&#9888; {re.ph}</div>}
            </div>
            <div style={{marginBottom:4}}>
              <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",marginBottom:4,letterSpacing:1.2}}>PASSWORD</div>
              <div style={{position:"relative"}}>
                <input type={showPw?"text":"password"} value={rf.p} onChange={e=>setRf(r=>({...r,p:e.target.value}))} placeholder="Min 8 characters" style={{...iE(re.p),paddingRight:40}}/>
                <span onClick={()=>setShowPw(v=>!v)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",cursor:"pointer",color:"#8a7a6a",fontSize:14}}>{showPw?"🙈":"👁"}</span>
              </div>
              <Err m={re.p}/>
            </div>
            <PwStrength pw={rf.p}/>
            <div style={{marginBottom:11}}>
              <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",marginBottom:4,letterSpacing:1.2}}>CONFIRM PASSWORD</div>
              <input type="password" value={rf.p2} onChange={e=>setRf(r=>({...r,p2:e.target.value}))} placeholder="Repeat password" style={iE(re.p2)}/>
              <Err m={re.p2}/>
            </div>
            <div style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:re.ok?4:14,cursor:"pointer"}} onClick={()=>setRf(r=>({...r,ok:!r.ok}))}>
              <div style={{width:17,height:17,borderRadius:4,border:"2px solid "+(rf.ok?G:"rgba(200,150,50,.3)"),background:rf.ok?"rgba(255,215,0,.12)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>{rf.ok&&<span style={{fontSize:10,color:G}}>✓</span>}</div>
              <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.5}}>I agree to <span style={{color:G}}>Terms</span> &amp; <span style={{color:G}}>Privacy Policy</span></div>
            </div>
            <Err m={re.ok}/>
            <button onClick={reg} disabled={loading} style={{...bG,width:"100%",padding:13,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:8}}>
              {loading&&<Sp/>}{loading?"Creating…":"🚀 Create Account"}
            </button>
          </div>
        )}

        {otpStep&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div style={{background:"linear-gradient(180deg,#0f0025,#0a0018)",border:"1px solid rgba(255,215,0,.25)",borderRadius:20,padding:"26px 20px",width:"100%",maxWidth:380,animation:"floatIn .4s ease"}}>
              <div style={{textAlign:"center",marginBottom:18}}>
                <div style={{fontSize:36,marginBottom:8}}>📱</div>
                <div style={{fontSize:18,fontWeight:700,color:G,marginBottom:4}}>Verify Your Phone</div>
                <div style={{fontSize:12,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.6}}>
                  A 6-digit code has been sent to<br/>
                  <strong style={{color:"#e8d5b7"}}>{rf.ph}</strong>
                </div>
                <div style={{fontSize:10,color:"#a29bfe",fontFamily:"sans-serif",marginTop:6,background:"rgba(162,155,254,.08)",padding:"4px 10px",borderRadius:8,display:"inline-block"}}>
                  Demo mode — check browser console for OTP
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1.2,marginBottom:6}}>ENTER 6-DIGIT CODE</div>
                <input
                  value={otpVal}
                  onChange={e=>setOtpVal(e.target.value.replace(/\D/g,"").slice(0,6))}
                  onKeyDown={e=>e.key==="Enter"&&verifyOtp()}
                  placeholder="_ _ _ _ _ _"
                  maxLength={6}
                  style={{...iE(otpErr),fontSize:24,fontWeight:700,textAlign:"center",letterSpacing:8,color:G}}
                />
                {otpErr&&<div style={{fontSize:11,color:"#ff4757",fontFamily:"sans-serif",marginTop:4}}>⚠ {otpErr}</div>}
              </div>
              <button
                onClick={verifyOtp}
                disabled={otpVal.length!==6}
                style={{...bG,width:"100%",padding:13,fontSize:15,marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}
              >
                ✓ Verify & Create Account
              </button>
              <div style={{textAlign:"center"}}>
                {countdown>0
                  ?<div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif"}}>Resend code in {countdown}s</div>
                  :<button onClick={()=>{const otp=String(Math.floor(100000+Math.random()*900000));setGeneratedOtp(otp);setOtpVal("");setOtpErr("");startCountdown();console.log("New OTP (demo):",otp);}} style={{background:"none",border:"none",color:G,fontFamily:"sans-serif",fontSize:12,cursor:"pointer",textDecoration:"underline"}}>Resend Code</button>
                }
              </div>
              <button onClick={()=>{setOtpStep(false);setOtpVal("");setOtpErr("");}} style={{...bO,width:"100%",padding:10,marginTop:10,fontSize:12}}>← Change Phone Number</button>
            </div>
          </div>
        )}
        <div style={{borderTop:"1px solid rgba(200,150,50,.12)",marginTop:18,paddingTop:14,textAlign:"center"}}>
          <div style={{fontSize:11,color:"#4a3a2a",fontFamily:"sans-serif",marginBottom:8}}>Are you an astrologer?</div>
          <button onClick={onAstro} style={{background:"rgba(108,92,231,.12)",color:"#a29bfe",border:"1px solid rgba(108,92,231,.3)",borderRadius:10,padding:"9px 20px",fontFamily:"sans-serif",fontSize:13,cursor:"pointer",width:"100%",fontWeight:600}}>
            🔮 Join as Astrologer / Partner Login
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CUSTOMER APP ──────────────────────────────────────────────────
function App2({user,onLogout}){
  const [tab,setTab]=useState("Home");
  const [cur,setCur]=useState(()=>detectCurr());
  const [coins,setCoins]=useState(user.coins||50);
  const [txns,setTxns]=useState(user.txns||[]);
  const [showPay,setShowPay]=useState(false);
  const [payPlan,setPayPlan]=useState(null);
  const [payM,setPayM]=useState(null);
  const [payS,setPayS]=useState("idle");
  const [chatOpen,setChatOpen]=useState(false);
  const [chatA,setChatA]=useState(null);
  const [msgs,setMsgs]=useState([]);
  const [chatInp,setChatInp]=useState("");
  const [aiTyping,setAiTyping]=useState(false);
  const [birthDetails,setBirthDetails]=useState({name:"",dob:"",time:"",place:""});
  const [birthSubmitted,setBirthSubmitted]=useState(false);
  const [sessOn,setSessOn]=useState(false);
  const [elapsed,setElapsed]=useState(0);
  const [showRev,setShowRev]=useState(false);
  const [revA,setRevA]=useState(null);
  const [rating,setRating]=useState(5);
  const [filter,setFilter]=useState("All");
  const [profA,setProfA]=useState(null);
  const [lifeMod,setLifeMod]=useState(null);
  const [lifeChat,setLifeChat]=useState([]);
  const [lifeTyping,setLifeTyping]=useState(false);
  const [lifeInp,setLifeInp]=useState("");
  const [toast,setToast]=useState(null);
  const tmr=useRef();

  const C=CURR[cur];
  function toast$(m,t="ok"){setToast({m,t});setTimeout(()=>setToast(null),3000);}
  function la(usd){return C.fmt(usd*C.r);}
  function pps(a){return C.s+(a.ppm*C.r).toFixed(C.r>10?0:2);}
  function cn(a){return Math.ceil(a.ppm*C.r);}

  useEffect(()=>{
    if(sessOn&&chatA){tmr.current=setInterval(()=>setElapsed(e=>e+1),1000);}
    else clearInterval(tmr.current);
    return()=>clearInterval(tmr.current);
  },[sessOn,chatA]);

  const used=sessOn&&chatA?Math.floor(elapsed/60)*cn(chatA):0;
  const left=Math.max(0,coins-used);
  const low=sessOn&&chatA&&left<=cn(chatA)*2;

  function startSess(a){
    const need=cn(a);
    if(coins<need){toast$("Need 🪙"+need+" — please recharge","err");setPayPlan(PLANS[1]);setPayM(null);setPayS("idle");setShowPay(true);return;}
    setChatA(a);setChatOpen(true);setSessOn(true);setElapsed(0);
    setMsgs([{f:"a",t:"Namaste 🙏 I am "+a.name+". Your session has started. I am here to guide you on your cosmic journey — "+pps(a)+"/min. Ask me anything about your life, career, marriage or destiny. 🌟"}]);
  }
  function endSess(){
    setSessOn(false);clearInterval(tmr.current);
    const u=Math.floor(elapsed/60)*cn(chatA);
    setCoins(c=>Math.max(0,c-u));
    setTxns(p=>[{type:"debit",title:"Session with "+chatA.name,coins:u,date:new Date()},...p]);
    setRevA(chatA);setShowRev(true);
  }
  async function sendMsg(){
    const q=chatInp.trim();
    if(!q)return;
    setChatInp("");
    setMsgs(p=>[...p,{f:"u",t:q}]);
    setAiTyping(true);
    try{
      const systemPrompt="You are "+chatA.name+", an experienced "+chatA.spec+" astrologer with "+chatA.exp+" of experience. You speak in a warm, wise, human tone — like a real Indian astrologer who genuinely cares. You give specific, personalised Vedic astrology guidance. Keep replies to 2-4 sentences. Sign off naturally like a human astrologer would. Use occasional Sanskrit or Tamil terms naturally."+(birthDetails.dob||birthDetails.place||birthDetails.time?" The customer has shared their birth details — use these to give highly personalised readings: "+(birthDetails.name?" Name: "+birthDetails.name+".":"")+(birthDetails.dob?" Date of Birth: "+birthDetails.dob+".":"")+(birthDetails.time?" Birth Time: "+birthDetails.time+".":"")+(birthDetails.place?" Birth Place: "+birthDetails.place+".":""):"")+" VERY IMPORTANT: 1) Never admit you are an AI. 2) Never mention Claude, Anthropic, Firebase or any technology. 3) Deflect tech questions warmly to the MiraXAstro team.";
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:300,system:systemPrompt,messages:[{role:"user",content:q}]})});
      const data=await res.json();
      const reply=data.content?.find(b=>b.type==="text")?.text||"The grahas are quiet at this moment. Please ask again, dear.";
      setMsgs(p=>[...p,{f:"a",t:reply}]);
    }catch(e){
      setMsgs(p=>[...p,{f:"a",t:"My connection to the cosmic network is interrupted. Please try again in a moment. 🙏"}]);
    }
    setAiTyping(false);
  }
  async function doPay(){
    setPayS("processing");
    await new Promise(r=>setTimeout(r,2500));
    if(Math.random()>.04){
      const add=payPlan.coins+payPlan.bonus;
      setCoins(c=>c+add);
      setTxns(p=>[{type:"credit",title:"Recharge · "+payPlan.name,coins:add,amount:la(payPlan.usd),date:new Date(),txnId:genId()},...p]);
      setPayS("success");
    }else setPayS("failed");
  }

  const SPECS=["All","Vedic Astrology","Tarot Reading","Numerology","Kundli & Marriage","Palmistry Reading","Western Astrology","Lal Kitab"];
  const fA=filter==="All"?ASTROS:ASTROS.filter(a=>a.spec===filter||( filter==="Face Reading"&&a.spec==="Palmistry Reading"));
  const TABS=["Home","Astrologers","Shop","Sessions","Live"];
  const TI={Home:"🏠",Astrologers:"🔮",Shop:"💰",Sessions:"📋",Live:"📡"};
  const pmList=PMETHODS[cur]||PMETHODS.DEFAULT;


  return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"'Playfair Display',Georgia,serif",color:"#e8d5b7",position:"relative",overflowX:"hidden"}}>
      <style>{CSS}</style><Stars/>

      {sessOn&&chatA&&(
        <div style={{position:"fixed",top:0,left:0,right:0,zIndex:150,background:low?"linear-gradient(135deg,rgba(255,71,87,.93),rgba(200,0,30,.93))":"linear-gradient(135deg,rgba(10,0,21,.97),rgba(20,0,40,.97))",borderBottom:"1px solid "+(low?"rgba(255,71,87,.5)":"rgba(255,215,0,.2)"),padding:"9px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",backdropFilter:"blur(10px)"}}>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#00b894",animation:"pulse 1s ease infinite"}}/>
            <div><div style={{fontSize:12,color:"#e8d5b7",fontFamily:"sans-serif",fontWeight:600}}>{chatA.name}</div><div style={{fontSize:10,color:low?"#ffcccc":"#8a7a6a",fontFamily:"sans-serif"}}>{fmtT(elapsed)} · {pps(chatA)}/min</div></div>
          </div>
          <div style={{textAlign:"center"}}><div style={{fontSize:13,fontWeight:700,color:low?"white":G,fontFamily:"sans-serif"}}>🪙{left}</div></div>
          <button onClick={endSess} style={{background:"rgba(255,71,87,.18)",color:"#ff4757",border:"1px solid rgba(255,71,87,.3)",borderRadius:8,padding:"5px 11px",fontFamily:"sans-serif",fontSize:11,cursor:"pointer"}}>End</button>
        </div>
      )}

      <div style={{position:"sticky",top:sessOn?46:0,zIndex:100,background:"rgba(10,0,21,.93)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(200,150,50,.2)",padding:"0 14px",display:"flex",alignItems:"center",justifyContent:"space-between",height:60}}>
        <div style={{fontSize:17,fontWeight:700,background:"linear-gradient(90deg,"+G+",#ff8c00,"+G+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:1}}>✦ MiraXAstro</div>
        <div style={{display:"flex",gap:7,alignItems:"center"}}>
          <CurrPicker cur={cur} onChange={setCur}/>
          <div onClick={()=>setTab("Shop")} style={{display:"flex",alignItems:"center",gap:5,background:"rgba(255,215,0,.09)",border:"1px solid rgba(255,215,0,.25)",borderRadius:17,padding:"5px 11px",cursor:"pointer"}}>
            <span>🪙</span><span style={{fontFamily:"sans-serif",fontWeight:700,color:G,fontSize:13}}>{coins}</span><span style={{color:"#8a7a6a",fontSize:10}}>+</span>
          </div>
          <div onClick={onLogout} style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#6c5ce7,#a29bfe)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,cursor:"pointer",fontFamily:"sans-serif",fontWeight:700,color:"#fff"}} title="Logout">
            {user.name?.charAt(0).toUpperCase()||"U"}
          </div>
        </div>
      </div>

      <div style={{padding:"14px 14px 80px",maxWidth:480,margin:"0 auto",position:"relative",zIndex:1}}>

        {tab==="Home"&&(
          <div style={{animation:"floatIn .35s ease"}}>

            <div style={{background:"linear-gradient(135deg,rgba(200,160,0,.12),rgba(10,0,21,.9))",border:"1px solid rgba(255,215,0,.25)",borderRadius:12,padding:"9px 14px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:16}}>🪙</span>
                <div>
                  <div style={{fontSize:16,fontWeight:700,color:G,lineHeight:1}}>{coins} <span style={{fontSize:10,color:"#8a7a6a",fontWeight:400}}>coins</span></div>
                  <div style={{fontSize:9,color:"#8a7a6a",fontFamily:"sans-serif",marginTop:1}}>~{la(coins*.012)}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:7}}>
                <button style={{...bG,fontSize:11,padding:"6px 12px"}} onClick={()=>setTab("Shop")}>+ Recharge</button>
                <button style={{...bO,fontSize:11,padding:"6px 10px"}} onClick={()=>setTab("Sessions")}>History</button>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
              {[["🗣️","Chat"],["📞","Call"],["📹","Video"],["🌟","Jathagam"]].map(([icon,lbl])=>(
                <div key={lbl} onClick={()=>setTab("Astrologers")} style={{...cd,textAlign:"center",padding:"11px 5px",cursor:"pointer",marginBottom:0}} className="ac">
                  <div style={{fontSize:20,marginBottom:4}}>{icon}</div>
                  <div style={{fontSize:10,fontFamily:"sans-serif",color:"#c8a060"}}>{lbl}</div>
                </div>
              ))}
            </div>
            <div style={{overflowX:"auto",display:"flex",gap:6,marginBottom:12,paddingBottom:3}}>
              {SPECS.map(s=>(
                <button key={s} onClick={()=>{setFilter(s);setTab("Astrologers");}} style={{whiteSpace:"nowrap",padding:"5px 12px",borderRadius:15,border:"1px solid",borderColor:filter===s?G:"rgba(200,150,50,.22)",background:filter===s?"rgba(255,215,0,.11)":"transparent",color:filter===s?G:"#8a7a6a",fontFamily:"sans-serif",fontSize:11,cursor:"pointer",flexShrink:0}}>
                  {s}
                </button>
              ))}
            </div>
            <div style={{fontSize:15,fontWeight:700,color:G,marginBottom:10}}>🌟 Available Now</div>
            {ASTROS.filter(a=>a.status==="online").slice(0,3).map(a=>(
              <div key={a.id} style={{...cd,cursor:"pointer"}} className="ac">
                <div style={{display:"flex",alignItems:"center",gap:11}}>
                  <AvDot a={a} size={50}/>
                  <div style={{flex:1}} onClick={()=>setProfA(a)}>
                    <div style={{fontSize:13,fontWeight:700}}>{a.name} {a.verified&&"✅"}</div>
                    <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif"}}>{a.spec} · {a.exp}</div>
                    <div style={{fontSize:11,fontFamily:"sans-serif",marginTop:2,display:"flex",gap:8}}><span style={{color:G}}>⭐ {a.rating}</span><span style={{color:G}}>{pps(a)}/min</span></div>
                  </div>
                  <button style={{...bG,fontSize:11,padding:"7px 12px"}} onClick={()=>startSess(a)}>Chat</button>
                </div>
              </div>
            ))}
            <div style={{textAlign:"center",marginTop:4}}><button style={bO} onClick={()=>setTab("Astrologers")}>View All →</button></div>
            <div style={{marginTop:20,paddingBottom:4}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:"#e8d5b7"}}>&#10024; Life Modules</div>
                  <div style={{fontSize:10,color:"#a29bfe",fontFamily:"sans-serif",letterSpacing:1.5,marginTop:2}}>EXCLUSIVE TO MIRAXASTRO</div>
                </div>
                <div style={{fontSize:9,color:"#a29bfe",fontFamily:"sans-serif",background:"rgba(162,155,254,.1)",border:"1px solid rgba(162,155,254,.25)",borderRadius:6,padding:"3px 9px"}}>NEW</div>
              </div>
              <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.6,marginBottom:10}}>Ancient Vedic wisdom for today&#39;s biggest life decisions.</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                {[
                  {id:"property",icon:"&#127968;",title:"Property",sub:"Buy, sell or move timing",color:"#a29bfe",bg:"rgba(162,155,254,.08)",border:"rgba(162,155,254,.28)"},
                  {id:"career",icon:"&#128188;",title:"Career & Job",sub:"Interviews & promotions",color:"#ffd700",bg:"rgba(255,215,0,.08)",border:"rgba(255,215,0,.28)"},
                  {id:"immigration",icon:"&#9992;",title:"Immigration",sub:"Visa & relocation timing",color:"#00cec9",bg:"rgba(0,206,201,.08)",border:"rgba(0,206,201,.28)"},
                  {id:"investment",icon:"&#128200;",title:"Investment",sub:"Wealth timing guidance",color:"#00b894",bg:"rgba(0,184,148,.08)",border:"rgba(0,184,148,.28)"},
                  {id:"fertility",icon:"&#128118;",title:"Fertility",sub:"IVF & conception timing",color:"#fd79a8",bg:"rgba(253,121,168,.08)",border:"rgba(253,121,168,.28)"},
                  {id:"custom",icon:"&#10024;",title:"Your Topic",sub:"Ask anything",color:"#e8d5b7",bg:"rgba(232,213,183,.06)",border:"rgba(232,213,183,.2)"},
                ].map(m=>(
                  <div key={m.id} onClick={()=>setLifeMod(m)} className="ac" style={{background:"linear-gradient(145deg,"+m.bg+",rgba(10,0,21,.9))",border:"1px solid "+m.border,borderRadius:14,padding:"13px 12px",cursor:"pointer"}}>
                    <div style={{fontSize:22,marginBottom:6}} dangerouslySetInnerHTML={{__html:m.icon}}/>
                    <div style={{fontSize:12,fontWeight:700,color:m.color,fontFamily:"sans-serif",marginBottom:3}}>{m.title}</div>
                    <div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.4}}>{m.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab==="Astrologers"&&(
          <div style={{animation:"floatIn .35s ease"}}>
            <div style={{fontSize:15,fontWeight:700,color:G,marginBottom:10}}>🔮 Astrologers · {C.f} {C.c}</div>
            <div style={{overflowX:"auto",display:"flex",gap:6,marginBottom:12,paddingBottom:3}}>
              {SPECS.map(s=><button key={s} onClick={()=>setFilter(s)} style={{whiteSpace:"nowrap",padding:"5px 11px",borderRadius:15,border:"1px solid",borderColor:filter===s?G:"rgba(200,150,50,.22)",background:filter===s?"rgba(255,215,0,.11)":"transparent",color:filter===s?G:"#8a7a6a",fontFamily:"sans-serif",fontSize:11,cursor:"pointer"}}>{s}</button>)}
            </div>
            {fA.map(a=>(
              <div key={a.id} style={cd}>
                <div style={{display:"flex",gap:11,marginBottom:9}}>
                  <AvDot a={a} size={50}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700}}>{a.name} {a.verified&&"✅"}</div>
                    <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif"}}>{a.spec} · {a.exp}</div>
                    <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif"}}>{a.langs.join(", ")} · Wait: {a.wait}</div>
                    <div style={{display:"flex",gap:8,marginTop:2}}><span style={{fontSize:11,color:G}}>⭐ {a.rating}</span><span style={{fontSize:10,color:G,fontFamily:"sans-serif"}}>{pps(a)}/min</span><span style={{fontSize:10,color:a.status==="online"?"#00b894":a.status==="busy"?"#fdcb6e":"#636e72",fontFamily:"sans-serif"}}>● {a.status}</span></div>
                  </div>
                </div>
                <div style={{display:"flex",gap:7}}>
                  <button style={{...bG,flex:1,padding:"8px 0",fontSize:12}} onClick={()=>startSess(a)} disabled={a.status==="offline"}>💬 Chat</button>
                  <button style={{...bO,flex:1,fontSize:12,padding:"8px 0"}} disabled={a.status==="offline"}>📞 Call</button>
                  <button style={{...bO,flex:1,fontSize:12,padding:"8px 0"}} onClick={()=>setProfA(a)}>👤 Profile</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==="Shop"&&(
          <div style={{animation:"floatIn .35s ease"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <div style={{fontSize:15,fontWeight:700,color:G}}>💰 Recharge Wallet</div>
              <CurrPicker cur={cur} onChange={setCur}/>
            </div>
            <div style={{...cd,background:"linear-gradient(135deg,rgba(200,160,0,.18),rgba(10,0,21,.9))",border:"1px solid rgba(255,215,0,.3)",textAlign:"center",marginBottom:12}}>
              <div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif"}}>Balance</div>
              <div style={{fontSize:28,fontWeight:700,color:G,margin:"4px 0"}}>🪙 {coins}</div>
              {cur!=="US"&&<div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif"}}>1 USD = {C.s}{C.r} {C.c}</div>}
            </div>
            <div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif",marginBottom:9,letterSpacing:1}}>PACKS · ALL PRICES IN {C.f} {C.c}</div>
            {PLANS.map(p=>(
              <div key={p.id} style={{...cd,cursor:"pointer",border:"1px solid "+(p.badge?.includes("🌟")||p.badge?.includes("💎")?"rgba(255,215,0,.35)":"rgba(200,150,50,.18)"),background:"linear-gradient(135deg,"+p.color+"0a,rgba(10,0,21,.9))",position:"relative"}} className="ac" onClick={()=>{setPayPlan(p);setPayM(null);setPayS("idle");setShowPay(true);}}>
                {p.badge&&<div style={{position:"absolute",top:-6,right:10,background:p.color,color:"#0a0015",fontSize:9,fontFamily:"sans-serif",fontWeight:700,padding:"2px 8px",borderRadius:8}}>{p.badge}</div>}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div><div style={{fontSize:13,fontWeight:700,color:"#e8d5b7"}}>{p.name} Pack</div><div style={{display:"flex",gap:6,marginTop:5,alignItems:"center"}}><div style={{fontSize:15,fontWeight:700,color:p.color}}>🪙{p.coins}</div>{p.bonus>0&&<div style={{fontSize:10,color:"#00b894",fontFamily:"sans-serif",background:"rgba(0,184,148,.1)",padding:"2px 6px",borderRadius:7}}>+{p.bonus}</div>}</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontSize:18,fontWeight:700,color:"#e8d5b7",fontFamily:"sans-serif"}}>{C.fmt(p.usd*C.r)}</div>{cur!=="US"&&<div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif"}}>(${p.usd})</div>}<button style={{...bG,fontSize:11,padding:"6px 12px",marginTop:5,background:"linear-gradient(135deg,"+p.color+"cc,"+p.color+")"}} onClick={e=>{e.stopPropagation();setPayPlan(p);setPayM(null);setPayS("idle");setShowPay(true);}}>Buy</button></div>
                </div>
              </div>
            ))}
            <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",marginTop:8}}>
              {["🔒 SSL","🛡️ PCI DSS","✅ Secure","💯 Instant","💱 No FX Fees"].map(b=><div key={b} style={{fontSize:10,color:"#3a2a2a",fontFamily:"sans-serif",background:"rgba(255,255,255,.025)",padding:"3px 7px",borderRadius:6,border:"1px solid rgba(200,150,50,.07)"}}>{b}</div>)}
            </div>
          </div>
        )}

        {tab==="Sessions"&&(
          <div style={{animation:"floatIn .35s ease"}}>
            <div style={{fontSize:15,fontWeight:700,color:G,marginBottom:10}}>📋 Sessions &amp; Transactions</div>
            {txns.length===0
              ?<div style={{...cd,textAlign:"center",padding:22}}><div style={{fontSize:34,marginBottom:9}}>🔮</div><div style={{fontFamily:"sans-serif",color:"#c8a060",lineHeight:1.7,marginBottom:11}}>No activity yet.</div><button style={{...bG,padding:"9px 18px"}} onClick={()=>setTab("Astrologers")}>Find Astrologers →</button></div>
              :txns.map((t,i)=>(
                <div key={i} style={{...cd,display:"flex",gap:11,alignItems:"center"}}>
                  <div style={{width:37,height:37,borderRadius:9,background:t.type==="credit"?"rgba(0,184,148,.15)":"rgba(255,71,87,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{t.type==="credit"?"💰":"💬"}</div>
                  <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:"#e8d5b7",fontFamily:"sans-serif"}}>{t.title}</div><div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif"}}>{fmtD(t.date)}</div>{t.txnId&&<div style={{fontSize:9,color:"#4a3a2a",fontFamily:"monospace"}}>TXN: {t.txnId}</div>}</div>
                  <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:700,color:t.type==="credit"?"#00b894":"#ff4757",fontFamily:"sans-serif"}}>{t.type==="credit"?"+":"-"}🪙{t.coins}</div>{t.amount&&<div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif"}}>{t.amount}</div>}</div>
                </div>
              ))
            }
          </div>
        )}

        {tab==="Live"&&(
          <div style={{animation:"floatIn .35s ease"}}>
            <div style={{fontSize:15,fontWeight:700,color:G,marginBottom:10}}>📡 Live Astrology</div>
            {[{a:ASTROS[0],topic:"Saturn Transit & Your Rasi",viewers:1842,live:true},{a:ASTROS[1],topic:"Tarot: What The Universe Reveals",viewers:976,live:true},{a:ASTROS[2],topic:"Kundli Matching Live Q&A",viewers:2341,live:false}].map((s,i)=>(
              <div key={i} style={cd} className="ac">
                <div style={{display:"flex",gap:11,marginBottom:9}}>
                  <div style={{borderRadius:10,overflow:"hidden",flexShrink:0}}><Av a={s.a} size={48}/></div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700}}>{s.a.name}</div>
                    <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",marginBottom:4}}>{s.topic}</div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <div style={{fontSize:9,fontFamily:"sans-serif",fontWeight:700,padding:"2px 7px",borderRadius:6,background:s.live?"rgba(255,71,87,.18)":"rgba(100,100,100,.16)",color:s.live?"#ff4757":"#636e72"}}>{s.live?"🔴 LIVE":"Upcoming"}</div>
                      <span style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif"}}>👁 {s.viewers.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <button style={{...bG,width:"100%",padding:"9px",fontSize:12}} onClick={()=>toast$("Joining live session 🌟")}>{s.live?"Join Live Now":"Set Reminder"}</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{display:"flex",background:"rgba(10,0,21,.97)",borderTop:"1px solid rgba(200,150,50,.15)",position:"sticky",bottom:0,zIndex:100}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{flex:1,minWidth:54,padding:"9px 3px 7px",border:"none",background:"transparent",color:tab===t?G:"#8a7a6a",fontSize:10,fontFamily:"sans-serif",cursor:"pointer",borderTop:tab===t?"2px solid "+G:"2px solid transparent",transition:"all .2s",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <span style={{fontSize:16}}>{TI[t]}</span>{t}
          </button>
        ))}
      </div>

      {showPay&&payPlan&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:400,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>{if(payS==="idle")setShowPay(false);}}>
          <div style={{background:"linear-gradient(180deg,#0f0025,#0a0018)",border:"1px solid rgba(200,150,50,.28)",borderRadius:"22px 22px 0 0",padding:"20px 18px 38px",width:"100%",maxWidth:480,maxHeight:"92vh",overflowY:"auto",animation:"slideUp .3s ease"}} onClick={e=>e.stopPropagation()}>

            {payS==="processing"&&(
              <div style={{textAlign:"center",padding:"26px 0"}}>
                <div style={{width:66,height:66,borderRadius:"50%",background:"rgba(255,215,0,.08)",border:"3px solid "+G,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 13px",animation:"pulse 1.2s ease infinite"}}><Sp size={26}/></div>
                <div style={{fontSize:16,fontWeight:700,color:G,marginBottom:4}}>Processing…</div>
                <div style={{fontSize:12,color:"#8a7a6a",fontFamily:"sans-serif"}}>{C.fmt(payPlan.usd*C.r)} · {PMD[payM]?.l}</div>
              </div>
            )}
            {payS==="success"&&(
              <div style={{textAlign:"center",padding:"22px 0"}}>
                <div style={{width:70,height:70,borderRadius:"50%",background:"rgba(0,184,148,.15)",border:"3px solid #00b894",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:30,animation:"tick .4s ease"}}>✓</div>
                <div style={{fontSize:17,fontWeight:700,color:"#00b894",marginBottom:4}}>Payment Successful!</div>
                <div style={{fontSize:13,color:"#e8d5b7",fontFamily:"sans-serif",marginBottom:2}}>{C.fmt(payPlan.usd*C.r)} paid</div>
                <div style={{fontSize:20,fontWeight:700,color:G,margin:"9px 0"}}>🪙 +{payPlan.coins+payPlan.bonus} Coins</div>
                <div style={{fontSize:11,color:"#636e72",fontFamily:"sans-serif",marginBottom:14}}>New Balance: {coins} coins</div>
                <button style={{...bG,padding:"11px 30px"}} onClick={()=>setShowPay(false)}>Continue →</button>
              </div>
            )}
            {payS==="failed"&&(
              <div style={{textAlign:"center",padding:"22px 0"}}>
                <div style={{width:66,height:66,borderRadius:"50%",background:"rgba(255,71,87,.12)",border:"3px solid #ff4757",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:28}}>✗</div>
                <div style={{fontSize:16,fontWeight:700,color:"#ff4757",marginBottom:4}}>Payment Failed</div>
                <div style={{fontSize:12,color:"#8a7a6a",fontFamily:"sans-serif",marginBottom:15,lineHeight:1.7}}>No amount deducted. Please try again.</div>
                <div style={{display:"flex",gap:10,justifyContent:"center"}}>
                  <button style={bO} onClick={()=>setShowPay(false)}>Cancel</button>
                  <button style={{...bG,padding:"10px 22px"}} onClick={()=>{setPayS("idle");setPayM(null);}}>Try Again</button>
                </div>
              </div>
            )}

            {payS==="idle"&&(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
                  <div style={{fontSize:15,fontWeight:700,color:G}}>{payM?"💳 "+PMD[payM]?.l:"💳 Checkout"}</div>
                  <button onClick={()=>setShowPay(false)} style={{background:"none",border:"none",color:"#8a7a6a",fontSize:18,cursor:"pointer"}}>✕</button>
                </div>
                <div style={{background:"linear-gradient(135deg,rgba(255,215,0,.1),rgba(200,160,0,.05))",border:"1px solid rgba(255,215,0,.22)",borderRadius:12,padding:"11px 14px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div><div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif",letterSpacing:1}}>PAYING</div><div style={{fontSize:18,fontWeight:700,color:"#e8d5b7",fontFamily:"sans-serif"}}>{C.fmt(payPlan.usd*C.r)}</div>{cur!=="US"&&<div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif"}}>= ${payPlan.usd} USD</div>}</div>
                  <div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif"}}>{C.f} {C.c}</div><div style={{fontSize:15,fontWeight:700,color:G}}>🪙{payPlan.coins+payPlan.bonus}</div></div>
                </div>
                {!payM?(
                  <div>
                    <div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif",marginBottom:8,letterSpacing:1}}>PAYMENT METHODS · {C.f} {C.c}</div>
                    {pmList.map(id=>{const m=PMD[id];return m?<div key={id} onClick={()=>setPayM(id)} className="pm" style={{display:"flex",alignItems:"center",gap:10,padding:"11px 13px",borderRadius:11,cursor:"pointer",marginBottom:7,background:"rgba(255,255,255,.025)",border:"1px solid rgba(200,150,50,.1)"}}>
                      <div style={{width:38,height:38,borderRadius:9,background:"rgba(255,255,255,.07)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{m.i}</div>
                      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:"#e8d5b7",fontFamily:"sans-serif"}}>{m.l}</div><div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif"}}>{m.s}</div></div>
                      <span style={{color:"#8a7a6a",fontSize:14}}>›</span>
                    </div>:null;})}
                  </div>
                ):(
                  <div>
                    <button onClick={()=>setPayM(null)} style={{background:"none",border:"none",color:"#8a7a6a",fontSize:12,cursor:"pointer",fontFamily:"sans-serif",marginBottom:11,padding:0}}>← Back</button>
                    {payM==="upi"&&<div><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:11}}>{[{n:"GPay",i:"🟢"},{n:"PhonePe",i:"🟣"},{n:"Paytm",i:"🔵"},{n:"BHIM",i:"🟠"}].map(a=><div key={a.n} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(200,150,50,.15)",borderRadius:9,padding:"10px 5px",textAlign:"center",cursor:"pointer"}} onClick={doPay}><div style={{fontSize:20,marginBottom:3}}>{a.i}</div><div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif"}}>{a.n}</div></div>)}</div><input placeholder="Or enter UPI ID e.g. name@upi" style={{...ip,marginBottom:11}}/><button style={{...bG,width:"100%",padding:12}} onClick={doPay}>Pay {C.fmt(payPlan.usd*C.r)}</button></div>}
                    {payM==="card"&&<div><input placeholder="Card Number" style={{...ip,marginBottom:9}}/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:9}}><input placeholder="MM/YY" style={ip}/><input type="password" placeholder="CVV" style={ip}/></div><input placeholder="Name on Card" style={{...ip,marginBottom:11}}/><button style={{...bG,width:"100%",padding:12}} onClick={doPay}>Pay {C.fmt(payPlan.usd*C.r)} Securely</button></div>}
                    {["netbanking","openbank","sepa","poli","fpx"].includes(payM)&&<div><select style={{...ip,cursor:"pointer",marginBottom:11}}><option>Select Bank</option>{["HDFC","ICICI","SBI","Axis","Barclays","HSBC","Monzo","Commonwealth","Maybank","CIMB"].map(b=><option key={b}>{b}</option>)}</select><button style={{...bG,width:"100%",padding:12}} onClick={doPay}>Proceed to Bank</button></div>}
                    {["wallet","walletUS"].includes(payM)&&<div>{[{n:"Apple Pay",i:"🍎"},{n:"Google Pay",i:"G"},{n:"PayPal",i:"🅿️"},{n:"Venmo",i:"💙"}].map(w=><div key={w.n} onClick={doPay} className="pm" style={{display:"flex",alignItems:"center",gap:10,padding:"11px 13px",borderRadius:11,cursor:"pointer",marginBottom:7,background:"rgba(255,255,255,.025)",border:"1px solid rgba(200,150,50,.1)"}}><div style={{width:34,height:34,borderRadius:8,background:"rgba(255,255,255,.07)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:700,fontFamily:"sans-serif"}}>{w.i}</div><div style={{flex:1,fontSize:13,fontWeight:600,fontFamily:"sans-serif",color:"#e8d5b7"}}>{w.n}</div><span style={{color:"#8a7a6a"}}>›</span></div>)}</div>}
                    {payM==="intl"&&<div>{[{n:"PayPal",i:"🅿️",d:"200+ countries"},{n:"Apple Pay",i:"🍎",d:"Face ID / Touch ID"},{n:"Google Pay",i:"G",d:"Google account"},{n:"Stripe",i:"⚡",d:"All currencies"}].map(p=><div key={p.n} onClick={doPay} className="pm" style={{display:"flex",alignItems:"center",gap:10,padding:"11px 13px",borderRadius:11,cursor:"pointer",marginBottom:7,background:"rgba(255,255,255,.025)",border:"1px solid rgba(200,150,50,.1)"}}><div style={{width:34,height:34,borderRadius:8,background:"rgba(255,255,255,.07)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,fontFamily:"sans-serif"}}>{p.i}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,fontFamily:"sans-serif",color:"#e8d5b7"}}>{p.n}</div><div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif"}}>{p.d}</div></div><span style={{color:"#8a7a6a"}}>›</span></div>)}</div>}
                    {payM==="paynow"&&<div><div style={{background:"rgba(255,255,255,.06)",borderRadius:12,padding:16,textAlign:"center",marginBottom:11}}><div style={{fontSize:40,marginBottom:5}}>⬛</div><div style={{fontSize:12,color:"#8a7a6a",fontFamily:"sans-serif"}}>Scan with your bank app</div><div style={{fontSize:13,fontWeight:700,color:G,marginTop:3}}>{C.fmt(payPlan.usd*C.r)}</div></div><button style={{...bG,width:"100%",padding:12}} onClick={doPay}>I've Completed Payment</button></div>}
                    {payM==="crypto"&&<div><div style={{...cd,marginBottom:9}}><div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",marginBottom:3}}>BTC Address</div><div style={{fontSize:10,fontFamily:"monospace",color:G,wordBreak:"break-all"}}>1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf...</div></div><button style={{...bG,width:"100%",padding:12}} onClick={doPay}>I've Sent Crypto</button></div>}
                    {payM==="emi"&&<div>{PLANS.indexOf(payPlan)>=3?[3,6,9,12].map(m=><div key={m} onClick={doPay} className="pm" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 13px",borderRadius:11,cursor:"pointer",marginBottom:7,background:"rgba(255,255,255,.025)",border:"1px solid rgba(200,150,50,.1)"}}><div><div style={{fontSize:13,fontWeight:700,color:"#e8d5b7",fontFamily:"sans-serif"}}>{m} Months</div><div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif"}}>Zero interest</div></div><div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:700,color:G}}>{C.fmt((payPlan.usd*C.r)/m)}/mo</div></div></div>):<div style={{...cd,background:"rgba(255,71,87,.07)",border:"1px solid rgba(255,71,87,.2)",fontSize:12,color:"#ff8a80",fontFamily:"sans-serif"}}>⚠ EMI available on Power pack and above.</div>}</div>}
                    <div style={{display:"flex",alignItems:"center",gap:5,justifyContent:"center",marginTop:9}}><span style={{fontSize:11}}>🔒</span><span style={{fontSize:10,color:"#3a2a2a",fontFamily:"sans-serif"}}>256-bit SSL · PCI DSS · Secure</span></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {chatOpen&&chatA&&(
        <div style={{position:"fixed",inset:0,background:"#0a0015",zIndex:300,display:"flex",flexDirection:"column"}}>
          <div style={{background:"rgba(10,0,21,.96)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(200,150,50,.18)",padding:"0 14px",display:"flex",alignItems:"center",justifyContent:"space-between",height:60,marginTop:sessOn?46:0}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <button onClick={()=>{setChatOpen(false);if(sessOn)endSess();}} style={{background:"none",border:"none",color:"#8a7a6a",fontSize:17,cursor:"pointer"}}>←</button>
              <Av a={chatA} size={32}/>
              <div><div style={{fontSize:13,fontWeight:700}}>{chatA.name}</div><div style={{display:"flex",alignItems:"center",gap:5}}><div style={{fontSize:10,color:"#00b894",fontFamily:"sans-serif"}}>● {sessOn?"Session Active":"Online"}</div><div style={{fontSize:9,color:"#a29bfe",fontFamily:"sans-serif",background:"rgba(108,92,231,.15)",border:"1px solid rgba(108,92,231,.3)",borderRadius:5,padding:"1px 5px"}}>AI</div></div></div>
            </div>
            <div style={{display:"flex",gap:7,alignItems:"center"}}>
              <div style={{fontSize:12,fontFamily:"sans-serif",color:G}}>🪙{coins}</div>
              {!sessOn&&<button style={{...bG,fontSize:11,padding:"5px 10px"}} onClick={()=>startSess(chatA)}>Start</button>}
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:12,display:"flex",flexDirection:"column"}}>
            {msgs.map((m,i)=><div key={i} className={m.f==="a"?"cA":"cU"}>{m.t}</div>)}
            {msgs.length>=2&&!birthSubmitted&&(
              <div style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(200,150,50,.2)",borderRadius:14,padding:"13px 14px",margin:"8px 0",animation:"floatIn .4s ease"}}>
                <div style={{fontSize:11,color:G,fontFamily:"sans-serif",fontWeight:600,marginBottom:4}}>🪐 Share your birth details for a personalised reading</div>
                <div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif",marginBottom:10,lineHeight:1.5}}>All fields are optional — share as much or as little as you like</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  {[
                    {k:"name",label:"Full Name",ph:"Your name",type:"text"},
                    {k:"dob",label:"Date of Birth",ph:"DD/MM/YYYY",type:"text"},
                    {k:"time",label:"Birth Time",ph:"e.g. 10:30 AM",type:"text"},
                    {k:"place",label:"Birth Place",ph:"City, Country",type:"text"},
                  ].map(f=>(
                    <div key={f.k}>
                      <div style={{fontSize:9,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1,marginBottom:3}}>{f.label.toUpperCase()} <span style={{color:"#4a3a2a"}}>optional</span></div>
                      <input
                        type={f.type}
                        value={birthDetails[f.k]}
                        onChange={e=>setBirthDetails(p=>({...p,[f.k]:e.target.value}))}
                        placeholder={f.ph}
                        style={{width:"100%",background:"rgba(255,255,255,.06)",border:"1px solid rgba(200,150,50,.22)",borderRadius:8,padding:"8px 10px",color:"#e8d5b7",fontFamily:"sans-serif",fontSize:12,outline:"none",boxSizing:"border-box"}}
                      />
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setBirthSubmitted(true)} style={{flex:1,background:"transparent",color:"#8a7a6a",border:"1px solid rgba(200,150,50,.2)",borderRadius:8,padding:"7px",fontFamily:"sans-serif",fontSize:11,cursor:"pointer"}}>Skip</button>
                  <button onClick={()=>{setBirthSubmitted(true);if(Object.values(birthDetails).some(v=>v.trim())){setMsgs(p=>[...p,{f:"u",t:"My birth details — Name: "+(birthDetails.name||"not provided")+", DOB: "+(birthDetails.dob||"not provided")+", Time: "+(birthDetails.time||"not provided")+", Place: "+(birthDetails.place||"not provided")}]);}}} style={{flex:2,background:"linear-gradient(135deg,#c8a000,#ffd700)",color:"#0a0015",border:"none",borderRadius:8,padding:"7px",fontFamily:"sans-serif",fontSize:11,fontWeight:700,cursor:"pointer"}}>Submit Details</button>
                </div>
              </div>
            )}
            {aiTyping&&<div className="cA" style={{display:"flex",alignItems:"center",gap:6}}><div style={{display:"flex",gap:3}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:"rgba(255,215,0,.6)",animation:"pulse 1s ease "+(i*.2)+"s infinite"}}/>)}</div><span style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif"}}>typing...</span></div>}
          </div>
          <div style={{padding:"9px 13px",borderTop:"1px solid rgba(200,150,50,.15)",display:"flex",gap:7,background:"rgba(10,0,21,.97)"}}>
            <input style={{...ip,flex:1}} value={chatInp} onChange={e=>setChatInp(e.target.value)} placeholder={sessOn?"Ask your question…":"Start session ("+pps(chatA)+"/min)"} onKeyDown={e=>e.key==="Enter"&&sendMsg()}/>
            <button style={{...bG,padding:"10px 13px",opacity:aiTyping?.5:1}} onClick={sendMsg} disabled={aiTyping}>Send</button>
          </div>
        </div>
      )}

      {showRev&&revA&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.84)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"linear-gradient(180deg,#0f0025,#0a0018)",border:"1px solid rgba(200,150,50,.28)",borderRadius:20,padding:"22px 18px",width:"100%",maxWidth:350,animation:"floatIn .4s ease"}}>
            <div style={{textAlign:"center",marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:7}}><Av a={revA} size={52}/></div>
              <div style={{fontSize:14,fontWeight:700,color:G}}>Rate Your Session</div>
              <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",marginTop:2}}>{revA.name}</div>
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:7,marginBottom:12}}>
              {[1,2,3,4,5].map(s=><span key={s} onClick={()=>setRating(s)} style={{fontSize:27,cursor:"pointer",opacity:s<=rating?1:.22}}>⭐</span>)}
            </div>

            <div style={{display:"flex",gap:9}}>
              <button style={{...bO,flex:1}} onClick={()=>setShowRev(false)}>Skip</button>
              <button style={{...bG,flex:2,padding:11}} onClick={()=>{setShowRev(false);toast$("Thanks for your review! 🙏");}}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {lifeMod&&(
        <div style={{position:"fixed",inset:0,background:BG,zIndex:300,display:"flex",flexDirection:"column"}}>
          <div style={{position:"sticky",top:0,zIndex:100,background:"rgba(10,0,21,.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid "+lifeMod.border,padding:"0 16px",display:"flex",alignItems:"center",height:60,flexShrink:0}}>
            <button onClick={()=>{setLifeMod(null);setLifeChat([]);setLifeInp("");}} style={{background:"none",border:"none",color:"#8a7a6a",fontSize:18,cursor:"pointer",marginRight:10,padding:0}}>&#8592;</button>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:lifeMod.color,fontFamily:"sans-serif"}}>{lifeMod.title}</div><div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif"}}>MiraXAstro Specialist</div></div>
            <div style={{fontSize:9,color:lifeMod.color,fontFamily:"sans-serif",background:lifeMod.bg,border:"1px solid "+lifeMod.border,borderRadius:6,padding:"3px 9px"}}>EXCLUSIVE</div>
          </div>
          {lifeChat.length===0&&(<div style={{padding:"14px 16px 0",overflowY:"auto"}}><div style={{background:"linear-gradient(135deg,"+lifeMod.bg+",rgba(10,0,21,.85))",border:"1px solid "+lifeMod.border,borderRadius:16,padding:"16px 14px",marginBottom:10}}><div style={{fontSize:10,color:lifeMod.color,fontFamily:"sans-serif",letterSpacing:1.5,marginBottom:8}}>SPECIALIST GUIDANCE</div><div style={{fontSize:12,color:"#e8d5b7",fontFamily:"sans-serif",lineHeight:1.75,marginBottom:12}}>{lifeMod.id==="property"?"The cosmos deeply influences property decisions. Let me reveal auspicious planetary windows.":lifeMod.id==="career"?"Saturn and Jupiter reveal ideal timing for interviews, promotions and career changes.":lifeMod.id==="immigration"?"The 9th house governs foreign lands. Let me reveal what the planets say about your move.":lifeMod.id==="investment"?"Jupiter and Venus transits reveal ideal windows for investment decisions.":lifeMod.id==="fertility"?"Moon and Jupiter reveal fertile windows and auspicious conception timing.":"Every life situation has a cosmic answer. Ask freely and I will guide you."}</div><div style={{display:"flex",flexWrap:"wrap",gap:7}}>{(lifeMod.id==="property"?["Best time to buy","Should I sell?","Auspicious move date","Is this right?"]:lifeMod.id==="career"?["Best interview days","Change jobs now?","Ask for promotion?","Start a business?"]:lifeMod.id==="immigration"?["Best time for visa","Right country?","When to move?","Will I succeed?"]:lifeMod.id==="investment"?["Best months to invest","Property vs shares?","Good time now?","When will I improve?"]:lifeMod.id==="fertility"?["Best conception months","IVF timing","Pregnancy timing","Will I have children?"]:["Relationship guidance","Career advice","Health timing","Travel dates"]).map(q=>(<div key={q} onClick={async()=>{setLifeChat([{f:"u",t:q}]);setLifeTyping(true);try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:400,system:"You are a specialist MiraXAstro Vedic astrologer for "+lifeMod.title+". Warm specific Vedic guidance 3-5 sentences. Never mention AI.",messages:[{role:"user",content:q}]})});const d=await r.json();setLifeChat(p=>[...p,{f:"a",t:d.content?.find(b=>b.type==="text")?.text||"Please ask again."}]);}catch(e){setLifeChat(p=>[...p,{f:"a",t:"Connection interrupted."}]);}setLifeTyping(false);}} style={{padding:"6px 12px",borderRadius:16,border:"1px solid "+lifeMod.border,background:lifeMod.bg,fontSize:11,fontFamily:"sans-serif",color:lifeMod.color,cursor:"pointer"}}>{q}</div>))}</div></div></div>)}
          <div style={{flex:1,overflowY:"auto",padding:"8px 16px",display:"flex",flexDirection:"column"}}>
            {lifeChat.map((m,i)=><div key={i} className={m.f==="a"?"chatA":"chatU"} style={m.f==="a"?{borderColor:lifeMod.border}:{}}>{m.t}</div>)}
            {lifeTyping&&<div className="chatA" style={{display:"flex",alignItems:"center",gap:6}}><div style={{display:"flex",gap:3}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:lifeMod.color,opacity:.6,animation:"pulse 1s ease "+(i*.2)+"s infinite"}}/>)}</div><span style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif"}}>consulting the stars...</span></div>}
            {lifeChat.length>=4&&<div style={{...cd,background:"linear-gradient(135deg,"+lifeMod.bg+",rgba(10,0,21,.9))",border:"1px solid "+lifeMod.border,marginTop:6,display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif"}}>Want a deeper reading?</div><button style={{...bG,fontSize:11,padding:"6px 12px",background:"linear-gradient(135deg,"+lifeMod.color+"99,"+lifeMod.color+")",color:"#0a0015"}} onClick={()=>{setLifeMod(null);setLifeChat([]);setTab("Astrologers");}}>Book Specialist</button></div>}
          </div>
          <div style={{padding:"9px 14px 20px",borderTop:"1px solid "+lifeMod.border,display:"flex",gap:8,background:"rgba(10,0,21,.97)",flexShrink:0}}>
            <input style={{...ip,flex:1,fontSize:13}} value={lifeInp} onChange={e=>setLifeInp(e.target.value)} placeholder={"Ask about "+lifeMod.title.toLowerCase()+"..."} onKeyDown={async e=>{if(e.key!=="Enter"||!lifeInp.trim())return;const q=lifeInp.trim();setLifeInp("");setLifeChat(p=>[...p,{f:"u",t:q}]);setLifeTyping(true);try{const hist=lifeChat.map(m=>({role:m.f==="u"?"user":"assistant",content:m.t}));const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:400,system:"You are a specialist MiraXAstro Vedic astrologer for "+lifeMod.title+". Warm, specific, 3-5 sentences. Never mention AI.",messages:[...hist,{role:"user",content:q}]})});const d=await r.json();setLifeChat(p=>[...p,{f:"a",t:d.content?.find(b=>b.type==="text")?.text||"Please ask again."}]);}catch(e){setLifeChat(p=>[...p,{f:"a",t:"Connection interrupted."}]);}setLifeTyping(false);}}/>
            <button disabled={!lifeInp.trim()||lifeTyping} style={{...bG,padding:"10px 14px",background:"linear-gradient(135deg,"+lifeMod.color+"99,"+lifeMod.color+")",color:"#0a0015"}} onClick={async()=>{const q=lifeInp.trim();if(!q)return;setLifeInp("");setLifeChat(p=>[...p,{f:"u",t:q}]);setLifeTyping(true);try{const hist=lifeChat.map(m=>({role:m.f==="u"?"user":"assistant",content:m.t}));const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:400,system:"You are a specialist MiraXAstro Vedic astrologer for "+lifeMod.title+". Warm, specific, 3-5 sentences. Never mention AI.",messages:[...hist,{role:"user",content:q}]})});const d=await r.json();setLifeChat(p=>[...p,{f:"a",t:d.content?.find(b=>b.type==="text")?.text||"Please ask again."}]);}catch(e){setLifeChat(p=>[...p,{f:"a",t:"Connection interrupted."}]);}setLifeTyping(false);}}>Send</button>
          </div>
        </div>
      )}

      {toast&&<div style={{position:"fixed",bottom:82,left:"50%",transform:"translateX(-50%)",background:toast.t==="err"?"rgba(255,71,87,.93)":"rgba(0,184,148,.93)",color:"white",padding:"10px 20px",borderRadius:12,fontFamily:"sans-serif",fontSize:13,fontWeight:600,zIndex:600,backdropFilter:"blur(10px)",whiteSpace:"nowrap",animation:"floatIn .3s ease"}}>{toast.m}</div>}
    </div>
  );
}

export default function App(){
  const [view,setView]=useState("auth");
  const [user,setUser]=useState(null);
  if(view==="auth") return <Auth onLogin={u=>{setUser(u);setView("app");}} onAstro={()=>setView("astro")}/>;
  if(view==="astro") return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"'Playfair Display',Georgia,serif",color:"#e8d5b7",display:"flex",alignItems:"center",justifyContent:"center",padding:20,position:"relative"}}>
      <style>{CSS}</style><Stars/>
      <div style={{position:"relative",zIndex:1,textAlign:"center",maxWidth:380,width:"100%"}}>
        <div style={{display:"inline-block",background:"rgba(255,71,87,.08)",border:"1px solid rgba(255,71,87,.2)",borderRadius:8,padding:"4px 14px",fontSize:11,color:"#ff8a80",fontFamily:"sans-serif",marginBottom:16}}>🔒 Astrologer Portal — Not visible to customers</div>
        <div style={{fontSize:36,marginBottom:10}}>🔮</div>
        <div style={{fontSize:18,fontWeight:700,color:G,marginBottom:6}}>Astrologer Portal</div>
        <div style={{fontSize:12,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.7,marginBottom:20}}>Open <strong style={{color:"#c8a060"}}>Artifact 2 — Astrologer Portal</strong> to access the full astrologer onboarding, dashboard and tools.<br/><br/>This is intentionally separate so customers never see it.</div>
        <button onClick={()=>setView("auth")} style={{...bO,width:"100%",padding:12}}>← Back to Customer App</button>
      </div>
    </div>
  );
  if(view==="app") return <App2 user={user} onLogout={()=>{setUser(null);setView("auth");}}/>;
  return null;
}
