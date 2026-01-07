/**
 * Location Page Component
 * @description 오시는 길 페이지 (약도 및 교통편 안내)
 */

import React from 'react';
import LocationHero from '../../components/location/LocationHero/LocationHero';
import LocationMap from '../../components/location/LocationMap/LocationMap';
import TransportInfo from '../../components/location/TransportInfo/TransportInfo';
import styles from './Location.module.css';

const Location: React.FC = () => {
  return (
    <main className={styles.locationPage}>
      {/* Hero Section */}
      <LocationHero />

      {/* Map Section */}
      <LocationMap />
      

      {/* Transport Info Section */}
      <TransportInfo />
    </main>
  );
};

export default Location;
