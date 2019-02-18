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
        id:'1'
      };
    }

    componentDidMount() {
      this.socket = io(`http://localhost:3000/?id=' + ${this.state.id}`);
      this.socket.on('chat message', msg => {
        this.setState({ messages: [...this.state.messages, msg]});
      });
    }

    submitChatMessage(messages = []) {
      this.socket.emit("chat message", messages[0]);
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }))
    }


    render() {
      return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container} scrollEnabled={true} enableOnAndroid={true}>
          <GiftedChat
            messages={this.state.messages}
            onSend={messages => this.submitChatMessage(messages)}
            user={{
              _id: 1,
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
