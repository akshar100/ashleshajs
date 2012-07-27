<script type="text/x-template" id="LoginView-main-unsigned">
		<div class="row-fluid">
			<div class="span12 span-centered">
				<form id="login">
			        <fieldset>
			          <legend>SIGN IN</legend>
			          <div class="control-group">
			            <label for="input01" class="control-label">Username or Email</label>
			            <div class="controls">
			              <input type="text" id="username" class="input-xlarge" placement="username or email">
			              <p class="help-block"></p>
			            </div>
			          </div>
			          <div class="control-group">
			            <label for="input01" class="control-label">Password</label>
			            <div class="controls">
			              <input type="password" id="password" class="input-xlarge" placement="username or email">
			              <p class="help-block"></p>
			            </div>
			          </div>
			          <div class="form-actions">
			            <button class="btn btn-primary" type="submit">Sign In</button>
			            <a href="#" class="btn forgot_password">Forgot Password</a>
			          </div>
			        </fieldset>
			     </form>
			     Not a user ? <a href="/signup">Sign Up</a>
			</div>
		</div>
</script>

<script type="text/x-template" id="ForgotPasswordView-main">
		<div class="row-fluid">
			<div class="span12 span-centered">
				<form id="forgot_password">
			        <fieldset>
			        	 <legend>Forgot Your Username/Password?</legend>
			          <div class="control-group">
			            <label for="input01" class="control-label">Email</label>
			            <div class="controls">
			              <input type="text" id="username" class="input-xlarge" placement="Email...">
			              <p class="help-block">Please use the email address you had used while registering for our service.</p>
			            </div>
			          </div>
			          <div class="form-actions">
			            <button class="btn btn-primary" type="submit">Send Email</button>
			            <a href="#" class="btn login">Back to Login</a>
			          </div>
			        </fieldset>
			     </form>
			</div>
		</div>
</script>