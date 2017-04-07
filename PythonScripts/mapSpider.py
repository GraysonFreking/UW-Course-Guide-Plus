import scrapy
'''
Run a spider to extract the data from maps.wisc.edu/buildings
Generates a JSON file with buildings and cooresponding map links.

Usage: scrapy runspider mapSpider.py -t json --nolog -o - > results.json 
'''

class MapSpider(scrapy.Spider):
	#Name of the spider
	name = "map_spider"
	start_urls = ['http://maps.wisc.edu/buildings']

	def parse(self, response):
		ROW_SELECTOR = 'table tr'
		#Selects each row from the table and returns as a list
		for row in response.css(ROW_SELECTOR):
			#::text fetches the text inside a tag
			BUILDING_SELECTOR = 'tr th ::text'
			#Selects the href attribute from td tag
			LINK_SELECTOR = 'td a ::attr(href)'
			yield {
				#extract first: get the first element that matches selector
				'building': row.css(BUILDING_SELECTOR).extract_first(),
				'link': 'http://maps.wisc.edu' + row.css(LINK_SELECTOR).extract_first(),
			}
