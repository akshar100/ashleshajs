<script type="text/x-template" id="TopBarView-main-unsigned">
		<div class="navbar navbar-fixed-top">
	      <div class="navbar-inner">
	        <div class="container">
	          <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
	            <span class="icon-bar"></span>
	            <span class="icon-bar"></span>
	            <span class="icon-bar"></span>
	          </a>
	          <a class="brand" href="/"><img src="/static/images/logo.png" height="20" alt="@SITENAME@" title="@SITENAME@"/></a>
	          <div class="pull-right">
	          	<a href="/signin" class="btn">Sign In</a>
	          	<a href="/signup" class="btn btn-success">Sign Up</a>  
	          </div>
	          <div class="pull-right">
	          	 <div class="nav-collapse">
		            <ul class="nav">
		              <li><a href="/">Home</a></li>
		              <li><a href="/page/features">Features</a></li>
		              <li><a href="/page/pricing">Pricing</a></li>
		            </ul>
		          </div><!--/.nav-collapse -->
	          </div>
	         
	        </div>
	      </div>
	    </div>
</script>
<script type="text/x-template" id="TopBarView-main-signed">
		<div class="navbar navbar-fixed-top">
	      <div class="navbar-inner">
	        <div class="container">
	          <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
	            <span class="icon-bar"></span>
	            <span class="icon-bar"></span>
	            <span class="icon-bar"></span>
	          </a>
	          <a class="brand" href="/"><img src="/static/images/logo.png" height="20" alt="@SITENAME@" title="@SITENAME@"/></a>
	          <div class="pull-right">
	          	 
	          		<a class="navbar-link" href="/me">{EMAIL}</a>
	            	<a class="btn btn-primary" href="/signout" title="signout"><i class="icon-off icon-white"></i></a>
	          	
	          </div>
	          <div class="pull-right">
	          	 <div class="nav-collapse">
		            <ul class="nav">
		              <li><a href="/">Home</a></li>
		            </ul>
		          </div><!--/.nav-collapse -->
	          </div>
	         
	        </div>
	      </div>
	    </div>
</script>