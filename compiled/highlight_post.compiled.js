"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Highlight_Post = function () {
	function Highlight_Post() {
		_classCallCheck(this, Highlight_Post);
	}

	_createClass(Highlight_Post, null, [{
		key: "init",
		value: function init() {
			if (typeof yootil == "undefined") {
				return;
			}

			var location_check = yootil.location.recent_posts() || yootil.location.search_results() || yootil.location.thread();

			if (!location_check) {
				return;
			}

			this.ID = "pd_highlight_post";
			this.KEY = "pd_highlight_post";
			this.COLOR = "";

			this.setup();

			$(this.ready.bind(this));
		}
	}, {
		key: "ready",
		value: function ready() {
			var _this = this;

			this.create_button();

			yootil.event.after_search(function () {
				_this.highlight_posts.bind(_this)();
				_this.create_button();
			});

			this.highlight_posts();
		}
	}, {
		key: "create_button",
		value: function create_button() {
			if (!yootil.user.is_staff()) {
				return;
			}

			var $controls = $("tr.item[id^=post-] .controls");

			$controls.each(function () {
				var post_id = Highlight_Post.fetch_post_id(this);

				if (post_id) {
					var data = Highlight_Post.fetch_post_data(post_id);
					var txt = data == 1 ? "Remove Highlight" : "Highlight Post";
					var $button = $("<a href='#' data-highlight='" + post_id + "' role='button' class='button'>" + txt + "</a>");

					$button.on("click", Highlight_Post.button_handler.bind($button, post_id));

					$(this).prepend($button);
				}
			});
		}
	}, {
		key: "fetch_post_id",
		value: function fetch_post_id(control) {
			var $post_row = $(control).closest("tr.item.post");
			var post_id_parts = ($post_row.attr("id") || "").split("-");

			if (post_id_parts && post_id_parts.length == 2) {
				return parseInt(post_id_parts[1], 10);
			}

			return 0;
		}
	}, {
		key: "set_post_data",
		value: function set_post_data(post_id, val) {
			yootil.key.set(this.KEY, val, post_id);
		}
	}, {
		key: "fetch_post_data",
		value: function fetch_post_data(post_id) {
			return yootil.key.value(this.KEY, post_id);
		}
	}, {
		key: "button_handler",
		value: function button_handler(post_id) {
			if (!yootil.user.is_staff()) {
				return;
			}

			var data = parseInt(Highlight_Post.fetch_post_data(post_id), 10) || 0;

			if (data == 1) {
				Highlight_Post.unhighlight_post(post_id);
				this.text("Highlight Post");
			} else {
				Highlight_Post.highlight_post(post_id);
				this.text("Remove Highlight");
			}

			return false;
		}
	}, {
		key: "highlight_post",
		value: function highlight_post(post_id) {
			var set_data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

			var $post = $("tr#post-" + post_id + " td:first");

			if ($post.length == 1) {
				$("tr#post-" + post_id + " td:first").css("background-color", Highlight_Post.COLOR);

				if (set_data) {
					Highlight_Post.set_post_data(post_id, 1);
				}
			}
		}
	}, {
		key: "unhighlight_post",
		value: function unhighlight_post(post_id) {
			$("tr#post-" + post_id + " td:first").css("background-color", "");
			Highlight_Post.set_post_data(post_id, 0);
		}
	}, {
		key: "highlight_posts",
		value: function highlight_posts() {
			var post_data = proboards.plugin.keys.data[this.KEY];

			for (var key in post_data) {
				if (post_data[key] == 1) {
					Highlight_Post.highlight_post(key, false);
				}
			}
		}
	}, {
		key: "setup",
		value: function setup() {
			var plugin = pb.plugin.get(this.ID);

			if (plugin && plugin.settings) {
				this.COLOR = "#" + plugin.settings.highlight_color;
			}
		}
	}]);

	return Highlight_Post;
}();


Highlight_Post.init();