function Events(){

return(

<div style={{
padding:"20px",
paddingBottom:"120px",
background:"#f4f6f8",
minHeight:"100vh"
}}>

<h1 style={{marginBottom:20}}>Événements</h1>

<div style={card}>
<h3>Distribution alimentaire</h3>
<p>Chaque jeudi à 18h – J conect.</p>
</div>

<div style={card}>
<h3>Exemple Soirée jeux</h3>
<p>Vendredi 20h – association jeux.</p>
</div>

</div>

)

}

const card = {
background:"white",
padding:"18px",
borderRadius:"16px",
marginBottom:"14px",
boxShadow:"0 4px 15px rgba(0,0,0,0.08)"
}

export default Events