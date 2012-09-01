<script type="text/x-template" id="FanPageListView-main-signed">
	<div class="row">
		
		<div class="span8">
			<div class="row">
				<div class="span8">
					<h3>Fan Pages</h3>
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
<script type="text/x-template" id="FanPageListView-item">
	<div class="row rowBlock">
		<div class="span1">
			<img src="{IMG}" class="img40"/>
		</div>
		<div class="span6">
			<a href="/fanpage/{ID}"><span class="label label-info">{TITLE}</span></a>
			<p>{DESCRIPTION}</p>
		</div>
	</div>
</script>
