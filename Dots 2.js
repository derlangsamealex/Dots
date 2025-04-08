let touched=false,touched2=false;
function SvgElement(str,obj) {
  let output=document.createElementNS("http://www.w3.org/2000/svg",str);
  for(prop in obj) {
    output.setAttribute(prop, obj[prop]);
  }
  return output;
}
function svgChgProp(target,obj) {
  for(prop in obj) {
    target.setAttribute(prop, obj[prop]);
  }
}    
function calcDirection(dx,dy) {
  if(dx==0&&dy==0) {
    return 0;
  }
  if(dx>=0&&dy>=0) {
    return Math.PI-Math.atan(Math.abs(dx/dy));
  }
  if(dx>=0&&dy<0) {
    return Math.atan(Math.abs(dx/dy));
  }
  if(dx<0&&dy<0) {
    return 2*Math.PI-Math.atan(Math.abs(dx/dy));
  }
  if(dx<0&&dy>=0) {
    return Math.PI+Math.atan(Math.abs(dx/dy));
  }
}    
Field=function() {
  this.dot=[];
  this.x=0;
  this.y=0; this.surface=document.createElement("div");
  this.surface.style.position="absolute";
  this.surface.style.left=0;
  this.surface.style.top=0; 
  this.surface.style.height="100%";
  this.surface.style.width="100%";
  this.surface.style.overflow="hidden";
  document.body.appendChild(this.surface);
  this.svg=new SvgElement("svg",{
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%" 
  })
  this.surface.appendChild(this.svg);
  for(let i=0;i<=500;i++) {
    this.dot.push(new Dot());
    this.svg.appendChild(this.dot[i].svg);
  }
  this.start=function() {
    this.t1=setInterval(this.running.bind(this),20);
  }
  this.running=function() {
    for(let obj of this.dot) {
      touched2?obj.direction=calcDirection(obj.x-this.x,this.y-obj.y):null;
      touched?obj.direction=calcDirection(this.x-obj.x,obj.y-this.y):null;
      obj.move();  
    }
  }
  let mousedown = false;
  let t1;
  let timeout = false;
  this.handleEvent=function() {
    switch(event.type) {
      case "touchstart":
        touched=true;      
        this.x=event.touches[0].clientX;
        this.y=event.touches[0].clientY;
        if(event.touches.length==2) {
          touched2=true;
          touched=false;
        } 
      break;
      case "touchmove":
        this.x=event.touches[0].clientX;
        this.y=event.touches[0].clientY;
      break;
      case "touchend":
      touched=false;
      touched2=false;
      break;
	  case "mousedown":
        touched = true;
		mousedown = true;
		if(timeout) {
			touched = false;
			touched2 = true;
		}
        this.x = event.clientX;
        this.y = event.clientY;
		t1 = setTimeout(() => timeout = false, 500);
		timeout = true;
	  break;
	  case "mousemove":
	    if(mousedown) {
		  this.x = event.clientX;
          this.y = event.clientY;
		}
	  break;
	  case "mouseup":
	    touched = false;
		touched2 = false;
	    mousedown = false;
	  break;
    }
  }
  this.svg.addEventListener("touchstart",this);
  this.svg.addEventListener("touchmove",this);
  this.svg.addEventListener("touchend",this);
  this.svg.addEventListener("mousedown",this);
  this.svg.addEventListener("mousemove",this);
  this.svg.addEventListener("mouseup",this);
}
Dot=function() {
  this.v=5;
   this.x=Math.ceil(Math.random()*innerWidth);
  this.y=Math.ceil(Math.random()*innerHeight);
  this.svg=new SvgElement("circle",{
    cx: this.x,
    cy: this.y,
    r: 5,
    fill: "rgba("+Math.ceil(Math.random()*255)+","+Math.ceil(Math.random()*255)+","+Math.ceil(Math.random()*255)+",255)"
  })  
  this.move=function() {
    touched||touched2?null:this.direction=Math.random()*Math.PI*2;  
    this.x+=Math.sin(this.direction)*this.v;
    this.y+=Math.cos(this.direction)*this.v;
    if(this.x>innerWidth) {
      this.x--;
    }
    if(this.x<0) {
      this.x++;
    }
    if(this.y>innerHeight) {
      this.y--;
    }
    if(this.y<0) {
      this.y++;
    }
    svgChgProp(this.svg,{
      cx: this.x,
      cy: this.y
    })
  }
}