import React, { useEffect, useState } from 'react';
import { NavSidebar } from './NavSidebar';
import BodyWrapper from './BodyWrapper';
import MapContainer from './MapContainer';
import Weather from './Weather';


export const Layout = () => {
    const [selectDate, setSelectDate] = useState(0);
    const [date, setDate] = useState();
    const [areaCode, setAreaCode] = useState(12);
    const [areaCode4map, setAreaCode4map] = useState(12);
    const [spotId, setSpotId] = useState('');
    const [tourlist, setTourlist] = useState();
    const [search, setSearch] = useState(false);

    return (
        <BodyWrapper>
            <div
                style={{ justifyContent: 'center' }}
                //style={{backgroundColor: "#FFE0B2"}}
                className="flex h-screen bg-white p-2 m-3"
            >
                <NavSidebar className="w-5/12"
                    setSelectDate={setSelectDate}
                    setDate={setDate}
                    setAreaCode={setAreaCode}
                    setSpotId={setSpotId}
                    setTourlist={setTourlist}
                    setSearch={setSearch}
                    setAreaCode4map={setAreaCode4map}
                />

                <div className="w-7/12">
                    <main className="content">
                        <Weather 
                                    selectDate={selectDate}
                                    date={date}
                                    areaCode={areaCode}
                                    search={search}
                                    setSearch={setSearch}
                        />
                        <MapContainer 
                            areaCode={areaCode}
                            spotId={spotId}
                            tourlist={tourlist}
                            search={search}
                            areaCode4map={areaCode4map}
                        />
                    </main>
                </div>
            </div>
        </BodyWrapper>
    );
};

export default Layout;