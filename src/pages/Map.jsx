import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet"
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
      console.log("CLICK MAP") // ⭐ TEST
      onClick()
    }
  })
  return null
}

const theme = {

  primary:"#5B679F",

  cream:"#FDF6E9",

  white:"#FFFFFF",

  pink:"#D8B2CF",

  success:"#4CAF50",

  danger:"#E53935"

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
  const [newCategory, setNewCategory] = useState("J’ai faim")
  const [heading, setHeading] = useState(0)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [openedPlace, setOpenedPlace] = useState(null)
  const [showCategories,setShowCategories] = useState(false)
  const [showDistance,setShowDistance] = useState(false)
  const [showPrice,setShowPrice] = useState(false)
  const [showOpen,setShowOpen] = useState(false)
  const [showProof,setShowProof] = useState(false)
  const [tempCategories,setTempCategories] = useState([])
  const [activeCategories,setActiveCategories] = useState([])
  const [distanceFilter,setDistanceFilter] = useState(null)
  const [priceFilter,setPriceFilter] = useState(null)
  const [openFilter,setOpenFilter] = useState(null)
  const [proofFilter,setProofFilter] = useState(null)

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

const createCategoryIcon = (iconUrl) => {

  return L.icon({

    iconUrl,

    iconSize:[42,42],

    iconAnchor:[21,42],

    popupAnchor:[0,-42],

    className:"custom-marker"

  })

}

// ⭐ Icons pour les filtres
const categories = [

  {
    name:"J’ai faim",
    icon:"/icons/Panier.svg"
  },

  {
    name:"Besoin d’écoute",
    icon:"/icons/Haut-parleur.svg"
  },

  {
    name:"Santé & hygiène",
    icon:"/icons/Brosse-dent.svg"
  },

  {
    name:"Mes droits",
    icon:"/icons/Actus.svg"
  },

  {
    name:"Sortir & rencontrer",
    icon:"/icons/Ballon.svg"
  },
  
]

const icons = Object.fromEntries(
  categories.map(cat => [
    cat.name,
    cat.icon
  ])
)

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
 
  let filtered = places

// ⭐ filtre catégories multiples
if(activeCategories.length > 0){

  filtered = filtered.filter(p =>
    activeCategories.includes(p.category)
  )

}

// ⭐ recherche texte
filtered = filtered.filter(a =>
  a.name.toLowerCase().includes(search.toLowerCase())
)

  if(distanceFilter){

  filtered = filtered.filter(a => {

    const dx = userPos[0] - a.lat
    const dy = userPos[1] - a.lng

    const distanceKm =
      Math.sqrt(dx * dx + dy * dy) * 111

    return distanceKm <= distanceFilter

  })

}

if(priceFilter){

  filtered = filtered.filter(a =>

    a.price?.includes(priceFilter)

  )

}

if(openFilter){

  filtered = filtered.filter(a =>

    a.open?.includes(openFilter)

  )

}

if(proofFilter){

  filtered = filtered.filter(a =>

    a.proof?.includes(proofFilter)

  )

}

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
          <img
  src="${icons[aid.category]}"
  style="
    width:24px;
    height:24px;
    object-fit:contain;
  "
/>
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

<div
  style={{
    position:"relative",
    width:28,
    height:28,

    display:"flex",
    alignItems:"center",
    justifyContent:"center"
  }}
>

  {/* glow */}
  <div
    style={{
      position:"absolute",

      width:34,
      height:34,

      background:"rgba(91,103,159,0.18)",

      borderRadius:"50%",

      animation:"gpsPulse 1.8s infinite"
    }}
  />

  {/* icône */}
  <img
    src="/icons/Clic.svg"
    alt=""

    style={{
      width:26,
      height:26,

      objectFit:"contain",

      position:"relative",
      zIndex:2
    }}
  />

</div>

  </button>

  {/* NOUVEAUX FILTRES */}
<div
  style={{
    display:"flex",
    gap:10,
    overflowX:"auto",
    paddingBottom:4
  }}
>

  {[
    "Catégories",
    "Distance",
    "Prix",
    "Ouvert",
    "Justificatif"
  ].map((item,i)=>(

    <button
  key={i}

  onClick={()=>{
    if(item === "Catégories"){
      setShowCategories(!showCategories)
    }

    if(item === "Distance"){
      setShowDistance(!showDistance)
    }

    if(item === "Prix"){
      setShowPrice(!showPrice)
    }
  
    if(item === "Ouvert"){
      setShowOpen(!showOpen)
    }

    if(item === "Justificatif"){
      setShowProof(!showProof)
    }
  }}

  style={{
    padding:"10px 16px",
    borderRadius:999,

    border:"none",

    background:
  item === "Catégories" &&
  activeCategories.length > 0
    ? theme.primary
    : "rgba(255,255,255,0.9)",

    backdropFilter:"blur(12px)",

    boxShadow:
  item === "Catégories" &&
  activeCategories.length > 0
    ? "0 10px 24px rgba(91,103,159,0.35)"
    : "0 6px 18px rgba(0,0,0,0.12)",

    whiteSpace:"nowrap",

    fontWeight:600,
  color:

item === "Catégories" &&
activeCategories.length > 0

? "white"

: item === "Distance" &&
distanceFilter !== null

? "#E05A5A"

: item === "Prix" &&
priceFilter === "Gratuit"

? "#06C167"

: item === "Prix" &&
priceFilter === "Prix social"

? "#F59E0B"

: item === "Ouvert" &&
openFilter === "Aujourd’hui"

? "#14B8A6"

: item === "Ouvert" &&
openFilter === "Demain"

? "#0F766E"

: "#111",
    fontSize:15,

    display:"flex",
    alignItems:"center",
    gap:8,

    cursor:"pointer"
  }}
>

      <span>

{item === "Catégories" ? (

activeCategories.length === 0

? (
  "Catégories"
)

: (

<div
  style={{
    display:"flex",
    alignItems:"center",
    gap:6
  }}
>

  {activeCategories.slice(0,3).map((cat,i)=>{

    const found = categories.find(
      c => c.name === cat
    )

    return found ? (

      <img
        key={i}
        src={found.icon}
        alt=""
        style={{
          width:24,
          height:24,
          objectFit:"contain"
        }}
      />

    ) : null

  })}

</div>

)

) 

: item === "Distance"

? (

distanceFilter === null

? "Distance"

: distanceFilter === 0.5

? "500m"

: distanceFilter === 1

? "1 km"

: "3 km"

)

: item === "Prix"

? (

priceFilter === null

? "Prix"

: priceFilter === "Gratuit"

? "● Gratuit"

: "● Prix social"

)

: item === "Ouvert"

? (

openFilter === null

? "Ouvert"

: openFilter === "Aujourd’hui"

? (
  <span style={{
    color:"#14B8A6",
    fontWeight:700
  }}>
    ● Aujourd’hui
  </span>
)

: (
  <span style={{
    color:"#0F766E",
    fontWeight:700
  }}>
    ● Demain
  </span>
)

)

: item === "Justificatif"

? (

proofFilter === null

? "Justificatif"

: proofFilter === "Sans justificatif"

? (
  <span style={{
    color:"#8B9AD9",
    fontWeight:700
  }}>
    ● Sans justificatif
  </span>
)

: (
  <span style={{
    color:"#5B679F",
    fontWeight:700
  }}>
    ● Avec justificatif
  </span>
)

)
: item}

</span>

      <span
  style={{

    fontSize:12,

    color:

      item === "Distance" &&
      distanceFilter !== null

      ? "#E05A5A"

      : item === "Prix" &&
      priceFilter === "Gratuit"

      ? "#06C167"

      : item === "Prix" &&
      priceFilter === "Prix social"

      ? "#F59E0B"

      : item === "Ouvert" &&
      openFilter === "Aujourd’hui"

      ? "#14B8A6"

      : item === "Ouvert" &&
      openFilter === "Demain"

      ? "#0F766E"


      : item === "Justificatif" &&
      proofFilter === "Sans justificatif"

      ? "#8B9AD9"

      : item === "Justificatif" &&
      proofFilter === "Avec justificatif"

      ? "#5B679F"

      : "#666"
  }}
>
  ▼
</span>

    </button>

  ))}
{(
  activeCategories.length > 0 ||

  distanceFilter !== null ||

  priceFilter !== null||

  openFilter !== null||

  proofFilter !== null
) && (

  <button

    onClick={()=>{

      setTempCategories([])
      setActiveCategories([])

      setDistanceFilter(null)

      setPriceFilter(null)

      setOpenFilter(null)

      setProofFilter(null)
    }}

    style={{

      padding:"10px 16px",

      borderRadius:999,

      border:"none",

      background:"rgba(255,255,255,0.9)",

      backdropFilter:"blur(12px)",

      boxShadow:"0 6px 18px rgba(0,0,0,0.12)",

      whiteSpace:"nowrap",

      fontWeight:700,

      fontSize:15,

      cursor:"pointer",

      animation:"dropdownIn 0.18s ease"

    }}
  >

    Effacer

  </button>

)}
</div>

</div>

{/* DROPDOWN CATÉGORIES */}
{showCategories && (

<>

{/* OVERLAY */}

<div
onClick={()=>setShowCategories(false)}

style={{

position:"fixed",
inset:0,

background:"rgba(0,0,0,0.35)",

backdropFilter:"blur(8px)",

zIndex:15000,

animation:"fadeIn 0.2s ease"
}}
/>

{/* SHEET */}

<div
style={{

position:"fixed",

left:0,
right:0,
bottom:0,

background:"rgba(255,255,255,0.92)",

backdropFilter:"blur(30px)",

borderTopLeftRadius:32,
borderTopRightRadius:32,

padding:"20px 20px 30px",

zIndex:16000,

boxShadow:"0 -10px 40px rgba(0,0,0,0.18)",

animation:"sheetUp 0.28s ease",

maxHeight:"75vh",

overflowY:"auto"
}}
>

{/* HANDLE */}

<div
style={{

width:46,
height:5,

background:"rgba(0,0,0,0.15)",

borderRadius:999,

margin:"0 auto 20px"
}}
/>

{/* TITLE */}

<h2
style={{
fontSize:22,
fontWeight:800,
marginBottom:18
}}
>
Catégories
</h2>

{/* LISTE */}

<div
style={{
display:"flex",
flexDirection:"column",
gap:10
}}
>

{categories.map((cat,i)=>(

<button
key={i}

onClick={()=>{

if(tempCategories.includes(cat.name)){

setTempCategories(
tempCategories.filter(c => c !== cat.name)
)

}else{

setTempCategories([
...tempCategories,
cat.name
])

}

}}

style={{

border:"none",

background:
tempCategories.includes(cat.name)
? "rgba(91,103,159,0.12)"
: "rgba(255,255,255,0.7)",

padding:"16px 18px",

borderRadius:22,

display:"flex",
alignItems:"center",
gap:14,

fontSize:16,

fontWeight:
tempCategories.includes(cat.name)
? 700
: 600,

boxShadow:
tempCategories.includes(cat.name)
? "0 10px 24px rgba(91,103,159,0.18)"
: "0 4px 12px rgba(0,0,0,0.06)",

transition:"0.18s",

cursor:"pointer"
}}
>

<img
src={cat.icon}
alt=""

style={{
width:24,
height:24,
objectFit:"contain"
}}
/>

<span>
{cat.name}
</span>

</button>

))}

</div>

{/* ACTIONS */}

<div
style={{
display:"flex",
gap:12,
marginTop:24
}}
>

<button
onClick={()=>{

setTempCategories([])
setActiveCategories([])

setShowCategories(false)

}}

style={{

flex:1,
height:54,

border:"none",

borderRadius:20,

background:"rgba(0,0,0,0.06)",

fontWeight:700,

fontSize:15,

cursor:"pointer"
}}
>
Réinitialiser
</button>

<button
onClick={()=>{

setActiveCategories(tempCategories)

setShowCategories(false)

}}

style={{

flex:1,
height:54,

border:"none",

borderRadius:20,

background:theme.primary,

color:"white",

fontWeight:800,

fontSize:15,

boxShadow:"0 12px 30px rgba(91,103,159,0.35)",

cursor:"pointer"
}}
>
Appliquer
</button>

</div>

</div>

</>

)}


{showDistance && (

<>

<div
onClick={()=>setShowDistance(false)}

style={{
position:"fixed",
inset:0,

background:"rgba(0,0,0,0.35)",

backdropFilter:"blur(8px)",

zIndex:15000,

animation:"fadeIn 0.2s ease"
}}
/>

<div
style={{

position:"fixed",

left:0,
right:0,
bottom:0,

background:"rgba(255,255,255,0.92)",

backdropFilter:"blur(30px)",

borderTopLeftRadius:32,
borderTopRightRadius:32,

padding:"20px 20px 30px",

zIndex:16000,

boxShadow:"0 -10px 40px rgba(0,0,0,0.18)",

animation:"sheetUp 0.28s ease",

maxHeight:"75vh",

overflowY:"auto"
}}
>

<div
style={{

width:46,
height:5,

background:"rgba(0,0,0,0.15)",

borderRadius:999,

margin:"0 auto 20px"
}}
/>

<h2
style={{
fontSize:22,
fontWeight:800,
marginBottom:18
}}
>
Distance
</h2>

<div
style={{
display:"flex",
flexDirection:"column",
gap:10
}}
>

{[
{
label:"500m",
value:0.5
},

{
label:"1 km",
value:1
},

{
label:"3 km",
value:3
},

{
label:"Peu importe",
value:null
}

].map((item,i)=>(

<button
key={i}

onClick={()=>{
setDistanceFilter(item.value)
setShowDistance(false)
}}

style={{

border:"none",

background:
distanceFilter === item.value
? "rgba(91,103,159,0.12)"
: "rgba(255,255,255,0.7)",

padding:"16px 18px",

borderRadius:22,

display:"flex",
alignItems:"center",
gap:14,

fontSize:16,

fontWeight:
distanceFilter === item.value
? 700
: 600,

boxShadow:
distanceFilter === item.value
? "0 10px 24px rgba(91,103,159,0.18)"
: "0 4px 12px rgba(0,0,0,0.06)",

cursor:"pointer"
}}
>

<div
style={{
width:10,
height:10,

borderRadius:"50%",

background:
item.value !== null
? "#E05A5A"
: "#D1D5DB"
}}
/>

<span>
{item.label}
</span>

</button>

))}

</div>

</div>

</>

)}

{showPrice && (

<>

<div
onClick={()=>setShowPrice(false)}

style={{
position:"fixed",
inset:0,

background:"rgba(0,0,0,0.35)",

backdropFilter:"blur(8px)",

zIndex:15000
}}
/>

<div
style={{

position:"fixed",

left:0,
right:0,
bottom:0,

background:"rgba(255,255,255,0.92)",

backdropFilter:"blur(30px)",

borderTopLeftRadius:32,
borderTopRightRadius:32,

padding:"20px 20px 30px",

zIndex:16000,

boxShadow:"0 -10px 40px rgba(0,0,0,0.18)",

animation:"sheetUp 0.28s ease"
}}
>

<div
style={{
width:46,
height:5,
background:"rgba(0,0,0,0.15)",
borderRadius:999,
margin:"0 auto 20px"
}}
/>

<h2
style={{
fontSize:22,
fontWeight:800,
marginBottom:18
}}
>
Prix
</h2>

<div
style={{
display:"flex",
flexDirection:"column",
gap:10
}}
>

{[
{
label:"Gratuit",
value:"Gratuit",
color:"#06C167"
},

{
label:"Prix social",
value:"Prix social",
color:"#F59E0B"
},

{
label:"Peu importe",
value:null,
color:"#D1D5DB"
}

].map((item,i)=>(

<button
key={i}

onClick={()=>{
setPriceFilter(item.value)
setShowPrice(false)
}}

style={{

border:"none",

background:
priceFilter === item.value
? "rgba(91,103,159,0.12)"
: "rgba(255,255,255,0.7)",

padding:"16px 18px",

borderRadius:22,

display:"flex",
alignItems:"center",
gap:14,

fontSize:16,

fontWeight:
priceFilter === item.value
? 700
: 600,

boxShadow:
priceFilter === item.value
? "0 10px 24px rgba(91,103,159,0.18)"
: "0 4px 12px rgba(0,0,0,0.06)",

cursor:"pointer"
}}
>

<div
style={{
width:10,
height:10,

borderRadius:"50%",

background:item.color
}}
/>

<span>
{item.label}
</span>

</button>

))}

</div>

</div>

</>

)}

{showOpen && (

<>

<div
onClick={()=>setShowOpen(false)}

style={{
position:"fixed",
inset:0,

background:"rgba(0,0,0,0.35)",

backdropFilter:"blur(8px)",

zIndex:15000
}}
/>

<div
style={{

position:"fixed",

left:0,
right:0,
bottom:0,

background:"rgba(255,255,255,0.92)",

backdropFilter:"blur(30px)",

borderTopLeftRadius:32,
borderTopRightRadius:32,

padding:"20px 20px 30px",

zIndex:16000,

boxShadow:"0 -10px 40px rgba(0,0,0,0.18)",

animation:"sheetUp 0.28s ease"
}}
>

<div
style={{
width:46,
height:5,
background:"rgba(0,0,0,0.15)",
borderRadius:999,
margin:"0 auto 20px"
}}
/>

<h2
style={{
fontSize:22,
fontWeight:800,
marginBottom:18
}}
>
Ouvert
</h2>

<div
style={{
display:"flex",
flexDirection:"column",
gap:10
}}
>

{[
{
label:"Aujourd’hui",
value:"Aujourd’hui",
color:"#14B8A6"
},

{
label:"Demain",
value:"Demain",
color:"#0F766E"
},

{
label:"Peu importe",
value:null,
color:"#D1D5DB"
}

].map((item,i)=>(

<button
key={i}

onClick={()=>{
setOpenFilter(item.value)
setShowOpen(false)
}}

style={{

border:"none",

background:
openFilter === item.value
? "rgba(91,103,159,0.12)"
: "rgba(255,255,255,0.7)",

padding:"16px 18px",

borderRadius:22,

display:"flex",
alignItems:"center",
gap:14,

fontSize:16,

fontWeight:
openFilter === item.value
? 700
: 600,

boxShadow:
openFilter === item.value
? "0 10px 24px rgba(91,103,159,0.18)"
: "0 4px 12px rgba(0,0,0,0.06)",

cursor:"pointer"
}}
>

<div
style={{
width:10,
height:10,

borderRadius:"50%",

background:item.color
}}
/>

<span>
{item.label}
</span>

</button>

))}

</div>

</div>

</>

)}

{showProof && (

<>

<div
onClick={()=>setShowProof(false)}

style={{
position:"fixed",
inset:0,

background:"rgba(0,0,0,0.35)",

backdropFilter:"blur(8px)",

zIndex:15000
}}
/>

<div
style={{

position:"fixed",

left:0,
right:0,
bottom:0,

background:"rgba(255,255,255,0.92)",

backdropFilter:"blur(30px)",

borderTopLeftRadius:32,
borderTopRightRadius:32,

padding:"20px 20px 30px",

zIndex:16000,

boxShadow:"0 -10px 40px rgba(0,0,0,0.18)",

animation:"sheetUp 0.28s ease"
}}
>

<div
style={{
width:46,
height:5,
background:"rgba(0,0,0,0.15)",
borderRadius:999,
margin:"0 auto 20px"
}}
/>

<h2
style={{
fontSize:22,
fontWeight:800,
marginBottom:18
}}
>
Justificatif
</h2>

<div
style={{
display:"flex",
flexDirection:"column",
gap:10
}}
>

{[
{
label:"Sans justificatif",
value:"Sans justificatif",
color:"#8B9AD9"
},

{
label:"Avec justificatif",
value:"Avec justificatif",
color:"#5B679F"
},

{
label:"Peu importe",
value:null,
color:"#D1D5DB"
}

].map((item,i)=>(

<button
key={i}

onClick={()=>{
setProofFilter(item.value)
setShowProof(false)
}}

style={{

border:"none",

background:
proofFilter === item.value
? "rgba(91,103,159,0.12)"
: "rgba(255,255,255,0.7)",

padding:"16px 18px",

borderRadius:22,

display:"flex",
alignItems:"center",
gap:14,

fontSize:16,

fontWeight:
proofFilter === item.value
? 700
: 600,

boxShadow:
proofFilter === item.value
? "0 10px 24px rgba(91,103,159,0.18)"
: "0 4px 12px rgba(0,0,0,0.06)",

cursor:"pointer"
}}
>

<div
style={{
width:10,
height:10,

borderRadius:"50%",

background:item.color
}}
/>

<span>
{item.label}
</span>

</button>

))}

</div>

</div>

</>

)}


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
{categories.map((cat,i)=>(

  <option
    key={i}
    value={cat.name}
  >
    {cat.icon} {cat.name}
  </option>

))}
</select>

<button
onClick={addPlace}
style={{
padding:"10px 14px",
borderRadius:14,
border:"none",
background:theme.success,
color:"white",
fontWeight:700,
boxShadow:"0 6px 18px rgba(0,0,0,0.25)"
}}
>
+
</button>
</div>
)}


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

        // ⭐ ouvre la vraie fiche
        if(selectedPlace){
          setOpenedPlace(aid)
          return
        }

        // ⭐ sélection normale
        setSelected(aid.pos)
        setSelectedPlace(aid)
        setSheetHeight(SNAP_MID)

      }}
      style={{
        background:"white",
        padding:"15px",
        marginBottom:"10px",
        borderRadius:"15px"
      }}
    >

      <h3>{aid.name}</h3>

      <p
  style={{
    color:"#5B679F",
    fontWeight:700
  }}
>
  {aid.category}
</p>

      <p
  style={{
    color:"#E05A5A",
    fontWeight:700
  }}
>
  📍 {aid.distance}
</p>

    </div>

  ))}

</div>

</div>

{/* ⭐ VRAIE FICHE */}
{openedPlace && (
  <div
    style={{
      position:"fixed",
      bottom:0,
      left:0,
      right:0,
      height:"78%",

      background:"rgba(255,255,255,0.72)",
      backdropFilter:"blur(30px) saturate(180%)",
      WebkitBackdropFilter:"blur(30px)",

      borderTopLeftRadius:34,
      borderTopRightRadius:34,

      border:"1px solid rgba(255,255,255,0.45)",

      boxShadow:`
        0 -20px 60px rgba(0,0,0,0.25),
        inset 0 1px rgba(255,255,255,0.7)
      `,

      zIndex:5000,

      padding:"22px",

      overflowY:"auto",

      animation:"sheetUp 0.42s cubic-bezier(.22,1,.36,1)"
    }}
  >

    {/* ⭐ poignée iphone */}
    <div
      style={{
        width:42,
        height:5,
        background:"rgba(0,0,0,0.18)",
        borderRadius:999,
        margin:"0 auto 18px auto"
      }}
    />

    {/* HERO IMAGE */}
    <div
      style={{
        height:300,
        borderRadius:30,
        overflow:"hidden",
        position:"relative",
        marginBottom:28
      }}
    >

      {/* IMAGE */}
      <img
        src={
          openedPlace.image ||
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1400"
        }
        alt=""
        style={{
          width:"100%",
          height:"100%",
          objectFit:"cover",
          transform:"scale(1.02)"
        }}
      />

      {/* DÉGRADÉ */}
      <div
        style={{
          position:"absolute",
          inset:0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.78), transparent 60%)"
        }}
      />

      {/* BOUTON FERMER */}
      <button
        onClick={() => {
          setOpenedPlace(null)
        }}
        style={{
          position:"absolute",
          top:16,
          left:16,

          width:42,
          height:42,

          borderRadius:"50%",
          border:"none",

          background:"rgba(255,255,255,0.82)",
          backdropFilter:"blur(10px)",

          fontSize:20,
          fontWeight:700,

          cursor:"pointer"
        }}
      >
        ×
      </button>

      {/* INFOS SUR IMAGE */}
      <div
        style={{
          position:"absolute",
          left:20,
          bottom:20,
          color:"white"
        }}
      >

        <div
          style={{
            display:"flex",
            alignItems:"center",
            gap:14
          }}
        >

          {/* LOGO */}
          <div
            style={{
              width:68,
              height:68,

              borderRadius:"50%",
              overflow:"hidden",

              border:"3px solid rgba(255,255,255,0.9)",

              boxShadow:"0 10px 25px rgba(0,0,0,0.25)",

              flexShrink:0
            }}
          >

            <img
              src={
                openedPlace.logo ||
                "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
              }
              alt=""
              style={{
                width:"100%",
                height:"100%",
                objectFit:"cover"
              }}
            />

          </div>

          {/* TITRE */}
          <div>

            <h1
              style={{
                margin:0,
                fontSize:30,
                fontWeight:800,
                letterSpacing:-1.2
              }}
            >
              {openedPlace.name}
            </h1>

            <p
              style={{
                marginTop:4,
                fontSize:15,
                opacity:0.92,
                fontWeight:700,
                color:"#8B9AD9"
              }}
            >
              {openedPlace.category}
            </p>

            <p
             style={{
              marginTop:6,
              fontSize:14,
              fontWeight:700,
              color:"#FFDDDD"
              }}
            >
             📍 {openedPlace.distance}
            </p>

          </div>

        </div>

      </div>

    </div>

{/* INFOS IMPORTANTES */}
<div
  style={{
    display:"flex",
    flexDirection:"column",
    gap:12,
    marginBottom:30
  }}
>

 {/* OUVERT */}
<div
  style={{

    display:"flex",
    flexDirection:"column",
    gap:4,

    padding:"14px 16px",

    borderRadius:20,

    background:"rgba(255,255,255,0.55)",

    backdropFilter:"blur(14px)",

    border:"1px solid rgba(255,255,255,0.4)"
  }}
>

  <div
    style={{
      display:"flex",
      alignItems:"center",
      gap:10
    }}
  >

    <span
      style={{
        fontSize:16
      }}
    >
      🕒
    </span>

    <span
      style={{
        fontWeight:600,
        fontSize:15,
        color:"#444"
      }}
    >
      {openedPlace.open || "Horaires non renseignés"}
    </span>

  </div>

  <div
    style={{
      marginLeft:26,

      fontSize:13,

      fontWeight:600,

      color:
        openedPlace.open_now
        ? "#14B8A6"
        : "#DC2626"
    }}
  >
    {openedPlace.open_now
      ? "Ouvert actuellement"
      : "Actuellement fermé"}
  </div>

</div>

  {/* PRIX */}
  <div
    style={{

      display:"flex",
      alignItems:"center",
      gap:12,

      padding:"14px 16px",

      borderRadius:20,

      background:
  openedPlace.price === "Gratuit"
  ? "rgba(6,193,103,0.10)"
  : "rgba(245,158,11,0.10)",

      backdropFilter:"blur(14px)",

      border:"1px solid rgba(255,255,255,0.4)"
    }}
  >

    <div
      style={{
        width:10,
        height:10,

        borderRadius:"50%",

        background:
          openedPlace.price === "Gratuit"
          ? "#06C167"
          : "#F59E0B",

        flexShrink:0
      }}
    />

    <div
      style={{
        fontWeight:600,
        fontSize:15
      }}
    >
      {openedPlace.price || "Gratuit"}
    </div>

  </div>

  {/* JUSTIFICATIF */}
  {openedPlace.proof && (

    <div
      style={{

        display:"flex",
        alignItems:"center",
        gap:12,

        padding:"14px 16px",

        borderRadius:20,

        background:
  openedPlace.proof === "Sans justificatif"
  ? "rgba(139,154,217,0.10)"
  : "rgba(91,103,159,0.10)",

        backdropFilter:"blur(14px)",

        border:"1px solid rgba(255,255,255,0.4)"
      }}
    >

      <div
        style={{
          width:10,
          height:10,

          borderRadius:"50%",

          background:
            openedPlace.proof === "Sans justificatif"
            ? "#8B9AD9"
            : "#5B679F",

          flexShrink:0
        }}
      />

      <div
        style={{
          fontWeight:600,
          fontSize:15
        }}
      >
        {openedPlace.proof}
      </div>

    </div>

  )}

</div>

    {/* SÉPARATEUR */}
    <div
      style={{
        height:1,
        background:"rgba(0,0,0,0.08)",
        marginBottom:24
      }}
    />

    {/* ADRESSE */}
    <div
      style={{
        marginBottom:24
      }}
    >

      <div
        style={{
          fontSize:15,
fontWeight:800,
color:"#666",
marginBottom:16,
letterSpacing:1.2
        }}
      >
        ADRESSE
      </div>

      <div
        style={{
          fontSize:17,
          lineHeight:1.5,
          fontWeight:500
        }}
      >
        📍 {openedPlace.address || "Adresse non renseignée"}
      </div>

    </div>

    {/* SÉPARATEUR */}
    <div
      style={{
        height:1,
        background:"rgba(0,0,0,0.08)",
        marginBottom:24
      }}
    />

    {/* À PROPOS */}
    <div
      style={{
        marginBottom:28
      }}
    >

      <div
  style={{
    fontSize:15,
fontWeight:800,
color:"#666",
marginBottom:16,
letterSpacing:1.2
  }}
>
  À PROPOS
</div>

      <p
        style={{
          lineHeight:1.7,
          fontSize:16,
          color:"#444"
        }}
      >
        {openedPlace.description || "Pas de description"}
      </p>

    </div>

<div
  style={{
    height:1,
    background:"rgba(0,0,0,0.08)",
    marginBottom:24
  }}
/>

{/* CONTACT */}
<div
  style={{
    marginBottom:28
  }}
>

  <div
    style={{
      fontSize:15,
fontWeight:800,
color:"#666",
marginBottom:16,
letterSpacing:1.2
    }}
  >
    CONTACT
  </div>

  <div
    style={{
      display:"flex",
      flexDirection:"column",
      gap:12
    }}
  >

    {/* TÉLÉPHONE */}
    {openedPlace.phone && (

      <a
        href={`tel:${openedPlace.phone}`}

        style={{
          textDecoration:"none",
          color:"inherit"
        }}
      >

        <div
          style={{
            background:"rgba(255,255,255,0.55)",

            padding:"16px",

            borderRadius:20,

            display:"flex",
            alignItems:"center",
            gap:12
          }}
        >

          <div
            style={{
              width:10,
              height:10,
              borderRadius:"50%",
              background:"#14B8A6",
              flexShrink:0
            }}
          />

          <span
            style={{
              fontWeight:600
            }}
          >
            📞 {openedPlace.phone}
          </span>

        </div>

      </a>

    )}

    {/* SITE */}
    {openedPlace.website && (

      <a
        href={openedPlace.website}
        target="_blank"
        rel="noreferrer"

        style={{
          textDecoration:"none",
          color:"inherit"
        }}
      >

        <div
          style={{
            background:"rgba(255,255,255,0.55)",

            padding:"16px",

            borderRadius:20,

            display:"flex",
            alignItems:"center",
            gap:12
          }}
        >

          <div
            style={{
              width:10,
              height:10,
              borderRadius:"50%",
              background:"#8B9AD9",
              flexShrink:0
            }}
          />

          <span
            style={{
              fontWeight:600
            }}
          >
            🌐 Site web
          </span>

        </div>

      </a>

    )}

  </div>

</div>

<div
  style={{
    height:1,
    background:"rgba(0,0,0,0.08)",
    marginBottom:24
  }}
/>

    {/* INFOS SUPPLÉMENTAIRES */}
    <div
      style={{
        marginBottom:120
      }}
    >

      <div
  style={{
    fontSize:15,
    fontWeight:800,
    color:"#666",
    marginBottom:16,
    letterSpacing:1.2
  }}
>
  INFOS SUPPLÉMENTAIRES
</div>

      <div
        style={{
          display:"flex",
          flexDirection:"column",
          gap:14
        }}
      >

        <div
  style={{
    background:"rgba(255,255,255,0.55)",
    padding:"16px",
    borderRadius:20,

    display:"flex",
    alignItems:"center",
    gap:10
  }}
>

  <div
    style={{
      width:10,
      height:10,
      borderRadius:"50%",
      background:"#F5C451",
      flexShrink:0
    }}
  />

  <span
    style={{
      fontWeight:600,
      color:"#7A5B00"
    }}
  >
    {openedPlace.extra_info || "Aucune information supplémentaire"}
  </span>

</div>

      </div>

    </div>

    {/* STICKY BOTTOM BAR */}
    <div
      style={{
        position:"sticky",
        bottom:-22,

        marginLeft:-22,
        marginRight:-22,
        marginBottom:-22,

        padding:"18px 22px",

        background:"rgba(255,255,255,0.82)",
        backdropFilter:"blur(20px)",
        WebkitBackdropFilter:"blur(20px)",

        borderTop:"1px solid rgba(255,255,255,0.6)",

        display:"flex",
        alignItems:"center",
        justifyContent:"space-between",
        gap:14
      }}
    >

      {/* ÉTAT */}
<div>

  <div
    style={{
      color:
        openedPlace.open_now
        ? "#14B8A6"
        : "#DC2626",

      fontWeight:800,
      fontSize:15
    }}
  >
    {openedPlace.open_now
      ? "● Ouvert actuellement"
      : "● Actuellement fermé"}
  </div>

</div>

      {/* BOUTON */}
      <button
        onClick={() =>
          openRoute(
            openedPlace.pos[0],
            openedPlace.pos[1]
          )
        }

        onMouseEnter={(e)=>{
  e.currentTarget.style.transform = "scale(1.03)"
}}

onMouseLeave={(e)=>{
  e.currentTarget.style.transform = "scale(1)"
}}

        style={{
          height:52,
          padding:"0 22px",

          border:"none",
          borderRadius:18,

          background:theme.primary,
          color:"white",

          fontSize:15,
          fontWeight:700,

          cursor:"pointer",

          boxShadow:"0 10px 25px rgba(91,103,159,0.35)",
          transition:"0.2s"
        }}
      >
        🧭 Itinéraire
      </button>

    </div>

  </div>
)}

</div>
)
}
export default Map