import React from "react";
import {Form,Button,Spinner} from "react-bootstrap";


class WritePost extends React.Component {
    constructor(props) {
      super(props);
      this.onSubmit = this.onSubmit.bind(this);
      this.onChange = this.onChange.bind(this);
     this.state={
        loading:false,
        text:'',
      }
    }
  
    onChange(event) {
      this.setState({text: event.target.value});
  
    };
    async onSubmit (event) {
      if (this.state.text === '') {
        alert("Blank Post");
        event.preventDefault();
  
      } else {
        
        event.preventDefault();
        this.setState({loading:true})
        this.props.functionSubmit(this.state.text);
        this.setState({text:''})
        this.setState({loading:false})

      }
    }
  
    
    render() {
      return (
    <Form onSubmit={this.onSubmit}>
         <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
      <Form.Label>What do you have in mind?</Form.Label>
      <Form.Control as="textarea" rows={3} onChange={this.onChange} value={this.state.text} placeholder="Start typing..."/>
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

  export default WritePost;