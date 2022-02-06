class pad
{ 
  constructor(x, y, w, h, scale)
  {
   this.x = x; 
   this.y = y;
   this.curr = '';
   this.scale = scale;
   //this.ox = 0;
   //this.oy = 0;
   this.width = w;
   this.height = h;
   this.b1 = new Button('1', x+scale*4, y+scale*3, 2*scale);
   this.b2 = new Button('2', x+scale*10, y+scale*3, 2*scale);
   this.b3 = new Button('3', x+scale*16, y+scale*3, 2*scale);
   this.b4 = new Button('4', x+scale*4, y+scale*9, 2*scale);
   this.b5 = new Button('5', x+scale*10, y+scale*9, 2*scale);
   this.b6 = new Button('6', x+scale*16, y+scale*9, 2*scale);
   this.b7 = new Button('7', x+scale*4, y+scale*15, 2*scale);
   this.b8 = new Button('8', x+scale*10, y+scale*15, 2*scale);
   this.b9 = new Button('9', x+scale*16, y+scale*15, 2*scale);
   this.b0 = new Button('0', x+scale*10, y+scale*21, 2*scale);
   this.bAdd = new Button('+', x+scale*4, y+scale*33, 2*scale);
   this.bSub = new Button('-', x+scale*4, y+scale*39, 2.3*scale);
   this.bMul = new Button('×', x+scale*10, y+scale*33, 2*scale);
   this.bDiv = new Button('/', x+scale*10, y+scale*39, 2.3*scale);
   this.bLoop = new Button('L', x+scale*16, y+scale*39, 2*scale); 
   this.bPow = new Button('^', x+scale*16, y+scale*33, 2*scale);
   this.bDel = new Button('Delete', x+scale*4, y+scale*27, 1.05*scale); 
   this.bDo = new Button('Enter', x+scale*16, y+scale*27, 1.2*scale);
   this.bPo = new Button('.', x+scale*16, y+scale*21, 2*scale); 
   
   //this.bIf
   //this.bGT
   //this.bLT
   //this.bEq
  }
  
  draw()
  {
     noStroke();
     fill(255,127);
     rect(this.x,this.y,this.width,this.height,this.scale);
     rect(this.x,this.y-this.scale*3,this.width,this.scale*2,this.scale);
     this.b1.draw();
     this.b2.draw();
     this.b3.draw();
     this.b4.draw();
     this.b5.draw();
     this.b6.draw();
     this.b7.draw();
     this.b8.draw();
     this.b9.draw();
     this.b0.draw();
     this.bAdd.draw();
     this.bSub.draw();
     this.bMul.draw();
     this.bDiv.draw();
     //this.bLoop.draw();
     this.bPow.draw();
     this.bDel.draw();
     this.bDo.draw(); 
     this.bPo.draw();
     text(this.curr, this.x + this.width/2, this.y - this.scale*2);
  }
  resize(w, h, scale)
  {
     this.width = w;
     this.height = h;
     this.b1.resize(scale*2);
     this.b2.resize(scale*2);
     this.b3.resize(scale*2);
     this.b4.resize(scale*2);
     this.b5.resize(scale*2);
     this.b6.resize(scale*2);
     this.b7.resize(scale*2);
     this.b8.resize(scale*2);
     this.b9.resize(scale*2);
     this.b0.resize(scale*2);
     this.bAdd.resize(scale*2);
     this.bSub.resize(scale*2.3);
     this.bMul.resize(scale*2);
     this.bDiv.resize(scale*2.3);
     this.bLoop.resize(scale*2);
     this.bPow.resize(scale*2);
     this.bDel.resize(scale*1.05);
     this.bDo.resize(scale*1.2);
     this.bPo.resize(scale*2);
     this.scale = scale;
  }
  move(x, y, scale)
  {
     this.x = x;
     this.y = y;
     this.b1.move(x+scale*4, y+scale*3);
     this.b2.move(x+scale*10, y+scale*3);
     this.b3.move(x+scale*16, y+scale*3);
     this.b4.move(x+scale*4, y+scale*9);
     this.b5.move(x+scale*10, y+scale*9);
     this.b6.move(x+scale*16, y+scale*9);
     this.b7.move(x+scale*4, y+scale*15);
     this.b8.move(x+scale*10, y+scale*15);
     this.b9.move(x+scale*16, y+scale*15);
     this.b0.move(x+scale*10, y+scale*21);
     this.bAdd.move(x+scale*4, y+scale*33);
     this.bSub.move(x+scale*4, y+scale*39);
     this.bMul.move(x+scale*10, y+scale*33);
     this.bDiv.move(x+scale*10, y+scale*39);
     this.bLoop.move(x+scale*16, y+scale*39); 
     this.bPow.move(x+scale*16, y+scale*33);
     this.bDel.move(x+scale*4, y+scale*27);
     this.bDo.move(x+scale*16, y+scale*27);
     this.bPo.move(x+scale*16, y+scale*21); 
    
  }
  over()
  {
    if(mouseX > this.x && mouseX < this.x+this.width && mouseY > this.y && mouseY < this.y+this.height)
      return true;
    return false;
  }
  
}
