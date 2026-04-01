import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icons not loading properly in React due to Webpack/Vite paths
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom hook helper to update map center. It MUST return an actual JSX element (or empty fragment, but not null) in Leaflet v4
function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return <></>; // React leafet 4 requires children to be elements, not null.
}

const DaycareMap = ({ daycares }) => {
    // Center point of Bengaluru
    const defaultCenter = [12.9716, 77.5946];
    const defaultZoom = 11;

    // Filter out daycares without valid coordinates just in case
    const validDaycares = daycares.filter(d =>
        d.latitude != null &&
        d.longitude != null &&
        !isNaN(d.latitude) &&
        !isNaN(d.longitude)
    );

    // Calculate map center bounds dynamically based on the FIRST daycare in the filtered list
    let currentCenter = defaultCenter;
    let currentZoom = defaultZoom;

    if (validDaycares.length > 0) {
        currentCenter = [validDaycares[0].latitude, validDaycares[0].longitude];
        currentZoom = 12; // Zoom in closer when we have a specific location
    }

    return (
        <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-sm border border-gray-200 z-0 relative mt-8 mb-8">
            <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                scrollWheelZoom={false}
                className="w-full h-full z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <ChangeView center={currentCenter} zoom={currentZoom} />

                {validDaycares.map((daycare) => (
                    <Marker
                        key={daycare.id}
                        position={[daycare.latitude, daycare.longitude]}
                    >
                        <Popup className="min-w-[200px]">
                            <div className="font-sans">
                                <h3 className="font-bold text-gray-900 text-sm mb-1">{daycare.name}</h3>
                                <div className="flex items-center text-xs text-gray-600 mb-2">
                                    <span className="text-yellow-500 font-bold mr-1">★ {Number(daycare.overall_rating).toFixed(1)}</span>
                                    <span>({daycare.review_count} reviews)</span>
                                </div>
                                <div className="text-xs text-gray-700 font-medium mb-3">
                                    ₹{new Intl.NumberFormat('en-IN').format(daycare.monthly_fee)} / mo
                                </div>
                                <Link
                                    to={`/daycare/${daycare.id}`}
                                    className="block w-full text-center bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold py-1.5 px-3 rounded transition-colors"
                                >
                                    View Profile
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default DaycareMap;
