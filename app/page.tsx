"use client";
import { useState, useEffect } from "react";

type Child = { id:string; name:string; phone:string; parent:string; bd:string; className:string; present:boolean; };

export default function Home(){
  const [list,setList]=useState<Child[]>([]);
  const [name,setName]=useState(""); const [phone,setPhone]=useState(""); const [parent,setParent]=useState(""); const [bd,setBd]=useState(""); const [cls,setCls]=useState("Beginners"); const [search,setSearch]=useState(""); const [filterClass,setFilterClass]=useState("All");

  useEffect(()=>{ const s=localStorage.getItem("sunday-school-v2"); if(s) setList(JSON.parse(s)); },[]);
  useEffect(()=>{ localStorage.setItem("sunday-school-v2", JSON.stringify(list));
    if(list.length>0){ const today=new Date().toISOString().slice(5,10); const todays=list.filter(x=>x.bd&&x.bd.slice(5,10)===today); if(todays.length>0){ const k="bd_"+new Date().toISOString().slice(0,10); if(!localStorage.getItem(k)){ const ok=confirm(todays.length+" Birthday(s) Today! "+todays.map(t=>t.name).join(", ")+" - AUTO SEND WhatsApp?"); if(ok){ todays.forEach((c,i)=>{ setTimeout(()=>{ let p=c.phone.replace(/\D/g,""); if(p.startsWith("0")) p="233"+p.slice(1); const msg=`Happy Birthday ${c.name}! From COP Amanfrom English Assembly Sunday School. We love you, God bless you and we pray for long life and success in your studies. Amen!`; window.open(`https://wa.me/${p}?text=${encodeURIComponent(msg)}`,"_blank"); }, i*2000); }); localStorage.setItem(k,"1"); }}}}
  },[list]);

  const addChild=()=>{ if(!name||!phone) return alert("Enter Child Name & Parent Phone"); const nc:Child={id:Date.now().toString(), name, phone, parent, bd, className:cls, present:true}; setList([...list,nc]); setName(""); setPhone(""); setParent(""); setBd(""); };
  const toggle=(id:string)=> setList(list.map(c=>c.id===id?{...c,present:!c.present}:c));
  const remove=(id:string)=>{ if(confirm("Remove?")) setList(list.filter(c=>c.id!==id)); };

  const todayStr=new Date().toISOString().slice(5,10);
  const birthdaysToday=list.filter(x=>x.bd&&x.bd.slice(5,10)===todayStr);
  const presentCount=list.filter(x=>x.present).length;
  const absentList=list.filter(x=>!x.present);

  const filtered=list.filter(c=>{
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.parent.toLowerCase().includes(search.toLowerCase());
    const matchClass = filterClass==="All" || c.className===filterClass;
    return matchSearch && matchClass;
  });

  const sendBdayAll=()=>{ if(birthdaysToday.length===0) return alert("No birthday today"); birthdaysToday.forEach((c,i)=>{ setTimeout(()=>{ let p=c.phone.replace(/\D/g,""); if(p.startsWith("0")) p="233"+p.slice(1); window.open(`https://wa.me/${p}?text=${encodeURIComponent(`Happy Birthday ${c.name}! From COP Amanfrom English Assembly Sunday School. We love you and God bless you!`)}`,"_blank"); }, i*2000); }); };
  const sendAbsent=()=>{ if(absentList.length===0) return alert("All present! No absent message needed."); if(!confirm(`AUTO SEND Absent to ${absentList.length} parents individually?`)) return; absentList.forEach((c,i)=>{ setTimeout(()=>{ let p=c.phone.replace(/\D/g,""); if(p.startsWith("0")) p="233"+p.slice(1); const msg=`Hello ${c.parent||"Parent"} of ${c.name}, ${c.name} was absent from Sunday School today at COP Amanfrom English Assembly. Service time 8am. We missed them and hope to see them next Sunday. God bless you. Thank you.`; window.open(`https://wa.me/${p}?text=${encodeURIComponent(msg)}`,"_blank"); }, i*2000); }); };

  return (
    <main className="min-h-screen bg-[#f6f8ff] text-gray-900">
      <header className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-6 shadow">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div><h1 className="text-2xl font-extrabold">COP Amanfrom</h1><p className="text-blue-100 text-sm">English Assembly - Sunday School Tracker</p></div>
          <div className="bg-white/20 px-3 py-1 rounded-full text-sm">{new Date().toLocaleDateString()}</div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        {birthdaysToday.length>0 && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-4 rounded-xl shadow mb-4 flex justify-between items-center animate-pulse">
            <div><p className="font-bold">🎂 {birthdaysToday.length} Birthday(s) Today!</p><p className="text-sm">{birthdaysToday.map(b=>b.name).join(", ")}</p></div>
            <button onClick={sendBdayAll} className="bg-white text-orange-600 font-bold px-4 py-2 rounded-lg">AUTO SEND</button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-white p-4 rounded-xl shadow"><p className="text-gray-500 text-xs">TOTAL</p><p className="text-2xl font-bold">{list.length}</p></div>
          <div className="bg-white p-4 rounded-xl shadow"><p className="text-gray-500 text-xs">PRESENT</p><p className="text-2xl font-bold text-green-600">{presentCount}</p></div>
          <div className="bg-white p-4 rounded-xl shadow"><p className="text-gray-500 text-xs">ABSENT</p><p className="text-2xl font-bold text-red-600">{list.length-presentCount}</p></div>
          <div className="bg-white p-4 rounded-xl shadow"><p className="text-gray-500 text-xs">BIRTHDAYS</p><p className="text-2xl font-bold text-orange-500">{birthdaysToday.length}</p></div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow mb-4">
          <h2 className="font-bold mb-3">Add Child</h2>
          <div className="grid md:grid-cols-5 gap-2">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Child Name" className="border p-2.5 rounded-lg" />
            <input value={parent} onChange={e=>setParent(e.target.value)} placeholder="Parent Name" className="border p-2.5 rounded-lg" />
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Parent WhatsApp 024..." className="border p-2.5 rounded-lg" />
            <input type="date" value={bd} onChange={e=>setBd(e.target.value)} className="border p-2.5 rounded-lg" />
            <select value={cls} onChange={e=>setCls(e.target.value)} className="border p-2.5 rounded-lg"><option>Beginners</option><option>Primary</option><option>Juniors</option><option>Seniors</option></select>
          </div>
          <button onClick={addChild} className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold w-full md:w-auto">+ Add Child</button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow mb-4 flex flex-col md:flex-row gap-2 justify-between">
          <div className="flex gap-2 flex-1">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search child or parent..." className="border p-2.5 rounded-lg flex-1" />
            <select value={filterClass} onChange={e=>setFilterClass(e.target.value)} className="border p-2.5 rounded-lg"><option>All Classes</option><option>Beginners</option><option>Primary</option><option>Juniors</option><option>Seniors</option></select>
          </div>
          <div className="flex gap-2">
            <button onClick={sendBdayAll} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-bold text-sm">AUTO SEND Birthday</button>
            <button onClick={sendAbsent} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-bold text-sm">AUTO SEND Absent ({absentList.length})</button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-4 border-b flex justify-between"><h2 className="font-bold">Children ({filtered.length})</h2><span className="text-sm text-gray-500">{presentCount} Present / {list.length-presentCount} Absent</span></div>
          {filtered.length===0 ? <p className="p-8 text-center text-gray-400">No children yet. Add first child above.</p> : filtered.map(c=>(
            <div key={c.id} className={`p-4 border-b flex justify-between items-center ${c.present?"":"bg-red-50"}`}>
              <div><p className="font-bold">{c.name} <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded ml-2">{c.className}</span> {c.bd&&c.bd.slice(5,10)===todayStr && <span className="text-xs bg-yellow-400 text-white px-2 py-0.5 rounded ml-1">BIRTHDAY</span>}</p><p className="text-sm text-gray-600">{c.parent?`Parent: ${c.parent} • `:''}{c.phone} {c.bd?`• BD: ${c.bd}`:''}</p></div>
              <div className="flex gap-2 items-center"><span className={`text-xs font-bold px-2 py-1 rounded ${c.present?"bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>{c.present?"Present":"Absent"}</span><button onClick={()=>toggle(c.id)} className="border px-3 py-1 rounded-lg text-sm">Toggle</button><button onClick={()=>remove(c.id)} className="text-red-500 text-sm">✕</button></div>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-400 text-xs mt-6">Built for COP Amanfrom English Assembly • Automatic Birthday & Absent WhatsApp</p>
      </div>
    </main>
  );
}