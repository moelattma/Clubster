//import CheckBox from 'react-native-checkbox-green';

import React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux'
import axios from 'axios';
import io from "socket.io-client";
import { GiftedChat } from 'react-native-gifted-chat';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header } from 'react-native-elements';

class ChannelChat extends React.Component {
    constructor(props) {
      super(props);
      const channelID = props.navigation.getParam('_id', null);
      const channelName = props.navigation.getParam('name', null);
      this.state = {
        chatMessage: '',
        messages: [],
        userId: '',
        channelID,
        channelName
      };
    }

    componentDidMount() {
      this.socket = io('https://clubster-backend.herokuapp.com/', { query:  `groupId=${this.props._id}` });
      this.socket.on('output', data => {
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, data)
        }));
      });
      axios.get(`https://clubster-backend.herokuapp.com/api/channels/${this.props._id}`).then((response) => {
        this.setState({ messages: response.data.conversation.messages.reverse() });
        this.setState({ userId: response.data.userId });
      }).catch((err) => console.log(err));
    }

    submitChatMessage(messages = []) {
      var text = messages[messages.length - 1].text;
      axios.post(`http://localhost:3000/api/messages/${this.state.channelID}`, {
        text: text
      }).then((message) => {
        console.log(message);
        this.socket.emit("input", messages[0]);
      }).catch((err) => console.log(err));
    }


    render() {
      return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container} scrollEnabled={true} enableOnAndroid={true}>
          <GiftedChat
            messages={this.state.messages}
            onSend={messages => this.submitChatMessage(messages)}
            user={{
              _id: this.state.userId,
            }}
          />
        </KeyboardAwareScrollView>
      );
  }
}


const mapStateToProps = (state) => {
    return {
        isAdmin: state.clubs.club.isAdmin,
        clubID: state.clubs.club._id
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, null)(ChannelChat);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
});
