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
      this.socket = io(`http://localhost:3000/?id=' + ${screenProps._id}`);
      this.socket.on('output', function(data) {
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages)
        }));
      });
      axios.get(`http://localhost:3000/api/conversations/${screenProps._id}`).then((response) => {
        console.log('Hiiii' + response.data);
        this.setState({ messages: response.data.conversation.messages });
        this.setState({ userId: response.data.userId });
        console.log(this.state.userId);
      }).catch((err) => console.log(err));
    }

    onSend(messages = []) {
      const { screenProps } = this.props;
      console.log(screenProps);
      var text = messages[messages.length - 1].text;

      axios.post(`http://localhost:3000/api/messages/${screenProps._id}`, {
        text: text
      }).then((message) => {
        console.log(message.data.message);
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages)
        }))
      }).catch((err) => console.log(err));
    }

    submitChatMessage(messages = []) {
      const { screenProps } = this.props;
      console.log(screenProps);
      var text = messages[messages.length - 1].text;
      axios.post(`http://localhost:3000/api/messages/${screenProps._id}`, {
        text: text
      }).then((message) => {
        this.socket.emit("input", messages[0]);
        console.log(this.state.messages);
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
