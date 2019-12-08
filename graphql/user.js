import User from '../models/User'
import { composeWithMongoose } from "graphql-compose-mongoose";

const customizationOptions = {
    fields: {
      remove: ['password','passwordResetToken', 'passwordResetExpires', '_id']
    }
  };
const UserTC = composeWithMongoose(User, customizationOptions);
UserTC.addFields({
    id: {
      type: 'String!',
      resolve: source => source._id
    }
});
  

export default UserTC;
