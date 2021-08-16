import React from "react";
import {Toast,Badge,Spinner} from "react-bootstrap";

function parse(ISOString) {

    const todayObject = new Date();
    const dateObject = new Date(Date.parse(ISOString));
    const timeDiff = todayObject - dateObject;
    
    const minutes = timeDiff/60000;
    const hours = minutes/60;
    const days = minutes/24;
    if (minutes<1) {
      return <small>Just Posted <Badge bg="secondary">New</Badge></small>
    }
    else if (minutes < 60) {
      return <small>{Math.round(minutes) + " minutes ago"}</small>
    } else if (hours < 24) {
      return <small>{Math.round(hours) + " hours ago"}</small>
    } else {
    return <small>{dateObject.toLocaleString()}</small>
    }
  }


class Comment extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            content:'',
            version :'',
            createdAt:'',
            postOwner:'',
            commentOwner:'',
            username:'',
        }
        this.deleteComment = this.deleteComment.bind(this)
    }
        componentDidMount () {
            this._isMounted = true;
            this.setState({content:this.props.comment.content,version:this.props.comment._version,
                createdAt:this.props.comment.createdAt,
                commentOwner:this.props.comment.blogID,postOwner:this.props.postOwner,
                username:this.props.username

            });
        }
        componentWillUnmount() {
            this._isMounted = false;
          }


          deleteComment (event) {
              event.preventDefault();
            this.props.handleDeleteComment(this.props.comment,this.props.postIndex);

          }
          //need to add handleDeleteComment to props
          //need to add postIndex
        render() {
            return (
                <Toast onClose={this.deleteComment} >
                <Toast.Header closeButton={this.state.username===this.state.postOwner || this.state.username===this.state.commentOwner}>
                  <strong className="me-auto">{this.props.comment.blogID}</strong>
                  <small className="text-muted">{parse(this.state.createdAt)}</small>
                </Toast.Header>
                <Toast.Body>{this.state.content}</Toast.Body>
              </Toast>
            )
        }
    
  }

  export default Comment;