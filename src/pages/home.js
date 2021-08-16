import React from 'react';
import {useState} from "react";
import { Dropdown,FormControl,ToastContainer,Modal,Card,Row,Col,Badge,Spinner,Button,Form,Container,Toast} from 'react-bootstrap';
import { API, graphqlOperation, toast } from 'aws-amplify';
// import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from '../aws-exports';
import { listPosts,listBlogs,listComments,getBlog,getPost,getComment,
    postByDate,commentByDate} from '../graphql/queries';
    import * as mutations from '../graphql/mutations';
import {IoCheckmarkSharp,IoChatbubblesOutline,IoChatbubblesSharp} from "react-icons/io5";
import {WriteComment,WritePost,Comment} from "./component";
import { EndEvent } from '@aws-sdk/client-s3';

Amplify.configure(awsconfig);

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      &#x25bc;
    </a>
  ));
  
  // forwardRef again here!
  // Dropdown needs access to the DOM of the Menu to measure it
  const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
      const [value, setValue] = useState('');
  
      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <FormControl
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="Type to filter..."
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
              (child) =>
                !value || child.props.children.toLowerCase().startsWith(value),
            )}
          </ul>
        </div>
      );
    },
  );

  
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

  
 



 class Home extends React.Component {
    _isMounted = false;

constructor(props) {
    super(props)
    this.state={
        signedOut:false,
        loadingBlogs:false,
        username:'',
       posts:[],
       blogs:[],
       blogName:'',
       showModal:false,
       currItem:'',
       filtered:false,
       nouser:false,

    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleComment = this.handleComment.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleDeleteComment = this.handleDeleteComment.bind(this);


}

handleFilter (eventKey,event) {
    const key = event.target.innerHTML;
    const posts = this.state.posts.map((post,i) => {
        if (post.blogID === key) {
            post.show=!post.show;
        }
        return post
    })
    this.state.blogs[eventKey].show = !this.state.blogs[eventKey].show
    this.setState({blogs:this.state.blogs});
    this.setState({posts:posts});
    
}

handleCancelFilter(event) {

    // console.log("Unselect");
}
componentDidMount () {
    this._isMounted = true;
    this.setState({username:this.props.username})
    //get all the blogs and store into the blogs array
    this.getBlogs();
    

}
componentWillUnmount() {
    this._isMounted = false;
  }


getBlogs = async() => {
    this.setState({loadingBlogs:true})
    try {
        const allPosts = await API.graphql({ query: listPosts });
        const allBlogs = await API.graphql({query:listBlogs});
           const filteredPosts = allPosts.data.listPosts.items.filter(function(obj) {
            return obj._deleted!=true
           })
           const filteredBlogs = allBlogs.data.listBlogs.items.filter(function(obj) {
               return obj._deleted!=true
           }) ;
           const blogs = filteredBlogs.map((item,i)=> {
               return {...item,show:true}
           })

           this.setState({blogs:blogs});
 
           
           for (let i = 0; i < filteredPosts.length; i++) { 
            const comments = await this.fetchComments(filteredPosts[i].id);
            filteredPosts[i] = {...filteredPosts[i],comments:comments,showComment:false,show:true};
           }
           this.setState({posts:filteredPosts});


    } catch(e) {console.log(e);
    this.setState({nouser:true})}
    this.setState({loadingBlogs:false})

    
}

fetchComments = async(postID) => {

    const {data:{commentByDate:{items:itemsPage1,nextToken,startedAt}}} = await API.graphql(graphqlOperation(commentByDate, { postID:postID,sortDirection:"DESC"}));
    const filteredComments = itemsPage1.filter(function(obj) {
        return obj._deleted!=true
    }) 
    return filteredComments;




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
  const deletePost = await API.graphql({ query: mutations.deletePost, variables: {input: postDetail}});
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
    this.createPost(this.state.blog.id,val);

  }
  async createPost(blogID,postTitle) {
    this.setState({loading:true})
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
  this.setState({loading:false})


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

    this.setState({loading:true});
    const commentDetail= {
        postID:postID,
        content:comment,
        blogID:this.state.username
    };

    try {
        const newComment = await API.graphql(graphqlOperation(mutations.createComment, {input: commentDetail})); // equivalent to above example

        this.state.posts[postIndex].comments.push(newComment.data.createComment);
        this.setState({posts:this.state.posts});
    } catch(e) {
        console.log(e)
    } this.setState({loading:false});
  }


    render() {
        if (this.state.nouser) {
            return (<Container>
                <h1>Log in to see all the blogs</h1>
            </Container>)
        }
        if (this.state.loadingBlogs) {
            return(
                <Container className="text-center" style={{height:100,alignItems:"center",jutifyContent:"center"}}>
                    <br></br>
      <Spinner animation="border" style={{alignSelf:"center"}}></Spinner>

      </Container>
            )
        }

        return (

            <Container>
                <br></br>
                <Dropdown>
    <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
        Filter By Blog
    </Dropdown.Toggle>

    <Dropdown.Menu as={CustomMenu}>
      {this.state.blogs.map(
          (blog,index) => {
              return (
                  <Dropdown.Item eventKey={index}
                  active={blog.show}
                   key={blog.id} onSelect={(eventKey,event)=>this.handleFilter(eventKey,event)}>
                      {blog.id}
                  </Dropdown.Item>
              )}
      )
    }
    </Dropdown.Menu>
  </Dropdown>
  <br></br>
        {this.state.posts.length!=0?this.state.posts.map((item,index)=> {
          if (!item.show) {
              return(<div key={index}></div>)
          }
          return (
            <div key={index}>
            <Card >
  <Card.Header className="text-start">{item.blogID}</Card.Header>
  <Card.Body>
    <Card.Text>
    {item.title}    </Card.Text>
   
    <Button variant="light" bg="light" onClick={()=>this.handleToggleComment(item,index)}>
        {item.showComment?<IoChatbubblesOutline/>:<IoChatbubblesSharp/>} {item.comments.length}
 
</Button>

<Container style={item.showComment?{}:{display:'none'}}>
<ToastContainer>
<br></br>
    {item.comments.map((comment,i)=> {
        return(<Comment postIndex = {index} handleDeleteComment={this.handleDeleteComment}
            key={i} comment={comment} postOwner={item.blogID} username={this.state.username}></Comment>)
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
</div>
        )
          }):<p></p>}
          </Container>)
    }
    


}
export default Home;
