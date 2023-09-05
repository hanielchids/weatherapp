import React, { useState, useEffect } from "react";
import {
  Image,
  ImageBackground,
  FlatList,
  Text,
  View,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import styles from "../styles/styles";
import { weatherConditionMap } from "../utils/weatherUtils";

const api = {
  key: process.env.REACT_WEATHER_KEY,
  base: process.env.REACT_BASE_URL,
};

const HomeScreen = ({ navigation }) => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [temperature, setTemperature] = useState({
    min: null,
    max: null,
  });
  const [isLoading, setLoading] = useState(true);
  const [weatherDetails, setWeatherDetails] = useState({
    temp: 0,
    wea: "NIL",
    city: "NIL",
    country: "NIL",
  });
  const [forecast, setForecast] = useState([
    { key: "1", temp: 0, wea: "NIL" },
    { key: "2", temp: 0, wea: "NIL" },
    { key: "3", temp: 0, wea: "NIL" },
    { key: "4", temp: 0, wea: "NIL" },
    { key: "5", temp: 0, wea: "NIL" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const isConnected = await NetInfo.fetch().isConnected;

        if (!isConnected) {
          // If not connected to the internet, load data from local storage
          const storedWeatherData = await AsyncStorage.getItem("weatherData");

          if (storedWeatherData) {
            const parsedData = JSON.parse(storedWeatherData);
            setWeatherDetails(parsedData.weatherDetails);
            setTemperature(parsedData.temperature);
            setForecast(parsedData.forecast);
            setLoading(false);
            return;
          }
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const weatherResponse = await fetch(
          `${api.base}weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${api.key}`
        );

        const { main, weather, name, sys } = await weatherResponse.json();

        if (name !== null) {
          setWeatherDetails({
            temp: Math.round(main.temp),
            wea: weather[0].main,
            city: name,
            country: sys.country,
          });

          setTemperature({
            min: Math.round(main.temp_min),
            max: Math.round(main.temp_max),
          });

          const weatherDataToStore = {
            weatherDetails,
            temperature,
            forecast,
          };

          await AsyncStorage.setItem(
            "weatherData",
            JSON.stringify(weatherDataToStore)
          );

          setLoading(false);

          const forecastResponse = await fetch(
            `${api.base}forecast?lat=${latitude}&lon=${longitude}&units=metric&APPID=${api.key}`
          );

          const { cnt, list } = await forecastResponse.json();

          let forecast_ = [];
          for (let index = 7, k = 1; index < cnt; index += 8, k++) {
            let data = {
              key: k,
              temp: Math.round(list[index].main.temp),
              wea: list[index].weather[0].main,
            };
            forecast_.push(data);
          }
          setForecast(forecast_);
        } else {
          this.props.navigation.navigate("Home");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        console.error("Error fetching data:", errorMsg);
      }
    };

    fetchData();
  }, []);

  const { bgsource, source, bgcolor } =
    weatherConditionMap[weatherDetails.wea] || weatherConditionMap.Clear;

  let offset = 1;
  const Item = ({ title }) => (
    <View
      style={[
        styles.itemcontainer,
        {
          marginTop: StatusBar.currentHeight || 0,
        },
      ]}
    >
      <View style={{ width: "30%" }}>
        <Text style={styles.itemtext}>{dayBuilder(new Date(), offset++)}</Text>
      </View>
      <View>
        {weatherDetails.wea !== undefined ? (
          <Image style={{ marginBottom: 20 }} source={source} />
        ) : (
          <Image
            style={styles.icon}
            source={require("../assets/icons/clear.png")}
          />
        )}
      </View>
      <View style={{ width: "30%" }}>
        <Text style={styles.itemtemp}>{title}°</Text>
      </View>
    </View>
  );

  const dayBuilder = (d, offset) => {
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let day = days[(d.getDay() + offset) % 7];
    return `${day}`;
  };

  const renderItem = ({ item }) => <Item title={item.temp} />;
  return (
    <>
      {isLoading ? (
        <View style={styles.container}>
          <Text style={{ textAlign: "center" }}>
            Getting Weather Information
          </Text>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={styles.container}>
          <ImageBackground
            style={styles.background}
            source={bgsource}
            resizeMode="cover"
          >
            <Text style={styles.temperature}>{weatherDetails.temp}°</Text>

            <Text style={styles.title}>{weatherDetails.wea.toUpperCase()}</Text>
            <Text style={styles.city}>{weatherDetails.city}</Text>
          </ImageBackground>
          <View style={[styles.row, { backgroundColor: bgcolor }]}>
            <View style={styles.daytemp}>
              <Text style={styles.avtemp}>
                {temperature.min}° {"\n"}min
              </Text>
              <Text style={styles.avtemp}>
                {weatherDetails.temp}° {"\n"}Current
              </Text>
              <Text style={styles.avtemp}>
                {temperature.max}° {"\n"}max
              </Text>
            </View>
            <View style={styles.hr} />

            {/* List of dates */}
            <View style={styles.forecastContainer}>
              <FlatList
                style={styles.flatList}
                data={forecast}
                renderItem={renderItem}
                keyExtractor={(item) => item.key}
              />
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default HomeScreen;
