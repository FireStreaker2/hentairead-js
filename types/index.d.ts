export = HentaiRead;
/**
 * HentaiRead class
 */
declare class HentaiRead {
	/**
	 * Scrape a page and return all the doujins listed on that page
	 * @param {string} url - URL to scrape
	 * @returns {Promise} A promise that contains an object with the corresponding info
	 * @throws {error} If there is an error while searching
	 * @static
	 * @async
	 */
	static searchPage(url: string): Promise<any>;
	/**
	 * Search for a specific doujin with many parameters
	 * @param {object} options - An object representing query strings to search with
	 * @returns {Promise} A promise that contains an object with the corresponding info
	 * @throws {error} If there is an error while searching
	 * @static
	 * @async
	 */
	static search(options: object): Promise<any>;
	/**
	 * Check whether a doujin exists or not
	 * @param {string} query - The search query
	 * @returns {Promise<boolean>} - Promise representing a boolean of whether the doujin exists or not
	 * @throws {error} If there is an error while searching
	 * @static
	 * @async
	 */
	static exists(query: string): Promise<boolean>;
	/**
	 * Get the top doujins based off of the provided range
	 * @param {string} range - How far to look
	 * @param {number} page - Page number to look at
	 * @returns {Promise} A promise that contains an array of results
	 * @throws {error} If there is an error while searching
	 * @static
	 * @async
	 */
	static top(range: string, page?: number): Promise<any>;
	/**
	 * Get the info of a specific doujin
	 * @param {string} doujin - The doujin to search for
	 * @returns {Promise} A promise that contains an object with the corresponding info
	 * @throws {error} If there is an error while searching
	 * @static
	 * @async
	 */
	static getInfo(doujin: string): Promise<any>;
	/**
	 * Get all the pages of a specific doujin
	 * @param {string} doujin
	 * @returns {Promise<string[]>} A promise that contains an array with the corresponding images
	 * @throws {error} If there is an error while searching
	 * @static
	 * @async
	 */
	static getPages(doujin: string): Promise<string[]>;
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
	static searchIndex(
		index: string,
		query: string,
		page?: number,
		sort?: string,
		order?: string
	): Promise<any>;
	/**
	 * Get the doujins displayed on the home page
	 * @param {number} page - Page number to look at
	 * @returns {Promise} A promise that contains an object with the corresponding info
	 * @throws {error} If there is an error while searching
	 * @static
	 * @async
	 */
	static getHome(page?: number): Promise<any>;
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
	static getAll(page?: number, sort?: string, order?: string): Promise<any>;
	/**
	 * Get a random doujin
	 * @returns {Promise} A promise that contains an object with the corresponding info
	 * @throws {error} If there is an error while searching
	 * @static
	 * @async
	 */
	static getRandom(): Promise<any>;
}
