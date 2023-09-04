import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StatusBar,
  ImageBackground,
  TouchableHighlight,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ForecastScreen = () => {
  const [query, setQuery] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const apiKey = "adee2681c1b31134e040b6e42bd659d1"; // Replace with your OpenWeatherMap API key

  const searchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}`
      );

      setWeatherData(response.data);
      setError(null);
    } catch (err) {
      setError("City not found");
      setWeatherData(null);
    }
  };

  return (
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
          flex: weatherData ? 0.5 : 1,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
        source={require("../assets/backgrounds/sea_sunnypng.png")}
        resizeMode="cover"
      >
        <View
          style={{
            marginHorizontal: 15,
            marginTop: 150,
            marginBottom: 10,
            flexDirection: "row",
          }}
        >
          <TextInput
            style={{
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: "white",
              width: "80%",
              borderRadius: 20,
              height: 50,
              paddingHorizontal: 10,
            }}
            placeholder="Enter a city"
            value={query}
            onChangeText={(text) => setQuery(text)}
          />
          <TouchableHighlight
            style={{
              borderRadius: 50,
              backgroundColor: "#4a90e2",
              width: 50,
              height: 50,
              marginLeft: 5,
            }}
            onPress={searchWeather}
          >
            <View
              style={{
                alignItems: "center",
                padding: 10,
              }}
            >
              <Icon name={"search-outline"} size={30} color={"white"} />
            </View>
          </TouchableHighlight>
        </View>

        {error && <Text>{error}</Text>}

        {!weatherData ? (
          <View
            style={{
              flex: 0.5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon name={"cloudy-outline"} size={70} color={"white"} />

            <Text style={{ color: "white", fontSize: 15, fontWeight: "500" }}>
              Search for weather anywhere...
            </Text>
          </View>
        ) : (
          <View
            style={{
              flex: 0.5,
              backgroundColor: bgcolor,
            }}
          >
            <Text>City: {weatherData.name}</Text>
            <Text>Temperature: {weatherData.main.temp}°C</Text>
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

export default ForecastScreen;
