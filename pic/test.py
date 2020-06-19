# -*- coding:utf-8 -*-
import requests
from lxml import etree


headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36'
}

def spider(num):
    url = 'https://book.douban.com/top250?start=' + str(num)
    html = requests.get(url, headers=headers)

    selector = etree.HTML(html.text)
    pic_url = selector.xpath('//a[@class="nbg"]/img/@src')
    for each in range(0, len(pic_url)):
        pic = requests.get(pic_url[each])
        fp = open('pic\\books\\' + str(num + each+1) + '.jpg', 'wb')
        fp.write(pic.content)
        print("保存第%d本书成功" % int(each+num))
        fp.close()


if __name__ == '__main__':
    for i in range(10):
        spider(num=i * 25)
