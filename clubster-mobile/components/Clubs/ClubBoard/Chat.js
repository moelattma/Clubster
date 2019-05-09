import React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux'
import axios from 'axios';
import io from "socket.io-client";
import { GiftedChat } from 'react-native-gifted-chat';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header } from 'react-native-elements';
import { DefaultImg } from '../../Utils/Defaults';

export class Chat extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        chatMessage: '',
        messages: [],
        userId: ''
      };
    }

    componentDidMount() {
      this.socket = io('https://clubster-backend.herokuapp.com/', { query:  `groupId=${this.props._id}` });
      this.socket.on('output', data => {
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, data)
        }));
      });
      axios.get(`https://clubster-backend.herokuapp.com/api/conversations/${this.props._id}`).then((response) => {
        this.setState({ messages: response.data.conversation.messages.reverse() });
        this.setState({ userId: response.data.userId });
      }).catch((err) => console.log(err));
    }
    
    submitChatMessage(messages = []) {
      var text = messages[messages.length - 1].text;
      axios.post(`https://clubster-backend.herokuapp.com/api/messages/${this.props._id}`, {
        text: text
      }).then((message) => {
        this.socket.emit("input", messages[0]);
      }).catch((err) => console.log(err));
    }


    render() {
      return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container} scrollEnabled={true} enableOnAndroid={true}>
          <Header
            backgroundColor={'transparent'}
            leftComponent={{ icon: 'arrow-back', onPress: () => this.props.navigation.navigate('HomeNavigation') }}
          />
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
  const { name, president, description, image, gallery, members, isAdmin, _id } = state.clubs.club;

  return {
      name: name,
      president: president,
      description: description,
      img: (image ? 'https://s3.amazonaws.com/clubster-123/' + image : DefaultImg), 
      photos: (gallery.photos.length > 5 ? gallery.photos.slice(0, 6) : gallery.photos.concat({ addPhotoIcon: true })),
      members, isAdmin, _id
  }
}

export default connect(mapStateToProps, null)(Chat);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
});
