/**
	Annotation is an element of an n-ary Relation. If Annotation is part of an Argument, the Annotation is of a specific type, namely of the slot in the argumentation scheme of the Argument.
	@constructor
	@param relation
	@param {string} annotationLabel - Can e.g. be "acs-topic" if this annotation belongs to the topic-slot of an Argument that follows the acs scheme.
	@param {object} subject - The object that is the actual 'content' of this annotation. Can be a TextSection, but also an Argument.
	@param meta - Not used at this time, might be used later for additional information that is not stored in the database.
*/
function Annotation(relation, annotationLabel, subject, meta){
	this.parent = DbItem;
	this.parent();
	this.parent = new DbItem();

	// Private variables
	this._subject;

	// Protected variables
	this._relation = relation;
	
	if( typeof(annotationLabel)=="undefined" ){
		this._annotationLabel = "a("+(new Date())+")";
	}else{
		this._annotationLabel = annotationLabel;
	}
	this.setDataItem("type",this._annotationLabel);

	this._meta = (typeof(meta)=="undefined"?{}:meta);
	
	// Public get methods
	this.getRelation = function(){
		return this._relation;
	};

	this.getAnnotationLabel = function(){
		return this._annotationLabel;
	};

	this.getSubject = function(){
		return this._subject;
	};

	this.getMeta = function(){
		return this._meta;
	};

	this.getMetaItem = function(key){
		if( key in this._meta )
			return this._meta[key];
		else
			return undefined;
	};

	//Public set methods
	this.setRelation = function(relation){
		this._relation = relation;
	};
	
	/**
		Sets the label of this annotation to a certain value
		@param {string} annotationLabel
	*/
	this.setAnnotationLabel = function(annotationLabel){
		this._annotationLabel = annotationLabel;
	};
	
	/**
		@param {string or object} Currently supports TextSection objects and Relation objects. When a string is given, a TextSection is automatically generated.
	*/
	this.setSubject = function(subject){
		if( typeof(subject) == "object" ){
			this._subject = subject;
			if( subject.constructor == TextSection ){
				this.setDataItem("text_element",subject); //was: this.subject debug
			}else{
				this.setDataItem("relation_element",this.subject);
			}
		}else if( typeof(subject) == "string" ){
			this._subject = new TextSection(subject);
			this.setDataItem("text_element",subject);//was: this.subject debug
		}	
	};

	this.setSubject(subject);

	this.setMeta = function(meta){
		this._meta = meta;
	};

	this.setMetaItem = function(key, value){
		if ( key != "" ){
			this._meta[key] = value;
			return true;
		} else {
			return false;
		}
	};
	
	/**
		Creates an annotation in the remote database, based on the local data of the current object.
		@param referer
	*/
	this.create = function(referer){
		var ref = (typeof(referer)=="undefined"?this:referer);
		
		ref.setMetaItem("createdOn",Number(new Date()));
		
		if(ref._relation.getURI() == undefined)
			ref._relation.create(ref._relation);
	
		if(ref._subject.getURI() == undefined)
			ref._subject.create(ref._subject);
		
		if(ref._subject.constructor == TextSection){
			ref.setDataItem("text_element",ref._subject.getURI());
		}else{
			ref.setDataItem("relation_element",ref._subject.getURI());
		}
	
		var entity = "/relations/"+ref._relation.getURI()+"/";
		this.parent.create(entity, undefined, undefined, undefined, ref);
	};
}
