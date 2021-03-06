"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_request_1 = require("graphql-request");
const mongodb_1 = require("mongodb");
const types_1 = require("../__generated__/types");
class DataMapper {
    constructor(endpoint, authToken) {
        this.graphQLClient = new graphql_request_1.GraphQLClient(endpoint, {
            headers: {
                authorization: `BEARER ${authToken}`
            }
        });
        this.sdk = types_1.getSdk(this.graphQLClient);
    }
    generateObjectId() {
        const objectId = new mongodb_1.ObjectID();
        return objectId.toHexString();
    }
}
exports.default = DataMapper;
//# sourceMappingURL=data-mapper.js.map