import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl} from "react-leaflet"
import { useState, useEffect } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { supabase } from "../supabase"

function Recenter({ position, heading }) {

  const map = useMap()

  useEffect(() => {

    map.setView(position, 16, {
  animate:true,
  duration:0.5
})

    map.setBearing?.(heading)

  }, [position, heading])

  return null
}

function MapClickHandler({ onClick }) {
  useMapEvents({
    click: () => {
      onClick()
    }
  })
  return null
}

function Map({ user, showAdminButton }) {

  const angers = [47.4784, -0.5631]

  const [userPos, setUserPos] = useState(angers)
  const [selected, setSelected] = useState(angers)
  const [filter, setFilter] = useState("Tous")
  const [search, setSearch] = useState("")
  const SNAP_MIN = 110
const SNAP_MID = window.innerHeight * 0.35
const SNAP_MAX = window.innerHeight - 40
const [sheetHeight,setSheetHeight] = useState(SNAP_MID)
  const [dragging,setDragging] = useState(false)
  const [places, setPlaces] = useState([])
  const [newPlace, setNewPlace] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [newCategory, setNewCategory] = useState("Aides & précarité")
  const [heading, setHeading] = useState(0)
  const [selectedPlace, setSelectedPlace] = useState(null)

// ⭐ LONG PRESS ADMIN
let pressTimer = null

function startAdminPress(e){

e.preventDefault()

pressTimer = setTimeout(()=>{

showAdminButton()   // ⭐ C’EST ÇA QUI MANQUE

},1200)

}

function stopAdminPress(e){

e.preventDefault()
clearTimeout(pressTimer)

}

// ⭐ transforme adresse → coordonnées GPS
async function geocode(address){

  const url =
    "https://nominatim.openstreetmap.org/search?format=json&q="
    + encodeURIComponent(address)

  const res = await fetch(url)
  const data = await res.json()

  if(!data.length){
    alert("Adresse introuvable")
    return null
  }

  return [
    Number(data[0].lat),
    Number(data[0].lon)
  ]
}

// ⭐ affiche des suggestions d’adresses
async function searchAddress(text){

  setNewPlace(text)

  if(text.length < 3){
    setSuggestions([])
    return
  }

  const url =
    "https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=fr&q="
    + encodeURIComponent(text + " Angers")

  try{
    const res = await fetch(url)
    const data = await res.json()
    setSuggestions(data)
  }catch(e){
    console.log(e)
  }
}

// ⭐ SUPABASE
useEffect(() => {

  async function fetchPlaces(){

    const { data, error } = await supabase
      .from("places")
      .select("*")

    console.log("SUPABASE DATA =", data)
    console.log("SUPABASE ERROR =", error)

    if(error){
      return
    }

    setPlaces(data || [])

  }

  fetchPlaces()

}, [])

// ⭐ Ajout d'un lieu personnalisé
  async function addPlace(){

  if(!newPlace) return

  const coords = await geocode(newPlace)

  if(!coords) return

  const { error } = await supabase
    .from("places")
    .insert([
      {
        name: newPlace,
        lat: coords[0],
        lng: coords[1],
        category: newCategory
      }
    ])

  if(error){
    alert("Erreur ajout")
    console.log(error)
    return
  }

  alert("Lieu ajouté ✅")
  setNewPlace("")
}

  useEffect(() => {

  document.body.style.touchAction = "none"

  return () => {
    document.body.style.touchAction = "auto"
  }

}, [])

// ⭐ Premier test pour ajout de lieu personnalisé
  const aids = [
    { name: "Cop1 Angers", pos: [47.4784, -0.5631], category: "Aides & précarité" },
    { name: "Restos du Cœur", pos: [47.4725, -0.5518], category: "Aides & précarité" },
    { name: "Secours populaire", pos: [47.4653, -0.5582], category: "Aides & précarité" },
    { name: "Nightline", pos: [47.48, -0.57], category: "Écoute & soutien" },
    { name: "Association jeux", pos: [47.47, -0.56], category: "Lien social" },
    { name: "CAF Angers", pos: [47.46, -0.55], category: "Vie pratique" }
  ]

// ⭐ Icons pour les filtres
const icons = {
  "Tous": "📍",
  "Aides & précarité": "🧺",
  "Écoute & soutien": "💬",
  "Lien social": "🎲",
  "Vie pratique": "🧾"
}

// ⭐ GPS
function handleLocate(){

if(!navigator.geolocation){
alert("GPS non supporté")
return
}

navigator.geolocation.getCurrentPosition(
(pos)=>{
const p=[pos.coords.latitude,pos.coords.longitude]
setUserPos(p)
setSelected(p)
},
(err)=>{
alert("Autorise la localisation dans le navigateur")
console.log(err)
},
{
enableHighAccuracy:true,
timeout:10000,
maximumAge:0
}
)

}

function openRoute(lat, lng){

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent)

  if(isIOS){
    window.open(
      `https://maps.apple.com/?daddr=${lat},${lng}`,
      "_blank"
    )
  } else {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    )
  }

}

  useEffect(() => {

  if (!navigator.geolocation) return

  const watchId = navigator.geolocation.watchPosition(

  (pos) => {

    const p = [pos.coords.latitude, pos.coords.longitude]

    setUserPos(p)

    // ⭐ direction téléphone
    if(pos.coords.heading !== null){
      setHeading(pos.coords.heading)
    }

    // ⭐ suivi smooth
    setSelected(prev => {

      const d = Math.sqrt(
        Math.pow(prev[0]-p[0],2) +
        Math.pow(prev[1]-p[1],2)
      )
 
      if(d < 0.00005) return prev

      return p
    })

  },

  (err) => console.log(err),

  {
    enableHighAccuracy:true,
    maximumAge:0,
    timeout:10000
  }
)

  return () => navigator.geolocation.clearWatch(watchId)

}, [])

  function getDistance(a, b) {
    const R = 6371
    const dLat = (b[0] - a[0]) * Math.PI / 180
    const dLon = (b[1] - a[1]) * Math.PI / 180
    const lat1 = a[0] * Math.PI / 180
    const lat2 = b[0] * Math.PI / 180

    const x =
      Math.sin(dLat / 2) ** 2 +
      Math.sin(dLon / 2) ** 2 *
      Math.cos(lat1) * Math.cos(lat2)

    const d = 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))

    return d < 1
      ? Math.round(d * 1000) + " m"
      : d.toFixed(2) + " km"
  }
 
  let filtered =
  filter === "Tous"
    ? places
    : places.filter(p => p.category === filter)

  filtered = filtered.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )

  filtered = filtered.map(a => ({
  ...a,
  pos: [a.lat, a.lng],   // ⭐ conversion Supabase → Leaflet
  distance: getDistance(userPos, [a.lat, a.lng])
}))

let startY = 0
let startHeight = 0
let lastDragDirection = 0

function startDrag(e){

  e.preventDefault()   // ⭐ IMPORTANT

  startY = e.touches ? e.touches[0].clientY : e.clientY
  startHeight = sheetHeight

  window.addEventListener("mousemove", drag)
  window.addEventListener("mouseup", stopDrag)
  window.addEventListener("touchmove", drag, { passive:false })
  window.addEventListener("touchend", stopDrag)
}

function drag(e){

  e.preventDefault()   // ⭐ IMPORTANT

  const currentY = e.touches ? e.touches[0].clientY : e.clientY
  const diff = startY - currentY
  lastDragDirection = diff

  let newHeight = startHeight + diff

  if(newHeight < SNAP_MIN) newHeight = SNAP_MIN
  if(newHeight > SNAP_MAX)
    newHeight = SNAP_MAX

  setSheetHeight(newHeight)
}

function stopDrag(){

  window.removeEventListener("mousemove", drag)
  window.removeEventListener("mouseup", stopDrag)
  window.removeEventListener("touchmove", drag)
  window.removeEventListener("touchend", stopDrag)

  // ⭐ SNAP directionnel
  if(lastDragDirection > 0){
    // utilisateur monte
    if(sheetHeight < SNAP_MID) setSheetHeight(SNAP_MID)
    else setSheetHeight(SNAP_MAX)
  }
  else{
    // utilisateur descend
    if(sheetHeight > SNAP_MID) setSheetHeight(SNAP_MID)
    else setSheetHeight(SNAP_MIN)
  }

}

  return (
    <div style={{ height: "100vh", position: "relative" }}>

      <MapContainer
  center={selected}
  zoom={13}
  zoomControl={false}
  style={{ height: "100%", width: "100%" }}

  whenCreated={(map) => {
  map.on("click", () => {
    setSelectedPlace(null)
    setSheetHeight(SNAP_MID)
  })
}}
>
        <Recenter
  position={selected}
  heading={heading}
/>

 <MapClickHandler
  onClick={() => {
    setSelectedPlace(null)
    setSheetHeight(SNAP_MID)
  }}
/>

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker
  position={userPos}
  icon={L.divIcon({
    className:"",
    html:`
<div style="
position:relative;
width:12px;
height:12px;
">

<div style="
position:absolute;
width:26px;
height:26px;
background:rgba(26,115,232,0.18);
border-radius:50%;
top:-7px;
left:-7px;
animation:gpsPulse 1.8s infinite;
"></div>

<div style="
width:12px;
height:12px;
background:#1a73e8;
border:2px solid white;
border-radius:50%;
box-shadow:0 2px 6px rgba(0,0,0,0.25);
"></div>

</div>
`
  })}
>
  <Popup>Vous êtes ici</Popup>
</Marker>

        {(selectedPlace ? [selectedPlace] : filtered).map((aid, i) => (
  <Marker
  key={i}
  position={aid.pos}
  icon={L.divIcon({
    className: "",
    iconSize: [40, 56],
    iconAnchor: [20, 56],
    html: `
      <div style="
        position:relative;
        width:40px;
        height:56px;
        display:flex;
        align-items:center;
        justify-content:center;
      ">

        <div style="
          position:absolute;
          width:40px;
          height:40px;
          background:white;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 10px 25px rgba(0,0,0,0.35);
          bottom:8px;
        "></div>

        <div style="
          position:absolute;
          width:26px;
          height:26px;
          background:white;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:16px;
          z-index:2;
          bottom:16px;
          box-shadow:0 4px 10px rgba(0,0,0,0.2);
        ">
          ${icons[aid.category]}
        </div>

      </div>
    `
  })}

  eventHandlers={{
  click: (e) => {
    e.originalEvent.stopPropagation() // ⭐ IMPORTANT

    setSelected(aid.pos)
    setSelectedPlace(aid)
  }
}}
>
</Marker>
  
))}
      </MapContainer>

     {/* TOP UI */}
<div
  style={{
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1000
  }}
>

  {/* recherche */}
  <input
    placeholder="🔎 Rechercher une aide..."
    value={search}
    onChange={(e)=>{
setNewPlace(e.target.value)
searchAddress(e.target.value)
}}
    style={{
      width: "92%",
      maxWidth: 520,
      margin: "0 auto 10px",
      display: "block",
      padding: "12px 16px",
      borderRadius: 25,
      border: "none",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      fontSize: 16
    }}
  />

  {/* bouton cible DESIGN */}
  <button
onClick={handleLocate}
onTouchStart={startAdminPress}
onTouchEnd={stopAdminPress}
onTouchMove={stopAdminPress}
onMouseDown={startAdminPress}
onMouseUp={stopAdminPress}
onMouseLeave={stopAdminPress}
style={{
position:"fixed",
top:120,
right:15,
width:42,
height:42,
borderRadius:"50%",
border:"none",
background:"white",
boxShadow:"0 12px 30px rgba(0,0,0,0.25)",
display:"flex",
alignItems:"center",
justifyContent:"center",
zIndex:3000,
cursor:"pointer"
}}
>
    <svg width="30" height="30" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="6" fill="#000" />
      <circle cx="50" cy="50" r="22"
        stroke="#000"
        strokeWidth="4"
        fill="none"
      />
      <circle cx="50" cy="50" r="36"
        stroke="#000"
        strokeWidth="6"
        fill="none"
      />
      <line x1="50" y1="0" x2="50" y2="20"
        stroke="#000"
        strokeWidth="6"
      />
      <line x1="50" y1="80" x2="50" y2="100"
        stroke="#000"
        strokeWidth="6"
      />
      <line x1="0" y1="50" x2="20" y2="50"
        stroke="#000"
        strokeWidth="6"
      />
      <line x1="80" y1="50" x2="100" y2="50"
        stroke="#000"
        strokeWidth="6"
      />
    </svg>
  </button>

  {/* filtres */}
  <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
    {["Tous", "Aides & précarité", "Écoute & soutien", "Lien social", "Vie pratique"].map(cat => (
      <button
        key={cat}
        onClick={() => setFilter(cat)}
        style={{
          padding:"9px 18px",
  borderRadius:999,
  border:"none",
  background: filter === cat
    ? "#06c167"
    : "rgba(255,255,255,0.9)",
  color: filter === cat ? "white" : "black",
  backdropFilter:"blur(10px)",
  boxShadow:"0 6px 18px rgba(0,0,0,0.12)",
  whiteSpace:"nowrap",
  fontWeight:500
        }}
      >
        <span style={{display:"flex",alignItems:"center",gap:6}}>
  <span>{icons[cat]}</span>
  <span>{cat}</span>
</span>
      </button>
    ))}
    
  </div>
 {/* Ajouter une adresse */}
{user && (

<div
style={{
display:"flex",
gap:8,
margin:"10px auto",
width:"92%",
maxWidth:520,
alignItems:"center"
}}
>

<div style={{position:"relative"}}>

<input
  placeholder="Ajouter une adresse"
  value={newPlace}
  onChange={(e)=>searchAddress(e.target.value)}
  style={{
    width:"92%",
    maxWidth:520,
    margin:"0 auto 10px",
    display:"block",
    padding:"10px",
    borderRadius:12,
    border:"1px solid #ddd"
  }}
/>

{/* ⭐ AUTOCOMPLETE PRO */}
{suggestions.length > 0 && (
<div
style={{
position:"absolute",
top:110,
left:"50%",
transform:"translateX(-50%)",
width:"92%",
maxWidth:520,

background:"rgba(255,255,255,0.75)",
backdropFilter:"blur(20px) saturate(180%)",
WebkitBackdropFilter:"blur(20px)",

borderRadius:20,
boxShadow:"0 25px 60px rgba(0,0,0,0.25)",
border:"1px solid rgba(255,255,255,0.6)",

overflow:"hidden",
zIndex:5000
}}
>

{suggestions.map((s,i)=>(
<div
key={i}
onClick={()=>{
setNewPlace(s.display_name)
setSuggestions([])
}}
style={{
padding:"14px 18px",
cursor:"pointer",
fontSize:14,
borderBottom:"1px solid rgba(0,0,0,0.05)",
transition:"0.15s"
}}
onMouseEnter={e=>{
e.currentTarget.style.background="rgba(0,0,0,0.05)"
}}
onMouseLeave={e=>{
e.currentTarget.style.background="transparent"
}}
>
📍 {s.display_name}
</div>
))}

</div>
)}
</div>

<select
value={newCategory}
onChange={(e)=>setNewCategory(e.target.value)}
style={{
padding:"10px",
borderRadius:14,
border:"none",
background:"rgba(255,255,255,0.9)",
boxShadow:"0 4px 14px rgba(0,0,0,0.15)",
fontSize:16
}}
>
<option value="Aides & précarité">🧺</option>
<option value="Écoute & soutien">💬</option>
<option value="Lien social">🎲</option>
<option value="Vie pratique">🧾</option>
</select>

<button
onClick={addPlace}
style={{
padding:"10px 14px",
borderRadius:14,
border:"none",
background:"#06c167",
color:"white",
fontWeight:700,
boxShadow:"0 6px 18px rgba(0,0,0,0.25)"
}}
>
+
</button>
</div>
)}

</div>

 {/* LISTE */}
<div
  style={{
  position:"absolute",
  bottom:0,
  left:"50%",
  transform:"translateX(-50%)",

  width:"100%",
  maxWidth:720,

  height:sheetHeight,
  transition:"height 0.18s cubic-bezier(.22,1,.36,1)",

  background:"rgba(255,255,255,0.25)",
  backdropFilter:"blur(30px) saturate(220%)",
  WebkitBackdropFilter:"blur(30px) saturate(220%)",

  borderTopLeftRadius:32,
  borderTopRightRadius:32,

  boxShadow:`
  0 -20px 60px rgba(0,0,0,0.25),
  inset 0 1px rgba(255,255,255,0.7)
  `,

  border:"1px solid rgba(255,255,255,0.4)",

  overflow:"hidden",
  zIndex:2000
}}
>

{/* FLOU NAV */}
<div
  style={{
    position:"absolute",
    bottom:0,
    left:0,
    right:0,
    height:90,
    backdropFilter:"blur(12px)",
    WebkitBackdropFilter:"blur(12px)",
    maskImage:"linear-gradient(to top, black 40%, transparent)",
    pointerEvents:"none",
    zIndex:3500
  }}
/>

  {/* POIGNÉE DRAG */}
  <div
    onMouseDown={startDrag}
    onTouchStart={startDrag}
    style={{
      height:40,
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      cursor:"grab"
    }}
  >
    <div
      style={{
        width:40,
        height:5,
        background:"rgba(0,0,0,0.3)",
        borderRadius:999
      }}
    />
  </div>
  <div
  style={{
    position:"absolute",
    top:40,
    left:0,
    right:0,
    height:40,
    background:"linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)",
    pointerEvents:"none"
  }}
/>

  {/* CONTENU SCROLL */}
  <div
    style={{
      overflowY:"auto",
      height:"calc(100% - 40px)",
      padding:"0 14px 20px 14px"
    }}
  >
    {(selectedPlace ? [selectedPlace] : filtered).map((aid, i) => (
      <div
        key={i}
        onClick={() => {
  setSelected(aid.pos)
  setSelectedPlace(aid)
  setSheetHeight(SNAP_MAX)
}}
        style={{
          background:"rgba(255,255,255,0.9)",
          backdropFilter:"blur(10px)",
          padding:"18px",
          marginBottom:"14px",
          borderRadius:"22px",
          boxShadow:"0 10px 30px rgba(0,0,0,0.12)",
          cursor:"pointer",
          border:"1px solid rgba(255,255,255,0.6)"
        }}
      >
        <h3 style={{
          margin:0,
          fontSize:18,
          fontWeight:600,
          letterSpacing:-0.2
        }}>
          {aid.name} {selectedPlace ? "🔥" : ""}
        </h3>

        <p style={{
          margin:"6px 0",
          fontSize:14,
          color:"#555"
        }}>
          {aid.category}
        </p>

        <p style={{
          margin:0,
          fontSize:14,
          fontWeight:700,
          color:"#06c167"
        }}>
          {aid.distance}
        </p>
        <button
onClick={(e)=>{
  e.stopPropagation()
  openRoute(aid.pos[0], aid.pos[1])
}}
style={{
marginTop:10,
padding:"8px 14px",
borderRadius:12,
border:"none",
background:"#1a73e8",
color:"white",
fontWeight:600,
cursor:"pointer"
}}
>
Itinéraire
</button>
      </div>
    ))}
  </div>

</div>
</div>
)
}
export default Map