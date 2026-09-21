const CLIENT_ID_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function generateClientId() {
  let id = "";
  for (let i = 0; i < 4; i++) {
    id +=
      CLIENT_ID_LETTERS[Math.floor(Math.random() * CLIENT_ID_LETTERS.length)];
  }
  return id;
}

// Wrapper around the global `mqtt` (mqtt.min.js) browser client, shared across scenes via the game registry.
class MqttClient extends Phaser.Events.EventEmitter {
  constructor({ brokerUrl, topicPrefix }) {
    super();

    this.brokerUrl = brokerUrl;
    this.topicPrefix = topicPrefix;
    this.clientId = generateClientId();
    this.client = null;
  }

  connect() {
    if (this.client) return;

    this.client = mqtt.connect(this.brokerUrl, { clientId: this.clientId });

    this.client.on("connect", () => {
      console.log(`Connected to MQTT broker at ${this.brokerUrl}`);
      this.emit("connect");
    });

    this.client.on("message", (topic, message) => {
      let data;
      try {
        data = JSON.parse(message.toString());
      } catch (err) {
        data = message.toString();
      }

      // strip the shared prefix so scenes can listen using short topic names
      const shortTopic = topic.startsWith(`${this.topicPrefix}/`)
        ? topic.slice(this.topicPrefix.length + 1)
        : topic;

      this.emit("message", shortTopic, data);
      this.emit(`message:${shortTopic}`, data);
    });

    this.client.on("error", (err) => {
      console.error("MQTT client error:", err);
      this.emit("error", err);
    });

    this.client.on("close", () => {
      this.emit("close");
    });
  }

  subscribe(topic) {
    const fullTopic = `${this.topicPrefix}/${topic}`;
    this.client?.subscribe(fullTopic, (err) => {
      if (err) {
        console.error(`Failed to subscribe to topic "${fullTopic}":`, err);
        return;
      }
      console.log(`Subscribed to topic "${fullTopic}"`);
    });
  }

  publish(topic, data) {
    const fullTopic = `${this.topicPrefix}/${topic}`;
    const envelope =
      typeof data === "object" && data !== null
        ? { ...data, clientId: this.clientId }
        : { data, clientId: this.clientId };
    this.client?.publish(fullTopic, JSON.stringify(envelope));
  }

  disconnect() {
    this.client?.end();
    this.client = null;
  }
}

export default MqttClient;
