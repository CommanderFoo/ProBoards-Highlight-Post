class Highlight_Post {

	static init(){
		if(typeof yootil == "undefined"){
			return;
		}

		let location_check = (
			yootil.location.recent_posts() ||
			yootil.location.search_results() ||
			yootil.location.thread()
		);

		if(!location_check){
			return;
		}

		this.ID = "pd_highlight_post";
		this.KEY = "pd_highlight_post";
		this.COLOR = "";

		this.setup();

		$(this.ready.bind(this));
	}

	static ready(){
		this.create_button();

		yootil.event.after_search(() => {
			this.highlight_posts.bind(this)();
			this.create_button();
		});

		this.highlight_posts();
	}

	static create_button(){
		if(!yootil.user.is_staff()){
			return;
		}

		let $controls = $("tr.item[id^=post-] .controls");

		$controls.each(function(){
			let post_id = Highlight_Post.fetch_post_id(this);

			if(post_id){
				let data = Highlight_Post.fetch_post_data(post_id);
				let txt = (data == 1)? "Remove Highlight" : "Highlight Post";
				let $button = $("<a href='#' data-highlight='" + post_id + "' role='button' class='button'>" + txt + "</a>");

				$button.on("click", Highlight_Post.button_handler.bind($button, post_id));

				$(this).prepend($button);
			}
		});
	}

	static fetch_post_id(control){
		let $post_row = $(control).closest("tr.item.post");
		let post_id_parts = ($post_row.attr("id") || "").split("-");

		if(post_id_parts && post_id_parts.length == 2){
			return parseInt(post_id_parts[1], 10);
		}

		return 0;
	}

	static set_post_data(post_id, val){
		yootil.key.set(this.KEY, val, post_id);
	}

	static fetch_post_data(post_id){
		return yootil.key.value(this.KEY, post_id);
	}

	static button_handler(post_id){
		if(!yootil.user.is_staff()){
			return;
		}

		let data = parseInt(Highlight_Post.fetch_post_data(post_id), 10) || 0;

		if(data == 1){
			Highlight_Post.unhighlight_post(post_id);
			this.text("Highlight Post");
		} else {
			Highlight_Post.highlight_post(post_id);
			this.text("Remove Highlight");
		}

		return false;
	}

	static highlight_post(post_id, set_data = true){
		let $post = $("tr#post-" + post_id + " td:first");

		if($post.length == 1){
			$("tr#post-" + post_id + " td:first").css("background-color", Highlight_Post.COLOR);

			if(set_data){
				Highlight_Post.set_post_data(post_id, 1);
			}
		}
	}

	static unhighlight_post(post_id){
		$("tr#post-" + post_id + " td:first").css("background-color", "");
		Highlight_Post.set_post_data(post_id, 0);
	}

	static highlight_posts(){
		let post_data = proboards.plugin.keys.data[this.KEY];

		for(let key in post_data){
			if(post_data[key] == 1){
				Highlight_Post.highlight_post(key, false);
			}
		}
	}

	static setup(){
		let plugin = pb.plugin.get(this.ID);

		if(plugin && plugin.settings){
			this.COLOR = "#" + plugin.settings.highlight_color;
		}
	}

}