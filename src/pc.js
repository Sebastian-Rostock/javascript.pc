/** pc - Prototype Class - [cc-by] 2007 Sebastian Rostock (bee-creative@gmx.de) **/
/** Dieses Werk ist unter einem Creative Commons Namensnennung 3.0 Deutschland Lizenzvertrag lizenziert. **/

function pc(){ // (): pcNS<pc>
	var id=0;
	var copy=function(Ns,Map){ // <GNs>(Ns: GNs; Map: Object{}): GNs
		if(Ns&&Map)for(var key in Map)Ns[key]=Map[key];
		return Ns;
	};
	var error=function(){ // (): Void
		throw new Error('UnsupportedMethodException');
	};
	var superNodeOf=function(Super,Supers){ // (Super: xpcCons; Supers: Object[]): xpcCons
		for(var i=Supers.length;--i;Super=superNodeOf(Super,Supers[i]));
		return ((Supers=Supers[0])?function(){ // (...: Object): xpcCore<?>
			this.Super=Super;
			Supers.apply(this,arguments);
			return this;
		}:function(){ // (...: Object): xpcCore<?>
			this.Super=Super;
			return this;
		});
	};
	var override=function(){// (...: String; Method: Function): xpcCore<xpcThis>
		var i=0,key,list=arguments,size=list.length,_this,superNode=this,method=list[--size];
		if(method)while((i<size)&&superNode)superNode=(_this=superNode)[key=list[i++]];
		if(!_this||(i!=size))return this;
		_this[key]=function(){ // (...: Object): Object
			var superBase=this.Super;
			try{
				this.Super=superNode;
				return method.apply(this,arguments);
			}finally{
				this.Super=superBase;
			}
		};
		superNode=superNode||error;
		return this;
	};
	pc=function(){ // (): pc
		return pc;
	};
	pc.Ns=function(Map){ // (Map: Object{}): pcNs
		var ns=function(){return ns;};
		return copy(ns,Map);
	};
	pc.Is=function(Type){ // (Type: pcType<?>; ...: pcType<?>): Boolean
		for(var i=1,map=Type.constructor.constructor;i<arguments.length;i++)if(!map[arguments[i].constructor.constructor.constructor])return false;
		return true;
	};
	pc.Of=function(Spec,Simple){// <GThis: pcThis<GType>; GType: pcType<GThis; GSpec>; GSpec: pcSpec<GThis; GType; ?; ?>>(Spec: GSpec; Simple: Boolean): GType
		if(Simple){
			var baseS={},thisS={},typeT=function(){ // (): Void
			},coreS={This:thisS,Type:typeT,Super:function(){ // (...: spcType<?>): spcCore<spcThis>
				for(var i=0,key,item,list=arguments;i<list.length;i++)
					if(!baseS[key=(item=list[i].constructor).constructor.constructor])
						(baseS[key]=item).call(coreS,thisS,typeT);
				return this;
			},Override:override},typeS=(baseS[((((typeT.prototype=thisS).constructor=typeT).constructor=Spec).constructor=baseS).constructor=String(++id)]=Spec).call(coreS,thisS,typeT)||function(){};
			((copy(typeS,typeT).prototype=thisS).constructor=typeS).constructor=Spec;
			return typeS;
		}else{
			var superNode=[],coreTemp={},coreThis,typeSpec=Spec,base={},coreType=function(This,Args){ // (This: xpcCore<xpcThis>; Args: Object[]): xpcThis
				(this.This=This).Invoke=function(Key,Args){ // (Key: String; Args: Object[]): Object
					return coreTemp[Key].apply(This,Args);
				};
				superNode.apply(This=this,Args);
			},typeType=function(){ // (...: Object): xpcThis
				return new coreType(this,arguments).This;
			};
			((coreThis=coreType.prototype).This=typeType.prototype).Invoke=function(Key,Args){ // (Key: String; Args: Object[]): Object
				return coreTemp[Key].apply(coreThis,Args);
			};
			(((coreThis.Type=typeType).constructor=typeSpec).constructor=base).constructor=String(++id);
			coreThis.Super=function(){ // (...: xpcType<?>): xpcCore<xpcThis>
				for(var i=0,key,item,list=arguments,node;i<list.length;i++){
					(node=superNode).push(superNode=[null]);
					if(!base[key=(item=list[i]).constructor.constructor.constructor])
						superNode[0]=(base[key]=item).constructor.call(this,this.This,this.Type);
					superNode=node;
				}
				return this;
			};
			coreThis.Publish=function(Key,Method){ // (Key: String; Method: Function): xpcCore<?>
				coreTemp[Key]=Method||function(){ // (...: Object): Object
					return this[Key].apply(this,arguments);
				};
				this.This[Key]=function(){ // (...: Object): Object
					return this.Invoke(Key,arguments);
				};
				return this;
			};
			coreThis.Override=override;
			coreThis.Super(typeType);
			superNode=superNodeOf(error,superNode[0]);
			return typeType;
		}
	};
	pc.NewToString=function(Type,Values,Format){ // (Type: String; Values: Object[]; Format: Boolean): String
		var i=0,size=Values.length,list=[];
		while(i<size)list.push(String(Values[i++]));
		return 'new '+Type+((Format&&size)?'(\n  '+list.join(',\n').replace(/\n/g,'\n  ')+'\n)':'('+list.join(',')+')');
	};
	pc.MapToString=function(Map){ // (Map: Object{}): String
		if(!Map)return 'null';
		var list=[];
		for(var key in Map)list.push(pc.TextToString(key)+':'+pc.TextToString(String(Map[key])));
		return (list.length?'{\n  '+list.join(',\n  ')+'\n}':'{}');
	};
	pc.ListToString=function(List){ // (List: Object[]): String
		return (List?(List.length?'[\n  '+List.join(',\n').replace(/\n/g,'\n  ')+'\n]':'[]'):'null');
	};
	pc.TextToString=function(Text){ // (String: String): String
		return (Text?'\''+Text.replace(/(['"\\])/g,'\\$1').replace(/\t/g,'\\t').replace(/\r/g,'\\r').replace(/\n/g,'\\n')+'\'':((Text=='')?'\'\'':'null'));
	};
	return pc;
}
