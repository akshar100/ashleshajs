<script type="text/x-template" id="TextAreaField-main">
<div class="control-group">
	<label for="{FIELD_NAME}" class="control-label">{LABEL}</label>
	<div class="controls">
	  <textarea name="{FIELD_NAME}" id="{FIELD_NAME}" class="input-xlarge {CLS}" placeholder="{PLACEHOLDER}"></textarea>
	  <p class="help-block">{HELP_TEXT}</p>
	</div>
</div>
</script>

<script type="text/x-template" id="TextAreaField-toolbar">
<div style="display: none;">
  <a data-wysihtml5-command="bold">bold</a>
  <a data-wysihtml5-command="italic">italic</a>
  
  <!-- Some wysihtml5 commands require extra parameters -->
  <a data-wysihtml5-command="foreColor" data-wysihtml5-command-value="red">red</a>
  <a data-wysihtml5-command="foreColor" data-wysihtml5-command-value="green">green</a>
  <a data-wysihtml5-command="foreColor" data-wysihtml5-command-value="blue">blue</a>
  
  <!-- Some wysihtml5 commands like 'createLink' require extra paramaters specified by the user (eg. href) -->
  <a data-wysihtml5-command="createLink">insert link</a>
  <div data-wysihtml5-dialog="createLink" style="display: none;">
    <label>
      Link:
      <input data-wysihtml5-dialog-field="href" value="http://" class="text">
    </label>
    <a data-wysihtml5-dialog-action="save">OK</a> <a data-wysihtml5-dialog-action="cancel">Cancel</a>
  </div>
</div>
</script>