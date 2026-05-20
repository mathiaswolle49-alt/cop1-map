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

<div style={{
display:"flex",
alignItems:"center",
justifyContent:"center",
gap:"18px",
marginBottom:"14px"
}}>

<div>

<img
src="/icons/logo_cop1_angers.svg"
alt="COP1 Angers"
style={{
width:"320px",
display:"block",
marginBottom:"-6px"
}}
/>

</div>

</div>

<p style={{
marginTop:"0px",
fontSize:"17px",
lineHeight:"1.6",
maxWidth:"600px",
color:"#333"
}}>
Une association par et pour les étudiants qui les accompagne
et les soutient au quotidien à Angers et partout en France.
</p>

</div>

<div style={separator}></div>

{/* PASTILLES */}

<div style={pillsContainer}>

<a
href="mailto:angers@cop1.fr"
style={pill}
>
✉️
</a>

<a
href="https://www.instagram.com/cop1angers"
target="_blank"
rel="noreferrer"
style={pill}
>
📸
</a>

<a
href="https://www.facebook.com/cop1angers"
target="_blank"
rel="noreferrer"
style={pill}
>
📘
</a>

</div>

<div style={separator}></div>

{/* GROS BOUTONS */}

<div style={bigButtonsContainer}>

<a
href="https://spreadsheets.fillout.com/t/c5TYZV7MAqus"
target="_blank"
rel="noreferrer"
style={{
...bigButton,
textDecoration:"none"
}}
>
🤝 Deviens bénévole COP1 Angers
</a>

<div style={separator}></div>

<div style={eventsBlock}>

<h2 style={eventsTitle}>
🫶 INSCRIPTIONS AUX ÉVÉNEMENTS COP1
</h2>

<a
href="https://www.billetweb.fr/distribution-alimentaire-cop1-du-21-05-a-laca-maison-de-quartier"
target="_blank"
rel="noreferrer"
style={eventButton}
>
🧺 DISTRIBUTION ALIMENTAIRE du 21/05 à l'ACA 🍎
</a>

</div>

</div>

<div style={separator}></div>

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

<div style={cardHeader}>

<div style={{
display:"flex",
alignItems:"center",
gap:"10px"
}}>

<img
src="/icons/tampon_couleur_angers.svg"
alt=""
style={{
width:"120px",
marginTop:"2px",
opacity:"0.9",
marginRight:"-35px",
marginLeft:"-35px",
marginTop:"-35px",
marginBottom:"-25px",
}}
/>

<h2 style={cardTitle}>
Qui sommes-nous ?
</h2>

</div>

<span style={arrow}>
{openCard === "who" ? "▲" : "▼"}
</span>

</div>

<p style={cardPreview}>
Une association étudiante solidaire
</p>

{openCard === "who" && (
<p style={cardText}>
Cop1 est une association étudiante indépendante motivée par un but simple : lutter contre la
précarité et l’isolement étudiant à Angers et partout en France.
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

<div style={cardHeader}>

<h2 style={cardTitle}>
💜 Ce qu’on fait
</h2>

<span style={arrow}>
{openCard === "actions" ? "▲" : "▼"}
</span>

</div>

<p style={cardPreview}>
Distributions, événements et accompagnement
</p>

{openCard === "actions" && (
<p style={cardText}>
Nous aidons principalement en faisant des distributions gratuites de denrées alimentaires, de produits d’hygiène, de vêtements,
un accès aux droits, à la culture, au sport et à l’emploi et de nombreuses activités !
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

<div style={cardHeader}>

<h2 style={cardTitle}>
🗺️ La map COP1
</h2>

<span style={arrow}>
{openCard === "map" ? "▲" : "▼"}
</span>

</div>

<p style={cardPreview}>
Trouve des aides rapidement autour de toi
</p>

{openCard === "map" && (
<p style={cardText}>
Retrouve facilement les aides alimentaires,
les structures de santé, les endroits ou rencontrer du monde, les lieux d'ecoutes mais aussi utiles de Tous Angers !
Et bien plus grâce à la carte interactive de COP1 Angers !
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

<div style={cardHeader}>

<h2 style={cardTitle}>
🎉 Les événements
</h2>

<span style={arrow}>
{openCard === "events" ? "▲" : "▼"}
</span>

</div>

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

<div style={cardHeader}>

<h2 style={cardTitle}>
❓ La FAQ
</h2>

<span style={arrow}>
{openCard === "faq" ? "▲" : "▼"}
</span>

</div>

<p style={cardPreview}>
Questions, réponses et améliorations
</p>

{openCard === "faq" && (
<p style={cardText}>
Une question ? La FAQ permet de donner une réponse aux questions fréquentes,
mais aussi de signaler une erreur ou proposer une amélioration
pour l’application et la carte !
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
padding:"34px 24px",
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
marginBottom:"0px"
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

const cardHeader = {
display:"flex",
justifyContent:"space-between",
alignItems:"center"
}

const arrow = {
fontSize:"14px",
color:"#5B679F",
fontWeight:"700",
opacity:"0.7",
}

const pillsContainer = {
display:"flex",
justifyContent:"center",
alignItems:"center",
gap:"12px",
paddingBottom:"8px",
marginBottom:"22px",
flexWrap:"wrap"
}

const pill = {
background:"rgba(255,255,255,0.72)",
backdropFilter:"blur(10px)",
padding:"12px 18px",
borderRadius:"999px",
fontSize:"15px",
fontWeight:"600",
color:"#5B679F",
whiteSpace:"nowrap",
boxShadow:"0 4px 15px rgba(0,0,0,0.05)",
cursor:"pointer"
}

const bigButtonsContainer = {
display:"flex",
flexDirection:"column",
gap:"14px",
marginBottom:"28px"
}

const bigButton = {
background:"#5B679F",
color:"white",
padding:"22px",
borderRadius:"26px",
fontSize:"18px",
fontWeight:"700",
boxShadow:"0 8px 20px rgba(91,103,159,0.25)",
cursor:"pointer"
}

const separator = {
height:"1px",
width:"100%",
background:"linear-gradient(90deg, transparent 0%, rgba(91,103,159,0.18) 20%, rgba(91,103,159,0.18) 80%, transparent 100%)",
margin:"18px 0"
}

const eventsBlock = {
display:"flex",
flexDirection:"column",
gap:"12px"
}

const eventsTitle = {
margin:"0 0 4px 0",
fontSize:"26px",
fontWeight:"800",
color:"#5B679F"
}

const eventButton = {
background:"rgba(255,255,255,0.72)",
backdropFilter:"blur(10px)",
padding:"18px",
borderRadius:"22px",
fontSize:"16px",
fontWeight:"600",
color:"#5B679F",
textDecoration:"none",
boxShadow:"0 6px 18px rgba(0,0,0,0.06)"
}

export default Info