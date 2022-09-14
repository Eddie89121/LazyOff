# ! pip install scrapy

import pandas as pd
import requests
import datetime
from lxml import html
import re


today = datetime.datetime.today().strftime("%Y-%m-%d")

headers = {
    'Accept' : 'text/html, */*; q=0.01',
    'Accept-Encoding':'gzip, deflate, br',
    'Accept-Language':'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
    'Connection':'keep-alive',
    'Cookie':'JSESSIONID=d-nbdXYvHeo0XIUHY77yA92w2ADv3vd8qpnY98yh.standalone; _TRK_CR=https%3A%2F%2Fwww.google.com%2F; XTVID=A220420091059052410; xloc=1280X1024; _harry_lang=ko-KR; _TRK_UID=8369037fe2bb00101b8c1effd84dbe6f:9; _TRK_SID=55c7604a299f80045ae975408ef6de42; _harry_ref=https%3A//www.google.com/; _harry_url=https%3A//www.weather.go.kr/w/index.do; _harry_fid=hh1630160684; _TRK_EX=2; _harry_hsid=A220502121623638184; _harry_dsid=A220502121623639137',
    'Host':'www.weather.go.kr',
    'Referer':'https://www.weather.go.kr/w/index.do',
    'sec-ch-ua':'" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
    'sec-ch-ua-mobile':'?0',
    'sec-ch-ua-platform':'"Windows"',
    'Sec-Fetch-Dest':'empty',
    'Sec-Fetch-Mode':'cors',
    'Sec-Fetch-Site':'same-origin',
    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
    'X-Requested-With':'XMLHttpRequest'
}


code = [
        5013025300, #남원읍
        5013025000, #성산읍
        5013025900, #대정읍
        5013031000, #안덕면
        5013032000, #표선면
        5013053000, #서귀포시
        5011025600, #구좌읍
        5011025300, #애월읍
        5011025900, #조천읍
        5011031000, #한경면
        5011025000, #한림읍
        5011054000  #제주시
    ]


# digital-forecast.do?파일

def weatherScrap():
    result = []
    for area_code in range(0,12):
        url = 'https://www.weather.go.kr/w/wnuri-fct2021/main/digital-forecast.do?code='+str(code[area_code])+'&unit=m%2Fs&hr1=Y'
        response = html.fromstring(requests.get(url=url,headers=headers).text) 
        
        #오늘 예보
        date = datetime.datetime.today().strftime("%Y-%m-%d")
        hourly_forecast = []    
        # 크롤링시간 6시/18시
        today_hour= datetime.datetime.today().hour + 2
        for j in range(today_hour,25):
            j = str(j).zfill(2)
            forecast = response.xpath('//div[@data-date="'+date+'"]/div/ul[@data-time="'+j+':00"]/li/span/text()')
            temp_hourly = int(re.sub(r'[^0-9]', '', forecast[5]))
            try:
                rainProb_hourly = int(re.sub(r'[^0-9]', '', forecast[11]))
            except:
                rainProb_hourly = 0
            if forecast[5]=='눈':
                weather_hourly = 6
            elif forecast[5]=='눈날림':
                weather_hourly = 6
            elif forecast[5]=='소나기':
                weather_hourly = 5
            elif forecast[5]=='비':
                weather_hourly = 5
            elif forecast[5]=='빗방울':
                weather_hourly = 5
            elif forecast[5]=='맑음':
                weather_hourly = 1
            elif (forecast[5]=='구름 많음')|(forecast[5]=='구름조금'):
                weather_hourly = 3
            else:
                weather_hourly = 4 #흐

            hourly_forecast.append([
                temp_hourly,
                rainProb_hourly,
                weather_hourly
            ])


        df = pd.DataFrame(hourly_forecast, columns=['temp_hourly','rainProb_hourly','weather_hourly'])
        weather = df['weather_hourly'].mode()[0]
        highTemp = df['temp_hourly'].max()
        lowTemp = df['temp_hourly'].min()
        avgTemp = df['temp_hourly'].mean()
        rainProb = df['rainProb_hourly'].max()
        result.append([
            date,
            area_code,
            avgTemp,
            highTemp,
            lowTemp,
            rainProb,
            weather
        ])
 


        # # 내일~4일
        for i in range(1,4):
            date = (datetime.datetime.today()+datetime.timedelta(days=i)).strftime("%Y-%m-%d")
            hourly_forecast = []    
            for j in range(1,25):
                j = str(j).zfill(2)
                forecast = response.xpath('//div[@data-date="'+date+'"]/div/ul[@data-time="'+j+':00"]/li/span/text()')
                temp_hourly = int(re.sub(r'[^0-9]', '', forecast[5]))
                try:
                    rainProb_hourly = int(re.sub(r'[^0-9]', '', forecast[11]))
                except:
                    rainProb_hourly = 0
                if forecast[5]=='눈':
                    weather_hourly = 6
                elif forecast[5]=='눈날림':
                    weather_hourly = 6
                elif forecast[5]=='소나기':
                    weather_hourly = 5
                elif forecast[5]=='비':
                    weather_hourly = 5
                elif forecast[5]=='빗방울':
                    weather_hourly = 5
                elif forecast[5]=='맑음':
                    weather_hourly = 1
                elif (forecast[5]=='구름 많음')|(forecast[5]=='구름조금'):
                    weather_hourly = 3
                else:
                    weather_hourly = 4 #흐림

                hourly_forecast.append([
                    temp_hourly,
                    rainProb_hourly,
                    weather_hourly
                ])
            df = pd.DataFrame(hourly_forecast, columns=['temp_hourly','rainProb_hourly','weather_hourly'])
            weather = df['weather_hourly'].mode()[0]
            highTemp = df['temp_hourly'].max()
            lowTemp = df['temp_hourly'].min()
            avgTemp = df['temp_hourly'].mean()
            rainProb = df['rainProb_hourly'].max()

            result.append([
                date,
                area_code,
                avgTemp,
                highTemp,
                lowTemp,
                rainProb,
                weather
            ])


        # # 5~7일 일주일 예보
        for i in range(4,8): 
            date = (datetime.datetime.today()+datetime.timedelta(days=i)).strftime("%Y-%m-%d")            
            am = response.xpath('//div[@data-date="'+date+'"]/div/ul[@data-time="AM"]/li/span/text()')
            pm = response.xpath('//div[@data-date="'+date+'"]/div/ul[@data-time="PM"]/li/span/text()')

            lowTemp	= int(re.sub(r'[^0-9]', '', am[7]))
            highTemp = int(re.sub(r'[^0-9]', '', pm[7]))
            avgTemp = (highTemp+lowTemp)/2

            try:
                rainProb1 = int(re.sub(r'[^0-9]', '', am[9]))
            except:
                rainProb1 = 0
            try:
                rainProb2 = int(re.sub(r'[^0-9]', '', pm[9]))
            except:
                rainProb2 = 0

            if rainProb1>rainProb2:
                rainProb = rainProb1
            else:
                rainProb = rainProb2

            if (am[5]=='눈')|(pm[5]=='눈'):
                weather = 6
            elif (am[5]=='눈날림')|(pm[5]=='눈날림'):
                weather = 6
            elif (am[5]=='소나기')|(pm[5]=='눈날림'):
                weather = 5
            elif (am[5]=='비')|(pm[5]=='비'):
                weather = 5
            elif (am[5]=='빗방울')|(pm[5]=='빗방울'):
                weather = 5
            elif (am[5]=='맑음')|(pm[5]=='맑음'):
                weather = 1
            elif (am[5]=='구름 많음')|(am[5]=='구름 조금')|(pm[5]=='구름 많음')|(pm[5]=='구름 조금'):
                weather = 3
            else:
                weather = 4 #흐림
            result.append([
                date,
                area_code,
                avgTemp,
                highTemp,
                lowTemp,
                rainProb,
                weather
            ])   



        # #8일~10일
        for i in range(8,11): 
            date = (datetime.datetime.today()+datetime.timedelta(days=i)).strftime("%Y-%m-%d")            
            ampm = response.xpath('//div[@data-date="'+date+'"]/div/ul[@data-time="AMPM"]/li/span/text()')

            lowTemp	= int(re.sub(r'[^0-9]', '', ampm[7].split(' ')[1]))
            highTemp = int(re.sub(r'[^0-9]', '', ampm[7].split(' ')[4]))
            avgTemp = (highTemp+lowTemp)/2
            try:
                rainProb = int(re.sub(r'[^0-9]', '', ampm[9]))
            except:
                rainProb = 0
        
            
            if ampm[5]=='눈':
                weather = 6
            elif ampm[5]=='눈날림':
                weather = 6
            elif ampm[5]=='소나기':
                weather = 5
            elif ampm[5]=='비':
                weather = 5
            elif ampm[5]=='빗방울':
                weather = 5
            elif ampm[5]=='맑음':
                weather = 1
            elif (ampm[5]=='구름 많음')|(ampm[5]=='구름 조금'):
                weather = 3
            else:
                weather = 4 #흐림
            result.append([
                date,
                area_code,
                avgTemp,
                highTemp,
                lowTemp,
                rainProb,
                weather
            ])

    pd.DataFrame(result, columns=['date','area_code','avgTemp','highTemp','lowTemp','rainProb','weather']).to_csv('./batch/weatherScrap.csv', encoding='utf-8', sep='\t')


weatherScrap()