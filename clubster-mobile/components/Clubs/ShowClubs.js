import React from 'react';
import {
  Image, StyleSheet, Text, TouchableOpacity, View,
  Dimensions, TouchableWithoutFeedback, FlatList, ScrollView,
  RefreshControl
} from 'react-native';
import { connect } from 'react-redux'
import axios from 'axios';
import { AppLoading } from 'expo';
import { Button } from 'native-base';
import { Header } from 'react-native-elements';
import { DefaultImg } from '../Utils/Defaults';
import { CLUBS_SET, CLUBS_SETUSER, EVENTS_SETCLUB, USER_TOGGLECLUBS } from '../../reducers/ActionTypes';

const window = Dimensions.get('window');
const imageWidth = (window.width / 3) + 30;
const imageHeight = window.width / 3;

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const CLUB_WIDTH = WIDTH * 4 / 10;
const CLUB_HEIGHT = HEIGHT / 4;

class ShowClubs extends React.Component {
  navigateUser = async (item) => {
    await axios.get(`http://localhost:3000/api/organizations/getOrg/${item._id}`).then((response) => {
      var club = response.data.org;
      club.isAdmin = this.props.showAdminClubs;
      this.props.setCurrentClub(club);
      this.props.setClubEvents(club.events);
    }).catch(() => { return; });
    var isAdmin = this.props.showAdminClubs;
    this.props.navigation.navigate(isAdmin ? 'AdminNavigation' : 'MemberNavigation', { isAdmin });
  };

  _renderItem = ({ item }) => {
    if (item.empty) {
      return <View style={[styles.eventContainer, { backgroundColor: 'transparent' }]} />;
    }
    return (
      <TouchableWithoutFeedback onPress={() => this.navigateUser(item)}
        style={{ flexDirection: 'row' }}>
        <View style={styles.eventContainer} >
          <Image style={styles.containerImage} source={{ uri: (!item.image || item.image == null ? DefaultImg : 'https://s3.amazonaws.com/clubster-123/' + item.image) }} />
          <View style={{ margin: 10 }}>
            <Text allowFontScaling numberOfLines={1}
              style={styles.eventTitle}> {item.name}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  refreshUserClubs = () => {
    axios.get("http://localhost:3000/api/organizations").then((response) => { 
      const { arrayClubsAdmin, arrayClubsMember } = response.data;
      this.props.setUserClubs(arrayClubsAdmin, arrayClubsMember);
    });
  }

  render() {
    if (this.props.loading)
      return <AppLoading/>
    return (
      <ScrollView refreshControl={<RefreshControl
        refreshing={this.props.loading}
        onRefresh={() => this.refreshUserClubs()}
      />}>
        <Header
          backgroundColor={'transparent'}
          leftComponent={{ icon: 'add', onPress: () => this.props.navigation.navigate('CreateClub') }}
          centerComponent={
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center' }} >
              <Text>     </Text>
              <Button transparent onPress={() => this.props.toggleClubs(true)} >
                <Text style={[{ fontSize: 18, fontWeight: '400' }, this.props.showAdminClubs ? { color: '#59cbbd' } : {}]} >Admin</Text>
              </Button>
              <Text style={{ fontSize: 30, fontWeight: '400' }} >|</Text>
              <Button transparent onPress={() => this.props.toggleClubs(false)}>
                <Text style={[{ fontSize: 18, fontWeight: '400' }, !this.props.showAdminClubs ? { color: '#59cbbd' } : {}]} >Member</Text>
              </Button>
            </View>
          }
          rightComponent={{ icon: 'search', onPress: () => this.props.navigation.navigate('ClubSearch') }}
        />
        {this.props.showAdminClubs ? 
          (!this.props.clubsAdmin || this.props.clubsAdmin.length == 0 ?             
            <Text style={[{ flex: 1 }, styles.noneText ]}>You are not an admin of any clubs</Text>
            : 
            <FlatList
              data={this.props.clubsAdmin}
              renderItem={this._renderItem}
              horizontal={false}
              numColumns={2}
              keyExtractor={club => club._id}
            />
          )
          :
          (!this.props.clubsMember || this.props.clubsMember.length == 0 ?
            <Text style={[{ flex: 1 }, styles.noneText ]}>You are not a member of any clubs</Text>
            : 
            <FlatList
              data={this.props.clubsMember}
              renderItem={this._renderItem}
              horizontal={false}
              numColumns={2}
              keyExtractor={club => club._id}
            />
          )
        }
      </ScrollView>  
    )
  }
}

const mapStateToProps = (state) => {
  if (!state.user.user)
    return { loading: true };
  var clubsAdmin = state.clubs.clubsAdmin.slice(0);
  var clubsMember = state.clubs.clubsMember.slice(0);
  if (clubsAdmin && clubsAdmin != null && clubsAdmin.length % 2 != 0) 
    clubsAdmin.push({ empty: true });
  if (clubsMember && clubsMember != null && clubsMember.length % 2 != 0) 
    clubsMember.push({ empty: true });
  return {
    clubsAdmin, clubsMember,
    loading: false, showAdminClubs: state.user.showAdminClubs
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUserClubs: (clubsAdmin, clubsMember) => dispatch({
      type: CLUBS_SET,
      payload: { clubsAdmin, clubsMember }
    }),
    setCurrentClub: (club) => dispatch({
      type: CLUBS_SETUSER,
      payload: { club }
    }),
    setClubEvents: (events) => dispatch({
      type: EVENTS_SETCLUB,
      payload: { events }
    }),
    toggleClubs: (showAdminClubs) => dispatch({
      type: USER_TOGGLECLUBS,
      payload: { showAdminClubs }
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowClubs);

const styles = StyleSheet.create({
  eventContainer: {
    flex: 1,
    height: CLUB_HEIGHT,
    position: 'relative',
    backgroundColor: '#59cbbd',
    marginBottom: 20,
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
