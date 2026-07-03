import sendMail from "./utils/mailer";
import { createConsumer, createKafkaClient } from "@repo/kafka";

const kafka = createKafkaClient("email-service")
const consumer = createConsumer(kafka, "email-service")

const start = async () => {
  try {
    await consumer.connect()
    await consumer.subscribe([
      {
        topicName: "user.created",
        topicHandler: async (message) => {
          const { email, username } = message.value;

          if (email) {
            try {
              await sendMail({
                email,
                subject: "Welcome to Ecommerce Site",
                text: `Welcome ${username}. Your account has been created!`
              })
            } catch (error) {
              console.error("Failed to send welcome email:", error);
            }
          }
        }
      },
      {
        topicName: "order.created",
        topicHandler: async (message) => {
          const { email, amount, status } = message.value;

          if (email) {
            try {
              await sendMail({
                email,
                subject: "Order has been created",
                text: `Hello! Your order: Amount: ${amount / 100}, Status: ${status}`
              })
            } catch (error) {
              console.error("Failed to send welcome email:", error);
            }
          }
        }
      }
    ])
  } catch (error) {
    console.log(error)
  }
};

start();

const shutdown = async (signal: string) => {
  console.log(`${signal} received, shutting down gracefully...`);
  try {
    await consumer.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));