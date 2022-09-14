import React from "react";
import tourlistTop20s from '../json/tourlistTop20s.json'
export const Test  = (props) => {

  
    return (
     <div style={{border:"solid 2px", width:"50vw", height:"50vh" }}>
       <div onClick={()=>props.setPhotoCardOn(false)}>닫기</div>
         <div class = "img"></div>
         <img src="+elm.img+" alt="함덕해수욕장" />
         
    </div>
    
    );
  };
  
  export default Test;