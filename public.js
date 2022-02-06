var scaleX, scaleY, scaleO; //percentiles of screen
var timer;  //tack the length of each from in millis
let prevTime; 


let parti = []; //particles
let ats = []; //atractors
let anis = []; //animations
let opps = []; //opperators
let pusherVis = 0; //the visual on the mouse
let clickTime = 0; 
let renderCutoff = 142; //numbers larger than this value
let AniButton;

let maxLength = 5; // max length of input prevents huge numbers 


let thePad;//the input UI object
let movePad; //flag to move the pad;
let offX, offY; //offset pad movement

p5.disableFriendlyErrors = true; //increase performance


//first function for preloading resources
function preload() {

  //I don't know why I set framerate here normally it's in setup()
  frameRate(60);
}


function setup() {

  createCanvas(windowWidth, windowHeight);

  //set scaling factors
  scaleX = width/100.0;
  scaleY = height/100.0;
  scaleO = scaleX>scaleY ? scaleX : scaleY;

  
  thePad = new pad(width/2, 50, scaleO*20,scaleO*42,scaleO);
  ats.push(new attr(width*0.6,100+scaleO*42,16,0));
  AniButton = new Button('Animations',scaleX*5,scaleY*90,scaleO*1);


  prevTime = millis();
}

function draw() {
  //render
  p(); //first physics call

  /*
    update render every nth frame
    graphics are only drawn every second frame while the physics runs every frame
  */
  if(frameCount%2 == 0) 
  { 
    background(250,100,100);
    stroke(0);
    noStroke();
    colorMode(HSB,100,255,255,255);
    
    for(let i = 0; i < parti.length; i++)
    {
      if(ats[parti[i].follows].value < renderCutoff && ats[parti[i].follows].value > -renderCutoff)
      {
        parti[i].draw();
      }
    }
    strokeWeight(10);
    stroke(pusherVis%100,255,255,192);
    noFill();
    circle(mouseX,mouseY,pusherVis%100);
    AniButton.draw();
    pusherVis += 5;
    colorMode(RGB,255,255,255,255);
      ats[0].draw2();
    for(let i = 1; i < ats.length; i++)
    {
      if(ats[i].value < renderCutoff && ats[i].value > -renderCutoff)
      {
        ats[i].draw();
      }
      else
      {
        ats[i].draw3();
      }
    }
    for(let i = 0; i < opps.length; i++)
      opps[i].draw();
    thePad.draw();
    for(let i = 0; i < anis.length; i++)
    {
      if(anis[i].time < millis())
      {
        anis[i].run();
        anis.splice(i,1);
        i--;
      }
    }
    fill(0);
    circle(scaleO*2,scaleO*2,scaleO*4);
    
  }
  if(frameCount%5 == 0)
  {
    for(let i = 1; i < ats.length; i++)
    {
      if(dist(scaleO*2,scaleO*2,ats[i].x,ats[i].y)<scaleO*3)
      {
        removal(i);
        i--;
      }
    }
    for(let i = 0; i < opps.length; i++)
    {
      let cl = -1;
      let cr = -1;
      let pdl = 10000;
      let pdr = 10000;
      for(let ii = 1; ii < ats.length; ii++)
      {
         let dl = dist(opps[i].x-scaleO*6,opps[i].y,ats[ii].x,ats[ii].y);
         let dr = dist(opps[i].x+scaleO*6,opps[i].y,ats[ii].x,ats[ii].y);
         if(dl < scaleO*4 && dl < pdl && !ats[ii].held && ats[ii] != opps[i].out)
         {
            cl = ii;
            pdl = dl;
         }
         else if(dr < scaleO*4 && dr < pdr && !ats[ii].held && ats[ii] != opps[i].out)
         {
            cr = ii;
            pdr = dr;
         }
      }
      if(cl >= 0)
      {
        if(opps[i].left)
          opps[i].left.held = false;
        opps[i].left = ats[cl];
        ats[cl].held = true;
      }
      if(cr >= 0)
      {
        if(opps[i].right)
          opps[i].right.held = false;
        opps[i].right = ats[cr];
        ats[cr].held = true;
      }
      if(opps[i].left && dist(opps[i].x-scaleO*6,opps[i].y,opps[i].left.x,opps[i].left.y)>scaleO*10)
      {
        opps[i].left.held = false;
        opps[i].left = undefined;
      }
      if(opps[i].right && dist(opps[i].x+scaleO*6,opps[i].y,opps[i].right.x,opps[i].right.y)>scaleO*10)
      {
        opps[i].right.held = false;
        opps[i].right = undefined;
      }
    }
  }
  p(); //second physics call
  if (mouseIsPressed)
  {
    if(movePad == true)
    {
      thePad.move(mouseX-offX, mouseY-offY, scaleO);
      ats[0].move(thePad.x+scaleO*10,thePad.y+50+scaleO*42);
    }
    else
    {
    
      let curr = -1;
      let pd = 10000;
      let which = false;
      for(let i = 1; i < ats.length; i++)
      {
        let d =dist(mouseX,mouseY,ats[i].x,ats[i].y);
        if(d<ats[i].size*50 && d<pd)
        {
          curr = i;
          pd = d;
        }
      }
      for(let i = 0; i < opps.length; i++)
      {
        let d = dist(mouseX,mouseY,opps[i].x,opps[i].y);
        if(d < scaleO*4 && d<pd)
        {
          curr = i;
          pd = d;
          which = true;
        }
      }
      if(which)
      {
        opps[curr].move(mouseX,mouseY);
      }
      else if(curr >= 1)
      {
        ats[curr].move(mouseX,mouseY);
      }
    
    }
  }

}

//physics
function p() //called from the draw method
{
  timer = ((millis()-prevTime)/1000.0);
  prevTime = millis();
  for(let ii = 0; ii < ats.length; ii++)
  {
    let start = 0;
    ats[ii].move2(timer*10);
    if(ii > 0)
    {
      if(ats[ii].y+scaleO>height)
        ats[ii].force(0,-100*(ats[ii].y+scaleO-height));
      if(ats[ii].y-scaleO<0)
        ats[ii].force(0,-100*(ats[ii].y-scaleO));
      if(ats[ii].x+scaleO>width)
        ats[ii].force(-100*(ats[ii].x+(scaleO+1)-width),0);
      if(ats[ii].x-scaleO<0)
        ats[ii].force(-100*(ats[ii].x-scaleO),0);
    }
    if(ats[ii].value < renderCutoff && ats[ii].value > -renderCutoff)
    {
      for(let i = 0; i < parti.length; i++)
      {
        if(ats[ii].shape == 0)
        {
          if(parti[i].follows == ii)
          {
            let D = dist(parti[i].x,parti[i].y,ats[ii].x,ats[ii].y);
            if(D<scaleO*4)
              D = scaleO*4;
            let ang = atan2(parti[i].x-ats[ii].x,parti[i].y-ats[ii].y);
            let x = -10000*ats[ii].size*sin(ang)/(D*D) * parti[i].mass;
            let y = -10000*ats[ii].size*cos(ang)/(D*D) * parti[i].mass;
            parti[i].force(x,y,1);
            if(ii>0)
              ats[ii].force(-x,-y);
            
          }
        }
        else if(ats[ii].shape == 1)
        {
          if(parti[i].follows == ii)
          {
            if(ats[ii].value > 0)
            {
              let ang = atan2(parti[i].x-ats[ii].x,parti[i].y-ats[ii].y+start*scaleO*2);
              let x = -ats[ii].size*sin(ang) * parti[i].mass;
              let y = -ats[ii].size*cos(ang) * parti[i].mass;
              parti[i].force(x,y,0.98);
              ats[ii].loss(0.99);
            }
            else
            {
              let ang = atan2(parti[i].x-ats[ii].x,parti[i].y-ats[ii].y-start*scaleO*2);
              let x = -ats[ii].size*sin(ang) * parti[i].mass;
              let y = -ats[ii].size*cos(ang) * parti[i].mass;
              parti[i].force(x,y,0.98);
              ats[ii].loss(0.99);
            }
            start++;
          }
        }
        else if(ats[ii].shape == 2)
        {
          if(parti[i].follows == ii)
          {
            let where = (start/ats[ii].value)*TWO_PI;
            let r = (ats[ii].value/PI)*scaleO;
            let ang = atan2(parti[i].x-ats[ii].x+sin(where)*r,parti[i].y-ats[ii].y+cos(where)*r);
            let x = -ats[ii].size*sin(ang) * parti[i].mass;
            let y = -ats[ii].size*cos(ang) * parti[i].mass;
            parti[i].force(x,y,0.98);
            ats[ii].loss(0.99);
            start++; 
          }
        }
      }
    }
  }
  
  for(let i = 0; i < parti.length; i++)
  {
    if(ats[parti[i].follows].value < renderCutoff && ats[parti[i].follows].value > -renderCutoff)
    {
      parti[i].move(0.1);
      parti[i].loss(pow(0.9993,parti[i].getV()/parti[i].mass)); //fake air resistance
      //if(dist(mouseX,mouseY,parti[i].x,parti[i].y)<parti[i].r && !mouseIsPressed)
        //parti[i].force(random(-5000,5000)*timer,random(-5000,5000)*timer,1);
      //parti[i].force(0,50*timer*parti[i].mass,1);
      if(parti[i].y+parti[i].r>height)
        parti[i].force(0,timer*-100*(parti[i].y+parti[i].r-height),0.99);
      if(parti[i].y-parti[i].r<0)
        parti[i].force(0,timer*-100*(parti[i].y-parti[i].r),0.99);
      if(parti[i].x+parti[i].r>width)
        parti[i].force(timer*-100*(parti[i].x+(parti[i].r+1)-width),0,0.99);
      if(parti[i].x-parti[i].r<0)
        parti[i].force(timer*-100*(parti[i].x-parti[i].r),0,0.99);
      
      
      
      for(let ii = i+1; ii < parti.length; ii++)
      {
        let D = dist(parti[i].x,parti[i].y,parti[ii].x,parti[ii].y);
        let over = parti[i].r+parti[ii].r;
        if(D<=over)
        {
         let mag = abs(over - D)*2;
         let ang = atan2(parti[i].x-parti[ii].x,parti[i].y-parti[ii].y);
         let x = sin(ang)*mag;
         let y = cos(ang)*mag;
         
         parti[i].force(x,y,0.99);
         parti[ii].force(-x,-y,0.99);
       }    
      }
    }
  }
  for(let i = 0; i < opps.length; i++)
  {
    opps[i].pull();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); //space for ads
  scaleX = width/100.0;
  scaleY = height/100.0;
  scaleO = scaleX>scaleY ? scaleX : scaleY;
  thePad.resize(scaleO*20, scaleO*42, scaleO);
  thePad.move(width/2,50,scaleO);
  ats[0].move(thePad.x+scaleO*10,thePad.y+50+scaleO*42);
  for(let i = 0; i < parti.length; i++)
    parti[i].resize(scaleO);
  AniButton.resize(scaleO);
  AniButton.move(scaleX*5, scaleY*90);
}

/*
all code found in mousePressed needs to be dublicated touchStarted
*/
function mousePressed()
{
 clickTime = millis();
  if(thePad.over())
  {
    let curr = thePad.curr;
    if(thePad.b1.mouseOver())
    {
      if(curr == '+' || curr == '^' || curr == '/' || curr == '×' || curr == '⟳' || curr =='⌫' || curr == '☇')
      {
        thePad.curr = '1';
      }
      else if(curr.length < maxLength)
      {
        thePad.curr += '1';
      }
    }
    else if(thePad.b2.mouseOver())
    {
      if(curr == '+' || curr == '^' || curr == '/' || curr == '×' || curr == '⟳' || curr =='⌫' || curr == '☇')
      {
        thePad.curr = '2';
      }
      else if(curr.length < maxLength)
      {
        thePad.curr += '2';
      }
      
    }
    else if(thePad.b3.mouseOver())
    {
      if(curr == '+' || curr == '^' || curr == '/' || curr == '×' || curr == '⟳' || curr =='⌫' || curr == '☇')
      {
        thePad.curr = '3';
      }
      else if(curr.length < maxLength)
      {
        thePad.curr += '3';
      }
    }
    else if(thePad.b4.mouseOver())
    {
      if(curr == '+' || curr == '^' || curr == '/' || curr == '×' || curr == '⟳' || curr =='⌫' || curr == '☇')
      {
        thePad.curr = '4';
      }
      else if(curr.length < maxLength)
      {
        thePad.curr += '4';
      }
    }
    else if(thePad.b5.mouseOver())
    {
      if(curr == '+' || curr == '^' || curr == '/' || curr == '×' || curr == '⟳' || curr =='⌫' || curr == '☇')
      {
        thePad.curr = '5';
      }
      else if(curr.length < maxLength)
      {
        thePad.curr += '5';
      }
    }
    else if(thePad.b6.mouseOver())
    {
      if(curr == '+' || curr == '^' || curr == '/' || curr == '×' || curr == '⟳' || curr =='⌫' || curr == '☇')
      {
        thePad.curr = '6';
      }
      else if(curr.length < maxLength)
      {
        thePad.curr += '6';
      }
    }
    else if(thePad.b7.mouseOver())
    {
      if(curr == '+' || curr == '^' || curr == '/' || curr == '×' || curr == '⟳' || curr =='⌫' || curr == '☇')
      {
        thePad.curr = '7';
      }
      else if(curr.length < maxLength)
      {
        thePad.curr += '7';
      }
    }
    else if(thePad.b8.mouseOver())
    {
      if(curr == '+' || curr == '^' || curr == '/' || curr == '×' || curr == '⟳' || curr =='⌫' || curr == '☇')
      {
        thePad.curr = '8';
      }
      else if(curr.length < maxLength)
      {
        thePad.curr += '8';
      }
    }
    else if(thePad.b9.mouseOver())
    {
      if(curr == '+' || curr == '^' || curr == '/' || curr == '×' || curr == '⟳' || curr =='⌫' || curr == '☇')
      {
        thePad.curr = '9';
      }
      else if(curr.length < maxLength)
      {
        thePad.curr += '9';
      }
    }
    else if(thePad.b0.mouseOver())
    {
      if(curr == '+' || curr == '^' || curr == '/' || curr == '×' || curr == '⟳' || curr =='⌫' || curr == '☇')
      {
        thePad.curr = '0';
      }
      else if(curr.length < maxLength)
      {
        thePad.curr += '0';
      }
    }
    else if(thePad.bPo.mouseOver())
    {
      if(!thePad.bPo.s())
      {
        if(curr == '+' || curr == '^' || curr == '/' || curr == '×' || curr == '⟳' || curr =='⌫' || curr == '☇')
        {
          thePad.curr = '.';
        }
        else if(curr.length < maxLength)
        {
          thePad.curr += '.';
          thePad.bPo.togS();
        }
      }
    }
    else if(thePad.bAdd.mouseOver())
    {
        thePad.curr = '+';
        if(thePad.bPo.state)
          thePad.bPo.togS();
    }
    else if(thePad.bSub.mouseOver())
    {
        thePad.curr = '-';
        if(thePad.bPo.state)
          thePad.bPo.togS();
    }
    else if(thePad.bMul.mouseOver())
    {
      thePad.curr = '×';
      if(thePad.bPo.state)
        thePad.bPo.togS();
    }
    else if(thePad.bDiv.mouseOver())
    {
      thePad.curr = '/';
      if(thePad.bPo.state)
        thePad.bPo.togS();
    }
    else if(thePad.bLoop.mouseOver())
    {
      thePad.curr = '⟳';
      if(thePad.bPo.state)
        thePad.bPo.togS();
    }
    else if(thePad.bPow.mouseOver())
    {
      thePad.curr = '^';
      if(thePad.bPo.state)
        thePad.bPo.togS();
    }
    else if(thePad.bDel.mouseOver())
    {
      if(curr.length > 0)
      {
        if(curr.endsWith('.'))
          thePad.bPo.togS();
        thePad.curr = thePad.curr.slice(0,curr.length-1);
      }
    }
    else if(thePad.bDo.mouseOver() && !thePad.bDo.select)
    {
      if(curr == '+')
      {
        opps.push(new opp(width*0.2,100,"+"));
      }
      else if(curr == '-')
      {
        opps.push(new opp(width*0.2,100,"-"));
      }
      else if(curr == '×')
      {
        opps.push(new opp(width*0.2,100,"×"));
      }
      else if(curr == '/')
      {
        opps.push(new opp(width*0.2,100,"/"));
      }
      else if(curr == '^')
      {
        opps.push(new opp(width*0.2,100,"^"));
      }
      else
      {
        let num = parseFloat(thePad.curr);
        ats[0].value = num;
        ats.push(new attr(width*0.2,100+scaleO*42,4,num));
        if(num > 0 && num < renderCutoff)
        {
          while(num >= 1)
          {
            parti.push(new ball(1, 0, random(thePad.x,thePad.x+scaleO*20),random(thePad.y,thePad.y+scaleO*20),random(-2,2),random(0,2),1*scaleO,0.00004));
            num--;
          }
          if(num > 0)
            parti.push(new ball(num, 0, random(thePad.x,thePad.x+scaleO*20),random(thePad.y,thePad.y+scaleO*20),random(-2,2),random(0,2),1*scaleO,0.00004));
        }
        else if(num > -renderCutoff)
        {
          while(num <= -1)
          {
            parti.push(new ball(-1, 0, random(thePad.x,thePad.x+scaleO*20),random(thePad.y,thePad.y+scaleO*20),random(-2,2),random(0,2),1*scaleO,0.00004));
            num++;
          }
          if(num < 0)
            parti.push(new ball(num, 0, random(thePad.x,thePad.x+scaleO*20),random(thePad.y,thePad.y+scaleO*20),random(-2,2),random(0,2),1*scaleO,0.00004));
        }
        thePad.bPo.setS(false);
        thePad.bDo.setS(true);
        anis.push(new ani(millis()+2000,2,transfer,0,ats.length-1,0));
        anis.push(new ani(millis()+2000,0,enable,0,0,0));
  
        
      }
      thePad.curr = '';
    }
    else
    {
      movePad = true;
      offX = mouseX-thePad.x;
      offY = mouseY-thePad.y;
    }
  }
  
  return false;
}

/*
all code found in mousePressed needs to be dublicated touchStarted
*/
function touchStarted() {
 clickTime = millis();
  if(thePad.over())
  {
    let curr = thePad.curr;
    if(thePad.b1.mouseOver())
    {
      if(curr == '+' || curr == '^' || curr == '/' || curr == '×' || curr == '⟳' || curr =='⌫' || curr == '☇')
      {
        thePad.curr = '1';
      }
      else if(curr.length < maxLength)
      {
        thePad.curr += '1';
      }
    }
    else if(thePad.b2.mouseOver())
    {
      if(curr == '+' || curr == '^' || curr == '/' || curr == '×' || curr == '⟳' || curr =='⌫' || curr == '☇')
      {
        thePad.curr = '2';
      }
      else if(curr.length < maxLength)
      {
        thePad.curr += '2';
      }
      
    }
    else if(thePad.b3.mouseOver())
    {
      if(curr == '+' || curr == '^' || curr == '/' || curr == '×' || curr == '⟳' || curr =='⌫' || curr == '☇')
      {
        thePad.curr = '3';
      }
      else if(curr.length < maxLength)
      {
        thePad.curr += '3';
      }
    }
    else if(thePad.b4.mouseOver())
    {
      if(curr == '+' || curr == '^' || curr == '/' || curr == '×' || curr == '⟳' || curr =='⌫' || curr == '☇')
      {
        thePad.curr = '4';
      }
      else if(curr.length < maxLength)
      {
        thePad.curr += '4';
      }
    }
    else if(thePad.b5.mouseOver())
    {
      if(curr == '+' || curr == '^' || curr == '/' || curr == '×' || curr == '⟳' || curr =='⌫' || curr == '☇')
      {
        thePad.curr = '5';
      }
      else if(curr.length < maxLength)
      {
        thePad.curr += '5';
      }
    }
    else if(thePad.b6.mouseOver())
    {
      if(curr == '+' || curr == '^' || curr == '/' || curr == '×' || curr == '⟳' || curr =='⌫' || curr == '☇')
      {
        thePad.curr = '6';
      }
      else if(curr.length < maxLength)
      {
        thePad.curr += '6';
      }
    }
    else if(thePad.b7.mouseOver())
    {
      if(curr == '+' || curr == '^' || curr == '/' || curr == '×' || curr == '⟳' || curr =='⌫' || curr == '☇')
      {
        thePad.curr = '7';
      }
      else if(curr.length < maxLength)
      {
        thePad.curr += '7';
      }
    }
    else if(thePad.b8.mouseOver())
    {
      if(curr == '+' || curr == '^' || curr == '/' || curr == '×' || curr == '⟳' || curr =='⌫' || curr == '☇')
      {
        thePad.curr = '8';
      }
      else if(curr.length < maxLength)
      {
        thePad.curr += '8';
      }
    }
    else if(thePad.b9.mouseOver())
    {
      if(curr == '+' || curr == '^' || curr == '/' || curr == '×' || curr == '⟳' || curr =='⌫' || curr == '☇')
      {
        thePad.curr = '9';
      }
      else if(curr.length < maxLength)
      {
        thePad.curr += '9';
      }
    }
    else if(thePad.b0.mouseOver())
    {
      if(curr == '+' || curr == '^' || curr == '/' || curr == '×' || curr == '⟳' || curr =='⌫' || curr == '☇')
      {
        thePad.curr = '0';
      }
      else if(curr.length < maxLength)
      {
        thePad.curr += '0';
      }
    }
    else if(thePad.bPo.mouseOver())
    {
      if(!thePad.bPo.s())
      {
        if(curr == '+' || curr == '^' || curr == '/' || curr == '×' || curr == '⟳' || curr =='⌫' || curr == '☇')
        {
          thePad.curr = '.';
        }
        else if(curr.length < maxLength)
        {
          thePad.curr += '.';
          thePad.bPo.togS();
        }
      }
    }
    else if(thePad.bAdd.mouseOver())
    {
        thePad.curr = '+';
        if(thePad.bPo.state)
          thePad.bPo.togS();
    }
    else if(thePad.bSub.mouseOver())
    {
        thePad.curr = '-';
        if(thePad.bPo.state)
          thePad.bPo.togS();
    }
    else if(thePad.bMul.mouseOver())
    {
      thePad.curr = '×';
      if(thePad.bPo.state)
        thePad.bPo.togS();
    }
    else if(thePad.bDiv.mouseOver())
    {
      thePad.curr = '/';
      if(thePad.bPo.state)
        thePad.bPo.togS();
    }
    else if(thePad.bLoop.mouseOver())
    {
      thePad.curr = '⟳';
      if(thePad.bPo.state)
        thePad.bPo.togS();
    }
    else if(thePad.bPow.mouseOver())
    {
      thePad.curr = '^';
      if(thePad.bPo.state)
        thePad.bPo.togS();
    }
    else if(thePad.bDel.mouseOver())
    {
      if(curr.length > 0)
      {
        if(curr.endsWith('.'))
          thePad.bPo.togS();
        thePad.curr = thePad.curr.slice(0,curr.length-1);
      }
    }
    else if(thePad.bDo.mouseOver() && !thePad.bDo.select)
    {
      if(curr == '+')
      {
        opps.push(new opp(width*0.2,100,"+"));
      }
      else if(curr == '-')
      {
        opps.push(new opp(width*0.2,100,"-"));
      }
      else if(curr == '×')
      {
        opps.push(new opp(width*0.2,100,"×"));
      }
      else if(curr == '/')
      {
        opps.push(new opp(width*0.2,100,"/"));
      }
      else if(curr == '^')
      {
        opps.push(new opp(width*0.2,100,"^"));
      }
      else
      {
        let num = parseFloat(thePad.curr);
        ats[0].value = num;
        ats.push(new attr(width*0.2,100+scaleO*42,4,num));
        if(num > 0 && num < renderCutoff)
        {
          while(num >= 1)
          {
            parti.push(new ball(1, 0, random(thePad.x,thePad.x+scaleO*20),random(thePad.y,thePad.y+scaleO*20),random(-2,2),random(0,2),1*scaleO,0.00004));
            num--;
          }
          if(num > 0)
            parti.push(new ball(num, 0, random(thePad.x,thePad.x+scaleO*20),random(thePad.y,thePad.y+scaleO*20),random(-2,2),random(0,2),1*scaleO,0.00004));
        }
        else if(num > -renderCutoff)
        {
          while(num <= -1)
          {
            parti.push(new ball(-1, 0, random(thePad.x,thePad.x+scaleO*20),random(thePad.y,thePad.y+scaleO*20),random(-2,2),random(0,2),1*scaleO,0.00004));
            num++;
          }
          if(num < 0)
            parti.push(new ball(num, 0, random(thePad.x,thePad.x+scaleO*20),random(thePad.y,thePad.y+scaleO*20),random(-2,2),random(0,2),1*scaleO,0.00004));
        }
        thePad.bPo.setS(false);
        thePad.bDo.setS(true);
        anis.push(new ani(millis()+2000,2,transfer,0,ats.length-1,0));
        anis.push(new ani(millis()+2000,0,enable,0,0,0));
  
        
      }
      thePad.curr = '';
    }
    else
    {
      movePad = true;
      offX = mouseX-thePad.x;
      offY = mouseY-thePad.y;
    }
  }
  
  return false;
}

/*
all code found in mouseReleased needs to be dublicated touchEnded
*/
function mouseReleased() {
  movePad = false;
  if(millis()-clickTime<350)
  {
    let curr = -1;
    let pd = 10000;
    let which = false;
    for(let i = 1; i < ats.length; i++)
    {
      let d =dist(mouseX,mouseY,ats[i].x,ats[i].y);
      if(d<ats[i].size*50 && d<pd)
      {
        curr = i;
        pd = d;
      }
    }
    for(let i = 0; i < opps.length; i++)
    {
      let d = dist(mouseX,mouseY,opps[i].x,opps[i].y);
      if(d < scaleO*4 && d<pd)
      {
        curr = i;
        pd = d;
        which = true;
      }
    }
    if(which)
    {
      if(opps[curr].left && opps[curr].right)
      {
        transfer(ats.indexOf(opps[curr].left),ats.indexOf(opps[curr].out));
        transfer(ats.indexOf(opps[curr].right),ats.indexOf(opps[curr].out));
        removal(ats.indexOf(opps[curr].left));
        removal(ats.indexOf(opps[curr].right));
        comply(ats.indexOf(opps[curr].out));
      }
      else if(ats.includes(opps[curr].out))
        removal(ats.indexOf(opps[curr].out));
      opps.splice(curr,1);
    }
    else if(curr >= 1)
    {
      ats[curr].shape++;
      ats[curr].shape%=3;
    }
  } 
  // prevent default
  return false;
}

/*
all code found in mouseReleased needs to be dublicated touchEnded
*/
function touchEnded() {
  movePad = false;
  if(millis()-clickTime<350)
  {
    let curr = -1;
    let pd = 10000;
    let which = false;
    for(let i = 1; i < ats.length; i++)
    {
      let d =dist(mouseX,mouseY,ats[i].x,ats[i].y);
      if(d<ats[i].size*50 && d<pd)
      {
        curr = i;
        pd = d;
      }
    }
    for(let i = 0; i < opps.length; i++)
    {
      let d = dist(mouseX,mouseY,opps[i].x,opps[i].y);
      if(d < scaleO*4 && d<pd)
      {
        curr = i;
        pd = d;
        which = true;
      }
    }
    if(which)
    {
      if(opps[curr].left && opps[curr].right)
      {
        transfer(ats.indexOf(opps[curr].left),ats.indexOf(opps[curr].out));
        transfer(ats.indexOf(opps[curr].right),ats.indexOf(opps[curr].out));
        removal(ats.indexOf(opps[curr].left));
        removal(ats.indexOf(opps[curr].right));
        comply(ats.indexOf(opps[curr].out));
      }
      else if(ats.includes(opps[curr].out))
        removal(ats.indexOf(opps[curr].out));
      opps.splice(curr,1);
    }
    else if(curr >= 1)
    {
      ats[curr].shape++;
      ats[curr].shape%=3;
    }
  } 
  // prevent default
  return false;
}

//moves particles to different atractor
function transfer( from, to){
  for(let i = 0; i < parti.length; i++){
    if(parti[i].follows == from)
      parti[i].follows = to;
  }
  
}

function enable()
{
  thePad.bDo.setS(false);
}

function removal(ii)
{
  for(let i = parti.length-1; i > -1 ; i--)
  {      
    if(parti[i].follows == ii)
    {
      parti.splice(i,1);
    }
    else if(parti[i].follows > ii)
    {
      parti[i].follows--;
    }
  }
  ats.splice(ii,1);
}


function comply(ii)
{
  let count = 0;
  let remove = 0;
  let num;
  for(let i = parti.length-1; i > -1 ; i--)
  {      
    if(parti[i].follows == ii)
    {
      count++;
      if(parti[i].value < 1)
      {
        count--;
        parti.splice(i,1);
      }
      else if(count > abs(ats[ii].value))
      {
        parti.splice(i,1);
        count--;
      }
      else if(ats[ii].value <= 0 && parti[i].value > 0)
        parti[i].value *= -1;
      else if(ats[ii].value > 0 && parti[i].value < 0)
        parti[i].value *= -1;
      
    }
  }
  
  
  num = ats[ii].value;
  if(num > 0)
  {
    num -= count;
    while(num >= 1)
    {
      parti.push(new ball(1, ii, ats[ii].x+num*scaleO,ats[ii].y+num*scaleO,random(-2,2),random(0,2),1*scaleO,0.00004));
      num--;
    }
    if(num > 0)
      parti.push(new ball(ats[ii].value%1, ii, ats[ii].x+num*scaleO,ats[ii].y+num*scaleO,random(-2,2),random(0,2),1*scaleO,0.00004));
  }
  else
  {
    num += count;
    while(num <= -1)
    {
      parti.push(new ball(-1, ii, ats[ii].x+num*scaleO,ats[ii].y+num*scaleO,random(-2,2),random(0,2),1*scaleO,0.00004));
      num++;
    }
    if(num < 0)
      parti.push(new ball(ats[ii].value%1, ii, ats[ii].x+num*scaleO,ats[ii].y+num*scaleO,random(-2,2),random(0,2),1*scaleO,0.00004));
  }
  
}

function round2(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function distS(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    return dx * dx + dy * dy;
}
