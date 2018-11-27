import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { KeyboardAvoidingView } from 'react-native';
import axios from 'axios';
export default class Chat extends Component {
  state = {
    messages: [],
    userId: String
  }

  componentWillMount() {
    const { screenProps } = this.props;
    console.log(screenProps);
    axios.get(`http://localhost:3000/api/conversations/${screenProps._id}`).then((response) => {
      console.log(response);
      this.setState({ messages: response.data.conversation.messages });
      this.setState({ userId: response.data.userId })
    }).catch((err) => console.log(err));
    // this.setState({
    //   messages: [
    //     {
    //       _id: 1,
    //       text: 'Hello developer',
    //       createdAt: new Date(),
    //       user: {
    //         _id: 2,
    //         name: 'React Native',
    //         avatar: 'https://placeimg.com/140/140/any',
    //       },
    //     },
    //   ],
    // })
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

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: this.state.userId,
        }}
      />
    )
  }
}
