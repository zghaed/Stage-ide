/**
 * Sample VIEW script.
 *
 * @author Stagejs.CLI
 * @created Tue May 23 2017 15:07:09 GMT-0800 (PST)
 */

;(function(app){

	app.view('Overlay.FocusedEditing.View', {

		template: '@view/overlay/focused-editing/view.html',
		//data: 'url', {} or [],
		//coop: ['group-updated',],
		//[editors]: {...},
		
		initialize: function(){
			//indicate whether builder has been shown
			this.builderShown = false;			
		},
		//onShow: function(){},
		//onDataRendered: function(){},
		onReady: function(){
			// var that = this;
			
			// //move the element to the center save the original height and width
			// var $el = this.get('$element'),
			// 	height = $el.height(),
			// 	width = $el.width();
			// //detach the element from DOM and add transition property
			// $el.css({transition: '.5s', position: 'absolute', height: height, width: width}).detach();
			// //reattach the element to the DOM to this view with new css
			// var tabsHeight = this.parentCt.$el.find('.tabs-container .tabs').height(),
			// 	parentHeight = this.parentCt.$el.height(),
			// 	tabsWidth = this.parentCt.$el.find('.tabs-container .tabs').height(),
			// 	parentWidth = this.parentCt.$el.height(),
			// 	newTop = (parentHeight - tabsHeight - $el.height()) / 2,
			// 	newLeft = (parentWidth - tabsWidth - $el.width()) / 2;

			// $el.appendTo(this.$el).css({
			// 	top: newTop,
			// 	left: newLeft
			// });

			// //register right-click event
			// this.registerEditingEvents($el);
		},
		onAppendClone: function(){
			var $clone = this.get('$clone');

			//modify css top to be center
			var tabsHeight = this.parentCt.$el.find('.tabs-container .tabs').height(),
				parentHeight = this.parentCt.$el.height(),
				newTop = (parentHeight - tabsHeight - $clone.height()) / 2;
			//reset top	
			$clone.css('top', newTop);
			//append
			this.$el.append($clone);

			//register builder loading event
			this.registerEditingEvents($clone);
		},
		registerEditingEvents: function($el){
			var that = this;
			//right click to load builder
			$el.on('contextmenu', function(e){
				e.preventDefault();
				e.stopPropagation();

				//cache name = currently editing view + region name
				var cacheName = _.string.slugify(that.get('cacheName'));

				//check whether data view has been show or not?
				var dataView;

				try{
					dataView = that.parentCt.getViewFromTab('Data');
				}catch(event){
					console.warn('You have not configed any data.' + event);
				}

				//create the builder view
				var builder = app.get('Overlay.FocusedEditing.Builder')
					.create({
						cacheName : cacheName,
						dataSource: dataView ? dataView.dataSourceForView : app.model(), //temporary placeholder,
					});
				//setup default cache
				app.store.set(cacheName, app.store.get(cacheName) || {
				    'groups': [{
				        'template': that.get('template'),
				        'data': '',
				        'less': '',
				        'css_container': {
				            'flex-grow': '0',
				            'flex-shrink': '1',
				            'flex-basis': '100%',
				        }
				    }, ],
				    'strings': [],
				    'direction': ''
				});

				//spray the builder view onto the region
          		that.spray($el, builder);

          		//flip flag
          		that.builderShown = true;
			});
		},
		actions: {
		//	submit: function(){...},
		//	dosomething: function(){...},
		//	...
		},

	});

})(Application);