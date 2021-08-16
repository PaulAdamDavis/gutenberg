/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useEffect } from '@wordpress/element';

const preventDefault = ( event ) => event.preventDefault();

export default function HomeEdit( {
	attributes,
	setAttributes,
	context,
	clientId,
} ) {
	const { homeUrl } = useSelect(
		( select ) => {
			const {
				getUnstableBase, //site index
			} = select( coreStore );
			return {
				homeUrl: getUnstableBase()?.home,
			};
		},
		[ clientId ]
	);

	const { textColor, backgroundColor, style } = context;
	const blockProps = useBlockProps( {
		className: classnames( 'wp-block-navigation-item', {
			'has-text-color': !! textColor || !! style?.color?.text,
			[ `has-${ textColor }-color` ]: !! textColor,
			'has-background': !! backgroundColor || !! style?.color?.background,
			[ `has-${ backgroundColor }-background-color` ]: !! backgroundColor,
		} ),
		style: {
			color: style?.color?.text,
			backgroundColor: style?.color?.background,
		},
	} );

	const { label } = attributes;

	useEffect( () => {
		if ( label === undefined ) {
			setAttributes( { label: __( 'Home' ) } );
		}
	}, [ clientId, label ] );

	return (
		<>
			<div { ...blockProps }>
				<a
					className="wp-block-home-link__content wp-block-navigation-item__content"
					href={ homeUrl }
					onClick={ preventDefault }
				>
					<RichText
						identifier="label"
						className="wp-block-home-link__label"
						value={ label }
						onChange={ ( labelValue ) => {
							setAttributes( { label: labelValue } );
						} }
						aria-label={ __( 'Home link text' ) }
						placeholder={ __( 'Add home link' ) }
						withoutInteractiveFormatting
						allowedFormats={ [
							'core/bold',
							'core/italic',
							'core/image',
							'core/strikethrough',
						] }
					/>
				</a>
			</div>
		</>
	);
}
