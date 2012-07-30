<script type="text/x-template" id="FileUploadField-main">
<div class="control-group">
	<label for="{FIELD_NAME}" class="control-label">{LABEL}</label>
	<div class="controls">
	  <input type="hidden" name="{FIELD_NAME}" id="{FIELD_NAME}" class="input-xlarge {CLS}"/>
	  <a class="show-file-box" href="#"><i class="icon-upload"></i> {PLACEHOLDER}</a>
	  <div class="file-box hide">
	  	<form><input type="file" class="input-file {CLS} " name="fileupload"/><a class="remove" href="#">Remove</a></form>
	  	
	  </div>
	  <p class="help-block">{HELP_TEXT}</p>
	</div>
	<div class="row image-preview">
		
	</div>
</div>
</script>