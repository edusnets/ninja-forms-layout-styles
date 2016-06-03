/**
 * Model that holds our cell information
 * 
 * @package Ninja Forms Layouts
 * @subpackage Layouts
 * @copyright (c) 2016 WP Ninjas
 * @since 3.0
 */
define( ['models/cellFieldCollection'], function( CellFieldCollection) {
	var model = Backbone.Model.extend( {
		initialize: function() {
			var fieldCollection = this.collection.formModel.get( 'fields' );
			var fieldModels = [];
			_.each( this.get( 'fields' ), function( search ) {
				if ( 'undefined' == typeof fieldCollection.get( search ) ) {
					fieldModels.push( fieldCollection.findWhere( { key: search } ) );
				} else {
					fieldModels.push( fieldCollection.get( search ) );
				}
				
			} );
			this.set( 'fields', new CellFieldCollection( fieldModels, { cellModel: this } ) );
		}
		
	} );
	
	return model;
} );