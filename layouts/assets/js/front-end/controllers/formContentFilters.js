define( [ 'views/rowCollection', 'models/rowCollection'], function( RowCollectionView, RowCollection ) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			nfRadio.channel( 'formContent' ).request( 'add:viewFilter', this.getFormContentView, 4 );
			nfRadio.channel( 'formContent' ).request( 'add:loadFilter', this.formContentLoad, 4 );
			
			/*
			 * In the RC for Ninja Forms, the 'formContent' channel was called 'fieldContents'.
			 * This was changed in version 3.0. These radio messages are here to make sure nothing breaks.
			 *
			 * TODO: Remove this backwards compatibility radio calls.
			 */
			nfRadio.channel( 'fieldContents' ).request( 'add:viewFilter', this.getFormContentView, 4 );
			nfRadio.channel( 'fieldContents' ).request( 'add:loadFilter', this.formContentLoad, 4 );
		},

		getFormContentView: function( collection ) {
			return RowCollectionView;
		},

		/**
		 * When we load our builder view, we filter the formContentData.
		 * This turns the saved object into a Backbone Collection.
		 *
		 * If we aren't passed any data, then this form hasn't been modified with layouts yet,
		 * so we default to the nfLayouts.rows global variable that is localised for us.
		 * 
		 * @since  3.0
		 * @param  array formContentData current value of our formContentData.
		 * @return Backbone.Collection
		 */
		formContentLoad: function( formContentData, formModel, empty, fields ) {
			if ( true === formContentData instanceof RowCollection ) return formContentData;
			
			var formContentLoadFilters = nfRadio.channel( 'formContent' ).request( 'get:loadFilters' );

			/*
			 * TODO: This is a bandaid fix to prevent forms with layouts and parts from freaking out of layouts & styles are deactivated.
			 * If Layouts is deactivated, it will send the field keys.
			 */
			if ( 'undefined' == typeof formContentLoadFilters[1] && _.isArray( formContentData ) && 0 != formContentData.length && 'part' == formContentData[0].type ) {
				formContentData = formModel.get( 'fields' ).pluck( 'key' );
			}

			empty = empty || false;
			fields = fields || false;
			var rowArray = [];

			if ( _.isArray( formContentData ) && 'undefined' == typeof formContentData[0].cells ) {
				_.each( formContentData, function( key, index ) {
					rowArray.push( {
						order: index,
						cells: [ {
							order: 0,
							fields: [ key ],
							width: '100'
						} ]
					} );

				} );
			} else if ( 'undefined' != typeof nfLayouts && ! empty ) {
				rowArray = nfLayouts.rows;
			} else {
				rowArray = formContentData;
			}
			
			return new RowCollection( rowArray, { formModel: formModel } );
		}
	});

	return controller;
} );