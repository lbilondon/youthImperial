define(["jquery","underscore","backbone","models/user.model","views/canvas.view","views/gallery.view"],function(a,b,c,d,e,f){return"use strict",{initialize:function(){var b=a("#feedContainer");b.empty(),b.css({display:"block"});var c=new d;c.fetch({success:function(c){var d=new e({el:b,model:c}),g=new f({el:b,model:c,feed:c.getFeed1(),feedName:"user"}),h=new f({el:b,model:c,feed:c.getFeed2(),feedName:"yi"});a("#loading").remove()}})}}});