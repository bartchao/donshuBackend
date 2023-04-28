exports.topicSchema = {
  Topic: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int32",
        description: "topicId"
      },
      topicName: {
        type: "string",
        description: "TopicName"
      }
    }
  }
};
