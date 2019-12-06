import mongoose from "mongoose";
import { composeWithMongoose } from "graphql-compose-mongoose";
import { schemaComposer } from "graphql-compose";
import Watch from '../models/Watch'

const customizationOptions = {};
const UserTC = composeWithMongoose(Watch, customizationOptions);

schemaComposer.Query.addFields({
  userById: UserTC.getResolver("findById"),
  userByIds: UserTC.getResolver("findByIds"),
  userOne: UserTC.getResolver("findOne")
});

schemaComposer.Mutation.addFields({
  userCreateOne: UserTC.getResolver("createOne"),
  userUpdateById: UserTC.getResolver("updateById"),
  userUpdateOne: UserTC.getResolver("updateOne")
});

const schema = schemaComposer.buildSchema();

export default schema;
