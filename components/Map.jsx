import React, { useRef, useEffect,useState } from "react";
import mapboxgl from "mapbox-gl";

export default function Map() {
  let mapContainer = useRef(null);
  //jkuat ipic coordinates (lat,lon) -1.0953775626377544, 37.01223403257954
  let [lng, setLng] = useState(37.01223403257954);
  let [lat, setLat] = useState(-1.0953775626377544);

  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1IjoidGhlcGFyYWRveDIwIiwiYSI6ImNsZHdlMnpyMTA2bGUzbnBob2Jld2l3NmUifQ.zrAEdfZdTfrWr9yvSuu9Xg";
    let map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: 17
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} style={{ width: "100%", height: "90%" }} />;
};

