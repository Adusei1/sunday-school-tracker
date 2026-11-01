"use client";
import { useState, useEffect } from "react";

type Child = { id:string; name:string; phone:string; bd:string; class:string; present:boolean };

export default function Home(){
  const [list,setList]=useState<Child[]>([]);
  const [name,setName]=useState("");
  const [phone,setPhone]=useState("");
  const [bd,setBd]=useState("");
  const [cls,setCls]=useState("Beginners");

  useEffect(()=>{
    const saved = localStorage.getItem("sunday-school");
    if(saved) setList(JSON.parse(saved));
  },[]);

  useEffect(()=>{
    localStorage.setItem("sunday-school", JSON.stringify(list));
    if(list.length>0){
      const today = new Date().toISOString().slice(5,10);
      const todays = list.filter(x=> x.bd && x.bd.slice(5,10)===today);
      if(todays.length>0){
        const k="bd_"+new Date().toISOString().slice(0,10);
        if(!localStorage.getItem(k)){
          const ok = confirm(todays.length+" birthday(s) today! AUTO SEND WhatsApp?");
          if(ok){
            todays.forEach((c:any,i:number)=>{
              setTimeout(()=>{
                let p=c.phone.replace(/\D/g,"");
                if(p.startsWith("0")) p="233"+p.slice(1);
                const msg=`Happy Birthday ${c.name}! From COP Amanfrom Sunday School. We love you, God bless you and we wish you long life and success in your studies!`;
                window.open(`https://wa.me/${p}?text=${encodeURIComponent(msg)}`, "_blank");
              }, i*2000);
            });
            localStorage.setItem(k,"1");
          }
        }
      }
    }
  },[list]);

  const addChild=()=>{
    if(!name || !phone) return alert("Add name & phone");
    const newChild:Child={id:Date.now().toString(), name, phone, bd, class:cls, present:true};
    setList([...list,newChild]);
    setName(""); setPhone(""); setBd("");
  };
  const toggle=(id:string)=>{ setList(list.map(c=> c.id===id ? {...c, present:!c.present}:c)); };
  const finishBoth=()=>{
    const ab=list.filter(x=>!x.present);
    if(ab.length===0) return alert("All present!");
    if(!confirm("AUTO SEND ABSENT? "+ab.length+" children")) return;
    ab.forEach((c:any,i:number)=>{
      setTimeout(()=>{
        let p=c.phone.replace(/\D/g,""); if(p.startsWith("0")) p="233"+p.slice(1);
        window.open(`https://wa.me/${p}?text=${encodeURIComponent("Hello parent of "+c.name+", "+c.name+" was absent from Sunday School today at COP Amanfrom English Assembly. Service time 8am. We missed them and hope to see them next Sunday. Thank you.")}`, "_blank");
      }, i*2000);
    });
  };
  const sendBdayAll=()=>{
    const today = new Date().toISOString().slice(5,10);
    const todays = list.filter(x=> x.bd && x.bd.slice(5,10)===today);
    if(todays.length===0) return alert("No birthday today");
    todays.forEach((c:any,i:number)=>{
      setTimeout(()=>{
        let p=c.phone.replace(/\D/g,""); if(p.startsWith("0")) p="233"+p.slice(1);
        window.open(`https://wa.me/${p}?text=${encodeURIComponent("Happy Birthday "+c.name+"! From COP Amanfrom Sunday School. We love you, God bless you and we wish you long life!")}`, "_blank");
      }, i*2000);
    });
  };

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">COP Amanfrom - Sunday School Tracker</h1>
      <div className="mt-4 border p-3 rounded">
        <input className="border p-2 m-1" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="border p-2 m-1" placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
        <input className="border p-2 m-1" type="date" value={bd} onChange={e=>setBd(e.target.value)} />
        <button className="bg-blue-600 text-white p-2 rounded m-1" onClick={addChild}>Add Child</button>
      </div>
      <div className="mt-4 flex gap-2">
        <button className="bg-green-600 text-white p-2 rounded" onClick={sendBdayAll}>AUTO SEND Birthday</button>
        <button className="bg-red-600 text-white p-2 rounded" onClick={finishBoth}>AUTO SEND Absent</button>
      </div>
      <div className="mt-4">
        <h2 className="font-bold">Children ({list.length})</h2>
        {list.map(c=>(
          <div key={c.id} className="border p-2 mt-1 flex justify-between">
            <span>{c.name} - {c.phone} - {c.bd} - {c.present?"Present":"Absent"}</span>
            <button className="bg-gray-200 p-1" onClick={()=>toggle(c.id)}>Toggle</button>
          </div>
        ))}
      </div>
    </main>
  );
}