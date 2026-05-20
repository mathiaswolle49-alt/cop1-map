import { useState } from "react"

function FAQ(){

const [showForm, setShowForm] = useState(false)

return(

<div style={{
padding:"20px",
paddingBottom:"120px",
background:"linear-gradient(180deg, #FDF6E9 0%, #EEF4FF 100%)",
minHeight:"100vh"
}}>

<h1 style={title}>
FAQ
</h1>

<div style={card}>
<h3 style={question}>
❓ Comment utiliser la map ?
</h3>

<p style={answer}>
La map permet de retrouver facilement les aides alimentaires,
les structures de santé, les distributions et les lieux utiles
autour de toi grâce aux filtres intégrés.
</p>
</div>

<div style={card}>
<h3 style={question}>
🎉 Comment participer aux événements COP1 ?
</h3>

<p style={answer}>
Les événements COP1 sont accessibles directement depuis
les liens présents dans l’application et sont ouvert à tous les étudiants.
Les événements proposés sur la page événements peuvent être organisés
par différentes structures à Angers.
</p>
</div>

<div style={card}>
<h3 style={question}>
🛠️ Une information est incorrecte ?
</h3>

<p style={answer}>
Tu peux nous contacter ou signaler une erreur afin de nous aider
à garder la map et les informations à jour.
</p>
</div>

<div style={card}>
<h3 style={question}>
🤝 Comment aider COP1 ?
</h3>

<p style={answer}>
Tu peux aider COP1 en devenant bénévole,
en relayant les informations de l’association
ou simplement en parlant de l'asso autour de toi.
</p>
</div>

<div style={card}>
<h3 style={question}>
📩 Une question ?
</h3>

<p style={answer}>
Retrouve nos réseaux sociaux et nos moyens de contact
directement depuis l’application dans la page infos.

</p>
</div>

<div style={card}>
<h3 style={question}>
📝 Signaler une information
</h3>

<p style={answer}>
Une erreur ? Une information manquante ?
Aide-nous à améliorer l’application et la map collaborative.
</p>

<button
style={reportButton}
onClick={() => setShowForm(true)}
>
Ouvrir le formulaire
</button>

</div>

{showForm && (

<div style={overlay}>

<div style={modal}>

<h2 style={modalTitle}>
Signaler une information
</h2>

<input
placeholder="Nom / prénom"
style={input}
/>

<input
placeholder="Mail ou téléphone"
style={input}
/>

<textarea
placeholder="Une information à signaler ?"
style={textarea}
/>

<textarea
placeholder="Un autre détail utile ?"
style={textarea}
/>

<div style={{
display:"flex",
gap:"12px"
}}>

<button
style={closeButton}
onClick={() => setShowForm(false)}
>
Fermer
</button>

<button
style={sendButton}
onClick={() => setShowForm(false)}
>
Envoyer
</button>

</div>

</div>

</div>

)}

</div>

)

}

const title = {
fontSize:"36px",
fontWeight:"800",
color:"#5B679F",
marginBottom:"24px"
}

const card = {
background:"rgba(255,255,255,0.72)",
backdropFilter:"blur(10px)",
padding:"22px",
borderRadius:"26px",
marginBottom:"18px",
boxShadow:"0 6px 20px rgba(0,0,0,0.06)"
}

const question = {
marginTop:0,
marginBottom:"10px",
fontSize:"22px",
color:"#5B679F"
}

const answer = {
margin:0,
fontSize:"16px",
lineHeight:"1.7",
color:"#333"
}

const reportButton = {
marginTop:"18px",
background:"#5B679F",
color:"white",
border:"none",
padding:"14px 18px",
borderRadius:"18px",
fontSize:"15px",
fontWeight:"600",
cursor:"pointer"
}

const overlay = {
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,0.35)",
backdropFilter:"blur(8px)",
display:"flex",
justifyContent:"center",
alignItems:"center",
padding:"20px",
zIndex:"999"
}

const modal = {
background:"rgba(255,255,255,0.92)",
backdropFilter:"blur(14px)",
borderRadius:"30px",
padding:"26px",
width:"100%",
maxWidth:"420px",
display:"flex",
flexDirection:"column",
gap:"14px",
boxShadow:"0 10px 30px rgba(0,0,0,0.12)"
}

const modalTitle = {
margin:0,
fontSize:"28px",
color:"#5B679F",
fontWeight:"800"
}

const input = {
padding:"16px",
borderRadius:"18px",
border:"1px solid rgba(0,0,0,0.08)",
fontSize:"15px",
outline:"none",
background:"white"
}

const textarea = {
padding:"16px",
borderRadius:"18px",
border:"1px solid rgba(0,0,0,0.08)",
fontSize:"15px",
outline:"none",
background:"white",
minHeight:"110px",
resize:"none"
}

const sendButton = {
flex:1,
background:"#5B679F",
color:"white",
border:"none",
padding:"16px",
borderRadius:"20px",
fontSize:"16px",
fontWeight:"700",
cursor:"pointer"
}

const closeButton = {
flex:1,
background:"rgba(91,103,159,0.12)",
color:"#5B679F",
border:"none",
padding:"16px",
borderRadius:"20px",
fontSize:"16px",
fontWeight:"700",
cursor:"pointer"
}

export default FAQ