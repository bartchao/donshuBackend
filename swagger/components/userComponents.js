exports.userSchema = {
  User: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        format: "int32",
        description: "userId"
      },
      account: {
        type: "string",
        description: "email"
      },
      username: {
        type: "string",
        description: "User name in view"
      },
      gender: {
        type: "string",
        description: "男/女"
      },
      birthday: {
        type: "string",
        format: "date",
        description: "出生年月日"
      },
      introduction: {
        type: "string",
        description: "使用者自我介紹"
      },
      phone: {
        type: "string",
        description: "Telephone number"
      },
      pictureUrl: {
        type: "string",
        description: "使用者頭像網址"
      },
      userTickets: {
        type: "object",
        description: "好食卷",
        properties: {
          hasUserTicket: {
            type: "boolean",
            description: "擁有好時卷"
          }
        }
      }
    }
  }
};
