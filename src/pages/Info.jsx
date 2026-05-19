function Info(){

return(

<div style={{
padding:"20px",
paddingBottom:"120px",
background:"#FDF6E9",
minHeight:"100vh"
}}>

{/* HERO */}

<div style={hero}>

<img
src="/icons/logo_cop1_angers.svg"
alt="COP1 Angers"
style={{
width:"220px",
marginBottom:"20px"
}}
/>

<h1 style={{
fontSize:"38px",
margin:0,
color:"#5B679F",
fontWeight:"800"
}}>
COP1 Angers 
</h1>

<h1 style={{
fontSize:"36px",
margin:0,
color:"#5B679F",
fontWeight:"800"
}}>
Solidarités étudiantes
</h1>

<img
src="/icons/tampon_couleur_angers.svg"
alt=""
style={{
width:"55px",
position:"absolute",
top:"20px",
right:"20px",
opacity:"0.9"
}}
/>

<p style={{
marginTop:"14px",
fontSize:"17px",
lineHeight:"1.6",
maxWidth:"600px",
color:"#333"
}}>
Une association par et pour les étudiants qui les accompagnes et 
les soutients au quotidien à Angers et partout en France.
</p>

</div>

{/* LIENS RAPIDES */}

<div style={{
display:"flex",
flexDirection:"column",
gap:"14px",
marginBottom:"34px"
}}>

<div style={linkCard}>
🗺️ Carte interactive
</div>

<div style={linkCard}>
🎉 Événements
</div>

<div style={linkCard}>
❓ FAQ
</div>

<div style={linkCard}>
📸 Instagram
</div>

</div>

{/* QUI SOMMES NOUS */}

<div style={card}>
<h2 style={title}>
Qui sommes-nous ?
</h2>

<p style={text}>
Cop1 est une association étudiante qui lutte contre la précarité
et l’isolement étudiant à Angers et partout en France.
</p>
</div>

{/* CE QU’ON FAIT */}

<div style={card}>
<h2 style={title}>
Ce qu’on fait 💜
</h2>

<p style={text}>
Distributions alimentaires, événements étudiants,
accompagnement, solidarité et accès aux aides utiles.
</p>
</div>

{/* L’APPLICATION */}

<div style={card}>
<h2 style={title}>
L’application COP1 📱
</h2>

<p style={text}>
Retrouve sur l’application :
<br /><br />
• une carte interactive des aides étudiantes
<br />
• les événements COP1
<br />
• une FAQ pour répondre aux questions et améliorer l’application
</p>
</div>

</div>

)

}

const hero = {
background:"white",
borderRadius:"30px",
padding:"40px 24px",
marginBottom:"30px",
boxShadow:"0 6px 20px rgba(0,0,0,0.08)",
display:"flex",
flexDirection:"column",
alignItems:"center",
textAlign:"center"
}

const card = {
background:"white",
padding:"24px",
borderRadius:"24px",
marginBottom:"18px",
boxShadow:"0 4px 15px rgba(0,0,0,0.08)"
}

const title = {
marginTop:0,
marginBottom:"12px",
fontSize:"24px",
color:"#5B679F"
}

const text = {
fontSize:"16px",
lineHeight:"1.7",
color:"#333"
}

const linkCard = {
background:"#5B679F",
color:"white",
padding:"18px",
borderRadius:"18px",
fontSize:"18px",
fontWeight:"600",
cursor:"pointer",
boxShadow:"0 4px 15px rgba(91,103,159,0.3)"
}

export default Info