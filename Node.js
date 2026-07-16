#a6e3a1">"color:#cba6f7">const express = "color:#cba6f7">require(&#039;express&#039;);
#a6e3a1">"color:#cba6f7">const axios = "color:#cba6f7">require(&#039;axios&#039;);
#a6e3a1">"color:#cba6f7">const app = express();
app.#a6e3a1">"color:#cba6f7">use(express.json());

app.get(&#039;/find-similar&#039;, "color:#cba6f7">async (req, res) => {
    #a6e3a1">"color:#cba6f7">const query = req.query.query;
    #a6e3a1">"color:#cba6f7">let similarMovies = [];

    #a6e3a1">"color:#cba6f7">try {
        // Fetch movie details "color:#cba6f7">from IMDb
        #a6e3a1">"color:#cba6f7">const imdbResponse = "color:#cba6f7">await axios.get(https://www.imdb.com/search/title/?title=${query}&adult="color:#cba6f7">false);
        #a6e3a1">"color:#cba6f7">const imdbResults = parseImdbResults(imdbResponse.data);

        #a6e3a1">"color:#cba6f7">for ("color:#cba6f7">const result of imdbResults) {
            #a6e3a1">"color:#cba6f7">const movieDetailsResponse = "color:#cba6f7">await axios.get(https://www.imdbapi.com/?i=${result.imdbID}&plot=short&apikey=YOUR_IMDB_API_KEY);
            #a6e3a1">"color:#cba6f7">const movieDetails = movieDetailsResponse.data;

            // Fetch rating "color:#cba6f7">from Rotten Tomatoes
            #a6e3a1">"color:#cba6f7">const rtResponse = "color:#cba6f7">await axios.get(https://www.omdbapi.com/?t=${query}&apikey=YOUR_RT_API_KEY);
            #a6e3a1">"color:#cba6f7">const rtDetails = rtResponse.data;

            // Fetch one-line summary "color:#cba6f7">from Wikipedia
            #a6e3a1">"color:#cba6f7">const wpResponse = "color:#cba6f7">await axios.get(https://en.wikipedia.org/api/rest_v1/page/summary/${query.replace(/\s+/g, &#039;_&#039;)});
            #a6e3a1">"color:#cba6f7">const wpDetails = wpResponse.data.extract;

            similarMovies.push({
                title: movieDetails.Title,
                rating: ${movieDetails.Ratings[0].Value} (IMDB), ${rtDetails.tomatoRating} (Rotten Tomatoes),
                genre: movieDetails.Genre,
                oneLineSummary: wpDetails
            });
        }

        res.json({ similarMovies });
    } #a6e3a1">"color:#cba6f7">catch (error) {
        res.status(500).json({ error: &#039;Failed to fetch similar movies&#039; });
    }
});

#a6e3a1">"color:#cba6f7">function parseImdbResults(html) {
    #a6e3a1">"color:#cba6f7">const parser = "color:#cba6f7">new DOMParser();
    #a6e3a1">"color:#cba6f7">const doc = parser.parseFromString(html, &#039;text/html&#039;);
    #a6e3a1">"color:#cba6f7">const results = [];
    #a6e3a1">"color:#cba6f7">const items = doc.querySelectorAll(&#039;.lister-item&#039;);

    #a6e3a1">"color:#cba6f7">for ("color:#cba6f7">const item of items) {
        #a6e3a1">"color:#cba6f7">const titleElement = item.querySelector(&#039;.lister-item-header a&#039;);
        #a6e3a1">"color:#cba6f7">const imdbID = titleElement.href.split(&#039;/&#039;)[4];
        results.push({ title: titleElement.textContent, imdbID });
    }

    #a6e3a1">"color:#cba6f7">return results;
}

app.listen(3000, () => {
    console.log(&#039;Server "color:#cba6f7">is running on port 3000&#039;);
});