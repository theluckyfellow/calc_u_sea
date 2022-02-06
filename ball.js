class ball
{
  constructor(v, f, x, y, vx, vy, r)
  {
   this.value = v;
   this.follows = f;
   this.x = x; 
   this.y = y;
   this.vx = vx;
   this.vy = vy;
   this.r = r;
   this.d = 2*this.r;
   //this.den = den;
   //this.mass = this.den*pow(this.r,3)*PI*(4.0/3.0);
   this.mass = (r*r)/110;
  }
  
 force(fx, fy, l)
  {
   this.vx += fx/this.mass;
   this.vy += fy/this.mass;
   if(l != 1)
   {
     this.loss(l);
   }
  }
  
  move(t)
  {
    
   this.x += this.vx*t;
   this.y += this.vy*t;
  }
  
  draw()
  {
   stroke(0);
   strokeWeight(2);
   if(this.value > 0)
   {
     fill((this.follows*8)%100,192,255);
     if(abs(this.value) == 1)  
       circle(this.x,this.y,this.d);
     else
       arc(this.x,this.y,this.d,this.d,0,this.value*TWO_PI);
   }
   else
   {
     fill((this.follows*8)%100,255,64);
     if(abs(this.value) == 1)  
       circle(this.x,this.y,this.d);
     else
       arc(this.x,this.y,this.d,this.d,this.value*TWO_PI,0);
   }
   
  }
  loss(f)
  {
    this.vx *= f;
    this.vy *= f;
  }
  
  getV()
  {
    return sqrt(this.vx*this.vx+this.vy*this.vy);
  }
  
  getV2()
  {
    return this.vx*this.vx+this.vy*this.vy;
  }
  
  getP()
  {
   return this.getV()*this.mass;
  }
  
  getKE()
  {
    return pow(this.getV(),2)*this.mass;
  }
  
  resize(r)
  {
    this.r = r;
    this.d = 2*this.r;
    this.mass = (r*r)/110;
  }
}
