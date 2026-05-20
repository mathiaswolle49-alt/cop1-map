import { useState } from "react"

function Events(){

const [category, setCategory] = useState("cop1")

return(

<div style={{
padding:"20px",
paddingBottom:"120px",
background:"linear-gradient(180deg, #FDF6E9 0%, #EEF4FF 100%)",
minHeight:"100vh"
}}>

<h1 style={title}>
Événements
</h1>

{/* CATEGORIES */}

<div style={categories}>

<div
style={{
...pill,
...(category === "cop1" ? activePill : {})
}}
onClick={() => setCategory("cop1")}
>
COP1
</div>

<div
style={{
...pill,
...(category === "partners" ? activePill : {})
}}
onClick={() => setCategory("partners")}
>
Partenaires
</div>

</div>

{/* EVENTS COP1 */}

{category === "cop1" && (

<>

<div style={card}>

<div style={tag}>
COP1
</div>

<h2 style={eventTitle}>
🫶 Distribution alimentaire
</h2>

<p style={infos}>
Jeudi 21 mai • 18h
<br />
J Connect – Angers
</p>

<p style={description}>
Distribution alimentaire étudiante organisée par COP1 Angers.
</p>

<button style={button}>
S’inscrire
</button>

</div>

<div style={card}>

<div style={tag}>
COP1
</div>

<h2 style={eventTitle}>
☕ Café rencontre
</h2>

<p style={infos}>
Vendredi • 16h
<br />
Campus Belle-Beille
</p>

<p style={description}>
Moment d’échange convivial entre étudiants et bénévoles.
</p>

<button style={button}>
S’inscrire
</button>

</div>

</>

)}

{/* EVENTS PARTENAIRES */}

{category === "partners" && (

<>

<div style={card}>

<div style={partnerTag}>
PARTENAIRE
</div>

<h2 style={eventTitle}>
🎲 Soirée jeux
</h2>

<p style={infos}>
Vendredi • 20h
<br />
Association Jeux Angers
</p>

<p style={description}>
Soirée jeux de société ouverte aux étudiants.
</p>

<button style={button}>
S’inscrire
</button>

</div>

<div style={card}>

<div style={partnerTag}>
PARTENAIRE
</div>

<h2 style={eventTitle}>
🎨 Atelier créatif
</h2>

<p style={infos}>
Samedi • 14h
<br />
Maison des étudiants
</p>

<p style={description}>
Atelier artistique et créatif gratuit.
</p>

<button style={button}>
S’inscrire
</button>

</div>

</>

)}

</div>

)

}

const title = {
fontSize:"36px",
fontWeight:"800",
color:"#5B679F",
marginBottom:"22px"
}

const categories = {
display:"flex",
gap:"12px",
marginBottom:"24px"
}

const pill = {
padding:"12px 18px",
borderRadius:"999px",
background:"rgba(255,255,255,0.72)",
backdropFilter:"blur(10px)",
fontWeight:"600",
color:"#5B679F",
cursor:"pointer",
boxShadow:"0 4px 15px rgba(0,0,0,0.05)"
}

const activePill = {
background:"#5B679F",
color:"white"
}

const card = {
background:"rgba(255,255,255,0.72)",
backdropFilter:"blur(10px)",
padding:"20px",
borderRadius:"24px",
marginBottom:"16px",
boxShadow:"0 8px 24px rgba(0,0,0,0.06)"
}

const tag = {
display:"inline-block",
background:"rgba(91,103,159,0.12)",
color:"#5B679F",
padding:"8px 14px",
borderRadius:"999px",
fontSize:"13px",
fontWeight:"700",
marginBottom:"16px"
}

const partnerTag = {
display:"inline-block",
background:"rgba(120,120,120,0.12)",
color:"#666",
padding:"8px 14px",
borderRadius:"999px",
fontSize:"13px",
fontWeight:"700",
marginBottom:"16px"
}

const eventTitle = {
margin:"0 0 10px 0",
fontSize:"24px",
fontWeight:"800",
color:"#222"
}

const infos = {
fontSize:"16px",
lineHeight:"1.6",
color:"#5B679F",
fontWeight:"600",
marginBottom:"16px"
}

const description = {
fontSize:"16px",
lineHeight:"1.7",
color:"#444",
marginBottom:"20px"
}

const button = {
background:"#5B679F",
color:"white",
border:"none",
padding:"16px 20px",
borderRadius:"20px",
fontSize:"16px",
fontWeight:"700",
cursor:"pointer",
width:"100%"
}

export default Events