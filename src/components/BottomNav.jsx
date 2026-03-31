function BottomNav({setPage}){

return(

<div
  style={{
    position:"fixed",
    bottom:15,
    left:0,
    right:0,
    display:"flex",
    justifyContent:"center",
    gap:10,
    zIndex:4000,
    pointerEvents:"none"
  }}
>

<button
onClick={()=>setPage("info")}
style={{
    pointerEvents:"auto",
    padding:"12px 16px",
    borderRadius:18,
    border:"none",

    background:"rgba(255,255,255,0.55)",
    backdropFilter:"blur(20px) saturate(180%)",
    WebkitBackdropFilter:"blur(20px) saturate(180%)",

    boxShadow:"0 8px 25px rgba(0,0,0,0.18)",

    fontSize:14,
    color:"#111",          // ⭐ FIX BLEU
    fontWeight:500
}}
>
Infos
</button>

<button
onClick={()=>setPage("map")}
style={{
    pointerEvents:"auto",
    padding:"12px 16px",
    borderRadius:18,
    border:"none",

    background:"rgba(255,255,255,0.55)",
    backdropFilter:"blur(20px) saturate(180%)",
    WebkitBackdropFilter:"blur(20px) saturate(180%)",

    boxShadow:"0 8px 25px rgba(0,0,0,0.18)",

    fontSize:14,
    color:"#111",
    fontWeight:500
}}
>
Carte
</button>

<button
onClick={()=>setPage("events")}
style={{
    pointerEvents:"auto",
    padding:"12px 16px",
    borderRadius:18,
    border:"none",

    background:"rgba(255,255,255,0.55)",
    backdropFilter:"blur(20px) saturate(180%)",
    WebkitBackdropFilter:"blur(20px) saturate(180%)",

    boxShadow:"0 8px 25px rgba(0,0,0,0.18)",

    fontSize:14,
    color:"#111",
    fontWeight:500
}}
>
Événements
</button>

<button
onClick={()=>setPage("faq")}
style={{
    pointerEvents:"auto",
    padding:"12px 16px",
    borderRadius:18,
    border:"none",

    background:"rgba(255,255,255,0.55)",
    backdropFilter:"blur(20px) saturate(180%)",
    WebkitBackdropFilter:"blur(20px) saturate(180%)",

    boxShadow:"0 8px 25px rgba(0,0,0,0.18)",

    fontSize:14,
    color:"#111",
    fontWeight:500
}}
>
FAQ
</button>

</div>

)

}

export default BottomNav