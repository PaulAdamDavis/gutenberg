/**
 * External dependencies
 */
import {
	SafeAreaView,
	ScrollView,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

/**
 * WordPress dependencies
 */
import { useContext, useState } from '@wordpress/element';
import {
	BottomSheet,
	BottomSheetContext,
	TextControl,
	Icon,
} from '@wordpress/components';
import { chevronRight } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import styles from './style.scss';

const HelpTopicRow = ( { content, label, icon } ) => {
	const [ showSubSheet, setShowSubSheet ] = useState( false );
	const navigation = useNavigation();
	const {
		listProps: { style: containerStyle, ...scrollViewProps },
	} = useContext( BottomSheetContext );
	const contentContainerStyle = StyleSheet.flatten(
		scrollViewProps.contentContainerStyle
	);

	const openSubSheet = () => {
		setShowSubSheet( true );
		navigation.navigate( BottomSheet.SubSheet.screenName );
	};

	const goBack = () => {
		navigation.goBack();
		setShowSubSheet( false );
	};

	return (
		<BottomSheet.SubSheet
			navigationButton={
				<TextControl
					separatorType="leftMargin"
					customActionButton
					leftAlign
					onPress={ openSubSheet }
					label={ label }
					icon={ icon }
				>
					<Icon icon={ chevronRight } />
				</TextControl>
			}
			showSheet={ showSubSheet }
		>
			<SafeAreaView style={ containerStyle }>
				<BottomSheet.NavigationHeader
					screen={ label }
					leftButtonOnPress={ goBack }
				/>
				<View style={ styles.separator } />
				<ScrollView
					{ ...scrollViewProps }
					contentContainerStyle={ {
						...contentContainerStyle,
						paddingBottom: Math.max(
							scrollViewProps.safeAreaBottomInset,
							contentContainerStyle.paddingBottom
						),
						/**
						 * Remove margin set via `hideHeader`. Combining a header
						 * and navigation in this bottom sheet is at odds with the
						 * current `BottomSheet` implementation.
						 */
						marginTop: 0,
					} }
				>
					<TouchableWithoutFeedback accessible={ false }>
						<View>{ content }</View>
					</TouchableWithoutFeedback>
				</ScrollView>
			</SafeAreaView>
		</BottomSheet.SubSheet>
	);
};

export default HelpTopicRow;
