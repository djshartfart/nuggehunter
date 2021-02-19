const canvasDiv = document.getElementById("canvasDiv")
const canvas = document.createElement('canvas');
canvas.id = "canvas";
canvas.width = 500
canvas.height = 500
canvasDiv.appendChild(canvas)

let interval = 500
const slider = document.getElementById("speed");
// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
 interval = 1000-parseInt(slider.value)
}

function start(){
  let ended = false;


const ctx = canvas.getContext("2d")
const counter = document.getElementById("counter")
let nuggesEaten = 0;

function addPoint(){
  nuggesEaten++
   const text = `${nuggesEaten*500} kalorier / ${nuggesEaten} dubbelnugge`
   counter.innerText = text;
}
const headImage = document.getElementById("head")
const backgroundImage = document.getElementById("background")

const fileInput = document.getElementById('headinp');
fileInput.addEventListener('change', function(ev) {
  if(ev.target.files) {
     let file = ev.target.files[0];
     var reader  = new FileReader();
         
     reader.readAsDataURL(file);
     reader.onloadend = function (e) {
      headImage.src = e.target.result;
      }
  }
});
const fileInput1 = document.getElementById('backinp');
fileInput1.addEventListener('change', function(ev) {
  if(ev.target.files) {
     let file = ev.target.files[0];
     var reader  = new FileReader();
         
     reader.readAsDataURL(file);
     reader.onloadend = function (e) {
      backgroundImage.src = e.target.result;
      }
  }
});
const dubbelNuggeImage = document.getElementById("dubbelnugge")

const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const width = parseInt(urlParams.get('width'))||10
const nuggeAmount =  parseInt(urlParams.get('nugges'))||3

const height = width

let velocity = [0, -1]

const blockWidth = canvas.width/width
const blockHeight = canvas.height/width

document.onkeyup = (key)=>{
const keys = [
  {codes: ["KeyW", "ArrowUp"],
   name: "up"},
   {codes: ["KeyD", "ArrowRight"],
   name: "right"},
   {codes: ["KeyS", "ArrowDown"],
   name: "down"},
   {codes: ["KeyA", "ArrowLeft"],
   name: "left"}
]
const aKey = keys.find(k=>k.codes.includes(key.code))?.name
const directions = {
  "right": [1,0],
  "up": [0, -1],
  "left": [-1, 0],
  "down": [0, 1]
}
const newVelocity = directions[aKey]

const previousDirection = Object.keys(directions).find(dir=>directions[dir].every((d, i)=>velocity[i]===d))

const currentDirection = Object.keys(directions).find(dir=>directions[dir].every((d, i)=>newVelocity[i]===d))

const blocks = [["right", "left"], ["up", "down"]]

if(blocks.some(block=>block.every(b=>[previousDirection, currentDirection].includes(b)))) return console.log("naee")

if(newVelocity) velocity = newVelocity

}

function drawBlock(x,y,color, rmX, rmY){
  ctx.save()
  ctx.fillStyle = color
  ctx.fillRect((blockWidth*x)+(rmX||0), (blockHeight*y)+(rmY||0), blockWidth-((rmX||0)*2),blockWidth-((rmY||0)*2))
  ctx.restore()
}


function clear(){
  ctx.fillStyle = "#14213d"
  ctx.fillRect(0,0, canvas.width, canvas.height)
  if(backgroundImage.src){
    ctx.drawImage(backgroundImage,0,0, canvas.width, canvas.height)
  }
  ctx.strokeStyle = "#0f4c5c"

  for(var x = 0; x < width; x++){
    ctx.moveTo(x*blockWidth, 0)
    ctx.lineTo(x*blockWidth, canvas.height)

  }
  for(var y = 0; y < width; y++){
    ctx.moveTo(0,y*blockHeight)
    ctx.lineTo(canvas.height, y*blockHeight)
  }
  ctx.stroke()

  
}
clear()
let snakeBody = [[5,5], [5,6], [5, 7], [5, 8], [5, 9,]]

var audio = new Audio('music.mp3');
audio.play();
audio.volume = 0.1;

let dubbelNugges = []
function addDubbelNugge(){
  const x = Math.floor(Math.random()*width)
  const y = Math.floor(Math.random()*height)
  dubbelNugges.push([x,y])
}


for(var i = 0; i < nuggeAmount; i++){
  addDubbelNugge()

}


update()

function update(){
  let head = snakeBody[0].map((n,i)=>velocity[i]?n+velocity[i]:n)

  snakeBody.unshift(head)
  snakeBody.pop()

  if(head[0]===-1 &&velocity[0]===-1){
    head[0] = width-1
  }else if(head[0]===width &&velocity[0]===1){
    head[0] = 0
  }else if(head[1]===-1 &&velocity[1]===-1){
    head[1] = height-1
  }else if(head[1]===height &&velocity[1]===1){
    head[1] = 0
  }



  function drawHead(x, y){
    const aX = blockWidth*x
    const aY = blockHeight*y
    ctx.drawImage(headImage, aX, aY, blockWidth, blockHeight)
  }
  clear()

  if(dubbelNugges.some(nugge=>nugge[0] === head[0] && nugge[1] === head[1])){
    const index = dubbelNugges.findIndex(nugge=>nugge[0] === head[0] && nugge[1] === head[1])

    dubbelNugges.splice(index, 1)
    addPoint()
    snakeBody.push(snakeBody[snakeBody.length-1])
    addDubbelNugge()
  }
  
  if(snakeBody.some(([x,y], index)=>index !== 0 && x == head[0] && y == head[1]) && !ended){
    alert("Naee, du dog....")
    ended = true
    snakeBody = [[5,5], [5,6], [5, 7], [5, 8], [5, 9,]]
    start()

  }


  
  clear()

  dubbelNugges.forEach(([x,y])=>{
    ctx.drawImage(dubbelNuggeImage, blockWidth*x, blockHeight*y, blockWidth, blockHeight)
  })


  snakeBody.forEach(([x,y], index)=>{
    if(index===0){
      drawHead(x,y)
    }else{
      drawBlock(x,y,"#52b788", 1,1)
    }
  })
  setTimeout(() => {
    if(ended) return;
    requestAnimationFrame(update)
  }, interval);


}



}
start()