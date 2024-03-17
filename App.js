import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Image, Platform, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import * as Location from 'expo-location'; // Import Location module from expo-location

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lat, setLat] = useState(''); // State for latitude
  const [lon, setLon] = useState(''); // State for longitude

  useEffect(() => {
    getLocationAndFetchWeather(); // Fetch location and weather data
  }, []);

  const fetchWeatherByLocation = async (lat, lon) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=b3588ce39fecc9f015fc2fcc60e11bad&units=metric`);
      const data = await response.json();
      if (response.ok) {
        setWeather({
          cityName: data.name,
          temperature: data.main.temp,
          mainCondition: data.weather[0].main,
        });
        setIsLoading(false);
      } else {
        throw new Error('Failed to load weather data');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getLocationAndFetchWeather = async () => {
    try {
      // Request permission to access device's location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      // Get device's current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Set latitude and longitude states
      setLat(latitude.toString());
      setLon(longitude.toString());

      // Fetch weather data using current location
      fetchWeatherByLocation(latitude, longitude);
    } catch (error) {
      console.error(error);
    }
  };

  const getWeatherAnimation = (mainCondition) => {
    if (!mainCondition) return require('./assets/sunny.json'); // Use require to specify image path

    switch (mainCondition.toLowerCase()) {
      case 'clouds':
      case 'mist':
      case 'smoke':
      case 'haze':
      case 'dust':
      case 'fog':
        return require('./assets/cloudy.json');
      case 'rain':
      case 'drizzle':
      case 'shower rain':
        return require('./assets/rain.json');
      case 'thunderstorm':
        return require('./assets/storm.json');
      case 'clear':
        return require('./assets/sunny.json');
      default:
        return require('./assets/sunny.json');
    }
  };

  const handleFetchWeather = () => {
    // Convert lat and lon to numbers before fetching weather data
    fetchWeatherByLocation(parseFloat(lat), parseFloat(lon));
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : weather ? (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ marginBottom: 20 }}>{weather.cityName}</Text>
          <LottieView
            source={getWeatherAnimation(weather.mainCondition)}
            style={{ width: 200, height: 200, marginBottom: 20 }}
          />
          <Text>{`${weather.temperature} °C`}</Text>
          <Text style={{ marginBottom: 20 }}>{weather.mainCondition}</Text>
        </View>
      ) : (
        <Text>Failed to load weather data</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    width: 200,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default WeatherApp;
