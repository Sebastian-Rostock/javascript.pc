# pc - prototype class

	[cc-by] 2007 Sebastian Rostock (bee-creative@gmx.de)

---

### DEUTSCH

Der Name `pc` steht für `Prototype-Class` (Prototypenklasse) und bezeichnet den Kern einer objektorientierten Mehrfachvererbungsbibliothek für `JavaScript`. Diese Bibliothek bietet eine bequeme Schnittstelle zur Definition neuer Klassen. Bemerkenswert sind die Fähigkeiten, Klassen und Objekte mit privaten, geschützten und öffentlichen Feldern und Methoden zu definieren.

Die beiden wichtigsten Methoden sind `pc.Ns()` zum Erstellen neuer Namensräume und `pc.Of()` zur Definition neuer Klassen. Bei der Klassendefinition werden zwei Modi unterschieden: <table><tr><th>

`xpc (eXtensible-Prototype-Class)`

</th><td>

Klassen, die in diesem Modus definiert werden, können geschützte und öffentliche Mitglieder besitzen, frei über die Vererbungsreihenfolge entscheiden und Methoden der Vorfahrenklassen überscheiben.

</td></tr><tr><th>

`spc (Simple-Prototype-Class)`

</th><td>

Klassen, die in diesem Modus definiert werden, können nur öffentliche Mitglieder besitzen.

</td></tr></table> 

Um die Funktionsweise der Bibliothek besser verstehen zu können sollen an dieser Stelle einige Grundlagen zu `JavaScript` erläutert werden. Alle Felder und Methoden, die man einem Objekt oder dem `prototype` Attribut einer Klassenfunktion zuweist, sind öffentlich, d.h. auf solche Mitglieder kann von überall zugegriffen werden. Alle lokalen Variablen einer Funktion, zu denen auch die Funktionsargumente zählen, sind privat, d.h. auf solche Mitglieder kann nur innerhalb der Funktion zugegriffen werden.

Geschützte Mitglieder sollen sich wie private nach außen und wie öffentliche nach innen verhalten, d.h. sie sollen nicht von außen, aber von innen in jeder Klassendefinitionsfunktion und jeder Konstrukteurfunktion zugreifbar sein. Dieses Verhalten wird durch Objekte erreicht, die den Funktionen eines Vererbungsbaumes übergeben werden.

*Die nun folgenden Beispiele sollen die Verwendung dieser Bibliothek illustrieren:*

###### Definition eines leeren Namensraums:

Hier wird die Funktion `myNameSpace()` definiert, die sich selbst durch einen neuen Namensraum ersetzt und diesen zurückgibt. Nachdem die Funktion `myNameSpace()` mit dem Namensraum ersetzt worden ist, kann dieser um beliebige Felder und Methoden erweitert werden.

	function myNameSpace(){
		myNameSpace = pc.Ns();
		...
		return myNameSpace;
	}
	
###### Definition eines Namensraums mit Feldern:

Hier wird der Namensraum `CONST()` mit seinen Feldern `PI` und `E` definiert.

	function CONST(){
		return CONST = pc.Ns({ PI: 3.141592654, E: 2.718281828 });
	}
	
###### Definition eines Namensraums mit Feldern und Methoden:

Hier wird der Namensraum `node()` zur `HTML`-Knotenerzeugung definiert. Er enthält das private Feld `functionNames`, die öffentlichen Felder `ID`, `TAG` und `TEXT` sowie die öffentliche Methode `create()`.

	function node(){
		var functionNames = [ 'getElementById', 'createElement', 'createTextNode' ];
		return node = pc.Ns({
			ID: 0, TAG: 1, TEXT: 2
			create: function(Mode, Value){
				return ((Mode = functionNames[Mode]) ? document[Mode](Value) : null);
			}
		});
	}
	
###### Definition einer leeren Klasse:

Hier werden die leeren Klassen `voidXpcClass` und `voidSpcClass` ohne Mitglieder definiert.

	var voidXpcClass = pc.Of(function(This, Type){
		return function(){
		};
	},false);
	
	var voidSpcClass = pc.Of(function(This, Type){
		return function(){
		};
	},true);
	
###### Definition einer Klasse mit Feldern und Methoden verschiedener Sichtbarkeit:

Hier definiert die `xpc`-Klasse `nameXpcClass` das private statische Feld `instanceCount`, das geschützte Feld `name`, die geschützten Methoden `getName()` und `setName()`, die öffentliche statische Methode `getInstanceCount()`, sowie die öffentlichen Methoden `getId()`, `getName()`, `setName()` und `toString()`. Das Konstrukteurargument `Id` wird als privates Feld von der Methode `getId()` genutzt und das Konstrukteurargument `Name` initialisiert das geschützte Feld `name`.

	var nameXpcClass = pc.Of(function(This, Type){
		var instanceCount = 0;
		this.name = null
		this.getName = function(){
			return this.name;
		};
		this.setName = function(Name){
			this.name = Name;
			return this.This;
		};
		this.Publish('getName').Publish('setName');
		This.toString = function(){
			return 'nameXpcClass(' + this.getId() + ', ' + this.getName() + ')';
		};
		Type.getInstanceCount = function(){
			return instanceCount;
		};
		return function(Id, Name){
			instanceCount++;
			this.This.getId = function(){
				return Id;
			};
			this.name = Name;
		};
	},false);

In der `spc`-Klasse `nameSpcClass` werden die gleichen öffentlichen und statischen Mitglieder definiert. Das Feld `name` ist nun aber auch öffentlich.

	var nameSpcClass = pc.Of(function(This, Type){
		var instanceCount = 0;
		This.getName = function(){
			return this.name;
		};
		This.setName = function(Name){
			this.name = Name;
			return this;
		};
		This.toString = function(){
			return 'nameSpcClass(' + this.getId() + ', ' + this.getName() + ')';
		};
		Type.getInstanceCount = function(){
			return instanceCount;
		};
		return function(Id, Name){
			instanceCount++;
			this.getId = function(){
				return Id;
			};
			this.name = Name;
		};
	},true);

######	Definition einer erbenden Klasse:

Hier erbt die `xpc`-Klasse `personXpcClass` von der `xpc`-Klasse `nameXpcClass` und ruft in ihrer Konstrukteurfunktion die Konstrukteurfunktion der Vorfahrenklasse auf. Des Weiteren definiert sie das geschützte Feld `age`, sowie die öffentlichen Methoden `getAge()`, `setAge()` und `toString()`.|

	var personXpcClass = pc.Of(function(This, Type){
		this.Super(nameXpcClass);
		this.Publish('getAge', function(){
			return this.age;
		});
		this.Publish('setAge', function(Age){
			this.age = Age;
			return this.This;
		});
		This.toString = function(){
			return 'personXpcClass(' + this.getId() + ', ' + this.getAge() + ', ' + this.getName() + ')';
		};
		return function(Id, Age, Name){
			this.Super(Id, Name).age = Age;
		};
	},false);

Die `spc`-Klasse `personSpcClass` definiert die gleichen Mitglieder und erbt von der `spc`-Klasse `nameSpcClass`.

	var personSpcClass = pc.Of(function(This, Type){
		this.Super(nameSpcClass);
		This.getAge = function(){
			return this.age;
		};
		This.setAge = function(Age){
			this.age = Age;
			return this;
		};
		This.toString = function(){
			return 'personSpcClass(' + this.getId() + ', ' + this.getAge() + ', ' + this.getName() + ')';
		};
		return function(Id, Age, Name){
			nameSpcClass.call(this, Id, Name);
			this.age = Age;
		};
	},true);

######	Definition einer Klasse mit Methodenüberschreibung:

Hier überschreibt die `xpc`-Klasse `nameModifyXpcClass` die geerbte Methode `setName()` mit einer Funktion, die bei bevor stehender Veränderung des geschützten Feldes `name` ein `alert` Fenster anzeigt und anschließend die vorherige Implementierung dieser Methode aufruft, wodurch der Wert des Feldes schließlich geändert wird.
	
	var nameModifyXpcClass = pc.Of(function(This, Type){
		this.Super(nameXpcClass).Override('setName', function(Name){
			if(Name != this.name)alert(this.This + '.name has been modified!');
			return this.Super(Name);
		});
		return function(Id, Name){
			this.Super(Id, Name);
		};
	},false);

Die `spc`-Klasse `nameModifySpcClass` überschreibt die gleiche Methode und erbt von der `spc`-Klasse `nameSpcClass`.
	
	var nameModifySpcClass = pc.Of(function(This, Type){
		this.Super(nameSpcClass).Override('This','setName', function(Name){
			if(Name != this.name)alert(this + '.name has been modified!');
			return this.Super(Name);
		});
		return function(Id, Name){
			nameSpcClass.call(this, Id, Name);
		};
	},true);

---

### ENGLISH

The name `pc` stands for `Prototype-Class` and identifies the core of an object-oriented-multiple-inheritance-library for `JavaScript`. This library provides a comfortable interface for defining new classes. Noteworthy are the abilities to define classes and objects with private, protected and public fields and methods.

The two main methods are `pc.Ns()` to create new name-spaces and `pc.Of()` to define new classes. In the class-definition, two modes are distinguished: <table><tr><th>

`xpc (eXtensible-Prototype-Class)`

</th><td>

Classes that are defined in this mode, can have protected and public members, can freely decide the inheritance order and can override methods of the ancestor-classes.

</td></tr><tr><th>

`spc (Simple-Prototype-Class)`

</th><td>

Classes that are defined in this mode, can only have public members.

</td></tr></table>
To be able to understand the functionality of the library, some basics to `JavaScript` should be explained at this point. All fields and methods which one assigns to an object or the `prototype`-attribute of a class-function are public, i.e. such members can be accessed from everywhere. All local variables of a function to which also the function arguments count are private, i.e. such members can be accessed only within the function.

Protected members should behave like private to the outside and like public to the inside, i.e. they should not be accessible from outside, but from inside every class-definition-function and every constructor-function. This behaviour is realized by objects that are passed to the functions of an inheritance tree.

The now following examples should illustrate the usage of this library:

######	Definition of an empty name-space:

Here the function `myNameSpace()` is defined, that replaces itself with a new name-space and returns it. After the function `myNameSpace()` has been replaced with the name-space, it can arbitrarily be extended by fields and methods.

	function myNameSpace(){
		myNameSpace = pc.Ns();
		...
		return myNameSpace;
	}

######	Definition of a name-space with fields:

Here the name-space `CONST()` with its fields `PI` and `E` is defined.

	function CONST(){
		return CONST = pc.Ns({ PI: 3.141592654, E: 2.718281828 });
	}

######	Definition of a name-space with fields and methods:

Here the name-space `node()` for `HTML`-node-creation is defined. It contains the private field `functionNames`, the public fields `ID`, `TAG` and `TEXT` as well as the public method `create()`.

	function node(){
		var functionNames = [ 'getElementById', 'createElement', 'createTextNode' ];
		return node = pc.Ns({
			ID: 0, TAG: 1, TEXT: 2
			create: function(Mode, Value){
				return ((Mode = functionNames[Mode]) ? document[Mode](Value) : null);
			}
		 });
	}

######	Definition of an empty class:

Here the empty classes `voidXpcClass` and `voidSpcClass` without members are defined.

	var voidXpcClass = pc.Of(function(This, Type){
		return function(){
		};
	},false);
	
	var voidSpcClass = pc.Of(function(This, Type){
		return function(){
		};
	},true);

######	Definition of a class with fields and methods of different visibility:

Here the `xpc`-class `nameXpcClass` defines the private static field `instanceCount`, the protected field `name`, the protected methods `getName()` and `setName()`, the public static method `getInstanceCount()`, as well as the public methods `getId()`, `getName()`, `setName()` and `toString()`. The constructor-argument `Id` is used as a private field by the method `getId()` and the constructor-argument `Name` initiates the protected field `name`.

	var nameXpcClass = pc.Of(function(This, Type){
		var instanceCount = 0;
		this.name = null
		this.getName = function(){
			return this.name;
		};
		this.setName = function(Name){
			this.name = Name;
			return this.This;
		};
		this.Publish('getName').Publish('setName');
		This.toString = function(){
			return 'nameXpcClass(' + this.getId() + ', ' + this.getName() + ')';
		};
		Type.getInstanceCount = function(){
			return instanceCount;
		};
		return function(Id, Name){
			instanceCount++;
			this.This.getId = function(){
				return Id;
			};
			this.name = Name;
		};
	},false);

In the `spc`-class `nameSpcClass` the same public and static members are fedined. The field `name` now also is public.
	
	var nameSpcClass = pc.Of(function(This, Type){
		var instanceCount = 0;
		This.getName = function(){
			return this.name;
		};
		This.setName = function(Name){
			this.name = Name;
			return this;
		};
		This.toString = function(){
			return 'nameSpcClass(' + this.getId() + ', ' + this.getName() + ')';
		};
		Type.getInstanceCount = function(){
			return instanceCount;
		};
		return function(Id, Name){
			instanceCount++;
			this.getId = function(){
				return Id;
			};
			this.name = Name;
		};
	},true);
	
######	Definition of an inheriting class:

Here the `xpc`-class `personXpcClass` inherits from the `xpc`-class `nameXpcClass` and calls the ancestor-class's constructor-function in its own constructor-function. Besides this, it defines the protected field `age`, as well as the public methods `getAge()`, `setAge()` and `toString()`.
	
	var personXpcClass = pc.Of(function(This, Type){
		this.Super(nameXpcClass);
		this.Publish('getAge', function(){
			return this.age;
		});
		this.Publish('setAge', function(Age){
			this.age = Age;
			return this.This;
		});
		This.toString = function(){
			return 'personXpcClass(' + this.getId() + ', ' + this.getAge() + ', ' + this.getName() + ')';
		};
		return function(Id, Age, Name){
			this.Super(Id, Name).age = Age;
		};
	},false);
	
The `spc`-class `personSpcClass` defines the same members and inherits from the `spc`-class `nameSpcClass`.
	
	var personSpcClass = pc.Of(function(This, Type){
		this.Super(nameSpcClass);
		This.getAge = function(){
			return this.age;
		};
		This.setAge = function(Age){
			this.age = Age;
			return this;
		};
		This.toString = function(){
			return 'personSpcClass(' + this.getId() + ', ' + this.getAge() + ', ' + this.getName() + ')';
		};
		return function(Id, Age, Name){
			nameSpcClass.call(this, Id, Name);
			this.age = Age;
		};
	},true);

######	Definition of class with method-overriding:

Here the `xpc`-class `nameModifyXpcClass` overrides the inherited method `setName()` with a function, that indicates the imminent modification of the protected field `name` with an `alert`-window and afterwards calls the previous implementing of this method by which the value of the field is finally modified.

	var nameModifyXpcClass = pc.Of(function(This, Type){
		this.Super(nameXpcClass).Override('setName', function(Name){
			if(Name != this.name)alert(this.This + '.name has been modified!');
			return this.Super(Name);
		});
		return function(Id, Name){
			this.Super(Id, Name);
		};
	},false);

The `spc`-class `nameModifySpcClass` overrides the same method and inherits from the `spc`-class `nameSpcClass`.

	var nameModifySpcClass = pc.Of(function(This, Type){
		this.Super(nameSpcClass).Override('This','setName', function(Name){
			if(Name != this.name)alert(this + '.name has been modified!');
			return this.Super(Name);
		});
		return function(Id, Name){
			nameSpcClass.call(this, Id, Name);
		};
	},true);

---

##### [cc-by] 2007 Sebastian Rostock ( bee-creative@gmx.de )

Dieses Werk ist unter einem Creative Commons Namensnennung 3.0 Deutschland Lizenzvertrag lizenziert.
