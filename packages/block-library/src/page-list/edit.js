/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import {
	BlockControls,
	useBlockProps,
	store as blockEditorStore,
	getColorClassName,
} from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { ToolbarButton } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import ConvertToLinksModal from './convert-to-links-modal';

// We only show the edit option when page count is <= MAX_PAGE_COUNT
// Performance of Navigation Links is not good past this value.
const MAX_PAGE_COUNT = 100;

export default function PageListEdit( {
	context,
	clientId,
	attributes,
	setAttributes,
} ) {
	// Copy context to attributes to make it accessible in the editor's
	// ServerSideRender
	useEffect( () => {
		const {
			textColor,
			customTextColor,
			backgroundColor,
			customBackgroundColor,
			overlayTextColor,
			customOverlayTextColor,
			overlayBackgroundColor,
			customOverlayBackgroundColor,
		} = context;
		setAttributes( {
			textColor,
			customTextColor,
			backgroundColor,
			customBackgroundColor,
			overlayTextColor,
			customOverlayTextColor,
			overlayBackgroundColor,
			customOverlayBackgroundColor,
		} );
	}, [
		context.textColor,
		context.customTextColor,
		context.backgroundColor,
		context.customBackgroundColor,
		context.overlayTextColor,
		context.customOverlayTextColor,
		context.overlayBackgroundColor,
		context.customOverlayBackgroundColor,
	] );

	useEffect( () => {
		const isNavigationChild = isEmpty( context ) ? false : true;
		setAttributes( { isNavigationChild } );
	}, [] );

	const { textColor, backgroundColor, showSubmenuIcon, style } =
		context || {};

	const [ allowConvertToLinks, setAllowConvertToLinks ] = useState( false );

	const blockProps = useBlockProps( {
		className: classnames( {
			'has-text-color': !! textColor,
			[ getColorClassName( 'color', textColor ) ]: !! textColor,
			'has-background': !! backgroundColor,
			[ getColorClassName(
				'background-color',
				backgroundColor
			) ]: !! backgroundColor,
			'show-submenu-icons': !! showSubmenuIcon,
		} ),
		style: { ...style?.color },
	} );

	const isParentNavigation = useSelect(
		( select ) => {
			const { getBlockParentsByBlockName } = select( blockEditorStore );
			return (
				getBlockParentsByBlockName( clientId, 'core/navigation' )
					.length > 0
			);
		},
		[ clientId ]
	);

	useEffect( () => {
		if ( isParentNavigation ) {
			apiFetch( {
				path: addQueryArgs( '/wp/v2/pages', {
					per_page: 1,
					_fields: [ 'id' ],
				} ),
				parse: false,
			} ).then( ( res ) => {
				setAllowConvertToLinks(
					res.headers.get( 'X-WP-Total' ) <= MAX_PAGE_COUNT
				);
			} );
		} else {
			setAllowConvertToLinks( false );
		}
	}, [ isParentNavigation ] );

	const [ isOpen, setOpen ] = useState( false );
	const openModal = () => setOpen( true );
	const closeModal = () => setOpen( false );

	return (
		<>
			{ allowConvertToLinks && (
				<BlockControls group="other">
					<ToolbarButton title={ __( 'Edit' ) } onClick={ openModal }>
						{ __( 'Edit' ) }
					</ToolbarButton>
				</BlockControls>
			) }
			{ allowConvertToLinks && isOpen && (
				<ConvertToLinksModal
					onClose={ closeModal }
					clientId={ clientId }
				/>
			) }
			<div { ...blockProps }>
				<ServerSideRender
					block="core/page-list"
					attributes={ attributes }
				/>
			</div>
		</>
	);
}
