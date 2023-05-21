import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
ChartJS.register(...registerables);

function HomePage() {
  // const EspIp = process.env.NEXT_PUBLIC_ESP_IP;
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
  const [EspIP, setEspIP] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const last10Temps = [];
  const last10Volts = [];
  const last10Pressure = [];
  const last10Altitude = [];

  function handleSubmit(e) {
    e.preventDefault();
    const ip = e.target[0].value;
    setEspIP(ip);
    setShowPopup(false);
  }

  useEffect(() => {
    if (EspIP != "") {
      const socket = new WebSocket(`ws://${EspIP}/ws`);
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
        setPressure(data.pressure || 0);

        if (last10Altitude.length > 10) {
          last10Altitude.shift();
        }
        last10Altitude.push(data.altitude);
        setAltitudes(last10Altitude);
        setAltitude(data.altitude || 0);
      };
    } else {
      setShowPopup(true);
    }
  }, [EspIP]);
  return (
    <main className="flex flex-col justify-center items-center min-h-screen gap-10 py-20 bg-white text-black">
      <Head>
        <title>ESP32 Sensor Dashboard</title>
      </Head>

      {showPopup && (
        <div className="fixed grid place-items-center bg-black/40 w-full h-full top-0 backdrop-blur-[8px]">
          <form onSubmit={(e) => handleSubmit(e)} className="bg-white p-10 rounded-[16px]">
            <div className=" flex flex-col gap-2">
              <label className="text-center font-semibold">ESP IP</label>
              <input type="text" className=" !outline-none py-1 px-2" placeholder="192.168.69.1" />
              <div className="w-full h-[1px] bg-slate-200"></div>
            </div>
            <button className="bg-slate-200 rounded-[8px] hover:bg-slate-400 py-2 transition-colors duration-300 w-full mt-[20px]">
              Submit
            </button>
          </form>
        </div>
      )}

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

export default dynamic(() => Promise.resolve(HomePage), {
  ssr: false,
});
