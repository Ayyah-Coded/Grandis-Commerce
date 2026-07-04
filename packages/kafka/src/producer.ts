import type { Kafka, Producer } from "kafkajs";

export const createProducer = (kafka: Kafka) => {
  const producer: Producer = kafka.producer();

  const connect = async () => {
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        await producer.connect();
        return;
      } catch (error) {
        console.log(`Kafka producer connect attempt ${attempt} failed:`, error);
        if (attempt === 5) throw error;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  };
  const send = async (topic: string, message: object) => {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  };

  const disconnect = async () => {
    await producer.disconnect();
  };

  return { connect, send, disconnect };
};