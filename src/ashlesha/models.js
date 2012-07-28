/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */
/*global require*/
/*global module*/
/*global YUI*/
/*global __dirname*/
"use strict";
YUI().add('common-models-store',function(Y){
	
	 /**
	  * Validations Facade. All the validation rules go here.
	  */
	 Y.ValidationFacade = Y.Base.create("ValidationFacade",Y.Base,[],{
	 
	  validations: {
	 	trim:function(key,val,attrs){
	 		if(!val){val="";}
	 		return val.trim();
	 	},
	 	required:function(key,val,attrs){
	 		if(typeof val === "undefined" || !val)
	 		{
	 			throw {
	 				target:key,
	 				val:val,
	 				message:Y.Lang.sub("<strong>{s}</strong> can not be empty",{ s:this.titlize(key) })
	 			};
	 			
	 		}
	 		return val;
	 	}
	 	
	 	
	 },
	 titlize:function(str){
	 	str = str.replace(/_/g," ") ;
	 	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	 	
	 }
	 
	 });
	 
	/*
     * The CommonModel class represents the base Model for our application which supports our customized validation framework as well
     * @class  CommonModel
     * @extends AshleshaBaseModel
     * @uses
     * @constructor
     * @cfg {attrs:{
     * 		attr_name:{
     * 	    value:'default value',
     *      validation_rules:'trim|required|numeric'
     * }
     * }} configuration attributes
     * 
     */
	Y.CommonModel = Y.Base.create("CommonModel",Y.AshleshaBaseModel,[Y.ValidationFacade],{
		initializer:function(config){
			var attrs = this.get("attrs");
			
			if(attrs) //We supply attributes as initialization parameters along with
			{
				this.set("attrs",Y.clone(attrs));
				this.addAttrs(attrs);
				
			}
		},
		validate:function(attrs){
			
			var attrConfig = this.get("attrs"),errors=[];
			if(attrConfig)
			{
				
				Y.Object.each(attrConfig,function(val,key){
					var v = val.validation_rules,rules;
					
					 //If the validation rule chain is specified
					if(v){
						rules = v.split("|");
						
						try{
							
							Y.Array.each(rules,function(item,index){
								
								val = this.validations[item].apply(this,[key,attrs[key],attrs]);
							},this);
							
						}catch(ex){
							errors.push({
								field:key,
								error:ex
							});
						}
						
					}
				},this);
			}
			if(errors.length>0)
			{
				return errors;
			}
		}
	});
	 
},'0.0.9',{
	requires:['ashlesha-base-models']
});
