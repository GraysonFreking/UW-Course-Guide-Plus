venv:
	sudo easy_install pip; \
	pip install virtualenv; \
	virtualenv venv; \
	source venv/bin/activate; \

deps:
	pip install -r requirements.txt
runspider:
	scrapy runspider mapSpider.py -t json --nolog -o - > mapResult.json
