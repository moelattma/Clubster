import React, { PureComponent } from 'react';
import { FlatList, TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import { SearchBar, Header } from 'react-native-elements';
import _ from 'lodash';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios';
import { ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
import { DefaultImg } from '../Utils/Defaults';
import { connect } from 'react-redux'
import Modal from 'react-native-modal';
import CheckBox from 'react-native-check-box'
import OptimizedFlatlist from 'react-native-optimized-flatlist';
//import CheckBox from 'react-native-checkbox-green';
export class ChannelChat extends PureComponent {
    constructor(props) {
        super(props);
        const channelID = props.navigation.getParam('_id', null);
        const channelName = props.navigation.getParam('name', null);

        this.state = {
          channelID, channelName,
          members: [],
          membersClicked: ['5c89550035a0e442480aac1e'],
          displayMembers: true,
          isChecked: true,
          updateMembers: Math.random()
        }
    }

    async componentDidMount() {
      // const allChannels = [];
      // axios.get(`http://localhost:3000/api/channels/${this.props.clubID}`).then((response) {
      //   allChannels = response.data.channelsMember.concat(response.data.channelsAdmin);
      //   this.setState({ channels: allowsEditing });
      // })
      return;
    }

    _renderItem = (item) => {
      let url = 'https://s3.amazonaws.com/clubster-123/' + item.item.member.image;
      return (
          <ListItem>
              <Left>
                  <Thumbnail source={{ uri: url }} />
              </Left>
              <Body>
                  <Text>{item.item.member.name}</Text>
              </Body>
              <Right>
                <CheckBox
                  style={{flex: 1, padding: 10}}
                  onClick={() => this.markCandidate(item)}
                  isChecked={this.state.membersClicked.includes(item.item._id)}
                  leftText={"CheckBox"}
                />
              </Right>
          </ListItem>
      );
    }

    render() {
        return (
            <View>
              <Text>{this.state.channelName}</Text>
              <Modal isVisible={false} style={styles.modalStyle}>
                <View>
                  <FlatList
                    data={this.state.members}
                    renderItem={this._renderItem}
                    keyExtractor={member => member._id}
                    extraData={this.state.updateMembers}
                  />
                </View>
              </Modal>
            </View>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

const mapStateToProps = (state) => {
    return {
      clubID: state.clubs.club._id
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelChat);


const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#D6D6D6',
        backgroundColor: '#03A9F4'
    },
    modalStyle: {
        backgroundColor: 'white',
        padding: 4,
        marginTop: 50,
        marginRight: 20,
        marginBottom: 30,
        marginLeft: 20,
        borderRadius: 6
    },
});
