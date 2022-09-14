/* eslint-disable react/display-name, jsx-a11y/click-events-have-key-events */
// import Icon from "awesome-react-icons";
import React, { useState, useEffect } from "react";
import DatePicker from "sassy-datepicker";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import areaLists from "../json/areaLists.json"
import tourlistTop20s from "../json/tourlistTop20s.json"
import Dropdown from "./Dropdown";
import '../styles/Dropdown.css'
import axios from "axios";
import '../styles/main.css'
import reactStringReplace from 'react-string-replace'




export const NavSidebar = (props) => {

  //  달력 날짜 선택
  const today = new Date()
  const [date, setDate] = useState(new Date());

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // 날짜 포맷 변경
  const selectDate =
  year + '-' + ('00' + month.toString()).slice(-2) + '-' + ('00' + day.toString()).slice(-2);

  const minDate = new Date(new Date().setDate(new Date().getDate() - 1));
  const maxDate = new Date(new Date().setDate(new Date().getDate() + 9));


// 달력: 일정 선택
  function Calendar() {
    const onChange = (date) => {
      setDropdownVisibility(!dropdownVisibility)
      const dateDiff = Math.ceil((date.getTime()-today.getTime())/(1000*60*60*24))
      setDate(date);
      props.setSelectDate(dateDiff);
      props.setDate(date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate());
        
    };

    return <DatePicker onChange={onChange} selected={date} minDate={minDate} maxDate={maxDate} />;
  }//end of Calendar 


  // 지역 선택
  const [areaCode, setAreaCode] = useState('');
  const [area, setArea] = useState('제주시');

  function selectArea(e) {
    setAreaCode(e.target.id);
    setArea(e.target.firstChild.data);
    props.setAreaCode(e.target.id);
    props.setDate(date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate())
  }


  // 드롭다운
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const [dropdownVisibility2, setDropdownVisibility2] = useState(false);


  // 관광지리스트 업데이트
  const [tourlists, setTourlist] = useState(tourlistTop20s);

  const getUseApi = async () => {
    try {
      await axios({
        method: 'get', 
        url:'https://lazyoff-psgja2.run.goorm.io/', 
        params:{
        area:areaCode, 
        date:selectDate
        }
      })
      .then((res)=>{
        setTourlist(res.data)
        props.setTourlist(res.data)
      })
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
    }
    console.log(error.config);
    }
  };// end of getUseApi 


  // 관광지리스트 id
  function selectSpotId(e) {
    props.setSpotId(e.target.id);
  } // end of selectSpotId


// 일정 및 지역 선택 제출
  function submit(){
    if (areaCode in [0,1,2,3,4,5,6,7,8,9,10,11]){
      getUseApi();
      props.setSearch(true);
      setTitle(month+"월 "+day+"일 추천 관광지")
    } else {
      alert("지역을 선택해주세요!");
    }
      
  }; //end of submit

  // 리스트 제목
  const [title, setTitle] = useState('제주도 추천 여행지 Top20')



  return (
    <React.Fragment>
      <div
        id='sidebar'
        className={`fixed inset-y-0 left-0 z-30 w-5\/12 transition duration-300 ease-out transform translate-x-0 bg-white  lg:translate-x-0 lg:static lg:inset-0`}
        // className={`fixed inset-y-0 left-0 z-30 w-1\/2 transition duration-300 ease-out transform translate-x-0 bg-white border-r-2 lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex flex-col text-center p-3">
        {/* <div className="flex items-center justify-center mt-10 text-center py-6"> */}
          {/* <div  */}
          <div className="w-40"> 
            <img src={`/logoCut.jpg`} onClick={()=>(window.location.href="/")}></img>
          </div>
          <div className="mx-5 my-1 p-1">
            <div id='select' className="fs-5 bg-white rounded-s text-center">
             <div id='calendar' >
                <div className="flex rounded-lg border-1 border-gray-400 p-1 m-1" onClick={e => setDropdownVisibility(!dropdownVisibility)}>
                    <div className="justify-self-start col text-left font-semibold pl-2">📆 일정 선택</div>
                    <div className="col">{year + '-' + month + '-' + day}</div>
                </div>  
                <Dropdown visibility={dropdownVisibility} className="text-center">
                  <Calendar />
                </Dropdown>
              </div>
              <div id='jejuArea'>
                <div className="flex rounded-lg border-1 border-gray-400 p-1 m-1" onClick={e => setDropdownVisibility2(!dropdownVisibility2)}>
 					<div className="justify-self-start col text-left font-semibold pl-2">🚩 지역 선택</div>
                    <div className="col">{area}</div>
                </div>
                <Dropdown visibility={dropdownVisibility2} style={{zIndex:"2"}}>
                  <ul>
                    {
                      areaLists.map(areaList =>
                        <li className="p-1 m-2 rounded-lg bg-teal-100" 
                          id={areaList.areaCode} 
                          key={areaList.areaCode} 
                          onClick={e => {selectArea(e);setDropdownVisibility2(!dropdownVisibility2)}}>{areaList.area}
                        </li>
                        )
                      }
                  </ul>
                </Dropdown>
              </div>
              <div 
                id="submitButton"
                className="rounded-l-lg rounded-r-lg p-1 m-2 mx-5 fs-5 bg-teal-300" onClick={()=>(submit())}><b>여행지 찾기</b></div>
            </div> 
          </div>
        </div>
        <div id={`recomend`} className="fixed top-170 items-stretch justify-center"
        style={{fontSize: '17px', top:"250px", zIndex:"-1", margin:"30px",marginTop:"40px"}}>
          <b>
            <p id='sidebarTitle'
                className="fs-4 mt-1"
              style={{zIndex:'1'}}
            >
              {title}
            </p>
          </b>
          <div
            className={`overflow-y-auto `}
            // className={`fixed inset-y-0 left-0 z-30 w-1\/2  overflow-y-auto transition duration-300 ease-out transform translate-x-0 bg-white border-r-2 lg:translate-x-0 lg:static lg:inset-0`}
            style={{height:"61vh", position:"absolute", overflowY: "scroll", }}
            // style={{height:"68vh", position:"absolute", overflowY: "scroll", }}
            >
            <ul>
              {
                tourlists.map((tourlist,i) =>
                  <li id={tourlist.subtitle} key={tourlist.contentsid} onClick={e => selectSpotId(e)}>
                    <div 
                      className="rounded-l-lg rounded-r-lg text-right m-2 p-3 h-auto w-auto"
                      style={{height:"17vh", width:"33vw", backgroundColor:"#DEEBF7" ,maxWidth:"430px"}} 
                      id={tourlist.subtitle}  >
                      <img id={tourlist.subtitle} src={tourlist.Imgpath} 
                      style={{height:"14vh", width:"15vw", position:"absolute", textAlign:"right" , maxWidth:"195px"}}
                      ></img>
                      <b>
                      <p id={tourlist.subtitle} style={{display:"block", width:"30vw", height:"14vh", maxWidth:"420px"}} >{i+1}위 {tourlist.subtitle}</p>
                      </b>
                      <p style={{marginTop:"-30px"}} >#{reactStringReplace(tourlist.tag2, ',', (match, i) => (
                          ' #')).join("")}</p>
                    </div>
                  </li>
                )
              }
            </ul>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
