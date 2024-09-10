const algoliasearch = require("algoliasearch");

fetch("https://dashboard.algolia.com/sample_datasets/movie.json")
  .then((data) => data.json())
  .then((records) => {
    const client = algoliasearch(
      "R14WBJ6878",
      "216aa09d6d8bc1ea08056620f325ba37"
    );

    const index = client.initIndex("your_index_name");

    index.saveObjects(records, { autoGenerateObjectIDIfNotExist: true });
  })
  .catch((error) => {
    console.error(error);
  });
