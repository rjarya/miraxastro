import React, { useState } from "react";

const G="#ffd700",BG="linear-gradient(135deg,#0a0015 0%,#0d0028 40%,#010a1a 100%)";
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
@keyframes floatIn{from{transform:translateY(14px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
input:focus,select:focus{border-color:rgba(255,215,0,.5)!important;outline:none!important}
button:disabled{opacity:.4;cursor:not-allowed}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(200,150,50,.3);border-radius:4px}
.row:hover{background:rgba(255,215,0,.04)!important}
`;
const cd={background:"rgba(255,255,255,.04)",border:"1px solid rgba(200,150,50,.18)",borderRadius:14,padding:15,marginBottom:12};
const bG={background:"linear-gradient(135deg,#c8a000,#ffd700)",color:"#0a0015",border:"none",borderRadius:9,padding:"8px 16px",fontWeight:700,fontFamily:"sans-serif",fontSize:12,cursor:"pointer"};
const bO={background:"transparent",color:G,border:"1px solid rgba(255,215,0,.4)",borderRadius:9,padding:"7px 13px",fontFamily:"sans-serif",fontSize:12,cursor:"pointer"};
const bR={background:"rgba(255,71,87,.12)",color:"#ff4757",border:"1px solid rgba(255,71,87,.3)",borderRadius:9,padding:"7px 13px",fontFamily:"sans-serif",fontSize:12,cursor:"pointer"};
const bGr={background:"rgba(0,184,148,.12)",color:"#00b894",border:"1px solid rgba(0,184,148,.3)",borderRadius:9,padding:"7px 13px",fontFamily:"sans-serif",fontSize:12,cursor:"pointer"};


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


function Stars(){
  const p=Array.from({length:35},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,r:Math.random()*1.4+.3,d:Math.random()*4,dur:Math.random()*3+2}));
  return(<div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}><svg width="100%" height="100%" style={{position:"absolute"}}>{p.map(x=><circle key={x.id} cx={x.x+"%"} cy={x.y+"%"} r={x.r} fill="white"><animate attributeName="opacity" values=".04;.7;.04" dur={x.dur+"s"} begin={x.d+"s"} repeatCount="indefinite"/></circle>)}</svg></div>);
}
function Sp({size=14,color=G}){return <div style={{width:size,height:size,border:"2px solid "+color+"22",borderTop:"2px solid "+color,borderRadius:"50%",animation:"spin .8s linear infinite",flexShrink:0}}/>;}
function Badge({label,color}){
  const S={approved:{bg:"rgba(0,184,148,.15)",c:"#00b894",b:"rgba(0,184,148,.3)"},pending:{bg:"rgba(253,203,110,.12)",c:"#fdcb6e",b:"rgba(253,203,110,.3)"},rejected:{bg:"rgba(255,71,87,.12)",c:"#ff4757",b:"rgba(255,71,87,.3)"},online:{bg:"rgba(0,184,148,.15)",c:"#00b894",b:"rgba(0,184,148,.3)"},offline:{bg:"rgba(99,110,114,.15)",c:"#636e72",b:"rgba(99,110,114,.3)"},busy:{bg:"rgba(253,203,110,.12)",c:"#fdcb6e",b:"rgba(253,203,110,.3)"},processed:{bg:"rgba(0,184,148,.15)",c:"#00b894",b:"rgba(0,184,148,.3)"}};
  const s=S[color]||S.pending;
  return <span style={{fontSize:10,fontFamily:"sans-serif",fontWeight:700,padding:"2px 8px",borderRadius:8,background:s.bg,color:s.c,border:"1px solid "+s.b}}>{label.toUpperCase()}</span>;
}
function MiniBar({val,max,color="#ffd700"}){
  const pct=Math.min(100,Math.round((val/max)*100));
  return(<div style={{flex:1,height:5,background:"rgba(255,255,255,.07)",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:pct+"%",background:color,borderRadius:3,transition:"width .5s ease"}}/></div>);
}

const MOCK={
  revenue:{today:18420,week:124500,month:498000,total:2840000,growth:12.4,
    byGateway:[{name:"Razorpay",amt:312000,pct:63},{name:"Stripe",amt:186000,pct:37}],
    byCountry:[{f:"🇮🇳",c:"India",amt:312000,pct:63},{f:"🇦🇺",c:"Australia",amt:89000,pct:18},{f:"🇺🇸",c:"USA",amt:54000,pct:11},{f:"🇬🇧",c:"UK",amt:43000,pct:8}]},
  users:{total:10482,today:47,active:3241},
  sessions:{total:28940,today:184,avgDuration:18},
  pendingAstros:[
    {id:"a1",name:"Meena Sharma",spec:"Vedic Astrology",exp:"12 yrs",email:"meena@gmail.com",submittedAt:"2h ago",photo:true},
    {id:"a2",name:"Arjun Pillai",spec:"Tarot Reading",exp:"5 yrs",email:"arjun@gmail.com",submittedAt:"5h ago",photo:true},
    {id:"a3",name:"Sunita Bose",spec:"Numerology",exp:"8 yrs",email:"sunita@yahoo.com",submittedAt:"1d ago",photo:false},
  ],
  allAstros:[
    {id:"b1",name:"Pandit Rajesh Sharma",spec:"Vedic Astrology",status:"online",rating:4.9,sessions:8420,earnings:420500,pending:12600,joined:"Jan 2023"},
    {id:"b2",name:"Dr. Priya Nair",spec:"Tarot & Numerology",status:"online",rating:4.8,sessions:5630,earnings:180960,pending:8100,joined:"Mar 2023"},
    {id:"b3",name:"Acharya Suresh Joshi",spec:"Kundli & Marriage",status:"busy",rating:4.9,sessions:11200,earnings:392000,pending:0,joined:"Nov 2022"},
    {id:"b4",name:"Kavitha Menon",spec:"Western Astrology",status:"offline",rating:4.6,sessions:3200,earnings:48000,pending:3600,joined:"Jul 2023"},
  ],
  withdrawals:[
    {id:"w1",astro:"Pandit Rajesh Sharma",amount:12600,bank:"HDFC ****4521",requested:"2h ago",status:"pending"},
    {id:"w2",astro:"Dr. Priya Nair",amount:8100,bank:"SBI ****7823",requested:"1d ago",status:"pending"},
    {id:"w3",astro:"Acharya Suresh Joshi",amount:28000,bank:"ICICI ****3341",requested:"3d ago",status:"processed"},
  ],
  recentTxns:[
    {id:"t1",user:"Priya R.",type:"recharge",amount:499,coins:550,gateway:"Razorpay",time:"2m ago"},
    {id:"t2",user:"James M.",type:"recharge",amount:36,coins:320,gateway:"Stripe",time:"8m ago"},
    {id:"t3",user:"Anita K.",type:"session",amount:null,coins:75,astro:"Pandit Rajesh",time:"12m ago"},
    {id:"t4",user:"Ravi S.",type:"recharge",amount:999,coins:1200,gateway:"Razorpay",time:"18m ago"},
  ],
  topAstros:[
    {name:"Acharya Suresh",sessions:184,earnings:64400,rating:4.9},
    {name:"Pandit Rajesh",sessions:156,earnings:46800,rating:4.9},
    {name:"Dr. Priya Nair",sessions:121,earnings:26620,rating:4.8},
    {name:"Swami Anand Das",sessions:98,earnings:47040,rating:4.7},
  ],
};

const ASTRO={
  today:4680,week:28600,month:92400,total:420500,pending:12600,withdrawn:407900,rate:25,
  sessions:{today:6,week:36,month:112},
  users:[
    {id:"u1",name:"Priya Sharma",email:"priya@email.com",phone:"+61 412 345 678",country:"Australia",joined:"12 Jan 2025",sessions:8,coins:240,status:"active",reports:0},
    {id:"u2",name:"Ravi Kumar",email:"ravi@email.com",phone:"+91 98765 43210",country:"India",joined:"18 Feb 2025",sessions:14,coins:0,status:"active",reports:1},
    {id:"u3",name:"James Mitchell",email:"james@email.com",phone:"+1 (415) 234-5678",country:"USA",joined:"3 Mar 2025",sessions:3,coins:150,status:"active",reports:0},
    {id:"u4",name:"Anita Patel",email:"anita@email.com",phone:"+44 7911 123456",country:"UK",joined:"22 Mar 2025",sessions:21,coins:80,status:"active",reports:0},
    {id:"u5",name:"Wei Chen",email:"wei@email.com",phone:"+65 8123 4567",country:"Singapore",joined:"5 Apr 2025",sessions:5,coins:320,status:"suspended",reports:3},
    {id:"u6",name:"Sarah Johnson",email:"sarah@email.com",phone:"+61 423 456 789",country:"Australia",joined:"11 Apr 2025",sessions:2,coins:50,status:"active",reports:0},
  ],
  reports:[
    {id:"r1",userId:"u2",userName:"Ravi Kumar",astrologer:"Dr. Priya Nair",reason:"Abusive language during session",details:"User was very rude and used inappropriate language when he did not like the reading.",time:"2h ago",status:"pending"},
    {id:"r2",userId:"u5",userName:"Wei Chen",astrologer:"Pandit Rajesh Sharma",reason:"Spam and fake details",details:"User provided false birth details repeatedly and demanded refund aggressively.",time:"1 day ago",status:"pending"},
    {id:"r3",userId:"u5",userName:"Wei Chen",astrologer:"Acharya Suresh Joshi",reason:"Threatening behaviour",details:"User made threatening comments after session ended.",time:"3 days ago",status:"reviewed"},
  ],
  recentSessions:[
    {customer:"Priya R.",duration:"24 min",coins:600,earned:420,rating:5,time:"1h ago"},
    {customer:"Ravi S.",duration:"18 min",coins:450,earned:315,rating:4,time:"3h ago"},
    {customer:"Anita K.",duration:"31 min",coins:775,earned:542,rating:5,time:"5h ago"},
    {customer:"James M.",duration:"12 min",coins:300,earned:210,rating:5,time:"8h ago"},
  ],
  withdrawalHistory:[
    {id:"w1",amount:28000,bank:"HDFC ****4521",date:"15 Apr 2025",status:"processed"},
    {id:"w2",amount:22000,bank:"HDFC ****4521",date:"15 Mar 2025",status:"processed"},
    {id:"w3",amount:18500,bank:"HDFC ****4521",date:"15 Feb 2025",status:"processed"},
  ],
};

function AdminPanel(){
  const [tab,setTab]=useState("overview");
  const [toast,setToast]=useState(null);
  const [pending,setPending]=useState(MOCK.pendingAstros);
  const [withdrawals,setWithdrawals]=useState(MOCK.withdrawals);
  const [processing,setProcessing]=useState({});
  const [users,setUsers]=useState(ASTRO.users);
  const [reports,setReports]=useState(ASTRO.reports);
  const [userSearch,setUserSearch]=useState("");
  const [selectedReport,setSelectedReport]=useState(null);
  const [showNotif,setShowNotif]=useState(false);
  const [notifications,setNotifications]=useState([
    {id:"n1",type:"report",title:"New Report - Ravi Kumar",body:"Dr. Priya Nair reported: Abusive language during session",time:"2h ago",read:false,reportId:"r1"},
    {id:"n2",type:"report",title:"New Report - Wei Chen",body:"Pandit Rajesh Sharma reported: Spam and fake details",time:"1 day ago",read:false,reportId:"r2"},
    {id:"n3",type:"astro",title:"New Astrologer Application",body:"Meena Krishnamurthy applied to join as Vedic Astrologer",time:"3h ago",read:true,reportId:null},
  ]);
  const [showMsgModal,setShowMsgModal]=useState(false);
  const [msgUser,setMsgUser]=useState(null);
  const [msgText,setMsgText]=useState("");
  const [msgSent,setMsgSent]=useState(false);
  function toast$(m,t="ok"){setToast({m,t});setTimeout(()=>setToast(null),3000);}

  function suspendUser(id){
    setUsers(u=>u.map(x=>x.id===id?{...x,status:"suspended"}:x));
    toast$("User suspended - access revoked","warn");
  }
  function reinstateUser(id){
    setUsers(u=>u.map(x=>x.id===id?{...x,status:"active"}:x));
    toast$("User reinstated - access restored");
  }
  function deleteUser(id){
    setUsers(u=>u.filter(x=>x.id!==id));
    toast$("User deleted - account removed","warn");
  }
  function blockUser(id){
    setUsers(u=>u.map(x=>x.id===id?{...x,status:"blocked"}:x));
    toast$("User blocked - login access revoked","warn");
  }
  function unblockUser(id){
    setUsers(u=>u.map(x=>x.id===id?{...x,status:"active"}:x));
    toast$("User unblocked - access restored");
  }
  function markAllRead(){
    setNotifications(n=>n.map(x=>({...x,read:true})));
  }
  function addNotification(n){
    setNotifications(p=>[{id:"n"+Date.now(),...n,read:false,time:"Just now"},...p]);
  }
  function openMsgModal(user){
    setMsgUser(user);
    setMsgText("");
    setMsgSent(false);
    setShowMsgModal(true);
  }
  function resolveReport(id){
    setReports(r=>r.map(x=>x.id===id?{...x,status:"reviewed"}:x));
    setNotifications(n=>n.map(x=>x.reportId===id?{...x,read:true}:x));
    setSelectedReport(null);
    toast$("Report marked as reviewed");
  }
  function dismissReport(id){
    setReports(r=>r.filter(x=>x.id!==id));
    setSelectedReport(null);
    toast$("Report dismissed");
  }

  async function approveAstro(id){
    setProcessing(p=>({...p,[id]:"approving"}));
    await new Promise(r=>setTimeout(r,1200));
    setPending(p=>p.filter(a=>a.id!==id));
    setProcessing(p=>({...p,[id]:null}));
    toast$("Astrologer approved - profile now live!");
  }
  async function rejectAstro(id){
    setProcessing(p=>({...p,[id]:"rejecting"}));
    await new Promise(r=>setTimeout(r,800));
    setPending(p=>p.filter(a=>a.id!==id));
    setProcessing(p=>({...p,[id]:null}));
    toast$("Profile rejected - astrologer notified","warn");
  }
  async function processWithdrawal(id){
    setProcessing(p=>({...p,[id]:"paying"}));
    await new Promise(r=>setTimeout(r,1500));
    setWithdrawals(w=>w.map(x=>x.id===id?{...x,status:"processed"}:x));
    setProcessing(p=>({...p,[id]:null}));
    toast$("Withdrawal processed - bank transfer initiated!");
  }

  const TABS=[["overview","📊 Overview"],["astrologers","🔮 Astrologers"],["users","👥 Users"],["reports","🚨 Reports"],["withdrawals","💰 Withdrawals"],["transactions","📋 Transactions"],["analytics","📈 Analytics"]];

  return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"Georgia,serif",color:"#e8d5b7",position:"relative"}}>
      <style>{CSS}</style><Stars/>
      <div style={{position:"sticky",top:0,zIndex:100,background:"rgba(10,0,21,.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(200,150,50,.2)",padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",height:60}}>
        <div>
          <div style={{fontSize:16,fontWeight:700,background:"linear-gradient(90deg,#e8d5b7,#ffd700,#a29bfe)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
          <MXWordmark size={16}/></div>
          <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif"}}>Super Admin · Stage 6</div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {/* Bell notification icon */}
          <div style={{position:"relative",cursor:"pointer"}} onClick={()=>setShowNotif(v=>!v)}>
            <div style={{width:34,height:34,borderRadius:"50%",background:"rgba(255,255,255,.06)",border:"1px solid rgba(200,150,50,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>
              &#128276;
            </div>
            {notifications.filter(n=>!n.read).length>0&&(
              <div style={{position:"absolute",top:-3,right:-3,width:16,height:16,borderRadius:"50%",background:"#ff4757",border:"2px solid #0a0015",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"white",fontFamily:"sans-serif"}}>
                {notifications.filter(n=>!n.read).length}
              </div>
            )}
          </div>
          <div style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#6c5ce7,#a29bfe)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontFamily:"sans-serif",fontWeight:700,color:"#fff"}}>A</div>
        </div>

        {/* Notification dropdown */}
        {showNotif&&(
          <div style={{position:"absolute",top:65,right:14,width:320,background:"#0d0a1a",border:"1px solid rgba(200,150,50,.3)",borderRadius:14,zIndex:300,boxShadow:"0 8px 32px rgba(0,0,0,.8)",overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",borderBottom:"1px solid rgba(200,150,50,.15)"}}>
              <div style={{fontSize:13,fontWeight:700,color:G,fontFamily:"sans-serif"}}>&#128276; Notifications</div>
              <button onClick={markAllRead} style={{background:"none",border:"none",color:"#8a7a6a",fontFamily:"sans-serif",fontSize:11,cursor:"pointer"}}>Mark all read</button>
            </div>
            <div style={{maxHeight:360,overflowY:"auto"}}>
              {notifications.length===0&&(
                <div style={{padding:"20px",textAlign:"center",color:"#8a7a6a",fontFamily:"sans-serif",fontSize:12}}>No notifications</div>
              )}
              {notifications.map(n=>(
                <div key={n.id} onClick={()=>{
                  setNotifications(ns=>ns.map(x=>x.id===n.id?{...x,read:true}:x));
                  if(n.reportId){setTab("reports");setShowNotif(false);}
                  else if(n.type==="astro"){setTab("astrologers");setShowNotif(false);}
                }} style={{padding:"12px 14px",borderBottom:"1px solid rgba(200,150,50,.07)",cursor:"pointer",background:n.read?"transparent":"rgba(255,71,87,.04)",display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:n.read?"transparent":"#ff4757",flexShrink:0,marginTop:4}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:n.read?400:700,color:"#e8d5b7",fontFamily:"sans-serif",marginBottom:2}}>{n.title}</div>
                    <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.5}}>{n.body}</div>
                    <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif",marginTop:3}}>{n.time}</div>
                  </div>
                  {n.type==="report"&&!n.read&&<div style={{fontSize:9,color:"#ff4757",fontFamily:"sans-serif",background:"rgba(255,71,87,.12)",padding:"2px 7px",borderRadius:6,flexShrink:0}}>NEW</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={{display:"flex",overflowX:"auto",borderBottom:"1px solid rgba(200,150,50,.12)",background:"rgba(10,0,21,.8)",padding:"0 14px"}}>
        {TABS.map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} style={{whiteSpace:"nowrap",padding:"12px 13px",border:"none",background:"transparent",color:tab===key?G:"#8a7a6a",fontFamily:"sans-serif",fontSize:12,cursor:"pointer",borderBottom:tab===key?"2px solid "+G:"2px solid transparent",fontWeight:tab===key?700:400}}>
            {label}{key==="astrologers"&&pending.length>0?<span style={{marginLeft:5,background:"#ff4757",color:"white",fontSize:9,padding:"1px 5px",borderRadius:8}}>{pending.length}</span>:key==="reports"?<span style={{marginLeft:5,background:reports.filter(r=>r.status==="pending").length>0?"#ff4757":"transparent",color:"white",fontSize:9,padding:"1px 5px",borderRadius:8}}>{reports.filter(r=>r.status==="pending").length>0?reports.filter(r=>r.status==="pending").length:""}</span>:null}
          </button>
        ))}
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"16px 14px 40px",position:"relative",zIndex:1}}>

        {tab==="overview"&&(
          <div style={{animation:"floatIn .35s ease"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:14}}>
              {[["💰","Today's Revenue","₹"+MOCK.revenue.today.toLocaleString("en-IN"),"↑"+MOCK.revenue.growth+"% vs yesterday","#00b894"],["🪙","Month Revenue","₹"+MOCK.revenue.month.toLocaleString("en-IN"),"$5,964 USD","#ffd700"],["👥","Total Users",MOCK.users.total.toLocaleString(),"+"+MOCK.users.today+" today","#a29bfe"],["💬","Sessions Today",MOCK.sessions.today,"Avg "+MOCK.sessions.avgDuration+" min","#fd79a8"]].map(([icon,label,val,sub,color])=>(
                <div key={label} style={{...cd,marginBottom:0}}>
                  <div style={{fontSize:22,marginBottom:6}}>{icon}</div>
                  <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",marginBottom:2}}>{label}</div>
                  <div style={{fontSize:20,fontWeight:700,color,fontFamily:"sans-serif"}}>{val}</div>
                  <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif",marginTop:2}}>{sub}</div>
                </div>
              ))}
            </div>
            <div style={cd}>
              <div style={{fontSize:13,fontWeight:700,color:G,marginBottom:12}}>💳 Revenue by Gateway</div>
              {MOCK.revenue.byGateway.map(g=>(
                <div key={g.name} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <div style={{fontSize:12,color:"#e8d5b7",fontFamily:"sans-serif"}}>{g.name}</div>
                    <div style={{fontSize:12,fontWeight:700,color:G,fontFamily:"sans-serif"}}>₹{g.amt.toLocaleString("en-IN")} ({g.pct}%)</div>
                  </div>
                  <MiniBar val={g.pct} max={100} color={g.name==="Razorpay"?"#7B61FF":"#635BFF"}/>
                </div>
              ))}
            </div>
            <div style={cd}>
              <div style={{fontSize:13,fontWeight:700,color:G,marginBottom:12}}>🌍 Revenue by Country</div>
              {MOCK.revenue.byCountry.map(c=>(
                <div key={c.c} style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}>
                  <span style={{fontSize:18}}>{c.f}</span>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                      <div style={{fontSize:12,color:"#e8d5b7",fontFamily:"sans-serif"}}>{c.c}</div>
                      <div style={{fontSize:11,color:G,fontFamily:"sans-serif",fontWeight:700}}>₹{c.amt.toLocaleString("en-IN")}</div>
                    </div>
                    <MiniBar val={c.pct} max={100}/>
                  </div>
                </div>
              ))}
            </div>
            <div style={cd}>
              <div style={{fontSize:13,fontWeight:700,color:G,marginBottom:12}}>🏆 Top Performers Today</div>
              {MOCK.topAstros.map((a,i)=>(
                <div key={a.name} className="row" style={{display:"flex",alignItems:"center",gap:10,padding:"8px 4px",borderBottom:"1px solid rgba(200,150,50,.06)"}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:i===0?"rgba(255,215,0,.2)":i===1?"rgba(200,200,200,.12)":"rgba(180,100,0,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontFamily:"sans-serif",fontWeight:700,color:i===0?G:i===1?"#b2bec3":"#cd7f32",flexShrink:0}}>{i+1}</div>
                  <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:"#e8d5b7",fontFamily:"sans-serif"}}>{a.name}</div><div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif"}}>{a.sessions} sessions · ⭐{a.rating}</div></div>
                  <div style={{fontSize:13,fontWeight:700,color:"#00b894",fontFamily:"sans-serif"}}>₹{a.earnings.toLocaleString("en-IN")}</div>
                </div>
              ))}
            </div>
            <div style={cd}>
              <div style={{fontSize:13,fontWeight:700,color:G,marginBottom:12}}>📋 Recent Transactions</div>
              {MOCK.recentTxns.map(t=>(
                <div key={t.id} className="row" style={{display:"flex",alignItems:"center",gap:10,padding:"8px 4px",borderBottom:"1px solid rgba(200,150,50,.06)"}}>
                  <div style={{width:32,height:32,borderRadius:8,background:t.type==="recharge"?"rgba(0,184,148,.12)":"rgba(162,155,254,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{t.type==="recharge"?"💳":"💬"}</div>
                  <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:"#e8d5b7",fontFamily:"sans-serif"}}>{t.user}</div><div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif"}}>{t.type==="recharge"?t.gateway+" · "+t.time:"Session · "+t.time}</div></div>
                  <div style={{textAlign:"right"}}>{t.amount&&<div style={{fontSize:12,fontWeight:700,color:G,fontFamily:"sans-serif"}}>₹{t.amount}</div>}<div style={{fontSize:10,color:"#a29bfe",fontFamily:"sans-serif"}}>🪙{t.coins}</div></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="astrologers"&&(
          <div style={{animation:"floatIn .35s ease"}}>
            {pending.length>0&&(
              <div>
                <div style={{fontSize:14,fontWeight:700,color:"#fdcb6e",marginBottom:10}}>⏳ Pending Approval ({pending.length})</div>
                {pending.map(a=>(
                  <div key={a.id} style={{...cd,border:"1px solid rgba(253,203,110,.25)",background:"rgba(253,203,110,.04)"}}>
                    <div style={{display:"flex",gap:12,marginBottom:10}}>
                      <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#6c5ce7,#a29bfe)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>👤</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:14,fontWeight:700,color:"#e8d5b7"}}>{a.name}</div>
                        <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif"}}>{a.spec} · {a.exp}</div>
                        <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif"}}>{a.email} · Submitted {a.submittedAt}</div>
                        <div style={{display:"flex",gap:6,marginTop:3}}>{a.photo?<span style={{fontSize:10,color:"#00b894",fontFamily:"sans-serif"}}>✓ Photo uploaded</span>:<span style={{fontSize:10,color:"#ff4757",fontFamily:"sans-serif"}}>⚠ No photo</span>}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      {processing[a.id]==="approving"
                        ?<div style={{...bGr,flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Sp size={12} color="#00b894"/>Approving…</div>
                        :<button style={{...bGr,flex:1}} onClick={()=>approveAstro(a.id)}>✅ Approve & Go Live</button>}
                      {processing[a.id]==="rejecting"
                        ?<div style={{...bR,flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Sp size={12} color="#ff4757"/>Rejecting…</div>
                        :<button style={{...bR,flex:1}} onClick={()=>rejectAstro(a.id)}>✗ Reject</button>}
                    </div>
                  </div>
                ))}
                <div style={{borderTop:"1px solid rgba(200,150,50,.12)",marginBottom:14,paddingTop:4}}/>
              </div>
            )}
            <div style={{fontSize:14,fontWeight:700,color:G,marginBottom:10}}>✅ Active Astrologers</div>
            {MOCK.allAstros.map(a=>(
              <div key={a.id} style={cd}>
                <div style={{display:"flex",gap:11,alignItems:"flex-start",marginBottom:9}}>
                  <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#c8a000,#ffd700)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🔮</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}><div style={{fontSize:13,fontWeight:700,color:"#e8d5b7"}}>{a.name}</div><Badge label={a.status} color={a.status}/></div>
                    <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif"}}>{a.spec}</div>
                    <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif"}}>Joined {a.joined} · ⭐{a.rating} · {a.sessions.toLocaleString()} sessions</div>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:9}}>
                  {[["Total Earned","₹"+a.earnings.toLocaleString("en-IN")],["Pending","₹"+a.pending.toLocaleString("en-IN")],["Rating",a.rating+"/5"]].map(([l,v])=>(
                    <div key={l} style={{background:"rgba(255,255,255,.03)",borderRadius:8,padding:"7px 9px"}}><div style={{fontSize:9,color:"#8a7a6a",fontFamily:"sans-serif"}}>{l}</div><div style={{fontSize:12,fontWeight:700,color:G,fontFamily:"sans-serif",marginTop:1}}>{v}</div></div>
                  ))}
                </div>
                <div style={{display:"flex",gap:7}}>
                  <button style={{...bO,flex:1,fontSize:11}}>📊 Details</button>
                  <button style={{...bR,flex:1,fontSize:11}}>⏸ Suspend</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==="withdrawals"&&(
          <div style={{animation:"floatIn .35s ease"}}>
            <div style={{fontSize:14,fontWeight:700,color:G,marginBottom:10}}>💰 Withdrawal Requests</div>
            <div style={{...cd,background:"linear-gradient(135deg,rgba(255,215,0,.08),rgba(10,0,21,.9))",border:"1px solid rgba(255,215,0,.22)",marginBottom:14}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,textAlign:"center"}}>
                {[["⏳","Pending","₹"+withdrawals.filter(w=>w.status==="pending").reduce((s,w)=>s+w.amount,0).toLocaleString("en-IN")],["✅","Processed","₹28,000"],["📊","All Time","₹8,29,900"]].map(([ic,l,v])=>(
                  <div key={l}><div style={{fontSize:20,marginBottom:4}}>{ic}</div><div style={{fontSize:9,color:"#8a7a6a",fontFamily:"sans-serif",marginBottom:2}}>{l}</div><div style={{fontSize:14,fontWeight:700,color:G,fontFamily:"sans-serif"}}>{v}</div></div>
                ))}
              </div>
            </div>
            {withdrawals.map(w=>(
              <div key={w.id} style={cd}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:9}}>
                  <div><div style={{fontSize:13,fontWeight:700,color:"#e8d5b7"}}>{w.astro}</div><div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",marginTop:2}}>{w.bank} · {w.requested}</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontSize:18,fontWeight:700,color:G,fontFamily:"sans-serif"}}>₹{w.amount.toLocaleString("en-IN")}</div><Badge label={w.status} color={w.status}/></div>
                </div>
                {w.status==="pending"&&(
                  processing[w.id]==="paying"
                    ?<div style={{...bGr,display:"flex",alignItems:"center",justifyContent:"center",gap:7,width:"100%"}}><Sp size={12} color="#00b894"/>Processing…</div>
                    :<div style={{display:"flex",gap:8}}><button style={{...bGr,flex:2}} onClick={()=>processWithdrawal(w.id)}>💸 Process Transfer</button><button style={{...bR,flex:1}} onClick={()=>toast$("Rejection noted")}>Reject</button></div>
                )}
                {w.status==="processed"&&<div style={{fontSize:11,color:"#00b894",fontFamily:"sans-serif"}}>✓ Bank transfer completed</div>}
              </div>
            ))}
          </div>
        )}

        {tab==="transactions"&&(
          <div style={{animation:"floatIn .35s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:14,fontWeight:700,color:G}}>📋 All Transactions</div>
              <select style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(200,150,50,.22)",borderRadius:8,padding:"6px 10px",color:"#e8d5b7",fontFamily:"sans-serif",fontSize:11,cursor:"pointer"}}><option>Last 7 days</option><option>Last 30 days</option><option>All time</option></select>
            </div>
            <div style={cd}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:8,padding:"6px 8px",borderBottom:"1px solid rgba(200,150,50,.15)",marginBottom:6}}>
                {["User","Type","Amount","Coins","Time"].map(h=><div key={h} style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif",letterSpacing:.8}}>{h}</div>)}
              </div>
              {[...MOCK.recentTxns,...MOCK.recentTxns].map((t,i)=>(
                <div key={i} className="row" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:8,padding:"9px 8px",borderBottom:"1px solid rgba(200,150,50,.06)",alignItems:"center"}}>
                  <div style={{fontSize:12,color:"#e8d5b7",fontFamily:"sans-serif",fontWeight:600}}>{t.user}</div>
                  <Badge label={t.type} color={t.type==="recharge"?"approved":"active"}/>
                  <div style={{fontSize:12,color:G,fontFamily:"sans-serif",fontWeight:700}}>{t.amount?"₹"+t.amount:"-"}</div>
                  <div style={{fontSize:11,color:"#a29bfe",fontFamily:"sans-serif"}}>🪙{t.coins}</div>
                  <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif"}}>{t.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        
        {tab==="users"&&(
          <div style={{animation:"floatIn .35s ease"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div style={{fontSize:15,fontWeight:700,color:G}}>&#128101; Users ({users.length})</div>
              <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif"}}>
                <span style={{color:"#00b894",marginRight:8}}>&#9679; {users.filter(u=>u.status==="active").length} active</span>
                <span style={{color:"#ff4757"}}>&#9679; {users.filter(u=>u.status==="suspended").length} suspended</span>
              </div>
            </div>
            {/* Search */}
            <input value={userSearch} onChange={e=>setUserSearch(e.target.value)} placeholder="Search by name, email or country..." style={{width:"100%",background:"#0d0a1a",border:"1px solid rgba(200,150,50,.25)",borderRadius:11,padding:"10px 13px",color:"#e8d5b7",fontFamily:"sans-serif",fontSize:13,outline:"none",boxSizing:"border-box",marginBottom:12}}/>
            {users.filter(u=>!userSearch||(u.name+u.email+u.country).toLowerCase().includes(userSearch.toLowerCase())).map(u=>(
              <div key={u.id} style={{...cd,opacity:u.status==="suspended"?0.7:1,border:"1px solid "+(u.status==="suspended"?"rgba(255,71,87,.25)":"rgba(200,150,50,.18)")}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                      <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#6c5ce7,#a29bfe)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff",fontFamily:"sans-serif",flexShrink:0}}>{u.name[0]}</div>
                      <div>
                        <div style={{fontSize:13,fontWeight:700,color:"#e8d5b7",fontFamily:"sans-serif"}}>{u.name}</div>
                        <div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif"}}>{u.email}</div>
                      </div>
                      {u.status==="suspended"&&<div style={{fontSize:9,background:"rgba(255,149,0,.15)",color:"#ffa502",padding:"2px 7px",borderRadius:6,fontFamily:"sans-serif",fontWeight:700}}>SUSPENDED</div>}{u.status==="blocked"&&<div style={{fontSize:9,background:"rgba(255,71,87,.15)",color:"#ff4757",padding:"2px 7px",borderRadius:6,fontFamily:"sans-serif",fontWeight:700}}>&#128683; BLOCKED</div>}
                      {u.reports>0&&<div style={{fontSize:9,background:"rgba(255,149,0,.15)",color:"#ffa502",padding:"2px 7px",borderRadius:6,fontFamily:"sans-serif",fontWeight:700}}>{u.reports} REPORT{u.reports>1?"S":""}</div>}
                    </div>
                    <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:4}}>
                      {[["&#128222;",u.phone],["&#127758;",u.country],["&#128337;","Joined "+u.joined],["&#128172;",u.sessions+" sessions"],["&#129689;",u.coins+" coins"]].map(([icon,val])=>(
                        <div key={val} style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif",display:"flex",alignItems:"center",gap:3}}>
                          <span dangerouslySetInnerHTML={{__html:icon}}/>{val}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:5,flexShrink:0}}>
                    {u.status==="active"&&<button onClick={()=>suspendUser(u.id)} style={{background:"rgba(255,149,0,.12)",border:"1px solid rgba(255,149,0,.3)",borderRadius:7,padding:"4px 9px",color:"#ffa502",fontFamily:"sans-serif",fontSize:10,cursor:"pointer"}}>Suspend</button>}
                    {u.status==="active"&&<button onClick={()=>blockUser(u.id)} style={{background:"rgba(255,71,87,.12)",border:"1px solid rgba(255,71,87,.3)",borderRadius:7,padding:"4px 9px",color:"#ff4757",fontFamily:"sans-serif",fontSize:10,cursor:"pointer"}}>&#128683; Block</button>}
                    {(u.status==="suspended"||u.status==="blocked")&&<button onClick={()=>unblockUser(u.id)} style={{background:"rgba(0,184,148,.12)",border:"1px solid rgba(0,184,148,.3)",borderRadius:7,padding:"4px 9px",color:"#00b894",fontFamily:"sans-serif",fontSize:10,cursor:"pointer"}}>Unblock</button>}
                    <button onClick={()=>openMsgModal(u)} style={{background:"rgba(162,155,254,.1)",border:"1px solid rgba(162,155,254,.25)",borderRadius:7,padding:"4px 9px",color:"#a29bfe",fontFamily:"sans-serif",fontSize:10,cursor:"pointer"}}>&#128140; Message</button>
                    <button onClick={()=>{if(window.confirm("Delete "+u.name+"?"))deleteUser(u.id);}} style={{background:"rgba(99,110,114,.1)",border:"1px solid rgba(99,110,114,.2)",borderRadius:7,padding:"4px 9px",color:"#636e72",fontFamily:"sans-serif",fontSize:10,cursor:"pointer"}}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==="reports"&&(
          <div style={{animation:"floatIn .35s ease"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div style={{fontSize:15,fontWeight:700,color:G}}>&#128680; User Reports</div>
              <div style={{fontSize:11,color:"#ff4757",fontFamily:"sans-serif",background:"rgba(255,71,87,.1)",padding:"3px 10px",borderRadius:8,border:"1px solid rgba(255,71,87,.2)"}}>
                {reports.filter(r=>r.status==="pending").length} pending review
              </div>
            </div>
            {reports.length===0&&(
              <div style={{...cd,textAlign:"center",padding:28}}>
                <div style={{fontSize:32,marginBottom:8}}>&#10003;</div>
                <div style={{fontSize:13,color:"#00b894",fontFamily:"sans-serif"}}>No reports - all clear!</div>
              </div>
            )}
            {reports.map(r=>(
              <div key={r.id} style={{...cd,border:"1px solid "+(r.status==="pending"?"rgba(255,71,87,.3)":"rgba(200,150,50,.18)"),background:r.status==="pending"?"rgba(255,71,87,.04)":"rgba(255,255,255,.03)"}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:6}}>
                      <div style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:6,fontFamily:"sans-serif",background:r.status==="pending"?"rgba(255,71,87,.15)":"rgba(100,100,100,.15)",color:r.status==="pending"?"#ff4757":"#636e72"}}>
                        {r.status==="pending"?"PENDING REVIEW":"REVIEWED"}
                      </div>
                    </div>
                    <div style={{fontSize:13,fontWeight:700,color:"#e8d5b7",fontFamily:"sans-serif",marginBottom:2}}>
                      &#128101; {r.userName}
                    </div>
                    <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",marginBottom:4}}>
                      Reported by: {r.astrologer}
                    </div>
                    <div style={{fontSize:12,fontWeight:600,color:"#ffa502",fontFamily:"sans-serif",marginBottom:4}}>
                      {r.reason}
                    </div>
                    <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.6,marginBottom:6}}>
                      {r.details}
                    </div>
                    <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif"}}>{r.time}</div>
                  </div>
                </div>
                {r.status==="pending"&&(
                  <div style={{display:"flex",gap:8,marginTop:10}}>
                    <button onClick={()=>{blockUser(r.userId);resolveReport(r.id);toast$("User blocked and report resolved","warn");}} style={{flex:1,background:"rgba(255,71,87,.12)",border:"1px solid rgba(255,71,87,.3)",borderRadius:8,padding:"7px",color:"#ff4757",fontFamily:"sans-serif",fontSize:11,cursor:"pointer"}}>
                      &#128683; Block User
                    </button>
                    <button onClick={()=>resolveReport(r.id)} style={{flex:1,background:"rgba(0,184,148,.12)",border:"1px solid rgba(0,184,148,.3)",borderRadius:8,padding:"7px",color:"#00b894",fontFamily:"sans-serif",fontSize:11,cursor:"pointer"}}>
                      &#10003; Mark Reviewed
                    </button>
                    <button onClick={()=>dismissReport(r.id)} style={{flex:1,background:"rgba(100,100,100,.1)",border:"1px solid rgba(100,100,100,.2)",borderRadius:8,padding:"7px",color:"#636e72",fontFamily:"sans-serif",fontSize:11,cursor:"pointer"}}>
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab==="analytics"&&(
          <div style={{animation:"floatIn .35s ease"}}>
            <div style={{fontSize:14,fontWeight:700,color:G,marginBottom:10}}>📈 Platform Analytics</div>
            <div style={cd}>
              <div style={{fontSize:13,fontWeight:700,color:G,marginBottom:12}}>Monthly Revenue (₹)</div>
              <div style={{display:"flex",alignItems:"flex-end",gap:4,height:90,marginBottom:8}}>
                {[28,34,22,41,38,52,44,61,58,72,68,92].map((v,i)=>(
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                    <div style={{width:"100%",background:i===11?"rgba(255,215,0,.7)":"rgba(255,215,0,.22)",borderRadius:"3px 3px 0 0",height:(v/92*85)+"%",minHeight:3}}/>
                    <div style={{fontSize:6,color:"#636e72",fontFamily:"sans-serif"}}>{"JFMAMJJASOND"[i]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:12}}>
              {[["👥","Total Users",MOCK.users.total.toLocaleString(),"↑8.2% MoM","#a29bfe"],["⭐","Avg Rating","4.8 / 5","All sessions","#ffd700"],["💬","Avg Session","18 min","↑2 min MoM","#fd79a8"],["🔄","Retention","67%","30-day return","#00cec9"]].map(([ic,l,v,s,c])=>(
                <div key={l} style={{...cd,marginBottom:0,textAlign:"center"}}><div style={{fontSize:20,marginBottom:5}}>{ic}</div><div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif",marginBottom:2}}>{l}</div><div style={{fontSize:18,fontWeight:700,color:c,fontFamily:"sans-serif"}}>{v}</div><div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif",marginTop:2}}>{s}</div></div>
              ))}
            </div>
            <div style={cd}>
              <div style={{fontSize:13,fontWeight:700,color:G,marginBottom:12}}>🌍 Users by Country</div>
              {[["🇮🇳","India",6840,65],["🇦🇺","Australia",1258,12],["🇺🇸","USA",1048,10],["🇬🇧","UK",734,7],["🇸🇬","Singapore",315,3]].map(([f,c,n,p])=>(
                <div key={c} style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}>
                  <span style={{fontSize:17,width:24}}>{f}</span>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><div style={{fontSize:12,color:"#e8d5b7",fontFamily:"sans-serif"}}>{c}</div><div style={{fontSize:11,color:"#636e72",fontFamily:"sans-serif"}}>{n.toLocaleString()} · {p}%</div></div>
                    <MiniBar val={p} max={65}/>
                  </div>
                </div>
              ))}
            </div>
            <div style={cd}>
              <div style={{fontSize:13,fontWeight:700,color:G,marginBottom:12}}>⏰ Peak Hours (IST)</div>
              <div style={{display:"flex",alignItems:"flex-end",gap:3,height:65}}>
                {[8,15,22,35,48,62,74,88,95,100,87,72,58,44,38,30,42,61,78,92,85,66,44,28].map((v,i)=>(
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                    <div style={{width:"100%",background:(i>=18&&i<=21)?"rgba(255,215,0,.7)":"rgba(255,215,0,.2)",borderRadius:"2px 2px 0 0",height:(v/100*60)+"%",minHeight:2}}/>
                    {i%6===0&&<div style={{fontSize:7,color:"#636e72",fontFamily:"sans-serif"}}>{i}h</div>}
                  </div>
                ))}
              </div>
              <div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif",marginTop:6,textAlign:"center"}}>Peak: 6PM-10PM IST · Gold band highlighted</div>
            </div>
          </div>
        )}
      </div>
      {/* Send Message to User Modal */}
      {showMsgModal&&msgUser&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"linear-gradient(180deg,#0f0025,#080618)",border:"1px solid rgba(162,155,254,.25)",borderRadius:18,padding:"22px 18px",width:"100%",maxWidth:380}}>
            {!msgSent?(
              <div>
                <div style={{textAlign:"center",marginBottom:16}}>
                  <div style={{fontSize:24,marginBottom:6}}>&#128140;</div>
                  <div style={{fontSize:15,fontWeight:700,color:"#a29bfe",marginBottom:3}}>Send Notification</div>
                  <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif"}}>Sending to: <strong style={{color:"#e8d5b7"}}>{msgUser.name}</strong></div>
                </div>
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1,marginBottom:6}}>SELECT TEMPLATE</div>
                  <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:10}}>
                    {[
                      "Your account has received a warning due to reported behaviour.",
                      "Please review our community guidelines to continue using MiraXAstro.",
                      "Your account has been temporarily suspended pending review.",
                      "Custom message..."
                    ].map(t=>(
                      <div key={t} onClick={()=>setMsgText(t==="Custom message..."?"":t)} style={{padding:"8px 12px",borderRadius:9,border:"1px solid",borderColor:msgText===t?"rgba(162,155,254,.5)":"rgba(200,150,50,.15)",background:msgText===t?"rgba(162,155,254,.08)":"transparent",fontSize:11,fontFamily:"sans-serif",color:msgText===t?"#a29bfe":"#8a7a6a",cursor:"pointer"}}>{t}</div>
                    ))}
                  </div>
                  <textarea value={msgText} onChange={e=>setMsgText(e.target.value)} placeholder="Type your message to the user..." rows={3} style={{width:"100%",background:"#0d0a1a",border:"1px solid rgba(200,150,50,.25)",borderRadius:10,padding:"10px 12px",color:"#e8d5b7",fontFamily:"sans-serif",fontSize:12,outline:"none",resize:"none",boxSizing:"border-box"}}/>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setShowMsgModal(false)} style={{flex:1,background:"transparent",border:"1px solid rgba(200,150,50,.2)",borderRadius:9,padding:"9px",color:"#8a7a6a",fontFamily:"sans-serif",fontSize:12,cursor:"pointer"}}>Cancel</button>
                  <button disabled={!msgText.trim()} onClick={()=>{if(msgText.trim())setMsgSent(true);}} style={{flex:2,background:msgText.trim()?"linear-gradient(135deg,#5f3dc4,#a29bfe)":"rgba(100,100,100,.2)",color:msgText.trim()?"white":"#636e72",border:"none",borderRadius:9,padding:"9px",fontWeight:700,fontFamily:"sans-serif",fontSize:12,cursor:msgText.trim()?"pointer":"not-allowed"}}>Send Notification</button>
                </div>
              </div>
            ):(
              <div style={{textAlign:"center",padding:"16px 0"}}>
                <div style={{fontSize:36,marginBottom:10}}>&#10003;</div>
                <div style={{fontSize:15,fontWeight:700,color:"#00b894",marginBottom:6}}>Notification Sent!</div>
                <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.7,marginBottom:14}}>{msgUser.name} has been notified via email and in-app notification.</div>
                <button onClick={()=>setShowMsgModal(false)} style={{...bG,padding:"9px 24px"}}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}

      {toast&&<div style={{position:"fixed",bottom:22,left:"50%",transform:"translateX(-50%)",background:toast.t==="warn"?"rgba(253,203,110,.93)":"rgba(0,184,148,.93)",color:toast.t==="warn"?"#0a0015":"white",padding:"10px 20px",borderRadius:12,fontFamily:"sans-serif",fontSize:13,fontWeight:600,zIndex:600,whiteSpace:"nowrap",animation:"floatIn .3s ease"}}>{toast.m}</div>}
    </div>
  );
}

function AstrologerEarnings(){
  const [tab,setTab]=useState("overview");
  const [showW,setShowW]=useState(false);
  const [wAmt,setWAmt]=useState("");
  const [wProc,setWProc]=useState(false);
  const [toast,setToast]=useState(null);
  const d=ASTRO;
  function toast$(m){setToast({m});setTimeout(()=>setToast(null),3000);}

  async function requestWithdrawal(){
    if(!wAmt||Number(wAmt)<500){toast$("Minimum withdrawal is ₹500");return;}
    if(Number(wAmt)>d.pending){toast$("Cannot exceed pending balance");return;}
    setWProc(true);
    await new Promise(r=>setTimeout(r,1800));
    setWProc(false);setShowW(false);setWAmt("");
    toast$("Withdrawal request submitted - processed in 3-5 working days");
  }

  return(
    <div style={{minHeight:"100vh",background:BG,fontFamily:"Georgia,serif",color:"#e8d5b7",position:"relative"}}>
      <Stars/>
      <div style={{position:"sticky",top:0,zIndex:100,background:"rgba(10,0,21,.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(200,150,50,.2)",padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",height:60}}>
        <div><div style={{fontSize:16,fontWeight:700,background:"linear-gradient(90deg,#e8d5b7,#ffd700,#a29bfe)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>💰 My Earnings</div><div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif"}}>Pandit Rajesh Sharma</div></div>
        <div style={{fontSize:11,color:"#00b894",fontFamily:"sans-serif",background:"rgba(0,184,148,.1)",border:"1px solid rgba(0,184,148,.25)",borderRadius:8,padding:"4px 10px"}}>● Online</div>
      </div>
      <div style={{display:"flex",borderBottom:"1px solid rgba(200,150,50,.12)",background:"rgba(10,0,21,.8)",padding:"0 14px"}}>
        {[["overview","💰 Overview"],["sessions","💬 Sessions"],["withdraw","🏦 Withdraw"]].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} style={{padding:"12px 13px",border:"none",background:"transparent",color:tab===key?G:"#8a7a6a",fontFamily:"sans-serif",fontSize:12,cursor:"pointer",borderBottom:tab===key?"2px solid "+G:"2px solid transparent",fontWeight:tab===key?700:400}}>{label}</button>
        ))}
      </div>
      <div style={{maxWidth:480,margin:"0 auto",padding:"16px 14px 40px",position:"relative",zIndex:1}}>
        {tab==="overview"&&(
          <div style={{animation:"floatIn .35s ease"}}>
            <div style={{...cd,background:"linear-gradient(135deg,rgba(255,215,0,.14),rgba(10,0,21,.9))",border:"1px solid rgba(255,215,0,.32)",marginBottom:12}}>
              <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",letterSpacing:1,marginBottom:4}}>PENDING BALANCE</div>
              <div style={{fontSize:34,fontWeight:700,color:G}}>₹{d.pending.toLocaleString("en-IN")}</div>
              <div style={{fontSize:11,color:"#636e72",fontFamily:"sans-serif",marginBottom:12}}>Available to withdraw · Min ₹500</div>
              <button style={{...bG,width:"100%",padding:12,fontSize:14}} onClick={()=>setShowW(true)}>💸 Request Withdrawal</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:9,marginBottom:12}}>
              {[["💰 Today","₹"+d.today.toLocaleString("en-IN"),d.sessions.today+" sessions","#00b894"],["📅 This Week","₹"+d.week.toLocaleString("en-IN"),d.sessions.week+" sessions","#a29bfe"],["🗓 This Month","₹"+d.month.toLocaleString("en-IN"),d.sessions.month+" sessions","#fd79a8"],["💎 All Time","₹"+d.total.toLocaleString("en-IN"),"₹"+d.withdrawn.toLocaleString("en-IN")+" withdrawn","#ffd700"]].map(([l,v,s,c])=>(
                <div key={l} style={{...cd,marginBottom:0}}><div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif",marginBottom:4}}>{l}</div><div style={{fontSize:18,fontWeight:700,color:c,fontFamily:"sans-serif"}}>{v}</div><div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif",marginTop:2}}>{s}</div></div>
              ))}
            </div>
            <div style={cd}>
              <div style={{fontSize:13,fontWeight:700,color:G,marginBottom:12}}>Monthly Earnings (₹)</div>
              <div style={{display:"flex",alignItems:"flex-end",gap:4,height:85,marginBottom:8}}>
                {[28,34,22,41,38,52,44,61,58,72,68,92].map((v,i)=>(
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                    <div style={{width:"100%",background:i===11?"rgba(255,215,0,.7)":"rgba(255,215,0,.22)",borderRadius:"3px 3px 0 0",height:(v/92*80)+"%",minHeight:3}}/>
                    <div style={{fontSize:6,color:"#636e72",fontFamily:"sans-serif"}}>{"JFMAMJJASOND"[i]}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif"}}>Rate: ₹{d.rate}/min · 70% your share</div><div style={{fontSize:10,color:"#00b894",fontFamily:"sans-serif"}}>↑18% vs last month</div></div>
            </div>
            <div style={cd}>
              <div style={{fontSize:13,fontWeight:700,color:G,marginBottom:12}}>💡 Earnings Breakdown</div>
              {[["Total Earned","₹"+d.total.toLocaleString("en-IN"),0],["Platform Fee (30%)","₹"+(Math.round(d.total*0.3)).toLocaleString("en-IN"),1],["Your Share (70%)","₹"+(Math.round(d.total*0.7)).toLocaleString("en-IN"),2],["Already Withdrawn","₹"+d.withdrawn.toLocaleString("en-IN"),3],["Pending Payout","₹"+d.pending.toLocaleString("en-IN"),4]].map(([k,v,i])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(200,150,50,.07)"}}>
                  <div style={{fontSize:12,color:"#8a7a6a",fontFamily:"sans-serif"}}>{k}</div>
                  <div style={{fontSize:12,fontWeight:700,color:i===4?"#00b894":i===1?"#ff4757":"#e8d5b7",fontFamily:"sans-serif"}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab==="sessions"&&(
          <div style={{animation:"floatIn .35s ease"}}>
            <div style={{fontSize:14,fontWeight:700,color:G,marginBottom:10}}>💬 Recent Sessions</div>
            {d.recentSessions.map((s,i)=>(
              <div key={i} style={{...cd,display:"flex",gap:11,alignItems:"flex-start"}}>
                <div style={{width:38,height:38,borderRadius:9,background:"rgba(162,155,254,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>💬</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div><div style={{fontSize:13,fontWeight:600,color:"#e8d5b7",fontFamily:"sans-serif"}}>{s.customer}</div><div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif"}}>{s.duration} · {s.time}</div></div>
                    <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:700,color:"#00b894",fontFamily:"sans-serif"}}>+₹{s.earned}</div><div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif"}}>{"⭐".repeat(s.rating)}</div></div>
                  </div>
                  <div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif",marginTop:5}}>🪙{s.coins} coins · You earned ₹{s.earned} (70%)</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab==="withdraw"&&(
          <div style={{animation:"floatIn .35s ease"}}>
            <div style={{...cd,background:"linear-gradient(135deg,rgba(255,215,0,.08),rgba(10,0,21,.9))",border:"1px solid rgba(255,215,0,.25)",textAlign:"center",marginBottom:14}}>
              <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",marginBottom:3}}>AVAILABLE TO WITHDRAW</div>
              <div style={{fontSize:30,fontWeight:700,color:G}}>₹{d.pending.toLocaleString("en-IN")}</div>
              <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif"}}>Min ₹500 · Processed in 3-5 working days</div>
            </div>
            <div style={{...cd,marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:700,color:G,marginBottom:10}}>🏦 Bank Account on File</div>
              {[["Bank","HDFC Bank"],["Account","****4521"],["IFSC","HDFC0001234"],["Name","Rajesh Sharma"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(200,150,50,.07)"}}>
                  <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif"}}>{k}</div>
                  <div style={{fontSize:11,fontWeight:600,color:"#e8d5b7",fontFamily:"sans-serif"}}>{v}</div>
                </div>
              ))}
              <button style={{...bO,width:"100%",marginTop:10,fontSize:11}}>✏️ Update Bank Details</button>
            </div>
            <div style={{fontSize:13,fontWeight:700,color:G,marginBottom:10}}>📋 Withdrawal History</div>
            {d.withdrawalHistory.map(w=>(
              <div key={w.id} style={{...cd,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontSize:13,fontWeight:700,color:G,fontFamily:"sans-serif"}}>₹{w.amount.toLocaleString("en-IN")}</div><div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif"}}>{w.bank} · {w.date}</div></div>
                <Badge label={w.status} color={w.status}/>
              </div>
            ))}
          </div>
        )}
      </div>
      {showW&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.82)",zIndex:400,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div style={{background:"linear-gradient(180deg,#0f0025,#0a0018)",border:"1px solid rgba(200,150,50,.28)",borderRadius:"22px 22px 0 0",padding:"22px 18px 38px",width:"100%",maxWidth:480}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontSize:16,fontWeight:700,color:G}}>💸 Request Withdrawal</div>
              <button onClick={()=>setShowW(false)} style={{background:"none",border:"none",color:"#8a7a6a",fontSize:19,cursor:"pointer"}}>✕</button>
            </div>
            <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",marginBottom:4,letterSpacing:1}}>AMOUNT (₹)</div>
            <input type="number" value={wAmt} onChange={e=>setWAmt(e.target.value)} placeholder={"Max ₹"+d.pending.toLocaleString("en-IN")} style={{width:"100%",background:"rgba(255,255,255,.06)",border:"1px solid rgba(200,150,50,.28)",borderRadius:11,padding:"14px 13px",color:G,fontFamily:"sans-serif",fontSize:22,fontWeight:700,outline:"none",boxSizing:"border-box",marginBottom:6}}/>
            <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif",marginBottom:14}}>Credited to HDFC Bank ****4521 in 3-5 working days</div>
            <div style={{display:"flex",gap:9}}>
              <button style={{...bO,flex:1}} onClick={()=>setShowW(false)}>Cancel</button>
              <button disabled={wProc} style={{...bG,flex:2,padding:13,display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={requestWithdrawal}>
                {wProc&&<Sp size={15}/>}{wProc?"Submitting…":"Request ₹"+(Number(wAmt)||0).toLocaleString("en-IN")}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Send Message to User Modal */}
      {showMsgModal&&msgUser&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"linear-gradient(180deg,#0f0025,#080618)",border:"1px solid rgba(162,155,254,.25)",borderRadius:18,padding:"22px 18px",width:"100%",maxWidth:380}}>
            {!msgSent?(
              <div>
                <div style={{textAlign:"center",marginBottom:16}}>
                  <div style={{fontSize:24,marginBottom:6}}>&#128140;</div>
                  <div style={{fontSize:15,fontWeight:700,color:"#a29bfe",marginBottom:3}}>Send Notification</div>
                  <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif"}}>Sending to: <strong style={{color:"#e8d5b7"}}>{msgUser.name}</strong></div>
                </div>
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1,marginBottom:6}}>SELECT TEMPLATE</div>
                  <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:10}}>
                    {[
                      "Your account has received a warning due to reported behaviour.",
                      "Please review our community guidelines to continue using MiraXAstro.",
                      "Your account has been temporarily suspended pending review.",
                      "Custom message..."
                    ].map(t=>(
                      <div key={t} onClick={()=>setMsgText(t==="Custom message..."?"":t)} style={{padding:"8px 12px",borderRadius:9,border:"1px solid",borderColor:msgText===t?"rgba(162,155,254,.5)":"rgba(200,150,50,.15)",background:msgText===t?"rgba(162,155,254,.08)":"transparent",fontSize:11,fontFamily:"sans-serif",color:msgText===t?"#a29bfe":"#8a7a6a",cursor:"pointer"}}>{t}</div>
                    ))}
                  </div>
                  <textarea value={msgText} onChange={e=>setMsgText(e.target.value)} placeholder="Type your message to the user..." rows={3} style={{width:"100%",background:"#0d0a1a",border:"1px solid rgba(200,150,50,.25)",borderRadius:10,padding:"10px 12px",color:"#e8d5b7",fontFamily:"sans-serif",fontSize:12,outline:"none",resize:"none",boxSizing:"border-box"}}/>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setShowMsgModal(false)} style={{flex:1,background:"transparent",border:"1px solid rgba(200,150,50,.2)",borderRadius:9,padding:"9px",color:"#8a7a6a",fontFamily:"sans-serif",fontSize:12,cursor:"pointer"}}>Cancel</button>
                  <button disabled={!msgText.trim()} onClick={()=>{if(msgText.trim())setMsgSent(true);}} style={{flex:2,background:msgText.trim()?"linear-gradient(135deg,#5f3dc4,#a29bfe)":"rgba(100,100,100,.2)",color:msgText.trim()?"white":"#636e72",border:"none",borderRadius:9,padding:"9px",fontWeight:700,fontFamily:"sans-serif",fontSize:12,cursor:msgText.trim()?"pointer":"not-allowed"}}>Send Notification</button>
                </div>
              </div>
            ):(
              <div style={{textAlign:"center",padding:"16px 0"}}>
                <div style={{fontSize:36,marginBottom:10}}>&#10003;</div>
                <div style={{fontSize:15,fontWeight:700,color:"#00b894",marginBottom:6}}>Notification Sent!</div>
                <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.7,marginBottom:14}}>{msgUser.name} has been notified via email and in-app notification.</div>
                <button onClick={()=>setShowMsgModal(false)} style={{...bG,padding:"9px 24px"}}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}

      {toast&&<div style={{position:"fixed",bottom:22,left:"50%",transform:"translateX(-50%)",background:"rgba(0,184,148,.93)",color:"white",padding:"10px 20px",borderRadius:12,fontFamily:"sans-serif",fontSize:13,fontWeight:600,zIndex:600,whiteSpace:"nowrap",animation:"floatIn .3s ease"}}>{toast.m}</div>}
    </div>
  );
}

export default function App(){
  const [auth,setAuth]=useState(false);
  const [pw,setPw]=useState("");
  const [err,setErr]=useState(false);
  const [view,setView]=useState("admin");
  const [showPwChange,setShowPwChange]=useState(false);
  const [oldPw,setOldPw]=useState("");
  const [newPw,setNewPw]=useState("");
  const [confirmPw,setConfirmPw]=useState("");
  const [pwMsg,setPwMsg]=useState({t:"",c:""});
  const [showForgot,setShowForgot]=useState(false);
  const [forgotStep,setForgotStep]=useState(1);
  const [otpSent,setOtpSent]=useState("");
  const [otpEntered,setOtpEntered]=useState("");
  const [otpCountdown,setOtpCountdown]=useState(0);
  const [resetNew,setResetNew]=useState("");
  const [resetConfirm,setResetConfirm]=useState("");
  const [resetMsg,setResetMsg]=useState({t:"",c:""});
  const otpTimer=React.useRef();
  const ADMIN_EMAIL="support@miraxastro.com";

  const ADMIN_PW=localStorage.getItem("mxa_admin_pw")||"MiraX@Admin2025";

  function login(){
    const current=localStorage.getItem("mxa_admin_pw")||"MiraX@Admin2025";
    if(pw===current){setAuth(true);setErr(false);}
    else{setErr(true);}
  }

  function changePw(){
    const current=localStorage.getItem("mxa_admin_pw")||"MiraX@Admin2025";
    if(oldPw!==current){setPwMsg({t:"Current password incorrect",c:"#ff4757"});return;}
    if(newPw.length<8){setPwMsg({t:"Min 8 characters required",c:"#ff4757"});return;}
    if(newPw!==confirmPw){setPwMsg({t:"Passwords do not match",c:"#ff4757"});return;}
    localStorage.setItem("mxa_admin_pw",newPw);
    setPwMsg({t:"Password updated successfully!",c:"#00b894"});
    setOldPw("");setNewPw("");setConfirmPw("");
    setTimeout(()=>{setShowPwChange(false);setPwMsg({t:"",c:""});},2000);
  }

  function sendOtp(){
    const otp=String(Math.floor(100000+Math.random()*900000));
    setOtpSent(otp);
    setOtpEntered("");
    setResetMsg({t:"",c:""});
    setForgotStep(2);
    setOtpCountdown(60);
    clearInterval(otpTimer.current);
    otpTimer.current=setInterval(()=>setOtpCountdown(c=>{if(c<=1){clearInterval(otpTimer.current);return 0;}return c-1;}),1000);
    console.log("Admin Reset OTP (demo):",otp);
  }
  function verifyResetOtp(){
    if(otpEntered.trim()===otpSent){
      setForgotStep(3);
      setResetMsg({t:"",c:""});
    } else {
      setResetMsg({t:"Incorrect code. Please try again.",c:"#ff4757"});
    }
  }
  function resetPw(){
    if(resetNew.length<8){setResetMsg({t:"Min 8 characters required",c:"#ff4757"});return;}
    if(resetNew!==resetConfirm){setResetMsg({t:"Passwords do not match",c:"#ff4757"});return;}
    localStorage.setItem("mxa_admin_pw",resetNew);
    setResetMsg({t:"Password reset successfully!",c:"#00b894"});
    setResetNew("");setResetConfirm("");
    setTimeout(()=>{
      setShowForgot(false);
      setForgotStep(1);
      setOtpSent("");setOtpEntered("");
      setResetMsg({t:"",c:""});
      setPw("");setErr(false);
    },2000);
  }
  function closeForgot(){
    setShowForgot(false);
    setForgotStep(1);
    setOtpSent("");setOtpEntered("");
    setResetNew("");setResetConfirm("");
    setResetMsg({t:"",c:""});
    clearInterval(otpTimer.current);
  }

  const ip2={width:"100%",background:"#0d0a1a",border:"1px solid rgba(200,150,50,.28)",borderRadius:11,padding:"11px 13px",color:"#e8d5b7",fontFamily:"sans-serif",fontSize:13,outline:"none",boxSizing:"border-box",marginBottom:10};

  // -- Login Screen ------------------------------------------
  if(!auth) return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0a0015,#0d0028,#010a1a)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"Georgia,serif"}}>
      <div style={{width:"100%",maxWidth:360}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:70,height:70,borderRadius:"50%",border:"1px solid rgba(232,213,183,.35)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",background:"rgba(162,155,254,.05)"}}>
            <span style={{fontSize:28,fontWeight:700,fontFamily:"Georgia,serif",background:"linear-gradient(135deg,#f0dfc0,#7b6fc4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>MX</span>
          </div>
          <div style={{fontSize:20,fontWeight:300,letterSpacing:4,color:"#e8d5b7"}}>
            Mira<span style={{background:"linear-gradient(135deg,#7b6fc4,#b8aae8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontWeight:400}}>X</span>Astro
          </div>
          <div style={{fontSize:11,color:"#a29bfe",fontFamily:"sans-serif",letterSpacing:2,marginTop:6}}>ADMIN PANEL</div>
          <div style={{fontSize:10,color:"#636e72",fontFamily:"sans-serif",marginTop:4}}>Restricted Access - Authorised Personnel Only</div>
        </div>

        {/* Login card */}
        <div style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(200,150,50,.2)",borderRadius:18,padding:"24px 20px"}}>
          <div style={{fontSize:13,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1,marginBottom:6}}>ADMIN PASSWORD</div>
          <input
            type="password"
            value={pw}
            onChange={e=>{setPw(e.target.value);setErr(false);}}
            onKeyDown={e=>e.key==="Enter"&&login()}
            placeholder="Enter admin password"
            autoFocus
            style={{...ip2,fontSize:15,marginBottom:err?6:12}}
          />
          {err&&<div style={{fontSize:12,color:"#ff4757",fontFamily:"sans-serif",marginBottom:10}}>&#9888; Incorrect password. Please try again.</div>}
          <button
            onClick={login}
            style={{width:"100%",background:"linear-gradient(135deg,#c8a000,#ffd700)",color:"#0a0015",border:"none",borderRadius:11,padding:"13px",fontWeight:700,fontFamily:"sans-serif",fontSize:14,cursor:"pointer"}}
          >
            Access Admin Panel
          </button>
          <div style={{textAlign:"center",marginTop:12}}>
            <button onClick={()=>{setShowForgot(true);setResetMsg({t:"",c:""});}} style={{background:"none",border:"none",color:"#8a7a6a",fontFamily:"sans-serif",fontSize:12,cursor:"pointer",textDecoration:"underline"}}>
              Forgot password?
            </button>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {showForgot&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div style={{background:"linear-gradient(180deg,#0f0025,#0a0018)",border:"1px solid rgba(255,215,0,.2)",borderRadius:18,padding:"26px 20px",width:"100%",maxWidth:340}}>

              {/* Step 1 - Send OTP */}
              {forgotStep===1&&(
                <div>
                  <div style={{textAlign:"center",marginBottom:18}}>
                    <div style={{fontSize:30,marginBottom:8}}>&#128272;</div>
                    <div style={{fontSize:16,fontWeight:700,color:"#ffd700",marginBottom:4}}>Reset Admin Password</div>
                    <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.6}}>We will send a one-time code to your registered admin email address.</div>
                  </div>
                  <div style={{background:"rgba(162,155,254,.06)",border:"1px solid rgba(162,155,254,.2)",borderRadius:10,padding:"12px 14px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:20}}>&#9993;</span>
                    <div>
                      <div style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif",letterSpacing:1,marginBottom:2}}>SENDING CODE TO</div>
                      <div style={{fontSize:13,fontWeight:700,color:"#e8d5b7",fontFamily:"sans-serif"}}>{ADMIN_EMAIL}</div>
                    </div>
                  </div>
                  {resetMsg.t&&<div style={{fontSize:12,color:resetMsg.c,fontFamily:"sans-serif",marginBottom:10,padding:"7px 10px",background:"rgba(255,255,255,.04)",borderRadius:8}}>{resetMsg.t}</div>}
                  <button onClick={sendOtp} style={{width:"100%",background:"linear-gradient(135deg,#c8a000,#ffd700)",color:"#0a0015",border:"none",borderRadius:10,padding:"12px",fontWeight:700,fontFamily:"sans-serif",fontSize:13,cursor:"pointer",marginBottom:8}}>
                    Send Verification Code
                  </button>
                  <button onClick={closeForgot} style={{width:"100%",background:"transparent",border:"1px solid rgba(200,150,50,.2)",borderRadius:10,padding:"10px",color:"#8a7a6a",fontFamily:"sans-serif",fontSize:12,cursor:"pointer"}}>
                    Cancel
                  </button>
                </div>
              )}

              {/* Step 2 - Enter OTP */}
              {forgotStep===2&&(
                <div>
                  <div style={{textAlign:"center",marginBottom:18}}>
                    <div style={{fontSize:30,marginBottom:8}}>&#128235;</div>
                    <div style={{fontSize:16,fontWeight:700,color:"#ffd700",marginBottom:4}}>Check Your Email</div>
                    <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif",lineHeight:1.6}}>
                      A 6-digit code was sent to<br/>
                      <strong style={{color:"#e8d5b7"}}>{ADMIN_EMAIL}</strong>
                    </div>
                    <div style={{fontSize:10,color:"#a29bfe",fontFamily:"sans-serif",marginTop:8,background:"rgba(162,155,254,.08)",padding:"4px 10px",borderRadius:6,display:"inline-block"}}>
                      Demo mode - check browser console for OTP
                    </div>
                  </div>
                  <div style={{marginBottom:14}}>
                    <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1,marginBottom:6}}>ENTER 6-DIGIT CODE</div>
                    <input
                      value={otpEntered}
                      onChange={e=>setOtpEntered(e.target.value.replace(/\D/g,"").slice(0,6))}
                      onKeyDown={e=>e.key==="Enter"&&verifyResetOtp()}
                      placeholder="_ _ _ _ _ _"
                      maxLength={6}
                      style={{...ip2,fontSize:22,fontWeight:700,textAlign:"center",letterSpacing:8,color:"#ffd700",marginBottom:8}}
                    />
                    {resetMsg.t&&<div style={{fontSize:12,color:resetMsg.c,fontFamily:"sans-serif",marginBottom:8,padding:"7px 10px",background:"rgba(255,255,255,.04)",borderRadius:8}}>&#9888; {resetMsg.t}</div>}
                  </div>
                  <button onClick={verifyResetOtp} disabled={otpEntered.length!==6} style={{width:"100%",background:otpEntered.length===6?"linear-gradient(135deg,#c8a000,#ffd700)":"rgba(100,100,100,.2)",color:otpEntered.length===6?"#0a0015":"#636e72",border:"none",borderRadius:10,padding:"12px",fontWeight:700,fontFamily:"sans-serif",fontSize:13,cursor:otpEntered.length===6?"pointer":"not-allowed",marginBottom:10}}>
                    Verify Code
                  </button>
                  <div style={{textAlign:"center",marginBottom:8}}>
                    {otpCountdown>0
                      ?<div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif"}}>Resend code in {otpCountdown}s</div>
                      :<button onClick={sendOtp} style={{background:"none",border:"none",color:"#ffd700",fontFamily:"sans-serif",fontSize:12,cursor:"pointer",textDecoration:"underline"}}>Resend Code</button>
                    }
                  </div>
                  <button onClick={closeForgot} style={{width:"100%",background:"transparent",border:"1px solid rgba(200,150,50,.2)",borderRadius:10,padding:"10px",color:"#8a7a6a",fontFamily:"sans-serif",fontSize:12,cursor:"pointer"}}>
                    Cancel
                  </button>
                </div>
              )}

              {/* Step 3 - Set New Password */}
              {forgotStep===3&&(
                <div>
                  <div style={{textAlign:"center",marginBottom:18}}>
                    <div style={{fontSize:30,marginBottom:8}}>&#128274;</div>
                    <div style={{fontSize:16,fontWeight:700,color:"#00b894",marginBottom:4}}>Identity Verified ✓</div>
                    <div style={{fontSize:11,color:"#8a7a6a",fontFamily:"sans-serif"}}>Now set your new admin password</div>
                  </div>
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1,marginBottom:5}}>NEW PASSWORD</div>
                    <input type="password" value={resetNew} onChange={e=>setResetNew(e.target.value)} placeholder="Min 8 characters" style={{...ip2}}/>
                    <div style={{fontSize:11,color:"#c8a060",fontFamily:"sans-serif",letterSpacing:1,marginBottom:5}}>CONFIRM NEW PASSWORD</div>
                    <input type="password" value={resetConfirm} onChange={e=>setResetConfirm(e.target.value)} onKeyDown={e=>e.key==="Enter"&&resetPw()} placeholder="Repeat new password" style={{...ip2,marginBottom:8}}/>
                    {resetMsg.t&&<div style={{fontSize:12,color:resetMsg.c,fontFamily:"sans-serif",marginBottom:8,padding:"7px 10px",background:"rgba(255,255,255,.04)",borderRadius:8}}>{resetMsg.t}</div>}
                  </div>
                  <button onClick={resetPw} style={{width:"100%",background:"linear-gradient(135deg,#c8a000,#ffd700)",color:"#0a0015",border:"none",borderRadius:10,padding:"12px",fontWeight:700,fontFamily:"sans-serif",fontSize:13,cursor:"pointer",marginBottom:8}}>
                    Reset Password
                  </button>
                  <button onClick={closeForgot} style={{width:"100%",background:"transparent",border:"1px solid rgba(200,150,50,.2)",borderRadius:10,padding:"10px",color:"#8a7a6a",fontFamily:"sans-serif",fontSize:12,cursor:"pointer"}}>
                    Cancel
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

                {/* Security note */}
        <div style={{textAlign:"center",marginTop:16,fontSize:10,color:"rgba(255,255,255,.15)",fontFamily:"sans-serif"}}>
          &#128274; Secured · MiraXAstro Admin Portal
        </div>
      </div>
    </div>
  );

  // -- Admin Dashboard ---------------------------------------
  return(
    <div>
      {/* Top bar */}
      <div style={{position:"fixed",top:0,left:0,right:0,height:48,background:"rgba(10,0,21,.97)",borderBottom:"1px solid rgba(200,150,50,.2)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",zIndex:500}}>
        <div style={{fontSize:14,fontWeight:700,color:"#ffd700",fontFamily:"Georgia,serif"}}>
          Mira<span style={{background:"linear-gradient(135deg,#7b6fc4,#b8aae8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>X</span>Astro
          <span style={{fontSize:10,color:"#8a7a6a",fontFamily:"sans-serif",marginLeft:8,fontWeight:400}}>Admin</span>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={()=>setView("admin")} style={{padding:"5px 12px",borderRadius:8,border:"1px solid",borderColor:view==="admin"?"rgba(255,215,0,.5)":"rgba(255,255,255,.1)",background:view==="admin"?"rgba(255,215,0,.1)":"transparent",color:view==="admin"?"#ffd700":"#8a7a6a",fontFamily:"sans-serif",fontSize:11,cursor:"pointer"}}>
            Dashboard
          </button>
          <button onClick={()=>setView("astro")} style={{padding:"5px 12px",borderRadius:8,border:"1px solid",borderColor:view==="astro"?"rgba(162,155,254,.5)":"rgba(255,255,255,.1)",background:view==="astro"?"rgba(162,155,254,.1)":"transparent",color:view==="astro"?"#a29bfe":"#8a7a6a",fontFamily:"sans-serif",fontSize:11,cursor:"pointer"}}>
            Earnings
          </button>
          <button onClick={()=>setShowPwChange(v=>!v)} style={{padding:"5px 10px",borderRadius:8,border:"1px solid rgba(255,255,255,.1)",background:"transparent",color:"#8a7a6a",fontFamily:"sans-serif",fontSize:11,cursor:"pointer"}}>
            &#128274;
          </button>
          <button onClick={()=>{setAuth(false);setPw("");}} style={{padding:"5px 12px",borderRadius:8,border:"1px solid rgba(255,71,87,.3)",background:"rgba(255,71,87,.08)",color:"#ff8a80",fontFamily:"sans-serif",fontSize:11,cursor:"pointer"}}>
            Logout
          </button>
        </div>
      </div>

      {/* Change password slide-down */}
      {showPwChange&&(
        <div style={{position:"fixed",top:48,right:0,width:300,background:"#0d0a1a",border:"1px solid rgba(200,150,50,.25)",borderRadius:"0 0 0 12px",padding:"16px",zIndex:499,boxShadow:"0 8px 24px rgba(0,0,0,.6)"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#ffd700",fontFamily:"sans-serif",marginBottom:12}}>Change Admin Password</div>
          <input type="password" value={oldPw} onChange={e=>setOldPw(e.target.value)} placeholder="Current password" style={{...ip2,fontSize:12}}/>
          <input type="password" value={newPw} onChange={e=>setNewPw(e.target.value)} placeholder="New password (min 8 chars)" style={{...ip2,fontSize:12}}/>
          <input type="password" value={confirmPw} onChange={e=>setConfirmPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&changePw()} placeholder="Confirm new password" style={{...ip2,fontSize:12,marginBottom:8}}/>
          {pwMsg.t&&<div style={{fontSize:11,color:pwMsg.c,fontFamily:"sans-serif",marginBottom:8}}>{pwMsg.t}</div>}
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{setShowPwChange(false);setPwMsg({t:"",c:""}); }} style={{flex:1,background:"transparent",border:"1px solid rgba(200,150,50,.2)",borderRadius:8,padding:"7px",color:"#8a7a6a",fontFamily:"sans-serif",fontSize:11,cursor:"pointer"}}>Cancel</button>
            <button onClick={changePw} style={{flex:2,background:"linear-gradient(135deg,#c8a000,#ffd700)",color:"#0a0015",border:"none",borderRadius:8,padding:"7px",fontWeight:700,fontFamily:"sans-serif",fontSize:11,cursor:"pointer"}}>Update</button>
          </div>
        </div>
      )}

      {/* Main content - push down for top bar */}
      <div style={{paddingTop:48}}>
        {view==="admin"&&<AdminPanel/>}
        {view==="astro"&&<AstrologerEarnings/>}
      </div>
    </div>
  );
}
