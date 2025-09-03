from pprint import pprint

from helix.client import Client

# connect to client
client = Client(local=True, port=6969)

# creating 3 users

alice_node = client.query("createUser",
                          {"name": "Alice",
                           "age": 25,
                           "email": "alice@example.com"})

bob_node = client.query("createUser",
                        {"name": "Bob",
                         "age": 30,
                         "email": "bob@example.com"})

charlie_node = client.query("createUser",
                            {"name": "Charlie",
                             "age": 28,
                             "email": "charlie@example.com"})

alice_id = alice_node[0]['user']['id']
bob_id = bob_node[0]['user']['id']
charlie_id = charlie_node[0]['user']['id']

# creating follow relationships
# alice follows bob
client.query("createFollow",
             {"follower_id": alice_id,
              "followed_id": bob_id})

# bob follows charlie
client.query("createFollow",
             {"follower_id": bob_id,
              "followed_id": charlie_id})

# charlie follows alice
client.query("createFollow",
             {"follower_id": charlie_id,
              "followed_id": alice_id})

# creating posts
alice_post = client.query("createPost",
                          {"user_id": alice_id,
                           "content": "Hello world! My first post on HelixDB"})

bob_post = client.query("createPost",
                        {"user_id": bob_id,
                         "content": "Loving the graph database capabilities"})

charlie_post = client.query("createPost",
                            {"user_id": charlie_id,
                             "content": "Building cool social networks with Helix"})

# creating post embeddings with dummy vectors
alice_post_id = alice_post[0]['post']['id']
bob_post_id = bob_post[0]['post']['id']
charlie_post_id = charlie_post[0]['post']['id']

client.query("createPostEmbedding",
             {"post_id": alice_post_id,
              "vector": [0.1, 0.2, 0.3, 0.4, 0.5],
              "content": "Hello world! My first post on HelixDB"})

client.query("createPostEmbedding",
             {"post_id": bob_post_id,
              "vector": [0.2, 0.3, 0.4, 0.5, 0.6],
              "content": "Loving the graph database capabilities"})

client.query("createPostEmbedding",
             {"post_id": charlie_post_id,
              "vector": [0.3, 0.4, 0.5, 0.6, 0.7],
              "content": "Building cool social networks with Helix"})

# querying and displaying the data
print("All Users:")
pprint(client.query("getUsers", {}))

print("\nAll Posts:")
pprint(client.query("getPosts", {}))

print("\nAlice's Posts:")
pprint(client.query("getPostsByUser", {"user_id": alice_id}))

print("\nWho Alice is Following:")
pprint(client.query("getFollowing", {"user_id": alice_id}))

print("\nBob's Followers:")
pprint(client.query("getFollowers", {"user_id": bob_id}))

print("\nSearching for posts similar to Alice's embedding [0.1, 0.2, 0.3, 0.4, 0.5]:")
pprint(client.query("searchPostEmbeddings", {"vector": [0.1, 0.2, 0.3, 0.4, 0.5], "k": 1}))