/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateBlog = /* GraphQL */ `
  subscription OnCreateBlog {
    onCreateBlog {
      id
      name
      posts {
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateBlog = /* GraphQL */ `
  subscription OnUpdateBlog {
    onUpdateBlog {
      id
      name
      posts {
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteBlog = /* GraphQL */ `
  subscription OnDeleteBlog {
    onDeleteBlog {
      id
      name
      posts {
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost {
    onCreatePost {
      id
      title
      blogID
      blog {
        id
        name
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        owner
      }
      createdAt
      comments {
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      updatedAt
      owner
    }
  }
`;
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost {
    onUpdatePost {
      id
      title
      blogID
      blog {
        id
        name
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        owner
      }
      createdAt
      comments {
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      updatedAt
      owner
    }
  }
`;
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost {
    onDeletePost {
      id
      title
      blogID
      blog {
        id
        name
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        owner
      }
      createdAt
      comments {
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
      updatedAt
      owner
    }
  }
`;
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment {
    onCreateComment {
      id
      postID
      post {
        id
        title
        blogID
        createdAt
        _version
        _deleted
        _lastChangedAt
        updatedAt
        owner
      }
      blogID
      blog {
        id
        name
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        owner
      }
      content
      createdAt
      _version
      _deleted
      _lastChangedAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment {
    onUpdateComment {
      id
      postID
      post {
        id
        title
        blogID
        createdAt
        _version
        _deleted
        _lastChangedAt
        updatedAt
        owner
      }
      blogID
      blog {
        id
        name
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        owner
      }
      content
      createdAt
      _version
      _deleted
      _lastChangedAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment {
    onDeleteComment {
      id
      postID
      post {
        id
        title
        blogID
        createdAt
        _version
        _deleted
        _lastChangedAt
        updatedAt
        owner
      }
      blogID
      blog {
        id
        name
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        owner
      }
      content
      createdAt
      _version
      _deleted
      _lastChangedAt
      updatedAt
      owner
    }
  }
`;
