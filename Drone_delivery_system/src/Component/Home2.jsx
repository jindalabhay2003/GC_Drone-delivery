import React, { useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 37.7749,
  lng: -122.4194
};

const defaultMarker = {
  position: center,
  draggable: true
};

function App() {
  const [marker, setMarker] = useState(defaultMarker);

  const handleMarkerDragEnd = (e) => {
    const newMarker = {
      position: {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      },
      draggable: true
    };
    setMarker(newMarker);
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={13}
    >
      <Marker
        position={marker.position}
        draggable={marker.draggable}
        onDragEnd={handleMarkerDragEnd}
      />
    </GoogleMap>
  );
}

export default App;
