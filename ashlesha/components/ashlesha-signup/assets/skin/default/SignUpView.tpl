<script type="text/x-template" id="SignUpView-main-unsigned">
		<div class="row-fluid">
			<div class="span12 span-centered">
				<form id="login">
			        <fieldset>
			          <legend>SIGN UP</legend>
			           <div class="first_name"></div>
			           <div class="last_name"></div>
			           <div class="password"></div>
			           <div class="password2"></div>
			           <div class="email"></div>
			           <div class="gender"></div>
			          <!-- Load as JS Module --> 
			          <div class="date_field"></div>
			             
			          <div class="form-actions">
			            <button class="btn btn-primary" type="submit">Sign Up</button>
			          </div>
			        </fieldset>
			     </form>
			     Already a user? <a href="/signin">Sign In</a>
			</div>
		</div>
</script>
<script type="text/x-template" id="SignUpView-success">
		<div class="row">
			<div class="span12">
				    <div class="alert alert-block alert-success">
				    	<a class="close" data-dismiss="alert" href="#">&times;</a>
				    	<h4 class="alert-heading">Success!</h4>
				   		You are successfully registered on @SITENAME@. We must have sent you a welcome mail. Please follow the instrcutions in the mail to help
				   		us verify your email address. 
				   		<strong>You can continue to login for the time being.</strong>
				   		
				    </div>
				   
			</div>
		</div>
		<div class="row">
			<div class="span12">
				 
				 <a href="/signin" class="btn btn-primary btn-large">Get Started &raquo;</a>
				 
			</div>
		</div>
</script>