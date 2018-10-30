import React, { Component } from 'react';

import {
	TouchableOpacity,
	StyleSheet,
	Text,
	View,
	FlatList,
	Image,
	ActivityIndicator,
	ToastAndroid
} from 'react-native';

//import { is } from 'tcomb';
export default class ClubsFlatList extends Component {
	constructor() {
		super()
		this.state = {
			dataSource: [],
			// this show spinner while fetching data from server
			isLoading: false
		}
	}
	renderItem = ({ item }) => {
		return (
			<TouchableOpacity style={{ flex: 1, flexDirection: 'row', marginBottom: 3 }}
				onPress={() => ToastAndroid.show(item.book_title, ToastAndroid.SHORT)}>
				<Image style={{ width: 80, height: 80, margin: 5 }}
					source={{ uri: item.image }} />
				<View style={{ flex: 1, justifyContent: 'center', marginLeft: 5 }}>
					<Text style={{ fontSize: 18, color: 'green', marginBottom: 15 }}>
						{item.book_title}
					</Text>
					<Text style={{ fontSize: 16, color: 'red' }}>
						{item.author}
					</Text>
				</View>
			</TouchableOpacity>
		)
	}
	// item seprator using black color line in between 
	renderSeparator = () => {
		return (
			<View
				style={{ height: 1, width: '100%', backgroundColor: 'black' }}>

			</View>
		)
	}
	componentDidMount() {
		const url = 'http://www.json-generator.com/api/json/get/ccLAsEcOSq?indent=1'
		// fetching data from server
		fetch(url)
			.then((response) => response.json())
			.then((responseJson) => {
				this.setState({
					dataSource: responseJson.book_array,
					isLoading: false
				})
			})
			.catch((error) => {
				console.log(error);
			})

		console.log()
	}
	render() {
		return (
			this.state.isLoading
				?
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<ActivityIndicator size="large" color="#330066" animating />
				</View>
				:
				<View style={styles.container}>
					<FlatList
						data={this.state.dataSource}
						renderItem={this.renderItem}
						// the keyExtractor prop to specify which piece of data should be used as key
						keyExtractor={(item, index) => index}

						//Divider to the FlatList
						ItemSepratorComponent={this.renderSeparator}
					/>
				</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF'
	}
});