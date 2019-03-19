import React, { Component } from 'react';
import { TextInput,TouchableOpacity, StyleSheet, Text, View, FlatList, ScrollView, Image } from 'react-native';
import axios from 'axios';
import converter from 'base64-arraybuffer';
import io from "socket.io-client";
import { GiftedChat } from 'react-native-gifted-chat';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class Chat extends Component {
    constructor(props) {
      super(props);
      this.state = {
        chatMessage: '',
        messages: [],
        userId: ''
      };
    }

    componentDidMount() {
      const { screenProps } = this.props;
      this.socket = io('http://localhost:3000/', { query:  `groupId=${screenProps._id}` });
      this.socket.on('output', data => {
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, data)
        }));
      });
      axios.get(`http://localhost:3000/api/conversations/${screenProps._id}`).then((response) => {
        this.setState({ messages: response.data.conversation.messages.reverse() });
        this.setState({ userId: response.data.userId });
      }).catch((err) => console.log(err));
    }

    onSend(messages = []) {
      const { screenProps } = this.props;
      var text = messages[messages.length - 1].text;

      axios.post(`http://localhost:3000/api/messages/${screenProps._id}`, {
        text: text
      }).then((message) => {
        this.socket.emit('input', text);
      }).catch((err) => console.log(err));
    }

    submitChatMessage(messages = []) {
      const { screenProps } = this.props;
      var text = messages[messages.length - 1].text;
      axios.post(`http://localhost:3000/api/messages/${screenProps._id}`, {
        text: text
      }).then((message) => {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
});
