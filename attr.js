class attr
{
  constructor(x, y, size, value)
  {
   this.x = x; 
   this.y = y;
   this.vx = 0;
   this.vy = 0;
   this.size = size;
   this.value = value;
   this.held = false;
   this.shape = 0;
  }
  
  force(fx, fy)
  {
   this.vx += fx/100;
   this.vy += fy/100;
  }
  loss(f)
  {
    this.vx *= f;
    this.vy *= f;
  }
  move2(t)
  {
   this.x += this.vx*t;
   this.y += this.vy*t;
  }
  
  draw()
  {
    fill(255);
    stroke(0);
    strokeWeight(3);
    text(this.value + '', this.x, this.y);
  }
  draw2()
  {
    fill(255);
    stroke(0);
    strokeWeight(3);
    text('{ }', this.x, this.y);
  }
  draw3()
  {
    stroke(255);
      strokeWeight(3);
    for(let start = 0; start < this.value; start++)
    {
      if(this.shape == 0)
      {
        let where = start/PI;
        let r = start/TWO_PI;
        let xx = this.x+sin(where)*r;
        let yy = this.y+cos(where)*r;
        point(xx,yy);
        this.loss(0.99);
      }
      else if(this.shape == 1)
      {
        if(this.value > 0)
        {
          point(this.x,this.y-start*3);
          this.loss(0.99);
        }
        else
        {
          point(this.x,this.y+start*3);
          this.loss(0.99);
        }
      }
      else if(this.shape == 2)
      {
          let where = (start/this.value)*TWO_PI;
          let r = (this.value/PI)*2;
          let xx = this.x+sin(where)*r*2;
          let yy = this.y+cos(where)*r*2;
          point(xx,yy);
          this.loss(0.99);
      }
    }
    fill(255);
    stroke(0);
    strokeWeight(3);
    text(this.value + '', this.x, this.y);
  }
  
  grow()
  {
   this.size += 0.01;
  }
  
  move(x,y)
  {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
  }
}
