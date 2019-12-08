import { composeWithMongoose } from "graphql-compose-mongoose";

import Watch from '../models/Watch'
import User from '../models/User'

import UserTC from './user';

const customizationOptions = {
  fields: {
    remove: ['_id', 'criador']
  }
};

const WatchTC = composeWithMongoose(Watch, customizationOptions);
WatchTC.addFields({
  id: {
    type: 'String!',
    resolve: watch => {       
      return watch._id
    }
  },
  creator: {
    type: UserTC,
    resolve: watch => User.findById(watch.criador)
  }
});  

const WatchEpsTC = WatchTC.getFieldTC('eps');
WatchEpsTC.removeField('_id');

export default WatchTC;

 