N::User {
    name: String,
    age: U32,
    email: String,
    created_at: Date DEFAULT NOW,
    updated_at: Date DEFAULT NOW,
}

N::Post {
    content: String,
    created_at: Date DEFAULT NOW,
    updated_at: Date DEFAULT NOW,
}

E::Follows {
    From: User,
    To: User,
    Properties: {
        since: Date DEFAULT NOW,
    }
}

E::Created {
    From: User,
    To: Post,
    Properties: {
        created_at: Date DEFAULT NOW,
    }
}

V::Post_Embedding {
    content: String,
}

E::Post_to_Post_Embedding {
    From: Post,
    To: Post_Embedding,
    Properties: {
    }
}