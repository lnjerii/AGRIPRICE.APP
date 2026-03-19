
import { useEffect, useMemo, useState } from 'react';

type Coordinates = {
  lat: number;
  lng: number;
};

const DEFAULT_CENTER: Coordinates = { lat: -1.286389, lng: 36.817223 }; // Nairobi

function buildEmbedUrl(center: Coordinates) {
  const delta = 0.08;
  const left = center.lng - delta;
  const right = center.lng + delta;
  const top = center.lat + delta;
  const bottom = center.lat - delta;
  const bbox = `${left},${bottom},${right},${top}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${center.lat}%2C${center.lng}`;
}

function buildSearchUrl(center: Coordinates) {
  const q = encodeURIComponent(`agrovet near ${center.lat},${center.lng}`);
  return `https://www.openstreetmap.org/search?query=${q}`;
}

function buildGoogleEmbedUrl(center: Coordinates) {
  return `https://maps.google.com/maps?q=${center.lat},${center.lng}&z=13&output=embed`;
}

function buildGoogleSearchUrl(center: Coordinates) {
  const q = encodeURIComponent(`agrovet near ${center.lat},${center.lng}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export default function MapPlaceholder({ height = 280 }: { height?: number }) {
  const [center, setCenter] = useState<Coordinates>(DEFAULT_CENTER);
  const [geoStatus, setGeoStatus] = useState<'loading' | 'ready' | 'fallback'>('loading');
  const [provider, setProvider] = useState<'osm' | 'google'>('osm');

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoStatus('fallback');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoStatus('ready');
      },
      () => {
        setGeoStatus('fallback');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  const mapUrl = useMemo(() => buildEmbedUrl(center), [center]);
  const googleMapUrl = useMemo(() => buildGoogleEmbedUrl(center), [center]);
  const nearbySearchUrl = useMemo(() => buildSearchUrl(center), [center]);
  const googleSearchUrl = useMemo(() => buildGoogleSearchUrl(center), [center]);
  const activeMapUrl = provider === 'osm' ? mapUrl : googleMapUrl;

  useEffect(() => {
    setProvider('osm');
  }, [center]);

  useEffect(() => {
    if (provider !== 'osm') return;
    const t = setTimeout(() => setProvider('google'), 7000);
    return () => clearTimeout(t);
  }, [provider, activeMapUrl]);

  return (
    <div style={{ width: '100%', borderRadius: 8, overflow: 'hidden', border: '1px solid #cfe9d0' }}>
      <iframe
        title="Nearby agrovets map"
        src={activeMapUrl}
        style={{ width: '100%', height, border: 0, display: 'block' }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onError={() => setProvider('google')}
      />
      <div
        style={{
          padding: '10px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f7fcf8',
          borderTop: '1px solid #e1f1e3',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ color: '#3f7a52', fontSize: 12 }}>
          {geoStatus === 'loading' && 'Detecting your location...'}
          {geoStatus === 'ready' && 'Map centered on your current location.'}
          {geoStatus === 'fallback' && 'Location unavailable. Showing Nairobi center.'}
          {' '}
          {provider === 'google' && 'Using Google Maps fallback.'}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <a
            href={nearbySearchUrl}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#1f4d2d', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}
          >
            OpenStreetMap search
          </a>
          <a
            href={googleSearchUrl}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#1f4d2d', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}
          >
            Google Maps search
          </a>
        </div>
      </div>
    </div>
  );
}
