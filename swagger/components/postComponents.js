exports.postSchema = {
  Post: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "postId"
      },
      typeId: {
        type: "integer",
        description: "typeId"
      },
      topicId: {
        type: "integer",
        description: "topicId"
      },
      title: {
        type: "string",
        description: "貼文標題"
      },
      startDate: {
        type: "string",
        format: "date",
        description: "公告開始日期"
      },
      endDate: {
        type: "string",
        format: "date",
        description: "公告結束日期"
      },
      position: {
        type: "string",
        description: "地點"
      },
      text: {
        type: "string",
        description: "內文"
      },
      latitude: {
        type: "string",
        description: "Latitude"
      },
      longitude: {
        type: "string",
        description: "Longitude"
      },
      userId: {
        type: "string",
        description: "貼文擁有者"
      },
      isNeed: {
        type: "boolean",
        description: "true=需求/false=資訊"
      },
      topic: { $ref: "#/definitions/Topic" },
      type: { $ref: "#/definitions/Type" },
      user: { $ref: "#/definitions/User" },
      files: {
        type: "array"
      },
      comments: {
        type: "array"
      }
    }
  }
};
