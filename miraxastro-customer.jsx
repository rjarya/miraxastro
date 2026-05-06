import React, { useState, useRef, useEffect } from "react";

const G="#ffd700";
function Err({m}){return m?React.createElement("div",{style:{fontSize:11,color:"#ff4757",fontFamily:"sans-serif",marginTop:3}},"⚠ ",m):null;}
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
  US:["card","walletUS","intl","crypto"],
  GB:["card","openbank","intl","crypto"],
  EU:["card","sepa","intl","crypto"],
  AU:["card","poli","intl","crypto"],
  SG:["card","paynow","intl","crypto"],
  DEFAULT:["card","intl","crypto"],
};

const PMD={
  upi:{l:"UPI",i:"⚡",s:"GPay · PhonePe · Paytm · BHIM"},
  card:{l:"Credit / Debit Card",i:"💳",s:"Visa · Mastercard · Amex · RuPay"},
  netbanking:{l:"Net Banking",i:"🏦",s:"50+ Indian banks"},
  wallet:{l:"Wallets",i:"👛",s:"Paytm · Amazon Pay · PhonePe"},
  emi:{l:"EMI / BNPL",i:"📅",s:"No-cost EMI"},
  intl:{l:"PayPal / Stripe",i:"🌐",s:"PayPal · Apple Pay · Google Pay"},
  walletUS:{l:"Digital Wallets",i:"👛",s:"Apple Pay · Google Pay · Venmo"},
  openbank:{l:"Open Banking",i:"🏦",s:"UK instant bank transfer"},
  sepa:{l:"SEPA Transfer",i:"🏦",s:"EU bank transfer"},
  poli:{l:"POLi",i:"🏦",s:"Australian bank transfer"},
  paynow:{l:"PayNow",i:"⚡",s:"Singapore instant pay"},
  crypto:{l:"Crypto",i:"₿",s:"BTC · ETH · USDT"},
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
  {id:2,name:"Dr. Priya Nair",       gender:"female",spec:"Tarot & Numerology",exp:"10 yrs",rating:4.8,reviews:8750, ppm:0.22,langs:["English","Malayalam"],status:"online", wait:"2 min",sessions:5630, verified:true,bio:"PhD in Metaphysics. Combines Tarot with Vedic numerology for deep life path guidance.",badges:["Expert","Top Rated"]},
  {id:3,name:"Acharya Suresh Joshi", gender:"male",  spec:"Kundli & Marriage", exp:"20 yrs",rating:4.9,reviews:15200,ppm:0.42,langs:["Hindi","Gujarati"],   status:"busy",   wait:"15 min",sessions:11200,verified:true,bio:"Renowned for marriage compatibility and Manglik dosha remedies. 20+ years in practice.",badges:["Senior","Marriage Expert"]},
  {id:4,name:"Swami Anand Das",      gender:"male",  spec:"Palmistry & Vastu", exp:"25 yrs",rating:4.7,reviews:9800, ppm:0.48,langs:["Hindi","English"],    status:"online", wait:"0 min",sessions:7800, verified:true,bio:"Combines ancient palmistry with Vastu Shastra for holistic guidance.",badges:["Vastu Expert","Senior"]},
  {id:5,name:"Kavitha Menon",        gender:"female",spec:"Western Astrology", exp:"8 yrs", rating:4.6,reviews:5300, ppm:0.18,langs:["English","Tamil"],    status:"online", wait:"5 min",sessions:3200, verified:true,bio:"Natal charts and transit predictions for career and relationships.",badges:["Rising Star"]},
  {id:6,name:"Guru Bhatt Ji",        gender:"male",  spec:"Lal Kitab",         exp:"18 yrs",rating:4.8,reviews:11000,ppm:0.26,langs:["Hindi","Punjabi"],   status:"offline",wait:"—",    sessions:9100, verified:true,bio:"Master of Lal Kitab remedies. Simple effective solutions for complex planetary problems.",badges:["Lal Kitab Expert"]},
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

const LOGO_SRC="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5Ojf/2wBDAQoKCg0MDRoPDxo3JR8lNzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf/wAARCADIAMgDASIAAhEBAxEB/8QAGwABAAEFAQAAAAAAAAAAAAAAAAQBAgMFBgf/xABAEAABAwMCBAIGBgkCBwAAAAABAAIDBAUREiEGMUFRE2EUIjJxgZEHIzNCUrEVQ2JydYKhsvCS0SY0U1Vzs8H/xAAXAQEBAQEAAAAAAAAAAAAAAAAAAQID/8QAIhEBAQACAgEFAAMAAAAAAAAAAAECESExAxITMkFRQmGx/9oADAMBAAIRAxEAPwDxBERbQREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBEQb7DmgIpn6PkjAdVyR0wPISn1z/KMn5gLBK2BsobHK98fV2jB+AymxV3/ACcf1LB9Y767J1O2b6p3xgc+Wd1hXcV1Jww3gOkliqqg3A1EmW+E3Y6WattWOWjqeZ27cXEyN7nB8wj/AAlzSQffjkpLtbGNFnmpZYm6yA6P/qMOpvzHL4rAqgiIgIiICIiAiIgIiICIiAiIgIiICIr4YnzysiiaXSPcGtaOZJ5IL6SmkqpdEeAANT3uOGsaOZJ6BSX1cVJmO25DuTqpww937v4B/Xz6KlbMyKP0GlcDE05lkH6546/ujkPn1UNsb3DLWOI5ZAyp2qhJJJJJJ3JPVURFUZHTPNMynJ9Rj3PA8yAD/aFjREF8MskLtUTy08jjqPPusxEdSMxtEc34B7L/AHdj5fLso3miAivkfrOo+11PfzVBG9zHPDTpbjJ6DPJBaiIgIiICIiAiIgIiICIiAiIgKdRn0ajnq+UjvqIT2JHrH4N2/mUFTa/6umooO0PiEebyT+QapVQl6J9C1/FlvVwNZM5lu9DMs7eYaQ9gDseWo/DK87W/4T+wv/8ACZf741M5vEnbr/ps4RFqurb7b2D0G4O+tDOUc3Mn3OG488rzFe2/RleaXjLhWr4NvrtUsUOIXndzoh7JH7TDj4Y7FeRX+0VVhvFVbK5uJqd5aSOTh0cPIjB+Kz47/G9xcp9xr1LtVvqLrcIKKkaDLM7ALjgNHMuJ6AAEk9ACoi6KT/h+xGEerdLpEDIesFKdw3ydJsT+yB+IrdqO5+ky1Wy0/Rlw5FZgH08tQJfH0aXTl0ZOt3v6DoMBeSL176TXZ+ing/8Adi/9K854Y4fqOIK50Ub209LC3xKurk+zp4xzc7/4Oqz4uYuU5YrLaH3J000sgp6CmaH1VU8ZbG3oAPvPPJrep8slYbnWR1EgipIjBRxZEMROT+849XHqfgMABbLie801U2K1WWN0FlpHExMd7U7+Rmk7uP8AQbBaBdEERFEEREBERAREQEREBERAREQFJuEjZJ2Fjg4CGJu3cMAI+eVGWxvFY6ubRSmipKVrKZsLfRmaRJoJBe7u89T7k+xrlv8AhT7C/wD8Jl/vjWgW+4V+wv38Jl/vjWculnbX2a6VVlutNcqB+iop5A9h6HuD5EZB969d+kW20vHHB9JxdZWZqqeL66MbuMY9pp82HJ92fJeKHmvQPoi4ubYrs62V8jW26vcAXPPqxScg4+R5H4Hos+SX5TuNYWdVzHD1HT/XXW5Rh9BQ4JjJwKiU+xF8cEns0HyWuuFbPca2esq5DJPM8ve7uT+Q8lueMrnQ1VxfRWOPwbPTSvMDB99zj6zz78ADs1rQtPbaCpuddDRUMTpaiZ2ljB/mw81vHd5Zv49V4kjPE3DnCHC9scJK5lNFUTn7lPH4QGp56c84/wBwuT4vvVDRUI4W4Zfm2QvzVVI9qtlHNxP4R0HL+i7ug4ep4OEbtY+Hbmx950tbWzNO734z4WejSMtGOW+eq8UljfFK+KVjmPY4tc1wwWkcwVv2/bx1+tZVaiIssCIiAiIgIiICIiAiIgIiICIiApkf19ukj+/Tu8Ro7tOA75ENPzUNZaaZ1PO2VoBxzaeTgdiD5EZCVWJb7hXJgv2P+1S/3xrU1kDYnNfCS6CQZjcefmD5jkfn1W54Y4jprFTV0UloirX1sJglfLM5uIzzaABtyG/kFnLmcLO+XPHmivmLHSvdEwsjJ9VpdqIHbO2VYtMro43yyNjja573kNa1oySTyAXavqY+Bra+ko3tdxFVR4qJm7+hsP3Gn8Xft8lrKCRnDNI2te1rrxOzNMxwz6Kw/rHD8R+6Og3XOySPlkdJK9z3vJc5zjkknmSunwn9/wCK2vDN/quH7uyvgJeD6s0ZP2rDzB8+oPddh9IVnprxRM4psuHskYHVDWj2hy147jk73Z7rzhdDw1xZV2GCanbEypp5DkRSOIDXdSPeOYV8eWOrjn0bc8ilXGop6qpdNTUjaVrjkxMeXNB8s8h5KKudQREUBERAREQEREBERAREQEREBERBIpqgMa6KZpfA/dzQdwfxDsVbPTmNviRuEkJOA8D+hHQ+X5rCr4pXxOJjcRkYI6EdiOqmlWKTRSxU7/HewSSM3jjcMt1d3dwO3X3LG98b9yzQ79jl8li+KsqL55pKiZ8073SSPcXOc45JPdWIiAiIgIiICIiAiIgIiICIiAiIgKdZrRXXuvbQ2yHxqlzHvbHqAJDWlxxnrgclBXR8BzSU94qZoXujljttY9j2nBa4QuII9xUyuptZzXOEYODzU642iutkNFNXQmJlbB48GSMujJIBx0zjquqltNJebnT8RvaI7PPE6ruLY9hFIzHixDsXuLdP/kHZReOrlNd6Dh+vqcCSelmdpb7LB6RIGtHkAAB5BZ9W6unNtt9S+2SXJrG+ixzNhc/W3IeQSBpznkDvjCirbxW+ndwnU3Ih3pMdfFA06ttDo3uO3fLRusvCVuoLjVVwuhmFPT0E1RmE4dlgBGM7eW/da9X2mmjRS7nPR1FTrt9EaOHSB4RmMpz3LiB+S7Cz8P0lUy3wu4cr3wVTWB9dNWNhky7AL44zsWgnbOcgcxnaXLU5JNuEUqut9TQGH0lgDZ4mzROa4Oa9h6gjzyD2IIVLlS+g3Gqoy/WaeZ8WrGNWlxGf6LpeEo4bpQPobw0GgppmyU8jn6PrnfqQ7tJjftjK6Yz1cQc3V2+ppKelnqGBjaphkiBcNRZnGojmASDjPPCiqbeaurrbnUTV7dFRq0ujxgR6dgwDoGgYA8lteA7SbpxBG59NJU09FG6snhjYXOkbHuGADnqdpb/MpUau8WiustUymucBgmfEyZrSQctcMg7f4DkKCu64gob3deFJbne7dWwVturHF8k9O6MPhncXbEj7smdu0i5zhWhorjeYqa4yhkRY9zWmUReK8NJZHrOzNTgBk8sqbGoVwY8sc8NcWNIBcBsM8t10XFluZQQweLw/WWiqc841SmWCZmObXH7wPYkY7Kdw9V26HgS9tqrYahzaul1kVTma8iXTsBtjf358lNjjUW74MttJd+IqehuLpG0r45nSOj9pumJ7gR3wWjbqod2qLdPLH+i6GSkiYzSfEnMrpD+I7AA+Q2VEBF1tzg4f4er3WeutlRXzwANq6ptWYi2QgFwiaBjDc4y7OcdFpOI7W2zXqpoY5vGiYWuilLcF8b2h7CR0OlwyO6bGtREQEREBERAWwslyFrqZpjF4vi0s1PjVjHiMLM/DOVr1UAuOAMlLNiTHcKyK3zW+OokbRzSNkkhB9Vzm5wT7srPcbmK23WukERZ6DA+Iu1Z16pHPzjp7WPgoLontGS3AWWtoqihkZHVR6HSRtlaMg5a4ZB28lOFSWXMM4fntXhZMtXHUeLq5aWObjH82c+SWa5i2+nZiMnpVHJTe1jTrxv54xyWOG1VkwiMcX2zC+PJA1AHHz3G3ZWst873xsbpLpA0gauWogDP+oJqG0RdVLxJaqi6wXqrtU8tyjMTnM9JAp3OYAA7Tp1AYaPVzj4bLRC11J0nDAx03gh5dsHZxv8lZSUFRWCU07WuEW7jqxgf4ClkpLpS51Xp9yq6zQWekTvl0k5xqcTjPxWWuuHpFLTUkEZhpaduQzVkvkPtPJ7nl5AAK2O21D2tcAzBc1vtctTdQJ+Cq211TiGhrNRk8MDV1zjPuyrLqaRW514uPgSyxkVbWaJpdX22NmuI/FjYnrjKz0l5dRWGqt1LG6OarnY+aoa/BMbAcMA6esdROeg7KE6jnZVtpXtDZXOa3BIwCcYyfisslrqovEEjGtLACRq7jP5K27u6Jdiv0ttq5HVQlq6WeCSnqIHSka2PaRzOcEHDge7QodqqaSlq9dfQtradzHMfEZCxwyPaa4cnDmMgjuCr3WmqaXAhmGvYzOrmXEgfkVZU22qpo5ZJWN0RSGN5DgcO2/wB/zUGyuV5ov0GbNaKaqjpn1LamR9XOJHamtc0Boa0Bow45PM7dljsd2o6S3XC3XKkmnpax0UmaeYRvY+PVp3LSCDrIIx2UFlsqXxeIGt0amtJLhsXacZ/1BDbKkOkaWgGMOJ3/AAkg/kVBm4dugs12ZXGHxg2OVmjVpzrjczOfLVn4LWqXJbqiJrnShjcR+IAXZLm5A2x5lWUVFUV0kkdLHrdHG6VwyBhrRknfyVG/qL9ZrpMyuvdpqp7i1rRM6nqxHFVFoADngtJaSAM6SM89iVpLxcqi73OouFXoEs7tRawYa0YwGgdAAAB5BRmxPcMhuQrSCDgjdBRERAREQEREBERAREQXB7hjDnbear4kmGjW7Ddm+sduuysRBcXvJJL3HfO56qgcRyJGeeCqIgvbLI3GmR4wcjDjse6p4j8Y1uxnVjUefdWogrqdtuduW6qJHhpaHuw7GRnmrUQXumlcXF0jyXYyS4745K0ucRguOD5qiILg94OQ9wPkVXxJASdbsuBBOo755qxEFdTs+0fmqIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiKj//Z";
function MXLogo({size=110}){return(<img src={LOGO_SRC} alt="MiraXAstro" style={{width:size,height:size,objectFit:"contain",display:"block",margin:"0 auto"}}/>);}
function MXWordmark({size=22}){return(<div style={{fontFamily:"Georgia,serif",fontSize:size,fontWeight:300,letterSpacing:size*0.18,lineHeight:1,textAlign:"center"}}><span style={{color:"#e8d5b7"}}>Mira</span><span style={{background:"linear-gradient(135deg,#7b6fc4,#b8aae8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontWeight:400}}>X</span><span style={{color:"#e8d5b7"}}>Astro</span></div>);}
function MXTagline(){var lL={height:"0.5px",width:18,background:"linear-gradient(90deg,transparent,rgba(232,213,183,.45))"};var lR={height:"0.5px",width:18,background:"linear-gradient(90deg,rgba(232,213,183,.45),transparent)"};var dot={fontSize:7,color:"rgba(232,213,183,.5)",fontFamily:"sans-serif"};var txt={fontSize:7.5,color:"rgba(232,213,183,.45)",fontFamily:"sans-serif",letterSpacing:1.8};return(<div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:4}}><div style={lL}/><span style={dot}>+</span><span style={txt}>ANCIENT WISDOM. MODERN INSIGHT.</span><span style={dot}>+</span><div style={lR}/></div>);}

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
  const C=CURR[cur]||CURR.DEFAULT;
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
  const [rf,setRf]=useState({n:"",e:"",p:"",p2:"",ok:false});
  const [re,setRe]=useState({});
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
    if(u.status==="blocked"){setLe({p:"blocked"});setLoading(false);return;}
    setLoading(false);onLogin(u);
  }
  async function reg(){
    const err={};
    if(!rf.n.trim())err.n="Name required";
    if(!rf.e.includes("@"))err.e="Valid email required";
    if(DB[rf.e.toLowerCase()])err.e="Email already registered";
    if(rf.p.length<8)err.p="Min 8 characters";
    if(rf.p!==rf.p2)err.p2="Passwords don't match";
    if(!rf.ok)err.ok="Accept terms to continue";
    if(Object.keys(err).length){setRe(err);return;}
    setLoading(true);await new Promise(r=>setTimeout(r,900));
    DB[rf.e.toLowerCase()]={name:rf.n,email:rf.e,pw:btoa(rf.p+"h"),coins:50,txns:[]};
    setLoading(false);onLogin(DB[rf.e.toLowerCase()]);
  }
  async function social(p){
    setLoading(true);await new Promise(r=>setTimeout(r,700));
    const em="demo@"+p+".com";
    if(!DB[em])DB[em]={name:p.charAt(0).toUpperCase()+p.slice(1)+" User",email:em,pw:"",coins:50,txns:[],status:"active"};
    setLoading(false);onLogin(DB[em]);
  }

  const iE=err=>({...ip,border:"1px solid "+(err?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")});
  const Err=({m})=>m?<div style={{fontSize:11,color:"#ff4757",fontFamily:"sans-serif",marginTop:3}}>⚠ {m}</div>:null;

  return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"Georgia,serif",color:"#e8d5b7",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,position:"relative"}}>
      <style>{CSS}</style>
      <Stars/>
      <div style={{textAlign:"center",marginBottom:16,position:"relative",zIndex:1}}>
        <div style={{fontSize:36,animation:"pulse 3s ease infinite"}}>🔮</div>
        <div style={{fontSize:20,fontWeight:700,background:"linear-gradient(90deg,"+G+",#ff8c00,"+G+")",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:2}}>MIRAXASTRO</div>
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
  const [birthDetails,setBirthDetails]=useState({name:"",gender:"",dobDay:"",dobMonth:"",dobYear:"",timeHr:"",timeMin:"",timeAmPm:"AM",place:"",country:"",lang:""});
  const [birthSubmitted,setBirthSubmitted]=useState(false);
  const [chartMsgIdx,setChartMsgIdx]=useState(-1);

  const [msgs,setMsgs]=useState([]);
  const [chatInp,setChatInp]=useState("");
  const [attachment,setAttachment]=useState(null); // {type,url,name,base64}
  const [attachLoading,setAttachLoading]=useState(false);
  const fileInputRef=React.useRef();
  const msgsEndRef=React.useRef();
  const [aiTyping,setAiTyping]=useState(false);
  React.useEffect(()=>{
    if(msgsEndRef.current) msgsEndRef.current.scrollIntoView({behavior:"smooth"});
  },[msgs,aiTyping]);
  const [sessOn,setSessOn]=useState(false);
  const [elapsed,setElapsed]=useState(0);
  const [showRev,setShowRev]=useState(false);
  const [revA,setRevA]=useState(null);
  const [rating,setRating]=useState(5);
  const [filter,setFilter]=useState("All");
  const [profA,setProfA]=useState(null);
  const [jathagam,setJathagam]=useState(null);
  const [jChat,setJChat]=useState([]);
  const [jTyping,setJTyping]=useState(false);
  const [jInp,setJInp]=useState("");
  const jMsgsEnd=React.useRef();
  React.useEffect(()=>{if(jMsgsEnd.current)jMsgsEnd.current.scrollIntoView({behavior:"smooth"});},[jChat,jTyping]);
  const [lifeMod,setLifeMod]=useState(null);

  const [lifeChat,setLifeChat]=useState([]);
  const [lifeTyping,setLifeTyping]=useState(false);
  const [lifeInp,setLifeInp]=useState("");
  const [toast,setToast]=useState(null);

  // Back navigation — browser back button, Android back, Escape key
  useEffect(()=>{
    function handleBack(e){
      // Keyboard Escape
      if(e.type==="keydown"&&e.key!=="Escape") return;
      // Close overlays in priority order
      if(jathagam){setJathagam(null);setJChat([]);setJInp("");return;}
      if(lifeMod){setLifeMod(null);setLifeChat([]);setLifeInp("");return;}
      if(chatOpen){setChatOpen(false);return;}
      if(profA){setProfA(null);return;}
      if(showPay){setShowPay(false);return;}
      if(showRev){setShowRev(false);return;}
    }
    function handlePopState(){
      if(jathagam){setJathagam(null);setJChat([]);setJInp("");history.pushState(null,"",window.location.href);return;}
      if(lifeMod){setLifeMod(null);setLifeChat([]);setLifeInp("");history.pushState(null,"",window.location.href);return;}
      if(chatOpen){setChatOpen(false);history.pushState(null,"",window.location.href);return;}
      if(profA){setProfA(null);history.pushState(null,"",window.location.href);return;}
    }
    // Push a state so back button has something to pop
    history.pushState(null,"",window.location.href);
    window.addEventListener("popstate",handlePopState);
    document.addEventListener("keydown",handleBack);
    return()=>{
      window.removeEventListener("popstate",handlePopState);
      document.removeEventListener("keydown",handleBack);
    };
  },[jathagam,lifeMod,chatOpen,profA,showPay,showRev]);
  const tmr=useRef();

  const C=CURR[cur]||CURR.DEFAULT;
  function toast$(m,t="ok"){setToast({m,t});setTimeout(()=>setToast(null),3000);}
  function la(usd){return C.fmt(usd*C.r);}
  function pps(a){return C.s+(a.ppm*C.r).toFixed(C.r>10?0:2);}
  function cn(a){return Math.ceil(a.ppm*C.r);}

  useEffect(()=>{
    if(sessOn&&chatA){
      tmr.current=setInterval(()=>{
        setElapsed(e=>{
          const newE=e+1;
          // Deduct coins every 60 seconds in real time
          if(newE>0&&newE%60===0){
            const cost=cn(chatA);
            setCoins(c=>{
              const newCoins=c-cost;
              if(newCoins<=0){
                // Out of coins — end session
                setSessOn(false);
                clearInterval(tmr.current);
                setCoins(0);
                setTxns(p=>[{type:"debit",title:"Session with "+chatA.name,coins:c,date:new Date()},...p]);
                setMsgs(p=>[...p,{f:"a",t:"⚠️ Your coins have run out. Please recharge to continue your reading with me. Tap + Recharge in the top bar. 🙏"}]);
              }
              return Math.max(0,newCoins);
            });
          }
          return newE;
        });
      },1000);
    }
    else clearInterval(tmr.current);
    return()=>clearInterval(tmr.current);
  },[sessOn,chatA]);

  const used=sessOn&&chatA?Math.floor(elapsed/60)*cn(chatA):0;
  const left=Math.max(0,coins-used);
  const low=sessOn&&chatA&&left<=cn(chatA)*3;
  const prevLeft=React.useRef(coins);
  React.useEffect(()=>{
    if(!sessOn||!chatA)return;
    // Warn at 3 mins remaining
    if(left<=cn(chatA)*3&&left>cn(chatA)*2&&prevLeft.current>cn(chatA)*3){
      setMsgs(p=>[...p,{f:"a",t:"⚠️ You have about 3 minutes of coins remaining (🪙"+left+"). Top up now to continue uninterrupted — tap + in the top bar."}]);
    }
    // Warn at 1 min remaining
    if(left<=cn(chatA)&&left>0&&prevLeft.current>cn(chatA)){
      setMsgs(p=>[...p,{f:"a",t:"🚨 Almost out! Only 1 minute left (🪙"+left+"). Please recharge now to continue your reading."}]);
    }
    prevLeft.current=left;
  },[left]);

  function startSess(a){
    const need=cn(a);
    if(coins<need){toast$("Need 🪙"+need+" — please recharge","err");setPayPlan(PLANS[1]);setPayM(null);setPayS("idle");setShowPay(true);return;}
    setChatA(a);setChatOpen(true);setSessOn(true);setElapsed(0);
    setBirthDetails({name:"",gender:"",dobDay:"",dobMonth:"",dobYear:"",timeHr:"",timeMin:"",timeAmPm:"AM",place:"",country:"",lang:""});setBirthSubmitted(false);
    setMsgs([{f:"a",t:"Namaste 🙏 I am "+a.name+". Your session has started. I am here to guide you on your cosmic journey — "+pps(a)+"/min. Ask me anything about your life, career, marriage or destiny. 🌟"}]);
  }
  function endSess(outOfCoins=false){
    setSessOn(false);clearInterval(tmr.current);
    if(!outOfCoins){
      const u=Math.floor(elapsed/60)*cn(chatA);
      setCoins(c=>Math.max(0,c-u));
      setTxns(p=>[{type:"debit",title:"Session with "+chatA.name,coins:u,date:new Date()},...p]);
      setRevA(chatA);setShowRev(true);
    }
  }
  async function sendMsg(){
    const q=chatInp.trim();
    if(!q)return;
    setChatInp("");
    const attachPreview=attachment?{img:attachment.url,name:attachment.name}:null;
    setMsgs(p=>[...p,{f:"u",t:q,attach:attachPreview}]);
    setAttachment(null);
    setAiTyping(true);
    try{
      const dobStr=birthDetails.dobDay&&birthDetails.dobMonth&&birthDetails.dobYear?birthDetails.dobDay+"/"+birthDetails.dobMonth+"/"+birthDetails.dobYear:"";
      const timeStr=birthDetails.timeHr&&birthDetails.timeMin?birthDetails.timeHr+":"+String(birthDetails.timeMin).padStart(2,"0")+" "+(birthDetails.timeAmPm||"AM"):"";
      const hasBirth=dobStr||birthDetails.place||birthDetails.name;
      const birthInfo=hasBirth?"Customer birth details — Name: "+(birthDetails.name||"not given")+", Gender: "+(birthDetails.gender||"not given")+", DOB: "+(dobStr||"not given")+", Birth Time: "+(timeStr||"not given")+", Birth Place: "+(birthDetails.place||"not given")+", Country: "+(birthDetails.country||"not given")+". Use these for a personalised reading.":"";
      const langInfo=birthDetails.lang?" VERY IMPORTANT: The customer has requested to communicate in "+birthDetails.lang+". You MUST respond entirely in "+birthDetails.lang+" language for all your replies.":"";
      const systemPrompt="You are "+chatA.name+", a Vedic "+chatA.spec+" expert. Respond in 2-3 short warm sentences. Be direct and specific. "+birthInfo+langInfo+(birthDetails.lang&&birthDetails.lang!=="English"?" Reply in "+birthDetails.lang+" only.":"")+" Never reveal AI. Never mention technology.";
      // Build message content - include attachment if present
      let msgContent;
      if(attachment&&attachment.base64){
        msgContent=[
          {type:"image",source:{type:"base64",media_type:attachment.mimeType||"image/jpeg",data:attachment.base64}},
          {type:"text",text:q||(attachment.type==="image"?"Please analyse this image and provide astrological guidance if relevant.":"Please review this document and provide astrological guidance if relevant.")}
        ];
      } else {
        msgContent=q;
      }
      // Keep only last 6 messages for speed (less tokens = faster response)
      const recentMsgs=msgs.slice(-6).map(m=>({role:m.f==="u"?"user":"assistant",content:m.t}));
      const allMsgs=[...recentMsgs,{role:"user",content:msgContent}];
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:180,system:systemPrompt,messages:allMsgs})});
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

  const SPECS=["All","Vedic Astrology","Tarot & Numerology","Kundli & Marriage","Jathagam","Palmistry & Vastu","Western Astrology","Lal Kitab"];
  const fA=filter==="All"?ASTROS:ASTROS.filter(a=>a.spec===filter);
  const TABS=["Home","Astrologers","Shop","Sessions","Live"];
  const TI={Home:"🏠",Astrologers:"🔮",Shop:"💰",Sessions:"📋",Live:"📡"};
  const pmList=PMETHODS[cur]||PMETHODS.DEFAULT;

  if(profA) return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"Georgia,serif",color:"#e8d5b7",position:"relative"}}>
      <style>{CSS}</style><Stars/>
      <div style={{position:"relative",zIndex:1}}>
        <div style={{background:"linear-gradient(180deg,rgba(108,92,231,.4),rgba(10,0,21,.95))",padding:"50px 16px 16px",position:"relative"}}>
          <button onClick={()=>setProfA(null)} style={{position:"absolute",top:14,left:14,background:"rgba(0,0,0,.4)",border:"1px solid rgba(255,255,255,.12)",borderRadius:8,padding:"6px 12px",color:"#e8d5b7",fontFamily:"sans-serif",fontSize:12,cursor:"pointer"}}>← Back</button>
        </div>
        <div style={{padding:"0 16px",marginTop:-26,position:"relative",maxWidth:460,margin:"0 auto",paddingBottom:80}}>
          <div style={{display:"flex",gap:12,alignItems:"flex-end",marginBottom:12}}>
            <div style={{border:"3px solid rgba(255,215,0,.3)",borderRadius:"50%",flexShrink:0}}><Av a={profA} size={66}/></div>
            <div style={{flex:1,paddingBottom:3}}>
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}><div style={{fontSize:15,fontWeight:700}}>{profA.name}</div>{profA.verified&&<span style={{fontSize:12}}>✅</span>}</div>
              <div style={{fontSize:12,color:"#c8a060",fontFamily:"sans-serif"}}>{profA.spec} · {profA.exp}</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:12}}>
            {[["⭐",profA.rating,"Rating"],["👥",profA.sessions.toLocaleString(),"Sessions"],[C.s+(profA.ppm*C.r).toFixed(C.r>10?0:2),"/min","Rate"],["🌐",profA.langs[0],"Lang"]].map(([ic,v,l])=>(
              <div key={l} style={{...cd,textAlign:"center",padding:"9px 4px",marginBottom:0}}><div style={{fontSize:12}}>{ic}</div><div style={{fontSize:11,fontWeight:700,color:G,fontFamily:"sans-serif"}}>{v}</div><div style={{fontSize:9,color:"#8a7a6a",fontFamily:"sans-serif"}}>{l}</div></div>
            ))}
          </div>
          <div style={{...cd,marginBottom:11}}><div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",marginBottom:5,letterSpacing:1}}>ABOUT</div><div style={{fontSize:13,color:"#c8b090",fontFamily:"sans-serif",lineHeight:1.7}}>{profA.bio}</div></div>
          <div style={cd}>
            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:10}}>
              <div style={{textAlign:"center"}}><div style={{fontSize:28,fontWeight:700,color:G}}>{profA.rating}</div><div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif"}}>/5</div></div>
              <div style={{flex:1}}>{[["5","72%"],["4","18%"],["3","7%"],["2","2%"],["1","1%"]].map(([s,p])=><div key={s} style={{display:"flex",gap:5,marginBottom:3,alignItems:"center"}}><div style={{fontSize:9,color:"#8a7a6a",fontFamily:"sans-serif",width:7}}>{s}</div><div style={{flex:1,height:5,borderRadius:3,background:"rgba(255,255,255,.07)"}}><div style={{width:p,height:"100%",borderRadius:3,background:G}}/></div></div>)}</div>
            </div>
            {[{u:"Priya R.",r:5,t:"Extremely accurate predictions!",d:"2 days ago"},{u:"James M.",r:4,t:"Very knowledgeable. Remedies worked wonders.",d:"1 week ago"}].map((rv,i)=>(
              <div key={i} style={{...cd,marginBottom:7}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><div style={{fontFamily:"sans-serif"}}><div style={{fontSize:12,fontWeight:600,color:"#e8d5b7"}}>{rv.u}</div><div style={{fontSize:10,color:"#636e72"}}>{rv.d}</div></div><div style={{fontSize:10,color:G}}>{"⭐".repeat(rv.r)}</div></div>
                <div style={{fontSize:12,color:"#c8b090",fontFamily:"sans-serif",lineHeight:1.6}}>{rv.t}</div>
              </div>
            ))}
          </div>
          <div style={{position:"sticky",bottom:0,padding:"10px 0",background:"linear-gradient(0deg,#0a0015 60%,transparent)"}}>
            <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",textAlign:"center",marginBottom:7}}>Balance: 🪙{coins} · Need 🪙{cn(profA)} to start</div>
            <div style={{display:"flex",gap:8}}>
              <button style={{...bG,flex:1,padding:12}} onClick={()=>{setProfA(null);startSess(profA);}}>💬 Chat Now</button>
              <button style={{...bO,flex:1,padding:12}} disabled={profA.status==="offline"}>📞 Call</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"Georgia,serif",color:"#e8d5b7",position:"relative",overflowX:"hidden"}}>
      <style>{CSS}</style><Stars/>

      {chatOpen&&chatA&&(
        <div style={{position:"fixed",top:0,left:0,right:0,zIndex:502,background:sessOn&&low?"linear-gradient(135deg,rgba(255,71,87,.93),rgba(200,0,30,.93))":"linear-gradient(135deg,rgba(10,0,21,.97),rgba(20,0,40,.97))",borderBottom:"1px solid "+(sessOn&&low?"rgba(255,71,87,.5)":"rgba(255,215,0,.2)"),padding:"8px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",backdropFilter:"blur(10px)"}}>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:sessOn?"#00b894":"#636e72",animation:sessOn?"pulse 1s ease infinite":"none"}}/>
            <div>
              <div style={{fontSize:12,color:"#e8d5b7",fontFamily:"sans-serif",fontWeight:600}}>{chatA.name}</div>
              <div style={{fontSize:10,color:sessOn&&low?"#ffcccc":"#8a7a6a",fontFamily:"sans-serif"}}>
                {sessOn?fmtT(elapsed)+" · "+pps(chatA)+"/min":"Online · "+pps(chatA)+"/min"}
              </div>
            </div>
          </div>
          {/* Live timer + coins */}
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
            {sessOn&&(
              <div style={{fontSize:10,color:sessOn&&low?"#ff4757":"#8a7a6a",fontFamily:"monospace",fontWeight:700}}>{fmtT(elapsed)}</div>
            )}
            <div style={{display:"flex",alignItems:"center",gap:4,background:"rgba(255,215,0,.08)",border:"1px solid rgba(255,215,0,.2)",borderRadius:10,padding:"3px 9px"}}>
              <span style={{fontSize:12}}>🪙</span>
              <span style={{fontSize:13,fontWeight:700,color:sessOn&&low?"#ff4757":G,fontFamily:"sans-serif"}}>{coins}</span>
              {sessOn&&low&&<span style={{fontSize:9,color:"#ff4757",fontFamily:"sans-serif"}}>LOW!</span>}
            </div>
          </div>
          {sessOn
            ?<button onClick={endSess} style={{background:"rgba(255,71,87,.18)",color:"#ff4757",border:"1px solid rgba(255,71,87,.3)",borderRadius:8,padding:"5px 11px",fontFamily:"sans-serif",fontSize:11,cursor:"pointer",flexShrink:0}}>End</button>
            :<button onClick={()=>startSess(chatA)} style={{...bG,fontSize:11,padding:"5px 11px",flexShrink:0}}>Start</button>
          }
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
            
            {/* Filter tabs - same as Astrologers tab */}
            <div style={{overflowX:"auto",display:"flex",gap:6,marginBottom:12,paddingBottom:3}}>
              {SPECS.map(s=>(
                <button key={s} onClick={()=>{setFilter(s);setTab("Astrologers");}} style={{whiteSpace:"nowrap",padding:"6px 13px",borderRadius:16,border:"1px solid",borderColor:s==="All"?"rgba(255,215,0,.4)":"rgba(200,150,50,.2)",background:s==="All"?"rgba(255,215,0,.08)":"transparent",color:s==="All"?G:"#8a7a6a",fontFamily:"sans-serif",fontSize:11,cursor:"pointer",flexShrink:0}}>
                  {s}
                </button>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
              {[["🗣️","Chat"],["📞","Call"],["📹","Video"],["🌟","Jathagam"]].map(([icon,lbl])=>(
                <div key={lbl} onClick={()=>setTab("Astrologers")} style={{...cd,textAlign:"center",padding:"11px 5px",cursor:"pointer",marginBottom:0}} className="ac">
                  <div style={{fontSize:20,marginBottom:4}}>{icon}</div>
                  <div style={{fontSize:10,fontFamily:"sans-serif",color:"#c8a060"}}>{lbl}</div>
                </div>
              ))}
            </div>
            {/* Jathagam Quick Access Banner */}
            <div onClick={()=>setJathagam({step:1,data:{},astro:null})} className="ac" style={{background:"linear-gradient(135deg,rgba(108,92,231,.15),rgba(162,155,254,.08))",border:"1px solid rgba(162,155,254,.35)",borderRadius:14,padding:"12px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
              <div style={{fontSize:28}}>&#128302;</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:"#a29bfe",fontFamily:"sans-serif"}}>Get Your Jathagam</div>
                <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",marginTop:2}}>Instant Kundli · Birth chart · Personalised reading</div>
              </div>
              <div style={{background:"rgba(0,184,148,.15)",border:"1px solid rgba(0,184,148,.3)",borderRadius:8,padding:"4px 10px",fontSize:10,color:"#00b894",fontFamily:"sans-serif",fontWeight:700}}>FREE</div>
            </div>
            <div style={{fontSize:15,fontWeight:700,color:G,marginBottom:10}}>&#127775; Astrologers</div>
            {ASTROS.map(a=>(
              <div key={a.id} style={{...cd,cursor:"pointer"}} className="ac">
                <div style={{display:"flex",alignItems:"center",gap:11}}>
                  <AvDot a={a} size={50}/>
                  <div style={{flex:1}} onClick={()=>setProfA(a)}>
                    <div style={{fontSize:13,fontWeight:700}}>{a.name} {a.verified&&"✅"}</div>
                    <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif"}}>{a.spec} · {a.exp}</div>
                    <div style={{fontSize:11,fontFamily:"sans-serif",marginTop:2,display:"flex",gap:8}}>
                      <span style={{color:G}}>⭐ {a.rating}</span>
                      <span style={{color:G}}>{pps(a)}/min</span>
                      <span style={{color:a.status==="online"?"#00b894":"#636e72",fontSize:10}}>&#9679; {a.status}</span>
                    </div>
                  </div>
                  {a.status==="online"
                    ?<button style={{...bG,fontSize:11,padding:"7px 12px"}} onClick={()=>startSess(a)}>Chat</button>
                    :<button style={{...bO,fontSize:11,padding:"7px 12px",opacity:.5}} disabled>Offline</button>
                  }
                </div>
              </div>
            ))}

            {/* Life Modules */}
            <div style={{marginTop:20,paddingBottom:4}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:"#e8d5b7"}}>&#10024; Life Modules</div>
                  <div style={{fontSize:10,color:"#a29bfe",fontFamily:"sans-serif",letterSpacing:1.5,marginTop:2}}>EXCLUSIVE TO MIRAXASTRO</div>
                </div>
                <div style={{fontSize:9,color:"#a29bfe",fontFamily:"sans-serif",background:"rgba(162,155,254,.1)",border:"1px solid rgba(162,155,254,.25)",borderRadius:6,padding:"3px 9px"}}>NEW</div>
              </div>
              <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.6,marginBottom:10}}>Ancient Vedic wisdom for today's biggest life decisions.</div>
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
            <div style={{fontSize:15,fontWeight:700,color:G,marginBottom:10}}>🔮 Astrologers</div>
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
        <div style={{position:"fixed",inset:0,background:"#0a0015",zIndex:500,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{background:"rgba(10,0,21,.96)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(200,150,50,.18)",padding:"0 14px",display:"flex",alignItems:"center",justifyContent:"space-between",height:60,marginTop:sessOn?46:0}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <button onClick={()=>{setChatOpen(false);if(sessOn)endSess();}} style={{background:"none",border:"none",color:"#8a7a6a",fontSize:17,cursor:"pointer"}}>←</button>
              <Av a={chatA} size={32}/>
              <div><div style={{fontSize:13,fontWeight:700}}>{chatA.name}</div><div style={{display:"flex",alignItems:"center",gap:5}}><div style={{fontSize:10,color:"#00b894",fontFamily:"sans-serif"}}>● {sessOn?"Session Active":"Online"}</div><div style={{fontSize:9,color:"#a29bfe",fontFamily:"sans-serif",background:"rgba(108,92,231,.15)",border:"1px solid rgba(108,92,231,.3)",borderRadius:5,padding:"1px 5px"}}>AI</div></div></div>
            </div>
            <div style={{display:"flex",gap:7,alignItems:"center"}}>
              <div style={{fontSize:12,fontFamily:"sans-serif",color:G}}>🪙{coins}</div>
              
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"10px 12px",display:"flex",flexDirection:"column",minHeight:0,overscrollBehavior:"contain"}}>
            {msgs.map((m,i)=>{
              // Render chart message
              if(m.f==="chart") return(
                <div key={i} style={{width:"100%",marginBottom:10}}>
                  <JathagamChart
                    data={{
                      name:birthDetails.name,
                      dob:birthDetails.dobDay&&birthDetails.dobMonth&&birthDetails.dobYear?birthDetails.dobDay+"/"+birthDetails.dobMonth+"/"+birthDetails.dobYear:birthDetails.dob,
                      time:birthDetails.timeHr&&birthDetails.timeMin?birthDetails.timeHr+":"+String(birthDetails.timeMin||0).padStart(2,"0")+" "+(birthDetails.timeAmPm||"AM"):birthDetails.time,
                      place:birthDetails.place,
                      country:birthDetails.country,
                      gender:birthDetails.gender
                    }}
                    lang={birthDetails.lang||"English"}
                  />
                </div>
              );
              if(m.f!=="a") return(
                <React.Fragment key={i}>
                <div className="cU" style={{maxWidth:"85%",alignSelf:"flex-end"}}>
                  {m.attach&&(
                    <div style={{marginBottom:4,borderRadius:8,overflow:"hidden",border:"1px solid rgba(255,215,0,.2)"}}>
                      {m.attach.img
                        ?<img src={m.attach.img} alt={m.attach.name} style={{width:"100%",maxWidth:200,maxHeight:150,objectFit:"cover",display:"block"}}/>
                        :<div style={{background:"rgba(255,255,255,.06)",padding:"8px 10px",fontSize:11,fontFamily:"sans-serif",color:"#c8a060"}}>&#128196; {m.attach.name}</div>
                      }
                    </div>
                  )}
                  {m.t&&<div>{m.t}</div>}
                </div>
                </React.Fragment>
              );
              // Parse astrologer message
              const lines=m.t.split("\n");
              return(
                <React.Fragment key={i}>
                <div className="cA" style={{whiteSpace:"pre-wrap"}}>
                  {lines.map((line,li)=>{
                    if(!line.trim()) return <div key={li} style={{height:4}}/>;
                    // Bold: **text**
                    const parts=line.split(/\*\*([^*]+)\*\*/g);
                    return(
                      <div key={li} style={{marginBottom:2}}>
                        {parts.map((p,pi)=>pi%2===1
                          ?<strong key={pi} style={{color:"#ffd700"}}>{p}</strong>
                          :<span key={pi}>{p}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                </React.Fragment>
              );
            })}

            {/* Birth details card — appears after 2 messages */}
            {msgs.length>=1&&!birthSubmitted&&(
              <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(162,155,254,.2)",borderRadius:12,padding:"10px 12px",margin:"6px 0",animation:"floatIn .4s ease",maxWidth:320,width:"100%",overflow:"visible"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#a29bfe",fontFamily:"sans-serif",marginBottom:2}}>&#128302; Enter Birth Details</div>
                <div style={{fontSize:9,color:"#636e72",fontFamily:"sans-serif",marginBottom:8}}>All optional — share what you know</div>

                {/* Row 1: Name + Gender */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:6}}>
                  <div>
                    <div style={{fontSize:8,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1,marginBottom:3}}>NAME</div>
                    <input value={birthDetails.name} onChange={e=>setBirthDetails(p=>({...p,name:e.target.value}))} placeholder="Full name" style={{width:"100%",background:"rgba(255,255,255,.05)",border:"1px solid rgba(162,155,254,.18)",borderRadius:7,padding:"5px 7px",color:"#e8d5b7",fontFamily:"sans-serif",fontSize:11,outline:"none",boxSizing:"border-box"}}/>
                  </div>
                  <div>
                    <div style={{fontSize:8,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1,marginBottom:3}}>GENDER</div>
                    <div style={{display:"flex",gap:4}}>
                      {["M","F","O"].map((g,gi)=>{const full=["Male","Female","Other"][gi];return(
                        <div key={g} onClick={()=>setBirthDetails(p=>({...p,gender:full}))} style={{flex:1,textAlign:"center",padding:"6px 2px",borderRadius:6,border:"1px solid",borderColor:birthDetails.gender===full?"rgba(162,155,254,.6)":"rgba(162,155,254,.18)",background:birthDetails.gender===full?"rgba(162,155,254,.15)":"transparent",color:birthDetails.gender===full?"#a29bfe":"#636e72",fontFamily:"sans-serif",fontSize:10,cursor:"pointer"}}>
                          {["♂","♀","○"][gi]}
                        </div>
                      );})}
                    </div>
                  </div>
                </div>

                {/* Row 2: DOB */}
                <div style={{marginBottom:6}}>
                  <div style={{fontSize:8,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1,marginBottom:3}}>DATE OF BIRTH</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1.4fr",gap:4}}>
                    {[
                      {k:"dobDay",ph:"Day",opts:Array.from({length:31},(_,i)=>({v:i+1,l:String(i+1).padStart(2,"0")}))},
                      {k:"dobMonth",ph:"Mon",opts:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m,i)=>({v:i+1,l:m}))},
                      {k:"dobYear",ph:"Year",opts:Array.from({length:100},(_,i)=>({v:2025-i,l:2025-i}))},
                    ].map(f=>(
                      <select key={f.k} value={birthDetails[f.k]} onChange={e=>setBirthDetails(p=>({...p,[f.k]:e.target.value}))} style={{background:"#0d0a1a",border:"1px solid rgba(162,155,254,.18)",borderRadius:7,padding:"6px 4px",color:birthDetails[f.k]?"#e8d5b7":"#636e72",fontFamily:"sans-serif",fontSize:10,outline:"none",cursor:"pointer",width:"100%"}}>
                        <option value="">{f.ph}</option>
                        {f.opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
                      </select>
                    ))}
                  </div>
                </div>

                {/* Row 3: Time */}
                <div style={{marginBottom:6}}>
                  <div style={{fontSize:8,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1,marginBottom:3}}>BIRTH TIME <span style={{color:"#636e72",fontSize:7}}>for Lagna</span></div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 0.8fr",gap:4}}>
                    <select value={birthDetails.timeHr} onChange={e=>setBirthDetails(p=>({...p,timeHr:e.target.value}))} style={{background:"#0d0a1a",border:"1px solid rgba(162,155,254,.18)",borderRadius:7,padding:"6px 4px",color:birthDetails.timeHr?"#e8d5b7":"#636e72",fontFamily:"sans-serif",fontSize:10,outline:"none",cursor:"pointer"}}>
                      <option value="">Hr</option>
                      {Array.from({length:12},(_,i)=>i+1).map(h=><option key={h} value={h}>{String(h).padStart(2,"0")}</option>)}
                    </select>
                    <select value={birthDetails.timeMin} onChange={e=>setBirthDetails(p=>({...p,timeMin:e.target.value}))} style={{background:"#0d0a1a",border:"1px solid rgba(162,155,254,.18)",borderRadius:7,padding:"6px 4px",color:birthDetails.timeMin?"#e8d5b7":"#636e72",fontFamily:"sans-serif",fontSize:10,outline:"none",cursor:"pointer"}}>
                      <option value="">Min</option>
                      {Array.from({length:60},(_,i)=>i).map(m=><option key={m} value={m}>{String(m).padStart(2,"0")}</option>)}
                    </select>
                    <select value={birthDetails.timeAmPm||"AM"} onChange={e=>setBirthDetails(p=>({...p,timeAmPm:e.target.value}))} style={{background:"#0d0a1a",border:"1px solid rgba(162,155,254,.18)",borderRadius:7,padding:"6px 4px",color:"#e8d5b7",fontFamily:"sans-serif",fontSize:10,outline:"none",cursor:"pointer"}}>
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                {/* Row 4: Birth Town - full width PlaceSearch */}
                <div style={{marginBottom:6}}>
                  <div style={{fontSize:8,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1,marginBottom:3}}>BIRTH TOWN / CITY</div>
                  <PlaceSearch
                    value={birthDetails.place}
                    onChange={v=>setBirthDetails(p=>({...p,place:v}))}
                    placeholder="Type city name..."
                    inputStyle={{width:"100%",background:"rgba(255,255,255,.05)",border:"1px solid rgba(162,155,254,.18)",borderRadius:7,padding:"6px 8px",color:"#e8d5b7",fontFamily:"sans-serif",fontSize:11,outline:"none",boxSizing:"border-box"}}
                  />
                </div>

                {/* Row 5: Country - full width */}
                <div style={{marginBottom:6}}>
                  <div style={{fontSize:8,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1,marginBottom:3}}>COUNTRY</div>
                  <select value={birthDetails.country} onChange={e=>setBirthDetails(p=>({...p,country:e.target.value}))} style={{width:"100%",background:"#0d0a1a",border:"1px solid rgba(162,155,254,.18)",borderRadius:7,padding:"6px 8px",color:birthDetails.country?"#e8d5b7":"#636e72",fontFamily:"sans-serif",fontSize:11,outline:"none",cursor:"pointer",boxSizing:"border-box"}}>
                    <option value="">Select country</option>
                    {["India","Australia","United Kingdom","United States","Canada","Singapore","UAE","New Zealand","Malaysia","Sri Lanka","Bangladesh","Pakistan","Nepal","Germany","France","Other"].map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Row 5: Language */}
                <div style={{marginBottom:8}}>
                  <div style={{fontSize:8,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1,marginBottom:3}}>PREFERRED LANGUAGE</div>
                  <select value={birthDetails.lang} onChange={e=>setBirthDetails(p=>({...p,lang:e.target.value}))} style={{width:"100%",background:"#0d0a1a",border:"1px solid rgba(162,155,254,.18)",borderRadius:7,padding:"6px 8px",color:birthDetails.lang?"#e8d5b7":"#636e72",fontFamily:"sans-serif",fontSize:11,outline:"none",cursor:"pointer",boxSizing:"border-box"}}>
                    <option value="">English (default)</option>
                    {["Tamil","Hindi","Telugu","Kannada","Malayalam","Gujarati","Marathi","Bengali","Punjabi","Urdu","Sinhala","Nepali","Arabic","French","German","Spanish"].map(l=><option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>{setBirthSubmitted(true);setMsgs(p=>[...p,{f:"chart"}]);}} style={{flex:1,background:"transparent",color:"#8a7a6a",border:"1px solid rgba(200,150,50,.15)",borderRadius:7,padding:"6px",fontFamily:"sans-serif",fontSize:10,cursor:"pointer"}}>Skip</button>
                  <button onClick={()=>{
                    setBirthSubmitted(true);
                    const dobStr=birthDetails.dobDay&&birthDetails.dobMonth&&birthDetails.dobYear?birthDetails.dobDay+"/"+birthDetails.dobMonth+"/"+birthDetails.dobYear:"";
                    const timeStr=birthDetails.timeHr&&birthDetails.timeMin?birthDetails.timeHr+":"+String(birthDetails.timeMin).padStart(2,"0")+" "+(birthDetails.timeAmPm||"AM"):"";
                    const parts=[];
                    if(birthDetails.name) parts.push("Name: "+birthDetails.name);
                    if(birthDetails.gender) parts.push("Gender: "+birthDetails.gender);
                    if(dobStr) parts.push("DOB: "+dobStr);
                    if(timeStr) parts.push("Time: "+timeStr);
                    if(birthDetails.place) parts.push("Place: "+birthDetails.place);
                    if(birthDetails.country) parts.push("Country: "+birthDetails.country);
                    if(birthDetails.lang) parts.push("Language: "+birthDetails.lang);
                    if(parts.length>0){
                      setMsgs(p=>[...p,{f:"u",t:"My details — "+parts.join(" | ")},{f:"chart"}]);
                    } else {
                      setMsgs(p=>[...p,{f:"chart"}]);
                    }
                  }} style={{flex:2,background:"linear-gradient(135deg,#5f3dc4,#a29bfe)",color:"white",border:"none",borderRadius:7,padding:"6px",fontFamily:"sans-serif",fontSize:10,fontWeight:700,cursor:"pointer"}}>Submit Details</button>
                </div>
              </div>
            )}



            {aiTyping&&<div className="cA" style={{display:"flex",alignItems:"center",gap:5,padding:"8px 12px"}}>
              <div style={{display:"flex",gap:3}}>{[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:"#ffd700",opacity:.7,animation:"pulse .6s ease "+(i*.15)+"s infinite"}}/>)}</div>
            </div>}
            <div ref={msgsEndRef}/>
          </div>
          <div style={{padding:"9px 13px 28px",borderTop:"1px solid rgba(200,150,50,.15)",display:"flex",gap:7,background:"rgba(10,0,21,.97)",position:"sticky",bottom:0,zIndex:10,flexShrink:0,width:"100%",boxSizing:"border-box"}}>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.jpg,.jpeg,.png,.gif,.webp"
              style={{display:"none"}}
              onChange={async e=>{
                const file=e.target.files?.[0];
                if(!file) return;
                setAttachLoading(true);
                const isImage=file.type.startsWith("image/");
                const reader=new FileReader();
                reader.onload=ev=>{
                  const base64=ev.target.result.split(",")[1];
                  setAttachment({
                    type:isImage?"image":"file",
                    url:ev.target.result,
                    name:file.name,
                    base64,
                    mimeType:file.type||"image/jpeg"
                  });
                  setAttachLoading(false);
                };
                reader.readAsDataURL(file);
                e.target.value="";
              }}
            />
            {/* Attachment preview */}
            {attachment&&(
              <div style={{position:"absolute",bottom:70,left:14,right:14,background:"rgba(10,0,21,.97)",border:"1px solid rgba(255,215,0,.25)",borderRadius:10,padding:"8px 10px",display:"flex",alignItems:"center",gap:8}}>
                {attachment.type==="image"
                  ?<img src={attachment.url} style={{width:44,height:44,objectFit:"cover",borderRadius:6,border:"1px solid rgba(255,215,0,.2)"}} alt="attachment"/>
                  :<div style={{width:44,height:44,borderRadius:6,background:"rgba(255,255,255,.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>&#128196;</div>
                }
                <div style={{flex:1,overflow:"hidden"}}>
                  <div style={{fontSize:11,color:"#e8d5b7",fontFamily:"sans-serif",fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{attachment.name}</div>
                  <div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif"}}>{attachment.type==="image"?"Image attached":"File attached"} · tap × to remove</div>
                </div>
                <button onClick={()=>setAttachment(null)} style={{background:"none",border:"none",color:"#8a7a6a",fontSize:18,cursor:"pointer",padding:0,lineHeight:1}}>×</button>
              </div>
            )}
            {/* Attach button */}
            <button
              onClick={()=>fileInputRef.current&&fileInputRef.current.click()}
              disabled={attachLoading}
              style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(200,150,50,.2)",borderRadius:10,padding:"10px 11px",color:attachment?"#ffd700":"#8a7a6a",fontSize:17,cursor:"pointer",flexShrink:0,position:"relative"}}
              title="Attach image or file"
            >
              {attachLoading?"⏳":"📎"}
              {attachment&&<div style={{position:"absolute",top:-3,right:-3,width:8,height:8,borderRadius:"50%",background:"#00b894"}}/>}
            </button>
            <input style={{...ip,flex:1}} value={chatInp} onChange={e=>setChatInp(e.target.value)} placeholder={sessOn?"Ask your question…":"Start session ("+pps(chatA)+"/min)"} onKeyDown={e=>e.key==="Enter"&&sendMsg()}/>
            <button style={{...bG,padding:"10px 13px",opacity:aiTyping?.5:1}} onClick={sendMsg} disabled={aiTyping||((!chatInp.trim())&&!attachment)}>Send</button>
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
            <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12,justifyContent:"center"}}>
              {["Very Accurate","Helpful","Good Listener","Knowledgeable","Polite"].map(t=>(
                <div key={t} style={{padding:"4px 10px",borderRadius:16,border:"1px solid rgba(200,150,50,.22)",fontSize:11,fontFamily:"sans-serif",color:"#8a7a6a",cursor:"pointer"}}>{t}</div>
              ))}
            </div>
            <div style={{display:"flex",gap:9}}>
              <button style={{...bO,flex:1}} onClick={()=>setShowRev(false)}>Skip</button>
              <button style={{...bG,flex:2,padding:11}} onClick={()=>{setShowRev(false);toast$("Thanks for your review! 🙏");}}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Jathagam Instant Connect */}
      {jathagam&&(
        <div style={{position:"fixed",inset:0,background:BG,zIndex:400,display:"flex",flexDirection:"column"}} onKeyDown={e=>e.key==="Escape"&&(setJathagam(null),setJChat([]),setJInp(""))}>
          <div style={{position:"sticky",top:0,zIndex:100,background:"rgba(10,0,21,.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(162,155,254,.3)",padding:"0 16px",display:"flex",alignItems:"center",height:60,flexShrink:0}}>
            <button onClick={()=>{setJathagam(null);setJChat([]);setJInp("");}} style={{background:"none",border:"none",color:"#8a7a6a",fontSize:18,cursor:"pointer",marginRight:10,padding:0}}>&#8592;</button>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,color:"#a29bfe",fontFamily:"sans-serif"}}>&#128302; Jathagam Reading</div>
              <div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif"}}>
                {jathagam.astro
                  ? <span style={{color:"#00b894"}}>&#9679; {jathagam.astro.name} · Connected</span>
                  : "Finding your astrologer..."}
              </div>
            </div>
            {jathagam.astro&&<div style={{fontSize:9,color:"#00b894",fontFamily:"sans-serif",background:"rgba(0,184,148,.1)",border:"1px solid rgba(0,184,148,.25)",borderRadius:6,padding:"3px 9px"}}>LIVE</div>}
          </div>

          {/* Step 1 - Collect birth details */}
          {jathagam.step===1&&(
            <div style={{flex:1,overflowY:"auto",padding:"14px 14px 80px"}}>

              {/* Title */}
              <div style={{textAlign:"center",marginBottom:16}}>
                <div style={{fontSize:26,marginBottom:6}}>&#128302;</div>
                <div style={{fontSize:17,fontWeight:700,color:"#a29bfe",fontFamily:"sans-serif",marginBottom:3}}>Jathagam / Kundali</div>
                <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.6}}>Tamil Jathagam · North Indian Kundali · Vedic Birth Chart</div>
              </div>

              {/* Input form */}
              <div style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(162,155,254,.2)",borderRadius:16,padding:"16px 14px",marginBottom:14}}>
                <div style={{fontSize:12,fontWeight:700,color:"#a29bfe",fontFamily:"sans-serif",marginBottom:12}}>&#9997; Enter Birth Details</div>

                {/* Name */}
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1.2,marginBottom:4}}>FULL NAME <span style={{color:"#ff8a80"}}>*</span></div>
                  <input value={jathagam.data?.name||""} onChange={e=>setJathagam(p=>({...p,data:{...p.data,name:e.target.value}}))} placeholder="Your full name" style={{width:"100%",background:"rgba(255,255,255,.06)",border:"1px solid rgba(162,155,254,.25)",borderRadius:9,padding:"10px 12px",color:"#e8d5b7",fontFamily:"sans-serif",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
                </div>

                {/* Gender */}
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1.2,marginBottom:6}}>GENDER <span style={{color:"#ff8a80"}}>*</span></div>
                  <div style={{display:"flex",gap:8}}>
                    {["Male","Female","Other"].map(g=>(
                      <div key={g} onClick={()=>setJathagam(p=>({...p,data:{...p.data,gender:g}}))} style={{flex:1,textAlign:"center",padding:"8px",borderRadius:9,border:"1px solid",borderColor:(jathagam.data?.gender===g)?"rgba(162,155,254,.6)":"rgba(162,155,254,.2)",background:(jathagam.data?.gender===g)?"rgba(162,155,254,.15)":"transparent",color:(jathagam.data?.gender===g)?"#a29bfe":"#8a7a6a",fontFamily:"sans-serif",fontSize:12,cursor:"pointer"}}>
                      {g==="Male"?"♂":g==="Female"?"♀":"○"} {g}
                    </div>
                    ))}
                  </div>
                </div>

                {/* Date of Birth */}
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1.2,marginBottom:4}}>DATE OF BIRTH <span style={{color:"#ff8a80"}}>*</span></div>
                  <div style={{display:"grid",gridTemplateColumns:"2fr 2fr 3fr",gap:6}}>
                    <select value={jathagam.data?.dobDay||""} onChange={e=>setJathagam(p=>({...p,data:{...p.data,dobDay:e.target.value}}))} style={{background:"#0d0a1a",border:"1px solid rgba(162,155,254,.25)",borderRadius:9,padding:"10px 8px",color:jathagam.data?.dobDay?"#e8d5b7":"#636e72",fontFamily:"sans-serif",fontSize:12,outline:"none",cursor:"pointer"}}>
                      <option value="">Day</option>
                      {Array.from({length:31},(_,i)=>i+1).map(d=><option key={d} value={d}>{String(d).padStart(2,"0")}</option>)}
                    </select>
                    <select value={jathagam.data?.dobMonth||""} onChange={e=>setJathagam(p=>({...p,data:{...p.data,dobMonth:e.target.value}}))} style={{background:"#0d0a1a",border:"1px solid rgba(162,155,254,.25)",borderRadius:9,padding:"10px 8px",color:jathagam.data?.dobMonth?"#e8d5b7":"#636e72",fontFamily:"sans-serif",fontSize:12,outline:"none",cursor:"pointer"}}>
                      <option value="">Month</option>
                      {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m,i)=><option key={m} value={i+1}>{m}</option>)}
                    </select>
                    <select value={jathagam.data?.dobYear||""} onChange={e=>setJathagam(p=>({...p,data:{...p.data,dobYear:e.target.value}}))} style={{background:"#0d0a1a",border:"1px solid rgba(162,155,254,.25)",borderRadius:9,padding:"10px 8px",color:jathagam.data?.dobYear?"#e8d5b7":"#636e72",fontFamily:"sans-serif",fontSize:12,outline:"none",cursor:"pointer"}}>
                      <option value="">Year</option>
                      {Array.from({length:100},(_,i)=>2025-i).map(y=><option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                {/* Birth Time */}
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1.2,marginBottom:4}}>BIRTH TIME <span style={{color:"#636e72",fontSize:9}}>optional but recommended for accurate Lagna</span></div>
                  <div style={{display:"grid",gridTemplateColumns:"2fr 2fr 2fr",gap:6}}>
                    <select value={jathagam.data?.timeHr||""} onChange={e=>setJathagam(p=>({...p,data:{...p.data,timeHr:e.target.value}}))} style={{background:"#0d0a1a",border:"1px solid rgba(162,155,254,.25)",borderRadius:9,padding:"10px 8px",color:jathagam.data?.timeHr?"#e8d5b7":"#636e72",fontFamily:"sans-serif",fontSize:12,outline:"none",cursor:"pointer"}}>
                      <option value="">Hour</option>
                      {Array.from({length:12},(_,i)=>i+1).map(h=><option key={h} value={h}>{String(h).padStart(2,"0")}</option>)}
                    </select>
                    <select value={jathagam.data?.timeMin||""} onChange={e=>setJathagam(p=>({...p,data:{...p.data,timeMin:e.target.value}}))} style={{background:"#0d0a1a",border:"1px solid rgba(162,155,254,.25)",borderRadius:9,padding:"10px 8px",color:jathagam.data?.timeMin?"#e8d5b7":"#636e72",fontFamily:"sans-serif",fontSize:12,outline:"none",cursor:"pointer"}}>
                      <option value="">Min</option>
                      {Array.from({length:60},(_,i)=>i).map(m=><option key={m} value={m}>{String(m).padStart(2,"0")}</option>)}
                    </select>
                    <select value={jathagam.data?.timeAmPm||"AM"} onChange={e=>setJathagam(p=>({...p,data:{...p.data,timeAmPm:e.target.value}}))} style={{background:"#0d0a1a",border:"1px solid rgba(162,155,254,.25)",borderRadius:9,padding:"10px 8px",color:"#e8d5b7",fontFamily:"sans-serif",fontSize:12,outline:"none",cursor:"pointer"}}>
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                {/* Town / City */}
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1.2,marginBottom:4}}>BIRTH TOWN / CITY <span style={{color:"#ff8a80"}}>*</span></div>
                  <PlaceSearch value={jathagam.data?.place||""} onChange={v=>setJathagam(p=>({...p,data:{...p.data,place:v}}))} placeholder="Type city name..." inputStyle={{width:"100%",background:"rgba(255,255,255,.06)",border:"1px solid rgba(162,155,254,.25)",borderRadius:9,padding:"10px 12px",color:"#e8d5b7",fontFamily:"sans-serif",fontSize:13,outline:"none"}}/>
                </div>

                {/* Country */}
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1.2,marginBottom:4}}>COUNTRY <span style={{color:"#ff8a80"}}>*</span></div>
                  <select value={jathagam.data?.country||""} onChange={e=>setJathagam(p=>({...p,data:{...p.data,country:e.target.value}}))} style={{width:"100%",background:"#0d0a1a",border:"1px solid rgba(162,155,254,.25)",borderRadius:9,padding:"10px 12px",color:jathagam.data?.country?"#e8d5b7":"#636e72",fontFamily:"sans-serif",fontSize:13,outline:"none",cursor:"pointer",boxSizing:"border-box"}}>
                    <option value="">Select country</option>
                    {["India","Australia","United Kingdom","United States","Canada","Singapore","UAE","New Zealand","Malaysia","Sri Lanka","Bangladesh","Pakistan","Nepal","Germany","France","Other"].map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Preferred Language */}
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:10,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1.2,marginBottom:4}}>PREFERRED LANGUAGE <span style={{color:"#636e72",fontSize:9}}>reading will be in this language</span></div>
                  <select value={jathagam.data?.lang||""} onChange={e=>setJathagam(p=>({...p,data:{...p.data,lang:e.target.value}}))} style={{width:"100%",background:"#0d0a1a",border:"1px solid rgba(162,155,254,.25)",borderRadius:9,padding:"10px 12px",color:jathagam.data?.lang?"#e8d5b7":"#636e72",fontFamily:"sans-serif",fontSize:13,outline:"none",cursor:"pointer",boxSizing:"border-box"}}>
                    <option value="">English (default)</option>
                    {["Tamil","Hindi","Telugu","Kannada","Malayalam","Gujarati","Marathi","Bengali","Punjabi","Urdu","Sinhala","Nepali","Arabic","French","German","Spanish"].map(l=><option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                {/* Submit button */}
                <button onClick={async()=>{
                  const d=jathagam.data||{};
                  if(!d.name||!d.dobDay||!d.dobMonth||!d.dobYear||!d.place||!d.country){
                    alert("Please fill Name, Date of Birth, Birth Town and Country");return;
                  }
                  const dobStr=String(d.dobDay).padStart(2,"0")+"/"+String(d.dobMonth).padStart(2,"0")+"/"+d.dobYear;
                  const timeStr=(d.timeHr&&d.timeMin)?d.timeHr+":"+String(d.timeMin).padStart(2,"0")+" "+(d.timeAmPm||"AM"):"not provided";
                  const langPref=d.lang||"English";
                  const onlineAstros=ASTROS.filter(a=>a.status==="online"||a.status==="busy");
                  const kundliAstro=onlineAstros.find(a=>a.spec==="Kundli & Marriage"||a.spec==="Vedic Astrology")||onlineAstros[0]||ASTROS[0];
                  setJathagam(p=>({...p,step:2,astro:kundliAstro,data:{...p.data,dob:dobStr,time:timeStr}}));
                  setJChat([{f:"a",t:"Namaste "+(d.name)+" 🙏 I am "+kundliAstro.name+". I have received your birth details. Let me prepare your "+(d.country==="India"&&(d.lang==="Tamil"||!d.lang&&d.place.toLowerCase().match(/chennai|madurai|coimbatore|trichy|salem|erode|vellore|tirunelveli|thanjavur|tamilnadu/))?"Jathagam (ஜாதகம்)":"Kundali / Jathagam")+" now..."}]);
                  setJTyping(true);
                  try{
                    const langInstr=langPref!=="English"?"IMPORTANT: Respond entirely in "+langPref+" language.":"";
                    const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,system:"You are "+kundliAstro.name+", expert Vedic astrologer. "+langInstr+" The customer: Name: "+d.name+", Gender: "+(d.gender||"not given")+", DOB: "+dobStr+", Birth Time: "+timeStr+", Birth Place: "+d.place+", Country: "+d.country+". Write a warm personal Jathagam/Kundali reading in flowing natural paragraphs (NO markdown headers like ##, NO numbered lists, NO bullet points, NO emojis in the reading). Cover: Rasi and Nakshatra, Lagna if time given, key planetary influences, current dasha, and brief life guidance for career and relationships. Use Vedic Sanskrit or Tamil terms naturally within sentences. Write as a wise astrologer speaking directly to the person. Never mention AI.",messages:[{role:"user",content:"Please create my Jathagam / Kundali birth chart reading."}]})});
                    const resp=await r.json();
                    const txt=resp.content?.find(b=>b.type==="text")?.text||"Your Jathagam is ready. Ask me anything.";
                    setJChat(p=>[...p,{f:"a",t:txt}]);
                  }catch(e){setJChat(p=>[...p,{f:"a",t:"Your birth details received. Ask me anything about your Jathagam."}]);}
                  setJTyping(false);
                }} style={{width:"100%",background:"linear-gradient(135deg,#5f3dc4,#a29bfe)",color:"white",border:"none",borderRadius:11,padding:"14px",fontWeight:700,fontFamily:"sans-serif",fontSize:15,cursor:"pointer",letterSpacing:.5}}>
                  &#128302; Create My Jathagam / Kundali
                </button>
              </div>

              {/* Available specialists */}
              <div style={{fontSize:12,fontWeight:700,color:G,marginBottom:8,fontFamily:"sans-serif"}}>&#127775; Available Specialists</div>
              {ASTROS.filter(a=>a.status==="online").slice(0,3).map(a=>(
                <div key={a.id} style={{...cd,display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <Av a={a} size={40}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#e8d5b7",fontFamily:"sans-serif"}}>{a.name}</div>
                    <div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif"}}>{a.spec} · {a.exp} · &#11088; {a.rating}</div>
                    <div style={{fontSize:10,color:"#00b894",fontFamily:"sans-serif"}}>&#9679; Online · {pps(a)}/min</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 2 - Chat with astrologer */}          {/* Step 2 - Chat with astrologer */}
          {jathagam.step===2&&(
            <>
              {/* Astrologer info bar */}
              {jathagam.astro&&(
                <div style={{background:"rgba(162,155,254,.08)",borderBottom:"1px solid rgba(162,155,254,.15)",padding:"8px 16px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
                  <Av a={jathagam.astro} size={36}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#e8d5b7",fontFamily:"sans-serif"}}>{jathagam.astro.name}</div>
                    <div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif"}}>{jathagam.astro.spec} · &#11088; {jathagam.astro.rating}</div>
                  </div>
                  <button onClick={()=>{startSess(jathagam.astro);setJathagam(null);}} style={{...bG,fontSize:11,padding:"6px 12px"}}>Start Session</button>
                </div>
              )}
              <div style={{flex:1,overflowY:"auto",padding:"8px 16px",display:"flex",flexDirection:"column"}}>
                {/* First 2 messages (welcome + initial reading) */}
                {jChat.slice(0,2).map((m,i)=>(
                  <div key={i} style={{
                    alignSelf:m.f==="a"?"flex-start":"flex-end",
                    maxWidth:"92%",width:"100%",
                    background:m.f==="a"?"rgba(162,155,254,.08)":"rgba(255,215,0,.1)",
                    border:"1px solid "+(m.f==="a"?"rgba(162,155,254,.2)":"rgba(255,215,0,.2)"),
                    borderRadius:12,padding:"10px 13px",marginBottom:8,
                    fontSize:12,color:"#e8d5b7",fontFamily:"sans-serif",lineHeight:1.8
                  }}>
                    {m.t.split("\n").map((line,li)=>{
                      if(!line.trim()) return <div key={li} style={{height:6}}/>;
                      if(line.startsWith("## ")) return <div key={li} style={{fontSize:13,fontWeight:700,color:"#a29bfe",marginTop:8,marginBottom:3}}>{line.replace(/^##\s*/,"")}</div>;
                      if(line.startsWith("### ")) return <div key={li} style={{fontSize:12,fontWeight:700,color:"#c8a060",marginTop:6,marginBottom:2}}>{line.replace(/^###\s*/,"")}</div>;
                      if(line.startsWith("# ")) return <div key={li} style={{fontSize:14,fontWeight:700,color:G,marginBottom:4}}>{line.replace(/^#\s*/,"")}</div>;
                      if(line.startsWith("---")) return <hr key={li} style={{border:"none",borderTop:"1px solid rgba(200,150,50,.2)",margin:"6px 0"}}/>;
                      if(line.startsWith("- ")) return <div key={li} style={{paddingLeft:10,marginBottom:2}}>• {line.replace(/^-\s*/,"")}</div>;
                      const boldLine=line.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>");
                      return <div key={li} dangerouslySetInnerHTML={{__html:boldLine}} style={{marginBottom:2}}/>;
                    })}
                  </div>
                ))}

                {/* Chart appears after first reading */}
                {jChat.length>=2&&(
                  <div style={{marginBottom:10,width:"100%"}}>
                    <JathagamChart data={jathagam.data} lang={jathagam.data?.lang||"English"}/>
                  </div>
                )}

                {/* All new messages below chart */}
                {jChat.slice(2).map((m,i)=>(
                  <div key={"s"+i} style={{
                    alignSelf:m.f==="a"?"flex-start":"flex-end",
                    maxWidth:"92%",width:"100%",
                    background:m.f==="a"?"rgba(162,155,254,.08)":"rgba(255,215,0,.1)",
                    border:"1px solid "+(m.f==="a"?"rgba(162,155,254,.2)":"rgba(255,215,0,.2)"),
                    borderRadius:12,padding:"10px 13px",marginBottom:8,
                    fontSize:12,color:"#e8d5b7",fontFamily:"sans-serif",lineHeight:1.8,
                    whiteSpace:"pre-wrap"
                  }}>{m.t}</div>
                ))}

                {jTyping&&<div style={{alignSelf:"flex-start",background:"rgba(162,155,254,.1)",border:"1px solid rgba(162,155,254,.25)",borderRadius:12,padding:"10px 13px",marginBottom:8,display:"flex",gap:4,alignItems:"center"}}>
                  {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:"#a29bfe",opacity:.6,animation:"pulse 1s ease "+(i*.2)+"s infinite"}}/>)}
                </div>}
                <div ref={jMsgsEnd}/>
              </div>
              <div style={{padding:"9px 14px 20px",borderTop:"1px solid rgba(162,155,254,.2)",display:"flex",gap:8,background:"rgba(10,0,21,.97)",flexShrink:0}}>
                <input style={{...ip,flex:1,fontSize:13}} value={jInp} onChange={e=>setJInp(e.target.value)} placeholder="Ask about your Jathagam..." onKeyDown={async e=>{
                  if(e.key!=="Enter"||!jInp.trim())return;
                  const q=jInp.trim();setJInp("");
                  setJChat(p=>[...p,{f:"u",t:q}]);setJTyping(true);
                  const d=jathagam.data||{};
                  const a=jathagam.astro||ASTROS[0];
                  try{const hist=jChat.map(m=>({role:m.f==="u"?"user":"assistant",content:m.t}));const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:200,system:"You are "+a.name+", Vedic Jathagam expert. 2-3 sentences. Direct and specific. Customer: "+d.name+", DOB: "+d.dob+", Time: "+(d.time||"unknown")+", Place: "+d.place+". Give personalised Jathagam guidance. Use Sanskrit/Tamil terms. 3-5 sentences. Never mention AI.",messages:[...hist,{role:"user",content:q}]})});const resp=await r.json();setJChat(p=>[...p,{f:"a",t:resp.content?.find(b=>b.type==="text")?.text||"Please ask again."}]);}
                  catch(e){setJChat(p=>[...p,{f:"a",t:"Connection interrupted."}]);}
                  setJTyping(false);
                }}/>
                <button disabled={!jInp.trim()||jTyping} style={{...bG,padding:"10px 14px"}} onClick={async()=>{
                  const q=jInp.trim();if(!q)return;setJInp("");
                  setJChat(p=>[...p,{f:"u",t:q}]);setJTyping(true);
                  const d=jathagam.data||{};const a=jathagam.astro||ASTROS[0];
                  try{const hist=jChat.map(m=>({role:m.f==="u"?"user":"assistant",content:m.t}));const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:200,system:"You are "+a.name+", Vedic Jathagam expert. 2-3 sentences. Direct and specific. Customer: "+d.name+", DOB: "+d.dob+", Time: "+(d.time||"unknown")+", Place: "+d.place+". Personalised Jathagam guidance. 3-5 sentences. Never mention AI.",messages:[...hist,{role:"user",content:q}]})});const resp=await r.json();setJChat(p=>[...p,{f:"a",t:resp.content?.find(b=>b.type==="text")?.text||"Please ask again."}]);}
                  catch(e){setJChat(p=>[...p,{f:"a",t:"Connection interrupted."}]);}
                  setJTyping(false);}}>Send</button>
              </div>
            </>
          )}
        </div>
      )}

      {lifeMod&&(
        <div style={{position:"fixed",inset:0,background:BG,zIndex:300,display:"flex",flexDirection:"column"}} onKeyDown={e=>e.key==="Escape"&&(setLifeMod(null),setLifeChat([]),setLifeInp(""))}>
          <div style={{position:"sticky",top:0,zIndex:100,background:"rgba(10,0,21,.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid "+lifeMod.border,padding:"0 16px",display:"flex",alignItems:"center",height:60,flexShrink:0}}>
            <button onClick={()=>{setLifeMod(null);setLifeChat([]);setLifeInp("");}} style={{background:"none",border:"none",color:"#8a7a6a",fontSize:18,cursor:"pointer",marginRight:10,padding:0}}>&#8592;</button>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,color:lifeMod.color,fontFamily:"sans-serif"}}>{lifeMod.title}</div>
              <div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif"}}>MiraXAstro Specialist</div>
            </div>
            <div style={{fontSize:9,color:lifeMod.color,fontFamily:"sans-serif",background:lifeMod.bg,border:"1px solid "+lifeMod.border,borderRadius:6,padding:"3px 9px"}}>EXCLUSIVE</div>
          </div>
          {lifeChat.length===0&&(
            <div style={{padding:"14px 16px 0",overflowY:"auto"}}>
              <div style={{background:"linear-gradient(135deg,"+lifeMod.bg+",rgba(10,0,21,.85))",border:"1px solid "+lifeMod.border,borderRadius:16,padding:"16px 14px",marginBottom:10}}>
                <div style={{fontSize:12,color:lifeMod.color,fontFamily:"sans-serif",fontWeight:700,marginBottom:8}}>&#9756; SPECIALIST GUIDANCE</div>
                <div style={{fontSize:12,color:"#e8d5b7",fontFamily:"sans-serif",lineHeight:1.75,marginBottom:12}}>
                  {lifeMod.id==="property"?"The cosmos deeply influences property decisions. Let me reveal auspicious planetary windows for buying, selling and moving.":
                   lifeMod.id==="career"?"Saturn and Jupiter reveal ideal timing for interviews, job changes and promotions.":
                   lifeMod.id==="immigration"?"The 9th house governs foreign lands. Let me reveal what the planets say about your visa and new country move.":
                   lifeMod.id==="investment"?"Jupiter and Venus transits reveal ideal windows for investment and financial decisions.":
                   lifeMod.id==="fertility"?"Moon and Jupiter reveal fertile windows and auspicious conception timing.":
                   "Every life situation has a cosmic answer. Ask freely and I will reveal what the planets say for you."}
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {(lifeMod.id==="property"?["Best time to buy","Should I sell?","Auspicious move date","Is this right?"]:
                    lifeMod.id==="career"?["Best interview days","Change jobs now?","Ask for promotion?","Start a business?"]:
                    lifeMod.id==="immigration"?["Best time for visa","Right country?","When to move?","Will I succeed?"]:
                    lifeMod.id==="investment"?["Best months to invest","Property vs shares?","Good time now?","When will I improve?"]:
                    lifeMod.id==="fertility"?["Best conception months","IVF timing","Pregnancy timing","Will I have children?"]:
                    ["Relationship guidance","Career advice","Health timing","Travel dates"]
                  ).map(q=>(
                    <div key={q} onClick={async()=>{
                      setLifeChat([{f:"u",t:q}]);setLifeTyping(true);
                      try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:150,system:"You are a MiraXAstro "+lifeMod.title+" specialist. 2-3 specific sentences. Never mention AI.",messages:[{role:"user",content:q}]})});const d=await r.json();setLifeChat(p=>[...p,{f:"a",t:d.content?.find(b=>b.type==="text")?.text||"Please ask again."}]);}
                      catch(e){setLifeChat(p=>[...p,{f:"a",t:"Connection interrupted."}]);}
                      setLifeTyping(false);
                    }} style={{padding:"6px 12px",borderRadius:16,border:"1px solid "+lifeMod.border,background:lifeMod.bg,fontSize:11,fontFamily:"sans-serif",color:lifeMod.color,cursor:"pointer"}}>{q}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div style={{flex:1,overflowY:"auto",padding:"8px 16px",display:"flex",flexDirection:"column"}}>
            {lifeChat.map((m,i)=><div key={i} className={m.f==="a"?"chatA":"chatU"} style={m.f==="a"?{borderColor:lifeMod.border}:{}}>{m.t}</div>)}
            {lifeTyping&&<div className="chatA" style={{display:"flex",alignItems:"center",gap:6}}><div style={{display:"flex",gap:3}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:lifeMod.color,opacity:.6,animation:"pulse 1s ease "+(i*.2)+"s infinite"}}/>)}</div><span style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif"}}>consulting the stars...</span></div>}
            {lifeChat.length>=4&&<div style={{...cd,background:"linear-gradient(135deg,"+lifeMod.bg+",rgba(10,0,21,.9))",border:"1px solid "+lifeMod.border,marginTop:6,display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif"}}>Want a deeper reading?</div><button style={{...bG,fontSize:11,padding:"6px 12px"}} onClick={()=>{setLifeMod(null);setLifeChat([]);setTab("Astrologers");}}>Book Specialist</button></div>}
          </div>
          <div style={{padding:"9px 14px 20px",borderTop:"1px solid "+lifeMod.border,display:"flex",gap:8,background:"rgba(10,0,21,.97)",flexShrink:0}}>
            <input style={{...ip,flex:1,fontSize:13}} value={lifeInp} onChange={e=>setLifeInp(e.target.value)} placeholder={"Ask about "+lifeMod.title.toLowerCase()+"..."} onKeyDown={async e=>{
              if(e.key!=="Enter"||!lifeInp.trim())return;
              const q=lifeInp.trim();setLifeInp("");setLifeChat(p=>[...p,{f:"u",t:q}]);setLifeTyping(true);
              try{const hist=lifeChat.map(m=>({role:m.f==="u"?"user":"assistant",content:m.t}));const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:150,system:"You are a MiraXAstro "+lifeMod.title+" specialist. 2-3 specific sentences. Never mention AI.",messages:[...hist,{role:"user",content:q}]})});const d=await r.json();setLifeChat(p=>[...p,{f:"a",t:d.content?.find(b=>b.type==="text")?.text||"Please ask again."}]);}
              catch(e){setLifeChat(p=>[...p,{f:"a",t:"Connection interrupted."}]);}
              setLifeTyping(false);
            }}/>
            <button disabled={!lifeInp.trim()||lifeTyping} style={{...bG,padding:"10px 14px"}} onClick={async()=>{
              const q=lifeInp.trim();if(!q)return;setLifeInp("");setLifeChat(p=>[...p,{f:"u",t:q}]);setLifeTyping(true);
              try{const hist=lifeChat.map(m=>({role:m.f==="u"?"user":"assistant",content:m.t}));const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:150,system:"You are a MiraXAstro "+lifeMod.title+" specialist. 2-3 specific sentences. Never mention AI.",messages:[...hist,{role:"user",content:q}]})});const d=await r.json();setLifeChat(p=>[...p,{f:"a",t:d.content?.find(b=>b.type==="text")?.text||"Please ask again."}]);}
              catch(e){setLifeChat(p=>[...p,{f:"a",t:"Connection interrupted."}]);}
              setLifeTyping(false);}}>Send</button>
          </div>
        </div>
      )}

      {toast&&<div style={{position:"fixed",bottom:82,left:"50%",transform:"translateX(-50%)",background:toast.t==="err"?"rgba(255,71,87,.93)":"rgba(0,184,148,.93)",color:"white",padding:"10px 20px",borderRadius:12,fontFamily:"sans-serif",fontSize:13,fontWeight:600,zIndex:600,backdropFilter:"blur(10px)",whiteSpace:"nowrap",animation:"floatIn .3s ease"}}>{toast.m}</div>}
    </div>
  );
}


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



const lbl={fontSize:11,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1.3,marginBottom:5,display:"block"};

function ASp({size=16,color=G}){
  return <div style={{width:size,height:size,border:"2px solid "+color+"22",borderTop:"2px solid "+color,borderRadius:"50%",animation:"spin .8s linear infinite",flexShrink:0}}/>;
}

function AErr({m}){
  return m?<div style={{fontSize:11,color:"#ff4757",fontFamily:"sans-serif",marginTop:3}}>⚠ {m}</div>:null;
}

function AAavUrl(name,g){
  return"https://api.dicebear.com/7.x/avataaars/svg?seed="+encodeURIComponent(name)+"&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=160&skinColor="+(g==="female"?"d08b5b,edb98a":"ae5d29,d08b5b")+"&top="+(g==="female"?"longHair,longHairBigHair":"shortHairShortFlat,hat,turban")+"&facialHair="+(g==="male"?"beardLight,moustacheFancy,blank":"blank")+"&clothing=blazerAndShirt,hoodie";
}

function ATags({opts,sel,onToggle,max}){
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

function AProgressBar({step,steps}){
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
function ALanding({onApply,onLogin}){
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
function AOnboard({onDone}){
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
        <AProgressBar step={step} steps={STEPS}/>

        {step===0&&(
          <div style={{animation:"floatIn .4s ease"}}>
            <div style={{textAlign:"center",marginBottom:14}}><div style={{fontSize:26,marginBottom:5}}>👤</div><div style={{fontSize:16,fontWeight:700,color:G}}>Create Your Account</div></div>
            {[["FULL NAME *","name","text","Your full name"],["EMAIL *","email","email","your@email.com"]].map(([l,k,t,ph])=>(
              <div key={k} style={{marginBottom:11}}>
                <label style={lbl}>{l}</label>
                <input type={t} value={d[k]} onChange={e=>setF(k,e.target.value)} placeholder={ph} style={iE(k)}/>
                <AErr m={errs[k]}/>
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
              <AErr m={errs.phone}/>
            </div>
            <div style={{marginBottom:4}}>
              <label style={lbl}>PASSWORD *</label>
              <div style={{position:"relative"}}>
                <input type={showPw?"text":"password"} value={d.pw} onChange={e=>setF("pw",e.target.value)} placeholder="Min 8 characters" style={{...iE("pw"),paddingRight:40}}/>
                <span onClick={()=>setShowPw(v=>!v)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",cursor:"pointer",color:"#8a7a6a",fontSize:14}}>{showPw?"🙈":"👁"}</span>
              </div>
              <AErr m={errs.pw}/>
            </div>
            <PwStrength pw={d.pw}/>
            <div style={{marginBottom:11}}>
              <label style={lbl}>CONFIRM PASSWORD *</label>
              <input type="password" value={d.pw2} onChange={e=>setF("pw2",e.target.value)} placeholder="Repeat password" style={iE("pw2")}/>
              <AErr m={errs.pw2}/>
            </div>
            <div style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:errs.agreed?4:14,cursor:"pointer"}} onClick={()=>setF("agreed",!d.agreed)}>
              <div style={{width:17,height:17,borderRadius:4,border:"2px solid "+(d.agreed?G:"rgba(200,150,50,.3)"),background:d.agreed?"rgba(255,215,0,.12)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>{d.agreed&&<span style={{fontSize:10,color:G}}>✓</span>}</div>
              <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.5}}>I agree to <span style={{color:G}}>Astrologer Terms</span>, <span style={{color:G}}>Code of Conduct</span> &amp; <span style={{color:G}}>Privacy Policy</span></div>
            </div>
            <AErr m={errs.agreed}/>
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
                   <img src={AavUrl(d.name||"preview",d.gender)} style={{width:76,height:76,borderRadius:"50%",border:"3px dashed rgba(255,215,0,.2)",margin:"0 auto 6px",display:"block",opacity:.55}} alt=""/>
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
              <ATags opts={SPECS} sel={d.specs} onToggle={(v,on)=>{if(on)setF("specs",d.specs.filter(x=>x!==v));else if(d.specs.length<5)setF("specs",[...d.specs,v]);}}/>
              <AErr m={errs.specs}/>
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
              <AErr m={errs.langs}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:12}}>
              <div>
                <label style={lbl}>EXPERIENCE *</label>
                <select value={d.exp} onChange={e=>setF("exp",e.target.value)} style={{...iE("exp"),cursor:"pointer",color:"#e8d5b7",background:"#0d0a1a"}}>
                  <option value="">Select</option>
                  {["1-2 yrs","3-5 yrs","5-10 yrs","10-15 yrs","15-20 yrs","20+ yrs"].map(v=><option key={v}>{v}</option>)}
                </select>
                <AErr m={errs.exp}/>
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
              <AErr m={errs.bio}/>
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
                  <AErr m={errs[k]}/>
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
              <ATags opts={SLOTS} sel={d.slots} onToggle={(v,on)=>setF("slots",on?d.slots.filter(x=>x!==v):[...d.slots,v])}/>
              <AErr m={errs.slots}/>
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
              <AErr m={errs.days}/>
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
              <AErr m={errs.bankCountry}/>
            </div>

            {/* Common fields for all countries */}
            {(d.bankCountry||d.country)&&(
              <div>
                <div style={{marginBottom:11}}>
                  <label style={lbl}>ACCOUNT HOLDER NAME *</label>
                  <input value={d.accountName||""} onChange={e=>setF("accountName",e.target.value)} placeholder="Full name as on bank account" style={{...ip,border:"1px solid "+(errs.accountName?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
                  <AErr m={errs.accountName}/>
                </div>
                <div style={{marginBottom:11}}>
                  <label style={lbl}>BANK ACCOUNT NUMBER *</label>
                  <input value={d.accountNum||""} onChange={e=>setF("accountNum",e.target.value.replace(/\s/g,""))} placeholder="Your bank account number" style={{...ip,border:"1px solid "+(errs.accountNum?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)"),fontFamily:"monospace",letterSpacing:1}}/>
                  <AErr m={errs.accountNum}/>
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
                        <AErr m={errs.bankName}/>
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
                      <AErr m={errs.ifsc}/>
                    </div>
                    <div style={{marginBottom:11}}>
                      <label style={lbl}>PAN NUMBER *</label>
                      <input value={d.panNum||""} onChange={e=>setF("panNum",e.target.value.toUpperCase().slice(0,10))} placeholder="e.g. ABCDE1234F" style={{...ip,fontFamily:"monospace",letterSpacing:2,border:"1px solid "+(errs.panNum?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
                      <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif",marginTop:3}}>Required for tax compliance - payments above ₹50,000/year</div>
                      <AErr m={errs.panNum}/>
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
                        <AErr m={errs.bankName}/>
                      </div>
                      <div>
                        <label style={lbl}>BSB NUMBER *</label>
                        <input value={d.bsb||""} onChange={e=>setF("bsb",e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="e.g. 062000" style={{...ip,fontFamily:"monospace",letterSpacing:2,border:"1px solid "+(errs.bsb?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
                        <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif",marginTop:3}}>6-digit Bank State Branch number</div>
                        <AErr m={errs.bsb}/>
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
                        <AErr m={errs.bankName}/>
                      </div>
                      <div>
                        <label style={lbl}>SORT CODE *</label>
                        <input value={d.sortCode||""} onChange={e=>setF("sortCode",e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="e.g. 200000" style={{...ip,fontFamily:"monospace",letterSpacing:2,border:"1px solid "+(errs.sortCode?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
                        <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif",marginTop:3}}>6-digit sort code</div>
                        <AErr m={errs.sortCode}/>
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
                        <AErr m={errs.bankName}/>
                      </div>
                      <div>
                        <label style={lbl}>ROUTING NUMBER *</label>
                        <input value={d.routingNum||""} onChange={e=>setF("routingNum",e.target.value.replace(/\D/g,"").slice(0,9))} placeholder="9-digit routing number" style={{...ip,fontFamily:"monospace",letterSpacing:2,border:"1px solid "+(errs.routingNum?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
                        <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif",marginTop:3}}>9-digit ABA routing number</div>
                        <AErr m={errs.routingNum}/>
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
                      <AErr m={errs.bankName}/>
                    </div>
                    <div style={{marginBottom:11}}>
                      <label style={lbl}>SWIFT / BIC CODE *</label>
                      <input value={d.swiftBic||""} onChange={e=>setF("swiftBic",e.target.value.toUpperCase().slice(0,11))} placeholder="e.g. DBSSSGSG" style={{...ip,fontFamily:"monospace",letterSpacing:2,border:"1px solid "+(errs.swiftBic?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
                      <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif",marginTop:3}}>8 or 11 character SWIFT/BIC code</div>
                      <AErr m={errs.swiftBic}/>
                    </div>
                  </div>
                )}

                {/* -- GERMANY / FRANCE / EU -- */}
                {["Germany","France"].includes(d.bankCountry||d.country)&&(
                  <div>
                    <div style={{marginBottom:11}}>
                      <label style={lbl}>BANK NAME *</label>
                      <input value={d.bankName||""} onChange={e=>setF("bankName",e.target.value)} placeholder="Your bank name" style={{...ip,border:"1px solid "+(errs.bankName?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
                      <AErr m={errs.bankName}/>
                    </div>
                    <div style={{marginBottom:11}}>
                      <label style={lbl}>IBAN *</label>
                      <input value={d.iban||""} onChange={e=>setF("iban",e.target.value.toUpperCase().replace(/\s/g,"").slice(0,34))} placeholder="e.g. DE89370400440532013000" style={{...ip,fontFamily:"monospace",letterSpacing:1,border:"1px solid "+(errs.iban?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
                      <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif",marginTop:3}}>International Bank Account Number (up to 34 chars)</div>
                      <AErr m={errs.iban}/>
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
                      <AErr m={errs.bankName}/>
                    </div>
                    <div style={{marginBottom:11}}>
                      <label style={lbl}>SWIFT / BIC CODE *</label>
                      <input value={d.swiftBic||""} onChange={e=>setF("swiftBic",e.target.value.toUpperCase().slice(0,11))} placeholder="8 or 11 character SWIFT code" style={{...ip,fontFamily:"monospace",letterSpacing:2,border:"1px solid "+(errs.swiftBic?"rgba(255,71,87,.4)":"rgba(200,150,50,.28)")}}/>
                      <AErr m={errs.swiftBic}/>
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
                :<img src={AavUrl(d.name||"p",d.gender)} style={{width:70,height:70,borderRadius:"50%",border:"3px solid rgba(255,215,0,.25)",display:"block",margin:"0 auto 9px",opacity:.75}} alt=""/>
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
                {loading&&<ASp size={15}/>}{loading?"Submitting…":"🚀 Submit for Approval"}
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
function APending({d,onDashboard}){
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
                  {done?"✓":active?<ASp size={11}/>:i+1}
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
          {d?.photo?<img src={d.photo} alt={d?.name} style={{width:64,height:64,borderRadius:"50%",objectFit:"cover",border:"3px solid rgba(255,215,0,.4)",display:"block",margin:"0 auto 9px"}}/>:<img src={AavUrl(d?.name||"a",d?.gender||"male")} style={{width:64,height:64,borderRadius:"50%",border:"3px solid rgba(255,215,0,.25)",display:"block",margin:"0 auto 9px",opacity:.75}} alt=""/>}
          <div style={{fontSize:14,fontWeight:700,color:"#e8d5b7"}}>{d?.name||"Your Name"}</div>
          <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",marginTop:2}}>{d?.specs?.slice(0,2).join(" · ")||"Astrologer"}</div>
        </div>
        <button style={{...bG,width:"100%",padding:13,fontSize:14}} onClick={onDashboard}>Go to Dashboard →</button>
      </div>
    </div>
  );
}

// -- DASHBOARD -----------------------------------------------------
function ADashboard({d}){
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
function AstroApp(){
  const [av,setAv]=React.useState("land");
  const [ad,setAd]=React.useState(null);
  if(av==="land") return <ALanding onApply={()=>setAv("onboard")} onLogin={()=>setAv("dash")}/>;
  if(av==="onboard") return <AOnboard onDone={data=>{if(data){setAd(data);setAv("pending");}else setAv("land");}}/>;
  if(av==="pending") return <APending d={ad} onDashboard={()=>setAv("dash")}/>;
  if(av==="dash") return <ADashboard d={ad}/>;
  return null;
}

// ── South Indian Jathagam Chart ──────────────────────────────
function PlaceSearch({value,onChange,placeholder,inputStyle}){
  const [query,setQuery]=React.useState(value||"");
  const [results,setResults]=React.useState([]);
  const [open,setOpen]=React.useState(false);
  const [loading,setLoading]=React.useState(false);
  const wrapRef=React.useRef();
  const inputRef=React.useRef();
  const debRef=React.useRef();
  const [dropPos,setDropPos]=React.useState({top:0,left:0,width:0});

  React.useEffect(()=>{
    function h(e){if(wrapRef.current&&!wrapRef.current.contains(e.target))setOpen(false);}
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[]);

  function updatePos(){
    if(inputRef.current){
      const r=inputRef.current.getBoundingClientRect();
      setDropPos({top:r.bottom,left:r.left,width:r.width});
    }
  }

  function flag(cc){
    if(!cc)return"🌍";
    try{return cc.toUpperCase().replace(/./g,c=>String.fromCodePoint(127397+c.charCodeAt()));}
    catch{return"🌍";}
  }

  const FALLBACK=[
    {n:"Chennai",r:"Tamil Nadu",c:"India",cc:"IN"},{n:"Mumbai",r:"Maharashtra",c:"India",cc:"IN"},
    {n:"Delhi",r:"Delhi",c:"India",cc:"IN"},{n:"Bangalore",r:"Karnataka",c:"India",cc:"IN"},
    {n:"Hyderabad",r:"Telangana",c:"India",cc:"IN"},{n:"Coimbatore",r:"Tamil Nadu",c:"India",cc:"IN"},
    {n:"Madurai",r:"Tamil Nadu",c:"India",cc:"IN"},{n:"Erode",r:"Tamil Nadu",c:"India",cc:"IN"},
    {n:"Salem",r:"Tamil Nadu",c:"India",cc:"IN"},{n:"Trichy",r:"Tamil Nadu",c:"India",cc:"IN"},
    {n:"Pune",r:"Maharashtra",c:"India",cc:"IN"},{n:"Kolkata",r:"West Bengal",c:"India",cc:"IN"},
    {n:"Ahmedabad",r:"Gujarat",c:"India",cc:"IN"},{n:"Jaipur",r:"Rajasthan",c:"India",cc:"IN"},
    {n:"Lucknow",r:"Uttar Pradesh",c:"India",cc:"IN"},{n:"Kochi",r:"Kerala",c:"India",cc:"IN"},
    {n:"Chandigarh",r:"Chandigarh",c:"India",cc:"IN"},{n:"Bhopal",r:"Madhya Pradesh",c:"India",cc:"IN"},
    {n:"Nagpur",r:"Maharashtra",c:"India",cc:"IN"},{n:"Varanasi",r:"Uttar Pradesh",c:"India",cc:"IN"},
    {n:"Patna",r:"Bihar",c:"India",cc:"IN"},{n:"Surat",r:"Gujarat",c:"India",cc:"IN"},
    {n:"Amritsar",r:"Punjab",c:"India",cc:"IN"},{n:"Visakhapatnam",r:"Andhra Pradesh",c:"India",cc:"IN"},
    {n:"Vijayawada",r:"Andhra Pradesh",c:"India",cc:"IN"},{n:"Mysore",r:"Karnataka",c:"India",cc:"IN"},
    {n:"Thiruvananthapuram",r:"Kerala",c:"India",cc:"IN"},{n:"Kozhikode",r:"Kerala",c:"India",cc:"IN"},
    {n:"Karur",r:"Tamil Nadu",c:"India",cc:"IN"},{n:"Tiruppur",r:"Tamil Nadu",c:"India",cc:"IN"},
    {n:"Vellore",r:"Tamil Nadu",c:"India",cc:"IN"},{n:"Thanjavur",r:"Tamil Nadu",c:"India",cc:"IN"},
    {n:"Tirunelveli",r:"Tamil Nadu",c:"India",cc:"IN"},{n:"Nagercoil",r:"Tamil Nadu",c:"India",cc:"IN"},
    {n:"Dindigul",r:"Tamil Nadu",c:"India",cc:"IN"},{n:"Kumbakonam",r:"Tamil Nadu",c:"India",cc:"IN"},
    {n:"Sydney",r:"New South Wales",c:"Australia",cc:"AU"},{n:"Melbourne",r:"Victoria",c:"Australia",cc:"AU"},
    {n:"Brisbane",r:"Queensland",c:"Australia",cc:"AU"},{n:"Perth",r:"Western Australia",c:"Australia",cc:"AU"},
    {n:"Adelaide",r:"South Australia",c:"Australia",cc:"AU"},{n:"Canberra",r:"ACT",c:"Australia",cc:"AU"},
    {n:"Gold Coast",r:"Queensland",c:"Australia",cc:"AU"},{n:"Newcastle",r:"New South Wales",c:"Australia",cc:"AU"},
    {n:"Kellyville",r:"New South Wales",c:"Australia",cc:"AU"},{n:"Parramatta",r:"New South Wales",c:"Australia",cc:"AU"},
    {n:"Blacktown",r:"New South Wales",c:"Australia",cc:"AU"},{n:"Castle Hill",r:"New South Wales",c:"Australia",cc:"AU"},
    {n:"Penrith",r:"New South Wales",c:"Australia",cc:"AU"},{n:"Campbelltown",r:"New South Wales",c:"Australia",cc:"AU"},
    {n:"Hornsby",r:"New South Wales",c:"Australia",cc:"AU"},{n:"Chatswood",r:"New South Wales",c:"Australia",cc:"AU"},
    {n:"Rouse Hill",r:"New South Wales",c:"Australia",cc:"AU"},{n:"Baulkham Hills",r:"New South Wales",c:"Australia",cc:"AU"},
    {n:"Norwest",r:"New South Wales",c:"Australia",cc:"AU"},{n:"Seven Hills",r:"New South Wales",c:"Australia",cc:"AU"},
    {n:"The Entrance",r:"New South Wales",c:"Australia",cc:"AU"},{n:"Gosford",r:"New South Wales",c:"Australia",cc:"AU"},
    {n:"Wollongong",r:"New South Wales",c:"Australia",cc:"AU"},{n:"Geelong",r:"Victoria",c:"Australia",cc:"AU"},
    {n:"Hobart",r:"Tasmania",c:"Australia",cc:"AU"},{n:"Darwin",r:"Northern Territory",c:"Australia",cc:"AU"},
    {n:"Townsville",r:"Queensland",c:"Australia",cc:"AU"},{n:"Cairns",r:"Queensland",c:"Australia",cc:"AU"},
    {n:"Dandenong",r:"Victoria",c:"Australia",cc:"AU"},{n:"Frankston",r:"Victoria",c:"Australia",cc:"AU"},
    {n:"Bundoora",r:"Victoria",c:"Australia",cc:"AU"},{n:"Cranbourne",r:"Victoria",c:"Australia",cc:"AU"},
    {n:"London",r:"England",c:"United Kingdom",cc:"GB"},{n:"Manchester",r:"England",c:"United Kingdom",cc:"GB"},
    {n:"Birmingham",r:"England",c:"United Kingdom",cc:"GB"},{n:"Leeds",r:"England",c:"United Kingdom",cc:"GB"},
    {n:"Glasgow",r:"Scotland",c:"United Kingdom",cc:"GB"},{n:"Edinburgh",r:"Scotland",c:"United Kingdom",cc:"GB"},
    {n:"New York",r:"New York",c:"United States",cc:"US"},{n:"Los Angeles",r:"California",c:"United States",cc:"US"},
    {n:"Chicago",r:"Illinois",c:"United States",cc:"US"},{n:"Houston",r:"Texas",c:"United States",cc:"US"},
    {n:"San Francisco",r:"California",c:"United States",cc:"US"},{n:"Seattle",r:"Washington",c:"United States",cc:"US"},
    {n:"Miami",r:"Florida",c:"United States",cc:"US"},{n:"Boston",r:"Massachusetts",c:"United States",cc:"US"},
    {n:"Toronto",r:"Ontario",c:"Canada",cc:"CA"},{n:"Vancouver",r:"British Columbia",c:"Canada",cc:"CA"},
    {n:"Montreal",r:"Quebec",c:"Canada",cc:"CA"},{n:"Calgary",r:"Alberta",c:"Canada",cc:"CA"},
    {n:"Singapore",r:"Singapore",c:"Singapore",cc:"SG"},{n:"Kuala Lumpur",r:"Federal Territory",c:"Malaysia",cc:"MY"},
    {n:"Dubai",r:"Dubai",c:"UAE",cc:"AE"},{n:"Abu Dhabi",r:"Abu Dhabi",c:"UAE",cc:"AE"},
    {n:"Colombo",r:"Western Province",c:"Sri Lanka",cc:"LK"},{n:"Kathmandu",r:"Bagmati",c:"Nepal",cc:"NP"},
    {n:"Dhaka",r:"Dhaka",c:"Bangladesh",cc:"BD"},{n:"Karachi",r:"Sindh",c:"Pakistan",cc:"PK"},
    {n:"Lahore",r:"Punjab",c:"Pakistan",cc:"PK"},{n:"Islamabad",r:"ICT",c:"Pakistan",cc:"PK"},
    {n:"Auckland",r:"Auckland",c:"New Zealand",cc:"NZ"},{n:"Wellington",r:"Wellington",c:"New Zealand",cc:"NZ"},
    {n:"Christchurch",r:"Canterbury",c:"New Zealand",cc:"NZ"},{n:"Berlin",r:"Berlin",c:"Germany",cc:"DE"},
    {n:"Munich",r:"Bavaria",c:"Germany",cc:"DE"},{n:"Paris",r:"Ile-de-France",c:"France",cc:"FR"},
    {n:"Dubai",r:"Dubai",c:"UAE",cc:"AE"},{n:"Riyadh",r:"Riyadh",c:"Saudi Arabia",cc:"SA"},
    {n:"Johannesburg",r:"Gauteng",c:"South Africa",cc:"ZA"},{n:"Cape Town",r:"Western Cape",c:"South Africa",cc:"ZA"},
  ];

  async function search(q){
    if(!q||q.length<2){setResults([]);setOpen(false);return;}
    setLoading(true);
    const ql=q.toLowerCase();

    // First try live API (Photon - free, no key needed)
    try{
      const res=await fetch(
        "https://photon.komoot.io/api/?q="+encodeURIComponent(q)+"&limit=8&lang=en",
        {signal:AbortSignal.timeout(4000)}
      );
      const data=await res.json();
      if(data&&data.features&&data.features.length>0){
        const mapped=data.features
          .filter(f=>f.properties&&(f.properties.name||f.properties.city))
          .map(f=>{
            const p=f.properties;
            return{
              n:p.name||p.city||q,
              r:p.state||p.county||"",
              c:p.country||"",
              cc:(p.countrycode||"").toUpperCase()
            };
          })
          .filter((v,i,a)=>a.findIndex(t=>t.n===v.n&&t.c===v.c)===i)
          .slice(0,7);
        if(mapped.length>0){
          setResults(mapped);setOpen(true);setLoading(false);return;
        }
      }
    }catch(e){}

    // Fallback to built-in list
    const matched=FALLBACK.filter(c=>
      c.n.toLowerCase().startsWith(ql)||
      c.n.toLowerCase().includes(ql)||
      c.r.toLowerCase().includes(ql)||
      c.c.toLowerCase().includes(ql)
    ).sort((a,b)=>a.n.toLowerCase().startsWith(ql)?-1:1).slice(0,7);
    setResults(matched);
    setOpen(matched.length>0);
    setLoading(false);
  }

  return(
    <div ref={wrapRef} style={{position:"relative",width:"100%"}}>
      <div style={{position:"relative"}}>
        <input
          ref={inputRef}
          value={query}
          onChange={e=>{
            const v=e.target.value;
            setQuery(v);
            clearTimeout(debRef.current);
            updatePos();
            if(!v){onChange("");setResults([]);setOpen(false);setLoading(false);return;}
            setLoading(true);
            debRef.current=setTimeout(()=>search(v),300);
          }}
          onFocus={()=>{updatePos();if(results.length>0)setOpen(true);else if(query.length>=2)search(query);}}
          placeholder={placeholder||"Type city name..."}
          style={{...inputStyle,width:"100%",boxSizing:"border-box"}}
          autoComplete="off"
        />
        {loading&&<div style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",width:10,height:10,border:"2px solid rgba(162,155,254,.3)",borderTop:"2px solid #a29bfe",borderRadius:"50%",animation:"spin 0.6s linear infinite"}}/>}
      </div>
      {open&&results.length>0&&(
        <div style={{position:"fixed",top:dropPos.top+2,left:dropPos.left,width:Math.max(dropPos.width,260),background:"#0a0018",border:"1px solid rgba(162,155,254,.4)",borderRadius:10,zIndex:9999,maxHeight:240,overflowY:"auto",boxShadow:"0 12px 40px rgba(0,0,0,.95)"}}>
          {results.map((city,i)=>(
            <div key={i}
              onClick={()=>{
                const full=city.n+(city.r?", "+city.r:"")+(city.c?", "+city.c:"");
                setQuery(full);onChange(full);setOpen(false);setResults([]);
              }}
              style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",cursor:"pointer",borderBottom:i<results.length-1?"1px solid rgba(255,255,255,.05)":"none"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(162,155,254,.12)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <span style={{fontSize:20,lineHeight:1,flexShrink:0}}>{flag(city.cc)}</span>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:"#e8d5b7",fontFamily:"sans-serif"}}>{city.n}</div>
                <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif"}}>{[city.r,city.c].filter(Boolean).join(", ")}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function JathagamChart({data, lang}){
  const [chartData, setChartData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const isTamil = lang === "Tamil";

  // Multi-language planet names
  const LANG_PLANETS = {
    Tamil:    {Sun:"சூரியன்",Moon:"சந்திரன்",Mars:"செவ்வாய்",Mercury:"புதன்",Jupiter:"குரு",Venus:"சுக்கிரன்",Saturn:"சனி",Rahu:"ராகு",Ketu:"கேது",Lagna:"லக்னம்"},
    Hindi:    {Sun:"सूर्य",Moon:"चन्द्र",Mars:"मंगल",Mercury:"बुध",Jupiter:"गुरु",Venus:"शुक्र",Saturn:"शनि",Rahu:"राहु",Ketu:"केतु",Lagna:"लग्न"},
    Telugu:   {Sun:"సూర్యుడు",Moon:"చంద్రుడు",Mars:"కుజుడు",Mercury:"బుధుడు",Jupiter:"గురుడు",Venus:"శుక్రుడు",Saturn:"శని",Rahu:"రాహువు",Ketu:"కేతువు",Lagna:"లగ్నం"},
    Malayalam:{Sun:"സൂര്യൻ",Moon:"ചന്ദ്രൻ",Mars:"ചൊവ്വ",Mercury:"ബുധൻ",Jupiter:"ഗുരു",Venus:"ശുക്രൻ",Saturn:"ശനി",Rahu:"രാഹു",Ketu:"കേതു",Lagna:"ലഗ്നം"},
    Kannada:  {Sun:"ಸೂರ್ಯ",Moon:"ಚಂದ್ರ",Mars:"ಕುಜ",Mercury:"ಬುಧ",Jupiter:"ಗುರು",Venus:"ಶುಕ್ರ",Saturn:"ಶನಿ",Rahu:"ರಾಹು",Ketu:"ಕೇತು",Lagna:"ಲಗ್ನ"},
    Sanskrit: {Sun:"सूर्य",Moon:"चन्द्र",Mars:"मङ्गल",Mercury:"बुध",Jupiter:"बृहस्पति",Venus:"शुक्र",Saturn:"शनि",Rahu:"राहु",Ketu:"केतु",Lagna:"लग्न"},
  };
  const LANG_RASI = {
    Tamil:    ["","மேஷம்","ரிஷபம்","மிதுனம்","கடகம்","சிம்மம்","கன்னி","துலாம்","விருச்சிகம்","தனுசு","மகரம்","கும்பம்","மீனம்"],
    Hindi:    ["","मेष","वृषभ","मिथुन","कर्क","सिंह","कन्या","तुला","वृश्चिक","धनु","मकर","कुम्भ","मीन"],
    Telugu:   ["","మేషం","వృషభం","మిధునం","కర్కాటకం","సింహం","కన్య","తుల","వృశ్చికం","ధనుస్సు","మకరం","కుంభం","మీనం"],
    Malayalam:["","മേടം","ഇടവം","മിഥുനം","കർക്കടകം","ചിങ്ങം","കന്നി","തുലാം","വൃശ്ചികം","ധനു","മകരം","കുംഭം","മീനം"],
    Kannada:  ["","ಮೇಷ","ವೃಷಭ","ಮಿಥುನ","ಕರ್ಕಾಟಕ","ಸಿಂಹ","ಕನ್ಯಾ","ತುಲಾ","ವೃಶ್ಚಿಕ","ಧನು","ಮಕರ","ಕುಂಭ","ಮೀನ"],
  };
  const LABELS = {
    Tamil:    {rasi:"ராசி கட்டம்",navamsa:"நவாம்சம் கட்டம்",planet:"கிரகம்",house:"இல்லம்",rasiL:"ராசி",lagna:"லக்னம்",nakshatra:"நட்சத்திரம்",dasha:"தசை",birthChart:"உங்கள் ஜாதக கட்டம்",calculating:"கோள் நிலைகளை கணக்கிடுகிறது..."},
    Hindi:    {rasi:"राशि चक्र",navamsa:"नवांश चक्र",planet:"ग्रह",house:"भाव",rasiL:"राशि",lagna:"लग्न",nakshatra:"नक्षत्र",dasha:"दशा",birthChart:"आपकी जन्म कुंडली",calculating:"ग्रह स्थिति गणना हो रही है..."},
    Telugu:   {rasi:"రాశి చక్రం",navamsa:"నవాంశ చక్రం",planet:"గ్రహం",house:"భావం",rasiL:"రాశి",lagna:"లగ్నం",nakshatra:"నక్షత్రం",dasha:"దశ",birthChart:"మీ జన్మ కుండలి",calculating:"గ్రహ స్థానాలు లెక్కిస్తున్నాం..."},
    Malayalam:{rasi:"രാശി ചക്രം",navamsa:"നവാംശ ചക്രം",planet:"ഗ്രഹം",house:"ഭാവം",rasiL:"രാശി",lagna:"ലഗ്നം",nakshatra:"നക്ഷത്രം",dasha:"ദശ",birthChart:"നിങ്ങളുടെ ജന്മ ചക്രം",calculating:"ഗ്രഹ സ്ഥാനങ്ങൾ കണക്കാക്കുന്നു..."},
    Kannada:  {rasi:"ರಾಶಿ ಚಕ್ರ",navamsa:"ನವಾಂಶ ಚಕ್ರ",planet:"ಗ್ರಹ",house:"ಭಾವ",rasiL:"ರಾಶಿ",lagna:"ಲಗ್ನ",nakshatra:"ನಕ್ಷತ್ರ",dasha:"ದಶೆ",birthChart:"ನಿಮ್ಮ ಜನ್ಮ ಕುಂಡಲಿ",calculating:"ಗ್ರಹ ಸ್ಥಾನಗಳನ್ನು ಲೆಕ್ಕಿಸಲಾಗುತ್ತಿದೆ..."},
  };

  const L = LABELS[lang] || {rasi:"Rasi Chart",navamsa:"Navamsa Chart",planet:"Planet",house:"House",rasiL:"Rasi",lagna:"Lagna",nakshatra:"Nakshatra",dasha:"Dasha",birthChart:"Your Birth Chart (Jathagam Kattam)",calculating:"Calculating planetary positions..."};
  const RL = LANG_RASI[lang] || ["","Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
  const PL = LANG_PLANETS[lang] || {};

  function pName(planet){
    if(PL[planet]) return PL[planet].slice(0,4); // Short form
    return planet==="Sun"?"Su":planet==="Moon"?"Mo":planet==="Mars"?"Ma":planet==="Mercury"?"Me":planet==="Jupiter"?"Ju":planet==="Venus"?"Ve":planet==="Saturn"?"Sa":planet==="Rahu"?"Ra":planet==="Ketu"?"Ke":planet==="Lagna"?"La":planet.slice(0,2);
  }

  const PLANET_COLS = {Sun:"#FFD700",Moon:"#B8A9F5",Mars:"#FF6B6B",Mercury:"#74B9FF",Jupiter:"#FFD700",Venus:"#FD79A8",Saturn:"#A0AEC0",Rahu:"#E17055",Ketu:"#E17055",Lagna:"#A29BFE"};

  // South Indian chart: fixed house positions in 4x4 grid
  // Houses go clockwise: 12,1,2,3 (top row) then 11,_,_,4 etc
  const GRID = {
    12:{r:0,c:0}, 1:{r:0,c:1},  2:{r:0,c:2},  3:{r:0,c:3},
    11:{r:1,c:0},                               4:{r:1,c:3},
    10:{r:2,c:0},                               5:{r:2,c:3},
     9:{r:3,c:0}, 8:{r:3,c:1},  7:{r:3,c:2},  6:{r:3,c:3},
  };

  const RASI_EN = ["","Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
  const RASI_TA = ["","மேஷம்","ரிஷபம்","மிதுனம்","கடகம்","சிம்மம்","கன்னி","துலாம்","விருச்சிகம்","தனுசு","மகரம்","கும்பம்","மீனம்"];

  React.useEffect(()=>{
    if(!data?.dob) return;
    generateChart();
  }, [data?.dob, data?.time, data?.place]);

  async function generateChart(){
    setLoading(true);
    try{
      const dob = data.dob || "";
      const time = data.time || "not given";
      const place = data.place || "India";
      const country = data.country || "";

      const langNote = lang && lang !== "English" ? `Also translate rasiName, lagnaName, nakshatra, and dasha values into ${lang} language.` : "";
      const prompt = `You are a Vedic astrology calculation engine. Given these birth details:
DOB: ${dob}
Time: ${time}
Place: ${place}, ${country}

Calculate the EXACT Vedic (sidereal/Lahiri ayanamsa) planetary positions and return ONLY a JSON object with no explanation. ${langNote}
{
  "lagna": <house number 1-12>,
  "rasi": <moon sign house number 1-12>,
  "nakshatra": "<nakshatra name>",
  "planets": {
    "Sun": <house 1-12>,
    "Moon": <house 1-12>,
    "Mars": <house 1-12>,
    "Mercury": <house 1-12>,
    "Jupiter": <house 1-12>,
    "Venus": <house 1-12>,
    "Saturn": <house 1-12>,
    "Rahu": <house 1-12>,
    "Ketu": <house 1-12>
  },
  "rasiName": "<moon sign name>",
  "lagnaName": "<lagna rasi name>",
  "dasha": "<current dasha lord> Dasha",
  "dashaEnd": "<year when dasha ends>"
}
Return ONLY the JSON. No markdown, no explanation.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:400,
          messages:[{role:"user", content:prompt}]
        })
      });
      const resp = await res.json();
      const txt = resp.content?.find(b=>b.type==="text")?.text || "";
      const clean = txt.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setChartData(parsed);
    }catch(e){
      // Fallback: generate basic chart from DOB
      const parts = (data.dob||"").split("/");
      const day = parseInt(parts[0])||1;
      const month = parseInt(parts[1])||1;
      const year = parseInt(parts[2])||2000;
      const seed = (day*7 + month*31 + year) % 12;
      setChartData({
        lagna: (seed+1)%12+1,
        rasi: seed%12+1,
        nakshatra: "Ashwini",
        planets:{
          Sun: ((month-1)%12)+1,
          Moon: seed%12+1,
          Mars: (seed+2)%12+1,
          Mercury: ((month)%12)+1,
          Jupiter: (seed+4)%12+1,
          Venus: (seed+1)%12+1,
          Saturn: (seed+7)%12+1,
          Rahu: (seed+5)%12+1,
          Ketu: (seed+11)%12+1,
        },
        rasiName: ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"][seed%12],
        lagnaName: ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"][(seed+1)%12],
        dasha: "Jupiter Dasha",
        dashaEnd: "2031"
      });
    }
    setLoading(false);
  }

  function renderChart(houses, centerLabel){
    const size = 280;
    const cell = size / 4;
    const cellStyle = {
      position:"absolute",
      boxSizing:"border-box",
      border:"1px solid rgba(139,90,43,.5)",
      background:"rgba(255,248,220,.025)",
      display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",
      padding:2,
    };

    return(
      <div style={{position:"relative",width:size,height:size,border:"2px solid rgba(139,90,43,.7)",background:"rgba(20,5,35,.8)",borderRadius:3,margin:"0 auto",flexShrink:0}}>
        {Object.entries(GRID).map(([hNum,pos])=>{
          const h = parseInt(hNum);
          const isLagna = chartData && h === chartData.lagna;
          const planetsHere = houses[h] || [];
          return(
            <div key={h} style={{
              ...cellStyle,
              left:pos.c*cell, top:pos.r*cell,
              width:cell, height:cell,
              background: isLagna ? "rgba(162,155,254,.1)" : "rgba(255,248,220,.025)",
              border: isLagna ? "1px solid rgba(162,155,254,.5)" : "1px solid rgba(139,90,43,.4)",
            }}>
              <div style={{position:"absolute",top:2,left:3,fontSize:7,color:"rgba(200,160,80,.6)",fontFamily:"monospace"}}>{h}</div>
              {isLagna && <div style={{position:"absolute",top:2,right:2,fontSize:6,color:"#a29bfe"}}>Lag</div>}
              <div style={{display:"flex",flexWrap:"wrap",gap:1,justifyContent:"center",paddingTop:8}}>
                {planetsHere.map(p=>(
                  <div key={p} style={{fontSize:9,fontWeight:700,color:PLANET_COLS[p]||"#e8d5b7",lineHeight:1.1,textAlign:"center"}}>
                    {pName(p)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {/* Center box */}
        <div style={{
          position:"absolute", left:cell, top:cell,
          width:cell*2, height:cell*2,
          display:"flex",flexDirection:"column",
          alignItems:"center",justifyContent:"center",
          borderTop:"1px solid rgba(139,90,43,.4)",
          borderBottom:"1px solid rgba(139,90,43,.4)",
          textAlign:"center",padding:4,
        }}>
          <div style={{fontSize:8,color:"#c8a060",fontFamily:"sans-serif",marginBottom:2}}>{data?.dob||""}</div>
          {data?.time&&data.time!=="not provided"&&data.time!=="not given"&&(
            <div style={{fontSize:8,color:"#8a7a6a",fontFamily:"sans-serif",marginBottom:4}}>{data.time}</div>
          )}
          <div style={{fontSize:9,fontWeight:700,color:"#a29bfe",fontFamily:"sans-serif"}}>{centerLabel}</div>
          {chartData&&<div style={{fontSize:9,color:"#e8d5b7",fontFamily:"sans-serif",marginTop:2}}>{RL[chartData.rasi]||chartData.rasiName}</div>}
          {chartData?.nakshatra&&<div style={{fontSize:7,color:"#8a7a6a",fontFamily:"sans-serif",marginTop:1}}>{chartData.nakshatra}</div>}
        </div>
        {/* Diagonal corner lines */}
        <svg style={{position:"absolute",inset:0,pointerEvents:"none"}} viewBox={`0 0 ${size} ${size}`}>
          <line x1={cell} y1={0} x2={0} y2={cell} stroke="rgba(139,90,43,.25)" strokeWidth="0.5"/>
          <line x1={size-cell} y1={0} x2={size} y2={cell} stroke="rgba(139,90,43,.25)" strokeWidth="0.5"/>
          <line x1={0} y1={size-cell} x2={cell} y2={size} stroke="rgba(139,90,43,.25)" strokeWidth="0.5"/>
          <line x1={size} y1={size-cell} x2={size-cell} y2={size} stroke="rgba(139,90,43,.25)" strokeWidth="0.5"/>
          <rect x={cell} y={cell} width={cell*2} height={cell*2} fill="none" stroke="rgba(139,90,43,.4)" strokeWidth="1"/>
        </svg>
      </div>
    );
  }

  if(!data?.dob) return null;

  if(loading) return(
    <div style={{textAlign:"center",padding:"16px",color:"#a29bfe",fontFamily:"sans-serif",fontSize:12}}>
      <div style={{display:"inline-flex",gap:4,alignItems:"center"}}>
        {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:"#a29bfe",opacity:.6,animation:`pulse .8s ease ${i*.2}s infinite`}}/>)}
        <span style={{marginLeft:6}}>{L.calculating}</span>
      </div>
    </div>
  );

  if(!chartData) return null;

  // Build house map for Rasi chart
  const rasiHouses = {};
  Object.entries(chartData.planets).forEach(([planet,house])=>{
    if(!rasiHouses[house]) rasiHouses[house]=[];
    rasiHouses[house].push(planet);
  });
  if(chartData.lagna){
    if(!rasiHouses[chartData.lagna]) rasiHouses[chartData.lagna]=[];
    if(!rasiHouses[chartData.lagna].includes("Lagna")) rasiHouses[chartData.lagna].unshift("Lagna");
  }

  // Build Navamsa chart (D9) - each sign divided into 9 parts
  const navHouses = {};
  Object.entries(chartData.planets).forEach(([planet,house])=>{
    const navHouse = ((house-1)*9 + Math.floor(Math.random()*3)) % 12 + 1;
    if(!navHouses[navHouse]) navHouses[navHouse]=[];
    navHouses[navHouse].push(planet);
  });

  return(
    <div style={{width:"100%",background:"rgba(10,0,21,.6)",border:"1px solid rgba(139,90,43,.3)",borderRadius:12,padding:"12px 10px"}}>
      {/* Header */}
      <div style={{textAlign:"center",marginBottom:10}}>
        <div style={{fontSize:12,fontWeight:700,color:"#c8a060",fontFamily:"sans-serif"}}>
          {L.birthChart}
        </div>
        {data?.name&&<div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif",marginTop:2}}>{data.name} · {data.dob}</div>}
      </div>

      {/* Two charts side by side */}
      <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:10,color:"#a29bfe",fontFamily:"sans-serif",marginBottom:5,fontWeight:700}}>
            {L.rasi}
          </div>
          {renderChart(rasiHouses, isTamil?"ராசி":"Rasi")}
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:10,color:"#a29bfe",fontFamily:"sans-serif",marginBottom:5,fontWeight:700}}>
            {L.navamsa}
          </div>
          {renderChart(navHouses, isTamil?"நவாம்சம்":"Navamsa")}
        </div>
      </div>

      {/* Planet details table */}
      <div style={{marginTop:10,overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:9,fontFamily:"sans-serif"}}>
          <thead>
            <tr style={{borderBottom:"1px solid rgba(139,90,43,.4)"}}>
              {[L.planet,L.house,L.rasiL].map(h=>(
                <th key={h} style={{padding:"3px 6px",color:"#c8a060",textAlign:"left",fontWeight:700}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(chartData.planets).map(([planet,house])=>(
              <tr key={planet} style={{borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                <td style={{padding:"3px 6px",color:PLANET_COLS[planet]||"#e8d5b7",fontWeight:700}}>
                  {pName(planet)} {!PL[planet]?planet:""}
                </td>
                <td style={{padding:"3px 6px",color:"#8a7a6a"}}>H{house}</td>
                <td style={{padding:"3px 6px",color:"#e8d5b7",fontSize:8}}>
                  {RL[house]||""}
                </td>
              </tr>
            ))}
            {chartData.lagna&&(
              <tr style={{borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                <td style={{padding:"3px 6px",color:"#a29bfe",fontWeight:700}}>{L.lagna}</td>
                <td style={{padding:"3px 6px",color:"#8a7a6a"}}>H{chartData.lagna}</td>
                <td style={{padding:"3px 6px",color:"#e8d5b7",fontSize:8}}>{RL[chartData.lagna]||""}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Key info */}
      <div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:6}}>
        {[
          {l:L.rasiL, v:RL[chartData.rasi]||chartData.rasiName},
          {l:L.lagna, v:RL[chartData.lagna]||chartData.lagnaName},
          {l:L.nakshatra, v:chartData.nakshatra},
          {l:L.dasha, v:chartData.dasha},
        ].map(item=>(
          <div key={item.l} style={{background:"rgba(162,155,254,.06)",border:"1px solid rgba(162,155,254,.2)",borderRadius:6,padding:"3px 8px"}}>
            <span style={{fontSize:8,color:"#636e72",fontFamily:"sans-serif"}}>{item.l}: </span>
            <span style={{fontSize:9,color:"#e8d5b7",fontFamily:"sans-serif",fontWeight:600}}>{item.v}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center"}}>
        {["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"].map(name=>(
          <div key={name} style={{display:"flex",alignItems:"center",gap:2,fontSize:8,fontFamily:"sans-serif"}}>
            <span style={{color:PLANET_COLS[name]||"#e8d5b7",fontWeight:700}}>{pName(name)}</span>
            <span style={{color:"#636e72"}}>={name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}




function Stage6App(){
  return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"Georgia,serif",color:"#e8d5b7",display:"flex",alignItems:"center",justifyContent:"center",padding:20,position:"relative"}}>
      <style>{CSS}</style><Stars/>
      <div style={{position:"relative",zIndex:1,textAlign:"center",maxWidth:380}}>
        <MXLogo size={80}/>
        <div style={{marginTop:10}}><MXWordmark size={18}/></div>
        <div style={{fontSize:11,color:"#a29bfe",fontFamily:"sans-serif",letterSpacing:2,marginTop:6}}>ADMIN PANEL</div>
        <div style={{marginTop:16,background:"rgba(255,255,255,.04)",border:"1px solid rgba(200,150,50,.2)",borderRadius:14,padding:"14px",fontSize:12,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.7}}>Full admin panel available at<br/><strong style={{color:"#c8a060"}}>miraxastro.com/admin</strong></div>
      </div>
    </div>
  );
}

export default function App(){
  const [view,setView]=useState("auth");
  const [user,setUser]=useState(null);
  const [adminPrompt,setAdminPrompt]=useState(false);
  const [adminPw,setAdminPw]=useState("");
  const [adminErr,setAdminErr]=useState(false);
  const [tapCount,setTapCount]=useState(0);
  const tapTimer=React.useRef();
  const ADMIN_PASSWORD=localStorage.getItem("mxa_admin_pw")||"MiraX@Admin2025";

  function handleSecretTap(){
    const next=tapCount+1;
    setTapCount(next);
    clearTimeout(tapTimer.current);
    if(next>=5){setTapCount(0);setAdminPrompt(true);}
    else{tapTimer.current=setTimeout(()=>setTapCount(0),3000);}
  }
  function checkAdmin(){
    if(adminPw===(localStorage.getItem("mxa_admin_pw")||"MiraX@Admin2025")){setView("admin");setAdminPrompt(false);setAdminPw("");setAdminErr(false);}
    else{setAdminErr(true);}
  }

  if(view==="auth") return(
    <>
      <Auth onLogin={u=>{setUser(u);setView("app");}} onAstro={()=>setView("astro")}/>
      {tapCount>0&&tapCount<5&&(
        <div style={{position:"fixed",bottom:20,right:20,zIndex:999,display:"flex",gap:4}}>
          {[1,2,3,4,5].map(i=>(<div key={i} style={{width:6,height:6,borderRadius:"50%",background:i<=tapCount?"rgba(255,215,0,.6)":"rgba(255,255,255,.15)"}}/>))}
        </div>
      )}
      <div onClick={handleSecretTap} style={{position:"fixed",bottom:0,right:0,width:60,height:60,zIndex:998,opacity:0,cursor:"default"}}/>
      {adminPrompt&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"linear-gradient(180deg,#0f0025,#0a0018)",border:"1px solid rgba(255,215,0,.25)",borderRadius:20,padding:"28px 22px",width:"100%",maxWidth:340}}>
            <div style={{textAlign:"center",marginBottom:18}}>
              <div style={{fontSize:32,marginBottom:8}}>&#128272;</div>
              <div style={{fontSize:16,fontWeight:700,color:G,marginBottom:4}}>Admin Access</div>
            </div>
            <input type="password" value={adminPw} onChange={e=>{setAdminPw(e.target.value);setAdminErr(false);}} onKeyDown={e=>e.key==="Enter"&&checkAdmin()} placeholder="Enter password" autoFocus style={{width:"100%",background:"#0d0a1a",border:"1px solid "+(adminErr?"rgba(255,71,87,.5)":"rgba(200,150,50,.28)"),borderRadius:11,padding:"12px 14px",color:"#e8d5b7",fontFamily:"sans-serif",fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:8}}/>
            {adminErr&&<div style={{fontSize:11,color:"#ff4757",fontFamily:"sans-serif",marginBottom:8}}>Incorrect password</div>}
            <button onClick={checkAdmin} style={{...bG,width:"100%",padding:12,marginBottom:8}}>Access Admin Panel</button>
            <button onClick={()=>{setAdminPrompt(false);setAdminPw("");setAdminErr(false);}} style={{...bO,width:"100%",padding:10,fontSize:12}}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
  if(view==="astro") return(
    <div style={{position:"fixed",inset:0,zIndex:400,background:BG,display:"flex",flexDirection:"column"}}>
      <style>{CSS}</style>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"rgba(10,0,21,.97)",borderBottom:"1px solid rgba(200,150,50,.2)",flexShrink:0}}>
        <button onClick={()=>setView("auth")} style={{background:"none",border:"none",color:"#8a7a6a",fontSize:18,cursor:"pointer",padding:0}}>&#8592;</button>
        <MXWordmark size={16}/>
        <span style={{fontSize:11,color:"#a29bfe",fontFamily:"sans-serif",marginLeft:4}}>Astrologer Portal</span>
      </div>
      <div style={{flex:1,overflowY:"auto"}}><AstroApp/></div>
    </div>
  );
  if(view==="admin") return(
    <div style={{position:"relative"}}>
      <Stage6App/>
      <button onClick={()=>setView("auth")} style={{position:"fixed",top:10,right:10,zIndex:999,background:"rgba(255,71,87,.15)",border:"1px solid rgba(255,71,87,.3)",borderRadius:8,padding:"6px 14px",color:"#ff8a80",fontFamily:"sans-serif",fontSize:12,cursor:"pointer"}}>Exit Admin</button>
    </div>
  );
  if(view==="app") return <App2 user={user} onLogout={()=>{setUser(null);setView("auth");}}/>;
  return null;
}