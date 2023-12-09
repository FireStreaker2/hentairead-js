const cheerio = require("cheerio");
const fetch = require("node-fetch");

class HentaiRead {
	static async search(query) {
		if (typeof query !== "string") throw new Error("Query must be a string");

		try {
			const response = await fetch(`https://hentairead.com/?s=${query}`);

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
	}
}

module.exports = HentaiRead;
