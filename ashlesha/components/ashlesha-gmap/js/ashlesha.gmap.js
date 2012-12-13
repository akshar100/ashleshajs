YUI().add('ashlesha-gmap', function(Y) {

    function Gmap(config) {
        Gmap.superclass.constructor.apply(this, arguments);
    }

    Y.extend(Gmap, Y.Base, {
        initializer: function(config) {
            var c = config.container;
            this.set("container",c);
            c.setStyle("height", config.height || 200);
            c.setStyle("width", config.width || 300);
            this.set("markers",config.markers);

        },
        loadMap: function(result) { //Maps can be loaded only after our container is a part of DOM
            
            var self=this,
                c = this.get("container");

            if(!google || !google.maps || !google.maps.LatLng){
                Y.jsonp('http://maps.googleapis.com/maps/api/js?sensor=false&key=AIzaSyCEkDBamEtBMCYIRSKldgYiN6iPYLDP0Ng',function(){
                    self.mapLoaded(result);
                });
            }
            else
            {
                self.mapLoaded(result);
            }
            

        },
        setLocation:function(result){
            this.set("location",result);
            
        },
        getLocation:function(){
            return this.get("location");
        },
        mapLoaded:function(result){
                Y.log(result);  
                var self=this,map,c=this.get('container'),mapOptions,marker,myLatlng=new google.maps.LatLng(result.raw.geometry.location.lat, result.raw.geometry.location.lng),markers = this.get("markers");
                mapOptions = {
                    center: myLatlng,
                    zoom: 8,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                map = new google.maps.Map(c.getDOMNode(), mapOptions);
                
                
                marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    title: result.text
                }); 
                
                if(markers && Y.Lang.isArray(markers)){
                    Y.Array.each(markers,function(item){
                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(item.raw.geometry.location.lat, item.raw.geometry.location.lng),
                            map: map,
                            title: item.text
                        }); 
                    });
                }
                //self.set("map",map);
                //self.set("location",result);
                //self.set("google",google);
            }
        
        
    });

    Y.Gmap = Gmap;
}, '0.0.1', {
    requires: ['base', 'jsonp', 'jsonp-url']
});