import joblib
import pandas as pd
from pyrsistent import v
from sklearn.model_selection import train_test_split
import datetime as dt
import schedule 
import time 
import datetime 
import sys


def test_function():
    now = datetime.datetime.now() 
    model = joblib.load('./batch/xgb_final_model.pkl')
    df = pd.read_excel('./batch/tourlist4Server.xlsx')
    df_weather = pd.read_csv('./batch/weatherScrap.csv', encoding='utf-8', sep='\t') 

    df_weather['datetime'] = pd.to_datetime(df_weather['date'], format="%Y-%m-%d") 

    df_weather['month'] = df_weather['datetime'].dt.month_name()

    # 월요일: 0, 일요일: 6
    df_weather['weekday'] = df_weather['datetime'].dt.weekday

    #계절 변수 추가
    def func(x) :
        if x in('March', 'April', 'May'):
            return "spring"
        elif x in('June', 'July', 'August'):
            return "summer"
        elif x in('September', 'October', 'November'):
            return "fall"
        else :
            return "winter"
    df_weather["season"] = df_weather["month"].apply(lambda x : func(x))

    df = df.merge(df_weather, how='left', on='area_code' )

    df.to_csv('./batch/dummy.csv', encoding='utf-8', sep='\t' )

    #날씨상태 원핫인코딩 에러 방지 위해 더미 데이터 추가
    dummy = pd.read_csv('./batch/weatherScrap_dummy.csv', encoding='utf-8', sep='\t') 
    df = pd.concat([df,dummy], axis =0)


    #범주형 데이터 원핫인코딩
    tourlist_oh = pd.get_dummies(df['관광지명'])
    weather_oh = pd.get_dummies(df['weather'])
    month_oh = pd.get_dummies(df['month'])
    weekday_oh = pd.get_dummies(df['weekday'], prefix='weekday')
    season_oh = pd.get_dummies(df['season'])

    test = pd.concat([tourlist_oh, weather_oh, df[['avgTemp','highTemp','lowTemp','rainProb']], month_oh, weekday_oh, season_oh], axis=1)
    df['predict'] = model.predict(test)
    df.sort_values(by=['predict'], axis=0, ascending=False)
    df = df.sort_values(by=['predict'], axis=0, ascending=False)

    #추가
    df.rename(columns = {'관광지명': 'title'}, inplace = True)
    df1 = df[['title','area_code','r_spotId','date','avgTemp','highTemp','lowTemp','rainProb','weather','predict']]
    df1 = df1.set_index('title')

    df.to_csv('./batch/tourlistRecommend.csv', encoding='utf-8')
    df1.to_csv('./batch/recommend_sql.csv', encoding='utf-8')

    print("print current time") 
    print(now)


#프로그램을 종료시키기 위한 함수
def exit(): 
    print("function exit") 
    sys.exit()

time.sleep(5)
test_function()
time.sleep(5)
exit()