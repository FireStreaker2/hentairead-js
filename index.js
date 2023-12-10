const cheerio = require("cheerio");
const fetch = require("node-fetch");

const searchPage = async (url) => {
	try {
		const response = await fetch(url);

		if (!response.ok)
			throw new Error(`Error when fetching: Status Code ${response.status}`);

		const html = await response.text();
		const $ = cheerio.load(html);
		const container = $(".page-listing-grid");

		if (container.length <= 0 || !container.is("div"))
			throw new Error("Error when parsing");

		const doujins = [];

		container.children().each((index, result) => {
			const name = $(result).find("a:last");

			const tags = [];
			$(result)
				.find(".tag-name")
				.each((index, tag) => tags.push($(tag).text()));

			const images = {};
			const src = $(result).find("img").attr("data-srcset");
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
					.find(".item__total-pages")
					.text()
					.replaceAll("\n", "")
					.trim(),
				views: $(result).find(".item__total-views").find("span").text(),
				rating: $(result)
					.find(".item__rating")
					.text()
					.replaceAll("\n", "")
					.trim(),
				href: name.attr("href"),
			});
		});

		return doujins;
	} catch (error) {
		throw new Error(`Error when fetching: ${error}`);
	}
};

class HentaiRead {
	static async search(query) {
		if (typeof query !== "string") throw new Error("Query must be a string");

		return await searchPage(`https://hentairead.com/?s=${query}`);
	}

	static async exists(query) {
		if (typeof query !== "string") throw new Error("Query must be a string");

		const response = await fetch(`https://hentairead.com/hentai/${query}/`);

		if (response.ok) return true;
		return false;
	}

	static async top(range) {
		const allowed = ["day", "week", "month", "year", "all"];

		if (!allowed.includes(range))
			throw new Error("Range must be day, week, month, year, or all");

		return await searchPage(
			`https://hentairead.com/top-hentai/?range=${range}`
		);
	}

	static async getInfo(doujin) {
		if (typeof doujin !== "string")
			throw new Error("Doujin name must be a string");

		try {
			const response = await fetch(`https://hentairead.com/hentai/${doujin}/`);

			if (!response.ok)
				throw new Error(`Error when fetching: Status Code ${response.status}`);

			const html = await response.text();
			const $ = cheerio.load(html);
			const container = $(".tab-summary");

			if (container.length <= 0 || !container.is("div"))
				throw new Error("Error when parsing");

			const temp = {};
			$(".post-meta").each((index, element) => {
				temp[
					$(element)
						.find(".post-meta-title")
						.text()
						.toLowerCase()
						.replaceAll(":", "")
						.trim()
				] = $(element).find(".post-meta-value").text();
			});

			const images = {};
			const src = $(container).find("img").attr("data-srcset");
			if (src) {
				const values = src.split(",").map((value) => value.trim());
				values.forEach((value) => {
					const [url, size] = value.split(" ");
					images[size] = url;
				});
			}

			const data = {
				name: container.find(".post-title").text().replaceAll("\n", "").trim(),
				alt: container.find(".alt-title").text(),
				id: container.find(".post-id a").text(),
				href: `https://hentairead.com/hentai/${doujin}/`,
				images: images,
				rating: container
					.find(".total_votes")
					.text()
					.replace("Your Rating", ""),
				pages: temp["pages"],
				views: temp["views"],
				uploaded: temp["uploaded"],
				updated: temp["updated"],
				tags: container
					.find(".post-tax-wp-manga-tag .post-tags .post-tag .tag-name")
					.map((index, element) => $(element).text())
					.get(),
			};

			const sections = [
				"language",
				"genre",
				"convention",
				"circle",
				"artist",
				"parody",
				"scanlator",
				"release",
			];

			for (const section of sections) {
				data[section] = container
					.find(`.post-tax-wp-manga-${section} .post-tags .post-tag .tag-name`)
					.text()
					.replaceAll("\n", "");
			}

			return data;
		} catch (error) {
			throw new Error(`Error when fetching: ${error}`);
		}
	}

	static async getPages(doujin) {
		if (typeof doujin !== "string")
			throw new Error("Doujin name must be a string");

		try {
			const response = await fetch(
				`https://hentairead.com/hentai/${doujin}/english/p/1/`
			);

			if (!response.ok)
				throw new Error(`Error when fetching: Status Code ${response.status}`);

			const html = await response.text();
			const $ = cheerio.load(html);

			return JSON.parse(
				$("#chapter_preloaded_images")
					.text()
					.match(/\[.*\]/)[0]
			).map((image) => image.src);
		} catch (error) {
			throw new Error(`Error when fetching: ${error}`);
		}
	}

	static async searchIndex(index, query) {
		const allowed = [
			"tag",
			"character",
			"convention",
			"parody",
			"artist",
			"release",
			"collection",
			"circle",
		];

		if (!allowed.includes(index)) throw new Error("Index does not exist");
		if (typeof query !== "string") throw new Error("Query must be a string");

		return await searchPage(`https://hentairead.com/${index}/${query}/`);
	}
}

module.exports = HentaiRead;

// DEVELOPMENT
(async () => {
	console.log(await HentaiRead.searchIndex("tag", "loli"));
})();
