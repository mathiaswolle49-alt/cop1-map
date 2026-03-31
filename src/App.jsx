import { useState, useEffect } from "react"
import { supabase } from "./supabase"

import Map from "./pages/Map"
import Events from "./pages/Events"
import Info from "./pages/Info"
import FAQ from "./pages/FAQ"

import BottomNav from "./components/BottomNav"

function App(){

const [page,setPage] = useState("map")
const [user,setUser] = useState(null)

const [showAdmin,setShowAdmin] = useState(false)
const [showLogin,setShowLogin] = useState(false)

const [adminEmail,setAdminEmail] = useState("")
const [adminPass,setAdminPass] = useState("")

// ⭐ récup session
useEffect(()=>{

  supabase.auth.getSession().then(({data})=>{
    setUser(data.session?.user ?? null)
  })

  supabase.auth.onAuthStateChange((_event,session)=>{
    setUser(session?.user ?? null)
  })

},[])

// ⭐ LOGIN ADMIN
async function login(){

const { error } = await supabase.auth.signInWithPassword({
email: adminEmail,
password: adminPass
})

if(error){
alert(error.message)
return
}

setShowLogin(false)
setShowAdmin(false)
}

// ⭐ UNLOGIN ADMIN
async function logout(){

await supabase.auth.signOut()

setUser(null)

alert("Mode admin quitté")

}
return(

<div>

{page === "map" && <Map user={user} showAdminButton={()=>setShowAdmin(true)} />}
{page === "events" && <Events />}
{page === "info" && <Info />}
{page === "faq" && <FAQ />}

{/* ⭐ bouton admin */}
{showAdmin && !user && (
<button
onClick={()=>setShowLogin(true)}
style={{
position:"fixed",
top:20,
right:20,
zIndex:9999,
padding:"8px 14px",
borderRadius:12,
border:"none",
background:"black",
color:"white"
}}
>
ADMIN
</button>
)}

{showLogin && (

<div
style={{
position:"fixed",
top:0,
left:0,
right:0,
bottom:0,
background:"rgba(0,0,0,0.4)",
display:"flex",
alignItems:"center",
justifyContent:"center",
zIndex:10000
}}
>

<div
style={{
background:"white",
padding:20,
borderRadius:18,
width:"85%",
maxWidth:320
}}
>

<h3 style={{marginTop:0}}>Connexion admin</h3>

<input
placeholder="Email"
value={adminEmail}
onChange={(e)=>setAdminEmail(e.target.value)}
style={{
width:"100%",
padding:10,
marginBottom:10,
borderRadius:10,
border:"1px solid #ddd"
}}
/>

<input
type="password"
placeholder="Mot de passe"
value={adminPass}
onChange={(e)=>setAdminPass(e.target.value)}
style={{
width:"100%",
padding:10,
marginBottom:10,
borderRadius:10,
border:"1px solid #ddd"
}}
/>

<button
onClick={login}
style={{
width:"100%",
padding:10,
borderRadius:10,
border:"none",
background:"#06c167",
color:"white",
fontWeight:600
}}
>
Se connecter
</button>

<button
onClick={()=>setShowLogin(false)}
style={{
marginTop:8,
width:"100%",
padding:8,
borderRadius:10,
border:"none",
background:"#eee"
}}
>
Annuler
</button>

</div>
</div>

)}

{user && (
<button
onClick={logout}
style={{
position:"fixed",
top:20,
left:20,
zIndex:9999,
padding:"8px 14px",
borderRadius:12,
border:"none",
background:"red",
color:"white",
fontWeight:600
}}
>
Quitter admin
</button>
)}

<BottomNav setPage={setPage} />

</div>

)

}

export default App