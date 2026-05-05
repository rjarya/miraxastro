import React, { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// MIRAXASTRO · LIFE MODULES
// Exclusive feature — Modern life guidance powered by Vedic AI
// 5 specialist modules + custom topic request
// ═══════════════════════════════════════════════════════════════

const G="#ffd700";
const BG="linear-gradient(135deg,#0a0015 0%,#0d0028 40%,#010a1a 100%)";

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
@keyframes floatIn{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes slideUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
input::placeholder{color:#4a3a2a}
input:focus{border-color:rgba(255,215,0,.5)!important;outline:none!important}
button:disabled{opacity:.4;cursor:not-allowed}
.mod:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.4);transition:all .25s}
.pill:hover{opacity:.8;transition:all .15s}
.cA{background:rgba(200,150,50,.1);border:1px solid rgba(200,150,50,.18);border-radius:14px 14px 14px 3px;padding:10px 13px;max-width:85%;font-family:sans-serif;font-size:13px;color:#e8d5b7;margin:5px 0;animation:floatIn .3s ease;line-height:1.6}
.cU{background:linear-gradient(135deg,#1a0f35,#130d2e);border:1px solid rgba(162,155,254,.25);color:#e8d5b7;border-radius:14px 14px 3px 14px;padding:10px 13px;max-width:85%;font-family:sans-serif;font-size:13px;margin:5px 0 5px auto;animation:floatIn .3s ease;line-height:1.6}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(200,150,50,.3);border-radius:4px}
`;

const cd={background:"rgba(255,255,255,.04)",border:"1px solid rgba(200,150,50,.18)",borderRadius:14,padding:15,marginBottom:12};
const ip={width:"100%",background:"#0d0a1a",border:"1px solid rgba(200,150,50,.28)",borderRadius:11,padding:"12px 13px",color:"#e8d5b7",fontFamily:"sans-serif",fontSize:14,outline:"none",boxSizing:"border-box"};
const bG={background:"linear-gradient(135deg,#c8a000,#ffd700)",color:"#0a0015",border:"none",borderRadius:10,padding:"10px 18px",fontWeight:700,fontFamily:"sans-serif",fontSize:13,cursor:"pointer"};
const bO={background:"transparent",color:G,border:"1px solid rgba(255,215,0,.4)",borderRadius:10,padding:"8px 14px",fontFamily:"sans-serif",fontSize:12,cursor:"pointer"};

const MODULES=[
  {id:"property",icon:"🏠",title:"Property & Home",tagline:"Auspicious timing for buying, selling and moving",color:"#a29bfe",bg:"rgba(162,155,254,.08)",border:"rgba(162,155,254,.3)",
   intro:"The cosmos has profound influence on property decisions. Let me reveal the planetary windows that favour property acquisition, the doshas to avoid, and the most auspicious dates for your move based on your birth chart.",
   questions:["Best time to buy a property","Should I sell my home now?","Auspicious date to move in","Is this property right for me?","Property investment timing"],
   system:"You are a specialist MiraXAstro Vedic astrologer focusing exclusively on property, home, and real estate timing. You combine Vastu Shastra, planetary transits (especially Jupiter, Saturn and Venus) with practical modern property market guidance. Give specific, actionable advice. Keep responses warm, wise, and practical — 3-5 sentences. Never mention AI, Claude, or any technology. Reference specific planets and Vedic concepts naturally."},

  {id:"career",icon:"💼",title:"Career & Job",tagline:"Planetary timing for career decisions and interviews",color:"#ffd700",bg:"rgba(255,215,0,.08)",border:"rgba(255,215,0,.3)",
   intro:"Your career destiny is written in the stars. The 10th house, Saturn's position, and Jupiter's transit reveal the ideal timing for job changes, interviews, business launches and promotions — let me guide you through what the planets say.",
   questions:["Best days for job interviews","Should I change careers now?","When to ask for a promotion","Starting my own business","Is this job offer right for me?"],
   system:"You are a specialist MiraXAstro Vedic astrologer focusing exclusively on career, job, business and professional life timing. Reference the 10th house, Saturn, Jupiter and the Sun naturally. Give specific Vedic timing guidance that is actionable. Be warm, wise and encouraging. 3-5 sentences. Never mention AI or technology."},

  {id:"immigration",icon:"✈️",title:"Immigration & Visa",tagline:"Vedic guidance for visa timing and new country moves",color:"#00cec9",bg:"rgba(0,206,201,.08)",border:"rgba(0,206,201,.3)",
   intro:"Moving to a new country is one of life's biggest decisions. The 9th house governs long journeys and foreign lands, while Rahu represents transformation and crossing boundaries. Let me reveal what the planets say about your move.",
   questions:["Best time to apply for visa","Is this the right country for me?","When should I move abroad?","Citizenship application timing","Will my immigration succeed?"],
   system:"You are a specialist MiraXAstro Vedic astrologer focusing on immigration, relocation, visa applications and moving abroad. Reference the 9th house, Rahu, Jupiter and foreign travel yogas naturally. Many of your clients are Indian diaspora in Australia, UK, USA and Canada. Be warm, specific and encouraging. 3-5 sentences. Never mention AI."},

  {id:"investment",icon:"📈",title:"Investment & Wealth",tagline:"Planetary windows for financial decisions",color:"#00b894",bg:"rgba(0,184,148,.08)",border:"rgba(0,184,148,.3)",
   intro:"Wealth creation is deeply influenced by the 2nd and 11th houses, Venus and Jupiter transits. The planets can reveal ideal windows for investment, periods of financial gain, and times to exercise caution with money.",
   questions:["Best months to invest","When is property vs shares better?","Is now a good time to invest?","Starting a business timing","When will my finances improve?"],
   system:"You are a specialist MiraXAstro Vedic astrologer focusing on wealth, investment, financial decisions and money timing. Reference the 2nd house, 11th house, Jupiter, Venus and Lakshmi yogas naturally. Give specific, actionable Vedic timing guidance. Be warm, wise and practical. 3-5 sentences. Never mention AI or technology."},

  {id:"fertility",icon:"👶",title:"Fertility & Family",tagline:"IVF timing, conception windows and family planning",color:"#fd79a8",bg:"rgba(253,121,168,.08)",border:"rgba(253,121,168,.3)",
   intro:"The blessing of a child is the most sacred of life's milestones. The 5th house governs children and creation, while the Moon, Jupiter and Venus reveal fertile windows and auspicious conception timing according to Vedic wisdom.",
   questions:["Best months for conception","IVF timing guidance","Auspicious time for pregnancy","Will I have children?","Family expansion timing"],
   system:"You are a specialist MiraXAstro Vedic astrologer focusing on fertility, conception, IVF timing, pregnancy and family planning. Reference the 5th house, Moon, Jupiter, Venus and Putra yogas naturally. Be compassionate, warm and sensitive — many clients asking these questions carry emotional weight. Give gentle, specific Vedic guidance. 3-5 sentences. Never mention AI."},

  {id:"custom",icon:"✨",title:"Your Life Topic",tagline:"Ask about any life situation — personalised guidance",color:"#e8d5b7",bg:"rgba(232,213,183,.06)",border:"rgba(232,213,183,.25)",
   intro:"Every life is unique and the cosmos has personalised guidance for every situation. Whether it is relationships, health, education, travel or any other life matter — ask freely and I will reveal what the planets say for you.",
   questions:["Relationship compatibility","Health and wellness timing","Education and study timing","Travel auspicious dates","Spiritual growth guidance"],
   system:"You are a specialist MiraXAstro Vedic astrologer providing personalised guidance on any life topic. Use relevant Vedic concepts, houses and planets naturally depending on the topic asked. Be warm, wise, specific and encouraging. 3-5 sentences. Never mention AI or technology. Always end with encouragement."},
];

function Stars(){
  const p=Array.from({length:50},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,r:Math.random()*1.6+.4,d:Math.random()*4,dur:Math.random()*3+2}));
  return(
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
      <svg width="100%" height="100%" style={{position:"absolute"}}>
        {p.map(x=>(
          <circle key={x.id} cx={x.x+"%"} cy={x.y+"%"} r={x.r} fill="white">
            <animate attributeName="opacity" values=".03;.7;.03" dur={x.dur+"s"} begin={x.d+"s"} repeatCount="indefinite"/>
          </circle>
        ))}
      </svg>
    </div>
  );
}

function Sp({size=14,color=G}){
  return <div style={{width:size,height:size,border:"2px solid "+color+"22",borderTop:"2px solid "+color,borderRadius:"50%",animation:"spin .8s linear infinite",flexShrink:0}}/>;
}

async function askAI(question,mod,history,setChat,setTyping){
  setTyping(true);
  try{
    const msgs=[...history.map(m=>({role:m.f==="u"?"user":"assistant",content:m.t})),{role:"user",content:question}];
    const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:450,system:mod.system,messages:msgs})});
    const data=await res.json();
    const reply=data.content?.find(b=>b.type==="text")?.text||"The cosmic energies need a moment. Please ask again. 🙏";
    setChat(p=>[...p,{f:"a",t:reply}]);
  }catch(e){
    setChat(p=>[...p,{f:"a",t:"The cosmic connection is momentarily interrupted. Please try again. 🙏"}]);
  }
  setTyping(false);
}

// ── Module Detail Screen ──────────────────────────────────────────
function ModuleScreen({mod,onBack}){
  const [chat,setChat]=useState([]);
  const [inp,setInp]=useState("");
  const [typing,setTyping]=useState(false);
  const [customInp,setCustomInp]=useState("");

  function sendMsg(q){
    if(!q.trim())return;
    const msg=q.trim();
    setChat(p=>[...p,{f:"u",t:msg}]);
    setInp("");setCustomInp("");
    askAI(msg,mod,chat,setChat,setTyping);
  }

  return(
    <div style={{minHeight:"100vh",background:BG,display:"flex",flexDirection:"column",fontFamily:"'Playfair Display',Georgia,serif",color:"#e8d5b7",position:"relative"}}>
      <style>{CSS}</style><Stars/>
      {/* Header */}
      <div style={{position:"sticky",top:0,zIndex:100,background:"rgba(10,0,21,.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid "+mod.border,padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",height:60,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={onBack} style={{background:"none",border:"none",color:"#8a7a6a",fontSize:18,cursor:"pointer",padding:0}}>←</button>
          <div style={{fontSize:20}}>{mod.icon}</div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:mod.color,fontFamily:"sans-serif"}}>{mod.title}</div>
            <div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif"}}>MiraXAstro Specialist · Ancient Vedic AI</div>
          </div>
        </div>
        <div style={{fontSize:9,color:mod.color,fontFamily:"sans-serif",background:mod.bg,border:"1px solid "+mod.border,borderRadius:6,padding:"3px 9px",letterSpacing:1}}>✦ EXCLUSIVE</div>
      </div>

      {/* Intro + quick questions — only when no chat */}
      {chat.length===0&&(
        <div style={{padding:"16px 16px 0",position:"relative",zIndex:1}}>
          <div style={{background:"linear-gradient(135deg,"+mod.bg+",rgba(10,0,21,.85))",border:"1px solid "+mod.border,borderRadius:18,padding:"18px 16px",marginBottom:14,animation:"slideUp .4s ease"}}>
            <div style={{fontSize:10,color:mod.color,fontFamily:"sans-serif",letterSpacing:2,marginBottom:8}}>✦ {mod.title.toUpperCase()} SPECIALIST</div>
            <div style={{fontSize:13,color:"#e8d5b7",fontFamily:"sans-serif",lineHeight:1.75,marginBottom:14}}>{mod.intro}</div>
            {mod.id==="custom"?(
              <div>
                <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",marginBottom:7}}>What life situation would you like guidance on?</div>
                <input value={customInp} onChange={e=>setCustomInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg(customInp)} placeholder="e.g. Starting a business, moving country, relationship..." style={{...ip,marginBottom:8,fontSize:12}}/>
                <button style={{...bG,width:"100%",padding:11,fontSize:13,background:"linear-gradient(135deg,"+mod.color+"88,"+mod.color+")"}} onClick={()=>sendMsg(customInp)} disabled={!customInp.trim()}>Ask the Stars →</button>
              </div>
            ):(
              <div>
                <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",marginBottom:8}}>Common questions — tap to ask instantly:</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {mod.questions.map(q=>(
                    <div key={q} className="pill" onClick={()=>sendMsg(q)} style={{padding:"7px 13px",borderRadius:18,border:"1px solid "+mod.border,background:mod.bg,fontSize:11,fontFamily:"sans-serif",color:mod.color,cursor:"pointer"}}>
                      {q}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat messages */}
      <div style={{flex:1,overflowY:"auto",padding:"8px 16px 12px",display:"flex",flexDirection:"column",position:"relative",zIndex:1}}>
        {chat.map((m,i)=>(
          <div key={i} className={m.f==="a"?"cA":"cU"} style={m.f==="a"?{borderColor:mod.border}:{}}>{m.t}</div>
        ))}
        {typing&&(
          <div className="cA" style={{display:"flex",alignItems:"center",gap:7,borderColor:mod.border}}>
            <div style={{display:"flex",gap:3}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:mod.color,opacity:.7,animation:"pulse 1s ease "+(i*.2)+"s infinite"}}/>)}</div>
            <span style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif"}}>consulting the cosmic energies...</span>
          </div>
        )}
        {/* CTA after 2 exchanges */}
        {chat.length>=4&&(
          <div style={{...cd,background:"linear-gradient(135deg,"+mod.bg+",rgba(10,0,21,.9))",border:"1px solid "+mod.border,marginTop:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.5}}>Want a deeper personal reading?<br/><span style={{color:mod.color}}>Book a specialist astrologer</span></div>
            <button style={{...bG,fontSize:11,padding:"7px 12px",background:"linear-gradient(135deg,"+mod.color+"99,"+mod.color+")"}}>Book →</button>
          </div>
        )}
      </div>

      {/* Input bar */}
      {(chat.length>0||mod.id!=="custom")&&(
        <div style={{padding:"9px 14px 20px",borderTop:"1px solid "+mod.border,display:"flex",gap:8,background:"rgba(10,0,21,.97)",flexShrink:0,position:"relative",zIndex:1}}>
          <input
            style={{...ip,flex:1,fontSize:13,borderColor:mod.border.replace(".3","0.28")}}
            value={inp}
            onChange={e=>setInp(e.target.value)}
            placeholder={"Ask about "+mod.title.toLowerCase()+"…"}
            onKeyDown={e=>e.key==="Enter"&&sendMsg(inp)}
          />
          <button
            disabled={!inp.trim()||typing}
            style={{...bG,padding:"10px 14px",background:"linear-gradient(135deg,"+mod.color+"99,"+mod.color+")",color:"#0a0015"}}
            onClick={()=>sendMsg(inp)}
          >
            {typing?<Sp size={14} color="#0a0015"/>:"→"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Landing / Module Grid ─────────────────────────────────────────
function Landing(){
  const [activeModule,setActiveModule]=useState(null);

  if(activeModule) return <ModuleScreen mod={activeModule} onBack={()=>setActiveModule(null)}/>;

  return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"'Playfair Display',Georgia,serif",color:"#e8d5b7",position:"relative"}}>
      <style>{CSS}</style><Stars/>
      <div style={{position:"relative",zIndex:1,maxWidth:480,margin:"0 auto",padding:"28px 16px 40px"}}>
        {/* Header */}
        <div style={{textAlign:"center",marginBottom:24,animation:"floatIn .5s ease"}}>
          <div style={{fontSize:10,color:"#a29bfe",fontFamily:"sans-serif",letterSpacing:2.5,marginBottom:10}}>✦ EXCLUSIVE TO MIRAXASTRO ✦</div>
          <div style={{fontSize:26,fontWeight:700,color:"#e8d5b7",fontFamily:"Georgia,serif",marginBottom:6}}>Modern Life Guidance</div>
          <div style={{fontSize:13,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.7,maxWidth:320,margin:"0 auto"}}>Ancient Vedic wisdom applied to the decisions that matter most in your life today</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:10}}>
            <div style={{height:"0.5px",flex:1,background:"linear-gradient(90deg,transparent,rgba(162,155,254,.3))"}}/>
            <span style={{fontSize:9,color:"rgba(162,155,254,.5)",fontFamily:"sans-serif",letterSpacing:2}}>NOT AVAILABLE ANYWHERE ELSE</span>
            <div style={{height:"0.5px",flex:1,background:"linear-gradient(90deg,rgba(162,155,254,.3),transparent)"}}/>
          </div>
        </div>

        {/* Module grid */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
          {MODULES.map((m,i)=>(
            <div key={m.id} className="mod" onClick={()=>setActiveModule(m)} style={{background:"linear-gradient(145deg,"+m.bg+",rgba(10,0,21,.9))",border:"1px solid "+m.border,borderRadius:16,padding:"16px 14px",cursor:"pointer",animation:"slideUp "+(0.3+i*0.07)+"s ease",animationFillMode:"both"}}>
              <div style={{fontSize:26,marginBottom:9}}>{m.icon}</div>
              <div style={{fontSize:13,fontWeight:700,color:m.color,fontFamily:"sans-serif",marginBottom:5}}>{m.title}</div>
              <div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.5}}>{m.tagline}</div>
              <div style={{marginTop:10,fontSize:10,color:m.color,fontFamily:"sans-serif",display:"flex",alignItems:"center",gap:3}}>Ask now <span style={{fontSize:12}}>→</span></div>
            </div>
          ))}
        </div>

        {/* Why exclusive badge */}
        <div style={{...cd,background:"linear-gradient(135deg,rgba(162,155,254,.08),rgba(10,0,21,.9))",border:"1px solid rgba(162,155,254,.25)",textAlign:"center",padding:"16px 14px"}}>
          <div style={{fontSize:11,color:"#a29bfe",fontFamily:"sans-serif",letterSpacing:1.5,marginBottom:8}}>WHY THIS IS DIFFERENT</div>
          <div style={{display:"flex",justifyContent:"center",gap:16,flexWrap:"wrap"}}>
            {["🎯 Life-specific","⚡ Instant AI","🌍 Diaspora-focused","🔮 Vedic-powered"].map(b=>(
              <div key={b} style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif"}}>{b}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App(){
  return <Landing/>;
}
