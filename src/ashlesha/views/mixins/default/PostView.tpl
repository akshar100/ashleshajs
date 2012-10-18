<script type="text/x-template" id="PostView-main-signed">
	<div class="row post-view-block shadow-box">
		<div class="span1">
			<img class="img40" src="http://placehold.it/40x40">
		</div>
		<div class="span8">
			<h4><a href="/user/{author_id}">{author_name}</a></h4>
			<div class="row">
				<div class="span8">
					{post_text}
				</div>
			</div>
			<div class="row">
				<div class="span8 images">
				</div>
			</div>
			<h6>POSTED ON {created_at}</h6>
			<div class="row">
				<div class="span2 comments"><a href="#">Comments ({comment_count})</a></div>
				<div class="span1"><a class="like" href="#"><i class="icon-thumbs-up"></i> Like</a></div>
				<div class="span1 hide"><a class="unlike" href="#"><i class="icon-thumbs-down"></i> Unlike</a></div>
				<div class="span1"><a class="share" href="#"><i class="icon-retweet"></i> Share</a></div>
			</div>
			<div class="row">
				<div class="span8 commentsSection hide">
					<div class="row">
						<div class="span8 commentsList">
							
						</div>
					</div>
					<div class="row">
						<div class="span1"><img class="img40" src="http://placehold.it/40x40"/></div>
						<div class="span7 commentTextarea"></div>
					</div>
					<div class="row">
						<div class="pull-right">
							<button type="button" class="btn btn-primary submitComment">Comment</button>
						</div>
					</div>
				</div>
				
			</div>
		</div>
	</div>
</script>
<script type="text/x-template" id="PostView-CommentView">
	<div class="row commentRow">
		<div class="span1"><img src="http://placehold.it/40x40" class="img40"/></div>
		<div class="span7"><span class="label label-info">{NAME}</span> &nbsp; {TEXT}</div>
	</div>
</script>
