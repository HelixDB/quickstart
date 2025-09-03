QUERY createContinent (name: String) =>
    // Add a new continent node with name
    continent <- AddN<Continent>({name: name})
    RETURN continent

QUERY createCountry (continent_id: ID, name: String, currency: String) =>
    // Add a new country node with name and currency
    country <- AddN<Country>({name: name, currency: currency})

    // Find and link the country to the continent
    continent <- N<Continent>(continent_id)
    continent_country <- AddE<Continent_to_Country>()::From(continent)::To(country)
    RETURN country

QUERY createCity (country_id: ID, name: String, description: String) =>
    // Add a new city node with name and description
    city <- AddN<City>({name: name, description: description})

    // Find and link the city to the country
    country <- N<Country>(country_id)
    country_city <- AddE<Country_to_City>()::From(country)::To(city)
    RETURN city

QUERY setCapital (country_id: ID, city_id: ID) =>
    // Find the country and city nodes
    country <- N<Country>(country_id)
    city <- N<City>(city_id)

    // Link the city to the country as capital
    country_capital <- AddE<Country_to_Capital>()::From(country)::To(city)
    RETURN country_capital

QUERY getContinentId (name: String) =>
    // Find the continent node by name
    continent <- N<Continent>::WHERE(_::{name}::EQ(name))
    RETURN continent

QUERY getAllContinents () =>
    // Select all continent nodes
    continents <- N<Continent>
    RETURN continents

QUERY getAllCountries () =>
    // Select all country nodes
    countries <- N<Country>
    RETURN countries

QUERY getAllCountriesByContinentID (continent_id: ID) =>
    // Select continent node with given ID
    continent <- N<Continent>(continent_id)

    // Select all countries linked to the continent
    countries <- continent::Out<Continent_to_Country>
    RETURN countries

QUERY getAllCitiesByCountryID (country_id: ID) =>
    // Select country node with given ID
    country <- N<Country>(country_id)

    // Select all cities linked to the country
    cities <- country::Out<Country_to_City>
    RETURN cities

QUERY getAllCities () =>
    cities <- N<City>
    RETURN cities

QUERY getCapital (country_id: ID) =>
    // Select country node with given ID
    country <- N<Country>(country_id)

    // Select capital node linked to the country
    capital <- country::Out<Country_to_Capital>
    RETURN capital

QUERY createDescriptionEmbedding (city_id: ID, embedding: [F64]) =>
    // Add a new description embedding node with embedding
    description_embedding <- AddV<Description_Embedding>(embedding)

    // Find and link the description embedding to the city
    city <- N<City>(city_id)

    // Link the description embedding to the city
    city_description_embedding <- AddE<Description_Embedding_to_City>()::From(city)::To(description_embedding)
    RETURN description_embedding


QUERY searchDescriptions (vector: [F64], k: I64) =>
    // Search for description embedding nodes with given vector
    descriptions <- SearchV<Description_Embedding>(vector, k)

    // Traverse from the description embedding to the city
    cities <- descriptions::In<Description_Embedding_to_City>
    RETURN cities