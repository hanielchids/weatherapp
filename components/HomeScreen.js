import React, { useState, useEffect } from "react";
import {
  Image,
  ImageBackground,
  FlatList,
  Text,
  View,
  StyleSheet,
  StatusBar,
  TouchableHighlight,
  ActivityIndicator,
} from "react-native";
import LottieView from "lottie-react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { weatherConditions } from "../utils/weatherConditions";
import * as Location from "expo-location";

const api = {
  key: "",
  base: "https://api.openweathermap.org/data/2.5/",
};

const HomeScreen = ({ navigation }) => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [city, setCity] = useState(null);
  const [coordinates, setCoordinates] = useState({
    long: null,
    lat: null,
  });
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

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const regionName = await Location.reverseGeocodeAsync({
          longitude,
          latitude,
        });
        const cityName = regionName[0].city;

        setCoordinates({ lat: latitude, long: longitude });
        setCity(cityName);

        const weatherResponse = await fetch(
          `${api.base}weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=adee2681c1b31134e040b6e42bd659d1`
        );
        const weatherData = await weatherResponse.json();

        if (weatherData.name !== null) {
          setWeatherDetails({
            temp: Math.round(weatherData.main.temp),
            wea: weatherData.weather[0].main,
            city: cityName,
            country: weatherData.sys.country,
          });

          setTemperature({
            min: Math.round(weatherData.main.temp_min),
            max: Math.round(weatherData.main.temp_max),
          });

          setLoading(false);

          const forecastResponse = await fetch(
            `${api.base}forecast?lat=${latitude}&lon=${longitude}&units=metric&APPID=adee2681c1b31134e040b6e42bd659d1`
          );
          const forecastData = await forecastResponse.json();

          let forecast_ = [];
          for (
            let index = 7, k = 1;
            index < forecastData.cnt;
            index += 8, k++
          ) {
            let data = {
              key: k,
              temp: Math.round(forecastData.list[index].main.temp),
              wea: forecastData.list[index].weather[0].main,
            };
            forecast_.push(data);
          }
          setForecast(forecast_);
        } else {
          this.props.navigation.navigate("Home");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  let source, bgsource;

  switch (weatherDetails.wea) {
    case "Rain":
      bgsource = require("../assets/backgrounds/sea_rainy.png");
      source = require("../assets/icons/rain2.png");
      break;
    case "Clear":
      bgsource = require("../assets/backgrounds/sea_sunnypng.png");
      source = require("../assets/icons/clear2.png");
      break;
    case "Clouds":
      bgsource = require("../assets/backgrounds/sea_cloudy.png");
      source = require("../assets/icons/partlysunny2.png");
      break;
    case "Thunderstorm":
      bgsource = require("../assets/backgrounds/sea_rainy.png");
      source = require("../assets/icons/rain2.png");
      break;
    case "Snow":
      bgsource = require("../assets/backgrounds/sea_rainy.png");
      source = require("../assets/icons/rain2.png");
      break;
    case "Drizzle":
      bgsource = require("../assets/backgrounds/sea_rainy.png");
      source = require("../assets/icons/rain2.png");
      break;
    case "Haze":
      bgsource = require("../assets/backgrounds/sea_rainy.png");
      source = require("../assets/icons/rain2.png");
      break;
    case "Mist":
      bgsource = require("../assets/backgrounds/sea_rainy.png");
      source = require("../assets/icons/rain2.png");
      break;
    default:
      bgsource = require("../assets/backgrounds/sea_rainy.png");
      source = require("../assets/icons/clear2.png");
      break;
  }

  let offset = 1;
  const Item = ({ title }) => (
    <View
      style={{
        opacity: 0.9,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View style={{ width: "27%" }}>
        <Text
          style={{
            fontWeight: "300",
            marginBottom: 20,
            color: "white",
            textAlign: "left",
            fontSize: 20,
          }}
        >
          {dayBuilder(new Date(), offset++)}
        </Text>
      </View>
      <View>
        {/* <Icon
          style={styles.icon}
          name={
            weatherDetails.wea === undefined
              ? "circle-off-outline"
              : weatherConditions[weatherDetails.wea]?.icon
          }
          size={18}
          color={"white"}
        /> */}

        {weatherDetails.wea !== undefined ? (
          <Image style={[styles.icon, { marginBottom: 20 }]} source={source} />
        ) : (
          <Image
            style={styles.icon}
            source={require("../assets/icons/clear.png")}
          />
        )}
      </View>
      <View style={{ width: "30%" }}>
        <Text
          style={{
            fontWeight: "300",
            marginBottom: 20,
            color: "white",
            textAlign: "right",
            fontSize: 20,
          }}
        >
          {title}°
        </Text>
      </View>
    </View>
  );

  const search = () => {
    // setLoading(true);
    // fetch(
    //   `${api.base}weather?lat=${coordinates.lat}&lon=${coordinates.long}&units=metric&APPID=` +
    //     "adee2681c1b31134e040b6e42bd659d1"
    // )
    //   .then((res) => res.json())
    //   .then((result) => {
    //     console.log("api results: ", result);
    //     if (result.name !== null) {
    //       setWeatherDetails({
    //         temp: Math.round(result.main.temp),
    //         wea: result.weather[0].main,
    //         city: result.name,
    //         country: result.sys.country,
    //       });
    //     } else {
    //       this.props.navigation.navigate("Home");
    //     }
    //   });
    // fetch(
    //   `${api.base}forecast?lat=${coordinates.lat}&lon=${coordinates.long}&units=metric&APPID=adee2681c1b31134e040b6e42bd659d1`
    // )
    //   .then((res) => res.json())
    //   .then((result) => {
    //     setLoading(false);
    //     let forecast_ = [];
    //     for (let index = 7, k = 1; index < result.cnt; index += 8, k++) {
    //       let data = {
    //         key: k,
    //         temp: Math.round(result.list[index].main.temp),
    //         wea: result.list[index].weather[0].main,
    //       };
    //       forecast_.push(data);
    //     }
    //     setForecast(forecast_);
    //   });
  };

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
  const dateBuilder = (d) => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    return `${day}, ${month} ${date}`;
  };
  const renderItem = ({ item }) => <Item title={item.temp} />;
  return (
    <>
      {isLoading ? (
        <View style={styles.container}>
          {/* <LottieView
            source={require("./anim/loader_animation.json")}
            autoPlay
            loop
          /> */}
          <Text style={{ textAlign: "center" }}>
            Getting Weather Information
          </Text>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignContent: "center",
            marginTop: StatusBar.currentHeight || 0,
          }}
        >
          <ImageBackground
            style={{
              flex: 0.5,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
            source={bgsource}
            resizeMode="cover"
          >
            <Text
              style={{
                fontSize: 75,
                fontWeight: "300",
                color: "#fff",
                marginTop: 150,
                marginBottom: 10,
              }}
            >
              {weatherDetails.temp}°
            </Text>

            <Text
              style={{
                fontSize: 40,
                fontWeight: "500",
                color: "#fff",
              }}
            >
              {weatherDetails.wea.toUpperCase()}
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "200",
                color: "#fff",
                marginTop: 5,
                marginBottom: 10,
              }}
            >
              {city}
            </Text>
          </ImageBackground>
          <View
            style={{
              flex: 0.5,
              backgroundColor: "dodgerblue",
              // justifyContent: "center",
              // alignContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 15,
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontWeight: "300",
                  marginBottom: 10,
                  color: "white",
                  textAlign: "center",
                  fontSize: 15,
                }}
              >
                {temperature.min}° {"\n"}min
              </Text>
              <Text
                style={{
                  fontWeight: "300",
                  marginBottom: 10,
                  color: "white",
                  textAlign: "center",
                  fontSize: 15,
                }}
              >
                {weatherDetails.temp}° {"\n"}Current
              </Text>
              <Text
                style={{
                  fontWeight: "300",
                  marginBottom: 10,
                  color: "white",
                  textAlign: "center",
                  fontSize: 15,
                }}
              >
                {temperature.max}° {"\n"}max
              </Text>
            </View>
            <View
              style={{
                marginTop: 5,
                borderBottomColor: "white",
                borderBottomWidth: 1,
              }}
            />

            {/* List of dates */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 15,
                marginTop: 10,
              }}
            >
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

      {/* <View style={styles.container}>
        <ImageBackground
          style={[
            styles.background,
            // { backgroundColor: weatherConditions[weatherDetails.wea].color },
            { backgroundColor: "#f7b733" },
          ]}
        >
          <FlatList
            style={styles.flatList}
            data={forecast}
            renderItem={renderItem}
            keyExtractor={(item) => item.key}
          />
          <TouchableHighlight
            style={styles.button}
            onPress={() => console.log("Pressed")}
            //   onPress={() => search()}
            underlayColor="yellow"
          >
            <View>
              <Text style={styles.buttonText}>Get weather details</Text>
            </View>
          </TouchableHighlight>
        </ImageBackground>
      </View> */}
    </>
  );
};
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignContent: "center",
    marginTop: StatusBar.currentHeight || 0,
  },
  date: {
    marginTop: 100,
    fontSize: 30,
    fontWeight: "300",
    marginBottom: 10,
  },
  icon: {
    marginTop: 0,
  },
  button: {
    width: "50%",
    height: 50,
    marginBottom: 50,
    backgroundColor: "gold",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "black",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "300",
    color: "black",
  },
  temperature: {
    fontSize: 62,
    fontWeight: "100",
    margin: 5,
    marginTop: 20,
  },
  location: {
    fontSize: 16,
    fontWeight: "200",
    marginBottom: 10,
  },
  weatherType: {
    fontSize: 34,
    fontWeight: "500",
  },
  flatList: {
    width: "100%",
    marginTop: 20,
  },
  item: {
    backgroundColor: "white",
    opacity: 0.9,
    padding: 18,
    marginVertical: 7,
    marginHorizontal: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
  },
  day: {
    fontSize: 20,
    fontFamily: "Arial",
    marginRight: "0%",
    fontWeight: "200",
  },
  input: {
    borderWidth: 1,
    borderColor: "#666",
    height: 40,
    marginVertical: 20,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  background: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  searchButton: {
    width: "100%",
    height: 50,
    marginBottom: 200,
    backgroundColor: "#fcf",
  },
});

export default HomeScreen;
