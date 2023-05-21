import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { useEffect, useState } from "react";
import Head from "next/head";
ChartJS.register(...registerables);

export default function HomePage() {
  const EspIp = process.env.NEXT_PUBLIC_ESP_IP;
  const [humidity, setHumidity] = useState(0);
  const [analog, setAnalog] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [temperatures, setTemperatures] = useState([0]);
  const [voltage, setVoltage] = useState(0);
  const [voltages, setVoltages] = useState([0]);
  const [pressure, setPressure] = useState(0);
  const [pressures, setPressures] = useState([0]);
  const [altitude, setAltitude] = useState(0);
  const [altitudes, setAltitudes] = useState([0]);
  const last10Temps = [];
  const last10Volts = [];
  const last10Pressure = [];
  const last10Altitude = [];

  useEffect(() => {
    const socket = new WebSocket(`ws://${EspIp}/ws`);
    socket.onopen = () => {
      console.log("Connected to esp");
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      setHumidity(data.humidity);

      if (last10Temps.length > 10) {
        last10Temps.shift();
      }
      last10Temps.push(data.temperature);
      setTemperatures(last10Temps);
      setTemperature(data.temperature);

      if (last10Volts.length > 10) {
        last10Volts.shift();
      }
      last10Volts.push(data.voltage);
      setVoltages(last10Volts);
      setVoltage(data.voltage);

      setAnalog(data.analog);

      if (last10Pressure.length > 10) {
        last10Pressure.shift();
      }
      last10Pressure.push(data.pressure);
      setPressures(last10Pressure);
      setPressure(data.pressure);

      if (last10Altitude.length > 10) {
        last10Altitude.shift();
      }
      last10Altitude.push(data.altitude);
      setAltitudes(last10Altitude);
      setAltitude(data.altitude);
    };
  }, []);
  return (
    <main className="flex flex-col justify-center items-center min-h-screen gap-10 py-20 bg-white">
      <Head>
        <title>ESP32 Sensor Dashboard</title>
      </Head>
      <h1>
        Humidity: {humidity}% <br />
        Temperature: {temperature}°C <br />
        Pressure: {pressure} Pa <br />
        Altitude: {altitude} meters
      </h1>
      
      <div className="flex gap-10 items-center">
        <div>
          <Doughnut
            data={{
              labels: ["Humidity"],
              datasets: [
                {
                  label: "Humidity",
                  data: [humidity, 100 - humidity],
                  borderWidth: 1,
                  backgroundColor: ["#0986DA", "#CA2FC8"],
                },
              ],
            }}
          />
        </div>
        <div>
          <Line
            data={{
              labels: temperatures.map((_, index) => index),
              datasets: [
                {
                  label: "Temperature",
                  data: temperatures,
                  borderWidth: 1,
                },
              ],
            }}
          />
        </div>
      </div>

      <div className="flex gap-10 items-center">
        <div>
          <Line
            data={{
              labels: voltages.map((_, index) => index),
              datasets: [
                {
                  label: "Voltage",
                  data: voltages,
                  borderWidth: 1,
                  borderColor: "#FAED30",
                  backgroundColor: "#F99C10",
                },
                {
                  label: "Max Voltage",
                  data: voltages.map(() => 3.3),
                  borderWidth: 1,
                  borderColor: "#EE4493",
                  backgroundColor: "#CD136A",
                },
              ],
            }}
          />
        </div>
        <div>
          <Bar
            data={{
              labels: ["Voltage"],
              datasets: [
                {
                  label: "Voltage",
                  data: [voltage],
                  borderWidth: 1,
                  borderColor: "#FAED30",
                  backgroundColor: "#F99C10",
                },
                {
                  label: "Max Voltage",
                  data: [3.3],
                  borderWidth: 1,
                  borderColor: "#EE4493",
                  backgroundColor: "#CD136A",
                },
              ],
            }}
          />
        </div>
      </div>

      <div className="flex gap-10 items-center">
        <div>
          <Doughnut
            data={{
              labels: ["Analog", ""],
              datasets: [
                {
                  label: "Analog",
                  data: [analog, 4095 - analog],
                  borderWidth: 1,
                  backgroundColor: ["#0986DA", "#CA2FC8"],
                },
              ],
            }}
          />
        </div>
        <div>
          <Bar
            data={{
              labels: ["Analog"],
              datasets: [
                {
                  label: "Analog",
                  data: [analog],
                  borderWidth: 1,
                },
                {
                  label: "Max Analog",
                  data: [4095],
                  borderWidth: 1,
                },
              ],
            }}
          />
        </div>
      </div>

      <div className="flex gap-10 items-center">
        <div>
          <Line 
            data={{
              labels: pressures.map((_, index) => index),
              datasets: [
                {
                  label: "Pressure",
                  data: pressures,
                  borderWidth: 1,
                  borderColor: "#FAED30",
                  backgroundColor: "#F99C10",
                },
              ],
            }}  
          />
        </div>
        <div>
          <Line
            data={{
              labels: altitudes.map((_, index) => index),
              datasets: [
                {
                  label: "Altitude",
                  data: altitudes,
                  borderWidth: 1,
                  borderColor: "#FAED30",
                  backgroundColor: "#F99C10",
                },
              ],
            }}
          />
        </div>
      </div>
    </main>
  );
}
