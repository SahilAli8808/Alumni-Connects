import React, { Component } from 'react';
import { connect } from 'react-redux';
import { base_url } from '../../Endpoint/endpoint';
import { notifyError_with_msg } from '../Utils/Message';
import { ChatFeed } from 'react-chat-ui';
import Spinner from 'react-bootstrap/Spinner';
import loadChat, { pushToChat, pushUserChat } from './Utils/data';
import io from 'socket.io-client';
import './Style/toStyleChat.css';

const ENDPOINT = base_url;

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: false,
      msgData: null,
      messages: [],
      message: ''
    };
  }

  async componentDidMount() {
    const { computedMatch, token, user } = this.props;
    const chatRoomId = computedMatch.params.id;
    const requestOptions = {
      method: 'GET',
      headers: { 'x-auth': token }
    };

    try {
      const response = await fetch(`${ENDPOINT}/${user}/chatrooms/${chatRoomId}`, requestOptions);
      const json = await response.json();

      if (!response.ok) {
        this.setState({ error: true });
        notifyError_with_msg(json.err);
        return;
      }

      this.setState({ msgData: json, loading: false });
      this.loadMessage();
    } catch (error) {
      console.error('Fetch Chat Data Error:', error);
      this.setState({ error: true });
      notifyError_with_msg('Unable To Fetch Chat Data');
    }
  }

  loadMessage = () => {
    if (!this.state.loading) {
      const { token } = this.props;
      const chatRoomId = this.props.computedMatch.params.id;

      const messages = loadChat(this.state.msgData);
      this.setState({ messages });

      this.socket = io(ENDPOINT);
      this.socket.emit('join', { chatRoomId, token }, (error) => {
        if (error) {
          notifyError_with_msg('Unable to connect to socket');
        }
      });

      this.socket.on('messageToGroup', (message) => {
        const newMsg = pushToChat(message);
        this.setState((prevState) => ({
          messages: [...prevState.messages, newMsg]
        }));
      });
    }
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket.off();
    }
  }

  setMessage = (event) => {
    this.setState({ message: event.target.value });
  }

  sendMessage = (event) => {
    event.preventDefault();
    const { message } = this.state;

    if (message) {
      this.socket.emit('messageToGroup', { message }, (error) => {
        if (error) {
          notifyError_with_msg('Unable To Emit From Socket');
        }
      });

      const userMsg = pushUserChat(message);
      this.setState((prevState) => ({
        messages: [...prevState.messages, userMsg],
        message: ''
      }));
    }
  }

  render() {
    const { loading, error, messages, message } = this.state;

    if (loading) {
      return (
        <div id="Loading-id">
          {!error ? (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : null}
        </div>
      );
    }

    return (
      <div className="chatroom-container">
        <div className="chatroom">
          <h2 className="chatroom-title">Chatroom</h2>
          <div className="chat-feed-container">
            <ChatFeed
              messages={messages}
              showSenderName
              bubblesCentered={false}
              bubbleStyles={{
                text: { fontSize: 14 },
                chatbubble: { borderRadius: 8, padding: 8, marginBottom: 4 }
              }}
            />
          </div>
          <div className="input-group mt-3">
            <input
              type="text"
              className="form-control chat-input"
              placeholder="Type a message..."
              value={message}
              onChange={this.setMessage}
            />
            <div className="input-group-append">
              <button
                className="btn btn-primary send-button"
                type="button"
                onClick={this.sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.Auth_token,
  user: state.Auth_user
});

export default connect(mapStateToProps)(ChatRoom);
