import { Kafka } from "kafkajs";

const defaultBrokers = ["localhost:19094", "localhost:19095", "localhost:19096"];

export const createKafkaClient = (service: string) => {
  const brokers = process.env.KAFKA_BROKERS
    ? process.env.KAFKA_BROKERS.split(",").map((b) => b.trim())
    : defaultBrokers;

  return new Kafka({
    clientId: service,
    brokers,
  });
};