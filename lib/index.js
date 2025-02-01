const cheerio = require("cheerio");
const fetch = require("node-fetch");

/**
 * HentaiRead class
 */
class HentaiRead {
	/**
	 * Scrape a page and return all the doujins listed on that page
	 * @param {string} url - URL to scrape
	 * @returns {Promise} A promise that contains an object with the corresponding info
	 * @throws {error} If there is an error while searching
	 * @static
	 * @async
	 */
	static async searchPage(url) {
		if (typeof url !== "string") throw new Error("URL must be a string");

		const response = await fetch(url);

		if (!response.ok)
			throw new Error(`Error when fetching: Status Code ${response.status}`);

		const html = await response.text();
		const $ = cheerio.load(html);
		const container = $(".manga-grid");

		if (container.length <= 0 || !container.is("div"))
			throw new Error("Error when parsing");

		const doujins = [];

		container.children().each((index, result) => {
			const name = $(result).find("a:last");

			const tags = [];
			$(result)
				.find(".manga-item__tags span")
				.each((index, tag) => tags.push($(tag).text()));

			const images = {};
			const src = $(result).find(".manga-item__img img").attr("srcset");
			if (src) {
				const values = src.split(",").map((value) => value.trim());
				values.forEach((value) => {
					const [url, size] = value.split(" ");
					images[size] = url;
				});
			}

			doujins.push({
				name: name.text(),
				tags: tags,
				images: images,
				pages: $(result)
					.find(".fa-images")
					.closest("div")
					.find("span")
					.first()
					.text()
					.trim(),
				views: $(result)
					.find(".fa-eye")
					.closest("div")
					.find("span")
					.first()
					.text()
					.trim(),
				rating: $(result)
					.find(".fa-star")
					.closest("div")
					.find("span")
					.first()
					.text()
					.trim(),
				href: name.attr("href"),
			});
		});

		return doujins;
	}

	/**
	 * Search for a specific doujin with many parameters
	 * @param {object} options - An object representing query strings to search with
	 * @returns {Promise} A promise that contains an object with the corresponding info
	 * @throws {error} If there is an error while searching
	 * @static
	 * @async
	 */
	static async search(options) {
		return await this.searchPage(
			`https://hentairead.com/page/${options.page}/?${new URLSearchParams(
				options
			).toString()}`
		);
	}

	/**
	 * Check whether a doujin exists or not
	 * @param {string} query - The search query
	 * @returns {Promise<boolean>} - Promise representing a boolean of whether the doujin exists or not
	 * @throws {error} If there is an error while searching
	 * @static
	 * @async
	 */
	static async exists(query) {
		if (typeof query !== "string") throw new Error("Query must be a string");

		const response = await fetch(`https://hentairead.com/hentai/${query}/`);

		return response.ok;
	}

	/**
	 * Get the top doujins based off of the provided range
	 * @param {string} range - How far to look
	 * @param {number} page - Page number to look at
	 * @returns {Promise} A promise that contains an array of results
	 * @throws {error} If there is an error while searching
	 * @static
	 * @async
	 */
	static async top(range, page = 1) {
		const allowed = ["daily", "weekly", "monthly", "yearly", "all"];

		if (!allowed.includes(range.toLowerCase()))
			throw new Error(`Range must be one of ${allowed.join(", ")}`);

		return await this.searchPage(
			`https://hentairead.com/top-hentai/page/${page}/?sortby=${range}_top`
		);
	}

	/**
	 * Get the info of a specific doujin
	 * @param {string} doujin - The doujin to search for
	 * @returns {Promise} A promise that contains an object with the corresponding info
	 * @throws {error} If there is an error while searching
	 * @static
	 * @async
	 */
	static async getInfo(doujin) {
		if (typeof doujin !== "string")
			throw new Error("Doujin name must be a string");

		const response = await fetch(`https://hentairead.com/hentai/${doujin}/`);

		if (!response.ok)
			throw new Error(`Error when fetching: Status Code ${response.status}`);

		const html = await response.text();
		const $ = cheerio.load(html);
		const container = $("div.flex.flex-col.items-start.gap-4");

		if (container.length <= 0 || !container.is("div"))
			throw new Error("Error when parsing");

		const images = {};
		const src = $(html).find(".manga-item__img img").attr("srcset");
		if (src) {
			const values = src.split(",").map((value) => value.trim());
			values.forEach((value) => {
				const [url, size] = value.split(" ");
				images[size] = url;
			});
		}

		const data = {
			name: container.find(".manga-titles h1").text(),
			alt: container.find(".manga-titles h2").text(),
			id: container.find("a").first().text().replace("# ", ""),
			href: `https://hentairead.com/hentai/${doujin}/`,
			images,
			rating: $(html).find(".rating__number span").text(),
		};

		$(container)
			.find(".flex.flex-wrap.items-center.gap-2")
			.each((index, element) => {
				const key = $(element)
					.find(".text-primary")
					.text()
					.toLowerCase()
					.replaceAll(":", "")
					.trim();

				const values = [];
				$(element)
					.find("a span:first-child")
					.each((index, tag) => values.push($(tag).text().trim()));

				if (values.length === 0) {
					const value = $(element)
						.find(".text-gray-100, .text-gray-400")
						.text()
						.trim();
					if (value) values.push(value);
				}

				data[key] = values.length === 1 ? values[0] : values;
			});

		return data;
	}

	/**
	 * Get all the pages of a specific doujin
	 * @param {string} doujin
	 * @returns {Promise<string[]>} A promise that contains an array with the corresponding images
	 * @throws {error} If there is an error while searching
	 * @static
	 * @async
	 */
	static async getPages(doujin) {
		if (typeof doujin !== "string")
			throw new Error("Doujin name must be a string");

		const response = await fetch(`https://hentairead.com/hentai/${doujin}/`);

		if (!response.ok)
			throw new Error(`Error when fetching: Status Code ${response.status}`);

		const html = await response.text();
		const $ = cheerio.load(html);
		const pages = [];

		$("ul.lazy-listing__list img").each((index, image) =>
			pages.push($(image).attr("src").replaceAll("/preview", ""))
		);

		return pages;
	}

	/**
	 * Search through a specific index with a specific query
	 * @param {string} index - The index to search through
	 * @param {string} query - The query to search with
	 * @param {number} page - Page number to look at
	 * @param {string} sort - How to search the results
	 * @param {string} order - Whether to display the results in ascending or descending order
	 * @returns {Promise} A promise that contains an object with the corresponding info
	 * @throws {error} If there is an error while searching
	 * @static
	 * @async
	 */
	static async searchIndex(
		index,
		query,
		page = 1,
		sort = "new",
		order = "desc"
	) {
		const allowed = [
			"tag",
			"character",
			"convention",
			"parody",
			"artist",
			"release",
			"collection",
			"circle",
			"language",
		];

		if (!allowed.includes(index)) throw new Error("Index does not exist");
		if (typeof query !== "string") throw new Error("Query must be a string");

		return await this.searchPage(
			`https://hentairead.com/${index}/${query}/page/${page}/?sortby=${sort}&m_order=${order}`
		);
	}

	/**
	 * Get the doujins displayed on the home page
	 * @param {number} page - Page number to look at
	 * @returns {Promise} A promise that contains an object with the corresponding info
	 * @throws {error} If there is an error while searching
	 * @static
	 * @async
	 */
	static async getHome(page = 1) {
		return this.searchPage(`https://hentairead.com/page/${page}`);
	}

	/**
	 * Get a list of all doujins
	 * @param {number} page - Page number to look at
	 * @param {string} sort - How to search the results
	 * @param {string} order - Whether to display the results in ascending or descending order
	 * @returns {Promise} A promise that contains an object with the corresponding info
	 * @throws {error} If there is an error while searching
	 * @static
	 * @async
	 */
	static async getAll(page = 1, sort = "new", order = "desc") {
		const allowed = ["new", "alphabet", "rating", "favorite", "comments"];

		if (!allowed.includes(sort.toLowerCase()))
			throw new Error(`Range must be one of ${allowed.join(", ")}`);

		return this.searchPage(
			`https://hentairead.com/hentai/page/${page}/?sortby=${sort}&order=${order}`
		);
	}

	/**
	 * Get a random doujin
	 * @returns {Promise} A promise that contains an object with the corresponding info
	 * @throws {error} If there is an error while searching
	 * @static
	 * @async
	 */
	static async getRandom() {
		const response = await fetch("https://hentairead.com/?random_manga=1");

		if (!response.ok)
			throw new Error(`Error when fetching: Status Code ${response.status}`);

		const html = await response.text();
		const $ = cheerio.load(html);

		return this.getInfo(
			$('link[rel="canonical"]')
				.attr("href")
				.split("/hentai/")
				.pop()
				.replace("/", "")
		);
	}
}

module.exports = HentaiRead;
