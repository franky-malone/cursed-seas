import React, {useEffect, useRef, useState} from 'react';


import styles from './initiative-tracker.module.css';



const KEY = 'cursed-seas-initiative-v1';

const PLAYERS = ['Golt', 'Kespien', 'Jori', 'Count Virgula'];

const CONDITIONS = ['Blinded','Charmed','Deafened','Frightened','Grappled','Incapacitated','Invisible','Paralyzed','Petrified','Poisoned','Prone','Restrained','Stunned','Unconscious','Concentrating','Exhaustion'];

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const actor = (name,type='monster',init=null,maxHp=0) => ({id:uid(),name,type,init,hp:maxHp,maxHp,conditions:[],notes:'',defeated:false});

const initial = () => ({actors:[],round:1,active:null,started:false});

const number = (v,f=0) => v === '' || v === null || v === undefined ? f : Number.isFinite(Number(v)) ? Number(v) : f;

const initiative = a => a.init === null || a.init === undefined || a.init === '' ? -Infinity : number(a.init,-Infinity);

const sortActors = a => [...a].sort((x,y)=>initiative(y)-initiative(x) || x.name.localeCompare(y.name));

export default function InitiativeTracker(){

  const [combat,setCombat] = useState(initial);

  const [ready,setReady] = useState(false);

  const [form,setForm] = useState({name:'',type:'monster',init:'',hp:'20',count:'1'});

  const [expanded,setExpanded] = useState({});

  const [amounts,setAmounts] = useState({});

  const [choices,setChoices] = useState({});

  const [message,setMessage] = useState('');

  const [addPanelExpanded,setAddPanelExpanded] = useState(false);

  const importInput = useRef(null);

  const scrollToActive = useRef(false);

  useEffect(()=>{

    try {

      const data=JSON.parse(window.localStorage.getItem(KEY));

      if(data&&Array.isArray(data.actors))setCombat({...initial(),...data});

    } catch(e) {console.warn('Saved combat unavailable',e);}

    setReady(true);

  },[]);

  useEffect(()=>{

    if(ready)try{window.localStorage.setItem(KEY,JSON.stringify(combat));}

    catch(e){console.warn('Cannot save combat',e);}

  },[combat,ready]);

  useEffect(()=>{

    if(!scrollToActive.current || !combat.started || !combat.active)return;

    scrollToActive.current=false;

    const id=combat.active;

    // Wait until React has rendered the new active combatant.

    const frame=window.requestAnimationFrame(()=>{

      const target=Array.from(document.querySelectorAll('[data-combatant-id]'))

        .find(el=>el.getAttribute('data-combatant-id')===id);

      if(target){

        const top=target.getBoundingClientRect().top+window.scrollY-88;

        window.scrollTo({top:Math.max(0,top),behavior:'smooth'});

      }

    });

    return ()=>window.cancelAnimationFrame(frame);

  },[combat.active,combat.started,combat.round]);

  const exportBattle=()=>{

    const payload={format:'cursed-seas-initiative',version:1,exportedAt:new Date().toISOString(),combat};

    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});

    const url=URL.createObjectURL(blob);

    const link=document.createElement('a');link.href=url;

    link.download=`cursed-seas-battle-${new Date().toISOString().slice(0,10)}.json`;

    document.body.appendChild(link);link.click();link.remove();

    window.setTimeout(()=>URL.revokeObjectURL(url),1000);

    setMessage('Battle exported as JSON.');

  };

  const importBattle=async e=>{

    const file=e.target.files?.[0];

    e.target.value='';

    if(!file)return;

    try{

      if(file.size>2_000_000)throw new Error('File is too large (maximum 2 MB).');

      const payload=JSON.parse(await file.text());

      if(payload?.format!=='cursed-seas-initiative'||payload?.version!==1)throw new Error('This is not a compatible Initiative Tracker export.');

      const data=payload.combat;

      if(!data||!Array.isArray(data.actors)||data.actors.length>500)throw new Error('Invalid combatant list.');

      const ids=new Set();

      const actors=data.actors.map((a,i)=>{

        if(!a||typeof a!=='object'||typeof a.name!=='string'||a.name.length>200||!['player','monster'].includes(a.type)||!Array.isArray(a.conditions)||a.conditions.length>30||a.conditions.some(c=>typeof c!=='string'||c.length>100)||typeof a.notes!=='string'&&a.notes!==undefined)throw new Error(`Invalid combatant at position ${i+1}.`);

        const id=typeof a.id==='string'&&a.id.length<150&&!ids.has(a.id)?a.id:uid()+`-${i}`;

        ids.add(id);

        const init=a.init===null||a.init===undefined||a.init===''?null:Number(a.init);

        if(init!==null&&!Number.isFinite(init))throw new Error('Invalid initiative value.');

        const hp=Number(a.hp),maxHp=Number(a.maxHp);

        if(!Number.isFinite(hp)||!Number.isFinite(maxHp)||hp<0||maxHp<0)throw new Error('Invalid HP value.');

        return {id,name:a.name,type:a.type,init,hp,maxHp,conditions:a.conditions,notes:a.notes||'',defeated:!!a.defeated};

      });

      const round=Number(data.round);

      if(!Number.isInteger(round)||round<1||round>1000000)throw new Error('Invalid round number.');

      const active=actors.some(a=>a.id===data.active)?data.active:null;

      if(!window.confirm(`Import ${actors.length} combatants from ${file.name}? This will replace your current battle.`))return;

      setCombat({actors,round,active,started:!!data.started&&!!active});

      setExpanded({});setAmounts({});setChoices({});

      setMessage(`Imported ${actors.length} combatants successfully.`);

    }catch(err){setMessage(`Import failed: ${err.message}`);}

  };

  const ordered=sortActors(combat.actors);

  const change=(id,patch)=>setCombat(c=>({...c,actors:c.actors.map(a=>a.id===id?{...a,...patch}:a)}));

  const addPlayers=()=>{

    setCombat(c=>{

      const existing=new Set(c.actors.filter(a=>a.type==='player').map(a=>a.name.trim().toLowerCase()));

      const missing=PLAYERS.filter(name=>!existing.has(name.toLowerCase())).map(name=>actor(name,'player',null,0));

      return {...c,actors:[...c.actors,...missing]};

    });

  };

  const add=e=>{

    e.preventDefault();

    if(!form.name.trim())return;

    const count=Math.max(1,Math.min(30,Math.floor(number(form.count,1))));

    const entries=Array.from({length:count},(_,i)=>actor(count>1?`${form.name.trim()} ${i+1}`:form.name.trim(),form.type,form.init===''?null:number(form.init),Math.max(0,number(form.hp))));

    setCombat(c=>({...c,actors:[...c.actors,...entries]}));

    setForm(f=>({...f,name:''}));

  };

  const advance=step=>{

    scrollToActive.current=true;

    setCombat(c=>{

    const a=sortActors(c.actors);

    if(!a.length)return c;

    if(!c.started)return {...c,started:true,round:1,active:a[0].id};

    const idx=a.findIndex(x=>x.id===c.active);

    if(idx===-1)return {...c,active:a[0].id};

    if(step<0&&idx===0&&c.round===1)return c;

    const next=(idx+step+a.length)%a.length;

    return {...c,active:a[next].id,round:Math.max(1,c.round+(step>0&&idx===a.length-1?1:0)-(step<0&&idx===0?1:0))};

    });

  };

  const hp=(a,sign)=>{

    const delta=Math.abs(number(amounts[a.id]));

    change(a.id,{hp:Math.max(0,Math.min(a.maxHp||999999,number(a.hp)+sign*delta))});

    setAmounts(v=>({...v,[a.id]:''}));

  };

  const toggle=(a,condition)=>{

    const current=a.conditions||[];

    change(a.id,{conditions:current.includes(condition)?current.filter(x=>x!==condition):[...current,condition]});

    setChoices(v=>({...v,[a.id]:''}));

  };

  const remove=id=>setCombat(c=>{

    const actors=c.actors.filter(x=>x.id!==id);

    return {...c,actors,active:c.active===id?null:c.active,started:actors.length?c.started:false};

  });

  const clear=()=>{

    if(window.confirm('Delete all combatants and reset the encounter?')){

      setCombat(initial());setExpanded({});

    }

  };

  return <>

    <main className={styles.page}>

      <header className={styles.header}>

        <div><small>CURSED SEAS · DM TOOLS</small><h1>Initiative Tracker</h1><p>Automatically saved on this device.</p></div>

        <div className={styles.round}>ROUND<strong>{combat.round}</strong></div>

      </header>

      <nav className={styles.actions} aria-label="Combat controls">

        <button onClick={()=>{if(window.confirm('Restart at round 1?'))setCombat(c=>({...c,round:1,active:null,started:false}));}}>Reset turns</button>

        <button onClick={clear}>Clear combat</button>

        <button onClick={exportBattle}>↓ Export battle</button>

        <button onClick={()=>importInput.current?.click()}>↑ Import battle</button>

        <input ref={importInput} className={styles.hiddenInput} type="file" accept=".json,application/json" aria-label="Import battle JSON" onChange={importBattle}/>

      </nav>

      {message&&<p className={styles.message} role="status">{message}</p>}

      <div className={styles.columns}>

        <section className={styles.list}>

          <div className={styles.sectionHeading}><h2>Turn order <small>({ordered.length})</small></h2><button onClick={addPlayers}>+ Add party (no initiative)</button></div>

          {!ordered.length&&<p className={styles.empty}>No combatants yet. Add the party or a monster to begin.</p>}

          {ordered.map(a=>{

            const isOpen=!!expanded[a.id];

            const isActive=combat.started&&combat.active===a.id;

            const conditions=a.conditions||[];

            return <article key={a.id} data-combatant-id={a.id} className={`${styles.card} ${isActive?styles.active:''} ${a.defeated?styles.defeated:''}`}>

              <button className={styles.summary} aria-expanded={isOpen} aria-controls={`details-${a.id}`} onClick={()=>setExpanded(s=>({...s,[a.id]:!s[a.id]}))}>

                <span className={styles.initiativeBadge}><small>INIT</small><strong>{a.init===null||a.init===undefined||a.init===''?'—':a.init}</strong></span>

                <span className={styles.summaryMain}>

                  <span className={styles.name}>{a.name||'Unnamed combatant'} {isActive&&<span className={styles.turn}>CURRENT TURN</span>}</span>

                  <span className={styles.meta}>{a.type==='player'?'Player / Ally':'Monster'} · HP {number(a.hp)}/{number(a.maxHp)}{a.defeated?' · Defeated':''}</span>

                  {!!conditions.length&&<span className={styles.conditionSummary}>{conditions.join(' · ')}</span>}

                </span>

                <span className={styles.chevron} aria-hidden="true">{isOpen?'▴':'▾'}</span>

              </button>

              {isOpen&&<div id={`details-${a.id}`} className={styles.details}>

                <div className={styles.fields}>

                  <label>Name<input value={a.name} onChange={e=>change(a.id,{name:e.target.value})}/></label>

                  <label>Initiative<input type="number" placeholder="Not rolled" value={a.init??''} onChange={e=>change(a.id,{init:e.target.value===''?null:number(e.target.value)})}/></label>

                  <label>Current HP<input type="number" min="0" value={a.hp} onChange={e=>change(a.id,{hp:Math.max(0,number(e.target.value))})}/></label>

                  <label>Max HP<input type="number" min="0" value={a.maxHp} onChange={e=>change(a.id,{maxHp:Math.max(0,number(e.target.value))})}/></label>

                </div>

                <div className={styles.editRow}>

                  <label>Damage / Healing<input type="number" min="0" placeholder="Amount" value={amounts[a.id]??''} onChange={e=>setAmounts(v=>({...v,[a.id]:e.target.value}))}/></label>

                  <button onClick={()=>hp(a,-1)}>− Damage</button>

                  <button onClick={()=>hp(a,1)}>+ Heal</button>

                </div>

                <div className={styles.editRow}>

                  <label>Conditions<select value={choices[a.id]||''} onChange={e=>setChoices(v=>({...v,[a.id]:e.target.value}))}>

                    <option value="">Select condition…</option>

                    {CONDITIONS.filter(x=>!conditions.includes(x)).map(x=><option key={x}>{x}</option>)}

                  </select></label>

                  <button disabled={!choices[a.id]} onClick={()=>toggle(a,choices[a.id])}>Add condition</button>

                </div>

                {!!conditions.length&&<div className={styles.chips}>{conditions.map(x=><button key={x} onClick={()=>toggle(a,x)} title={`Remove ${x}`}>{x} ×</button>)}</div>}

                <div className={styles.editRow}>

                  <label className={styles.notes}>Notes<input placeholder="Notes" value={a.notes||''} onChange={e=>change(a.id,{notes:e.target.value})}/></label>

                  <label className={styles.checkbox}><input type="checkbox" checked={!!a.defeated} onChange={e=>change(a.id,{defeated:e.target.checked})}/> Defeated</label>

                  <button className={styles.remove} onClick={()=>remove(a.id)}>Remove</button>

                </div>

              </div>}

            </article>;

          })}

        </section>

        <aside className={`${styles.sidebar} ${combat.started && !addPanelExpanded ? styles.mobileCollapsed : ''}`}>

          <div className={styles.addPanelHeading}>

            <h2>Add combatants</h2>

            {combat.started && <button type="button" className={styles.mobileToggle} aria-expanded={addPanelExpanded} aria-controls="add-combatants-content" onClick={()=>setAddPanelExpanded(v=>!v)}>{addPanelExpanded ? 'Hide −' : 'Expand +'}</button>}

          </div>

          <div id="add-combatants-content" className={styles.addPanelContent}>

          <button className={styles.partyButton} onClick={addPlayers}>+ Add Golt, Kespien, Jori & Virgula</button>

          <p className={styles.hint}>Adds only missing party members, with initiative left blank.</p>

          <form onSubmit={add}>

            <label>Name<input required placeholder="Goblin" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></label>

            <label>Type<select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}><option value="monster">Monster</option><option value="player">Player / Ally</option></select></label>

            <div className={styles.triple}>

              <label>Initiative<input type="number" placeholder="Optional" value={form.init} onChange={e=>setForm(f=>({...f,init:e.target.value}))}/></label>

              <label>Max HP<input type="number" min="0" value={form.hp} onChange={e=>setForm(f=>({...f,hp:e.target.value}))}/></label>

              <label>Copies<input type="number" min="1" max="30" value={form.count} onChange={e=>setForm(f=>({...f,count:e.target.value}))}/></label>

            </div>

            <button className={styles.primary} type="submit">+ Add combatants</button>

          </form>

          <hr/><p className={styles.hint}>Tap a combatant to expand its settings. Blank initiatives appear at the bottom. Changes save automatically in this browser.</p>

          </div>

        </aside>

      </div>

      <nav className={styles.floatingTurns} aria-label="Turn navigation">

        <button type="button" disabled={!combat.started} onClick={()=>advance(-1)}>← Previous turn</button>

        <span className={styles.floatingRound} aria-live="polite">Round {combat.round}</span>

        <button type="button" className={styles.primary} disabled={!ordered.length} onClick={()=>advance(1)}>{combat.started?'Next turn →':'Start combat →'}</button>

      </nav>

    </main>

  </>;

}
