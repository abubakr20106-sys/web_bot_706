"use client"
import { useEffect,  useState, useRef } from "react";


// FULL CSGO SLIDING ANIMATION VERSION
// ✔ Sliding reel
// ✔ Random result
// ✔ Image support
// ✔ Center golden line stop


// ———————————————— ITEM LIST (WITH IMAGES) ————————————————
const items = [
{ name: "MAC-10 | Malachite", img: "/images/mac10.png", color: "blue" },
{ name: "M4A4 | Dragon King", img: "/images/m4a4_dragon_king.png", color: "purple" },
{ name: "Glock-18 | Catacombs", img: "/images/glock_catacombs.png", color: "blue" },
{ name: "AK-47 | Elite Build", img: "/images/ak_elite.png", color: "purple" },
{ name: "AWP | Graphite", img: "/images/awp_graphite.png", color: "pink" },
{ name: "M4A1-S | Printstream", img: "/images/m4a1s_print.png", color: "red" },
{ name: "Desert Eagle | Blaze", img: "/images/deagle_blaze.png", color: "gold" },
];


// Duplicate items to create a long sliding list
const longList = Array.from({ length: 40 }).map(
(_, i) => items[i % items.length]
);


// ———————————————— COMPONENT ————————————————
export default function CaseOpen() {
const [rolling, setRolling] = useState(false);
const [result, setResult] = useState(null);
const containerRef = useRef(null);


const openCase = () => {
if (rolling) return;
setRolling(true);
setResult(null);


const container = containerRef.current;
const itemWidth = 160;


const randomIndex = Math.floor(Math.random() * longList.length);
const stopPosition = randomIndex * itemWidth;


container.style.transition = "none";
container.style.transform = `translateX(0px)`;


setTimeout(() => {
container.style.transition = "transform 3.3s cubic-bezier(0.05, 0.9, 0.2, 1)";
container.style.transform = `translateX(-${stopPosition}px)`;
}, 20);


setTimeout(() => {
setRolling(false);
setResult(longList[randomIndex]);
}, 3500);
};


return (
<div className="w-full flex flex-col items-center p-6 font-sans text-white bg-gray-900 min-h-screen">
<h1 className="text-3xl font-bold mb-6">CSGO Case Opening</h1>


<button
onClick={openCase}
className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-lg font-semibold mb-6"
>
{rolling ? "Opening..." : "Open Case"}
</button>


{/* —————————————————— SLIDER —————————————————— */}
<div className="relative w-[600px] h-[150px] overflow-hidden border border-gray-700 rounded-xl bg-black">
{/* Golden line */}
<div className="absolute left-1/2 top-0 h-full w-[4px] bg-yellow-400 z-20"></div>


{/* Sliding Items */}
<div ref={containerRef} className="flex gap-2 absolute top-0 left-0 p-2">
{longList.map((item, i) => (
<div
key={i}
className="w-[150px] h-[140px] bg-gray-800 rounded-lg flex flex-col items-center justify-center border"
style={{ borderColor: item.color }}
>
<img
src={item.img}
alt={item.name}
className="w-20 h-14 object-contain mb-2"
/>
<p className="text-xs text-center" style={{ color: item.color }}>
{item.name}
</p>
</div>
))}
</div>
</div>


{/* —————————————————— RESULT —————————————————— */}
{result && (
<div className="mt-6 text-center">
<h2 className="text-2xl font-bold mb-2">🎉 You got:</h2>
<div
className="p-4 inline-block rounded-xl border shadow-lg"
style={{ borderColor: result.color }}
>
<img
src={result.img}
alt={result.name}
className="w-48 h-32 object-contain mb-2"
/>
<p className="text-xl font-semibold" style={{ color: result.color }}>
{result.name}
</p>
</div>
</div>
)}
</div>
);
}