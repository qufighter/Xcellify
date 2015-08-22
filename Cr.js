// Cr.elm [create element] by Sam Larison -- Sam @ Vidsbee.com -- Cr.js
// https://github.com/qufighter/Cr
var Cr = {
/*******************************************************************************
 Usage A: 
         Cr.elm('div',{'id':'hello','event':['click',function(){alert('hi');}]},[
           Cr.txt('text inside block element'),
           Cr.elm('hr',{'style':'clear:both;'})
         ],document.body);
         
 Usage B: 
         var myelm = Cr.elm('div',{'id':'hello','event':['click',function(){alert('hi');}]},[
           Cr.txt('text inside block element'),
           Cr.elm('hr',{'style':'clear:both;'})
         ]);
         
         document.body.appendChild(myelm);
            O R
         Cr.insertNode(myelm, document.body);
         
 Creates:
         <div id="hello">
           text inside block element
           <hr style="clear:both;">
         </div>
         
         Where clicking the text or hr displays 'hi'
         
 Pattern:
         Cr.elm('div',{'attribute':'one'},[Cr.txt('children')],document.body);
         
         <body><div attribute="one">children</div></body>
         
   Conclusions: you may nest Cr.elm calls in exactly the same way 
                as you would nest HTML elements.
 Parameters: 
   nodeType
          node type such as 'img' 'div' or 'a'
   attributes an object {} that contains attributes.  Once special attribute 
          'events' may be used to specify events as follows:
          {'href':'#','events':[['mouseover',callfn,false],['mouseout',callfn2]]}
          the format for events is [eventType,callback,useCapture], you may also 
          specify a single event.
          
   addchilds an array [] containing nodes to be appended as children, could contain
          an array of calls to Cr.elm which create this array of nodes.
   appnedTo should ONLY be specified on the last element that needs to be created
          which means the TOP level element (or the final parameter on the first 
          or outter most call to cr.elm).
 Empty Patteren:
          Cr.elm('div',{},[],document.body);
*******************************************************************************/
	elm : function(nodeType,attributes,addchilds,appnedTo){
		var ne=document.createElement(nodeType),i,l;
		if(attributes){
			if( attributes.event || attributes.events ){
				var lev=attributes.event || attributes.events;
				if(typeof(lev[0])=='string') ne.addEventListener(lev[0],lev[1],lev[2]);
				else if(lev.length)
					for(i=0,l=lev.length;i<l;i++)
						ne.addEventListener(lev[i][0],lev[i][1],lev[i][2]);
			}
		}
		for( i in attributes ){
			if( i.substring(0,5) == 'event' ){
				//handled earlier
			}else if( i == 'checked' || i == 'selected'){
				if(attributes[i])ne.setAttribute(i,i);
			}else ne.setAttribute(i,attributes[i]);
		}
		if(addchilds){
			for( i=0,l=addchilds.length;i<l;i++ ){
				if(addchilds[i])ne.appendChild(addchilds[i]);//you probably forgot a comma when calling the function
			}
		}
		if(appnedTo){
			this.insertNode(ne, appnedTo);
		}
	
		return ne;//identifier unexpected error pointing here means you're missing a comma on the row before inside an array of nodes addchilds
	},
	/*Cr.txt creates text nodes, does not support HTML entiteis */
	txt : function(textContent){
		return document.createTextNode(textContent);
	},
	/*Cr.ent creates text nodes that may or may not contain HTML entities.  From a
	single entity to many entities interspersed with text are all supported by this */
	ent : function(textContent){
		return document.createTextNode(this.unescapeHtml(textContent));
	},
	/*Cr.paragraphs creates an array of nodes that may or may not contain HTML entities.*/
	paragraphs : function(textContent){
		var textPieces=textContent.split("\n");
		var elmArray=[];
		for(var i=0,l=textPieces.length;i<l;i++){
			elmArray.push(Cr.elm('p',{},[Cr.ent(textPieces[i])]));
		}
		return elmArray;
	},
	insertNode : function(newNode, parentElem, optionalInsertBefore){
		if(!parentElem)parentElem=document.body;
		if(optionalInsertBefore && optionalInsertBefore.parentNode == parentElem){
			parentElem.insertBefore(newNode,optionalInsertBefore);
		}else{
			parentElem.appendChild(newNode);
		}
	},
	insertNodes : function(newNodes, parentElem, optionalInsertBefore){
		if(typeof(newNodes)!='array')
			this.insertNode(newNodes, parentElem, optionalInsertBefore);
		else{
			for(var i=0,l=newNodes.length;i<l;i++){
				this.insertNode(newNodes[i], parentElem, optionalInsertBefore, true);
			}
		}
	},
	empty : function(node){
		while(node.lastChild)node.removeChild(node.lastChild);
	},
	unescapeHtml : function(str) { //trick used to make HTMLentiites work inside textNodes
		if(str.length < 1)return str;
		var temp = document.createElement("div");
		str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
		temp.innerHTML = str;
		var result = temp.childNodes[0].nodeValue;
		this.empty(temp);
		return result;
	}
}

if( typeof(window) != 'undefined' ) window.Cr=Cr;
