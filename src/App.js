import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';

import { Row,Col,Badge,Spinner,Button,Form,Container,Toast} from 'react-bootstrap';
// import { DataStore } from 'aws-amplify';
import { listPosts,listBlogs,listComments,getBlog,getPost,getComment,
postByDate,commentByDate} from './graphql/queries';
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import * as subscriptions from './graphql/subscriptions';
import 'bootstrap/dist/css/bootstrap.min.css'
import { IoIosChatbubbles } from "react-icons/io";
import { Home,SignUpComponent,Navigation,Footer, Blog} from './pages';
import { Switch, Route } from 'react-router-dom';

// import gql from 'graphql-tag';
// import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
Amplify.configure(awsconfig);



// const client = new AWSAppSyncClient({
//   url: awsconfig.aws_appsync_graphqlEndpoint,
//   region: awsconfig.aws_appsync_region,
//   auth: {
//     type: AUTH_TYPE.API_KEY, // or type: awsconfig.aws_appsync_authenticationType,
//     apiKey: awsconfig.aws_appsync_apiKey,
//   }
// });


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





class WritePost extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = this.state={
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
      this.props.functionSubmit(this.state.text);
    }
  }

  
  render() {
    return (
  <Form onSubmit={this.onSubmit}>
       <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
    <Form.Label>What do you have in mind?</Form.Label>
    <Form.Control as="textarea" rows={3} onChange={this.onChange} placeholder="Start typing..."/>
    <br></br>
    <Button variant="primary" type="submit">
    Submit
  </Button>
  </Form.Group>
      </Form>
    )
  }
}

class App extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEditButton = this.handleEditButton.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.signOut = this.signOut.bind(this);
    this.state = this.state={
      loadingNewPost:false,
      loading:false,
      username:'',
      email:'',
      phone:'',
      posts:[],
      blogName:'',
      version:null,
      editBlogName:false,
    loggedIn:true}
  }


  async handleSubmit (val) {
    this.createPost(this.state.username,val);

  }
  async createPost(blogID,postTitle) {
    this.setState({loadingNewPost:true})

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
    const post2 = {...post,comments:[]}
    await this.state.posts.unshift(post2);
    this.setState({posts:this.state.posts});
  } catch(e) {console.log(e)}
  this.setState({loadingNewPost:false})


  }
  

  
  async componentDidMount () {
    this._isMounted = true;

    try {
      this.setState({loading:true});
    const userinfo = await Auth.currentUserInfo();
    await this.setState({username:userinfo.username,email:userinfo.attributes.email,phone:userinfo.attributes.phone_number});

    await this.checkBlog(userinfo.username);
    this.setState({loading:false});

    } catch(e) {

      console.log(e);
    } 
    }

    changeBlogName = async(username,newName) => {
      const blogDetail = {
        id: username,
        name:newName,
        _version:this.state.version,
      };
      console.log(newName);
      try {
        const updatedBlog = await API.graphql({ query: mutations.updateBlog, variables: {input: blogDetail}});
        console.log(updatedBlog);
      } catch(e) {
        console.log(e);
      }

    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    checkBlog = async(username) => {

      try {
        //fetchBlog
       const blog = await API.graphql(graphqlOperation(queries.getBlog, { id:username }));
          //fetchPosts
      const {data:{postByDate:{items:itemsPage1,nextToken,startedAt}}} = await API.graphql(graphqlOperation(queries.postByDate, { blogID:username,limit:10,sortDirection:"DESC"}));
        //fetchComments
       const blogItem = blog.data.getBlog;
       if (blogItem==null) {

        //create a new blog
        const blogItem = await createBlog(username,username+"'s Blog")
       } 
         this.setState({blogName:blogItem.name});
         this.setState({version:blogItem._version})
       const items = itemsPage1.filter(function(obj) {
        return obj._deleted!=true
       })
       for (let i = 0; i < items.length; i++) { 
        const comments = await this.fetchComments(items[i].id);
        items[i] = {...items[i],comments:comments};
      }
       this.setState({posts:items});
      } catch(e) {
        console.log(e);
      }

   
    }



     handleDelete = async(id) => {
        //delete from file
        //remove from posts

        const postDetail = {
          id: id,
          _version:1
        };
        const newPosts = this.state.posts.filter(function( obj ) {
          return obj.id !== id;
        });
          
      this.setState({posts:newPosts});
      this.setState({loadingNewPost:true});

      try {

       //const post = await API.graphql({query:queries.getPost,variables:postDetail})
      const deletePost = await API.graphql({ query: mutations.deletePost, variables: {input: postDetail}});
      } catch(e) {console.log(e)}
      this.setState({loadingNewPost:false});


     }
     fetchComments = async(postID) => {

      const {data:{commentByDate:{items:itemsPage1,nextToken,startedAt}}} = await API.graphql(graphqlOperation(queries.commentByDate, { postID:postID,sortDirection:"DESC"}));
      return itemsPage1;




     }

     handleEdit = async(event) => {
      this.setState({blogName:event.target.value});
     }
     handleEditButton = async(event) => {
       if (this.state.editBlogName) {

        this.setState({editBlogName:false});
        //mutation
        this.changeBlogName(this.state.username,this.state.blogName);

      } else if (!this.state.editBlogName) {
        this.setState({editBlogName:true})

      }

     }

     



     async signOut () {
       console.log("?");
       this.setState({loading:true});
       this.setState({loggedIn:false});
       
      try {
        await Auth.signOut();
    } catch (error) {
        console.log('error signing out: ', error);
    }
    
    this.setState({loading:false});

     }
  render () {

    let e = "Alert!";
    if (this.state.loading||this.state.loadingNewPost) {
      return (
      <div style={styles.container}>
              <Spinner style={styles.center} animation="border" />

      </div>
      
      )
    } 
  return (
    
    <div>
      <Navigation />
      <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' render={(props)=><Home {...props} username={this.state.username}></Home>}></Route>
      <Route exact path='/signup' render={(props)=> <SignUpComponent loggedIn={this.state.loggedIn} {...props} signOutFunction={this.signOut}></SignUpComponent>}></Route>
      <Route exact path="/blog" render={(props)=><Blog {...props} username={this.state.username}></Blog>}></Route>

    </Switch>
      
     <Footer></Footer>
    </div>
  );
}
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {

    position:"absolute",
    alignSelf: 'center',
        justifyContent:"flex-start",
        alignItems: 'center',
        top:"50%",
        left:"50%",
  },
  signoutButton: {
    width:20,
    height:100,
  }
};

export default withAuthenticator(App);