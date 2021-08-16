import React from "react";
import {Form, Button,Spinner} from "react-bootstrap";

class WriteComment extends React.Component {
    constructor(props) {
      super(props);
      this.onSubmit = this.onSubmit.bind(this);
      this.onChange = this.onChange.bind(this);
     this.state={
        loading:false,
        text:'',
        postID:'',
        postIndex:'',
      }
    }
    componentDidMount () {
        this.setState({postID:this.props.postID})
        this.setState({postIndex:this.props.postIndex})

    }
  
    onChange(event) {
      this.setState({text: event.target.value});
  
    };
    async onSubmit (event) {
      if (this.state.text === '') {
        alert("Blank Comment");
        event.preventDefault();
  
      } else {
          
        
        event.preventDefault();
        this.setState({loading:true})
        this.props.functionSubmit(this.state.text,this.state.postID,this.state.postIndex);
        this.setState({text:''})
        this.setState({loading:false})

      }
    }
  
    
    render() {
      return (
    <Form onSubmit={this.onSubmit}>
         <Form.Group className="mb-3" controlId={"exampleForm"+this.state.postID}>
      <Form.Control as="textarea" rows={2} onChange={this.onChange} value={this.state.text} placeholder="Comment"/>
      <br></br>
      <Button variant="primary" type="submit">
      {this.state.loading?<Spinner as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"></Spinner>:"Submit"}
    </Button>
    </Form.Group>
        </Form>
      )
    }
  }

  export default WriteComment;
  