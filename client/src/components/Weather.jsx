/* eslint-disable react/display-name, jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from "react";
import ReactWeather, { useVisualCrossing } from 'react-open-weather';
import { render } from "@testing-library/react";
import axios from "axios";
import weatherInfo from "../json/area_code4weather.json"
import { Button, Card } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/main.css'


// 선택한 지역, 날짜에 따른 ,visual crossing 날씨API 호출
// 초기값 제주시, 현재 날씨

// 서버에서 getWeatherApi로 문제 없는지 확인 
export function Weather(props) {
    // 제주 시청 위경도
    const lat = 33.499275950318584;
    const lng = 126.53248752501834;

    // 오늘 년/월/일
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    const [date, setDate] = useState(year+'-'+month+'-'+day);
 
    // 날씨 세부 내역
    const [tempmax, setTempmax] = useState();
    const [tempmin, setTempmin] = useState();
    const [icon, setIcon]= useState();
    const [humidity, setHumidity]= useState();
    const [feelslike, setFeelslike]= useState();
    const [uvindex , setUvindex]= useState();
    const [sunrise  , setSunrise ]= useState();
    const [sunset , setSunset]= useState();

    // 날씨 예보 이미지
    const weatherImgSrc = "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/4th%20Set%20-%20Color/"+icon+".png";


    // visualcrossing 날씨api 날씨 예보 불러오기
    const getWeatherApi = async () => {
      try {
        await axios({
          method:'get',
          url:`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/`+weatherInfo[props.areaCode].latitude+`,`+weatherInfo[props.areaCode].longtitude,
          params:{
            unitGroup:`metric`,
            include:`fcst%2Cobs%2Chistfcst%2Cstats%2Cdays`,
            key:'HVE5VWBRQ3L4M45Y4D67MJSHK',//`MTFPJPBAU2PLUC8E2W3JRZLPT`,
            contentType:`json`,
          }
        })
        .then((res)=>{
          setTempmax(res.data.days[props.selectDate].tempmax);
          setTempmin(res.data.days[props.selectDate].tempmin);
          setIcon(res.data.days[props.selectDate].icon);
          setHumidity(res.data.days[props.selectDate].humidity);
          setFeelslike(res.data.days[props.selectDate].feelslike);
          setUvindex(res.data.days[props.selectDate].uvindex);
          setSunrise(res.data.days[props.selectDate].sunrise);
          setSunset(res.data.days[props.selectDate].sunset);
          setDate(props.date);
        })
        } catch (error) {
            console.log(error)
        } 
        };//end of getWeatherApi 

      
      useEffect(()=>{
        if (props.search===false){
          return ;
        } else{
            getWeatherApi()
            props.setSearch(false)
        }; //end of if문
      },[props.search]) //end of useEffect

      
    // 초기값, 제주시 날씨 
      const getWeatherApiFirst = async () => {
        try {
          await axios({
            method:'get',
            url:`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/`+lat+`,`+lng+`/today`,
            params:{
              unitGroup:`metric`,
              include:`current`,
              key:`HVE5VWBRQ3L4M45Y4D67MJSHK`, //`MTFPJPBAU2PLUC8E2W3JRZLPT`,
              contentType:`json`,
            }
          })
          .then((res)=>{
            setTempmax(res.data.days[0].tempmax)
            setTempmin(res.data.days[0].tempmin)
            setIcon(res.data.days[0].icon)
            setHumidity(res.data.days[0].humidity)
            setFeelslike(res.data.days[0].feelslike)
            setUvindex(res.data.days[0].uvindex)
            setSunrise(res.data.days[0].sunrise)
            setSunset(res.data.days[0].sunset)
          })
          } catch (error) {
              console.log(error)
          } 
      }; //end of getWeatherApiFirst 

      useEffect(()=>{
          getWeatherApiFirst()
      },[])
        
    
    return (
        <div className="max-h-min card rounded-3xl p-4" style={{fontFamily:"Gamja Flower"}}>
            <div className="fs-4">{date}</div>
            <div className="font-weight-bold fs-2 text-center"> {tempmax}ºc/{tempmin}ºc </div>
            <div className="fs-4 text-center">{icon}</div>
            <div className="align-items-center fs-4 grid grid-cols-3">      
                <div className="col-span-2">
                    <table className="border-spacing-x-3">
                        <tr>
                            <td className="w-32">체감온도</td>
                            <td>{feelslike}ºc</td>
                        </tr>
                        <tr>
                            <td>습도</td>
                            <td>{humidity}%</td>
                        </tr>
                        <tr>
                            <td>자외선uv</td>
                            <td>{uvindex*10}%</td>
                        </tr>
                        <tr>
                            <td>일출/일몰 </td>
                            <td>{sunrise}/{sunset}</td>
                        </tr>
                    </table>
                </div>
                <div className="col flex justify-end">
                    <img classrc="mr-2" src={weatherImgSrc} width="100px"></img>
                </div>
            </div>
        </div>
        )
};
    

export default Weather;