import { useState } from "react"

function Info(){

const [openCard, setOpenCard] = useState(null)

const toggleCard = (cardName) => {
setOpenCard(openCard === cardName ? null : cardName)
}

return(

<div style={{
padding:"20px",
paddingBottom:"120px",
background:"linear-gradient(180deg, #FDF6E9 0%, #EEF4FF 100%)",
minHeight:"100vh"
}}>

{/* HERO */}

<div style={hero}>

<img
src="/icons/logo_cop1_angers.svg"
alt="COP1 Angers"
style={{
width:"220px",
marginBottom:"4px"
}}
/>

<div style={{
display:"flex",
alignItems:"center",
justifyContent:"center",
marginTop:"-10px",
marginBottom:"10px"
}}>

<h1 style={{
fontSize:"38px",
margin:0,
color:"#5B679F",
fontWeight:"800",
lineHeight:"1.1",
textAlign:"center",
}}>
COP1 Angers
<br />
<span style={{
fontSize:"30px",
fontWeight:"700"
}}>
Solidarités étudiantes
</span>
</h1>

<img
src="/icons/tampon_couleur_angers.svg"
alt=""
style={{
width:"72px",
opacity:"0.95",
marginLeft:"10px",
marginTop:"18px"
}}
/>

</div>

<p style={{
marginTop:"18px",
fontSize:"17px",
lineHeight:"1.6",
maxWidth:"600px",
color:"#333"
}}>
Une association par et pour les étudiants qui les accompagne
et les soutient au quotidien à Angers et partout en France.
</p>

</div>

{/* CARDS */}

<div style={cardsContainer}>

{/* QUI SOMMES NOUS */}

<div
style={{
...expandCard,
...(openCard === "who" ? expanded : {})
}}
onClick={() => toggleCard("who")}
>

<h2 style={cardTitle}>
🤝 Qui sommes-nous ?
</h2>

<p style={cardPreview}>
Une association étudiante solidaire
</p>

{openCard === "who" && (
<p style={cardText}>
Cop1 est une association étudiante qui lutte contre la
précarité et l’isolement étudiant à Angers et partout
en France.
</p>
)}

</div>

{/* CE QU’ON FAIT */}

<div
style={{
...expandCard,
...(openCard === "actions" ? expanded : {})
}}
onClick={() => toggleCard("actions")}
>

<h2 style={cardTitle}>
💜 Ce qu’on fait
</h2>

<p style={cardPreview}>
Distributions, événements et accompagnement
</p>

{openCard === "actions" && (
<p style={cardText}>
Distributions alimentaires, événements étudiants,
accompagnement, solidarité et accès aux aides utiles
pour les jeunes.
</p>
)}

</div>

{/* MAP */}

<div
style={{
...expandCard,
...(openCard === "map" ? expanded : {})
}}
onClick={() => toggleCard("map")}
>

<h2 style={cardTitle}>
🗺️ La map COP1
</h2>

<p style={cardPreview}>
Trouve des aides autour de toi
</p>

{openCard === "map" && (
<p style={cardText}>
Retrouve facilement les aides alimentaires,
les structures de santé, les lieux utiles,
les distributions et bien plus grâce à la carte interactive.
</p>
)}

</div>

{/* EVENTS */}

<div
style={{
...expandCard,
...(openCard === "events" ? expanded : {})
}}
onClick={() => toggleCard("events")}
>

<h2 style={cardTitle}>
🎉 Les événements
</h2>

<p style={cardPreview}>
Découvre les actions COP1
</p>

{openCard === "events" && (
<p style={cardText}>
Retrouve les distributions, événements étudiants,
activités et actions organisées par COP1 et ses partenaires.
</p>
)}

</div>

{/* FAQ */}

<div
style={{
...expandCard,
...(openCard === "faq" ? expanded : {})
}}
onClick={() => toggleCard("faq")}
>

<h2 style={cardTitle}>
❓ La FAQ
</h2>

<p style={cardPreview}>
Questions, réponses et améliorations
</p>

{openCard === "faq" && (
<p style={cardText}>
La FAQ permet de répondre aux questions fréquentes,
mais aussi de signaler une erreur ou proposer une amélioration
pour l’application et la carte.
</p>
)}

</div>

</div>

</div>

)

}

const hero = {
background:"rgba(255,255,255,0.7)",
backdropFilter:"blur(12px)",
borderRadius:"32px",
padding:"42px 24px",
marginBottom:"30px",
boxShadow:"0 8px 30px rgba(0,0,0,0.08)",
display:"flex",
flexDirection:"column",
alignItems:"center",
textAlign:"center",
position:"relative",
overflow:"hidden"
}

const cardsContainer = {
display:"flex",
flexDirection:"column",
gap:"18px"
}

const expandCard = {
background:"rgba(255,255,255,0.72)",
backdropFilter:"blur(10px)",
borderRadius:"28px",
padding:"24px",
cursor:"pointer",
transition:"all 0.35s ease",
boxShadow:"0 6px 20px rgba(0,0,0,0.06)"
}

const expanded = {
transform:"scale(1.02)"
}

const cardTitle = {
margin:0,
fontSize:"24px",
color:"#5B679F",
fontWeight:"800",
marginBottom:"10px"
}

const cardPreview = {
margin:0,
fontSize:"16px",
color:"#444",
fontWeight:"500"
}

const cardText = {
marginTop:"18px",
fontSize:"16px",
lineHeight:"1.7",
color:"#333"
}

export default Info