import React from 'react';
import {
  Image, StyleSheet, Text, TouchableOpacity, View,
  Dimensions, TouchableWithoutFeedback, FlatList, ScrollView,
  RefreshControl
} from 'react-native';
import { connect } from 'react-redux'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AppLoading } from 'expo';
import { Button } from 'native-base';
import { DefaultImg } from '../Utils/Defaults';

const window = Dimensions.get('window');
const imageWidth = (window.width / 3) + 30;
const imageHeight = window.width / 3;

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const CLUB_WIDTH = WIDTH * 4 / 10;
const CLUB_HEIGHT = HEIGHT / 4;

class ShowClubs extends React.Component {
  constructor(props) { // Initializing state
    super(props);
    
    props.navigation.setParams({ refreshClubs: this.getUserClubs });
    props.navigation.setParams({ showAdmin: true })

    this.state = {
      tappedAdmin: false,
      show: false,
      name: '',
      description: '',
      imageURL: DefaultImg
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <View style={{ marginLeft: 13 }}>
          <FontAwesome
            name="plus" size={24} color={'black'}
            onPress={() => navigation.navigate('CreateClub', { refreshClubs: navigation.state.params.refreshClubs })} />
        </View>
      ),
      headerRight: (
        <View style={{ marginRight: 6 }}>
          <FontAwesome
            name="search" size={24} color={'black'}
            onPress={() => navigation.navigate('ClubSearch')} />
        </View>
      ),
      headerTitle: (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
          <Button transparent onPress={() => navigation.setParams({ showAdmin: true })} >
            <Text style={[{ fontSize: 20, fontWeight: 'bold' }, !navigation.state.params ||
              navigation.state.params.showAdmin ? { color: '#59cbbd' } : {}]} >Admin</Text>
          </Button>
          <Text style={{ fontSize: 32, fontWeight: 'bold' }} >|</Text>
          <Button transparent onPress={() => navigation.setParams({ showAdmin: false })}>
            <Text style={[{ fontSize: 20, fontWeight: 'bold' }, navigation.state.params &&
              !navigation.state.params.showAdmin ? { color: '#59cbbd' } : {}]} >Member</Text>
          </Button>          
        </View>
      )
    };
  };

  navigateUser = (item) => {
    const { params } = this.props.navigation.state;
    this.props.navigation.navigate((!params || params.showAdmin ? 'AdminNavigation' : 'MemberNavigation'), { item, isAdmin: item.isAdmin });
  };

  _renderItem = ({ item }) => {
    if (item.empty) {
      return <View style={[styles.eventContainer, { backgroundColor: 'transparent' }]} />;
    }
    return (
      <TouchableWithoutFeedback onPress={() => this.navigateUser(item)}
        style={{ flexDirection: 'row' }}>
        <View style={styles.eventContainer} >
          <Image style={styles.containerImage} source={{ uri:  'https://s3.amazonaws.com/clubster-123/' + item.image }} />
          <View style={{ margin: 10 }}>
            <Text allowFontScaling numberOfLines={1}
              style={styles.eventTitle}> {item.name}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  render() {
    if (this.props.loading)
      return <AppLoading/>
    if (!this.props.navigation.state.params || this.props.navigation.state.params.showAdmin) {
      if (!this.props.clubsAdmin || this.props.clubsAdmin.length == 0)
        return (
            <ScrollView refreshControl={<RefreshControl
              refreshing={this.props.loading}
            />}>
            <Text style={[{ flex: 1 }, styles.noneText ]}>You are not an admin of any clubs</Text>
            </ScrollView>
        )
      return (
        <ScrollView refreshControl={<RefreshControl
          refreshing={this.props.loading}
        />}>
          <FlatList
            data={this.props.clubsAdmin}
            renderItem={this._renderItem}
            horizontal={false}
            numColumns={2}
            keyExtractor={club => club._id}
          />
        </ScrollView>
      )
    }
    else {
      if (!this.props.clubsMember || this.props.clubsMember.length == 0)
        return (
          <ScrollView refreshControl={<RefreshControl
            refreshing={this.props.loading}
          />}>
            <Text style={[{ flex: 1 }, styles.noneText ]}>You are not a member of any clubs</Text>
          </ScrollView>
        )
      return (
        <ScrollView refreshControl={<RefreshControl
          refreshing={this.props.loading}
        />}>
          <FlatList
            data={this.props.clubsMember.slice(0, 40)}
            renderItem={this._renderItem}
            horizontal={false}
            numColumns={2}
            keyExtractor={club => club._id}
            extraData={this.props}
          />
        </ScrollView>
      )
    }
  }
}

const mapStateToProps = (state) => {
  if (!state.user.user)
    return { loading: true };
  var clubsAdmin = state.clubs.clubsAdmin;
  var clubsMember = state.clubs.clubsMember;
  if (clubsAdmin.length % 2 != 0) clubsAdmin.push({ empty: true });
  if (clubsMember.length % 2 != 0) clubsMember.push({ empty: true });
  return {
    clubsAdmin: state.clubs.clubsAdmin,  
    clubsMember: state.clubs.clubsMember,
    loading: false
  }
}

export default connect(mapStateToProps, null)(ShowClubs);

const styles = StyleSheet.create({
  eventContainer: {
    flex: 1,
    height: CLUB_HEIGHT,
    position: 'relative',
    backgroundColor: '#59cbbd',
    marginTop: 20,
    marginRight: 5,
    marginLeft: 5,
    borderRadius: 5,
  },
  containerImage: {
    alignItems: 'center',
    borderColor: '#d6d7da',
    flex: 1,
    borderRadius: 5,
  },
  eventTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  topButtons: {
    backgroundColor: '#E0E0E0',
    width: 100,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 82,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    flex: 1,
    marginVertical: 20,
  },
  uploadIcon:{
    alignSelf: 'center',
    margin: 10,
  },
  imageThumbnail: {
    margin: 20,
    alignSelf: 'center',
    borderRadius: 2,
    width: WIDTH/1.5,
    height: HEIGHT/3 
  },
  btn: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: '#03A9F4',
    borderRadius: 30,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  plus: {
    fontSize: 40,
    color: 'white'
  },
  item: {
    backgroundColor: '#009900',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    textAlign: 'center',
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10,
    marginBottom: 10
  },
  root: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  titleContainer: {
    flex: 0.1,
    paddingHorizontal: '2.5%',
    paddingVertical: '2.5%',
  },
  title: {
    color: '#fff',
    fontSize: 25,
  },
  contentContainer: {
    flex: 1,
  },
  meetupCard: {
    width: window.width / 2,
    alignItems: 'center',
    height: imageHeight + 5,
    marginTop: 10,
    borderColor: '#d6d7da'
  },
  meetupCardTopContainer: {
    flex: 1,
    position: 'absolute',
  },
  meetupCardTitle: {
    position: 'relative',
    color: '#0000ff'
  },
  meetupCardBottomContainer: {
    flex: 0.4,
    width: window.width / 2 - 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: '2.5%',

  },
  meetupCardMetaName: {
    fontSize: 15
  },
  meetupCardMetaDate: {
    fontSize: 13
  },
  noneText: {
      textAlign: 'center',
      textAlignVertical: 'center',
      color: 'black',
      fontSize: 16,
      marginTop: 10
  }
});
