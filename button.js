function Button( pText, pX, pY, size)
{
  this.select = false;
  this.state;
  this.text = pText;
  this.textSize = size;
  textSize(size)
  this.butW = textWidth(pText)+(size*2);
  this.X = pX;
  this.Y = pY;
  
  this.resize = function(size)
  {
    this.textSize = size;
    textSize(size);
    this.butW = textWidth(this.text)+(size*2); 
  }
  
  this.move = function(pX, pY)
  {
    this.X = pX;
    this.Y = pY;
  }
  
  this.draw = function()
  {
     noStroke();
     if(this.select)
     {
       fill(40,255,0,127);
     }
     else if(this.mouseOver())
     {
       fill(255,255,127,127);
     }
     else
     {
       fill(255,200,255,192);
     }
     textAlign(CENTER,CENTER);
     ellipseMode(CENTER);
     ellipse(this.X,this.Y,this.butW,this.butW);
     fill(0);
     textSize(this.textSize);
     text(this.text,this.X,this.Y);
     
  }
  
  this.mouseOver = function()
  {
    return dist(this.X,this.Y,mouseX,mouseY)<this.butW/2;
  } 
  
  this.setS = function(pS)
  {
    this.select = pS;
  }
  this.togS = function()
  {
    this.select = !this.select;
  }
  this.s = function()
  {
     return this.select; 
  }
}
