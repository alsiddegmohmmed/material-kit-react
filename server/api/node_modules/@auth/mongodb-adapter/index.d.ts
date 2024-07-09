/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p>Official <a href="https://www.mongodb.com">MongoDB</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://www.mongodb.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/mongodb.svg" width="30" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @auth/mongodb-adapter mongodb
 * ```
 *
 * @module @auth/mongodb-adapter
 */
import { ObjectId } from "mongodb";
import type { Adapter } from "@auth/core/adapters";
import type { MongoClient } from "mongodb";
/** This is the interface of the MongoDB adapter options. */
export interface MongoDBAdapterOptions {
    /**
     * The name of the {@link https://www.mongodb.com/docs/manual/core/databases-and-collections/#collections MongoDB collections}.
     */
    collections?: {
        Users?: string;
        Accounts?: string;
        Sessions?: string;
        VerificationTokens?: string;
    };
    /**
     * The name you want to give to the MongoDB database
     */
    databaseName?: string;
    /**
     * Callback function for managing the closing of the MongoDB client.
     * This could be useful in serverless environments, especially when `client`
     * is provided as a function returning Promise<MongoClient>, not just a simple promise.
     * It allows for more sophisticated management of database connections,
     * addressing persistence, container reuse, and connection closure issues.
     */
    onClose?: (client: MongoClient) => Promise<void>;
}
export declare const defaultCollections: Required<Required<MongoDBAdapterOptions>["collections"]>;
export declare const format: {
    /** Takes a MongoDB object and returns a plain old JavaScript object */
    from<T = Record<string, unknown>>(object: Record<string, any>): T;
    /** Takes a plain old JavaScript object and turns it into a MongoDB object */
    to<T_1 = Record<string, unknown>>(object: Record<string, any>): T_1 & {
        _id: ObjectId;
    };
};
export declare function MongoDBAdapter(
/**
 * The MongoDB client. You can either pass a promise that resolves to a `MongoClient` or a function that returns a promise that resolves to a `MongoClient`.
 * Using a function that returns a `Promise<MongoClient>` could be useful in serverless environments, particularly when combined with `options.onClose`, to efficiently handle database connections and address challenges with persistence, container reuse, and connection closure.
 * These functions enable either straightforward open-close database connections or more complex caching and connection reuse strategies.
 */
client: Promise<MongoClient> | (() => Promise<MongoClient>), options?: MongoDBAdapterOptions): Adapter;
//# sourceMappingURL=index.d.ts.map