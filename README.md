![hentairead-js](https://socialify.git.ci/FireStreaker2/hentairead-js/image?description=1&font=Raleway&forks=1&issues=1&language=1&name=1&owner=1&pattern=Solid&pulls=1&stargazers=1&theme=Dark)

# About

hentairead-js is a simple node package to scrape https://hentairead.com. It utilizes [node-fetch](https://www.npmjs.com/package/node-fetch) and [cheerio](https://www.npmjs.com/package/cheerio). It was made because many nhentai packages stopped working due to cloudflare issues.

# Features

- Scrape pages quickly and easily
- Fully asynchronous
- Supports most actions reading-wise

# Installation

```bash
$ npm i hentairead-js
```

# Usage

| Method      | Description                                                  |
| ----------- | ------------------------------------------------------------ |
| searchPage  | Scrape a page and return all the doujins listed on that page |
| search      | Search for a specific doujin with many parameters            |
| exists      | Check whether a doujin exists or not                         |
| top         | Get the top doujins based off of the provided range          |
| getInfo     | Get the info of a specific doujin                            |
| getPages    | Get all the pages of a specific doujin                       |
| searchIndex | Search through a specific index with a specific query        |
| getHome     | Get the doujins displayed on the home page                   |
| getAll      | Get a list of all doujins                                    |
| getRandom   | Get a random doujin                                          |

# Examples

```js
// index.js
const HentaiRead = require("hentairead-js");
// or alternatively:
// import HentaiRead from "hentairead-js";

(async () => {
	// search for the first page of all doujins that have the word "neko"
	console.log(await HentaiRead.search({ s: "neko", page: 1 }));

	// get pages for a specific doujin
	console.log(
		await HentaiRead.getPages("boku-no-risou-no-isekai-seikatsu-4-decensored")
	);
})();
```

# Troubleshooting

| Problem                                                      | Answer                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What parameters does the `search` method accept?             | The search method accepts anything as a parameter, because of all the possible variations of searches. While it can't check if something is valid or not, it will throw an error if a `404` is found. For a list of all accepted parameters, you can look at the query parameters found [here](https://hentairead.com/?s) (click advanced). |
| Why do I get a timeout error? / Why does it keep on hanging? | Try checking your internet connection to make sure it's stable.                                                                                                                                                                                                                                                                             |
| Does this support synchronous functions?                     | No, everything is fully asynchronous                                                                                                                                                                                                                                                                                                        |
| Does this support both CJS and ESM?                          | Yes, both work with this package                                                                                                                                                                                                                                                                                                            |

# Contributing

If you would like to contribute, you can <a href="https://github.com/FireStreaker2/hentairead-js/fork">fork the repo</a> and <a href="https://github.com/FireStreaker2/hentairead-js/compare">make a PR</a>, or contact me via email @ `suggestions@firestreaker2.gq`

# License

[MIT](https://github.com/FireStreaker2/hentairead-js/blob/main/LICENSE)
