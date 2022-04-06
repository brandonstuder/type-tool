// no animation by default (move load pixels to setup)
// only checkboxes in anim parameters (except frame rate)
// run smoother (move load pixels to setup / textbounds)
// resolution range (animation parameter)
// blur animation that cycles through blur amt
// multiple lines of text
// different blur animation (bloom/scatter...)
// video / image input
// export frames

let gridArr = [2,6,9,12,16,18]
let grid;
let input;
let font;
let colorMode = "black"
let animate = false;
let sizeSlider;
let strokeSlider;
let gridSlider;
let framerateSlider;
let blurSlider;
let pixelScatter = false;
let shapeSlider;
let freeze = false;
let initialWord;

function preload (){
  font = loadFont ('Akkurat-Mono.otf')
  initialWord = loadStrings('1000-or-so-words.txt');
}

function setup() {

  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER,CENTER);
  
  textFont(font);
  
  input = createInput(random(initialWord));
  input.position(20,20);

  sizeSlider = createSlider (50,500,100,.5);
  sizeSlider.position (20, input.y + 80);
  sizeSlider.style ('width', '130px');
  
  gridSlider = createSlider (2,18,6,1);
  gridSlider.position (20, sizeSlider.y + 40);
  gridSlider.style ('width', '130px');
 
  let invbutton = createButton("invert");
  invbutton.position (20, height - 40);
  invbutton.mousePressed(changeBG);

  let animbutton = createCheckbox("", false);
  animbutton.position (20, gridSlider.y + 80);
  animbutton.mousePressed(animation);

  blurSlider = createSlider (0,50,0,.125);
  blurSlider.position (20, animbutton.y + 40);
  blurSlider.style ('width', '130px');

  shapeSlider = createSlider(0,1,0,.1)
  shapeSlider.position (20, blurSlider.y + 40);
  shapeSlider.style ('width', '130px');

  framerateSlider = createSlider (.5,15,2,.5);
  framerateSlider.position (20, shapeSlider.y + 40);
  framerateSlider.style ('width', '130px');

  let freezebutton = createCheckbox("", false);
  freezebutton.position (20, framerateSlider.y + 40);
  freezebutton.mousePressed(freezeAnim);
  
}

function freezeAnim(){
  if (freeze === false){
    freeze = true;
  } else {
    freeze = false;
  }
}

function changeBG() {
  if (colorMode === "black") {
    colorMode = "white"
  } else {
    colorMode = "black"
  }
}

function animation(){
  if (animate === false){
  animate = true;
  } else {
    animate = false;
  }
} 

function draw() {

  let shapeThresh = shapeSlider.value()

  if (freeze === true){
    randomSeed(0);
    // animbutton.value = false;
  } 

  background(0);
  frameRate (framerateSlider.value())

  if (animate === false){
    grid = gridSlider.value();
  } else{
    grid = random(gridArr)
  }

  let typeSize = sizeSlider.value();

  // DRAW WORD
  textSize(typeSize);
  textAlign (CENTER,CENTER);
  fill (255);
  text(input.value(),width/2,height/2);

  // LOAD PIXELS OF WORD
  let points = [];
  loadPixels();
  for (let  y=0; y<height; y+=grid){
    for (let  x=0; x<width; x+=grid){
      let px = get(x,y);
      let sample = px[0];
      if (sample>125){
          points.push(createVector(x,y));
      }
    }
  }  
    
  // BG TO COVER TEXT
  if (colorMode === "black") {
    background(0)
  } else {
    background(255)
   }

  // SLIDER TEXT
  textAlign(LEFT,TOP)
  textSize(12)
  fill(150)
  text ('TEXT PARAMETERS', 20, input.y+50)
  text ('text size', 165, sizeSlider.y)
  text ('resolution (hi <--> lo)', 165, gridSlider.y)
  text ('ANIMATION PARAMETERS', 20, gridSlider.y+50)
  text ('animate resolution', 165, gridSlider.y+80)
  text ('blur', 165, blurSlider.y)
  text ('pixel shapes (square <--> circle)', 165, shapeSlider.y)
  text ('frame rate', 165, framerateSlider.y)
  text ('freeze', 165, framerateSlider.y + 40)

  // DRAW SHAPES
  let blurBloom = false
  let bloom = .1
  for(let i =0; i<points.length;i++){
    let x = points[i].x
    let y = points[i].y
    if (blurBloom === false){
    x += random(-blurSlider.value(), blurSlider.value());
    y += random(-blurSlider.value(), blurSlider.value());
    } 
    //   x += random(sin(-frameCount)*100,sin(frameCount)*100);
    //   y += random(sin(-frameCount)*100,sin(frameCount)*100);
    // }
     
    if (colorMode === "black") {
      fill(255);
    } else {
      fill(0);
    }
      
    noStroke()

    if (random() < shapeThresh){
      circle(x,y,grid);
    } else {
      rect(x,y,grid);
    }  
  }
}

