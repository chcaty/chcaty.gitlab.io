// build time:Mon Mar 09 2020 22:01:12 GMT+0800 (香港标准时间)
(function(){"use strict";var t,i,e=Math.abs,s=Math.sin,h=Math.cos,n=Math.max,a=Math.min,o=Math.ceil,r=Math.sqrt,l=Math.pow,f={},u={},g={0:"0,",1:"17,",2:"34,",3:"51,",4:"68,",5:"85,",6:"102,",7:"119,",8:"136,",9:"153,",a:"170,",A:"170,",b:"187,",B:"187,",c:"204,",C:"204,",d:"221,",D:"221,",e:"238,",E:"238,",f:"255,",F:"255,"},c,d,m,p,w,x,v,T=document,y,S={};for(t=0;t<256;++t){i=t.toString(16);if(t<16)i="0"+i;u[i]=u[i.toUpperCase()]=t.toString()+","}function b(t){return typeof t!="undefined"}function C(t){return typeof t=="object"&&t!=null}function z(t,i,e){return isNaN(t)?e:a(e,n(i,t))}function D(){return false}function A(){return(new Date).valueOf()}function I(t,i){var e=[],s=t.length,h;for(h=0;h<s;++h)e.push(t[h]);e.sort(i);return e}function M(t){var i=t.length-1,e,s;while(i){s=~~(Math.random()*i);e=t[i];t[i]=t[s];t[s]=e;--i}}function F(t,i,e){this.x=t;this.y=i;this.z=e}w=F.prototype;w.length=function(){return r(this.x*this.x+this.y*this.y+this.z*this.z)};w.dot=function(t){return this.x*t.x+this.y*t.y+this.z*t.z};w.cross=function(t){var i=this.y*t.z-this.z*t.y,e=this.z*t.x-this.x*t.z,s=this.x*t.y-this.y*t.x;return new F(i,e,s)};w.angle=function(t){var i=this.dot(t),e;if(i==0)return Math.PI/2;e=i/(this.length()*t.length());if(e>=1)return 0;if(e<=-1)return Math.PI;return Math.acos(e)};w.unit=function(){var t=this.length();return new F(this.x/t,this.y/t,this.z/t)};function O(t,i){i=i*Math.PI/180;t=t*Math.PI/180;var e=s(t)*h(i),n=-s(i),a=-h(t)*h(i);return new F(e,n,a)}function k(t){this[1]={1:t[0],2:t[1],3:t[2]};this[2]={1:t[3],2:t[4],3:t[5]};this[3]={1:t[6],2:t[7],3:t[8]}}p=k.prototype;k.Identity=function(){return new k([1,0,0,0,1,0,0,0,1])};k.Rotation=function(t,i){var e=s(t),n=h(t),a=1-n;return new k([n+l(i.x,2)*a,i.x*i.y*a-i.z*e,i.x*i.z*a+i.y*e,i.y*i.x*a+i.z*e,n+l(i.y,2)*a,i.y*i.z*a-i.x*e,i.z*i.x*a-i.y*e,i.z*i.y*a+i.x*e,n+l(i.z,2)*a])};p.mul=function(t){var i=[],e,s,h=t.xform?1:0;for(e=1;e<=3;++e)for(s=1;s<=3;++s){if(h)i.push(this[e][1]*t[1][s]+this[e][2]*t[2][s]+this[e][3]*t[3][s]);else i.push(this[e][s]*t)}return new k(i)};p.xform=function(t){var i={},e=t.x,s=t.y,h=t.z;i.x=e*this[1][1]+s*this[2][1]+h*this[3][1];i.y=e*this[1][2]+s*this[2][2]+h*this[3][2];i.z=e*this[1][3]+s*this[2][3]+h*this[3][3];return i};function P(t,i,e,n,a){var o,l,f,u,g=[],c=2/t,d;d=Math.PI*(3-r(5)+(parseFloat(a)?parseFloat(a):0));for(o=0;o<t;++o){l=o*c-1+c/2;f=r(1-l*l);u=o*d;g.push([h(u)*f*i,l*e,s(u)*f*n])}return g}function E(t,i,e,n,a,o){var l,f=[],u=2/t,g,c,d,m,p;g=Math.PI*(3-r(5)+(parseFloat(o)?parseFloat(o):0));for(c=0;c<t;++c){d=c*u-1+u/2;l=c*g;m=h(l);p=s(l);f.push(i?[d*e,m*n,p*a]:[m*e,d*n,p*a])}return f}function B(t,i,e,n,a,o){var r,l=[],f=Math.PI*2/i,u,g,c;for(u=0;u<i;++u){r=u*f;g=h(r);c=s(r);l.push(t?[o*e,g*n,c*a]:[g*e,o*n,c*a])}return l}function R(t,i,e,s,h){return E(t,0,i,e,s,h)}function N(t,i,e,s,h){return E(t,1,i,e,s,h)}function _(t,i,e,s,h){h=isNaN(h)?0:h*1;return B(0,t,i,e,s,h)}function L(t,i,e,s,h){h=isNaN(h)?0:h*1;return B(1,t,i,e,s,h)}function H(t){var i=new Image;i.onload=function(){var e=i.width/2,s=i.height/2;t.centreFunc=function(t,h,n,a,o){t.setTransform(1,0,0,1,0,0);t.globalAlpha=1;t.drawImage(i,a-e,o-s)}};i.src=t.centreImage}function W(t,i){var e=t,s,h,n=(i*1).toPrecision(3)+")";if(t[0]==="#"){if(!f[t])if(t.length===4)f[t]="rgba("+g[t[1]]+g[t[2]]+g[t[3]];else f[t]="rgba("+u[t.substr(1,2)]+u[t.substr(3,2)]+u[t.substr(5,2)];e=f[t]+n}else if(t.substr(0,4)==="rgb("||t.substr(0,4)==="hsl("){e=t.replace("(","a(").replace(")",","+n)}else if(t.substr(0,5)==="rgba("||t.substr(0,5)==="hsla("){s=t.lastIndexOf(",")+1,h=t.indexOf(")");i*=parseFloat(t.substring(s,h));e=t.substr(0,s)+i.toPrecision(3)+")"}return e}function X(t,i){if(window.G_vmlCanvasManager)return null;var e=T.createElement("canvas");e.width=t;e.height=i;return e}function Y(){var t=X(3,3),i,e;if(!t)return false;i=t.getContext("2d");i.strokeStyle="#000";i.shadowColor="#fff";i.shadowBlur=3;i.globalAlpha=0;i.strokeRect(2,2,2,2);i.globalAlpha=1;e=i.getImageData(2,2,1,1);t=null;return e.data[0]>0}function U(t,i,e,s){var h=t.createLinearGradient(0,0,i,0),n;for(n in s)h.addColorStop(1-n,s[n]);t.fillStyle=h;t.fillRect(0,e,i,1)}function V(t,i,e){var s=1024,h=1,o=t.weightGradient,r,l,f,u;if(t.gCanvas){l=t.gCanvas.getContext("2d");h=t.gCanvas.height}else{if(C(o[0]))h=o.length;else o=[o];t.gCanvas=r=X(s,h);if(!r)return null;l=r.getContext("2d");for(f=0;f<h;++f)U(l,s,f,o[f])}e=n(a(e||0,h-1),0);u=l.getImageData(~~((s-1)*i),e,1,1).data;return"rgba("+u[0]+","+u[1]+","+u[2]+","+u[3]/255+")"}function q(t,i,s,h,n,a,o,r,l,f,u,g){var c=n+(r||0)+(l.length&&l[0]<0?e(l[0]):0),d=a+(r||0)+(l.length&&l[1]<0?e(l[1]):0),m,p;t.font=i;t.textBaseline="top";t.fillStyle=s;o&&(t.shadowColor=o);r&&(t.shadowBlur=r);l.length&&(t.shadowOffsetX=l[0],t.shadowOffsetY=l[1]);for(m=0;m<h.length;++m){p=0;if(u){if("right"==g){p=f-u[m]}else if("centre"==g){p=(f-u[m])/2}}t.fillText(h[m],c+p,d);d+=parseInt(i)}}function G(t,i,e,s,h,n,a){if(n){t.beginPath();t.moveTo(i,e+h-n);t.arcTo(i,e,i+n,e,n);t.arcTo(i+s,e,i+s,e+n,n);t.arcTo(i+s,e+h,i+s-n,e+h,n);t.arcTo(i,e+h,i,e+h-n,n);t.closePath();t[a?"stroke":"fill"]()}else{t[a?"strokeRect":"fillRect"](i,e,s,h)}}function Z(t,i,e,s,h,n,a,o,r){this.strings=t;this.font=i;this.width=e;this.height=s;this.maxWidth=h;this.stringWidths=n;this.align=a;this.valign=o;this.scale=r}v=Z.prototype;v.SetImage=function(t,i,e,s,h,n,a,o){this.image=t;this.iwidth=i*this.scale;this.iheight=e*this.scale;this.ipos=s;this.ipad=h*this.scale;this.iscale=o;this.ialign=n;this.ivalign=a};v.Align=function(t,i,e){var s=0;if(e=="right"||e=="bottom")s=i-t;else if(e!="left"&&e!="top")s=(i-t)/2;return s};v.Create=function(t,i,s,h,o,r,l,f,u){var g,c,d,m,p,w,x,v,T,y,S,b,C,z,D,A=e(l[0]),I=e(l[1]),M,F;f=n(f,A+r,I+r);p=2*(f+h);x=2*(f+h);c=this.width+p;d=this.height+x;T=y=f+h;if(this.image){S=b=f+h;C=this.iwidth;z=this.iheight;if(this.ipos=="top"||this.ipos=="bottom"){if(C<this.width)S+=this.Align(C,this.width,this.ialign);else T+=this.Align(this.width,C,this.align);if(this.ipos=="top")y+=z+this.ipad;else b+=this.height+this.ipad;c=n(c,C+p);d+=z+this.ipad}else{if(z<this.height)b+=this.Align(z,this.height,this.ivalign);else y+=this.Align(this.height,z,this.valign);if(this.ipos=="right")S+=this.width+this.ipad;else T+=C+this.ipad;c+=C+this.ipad;d=n(d,z+x)}}g=X(c,d);if(!g)return null;p=x=h/2;w=c-h;v=d-h;D=a(u,w/2,v/2);m=g.getContext("2d");if(i){m.fillStyle=i;G(m,p,x,w,v,D)}if(h){m.strokeStyle=s;m.lineWidth=h;G(m,p,x,w,v,D,true)}if(r||A||I){M=X(c,d);if(M){F=m;m=M.getContext("2d")}}q(m,this.font,t,this.strings,T,y,0,0,[],this.maxWidth,this.stringWidths,this.align);if(this.image)m.drawImage(this.image,S,b,C,z);if(F){m=F;o&&(m.shadowColor=o);r&&(m.shadowBlur=r);m.shadowOffsetX=l[0];m.shadowOffsetY=l[1];m.drawImage(M,0,0)}return g};function j(t,i,e){var s=X(i,e),h;if(!s)return null;h=s.getContext("2d");h.drawImage(t,(i-t.width)/2,(e-t.height)/2);return s}function J(t,i,e){var s=X(i,e),h;if(!s)return null;h=s.getContext("2d");h.drawImage(t,0,0,i,e);return s}function K(t,i,e,s,h,n,o,r,l,f){var u=i+(2*r+n)*s,g=e+(2*r+n)*s,c=X(u,g),d,m,p,w,x,v,T,y;if(!c)return null;n*=s;l*=s;m=p=n/2;w=u-n;x=g-n;r=r*s+m;d=c.getContext("2d");y=a(l,w/2,x/2);if(h){d.fillStyle=h;G(d,m,p,w,x,y)}if(n){d.strokeStyle=o;d.lineWidth=n;G(d,m,p,w,x,y,true)}if(f){v=X(u,g);T=v.getContext("2d");T.drawImage(t,r,r,i,e);T.globalCompositeOperation="source-in";T.fillStyle=o;T.fillRect(0,0,u,g);T.globalCompositeOperation="destination-over";T.drawImage(c,0,0);T.globalCompositeOperation="source-over";d.drawImage(v,0,0)}else{d.drawImage(t,r,r,t.width,t.height)}return{image:c,width:u/s,height:g/s}}function Q(t,i,e,s,h){var o,r,l=parseFloat(i),f=n(e,s);o=X(e,s);if(!o)return null;if(i.indexOf("%")>0)l=f*l/100;else l=l*h;r=o.getContext("2d");r.globalCompositeOperation="source-over";r.fillStyle="#fff";if(l>=f/2){l=a(e,s)/2;r.beginPath();r.moveTo(e/2,s/2);r.arc(e/2,s/2,l,0,2*Math.PI,false);r.fill();r.closePath()}else{l=a(e/2,s/2,l);G(r,0,0,e,s,l,true);r.fill()}r.globalCompositeOperation="source-in";r.drawImage(t,0,0,e,s);return o}function $(t,i,s,h,n,a,o){var r=e(o[0]),l=e(o[1]),f=i+(r>a?r+a:a*2)*h,u=s+(l>a?l+a:a*2)*h,g=h*((a||0)+(o[0]<0?r:0)),c=h*((a||0)+(o[1]<0?l:0)),d,m;d=X(f,u);if(!d)return null;m=d.getContext("2d");n&&(m.shadowColor=n);a&&(m.shadowBlur=a*h);o&&(m.shadowOffsetX=o[0]*h,m.shadowOffsetY=o[1]*h);m.drawImage(t,g,c,i,s);return{image:d,width:f/h,height:u/h}}function tt(t,i,e){var s=parseInt(t.toString().length*e),h=parseInt(e*2*t.length),n=X(s,h),a,o,r,l,f,u,g,c;if(!n)return null;a=n.getContext("2d");a.fillStyle="#000";a.fillRect(0,0,s,h);q(a,e+"px "+i,"#fff",t,0,0,0,0,[],"centre");o=a.getImageData(0,0,s,h);r=o.width;l=o.height;c={min:{x:r,y:l},max:{x:-1,y:-1}};for(u=0;u<l;++u){for(f=0;f<r;++f){g=(u*r+f)*4;if(o.data[g+1]>0){if(f<c.min.x)c.min.x=f;if(f>c.max.x)c.max.x=f;if(u<c.min.y)c.min.y=u;if(u>c.max.y)c.max.y=u}}}if(r!=s){c.min.x*=s/r;c.max.x*=s/r}if(l!=h){c.min.y*=s/l;c.max.y*=s/l}n=null;return c}function it(t){return"'"+t.replace(/(\'|\")/g,"").replace(/\s*,\s*/g,"', '")+"'"}function et(t,i,e){e=e||T;if(e.addEventListener)e.addEventListener(t,i,false);else e.attachEvent("on"+t,i)}function st(t,i,e){e=e||T;if(e.removeEventListener)e.removeEventListener(t,i);else e.detachEvent("on"+t,i)}function ht(t,i,e,s){var h=s.imageScale,n,a,o,r,l,f;if(!i.complete)return et("load",function(){ht(t,i,e,s)},i);if(!t.complete)return et("load",function(){ht(t,i,e,s)},t);i.width=i.width;i.height=i.height;if(h){t.width=i.width*h;t.height=i.height*h}e.iw=t.width;e.ih=t.height;if(s.txtOpt){a=t;n=s.zoomMax*s.txtScale;l=e.iw*n;f=e.ih*n;if(l<i.naturalWidth||f<i.naturalHeight){a=J(t,l,f);if(a)e.fimage=a}else{l=e.iw;f=e.ih;n=1}if(parseFloat(s.imageRadius))e.image=e.fimage=t=Q(e.image,s.imageRadius,l,f,n);if(!e.HasText()){if(s.shadow){a=$(e.image,l,f,n,s.shadow,s.shadowBlur,s.shadowOffset);if(a){e.fimage=a.image;e.w=a.width;e.h=a.height}}if(s.bgColour||s.bgOutlineThickness){o=s.bgColour=="tag"?nt(e.a,"background-color"):s.bgColour;r=s.bgOutline=="tag"?nt(e.a,"color"):s.bgOutline||s.textColour;l=e.fimage.width;f=e.fimage.height;if(s.outlineMethod=="colour"){a=K(e.fimage,l,f,n,o,s.bgOutlineThickness,e.outline.colour,s.padding,s.bgRadius,1);if(a)e.oimage=a.image}a=K(e.fimage,l,f,n,o,s.bgOutlineThickness,r,s.padding,s.bgRadius);if(a){e.fimage=a.image;e.w=a.width;e.h=a.height}}if(s.outlineMethod=="size"){if(s.outlineIncrease>0){e.iw+=2*s.outlineIncrease;e.ih+=2*s.outlineIncrease;l=n*e.iw;f=n*e.ih;a=J(e.fimage,l,f);e.oimage=a;e.fimage=j(e.fimage,e.oimage.width,e.oimage.height)}else{l=n*(e.iw+2*s.outlineIncrease);f=n*(e.ih+2*s.outlineIncrease);a=J(e.fimage,l,f);e.oimage=j(a,e.fimage.width,e.fimage.height)}}}}e.Init()}function nt(t,i){var e=T.defaultView,s=i.replace(/\-([a-z])/g,function(t){return t.charAt(1).toUpperCase()});return e&&e.getComputedStyle&&e.getComputedStyle(t,null).getPropertyValue(i)||t.currentStyle&&t.currentStyle[s]}function at(t,i,e){var s=1,h;if(i){s=1*(t.getAttribute(i)||e)}else if(h=nt(t,"font-size")){s=h.indexOf("px")>-1&&h.replace("px","")*1||h.indexOf("pt")>-1&&h.replace("pt","")*1.25||h*3.3}return s}function ot(t){return t.target&&b(t.target.id)?t.target.id:t.srcElement.parentNode.id}function rt(t,i){var e,s,h=parseInt(nt(i,"width"))/i.width,n=parseInt(nt(i,"height"))/i.height;if(b(t.offsetX)){e={x:t.offsetX,y:t.offsetY}}else{s=Tt(i.id);if(b(t.changedTouches))t=t.changedTouches[0];if(t.pageX)e={x:t.pageX-s.x,y:t.pageY-s.y}}if(e&&h&&n){e.x/=h;e.y/=n}return e}function lt(t){var i=t.target||t.fromElement.parentNode,e=zt.tc[i.id];if(e){e.mx=e.my=-1;e.UnFreeze();e.EndDrag()}}function ft(t){var i,e=zt,s,h,n=ot(t);for(i in e.tc){s=e.tc[i];if(s.tttimer){clearTimeout(s.tttimer);s.tttimer=null}}if(n&&e.tc[n]){s=e.tc[n];if(h=rt(t,s.canvas)){s.mx=h.x;s.my=h.y;s.Drag(t,h)}s.drawn=0}}function ut(t){var i=zt,e=T.addEventListener?0:1,s=ot(t);if(s&&t.button==e&&i.tc[s]){i.tc[s].BeginDrag(t)}}function gt(t){var i=zt,e=T.addEventListener?0:1,s=ot(t),h;if(s&&t.button==e&&i.tc[s]){h=i.tc[s];ft(t);if(!h.EndDrag()&&!h.touchState)h.Clicked(t)}}function ct(t){var i=ot(t),e=i&&zt.tc[i],s;if(e&&t.changedTouches){if(t.touches.length==1&&e.touchState==0){e.touchState=1;e.BeginDrag(t);if(s=rt(t,e.canvas)){e.mx=s.x;e.my=s.y;e.drawn=0}}else if(t.targetTouches.length==2&&e.pinchZoom){e.touchState=3;e.EndDrag();e.BeginPinch(t)}else{e.EndDrag();e.EndPinch();e.touchState=0}}}function dt(t){var i=ot(t),e=i&&zt.tc[i];if(e&&t.changedTouches){switch(e.touchState){case 1:e.Draw();e.Clicked();break;case 2:e.EndDrag();break;case 3:e.EndPinch()}e.touchState=0}}function mt(t){var i,e=zt,s,h,n=ot(t);for(i in e.tc){s=e.tc[i];if(s.tttimer){clearTimeout(s.tttimer);s.tttimer=null}}s=n&&e.tc[n];if(s&&t.changedTouches&&s.touchState){switch(s.touchState){case 1:case 2:if(h=rt(t,s.canvas)){s.mx=h.x;s.my=h.y;if(s.Drag(t,h))s.touchState=2}break;case 3:s.Pinch(t)}s.drawn=0}}function pt(t){var i=zt,e=ot(t);if(e&&i.tc[e]){t.cancelBubble=true;t.returnValue=false;t.preventDefault&&t.preventDefault();i.tc[e].Wheel((t.wheelDelta||t.detail)>0)}}function wt(t){var i,e=zt;clearTimeout(e.scrollTimer);for(i in e.tc){e.tc[i].Pause()}e.scrollTimer=setTimeout(function(){var t,i=zt;for(t in i.tc){i.tc[t].Resume()}},e.scrollPause)}function xt(){vt(A())}function vt(t){var i=zt.tc,e;zt.NextFrame(zt.interval);t=t||A();for(e in i)i[e].Draw(t)}function Tt(t){var i=T.getElementById(t),e=i.getBoundingClientRect(),s=T.documentElement,h=T.body,n=window,a=n.pageXOffset||s.scrollLeft,o=n.pageYOffset||s.scrollTop,r=s.clientLeft||h.clientLeft,l=s.clientTop||h.clientTop;return{x:e.left+a-r,y:e.top+o-l}}function yt(t,i,e,s){var h=t.radius*t.z1/(t.z1+t.z2+i.z);return{x:i.x*h*e,y:i.y*h*s,z:i.z,w:(t.z1-i.z)/t.z2}}function St(t){this.e=t;this.br=0;this.line=[];this.text=[];this.original=t.innerText||t.textContent}x=St.prototype;x.Empty=function(){for(var t=0;t<this.text.length;++t)if(this.text[t].length)return false;return true};x.Lines=function(t){var i=t?1:0,e,s,h;t=t||this.e;e=t.childNodes;s=e.length;for(h=0;h<s;++h){if(e[h].nodeName=="BR"){this.text.push(this.line.join(" "));this.br=1}else if(e[h].nodeType==3){if(this.br){this.line=[e[h].nodeValue];this.br=0}else{this.line.push(e[h].nodeValue)}}else{this.Lines(e[h])}}i||this.br||this.text.push(this.line.join(" "));return this.text};x.SplitWidth=function(t,i,e,s){var h,n,a,o=[];i.font=s+"px "+e;for(h=0;h<this.text.length;++h){a=this.text[h].split(/\s+/);this.line=[a[0]];for(n=1;n<a.length;++n){if(i.measureText(this.line.join(" ")+" "+a[n]).width>t){o.push(this.line.join(" "));this.line=[a[n]]}else{this.line.push(a[n])}}o.push(this.line.join(" "))}return this.text=o};function bt(t,i){this.ts=null;this.tc=t;this.tag=i;this.x=this.y=this.w=this.h=this.sc=1;this.z=0;this.pulse=1;this.pulsate=t.pulsateTo<1;this.colour=t.outlineColour;this.adash=~~t.outlineDash;this.agap=~~t.outlineDashSpace||this.adash;this.aspeed=t.outlineDashSpeed*1;if(this.colour=="tag")this.colour=nt(i.a,"color");else if(this.colour=="tagbg")this.colour=nt(i.a,"background-color");this.Draw=this.pulsate?this.DrawPulsate:this.DrawSimple;this.radius=t.outlineRadius|0;this.SetMethod(t.outlineMethod)}c=bt.prototype;c.SetMethod=function(t){var i={block:["PreDraw","DrawBlock"],colour:["PreDraw","DrawColour"],outline:["PostDraw","DrawOutline"],classic:["LastDraw","DrawOutline"],size:["PreDraw","DrawSize"],none:["LastDraw"]},e=i[t]||i.outline;if(t=="none"){this.Draw=function(){return 1}}else{this.drawFunc=this[e[1]]}this[e[0]]=this.Draw};c.Update=function(t,i,e,s,h,n,a,o){var r=this.tc.outlineOffset,l=2*r;this.x=h*t+a-r;this.y=h*i+o-r;this.w=h*e+l;this.h=h*s+l;this.sc=h;this.z=n};c.Ants=function(t){if(!this.adash)return;var i=this.adash,s=this.agap,h=this.aspeed,n=i+s,a=0,o=i,r=s,l=0,f=0,u;if(h){f=e(h)*(A()-this.ts)/50;if(h<0)f=864e4-f;h=~~f%n}if(h){if(i>=h){a=i-h;o=h}else{r=n-h;l=s-r}u=[a,r,o,l]}else{u=[i,s]}t.setLineDash(u)};c.DrawOutline=function(t,i,e,s,h,n){var o=a(this.radius,h/2,s/2);t.strokeStyle=n;this.Ants(t);G(t,i,e,s,h,o,true)};c.DrawSize=function(t,i,e,s,h,n,a,o,r){var l=a.w,f=a.h,u,g,c;if(this.pulsate){if(a.image)c=(a.image.height+this.tc.outlineIncrease)/a.image.height;else c=a.oscale;g=a.fimage||a.image;u=1+(c-1)*(1-this.pulse);a.h*=u;a.w*=u}else{g=a.oimage}a.alpha=1;a.Draw(t,o,r,g);a.h=f;a.w=l;return 1};c.DrawColour=function(t,i,e,s,h,n,a,o,r){if(a.oimage){if(this.pulse<1){a.alpha=1-l(this.pulse,2);a.Draw(t,o,r,a.fimage);a.alpha=this.pulse}else{a.alpha=1}a.Draw(t,o,r,a.oimage);return 1}return this[a.image?"DrawColourImage":"DrawColourText"](t,i,e,s,h,n,a,o,r)};c.DrawColourText=function(t,i,e,s,h,n,a,o,r){var l=a.colour;a.colour=n;a.alpha=1;a.Draw(t,o,r);a.colour=l;return 1};c.DrawColourImage=function(t,i,e,s,h,o,r,f,u){var g=t.canvas,c=~~n(i,0),d=~~n(e,0),m=a(g.width-c,s)+.5|0,p=a(g.height-d,h)+.5|0,w;if(y)y.width=m,y.height=p;else y=X(m,p);if(!y)return this.SetMethod("outline");w=y.getContext("2d");w.drawImage(g,c,d,m,p,0,0,m,p);t.clearRect(c,d,m,p);if(this.pulsate){r.alpha=1-l(this.pulse,2)}else{r.alpha=1}r.Draw(t,f,u);t.setTransform(1,0,0,1,0,0);t.save();t.beginPath();t.rect(c,d,m,p);t.clip();t.globalCompositeOperation="source-in";t.fillStyle=o;t.fillRect(c,d,m,p);t.restore();t.globalAlpha=1;t.globalCompositeOperation="destination-over";t.drawImage(y,0,0,m,p,c,d,m,p);t.globalCompositeOperation="source-over";return 1};c.DrawBlock=function(t,i,e,s,h,n){var o=a(this.radius,h/2,s/2);t.fillStyle=n;G(t,i,e,s,h,o)};c.DrawSimple=function(t,i,e,s,h,n){var a=this.tc;t.setTransform(1,0,0,1,0,0);t.strokeStyle=this.colour;t.lineWidth=a.outlineThickness;t.shadowBlur=t.shadowOffsetX=t.shadowOffsetY=0;t.globalAlpha=n?h:1;return this.drawFunc(t,this.x,this.y,this.w,this.h,this.colour,i,e,s)};c.DrawPulsate=function(t,i,e,s){var n=A()-this.ts,a=this.tc,o=a.pulsateTo+(1-a.pulsateTo)*(.5+h(2*Math.PI*n/(1e3*a.pulsateTime))/2);this.pulse=o=zt.Smooth(1,o);return this.DrawSimple(t,i,e,s,o,1)};c.Active=function(t,i,e){var s=i>=this.x&&e>=this.y&&i<=this.x+this.w&&e<=this.y+this.h;if(s){this.ts=this.ts||A()}else{this.ts=null}return s};c.PreDraw=c.PostDraw=c.LastDraw=D;function Ct(t,i,e,s,h,n,a,o,r,l,f,u,g,c){this.tc=t;this.image=null;this.text=i;this.text_original=c;this.line_widths=[];this.title=e.title||null;this.a=e;this.position=new F(s[0],s[1],s[2]);this.x=this.y=this.z=0;this.w=h;this.h=n;this.colour=a||t.textColour;this.bgColour=o||t.bgColour;this.bgRadius=r|0;this.bgOutline=l||this.colour;this.bgOutlineThickness=f|0;this.textFont=u||t.textFont;this.padding=g|0;this.sc=this.alpha=1;this.weighted=!t.weight;this.outline=new bt(t,this)}d=Ct.prototype;d.Init=function(t){var i=this.tc;this.textHeight=i.textHeight;if(this.HasText()){this.Measure(i.ctxt,i)}else{this.w=this.iw;this.h=this.ih}this.SetShadowColour=i.shadowAlpha?this.SetShadowColourAlpha:this.SetShadowColourFixed;this.SetDraw(i)};d.Draw=D;d.HasText=function(){return this.text&&this.text[0].length>0};d.EqualTo=function(t){var i=t.getElementsByTagName("img");if(this.a.href!=t.href)return 0;if(i.length)return this.image.src==i[0].src;return(t.innerText||t.textContent)==this.text_original};d.SetImage=function(t){this.image=this.fimage=t};d.SetDraw=function(t){this.Draw=this.fimage?t.ie>7?this.DrawImageIE:this.DrawImage:this.DrawText;t.noSelect&&(this.CheckActive=D)};d.MeasureText=function(t){var i,e=this.text.length,s=0,h;for(i=0;i<e;++i){this.line_widths[i]=h=t.measureText(this.text[i]).width;s=n(s,h)}return s};d.Measure=function(t,i){var e=tt(this.text,this.textFont,this.textHeight),s,h,n,a,o,r,l,f,u;l=e?e.max.y+e.min.y:this.textHeight;t.font=this.font=this.textHeight+"px "+this.textFont;r=this.MeasureText(t);if(i.txtOpt){s=i.txtScale;h=s*this.textHeight;n=h+"px "+this.textFont;a=[s*i.shadowOffset[0],s*i.shadowOffset[1]];t.font=n;o=this.MeasureText(t);u=new Z(this.text,n,o+s,s*l+s,o,this.line_widths,i.textAlign,i.textVAlign,s);if(this.image)u.SetImage(this.image,this.iw,this.ih,i.imagePosition,i.imagePadding,i.imageAlign,i.imageVAlign,i.imageScale);f=u.Create(this.colour,this.bgColour,this.bgOutline,s*this.bgOutlineThickness,i.shadow,s*i.shadowBlur,a,s*this.padding,s*this.bgRadius);if(i.outlineMethod=="colour"){this.oimage=u.Create(this.outline.colour,this.bgColour,this.outline.colour,s*this.bgOutlineThickness,i.shadow,s*i.shadowBlur,a,s*this.padding,s*this.bgRadius)}else if(i.outlineMethod=="size"){e=tt(this.text,this.textFont,this.textHeight+i.outlineIncrease);h=e.max.y+e.min.y;n=s*(this.textHeight+i.outlineIncrease)+"px "+this.textFont;t.font=n;o=this.MeasureText(t);u=new Z(this.text,n,o+s,s*h+s,o,this.line_widths,i.textAlign,i.textVAlign,s);if(this.image)u.SetImage(this.image,this.iw+i.outlineIncrease,this.ih+i.outlineIncrease,i.imagePosition,i.imagePadding,i.imageAlign,i.imageVAlign,i.imageScale);this.oimage=u.Create(this.colour,this.bgColour,this.bgOutline,s*this.bgOutlineThickness,i.shadow,s*i.shadowBlur,a,s*this.padding,s*this.bgRadius);this.oscale=this.oimage.width/f.width;if(i.outlineIncrease>0)f=j(f,this.oimage.width,this.oimage.height);else this.oimage=j(this.oimage,f.width,f.height)}if(f){this.fimage=f;r=this.fimage.width/s;l=this.fimage.height/s}this.SetDraw(i);i.txtOpt=!!this.fimage}this.h=l;this.w=r};d.SetFont=function(t,i,e,s){this.textFont=t;this.colour=i;this.bgColour=e;this.bgOutline=s;this.Measure(this.tc.ctxt,this.tc)};d.SetWeight=function(t){var i=this.tc,e=i.weightMode.split(/[, ]/),s,h,n=t.length;if(!this.HasText())return;this.weighted=true;for(h=0;h<n;++h){s=e[h]||"size";if("both"==s){this.Weight(t[h],i.ctxt,i,"size",i.min_weight[h],i.max_weight[h],h);this.Weight(t[h],i.ctxt,i,"colour",i.min_weight[h],i.max_weight[h],h)}else{this.Weight(t[h],i.ctxt,i,s,i.min_weight[h],i.max_weight[h],h)}}this.Measure(i.ctxt,i)};d.Weight=function(t,i,e,s,h,a,o){t=isNaN(t)?1:t;var r=(t-h)/(a-h);if("colour"==s)this.colour=V(e,r,o);else if("bgcolour"==s)this.bgColour=V(e,r,o);else if("bgoutline"==s)this.bgOutline=V(e,r,o);else if("outline"==s)this.outline.colour=V(e,r,o);else if("size"==s){if(e.weightSizeMin>0&&e.weightSizeMax>e.weightSizeMin){this.textHeight=e.weightSize*(e.weightSizeMin+(e.weightSizeMax-e.weightSizeMin)*r)}else{this.textHeight=n(1,t*e.weightSize)}}};d.SetShadowColourFixed=function(t,i,e){t.shadowColor=i};d.SetShadowColourAlpha=function(t,i,e){t.shadowColor=W(i,e)};d.DrawText=function(t,i,e){var s=this.tc,h=this.x,n=this.y,a=this.sc,o,r;t.globalAlpha=this.alpha;t.fillStyle=this.colour;s.shadow&&this.SetShadowColour(t,s.shadow,this.alpha);t.font=this.font;h+=i/a;n+=e/a-this.h/2;for(o=0;o<this.text.length;++o){r=h;if("right"==s.textAlign){r+=this.w/2-this.line_widths[o]}else if("centre"==s.textAlign){r-=this.line_widths[o]/2}else{r-=this.w/2}t.setTransform(a,0,0,a,a*r,a*n);t.fillText(this.text[o],0,0);n+=this.textHeight}};d.DrawImage=function(t,i,e,s){var h=this.x,n=this.y,a=this.sc,o=s||this.fimage,r=this.w,l=this.h,f=this.alpha,u=this.shadow;t.globalAlpha=f;u&&this.SetShadowColour(t,u,f);h+=i/a-r/2;n+=e/a-l/2;t.setTransform(a,0,0,a,a*h,a*n);t.drawImage(o,0,0,r,l)};d.DrawImageIE=function(t,i,e){var s=this.fimage,h=this.sc,n=s.width=this.w*h,a=s.height=this.h*h,o=this.x*h+i-n/2,r=this.y*h+e-a/2;t.setTransform(1,0,0,1,0,0);t.globalAlpha=this.alpha;t.drawImage(s,o,r)};d.Calc=function(t,i){var e,s=this.tc,h=s.minBrightness,n=s.maxBrightness,a=s.max_radius;e=t.xform(this.position);this.xformed=e;e=yt(s,e,s.stretchX,s.stretchY);this.x=e.x;this.y=e.y;this.z=e.z;this.sc=e.w;this.alpha=i*z(h+(n-h)*(a-this.z)/(2*a),0,1);return this.xformed};d.UpdateActive=function(t,i,e){var s=this.outline,h=this.w,n=this.h,a=this.x-h/2,o=this.y-n/2;s.Update(a,o,h,n,this.sc,this.z,i,e);return s};d.CheckActive=function(t,i,e){var s=this.tc,h=this.UpdateActive(t,i,e);return h.Active(t,s.mx,s.my)?h:null};d.Clicked=function(t){var i=this.a,e=i.target,s=i.href,h;if(e!=""&&e!="_self"){if(self.frames[e]){self.frames[e].document.location=s}else{try{if(top.frames[e]){top.frames[e].document.location=s;return}}catch(n){}window.open(s,e)}return}if(T.createEvent){h=T.createEvent("MouseEvents");h.initMouseEvent("click",1,1,window,0,0,0,0,0,0,0,0,0,0,null);if(!i.dispatchEvent(h))return}else if(i.fireEvent){if(!i.fireEvent("onclick"))return}T.location=s};function zt(t,i,e){var s,h,r=T.getElementById(t),l=["id","class","innerHTML"],f;if(!r)throw 0;if(b(window.G_vmlCanvasManager)){r=window.G_vmlCanvasManager.initElement(r);this.ie=parseFloat(navigator.appVersion.split("MSIE")[1])}if(r&&(!r.getContext||!r.getContext("2d").fillText)){h=T.createElement("DIV");for(s=0;s<l.length;++s)h[l[s]]=r[l[s]];r.parentNode.insertBefore(h,r);r.parentNode.removeChild(r);throw 0}for(s in zt.options)this[s]=e&&b(e[s])?e[s]:b(zt[s])?zt[s]:zt.options[s];this.canvas=r;this.ctxt=r.getContext("2d");this.z1=250/n(this.depth,.001);this.z2=this.z1/this.zoom;this.radius=a(r.height,r.width)*.0075;this.max_radius=100;this.max_weight=[];this.min_weight=[];this.textFont=this.textFont&&it(this.textFont);this.textHeight*=1;this.imageRadius=this.imageRadius.toString();this.pulsateTo=z(this.pulsateTo,0,1);this.minBrightness=z(this.minBrightness,0,1);this.maxBrightness=z(this.maxBrightness,this.minBrightness,1);this.ctxt.textBaseline="top";this.lx=(this.lock+"").indexOf("x")+1;this.ly=(this.lock+"").indexOf("y")+1;this.frozen=this.dx=this.dy=this.fixedAnim=this.touchState=0;this.fixedAlpha=1;this.source=i||t;this.repeatTags=a(64,~~this.repeatTags);this.minTags=a(200,~~this.minTags);if(~~this.scrollPause>0)zt.scrollPause=~~this.scrollPause;else this.scrollPause=0;if(this.minTags>0&&this.repeatTags<1&&(s=this.GetTags().length))this.repeatTags=o(this.minTags/s)-1;this.transform=k.Identity();this.startTime=this.time=A();this.mx=this.my=-1;this.centreImage&&H(this);this.Animate=this.dragControl?this.AnimateDrag:this.AnimatePosition;this.animTiming=typeof zt[this.animTiming]=="function"?zt[this.animTiming]:zt.Smooth;if(this.shadowBlur||this.shadowOffset[0]||this.shadowOffset[1]){this.ctxt.shadowColor=this.shadow;this.shadow=this.ctxt.shadowColor;this.shadowAlpha=Y()}else{delete this.shadow}this.Load();if(i&&this.hideTags){(function(t){if(zt.loaded)t.HideTags();else et("load",function(){t.HideTags()},window)})(this)}this.yaw=this.initial?this.initial[0]*this.maxSpeed:0;this.pitch=this.initial?this.initial[1]*this.maxSpeed:0;if(this.tooltip){this.ctitle=r.title;r.title="";if(this.tooltip=="native"){this.Tooltip=this.TooltipNative}else{this.Tooltip=this.TooltipDiv;if(!this.ttdiv){this.ttdiv=T.createElement("div");this.ttdiv.className=this.tooltipClass;this.ttdiv.style.position="absolute";this.ttdiv.style.zIndex=r.style.zIndex+1;et("mouseover",function(t){t.target.style.display="none"},this.ttdiv);T.body.appendChild(this.ttdiv)}}}else{this.Tooltip=this.TooltipNone}if(!this.noMouse&&!S[t]){S[t]=[["mousemove",ft],["mouseout",lt],["mouseup",gt],["touchstart",ct],["touchend",dt],["touchcancel",dt],["touchmove",mt]];if(this.dragControl){S[t].push(["mousedown",ut]);S[t].push(["selectstart",D])}if(this.wheelZoom){S[t].push(["mousewheel",pt]);S[t].push(["DOMMouseScroll",pt])}if(this.scrollPause){S[t].push(["scroll",wt,window])}for(s=0;s<S[t].length;++s){h=S[t][s];et(h[0],h[1],h[2]?h[2]:r)}}if(!zt.started){f=window.requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame;zt.NextFrame=f?zt.NextFrameRAF:zt.NextFrameTimeout;zt.interval=this.interval;zt.NextFrame(this.interval);zt.started=1}}m=zt.prototype;m.SourceElements=function(){if(T.querySelectorAll)return T.querySelectorAll("#"+this.source);return[T.getElementById(this.source)]};m.HideTags=function(){var t=this.SourceElements(),i;for(i=0;i<t.length;++i)t[i].style.display="none"};m.GetTags=function(){var t=this.SourceElements(),i,e=[],s,h,n;for(n=0;n<=this.repeatTags;++n){for(s=0;s<t.length;++s){i=t[s].getElementsByTagName("a");for(h=0;h<i.length;++h){e.push(i[h])}}}return e};m.Message=function(t){var i=[],e,n,a=t.split(""),o,r,l,f;for(e=0;e<a.length;++e){if(a[e]!=" "){n=e-a.length/2;o=T.createElement("A");o.href="#";o.innerText=a[e];l=100*s(n/9);f=-100*h(n/9);r=new Ct(this,a[e],o,[l,0,f],2,18,"#000","#fff",0,0,0,"monospace",2,a[e]);r.Init();i.push(r)}}return i};m.CreateTag=function(t){var i,e,s,h,n,a,o,r,l=[0,0,0];if("text"!=this.imageMode){i=t.getElementsByTagName("img");if(i.length){e=new Image;e.src=i[0].src;if(!this.imageMode){s=new Ct(this,"",t,l,0,0);s.SetImage(e);ht(e,i[0],s,this);return s}}}if("image"!=this.imageMode){n=new St(t);h=n.Lines();if(!n.Empty()){a=this.textFont||it(nt(t,"font-family"));if(this.splitWidth)h=n.SplitWidth(this.splitWidth,this.ctxt,a,this.textHeight);o=this.bgColour=="tag"?nt(t,"background-color"):this.bgColour;r=this.bgOutline=="tag"?nt(t,"color"):this.bgOutline}else{n=null}}if(n||e){s=new Ct(this,h,t,l,2,this.textHeight+2,this.textColour||nt(t,"color"),o,this.bgRadius,r,this.bgOutlineThickness,a,this.padding,n&&n.original);if(e){s.SetImage(e);ht(e,i[0],s,this)}else{s.Init()}return s}};m.UpdateTag=function(t,i){var e=this.textColour||nt(i,"color"),s=this.textFont||it(nt(i,"font-family")),h=this.bgColour=="tag"?nt(i,"background-color"):this.bgColour,n=this.bgOutline=="tag"?nt(i,"color"):this.bgOutline;t.a=i;t.title=i.title;if(t.colour!=e||t.textFont!=s||t.bgColour!=h||t.bgOutline!=n)t.SetFont(s,e,h,n)};m.Weight=function(t){var i=t.length,e,s,h,n=[],a,o=this.weightFrom?this.weightFrom.split(/[, ]/):[null],r=o.length;for(s=0;s<i;++s){n[s]=[];for(h=0;h<r;++h){e=at(t[s].a,o[h],this.textHeight);if(!this.max_weight[h]||e>this.max_weight[h])this.max_weight[h]=e;if(!this.min_weight[h]||e<this.min_weight[h])this.min_weight[h]=e;n[s][h]=e}}for(h=0;h<r;++h){if(this.max_weight[h]>this.min_weight[h])a=1}if(a){for(s=0;s<i;++s){t[s].SetWeight(n[s])}}};m.Load=function(){var t=this.GetTags(),i=[],e,s,h,a,o,r,l,f,u=[],g={sphere:P,vcylinder:R,hcylinder:N,vring:_,hring:L};if(t.length){u.length=t.length;for(f=0;f<t.length;++f)u[f]=f;this.shuffleTags&&M(u);a=100*this.radiusX;o=100*this.radiusY;r=100*this.radiusZ;this.max_radius=n(a,n(o,r));for(f=0;f<t.length;++f){s=this.CreateTag(t[u[f]]);if(s)i.push(s)}this.weight&&this.Weight(i,true);if(this.shapeArgs){this.shapeArgs[0]=i.length}else{h=this.shape.toString().split(/[(),]/);e=h.shift();if(typeof window[e]==="function")this.shape=window[e];else this.shape=g[e]||g.sphere;this.shapeArgs=[i.length,a,o,r].concat(h)}l=this.shape.apply(this,this.shapeArgs);this.listLength=i.length;for(f=0;f<i.length;++f)i[f].position=new F(l[f][0],l[f][1],l[f][2])}if(this.noTagsMessage&&!i.length){f=this.imageMode&&this.imageMode!="both"?this.imageMode+" ":"";i=this.Message("No "+f+"tags")}this.taglist=i};m.Update=function(){var t=this.GetTags(),i=[],e=this.taglist,s,h=[],n=[],a,r,l,f,u;if(!this.shapeArgs)return this.Load();if(t.length){l=this.listLength=t.length;r=e.length;for(f=0;f<r;++f){i.push(e[f]);n.push(f)}for(f=0;f<l;++f){for(u=0,s=0;u<r;++u){if(e[u].EqualTo(t[f])){this.UpdateTag(i[u],t[f]);s=n[u]=-1}}if(!s)h.push(f)}for(f=0,u=0;f<r;++f){if(n[u]==-1)n.splice(u,1);else++u}if(n.length){M(n);while(n.length&&h.length){f=n.shift();u=h.shift();i[f]=this.CreateTag(t[u])}n.sort(function(t,i){return t-i});while(n.length){i.splice(n.pop(),1)}}u=i.length/(h.length+1);f=0;while(h.length){i.splice(o(++f*u),0,this.CreateTag(t[h.shift()]))}this.shapeArgs[0]=l=i.length;a=this.shape.apply(this,this.shapeArgs);for(f=0;f<l;++f)i[f].position=new F(a[f][0],a[f][1],a[f][2]);this.weight&&this.Weight(i)}this.taglist=i};m.SetShadow=function(t){t.shadowBlur=this.shadowBlur;t.shadowOffsetX=this.shadowOffset[0];t.shadowOffsetY=this.shadowOffset[1]};m.Draw=function(t){if(this.paused)return;var i=this.canvas,e=i.width,s=i.height,h=0,n=(t-this.time)*zt.interval/1e3,a=e/2+this.offsetX,o=s/2+this.offsetY,r=this.ctxt,l,f,u,g=-1,c=this.taglist,d=c.length,m=this.frontSelect,p=this.centreFunc==D,w;this.time=t;if(this.frozen&&this.drawn)return this.Animate(e,s,n);w=this.AnimateFixed();r.setTransform(1,0,0,1,0,0);for(u=0;u<d;++u)c[u].Calc(this.transform,this.fixedAlpha);c=I(c,function(t,i){return i.z-t.z});if(w&&this.fixedAnim.active){l=this.fixedAnim.tag.UpdateActive(r,a,o)}else{this.active=null;for(u=0;u<d;++u){f=this.mx>=0&&this.my>=0&&this.taglist[u].CheckActive(r,a,o);if(f&&f.sc>h&&(!m||f.z<=0)){
l=f;g=u;l.tag=this.taglist[u];h=f.sc}}this.active=l}this.txtOpt||this.shadow&&this.SetShadow(r);r.clearRect(0,0,e,s);for(u=0;u<d;++u){if(!p&&c[u].z<=0){try{this.centreFunc(r,e,s,a,o)}catch(x){alert(x);this.centreFunc=D}p=true}if(!(l&&l.tag==c[u]&&l.PreDraw(r,c[u],a,o)))c[u].Draw(r,a,o);l&&l.tag==c[u]&&l.PostDraw(r)}if(this.freezeActive&&l){this.Freeze()}else{this.UnFreeze();this.drawn=d==this.listLength}if(this.fixedCallback){this.fixedCallback(this,this.fixedCallbackTag);this.fixedCallback=null}w||this.Animate(e,s,n);l&&l.LastDraw(r);i.style.cursor=l?this.activeCursor:"";this.Tooltip(l,this.taglist[g])};m.TooltipNone=function(){};m.TooltipNative=function(t,i){if(t)this.canvas.title=i&&i.title?i.title:"";else this.canvas.title=this.ctitle};m.SetTTDiv=function(t,i){var e=this,s=e.ttdiv.style;if(t!=e.ttdiv.innerHTML)s.display="none";e.ttdiv.innerHTML=t;i&&(i.title=e.ttdiv.innerHTML);if(s.display=="none"&&!e.tttimer){e.tttimer=setTimeout(function(){var t=Tt(e.canvas.id);s.display="block";s.left=t.x+e.mx+"px";s.top=t.y+e.my+24+"px";e.tttimer=null},e.tooltipDelay)}};m.TooltipDiv=function(t,i){if(t&&i&&i.title){this.SetTTDiv(i.title,i)}else if(!t&&this.mx!=-1&&this.my!=-1&&this.ctitle.length){this.SetTTDiv(this.ctitle)}else{this.ttdiv.style.display="none"}};m.Transform=function(t,i,e){if(i||e){var n=s(i),a=h(i),o=s(e),r=h(e),l=new k([r,0,o,0,1,0,-o,0,r]),f=new k([1,0,0,0,a,-n,0,n,a]);t.transform=t.transform.mul(l.mul(f))}};m.AnimateFixed=function(){var t,i,e,s,h;if(this.fadeIn){i=A()-this.startTime;if(i>=this.fadeIn){this.fadeIn=0;this.fixedAlpha=1}else{this.fixedAlpha=i/this.fadeIn}}if(this.fixedAnim){if(!this.fixedAnim.transform)this.fixedAnim.transform=this.transform;t=this.fixedAnim,i=A()-t.t0,e=t.angle,s,h=this.animTiming(t.t,i);this.transform=t.transform;if(i>=t.t){this.fixedCallbackTag=t.tag;this.fixedCallback=t.cb;this.fixedAnim=this.yaw=this.pitch=0}else{e*=h}s=k.Rotation(e,t.axis);this.transform=this.transform.mul(s);return this.fixedAnim!=0}return false};m.AnimatePosition=function(t,i,e){var s=this,h=s.mx,n=s.my,a,o;if(!s.frozen&&h>=0&&n>=0&&h<t&&n<i){a=s.maxSpeed,o=s.reverse?-1:1;s.lx||(s.yaw=(h*2*a/t-a)*o*e);s.ly||(s.pitch=(n*2*a/i-a)*-o*e);s.initial=null}else if(!s.initial){if(s.frozen&&!s.freezeDecel)s.yaw=s.pitch=0;else s.Decel(s)}this.Transform(s,s.pitch,s.yaw)};m.AnimateDrag=function(t,i,e){var s=this,h=100*e*s.maxSpeed/s.max_radius/s.zoom;if(s.dx||s.dy){s.lx||(s.yaw=s.dx*h/s.stretchX);s.ly||(s.pitch=s.dy*-h/s.stretchY);s.dx=s.dy=0;s.initial=null}else if(!s.initial){s.Decel(s)}this.Transform(s,s.pitch,s.yaw)};m.Freeze=function(){if(!this.frozen){this.preFreeze=[this.yaw,this.pitch];this.frozen=1;this.drawn=0}};m.UnFreeze=function(){if(this.frozen){this.yaw=this.preFreeze[0];this.pitch=this.preFreeze[1];this.frozen=0}};m.Decel=function(t){var i=t.minSpeed,s=e(t.yaw),h=e(t.pitch);if(!t.lx&&s>i)t.yaw=s>t.z0?t.yaw*t.decel:0;if(!t.ly&&h>i)t.pitch=h>t.z0?t.pitch*t.decel:0};m.Zoom=function(t){this.z2=this.z1*(1/t);this.drawn=0};m.Clicked=function(t){var i=this.active;try{if(i&&i.tag)if(this.clickToFront===false||this.clickToFront===null)i.tag.Clicked(t);else this.TagToFront(i.tag,this.clickToFront,function(){i.tag.Clicked(t)},true)}catch(e){}};m.Wheel=function(t){var i=this.zoom+this.zoomStep*(t?1:-1);this.zoom=a(this.zoomMax,n(this.zoomMin,i));this.Zoom(this.zoom)};m.BeginDrag=function(t){this.down=rt(t,this.canvas);t.cancelBubble=true;t.returnValue=false;t.preventDefault&&t.preventDefault()};m.Drag=function(t,i){if(this.dragControl&&this.down){var e=this.dragThreshold*this.dragThreshold,s=i.x-this.down.x,h=i.y-this.down.y;if(this.dragging||s*s+h*h>e){this.dx=s;this.dy=h;this.dragging=1;this.down=i}}return this.dragging};m.EndDrag=function(){var t=this.dragging;this.dragging=this.down=null;return t};function Dt(t){var i=t.targetTouches[0],e=t.targetTouches[1];return r(l(e.pageX-i.pageX,2)+l(e.pageY-i.pageY,2))}m.BeginPinch=function(t){this.pinched=[Dt(t),this.zoom];t.preventDefault&&t.preventDefault()};m.Pinch=function(t){var i,e,s=this.pinched;if(!s)return;e=Dt(t);i=s[1]*e/s[0];this.zoom=a(this.zoomMax,n(this.zoomMin,i));this.Zoom(this.zoom)};m.EndPinch=function(t){this.pinched=null};m.Pause=function(){this.paused=true};m.Resume=function(){this.paused=false};m.SetSpeed=function(t){this.initial=t;this.yaw=t[0]*this.maxSpeed;this.pitch=t[1]*this.maxSpeed};m.FindTag=function(t){if(!b(t))return null;b(t.index)&&(t=t.index);if(!C(t))return this.taglist[t];var i,e,s;if(b(t.id))i="id",e=t.id;else if(b(t.text))i="innerText",e=t.text;for(s=0;s<this.taglist.length;++s)if(this.taglist[s].a[i]==e)return this.taglist[s]};m.RotateTag=function(t,i,e,s,h,n){var a=t.Calc(this.transform,1),o=new F(a.x,a.y,a.z),r=O(e,i),l=o.angle(r),f=o.cross(r).unit();if(l==0){this.fixedCallbackTag=t;this.fixedCallback=h}else{this.fixedAnim={angle:-l,axis:f,t:s,t0:A(),cb:h,tag:t,active:n}}};m.TagToFront=function(t,i,e,s){this.RotateTag(t,0,0,i,e,s)};zt.Start=function(t,i,e){zt.Delete(t);zt.tc[t]=new zt(t,i,e)};function At(t,i){zt.tc[i]&&zt.tc[i][t]()}zt.Linear=function(t,i){return i/t};zt.Smooth=function(t,i){return.5-h(i*Math.PI/t)/2};zt.Pause=function(t){At("Pause",t)};zt.Resume=function(t){At("Resume",t)};zt.Reload=function(t){At("Load",t)};zt.Update=function(t){At("Update",t)};zt.SetSpeed=function(t,i){if(C(i)&&zt.tc[t]&&!isNaN(i[0])&&!isNaN(i[1])){zt.tc[t].SetSpeed(i);return true}return false};zt.TagToFront=function(t,i){if(!C(i))return false;i.lat=i.lng=0;return zt.RotateTag(t,i)};zt.RotateTag=function(t,i){if(C(i)&&zt.tc[t]){if(isNaN(i.time))i.time=500;var e=zt.tc[t].FindTag(i);if(e){zt.tc[t].RotateTag(e,i.lat,i.lng,i.time,i.callback,i.active);return true}}return false};zt.Delete=function(t){var i,e;if(S[t]){e=T.getElementById(t);if(e){for(i=0;i<S[t].length;++i)st(S[t][i][0],S[t][i][1],e)}}delete S[t];delete zt.tc[t]};zt.NextFrameRAF=function(){requestAnimationFrame(vt)};zt.NextFrameTimeout=function(t){setTimeout(xt,t)};zt.tc={};zt.options={z1:2e4,z2:2e4,z0:2e-4,freezeActive:false,freezeDecel:false,activeCursor:"pointer",pulsateTo:1,pulsateTime:3,reverse:false,depth:.5,maxSpeed:.05,minSpeed:0,decel:.95,interval:20,minBrightness:.1,maxBrightness:1,outlineColour:"#ffff99",outlineThickness:2,outlineOffset:5,outlineMethod:"outline",outlineRadius:0,textColour:"#ff99ff",textHeight:15,textFont:"Helvetica, Arial, sans-serif",shadow:"#000",shadowBlur:0,shadowOffset:[0,0],initial:null,hideTags:true,zoom:1,weight:false,weightMode:"size",weightFrom:null,weightSize:1,weightSizeMin:null,weightSizeMax:null,weightGradient:{0:"#f00",.33:"#ff0",.66:"#0f0",1:"#00f"},txtOpt:true,txtScale:2,frontSelect:false,wheelZoom:true,zoomMin:.3,zoomMax:3,zoomStep:.05,shape:"sphere",lock:null,tooltip:null,tooltipDelay:300,tooltipClass:"tctooltip",radiusX:1,radiusY:1,radiusZ:1,stretchX:1,stretchY:1,offsetX:0,offsetY:0,shuffleTags:false,noSelect:false,noMouse:false,imageScale:1,paused:false,dragControl:false,dragThreshold:4,centreFunc:D,splitWidth:0,animTiming:"Smooth",clickToFront:false,fadeIn:0,padding:0,bgColour:null,bgRadius:0,bgOutline:null,bgOutlineThickness:0,outlineIncrease:4,textAlign:"centre",textVAlign:"middle",imageMode:null,imagePosition:null,imagePadding:2,imageAlign:"centre",imageVAlign:"middle",noTagsMessage:true,centreImage:null,pinchZoom:false,repeatTags:0,minTags:0,imageRadius:0,scrollPause:false,outlineDash:0,outlineDashSpace:0,outlineDashSpeed:1};for(t in zt.options)zt[t]=zt.options[t];window.TagCanvas=zt;et("load",function(){zt.loaded=1},window)})();
//rebuild by neat 