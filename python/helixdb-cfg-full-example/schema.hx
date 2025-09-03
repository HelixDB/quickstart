N::Continent {
    name: String
}

N::Country {
    name: String,
    currency: String
}

N::City {
    name: String,
    description: String
}

E::Continent_to_Country {
    From: Continent,
    To: Country,
    Properties: {
    }
}

E::Country_to_City {
    From: Country,
    To: City,
    Properties: {
    }
}

E::Country_to_Capital {
    From: Country,
    To: City,
    Properties: {
    }
}

V::Description_Embedding {
    embedding: [F64]
}

E::Description_Embedding_to_City {
    From: City,
    To: Description_Embedding,
    Properties: {
    }
}