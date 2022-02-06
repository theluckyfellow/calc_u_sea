class opp
{
  constructor(x, y, value)
  {
   this.x = x; 
   this.y = y;
   this.vx = 0;
   this.vy = 0;
   this.value = value;
   this.left;
   this.right;
   this.out  = new attr(this.x,this.y+scaleO*6,4,0);
   ats.push(this.out);
  }
  
  force(fx, fy)
  {
   this.vx += fx/40000;
   this.vy += fy/40000;
  }
  
  move2(t)
  {
   this.x += this.vx*t;
   this.y += this.vy*t;
  }
  
  draw()
  {
    
    fill(255);
    
    strokeWeight(scaleO);
    stroke(92,92,255,127);
    if(this.left)
      line(this.x,this.y,this.left.x,this.left.y);
    stroke(92,255,92,127);
    if(this.right)
      line(this.x,this.y,this.right.x,this.right.y);
    stroke(92,255,255,127);
    line(this.x,this.y,this.out.x,this.out.y);
    stroke(0);
    textSize(scaleO*4);
    text(this.value + '', this.x, this.y);
    fill(255,127);
    noStroke();
    circle(this.x-scaleO*6,this.y,scaleO*4);
    circle(this.x+scaleO*6,this.y,scaleO*4);
    if(this.left&&this.right)
    {
      if(this.value=="+")
        this.out.value = round2(this.left.value + this.right.value, 3);
      if(this.value=="-")
        this.out.value = round2(this.left.value - this.right.value, 3);
      if(this.value=="×")
        this.out.value = round2(this.left.value * this.right.value, 3);
      if(this.value=="/")
      {
        if(this.right.value != 0)
          this.out.value = round2(this.left.value / this.right.value, 3);
        else
          this.out.value = undefined;
      }
      if(this.value=="^")
      {
        if(this.left.value == 0 && this.right.value <= 0)
          this.out.value = undefined;          
        else
          this.out.value = round2(pow(this.left.value, this.right.value), 3);
      }
    }
    else
      this.out.value = 0;
  }
  

  
  move(x,y)
  {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
  }
  
  pull()
  {
    if(this.left)
    {

      let ang = atan2(this.left.x-(this.x-scaleO*6),this.left.y-this.y);
      let fx = -100*sin(ang);
      let fy = -100*cos(ang);
      this.left.force(fx,fy);
      this.left.loss(0.99);
    }
    if(this.right)
    {

      let ang = atan2(this.right.x-(this.x+scaleO*6),this.right.y-this.y);
      let fx = -100*sin(ang);
      let fy = -100*cos(ang);
      this.right.force(fx,fy);
      this.right.loss(0.99);
    }
    let ang = atan2(this.out.x-this.x,this.out.y-this.y-scaleO*6);
    let fx = -100*sin(ang);
    let fy = -100*cos(ang);
    this.out.force(fx,fy);
    this.out.loss(0.99);
    
      
  }
}
