const displayPara = document.getElementById('display-fact');

async function refresh(){
  await getCatFact();
  await updateBackground();
}

async function getCatFact(){
  let response = await fetch("https://catfact.ninja/fact");
  let json = await response.json();
  let quote = json.fact;
  displayPara.innerHTML = quote;
}

async function updateBackground(){

}

console.log(document.documentElement);
console.log(document.body.style.backgroundImage );