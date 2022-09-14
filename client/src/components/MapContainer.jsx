
/*eslint-disable*/    //지우면 안됨
/*global kakao*/      //지우면 안됨
import React, { useEffect, useRef, useState } from 'react'
// import { render } from '@testing-library/react';
import '../styles/main.css'
import tourlistTop20s from '../json/tourlistTop20s.json'
// import { Link } from 'react-router-dom';
import center from '../json/area_code4weather.json'
import reactStringReplace from 'react-string-replace'


const { kakao } = window;

const MapContainer = (props) => {

  const mapRef = useRef(); //지도의 현재 상태 저장

   
  useEffect(() => {
    let container = document.getElementById('map');
    let options = {
      center: new kakao.maps.LatLng(33.355, 126.563),
      level: 10
    };

    mapRef.current = new kakao.maps.Map(container, options);
  }, []);

  
  const tourlist = useRef(tourlistTop20s);
  const markerAr = useRef([]);
  const overlayAr = useRef([]);
  const overlayAr2 = useRef([]);

  //제출 버튼 클릭 시, 지도 레벨 조정
  useEffect(() => {
    var moveLatLon = new kakao.maps.LatLng(center[props.areaCode].latMap,center[props.areaCode].lngMap)
    mapRef.current.setCenter(moveLatLon);
      if(props.areaCode===12){
      mapRef.current.setLevel(10);
    } else{
      mapRef.current.setLevel(8);
    }
  },[props.search])


  useEffect(() => {

    markerAr.current.forEach(marker => {marker.setMap(null)});
    if ((props.tourlist)===undefined){
    } else{
      markerAr.current.length = 0;
      overlayAr.current.length = 0;
      overlayAr2.current.length = 0;
      tourlist.current = props.tourlist;
    }      
        

    const tourlistInfo = tourlist.current.map((info) => {

      return {
        title: info.subtitle,
        lat: info.latitude,
        lng: info.longitude,
        road: info.roadaddress, //roadaddress로 수정
        img: info.Imgpath,
        tag: reactStringReplace(info.tag, ',', (match, i) => (
          ' #'
        )).join(""),
        desc: info.introduction,
        rank: info.rank,
        info: info.sbst
      };
    });
 

   //위에서 만든  tourlist 각각에 대해서 마커 생성
    tourlistInfo.forEach(elm => {
    let marker = new kakao.maps.Marker({
      map: mapRef.current,
      position: new kakao.maps.LatLng(elm.lat, elm.lng),
      title: elm.title,
    });
    

    markerAr.current.push(marker);


      // ------------------------------  디테일뷰  ------------------------------

    let domContent2 = document.createElement('div'); //태그
    domContent2.classList.add('wrap2');// class

      let domInfo2 = document.createElement('div');     
      domInfo2.classList.add('info2');

        let domTitle2 = document.createElement('div');//태그
        domTitle2.classList.add('title2');//클래스
        domTitle2.onclick = function () {
            var moveLatLon = new kakao.maps.LatLng(center[props.areaCode].latMap,center[props.areaCode].lngMap)
            mapRef.current.setCenter(moveLatLon);
              if(props.areaCode===12){
              mapRef.current.setLevel(10);
            } else{
              mapRef.current.setLevel(9);
            }
            overlay2.setMap(null)
          };// end of domTitle2

          

          let titleText2 = document.createTextNode(elm.title); //제목추가 태그 내부 텍스트 추가    
          domTitle2.appendChild(titleText2); //닫기

          let domClose2 = document.createElement('div');
          domClose2.className = 'close2'; //클래스
          domClose2.id = 'close2';//아이디
          domTitle2.appendChild(domClose2);

        domInfo2.appendChild(domTitle2);


      let domBody2 = document.createElement('div');
      domBody2.classList.add('body2'); 

        let domImg2 = document.createElement('div');
        domImg2.classList.add('img2');

          let img2 = document.createElement("img");
            img2.classList.add('img2At')
            img2.src = elm.img;
          domImg2.appendChild(img2);

        domBody2.appendChild(domImg2);

        let domDesc2 = document.createElement('div');
        domDesc2.classList.add('desc2');

          let domTag = document.createElement('div');
          domTag.classList.add('tag');
          
            let domTagText = document.createElement('div');
            domTagText.classList.add('domTagText');
              let tagText = document.createTextNode("#"+elm.tag);
              domTagText.appendChild(tagText);
            domTag.appendChild(domTagText);

          domDesc2.appendChild(domTag);

          let adr = document.createElement('div');
          adr.classList.add('adr');
            let adrText = document.createTextNode(elm.road);
            adr.appendChild(adrText);
            
            let toMap2 = document.createElement('div');
            toMap2.classList.add('toMap2');
            toMap2.onclick = function () {
              window.open('https://map.kakao.com/link/map/'+elm.lat+','+elm.lng);
            };
              let mapUrl2 = document.createTextNode('🚙길찾기');
              toMap2.appendChild(mapUrl2);
            adr.appendChild(toMap2);
            
          domDesc2.appendChild(adr);

        let specInfo = document.createElement('div');
        specInfo.classList.add('specInfo');
          let specInfoText = document.createTextNode(elm.info);
          specInfo.appendChild(specInfoText);
        domDesc2.appendChild(specInfo);


        domBody2.appendChild(domDesc2);
    
      domInfo2.appendChild(domBody2);
    
    domContent2.appendChild(domInfo2);
    // ----------------------end of 디테일뷰------------------------------------


      
    //   ------------------------------ 심플뷰 ------------------------------
    let domContent = document.createElement('div'); //태그
    domContent.classList.add('wrap');// class

      let domInfo = document.createElement('div');
      domInfo.classList.add('info');

        let domTitle = document.createElement('div');//태그
        domTitle.classList.add('title');//클래스
        domTitle.onclick = function () {//온클릭 펑션
            var moveLatLon = new kakao.maps.LatLng(center[props.areaCode].latMap,center[props.areaCode].lngMap)
            mapRef.current.setCenter(moveLatLon);
              if(props.areaCode===12){
              mapRef.current.setLevel(10);
            } else{
              mapRef.current.setLevel(8);
            }
            overlay.setMap(null);      
          };
          let titleText = document.createTextNode(elm.title); //제목추가 태그 내부 텍스트 추가
          domTitle.appendChild(titleText); //닫기

          let domClose = document.createElement('div');
          domClose.className = 'close'; //클래스
          domClose.id = 'close';//아이디
          domTitle.appendChild(domClose);

        domInfo.appendChild(domTitle);

      let domBody = document.createElement('div');
      domBody.classList.add('body'); 

        let domImg = document.createElement('div');
        domImg.classList.add('img');

          let img = document.createElement("img");
            img.classList.add('imgAt')
          try {
            img.src = elm.img;
          } catch {
            img.src = '';
          }
          domImg.appendChild(img);
        domBody.appendChild(domImg);

        let domDesc = document.createElement('div');
        domDesc.classList.add('desc');

          let domEllipsisDesc = document.createElement('div');
          domEllipsisDesc.classList.add('spvInfo');

            let descText = document.createTextNode(elm.desc);
            domEllipsisDesc.appendChild(descText);

          domDesc.appendChild(domEllipsisDesc);
    
          let moreInfo = document.createElement('div');
          moreInfo.classList.add('moreInfo');
          moreInfo.onclick = function () {

            overlay.setMap(null);
            overlay2.setMap(mapRef.current);

          };
          let moreInfoText = document.createTextNode('더보기');
          moreInfo.appendChild(moreInfoText);
          domDesc.appendChild(moreInfo);


          let toMap = document.createElement('div');
          toMap.classList.add('toMap');
          toMap.onclick = function () {
            window.open('https://map.kakao.com/link/map/'+elm.lat+','+elm.lng);              
          };

            let mapUrl = document.createTextNode('🚗길찾기');
            toMap.appendChild(mapUrl);

          domDesc.appendChild(toMap);


        domBody.appendChild(domDesc);

      domInfo.appendChild(domBody);

    domContent.appendChild(domInfo);

      // ----------------------end of 심플뷰------------------------------------

    // -------------------------인포윈도우-----------------------------------
    let iwContent = document.createElement('div'); //태그
    iwContent.classList.add('infowindow');// class
      let infowindowText = document.createTextNode(elm.title); //제목추가 태그 내부 텍스트 추가
      iwContent.appendChild(infowindowText); //닫기

    const infowindow = new kakao.maps.InfoWindow({
        content : iwContent,
        disableAutoPan : true
    });
     


      //마커 클릭 시, 심플뷰 포토카드 
      let overlay = new kakao.maps.CustomOverlay({
        content: domContent,
        position: new kakao.maps.LatLng(elm.lat-0.005, elm.lng),
      });

      overlayAr.current.push(overlay);


      //위에서 생성한 마커를 클릭 했을때 심플뷰 포토카드 생성 이벤트
      kakao.maps.event.addListener(marker, 'click', function () {
        const moveLatLon = new kakao.maps.LatLng(elm.lat+0.015, elm.lng);
        mapRef.current.setCenter(moveLatLon);
        mapRef.current.setLevel(7);
        overlay.setMap(mapRef.current);
      });


      // //관광지 추천 리스트 클릭하면 마커 클릭 시와 동일하게 동작
      // document.getElementById(elm.title).addEventListener('click', function () {
      //   const moveLatLon = new kakao.maps.LatLng(elm.lat, elm.lng);
      //   mapRef.current.setCenter(moveLatLon);
      //   mapRef.current.setLevel(5);
      //   overlay.setMap(mapRef.current);
      //   });    
          


      // 포토카드 내부의 더보기 클릭 시, 디테일뷰 포토카드  
      let overlay2 = new kakao.maps.CustomOverlay({
        content: domContent2,
        position: new kakao.maps.LatLng(elm.lat-0.015, elm.lng-0.02),//포토카드 위치 변경
      });

      overlayAr2.current.push(overlay2);      


      //관광지 추천 리스트 마우스 오버 
        document.getElementById(elm.title).addEventListener('mouseover', function () {
          infowindow.open(mapRef.current, marker);
        }); 


      //관광지 추천 리스트 마우스 아웃
        document.getElementById(elm.title).addEventListener('mouseout', function () {
          infowindow.close();
        }); 



      // 제출 버튼 클릭 시, 지도위의 마커와 오버레이 지우기
      document.getElementById(`submitButton`).addEventListener('click', function () {
        marker.setMap(null);
        overlay.setMap(null);
        overlay2.setMap(null);
        markerAr.current.length = 0;
        overlayAr.current.length = 0;
        overlayAr2.current.length = 0;
        });
        
        
    });//end of tourlistInfo.forEach
  },);//end of useEffect
  // },[tourlist.current]);//end of useEffect


  return (
    <div className="flex mt-3">
      <div id="map" className="rounded-3xl" style={{width: "60vw", height: "55vh"}}>
      </div>
    </div>
  );

};  //end of const MapContainer


export default MapContainer;

// 참고 https://velog.io/@seokkitdo/React-kakao-map-api-%EC%97%AC%EB%9F%AC%EA%B0%9C-%EB%A7%88%EC%BB%A4%EC%99%80-%EC%BB%A4%EC%8A%A4%ED%85%80%EC%98%A4%EB%B2%84%EB%A0%88%EC%9D%B4

