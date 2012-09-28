<script type="text/x-template" id="WardrobeView-main-signed">
	<div class="row">
		
		<div class="span8">
			<div class="row">
				<div class="span1">
					<i class="icon-shopping-cart"></i>
				</div>
				<div class="span7">
					<h3>Wardrobe Entries!</h3>
					<hr/>
				</div>
			</div>
			<div class="row">
				<div class="span8">
					<a class="btn btn-primary add-entry" type="button" href="/wardrobe/new">Add Entry</a>
					<hr/>
				</div>
			</div>
			<div class="row">
				<div class="span8 wrcontent">
					
				</div>
			</div>
		</div>
	</div>
</script>
<script id="WardrobeView-section-container" type="text/x-template" >
	<div class="tabbable tabs-left">
              <ul class="nav nav-tabs">
                
            
              </ul>
              <div class="tab-content">
                
               
              </div>
            </div>
</script>
<script id="WardrobeView-section-li" type="text/x-template">
	<li><a data-toggle="tab" href="#{ID}">{SECTION_NAME}</a></li>
</Script>
<script id="WardrobeView-section-tab-pane" type="text/x-template">
	<div id="{ID}" class="tab-pane active" data-section-name='{SECTION_ID}' >
    </div>
</Script>