class ani
{
  constructor(time, par, func, a, b, c)
  {
  this.time = time;
  this.par = par;
  this.func = func;
  this.a = a;
  this.b = b;
  this.c = c;
  }
  run()
  {
    switch(this.par)
    {
     case 0:
       this.func();
       break;
     case 1:
       this.func(this.a);
       break;
     case 2:
       this.func(this.a,this.b);
       break;
     case 3:
       this.func(this.a,this.b,this.c);
       break;
    }
  }
}
