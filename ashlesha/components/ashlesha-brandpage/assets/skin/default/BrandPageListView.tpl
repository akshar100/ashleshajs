<script type="text/x-template" id="BrandPageListView-main-signed">
	<div class="row">
		
		<div class="span8">
			<div class="row">
				<div class="span8">
					<h3>Brand Pages</h3>
					<hr/>
				</div>
			</div>
		</div>
		<div class="span8">
			<div class="row">
				<div class="span8">
					<form class="bs-docs-example form-search">
			            <input type="text" class="input-medium search-query" placeholder="Enter A Brand Name...">
			            <button class="btn searchBtn" type="submit">Search</button>
			        </form>
				</div>
			</div>
		</div>
		<div class="span8">
			<div class="row">
				<div class="span8 pageList">
					
				</div>
			</div>
		</div>
	</div>
</script>
<script type="text/x-template" id="BrandPageListView-item">
	<div class="row rowBlock">
		<div class="span1">
			<img src="{IMG}" class="img40"/>
		</div>
		<div class="span6">
			<a href="/brandpage/{ID}"><span class="label label-info">{TITLE}</span></a>
			<p>{DESCRIPTION}</p>
			
			<span class="label label-important">Not Yet Approved</span>
				
		</div>
	</div>
</script>
