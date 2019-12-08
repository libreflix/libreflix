import Watch from '../models/Watch';
import WatchTC from './watch';

import { schemaComposer } from "graphql-compose";

schemaComposer.Query.addFields({
    findByPermaLink: {
      type: 'Watch',
      args: { permalink: 'String!' },
      resolve: (_, { permalink }) => Watch.findOne( { 'permalink' : permalink })
    },
  });
  
  const schema = schemaComposer.buildSchema();
  
  export default schema;
  