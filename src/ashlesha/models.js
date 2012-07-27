/*jslint devel: true,  undef: true, newcap: true, strict: true, maxerr: 50 */
/*global require*/
/*global module*/
/*global YUI*/
/*global __dirname*/
"use strict";
YUI().add('common-models',function(Y){
	
	 /**
	  * Validations Facade. All the validation rules go here.
	  */
	 Y.ValidationFacade = { validations: {
	 	trim:function(key,val,attrs){
	 		return val.trim();
	 	},
	 	required:function(key,val,attrs){
	 		if(typeof val === "undefined" || !val)
	 		{
	 			throw {
	 				target:key,
	 				val:val,
	 				mesaage:Y.Lang.sub("{s} can not be empty",{ s:key })
	 			};
	 			
	 		}
	 		return val;
	 	}
	 	
	 }};
	 
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
	Y.CommonModel = Y.Base.create("CommonModel",Y.AshleshaBaseModel,[],{
		initializer:function(config){
			if(config && config.attrs) //We supply attributes as initialization parameters along with
			{
				this.set("attrConfig",config.attrs);
				this.setAttrs(config.attrs);
			}
		},
		validate:function(attrs){
			var attrConfig= this.get("attrConfig"),errors=[];
			if(attrConfig)
			{
				Y.Object.each(attrConfig,function(val,key){
					var v = val.validation_rules,rules;
				
					 //If the validation rule chain is specified
					if(v){
						rules = v.split("|");
						
						try{
							
							Y.Array.each(rules,function(item,index){
								val = this.validations[item].apply(this,[key,val,attrs]);
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
		}
	});
	 
},'0.0.9',{
	requires:['ashlesha-base-models','ashlesha-api']
});
