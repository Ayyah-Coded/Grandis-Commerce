import type { Kafka, Consumer } from "kafkajs";

export const createConsumer = (kafka: Kafka, groupId: string) => {
  const consumer: Consumer = kafka.consumer({ groupId });

  const connect = async () => {
    await consumer.connect();
    console.log("Kafka consumer connected:" + groupId);
  };

  const subscribe = async (
    topics: {
      topicName: string;
      topicHandler: (message: any) => Promise<void>;
    }[]
  ) => {
    const topicNames = topics.map((topic) => topic.topicName);

    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        await consumer.subscribe({
          topics: topicNames,
          fromBeginning: true,
        });

        await consumer.run({
          eachMessage: async ({ topic, message }) => {
            try {
              const topicConfig = topics.find((t) => t.topicName === topic);
              if (topicConfig) {
                const value = message.value?.toString();

                if (value) {
                  await topicConfig.topicHandler(JSON.parse(value));
                }
              }
            } catch (error) {
              console.log("Error processing message", error);
            }
          },
        });

        return;
      } catch (error) {
        console.log(`Kafka subscribe attempt ${attempt} failed:`, error);
        if (attempt === 5) throw error;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  };

  const disconnect = async () => {
    await consumer.disconnect();
  };

  return { connect, subscribe, disconnect };
};