from fastapi import FastAPI, Request
from helix.client import Client

app = FastAPI(
    title="Social Network API",
    description="API for a social network using HelixDB",
    version="1.0.0",
)

client = Client(local=True, port=6969)

@app.post("/createUser")
async def create_user(request: Request):
    data = await request.json()
    response = client.query("createUser", data)
    return response

@app.post("/createFollow")
async def create_follow(request: Request):
    data = await request.json()
    response = client.query("createFollow", data)
    return response

@app.post("/createPost")
async def create_post(request: Request):
    data = await request.json()
    response = client.query("createPost", data)
    return response

@app.post("/createPostEmbedding")
async def create_post_embedding(request: Request):
    data = await request.json()
    response = client.query("createPostEmbedding", data)
    return response

@app.post("/getUsers")
async def get_users():
    response = client.query("getUsers", {})
    return response

@app.post("/getPosts")
async def get_posts():
    response = client.query("getPosts", {})
    return response

@app.post("/getPostsByUser")
async def get_posts_by_user(request: Request):
    data = await request.json()
    response = client.query("getPostsByUser", data)
    return response

@app.post("/getFollowers")
async def get_followers(request: Request):
    data = await request.json()
    response = client.query("getFollowers", data)
    return response

@app.post("/getFollowing")
async def get_following(request: Request):
    data = await request.json()
    response = client.query("getFollowing", data)
    return response

@app.post("/getUserPosts")
async def get_user_posts(request: Request):
    data = await request.json()
    response = client.query("getUserPosts", data)
    return response

@app.post("/searchPostEmbeddings")
async def search_post_embeddings(request: Request):
    data = await request.json()
    response = client.query("searchPostEmbeddings", data)
    return response

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, port=8000)