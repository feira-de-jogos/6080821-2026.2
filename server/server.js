const mqtt = require("mqtt");

const BROKER_URL =
  process.env.MQTT_BROKER_URL || "wss://test.mosquitto.org:8081/mqtt";
const topicPrefix = process.env.MQTT_TOPIC_PREFIX || "6080821-2026.2";
const TOPIC = process.env.MQTT_TOPIC || `${topicPrefix}/server`;

const client = mqtt.connect(BROKER_URL);

client.on("connect", () => {
  console.log(`Connected to MQTT broker at ${BROKER_URL}`);

  client.subscribe(TOPIC, (err) => {
    if (err) {
      console.error(`Failed to subscribe to topic "${TOPIC}":`, err);
      return;
    }
    console.log(`Subscribed to topic "${TOPIC}"`);
  });
});

client.on("message", (topic, message) => {
  try {
    const payload = message.toString();
    console.log(`Received message on topic "${topic}": ${payload}`);

    let data;
    try {
      data = JSON.parse(payload);
    } catch (parseErr) {
      data = payload;
    }

    processMessage(topic, data);
  } catch (err) {
    console.error("Error processing message:", err);
  }
});

client.on("error", (err) => {
  console.error("MQTT client error:", err);
});

client.on("close", () => {
  console.log("MQTT connection closed");
});

function processMessage(topic, data) {
  console.log(`Processing message from topic "${topic}":`, data);
  client.publish(
    `${topicPrefix}/client`,
    JSON.stringify({ status: "received", data }),
  );
}

process.on("SIGINT", () => {
  client.end(() => {
    console.log("MQTT client disconnected. Exiting.");
    process.exit(0);
  });
});
