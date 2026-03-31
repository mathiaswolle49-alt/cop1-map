function Info(){

return(

<div style={{
padding:"20px",
paddingBottom:"120px",
background:"#f4f6f8",
minHeight:"100vh"
}}>

<h1 style={{marginBottom:20}}>Infos utiles</h1>

<div style={card}>
<h3>Qu’est-ce que Cop1 ?</h3>
<p>
Cop1 est une association étudiante qui lutte contre la précarité et l'isolement étudiant à Angers et partout en France et outre mer.
</p>
</div>

<div style={card}>
<h3>Comment obtenir de l’aide ?</h3>
<p>
Utilise la carte pour trouver les structures proches de toi
et contacte-les directement.
</p>
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

export default Info