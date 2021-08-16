import React from 'react';
import { ToastContainer,Modal,Card,Row,Col,Badge,Spinner,Button,Form,Container,Toast} from 'react-bootstrap';
import { API, graphqlOperation, toast } from 'aws-amplify';
// import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from '../aws-exports';
import { listPosts,listBlogs,listComments,getBlog,getPost,getComment,
    postByDate,commentByDate} from '../graphql/queries';
    import * as mutations from '../graphql/mutations';
import {IoIosClose,IoMdCreate} from "react-icons/io";
import {IoChatbubblesOutline,IoChatbubblesSharp} from "react-icons/io5";

import {WriteComment,WritePost,Comment} from "./component";
Amplify.configure(awsconfig);



function parse(ISOString) {

    const todayObject = new Date();
    const dateObject = new Date(Date.parse(ISOString));
    const timeDiff = todayObject - dateObject;
    
    const minutes = timeDiff/60000;
    const hours = minutes/60;
    const days = minutes/24;
    const options = {year: 'numeric', month: 'long', day: 'numeric' };
    if (minutes<1) {
      return <small>Just Posted <Badge bg="secondary">New</Badge></small>
    }
    else if (minutes < 60) {
      return <small>{Math.round(minutes) + " minutes ago"}</small>
    } else if (hours < 24) {
      return <small>{Math.round(hours) + " hours ago"}</small>
    } else {
    return <small>{dateObject.toLocaleString(undefined,options)}</small>
    }
  }

//Home page displays all the blogs
// Blog Detail page displays all the blog detail
async function createBlog(username,blogName) {
    const blogDetail = {
      id: username,
      name:blogName
    };
    try {
    const newBlog = await API.graphql({
      query: mutations.createBlog,
      variables: {input: blogDetail},
    });
    return newBlog;
    
  } catch(e) {console.log(e)}
  }

//   class WritePost extends React.Component {
//     constructor(props) {
//       super(props);
//       this.onSubmit = this.onSubmit.bind(this);
//       this.onChange = this.onChange.bind(this);
//      this.state={
//         loading:false,
//         text:'',
//       }
//     }
  
//     onChange(event) {
//       this.setState({text: event.target.value});
  
//     };
//     async onSubmit (event) {
//       if (this.state.text === '') {
//         alert("Blank Post");
//         event.preventDefault();
  
//       } else {
        
//         event.preventDefault();
//         this.setState({loading:true})
//         this.props.functionSubmit(this.state.text);
//         this.setState({text:''})
//         this.setState({loading:false})

//       }
//     }
  
    
//     render() {
//       return (
//     <Form onSubmit={this.onSubmit}>
//          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
//       <Form.Label>What do you have in mind?</Form.Label>
//       <Form.Control as="textarea" rows={3} onChange={this.onChange} value={this.state.text} placeholder="Start typing..."/>
//       <br></br>
//       <Button variant="primary" type="submit">
//       {this.state.loading?<Spinner as="span"
//       animation="border"
//       size="sm"
//       role="status"
//       aria-hidden="true"></Spinner>:"Submit"}
//     </Button>
//     </Form.Group>
//         </Form>
//       )
//     }
//   }

//   class Comment extends React.Component {
//     _isMounted = false;
//     constructor(props) {
//         super(props);
//         this.state = {
//             content:'',
//             version :'',
//             createdAt:'',
//         }
//     }
//         componentDidMount () {
//             this._isMounted = true;
//             this.setState({content:this.props.comment.content,version:this.props.comment._version,createdAt:this.props.comment.createdAt});
//         }
//         componentWillUnmount() {
//             this._isMounted = false;
//           }


//         render() {
//             return (
//                 <Toast>
//                 <Toast.Header>
//                   <strong className="me-auto">{this.props.comment.blogID}</strong>
//                   <small className="text-muted">{parse(this.state.createdAt)}</small>
//                 </Toast.Header>
//                 <Toast.Body>{this.state.content}</Toast.Body>
//               </Toast>
//             )
//         }
    
//   }

//   class WriteComment extends React.Component {
//     constructor(props) {
//       super(props);
//       this.onSubmit = this.onSubmit.bind(this);
//       this.onChange = this.onChange.bind(this);
//      this.state={
//         loading:false,
//         text:'',
//         postID:'',
//         postIndex:'',
//       }
//     }
//     componentDidMount () {
//         this.setState({postID:this.props.postID})
//         this.setState({postIndex:this.props.postIndex})

//     }
  
//     onChange(event) {
//       this.setState({text: event.target.value});
  
//     };
//     async onSubmit (event) {
//       if (this.state.text === '') {
//         alert("Blank Comment");
//         event.preventDefault();
  
//       } else {
          
        
//         event.preventDefault();
//         this.setState({loading:true})
//         this.props.functionSubmit(this.state.text,this.state.postID,this.state.postIndex);
//         this.setState({text:''})
//         this.setState({loading:false})

//       }
//     }
  
    
// render() {
//     return (
//   <Form onSubmit={this.onSubmit}>
//        <Form.Group className="mb-3" controlId={"exampleForm"+this.state.postID}>
//     <Form.Control as="textarea" rows={2} onChange={this.onChange} value={this.state.text} placeholder="Comment"/>
//     <br></br>
//     <Button variant="primary" type="submit">
//     {this.state.loading?<Spinner as="span"
//     animation="border"
//     size="sm"
//     role="status"
//     aria-hidden="true"></Spinner>:"Submit"}
//   </Button>
//   </Form.Group>
//       </Form>
//     )
//   }
// }

 class Blog extends React.Component {
    _isMounted = false;

constructor(props) {
    super(props)
    this.state={
        loadingPosts:false,
       blog:'',
       posts:[],
       blogName:'',
       editBlogName:false,
       version:'',
       showModal:false,
       currItem:'',
       creatingPost:false,
       nouser:false,

    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleComment = this.handleComment.bind(this);
    this.handleEditBlogName = this.handleEditBlogName.bind(this);
    this.handleEditButton = this.handleEditButton.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleDeleteComment = this.handleDeleteComment.bind(this);
    

}
componentDidMount () {
    this._isMounted = true;
    //get all the blogs and store into the blogs array
    this.getBlog();

}
componentWillUnmount() {
    this._isMounted = false;
  }


getBlog = async() => {
    this.setState({loadingPosts:true});
    const username = await this.props.username;
    
    try {
        const blog = await API.graphql(graphqlOperation(getBlog, { id:username }));
     const blogItem = blog.data.getBlog;
          this.setState({blog:blogItem});

          if (blogItem==null) {

            //create a new blog
            const blogItem = await createBlog(username,username+"'s Blog")
           } 
             this.setState({blogName:blogItem.name});
            //  this.setState({version:blogItem._version})
            const {data:{postByDate:{items:itemsPage1,nextToken,startedAt}}} = await API.graphql(graphqlOperation(postByDate, { blogID:username,limit:10,sortDirection:"DESC"}));
           const items = itemsPage1.filter(function(obj) {
            return obj._deleted!=true
           })
           this.setState({version:blogItem._version});

           for (let i = 0; i < items.length; i++) { 
            const comments = await this.fetchComments(items[i].id);
            items[i] = {...items[i],comments:comments,showComment:false};
           }
           this.setState({posts:items});


    } catch(e) {
        console.log(e);
        this.setState({nouser:true});
    }
    this.setState({loadingPosts:false});
    
}

fetchComments = async(postID) => {

    const {data:{commentByDate:{items:itemsPage1,nextToken,startedAt}}} = await API.graphql(graphqlOperation(commentByDate, { postID:postID,sortDirection:"DESC"}));
    const filteredComments = itemsPage1.filter(function(obj) {
        return obj._deleted!=true
    }) 
    return filteredComments;




   }

changeBlogName = async(username,newName) => {
    const blogDetail = {
      id: username,
      name:newName,
      _version:this.state.version,
    };
    try {
      const updatedBlog = await API.graphql(graphqlOperation({ query: mutations.updateBlog, variables: {input: blogDetail}}));
    } catch(e) {
      console.log(e);
    }

  }
handleEditBlogName = async(event) => {
    this.setState({blogName:event.target.value});
   }
   handleEditButton = async(event) => {
     if (this.state.editBlogName) {

      this.setState({editBlogName:false});
      //mutation
      this.changeBlogName(this.state.blog.id,this.state.blogName);

    } else if (!this.state.editBlogName) {
      this.setState({editBlogName:true})

    }

   }
   handleDelete = async(item) => {
    //delete from file
    //remove from posts
    const id = item.id;
    const version = item._version;
    const postDetail = {
      id: id,
      _version:version
    };
    const newPosts = this.state.posts.filter(function( obj ) {
      return obj.id !== id;
    });
      
  this.setState({posts:newPosts});

  try {
   //const post = await API.graphql({query:queries.getPost,variables:postDetail})
  const deletePost = await API.graphql(graphqlOperation(mutations.deletePost, {input:postDetail}));
  } catch(e) {console.log(e)}
  if (this.state.showModal) {
      this.handleClose();
  }


 }
 handleClose = ()=> {
this.setState({showModal:false});
 }

 handleShow = (item) => {
     this.setState({currItem:item});
this.setState({showModal:true});
 }

 async handleSubmit (val) {
    this.setState({creatingPost:true})

    this.createPost(this.state.blog.id,val);
    this.setState({creatingPost:false})

  }
  async createPost(blogID,postTitle) {
    const postDetail = {
      blogID: blogID,
      title:postTitle,
      
    }
    try {
    const newPost = await API.graphql({
      query: mutations.createPost,
      variables: {input: postDetail},
    });
    const post = newPost.data.createPost;
    const post2 = {...post,comments:[],showComment:false}
    this.state.posts.unshift(post2);

    this.setState({posts:this.state.posts});
  } catch(e) {console.log(e)}


  }
  handleToggleComment (item,index) {

    var newItem = this.state.posts[index]
    newItem.showComment = !newItem.showComment;
    this.state.posts[index] = newItem;
    this.setState({posts:this.state.posts});

  }
  async handleDeleteComment(comment,postIndex) {
      const commentDetail = {
          id:comment.id,
          _version:comment._version,
      }
      try {
        const deletedComment = await API.graphql({ query: mutations.deleteComment, variables: {input: commentDetail}});
        this.state.posts[postIndex].comments = this.state.posts[postIndex].comments.filter(
            c=>c.id!=comment.id
        )
        this.setState({posts:this.state.posts});



      } catch(e) {console.log(e)}


  }
  async handleComment (comment,postID,postIndex) {
      this.createComment(comment,postID,postIndex);

  }

  async createComment (comment,postID,postIndex) {

    const commentDetail= {
        postID:postID,
        content:comment,
        blogID:this.state.blog.id,
    };

    try {
        const newComment = await API.graphql(graphqlOperation(mutations.createComment, {input: commentDetail})); // equivalent to above example

        this.state.posts[postIndex].comments.push(newComment.data.createComment);
        this.setState({posts:this.state.posts});
    } catch(e) {
        console.log(e)
    } 
  }


    render() {
        if(this.state.nouser===true) {
            return (<Container>
                <h1>Log in to see your blog</h1>
            </Container>)
        }
        if (this.state.loadingPosts) {
return(
    <Container>


                <Form>
  <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">

    <Col sm>
      <Form.Control size="lg" style={{fontWeight:'bold',fontSize:20,}} 
      plaintext={!this.state.editBlogName} 
      onChange={this.handleEditBlogName} 
      readOnly={!this.state.editBlogName} 
      value={this.state.blogName} />
      
    </Col>
    <Col sm>
    <Button variant="link" onClick={this.handleEditButton}>{this.state.editBlogName?"Done":<IoMdCreate/>}</Button> 
    </Col>
  </Form.Group>
      </Form>
      <WritePost functionSubmit={this.handleSubmit}></WritePost>
      <Container className="text-center" style={{height:100}}>
      <Spinner animation="border" style={{alignSelf:"center"}}></Spinner>

      </Container>
      </Container>
)

        }
        return (

            <Container>


                <Form>
  <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">

    <Col sm>
      <Form.Control size="lg" style={{fontWeight:'bold',fontSize:20,}} 
      plaintext={!this.state.editBlogName} 
      onChange={this.handleEditBlogName} 
      readOnly={!this.state.editBlogName} 
      value={this.state.blogName} />
      
    </Col>
    <Col sm>
    <Button variant="link" onClick={this.handleEditButton}>{this.state.editBlogName?"Done":<IoMdCreate/>}</Button> 
    </Col>
  </Form.Group>
      </Form>

      <WritePost functionSubmit={this.handleSubmit}></WritePost>
<Container style={!this.state.loadingPosts?{}:{display:'none'}}>
{this.state.posts.length!=0?this.state.posts.map((item,index)=> {
          
          return (
            <div key={index}>
            <Card >
  <Card.Header className="text-end"><Button onClick={()=>this.handleShow(item)} size='sm' variant="light"><IoIosClose/></Button></Card.Header>
  <Card.Body>
    <Card.Text>
    {item.title}    </Card.Text>
   
    <Button variant="light" bg="light" onClick={()=>this.handleToggleComment(item,index)}> {item.showComment?<IoChatbubblesOutline/>:<IoChatbubblesSharp/>}  {item.comments.length}
 
</Button>

<Container style={item.showComment?{}:{display:'none'}}>
<ToastContainer>
<br></br>
    {item.comments.map((comment,i)=> {
        return(<Comment key={i} comment={comment} postOwner={item.blogID} username={this.state.blog.id}
        postIndex={index} handleDeleteComment={this.handleDeleteComment}></Comment>)
    })}
        </ToastContainer>

        <br></br>
        <WriteComment functionSubmit={this.handleComment} postID={item.id} postIndex={index}></WriteComment>

  </Container>


  </Card.Body>
  <Card.Footer className="text-muted">{parse(item.createdAt)}</Card.Footer>
</Card>

<br>

</br>
<Modal show={this.state.showModal} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to delete this post?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={()=>this.handleDelete(this.state.currItem)}>
           Delete
          </Button>
        </Modal.Footer>
      </Modal>
</div>
        )
          }):<p></p>}
</Container>
  
          </Container>)
    }
    


}
export default Blog;
