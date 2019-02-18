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
      const { screenProps } = this.props;
      this.socket = io(`http://localhost:3000/?id=' + ${this.state.id}`);
      this.socket.on('chat message', msg => {
        this.setState({ messages: [...this.state.messages, msg]});
      });
      axios.get(`http://localhost:3000/api/conversations/${screenProps._id}`).then((response) => {
        this.setState({ messages: response.data.conversation.messages });
        this.setState({ userId: response.data.userId })
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
        messages: GiftedChat.append(previousState.messages, message.data.message)
      }))
    }).catch((err) => console.log(err));
  }




    componentDidMount() {
      const { _id } = this.props.screenProps;
      axios.get(`http://localhost:3000/api/conversations/${_id}`).then((messages) => {
        this.setState({messages});
      })

    }

    submitChatMessage(messages = []) {
      const { screenProps } = this.props;
      console.log(screenProps);
      var text = messages[messages.length - 1].text;
      axios.post(`http://localhost:3000/api/messages/${screenProps._id}`, {
        text: text
      }).then((message) => {
        this.socket.emit("chat message", messages[0]);
        console.log(message.data.message);
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, message.data.message)
        }))
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
