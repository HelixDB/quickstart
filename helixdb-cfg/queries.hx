QUERY createUser(name: String, age: U32, email: String) =>
    user <- AddN<User>({name: name, age: age, email: email})
    RETURN user

QUERY createFollow(follower_id: ID, followed_id: ID) =>
    follower <- N<User>(follower_id)
    followed <- N<User>(followed_id)
    AddE<Follows>::From(follower)::To(followed)
    RETURN "success"

QUERY createPost(user_id: ID, content: String) =>
    user <- N<User>(user_id)
    post <- AddN<Post>({content: content})
    AddE<Created>::From(user)::To(post)
    RETURN post

QUERY getUsers() =>
    users <- N<User>
    RETURN users

QUERY getPosts() =>
    posts <- N<Post>
    RETURN posts

QUERY getPostsByUser(user_id: ID) =>
    posts <- N<User>(user_id)::Out<Created>
    RETURN posts

QUERY getFollowers(user_id: ID) =>
    followers <- N<User>(user_id)::Out<Follows>
    RETURN followers

QUERY getFollowing(user_id: ID) =>
    following <- N<User>(user_id)::In<Follows>
    RETURN following

QUERY getUserPosts(user_id: ID) =>
    posts <- N<User>(user_id)::Out<Created>
    RETURN posts

QUERY createPostEmbedding(post_id: ID, vector: [F64], content: String) =>
    post <- N<Post>(post_id)
    embedding_node <- AddV<Post_Embedding>(vector, {content: content})
    AddE<Post_to_Post_Embedding>::From(post)::To(embedding_node)
    RETURN embedding_node

QUERY searchPostEmbeddings(vector: [F64], k: I64) =>
    embeddings <- SearchV<Post_Embedding>(vector, k)
    posts <- embeddings::In<Post_to_Post_Embedding>
    RETURN posts