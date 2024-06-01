const express = require('express')
const mqtt = require("mqtt");
const path = require('path');

const app = express();
const port = 3000;

let mqttData = {};

const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

const topic = 'data/test1/TESTER1/+';

client.on("connect", async () => {
    console.log("MQTT connected");
    client.subscribe(topic);
});

client.on('message', async (topic, message) => {
 
      try {
          mqttData = JSON.parse(message.toString());
          console.log('Received message:', mqttData);
      } catch (error) {
          console.error('Error parsing JSON message:', error);
      }
  
});

//client.on("message", async (topic, message) => {

//  console.log('MQTT Recieved Topic:', topic.toString(), 'Message', message.toString())

//});

app.use(express.static(path.join(__dirname, 'public')));


app.post('/turn-on-light', (req, res) => {
  const message = JSON.stringify({ W1: "1" });
  client.publish('data/test2/TESTER2/1234', message, () => {
      res.json({ message: 'Light turned on with message: ' + message });
  });
});

// API để tắt đèn
app.post('/turn-off-light', (req, res) => {
  const message = JSON.stringify({ W1: "0" });
  client.publish('data/test2/TESTER2/1234', message, () => {
      res.json({ message: 'Light turned off with message: ' + message });
  });
});

app.get('/mqtt-data', (req, res) => {
  res.json(mqttData);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});