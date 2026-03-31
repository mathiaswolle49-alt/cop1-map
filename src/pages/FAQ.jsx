function FAQ(){

return(

<div style={{
padding:"20px",
paddingBottom:"120px",
background:"#f4f6f8",
minHeight:"100vh"
}}>

<h1 style={{marginBottom:20}}>FAQ</h1>

<div style={card}>
<h3>Est-ce gratuit ?</h3>
<p>Oui, toutes les aides sont gratuites.</p>
</div>

<div style={card}>
<h3>Dois-je être étudiant ?</h3>
<p>Certaines structures sont ouvertes à tous.</p>
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

export default FAQ