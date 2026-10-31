# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetClient*](#getclient)
  - [*ListClients*](#listclients)
  - [*GetProduct*](#getproduct)
  - [*ListProducts*](#listproducts)
  - [*GetDeployment*](#getdeployment)
  - [*ListDeployments*](#listdeployments)
  - [*GetMetric*](#getmetric)
  - [*ListMetrics*](#listmetrics)
  - [*GetDependency*](#getdependency)
  - [*ListDependencies*](#listdependencies)
- [**Mutations**](#mutations)
  - [*CreateClientData*](#createclientdata)
  - [*UpdateClientData*](#updateclientdata)
  - [*DeleteClientData*](#deleteclientdata)
  - [*CreateProductData*](#createproductdata)
  - [*UpdateProductData*](#updateproductdata)
  - [*DeleteProductData*](#deleteproductdata)
  - [*CreateDeploymentData*](#createdeploymentdata)
  - [*UpdateDeploymentData*](#updatedeploymentdata)
  - [*DeleteDeploymentData*](#deletedeploymentdata)
  - [*CreateMetricData*](#createmetricdata)
  - [*UpdateMetricData*](#updatemetricdata)
  - [*DeleteMetricData*](#deletemetricdata)
  - [*CreateDependencyData*](#createdependencydata)
  - [*UpdateDependencyData*](#updatedependencydata)
  - [*DeleteDependencyData*](#deletedependencydata)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetClient
You can execute the `GetClient` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getClient(vars: GetClientVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientData, GetClientVariables>;

interface GetClientRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClientVariables): QueryRef<GetClientData, GetClientVariables>;
}
export const getClientRef: GetClientRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getClient(dc: DataConnect, vars: GetClientVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientData, GetClientVariables>;

interface GetClientRef {
  ...
  (dc: DataConnect, vars: GetClientVariables): QueryRef<GetClientData, GetClientVariables>;
}
export const getClientRef: GetClientRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getClientRef:
```typescript
const name = getClientRef.operationName;
console.log(name);
```

### Variables
The `GetClient` query requires an argument of type `GetClientVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetClientVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetClient` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetClientData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetClientData {
  client?: {
    companyName: string;
    contactEmail: string;
  };
}
```
### Using `GetClient`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getClient, GetClientVariables } from '@dataconnect/generated';

// The `GetClient` query requires an argument of type `GetClientVariables`:
const getClientVars: GetClientVariables = {
  id: ..., 
};

// Call the `getClient()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getClient(getClientVars);
// Variables can be defined inline as well.
const { data } = await getClient({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getClient(dataConnect, getClientVars);

console.log(data.client);

// Or, you can use the `Promise` API.
getClient(getClientVars).then((response) => {
  const data = response.data;
  console.log(data.client);
});
```

### Using `GetClient`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getClientRef, GetClientVariables } from '@dataconnect/generated';

// The `GetClient` query requires an argument of type `GetClientVariables`:
const getClientVars: GetClientVariables = {
  id: ..., 
};

// Call the `getClientRef()` function to get a reference to the query.
const ref = getClientRef(getClientVars);
// Variables can be defined inline as well.
const ref = getClientRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getClientRef(dataConnect, getClientVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.client);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.client);
});
```

## ListClients
You can execute the `ListClients` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listClients(options?: ExecuteQueryOptions): QueryPromise<ListClientsData, undefined>;

interface ListClientsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListClientsData, undefined>;
}
export const listClientsRef: ListClientsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listClients(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListClientsData, undefined>;

interface ListClientsRef {
  ...
  (dc: DataConnect): QueryRef<ListClientsData, undefined>;
}
export const listClientsRef: ListClientsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listClientsRef:
```typescript
const name = listClientsRef.operationName;
console.log(name);
```

### Variables
The `ListClients` query has no variables.
### Return Type
Recall that executing the `ListClients` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListClientsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListClientsData {
  clients: ({
    companyName: string;
    industry?: string | null;
  })[];
}
```
### Using `ListClients`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listClients } from '@dataconnect/generated';


// Call the `listClients()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listClients();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listClients(dataConnect);

console.log(data.clients);

// Or, you can use the `Promise` API.
listClients().then((response) => {
  const data = response.data;
  console.log(data.clients);
});
```

### Using `ListClients`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listClientsRef } from '@dataconnect/generated';


// Call the `listClientsRef()` function to get a reference to the query.
const ref = listClientsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listClientsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.clients);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.clients);
});
```

## GetProduct
You can execute the `GetProduct` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getProduct(vars: GetProductVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductData, GetProductVariables>;

interface GetProductRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProductVariables): QueryRef<GetProductData, GetProductVariables>;
}
export const getProductRef: GetProductRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getProduct(dc: DataConnect, vars: GetProductVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductData, GetProductVariables>;

interface GetProductRef {
  ...
  (dc: DataConnect, vars: GetProductVariables): QueryRef<GetProductData, GetProductVariables>;
}
export const getProductRef: GetProductRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getProductRef:
```typescript
const name = getProductRef.operationName;
console.log(name);
```

### Variables
The `GetProduct` query requires an argument of type `GetProductVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetProductVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetProduct` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetProductData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetProductData {
  product?: {
    name: string;
    version?: string | null;
  };
}
```
### Using `GetProduct`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getProduct, GetProductVariables } from '@dataconnect/generated';

// The `GetProduct` query requires an argument of type `GetProductVariables`:
const getProductVars: GetProductVariables = {
  id: ..., 
};

// Call the `getProduct()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getProduct(getProductVars);
// Variables can be defined inline as well.
const { data } = await getProduct({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getProduct(dataConnect, getProductVars);

console.log(data.product);

// Or, you can use the `Promise` API.
getProduct(getProductVars).then((response) => {
  const data = response.data;
  console.log(data.product);
});
```

### Using `GetProduct`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getProductRef, GetProductVariables } from '@dataconnect/generated';

// The `GetProduct` query requires an argument of type `GetProductVariables`:
const getProductVars: GetProductVariables = {
  id: ..., 
};

// Call the `getProductRef()` function to get a reference to the query.
const ref = getProductRef(getProductVars);
// Variables can be defined inline as well.
const ref = getProductRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getProductRef(dataConnect, getProductVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.product);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.product);
});
```

## ListProducts
You can execute the `ListProducts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listProducts(options?: ExecuteQueryOptions): QueryPromise<ListProductsData, undefined>;

interface ListProductsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProductsData, undefined>;
}
export const listProductsRef: ListProductsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listProducts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListProductsData, undefined>;

interface ListProductsRef {
  ...
  (dc: DataConnect): QueryRef<ListProductsData, undefined>;
}
export const listProductsRef: ListProductsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listProductsRef:
```typescript
const name = listProductsRef.operationName;
console.log(name);
```

### Variables
The `ListProducts` query has no variables.
### Return Type
Recall that executing the `ListProducts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListProductsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListProductsData {
  products: ({
    name: string;
    type: string;
  })[];
}
```
### Using `ListProducts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listProducts } from '@dataconnect/generated';


// Call the `listProducts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listProducts();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listProducts(dataConnect);

console.log(data.products);

// Or, you can use the `Promise` API.
listProducts().then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

### Using `ListProducts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listProductsRef } from '@dataconnect/generated';


// Call the `listProductsRef()` function to get a reference to the query.
const ref = listProductsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listProductsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.products);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.products);
});
```

## GetDeployment
You can execute the `GetDeployment` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getDeployment(vars: GetDeploymentVariables, options?: ExecuteQueryOptions): QueryPromise<GetDeploymentData, GetDeploymentVariables>;

interface GetDeploymentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDeploymentVariables): QueryRef<GetDeploymentData, GetDeploymentVariables>;
}
export const getDeploymentRef: GetDeploymentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getDeployment(dc: DataConnect, vars: GetDeploymentVariables, options?: ExecuteQueryOptions): QueryPromise<GetDeploymentData, GetDeploymentVariables>;

interface GetDeploymentRef {
  ...
  (dc: DataConnect, vars: GetDeploymentVariables): QueryRef<GetDeploymentData, GetDeploymentVariables>;
}
export const getDeploymentRef: GetDeploymentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getDeploymentRef:
```typescript
const name = getDeploymentRef.operationName;
console.log(name);
```

### Variables
The `GetDeployment` query requires an argument of type `GetDeploymentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetDeploymentVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetDeployment` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetDeploymentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetDeploymentData {
  deployment?: {
    status: string;
    region?: string | null;
  };
}
```
### Using `GetDeployment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getDeployment, GetDeploymentVariables } from '@dataconnect/generated';

// The `GetDeployment` query requires an argument of type `GetDeploymentVariables`:
const getDeploymentVars: GetDeploymentVariables = {
  id: ..., 
};

// Call the `getDeployment()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getDeployment(getDeploymentVars);
// Variables can be defined inline as well.
const { data } = await getDeployment({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getDeployment(dataConnect, getDeploymentVars);

console.log(data.deployment);

// Or, you can use the `Promise` API.
getDeployment(getDeploymentVars).then((response) => {
  const data = response.data;
  console.log(data.deployment);
});
```

### Using `GetDeployment`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getDeploymentRef, GetDeploymentVariables } from '@dataconnect/generated';

// The `GetDeployment` query requires an argument of type `GetDeploymentVariables`:
const getDeploymentVars: GetDeploymentVariables = {
  id: ..., 
};

// Call the `getDeploymentRef()` function to get a reference to the query.
const ref = getDeploymentRef(getDeploymentVars);
// Variables can be defined inline as well.
const ref = getDeploymentRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getDeploymentRef(dataConnect, getDeploymentVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.deployment);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.deployment);
});
```

## ListDeployments
You can execute the `ListDeployments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listDeployments(options?: ExecuteQueryOptions): QueryPromise<ListDeploymentsData, undefined>;

interface ListDeploymentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListDeploymentsData, undefined>;
}
export const listDeploymentsRef: ListDeploymentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listDeployments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListDeploymentsData, undefined>;

interface ListDeploymentsRef {
  ...
  (dc: DataConnect): QueryRef<ListDeploymentsData, undefined>;
}
export const listDeploymentsRef: ListDeploymentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listDeploymentsRef:
```typescript
const name = listDeploymentsRef.operationName;
console.log(name);
```

### Variables
The `ListDeployments` query has no variables.
### Return Type
Recall that executing the `ListDeployments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListDeploymentsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListDeploymentsData {
  deployments: ({
    status: string;
    deploymentDate: DateString;
  })[];
}
```
### Using `ListDeployments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listDeployments } from '@dataconnect/generated';


// Call the `listDeployments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listDeployments();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listDeployments(dataConnect);

console.log(data.deployments);

// Or, you can use the `Promise` API.
listDeployments().then((response) => {
  const data = response.data;
  console.log(data.deployments);
});
```

### Using `ListDeployments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listDeploymentsRef } from '@dataconnect/generated';


// Call the `listDeploymentsRef()` function to get a reference to the query.
const ref = listDeploymentsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listDeploymentsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.deployments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.deployments);
});
```

## GetMetric
You can execute the `GetMetric` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMetric(vars: GetMetricVariables, options?: ExecuteQueryOptions): QueryPromise<GetMetricData, GetMetricVariables>;

interface GetMetricRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMetricVariables): QueryRef<GetMetricData, GetMetricVariables>;
}
export const getMetricRef: GetMetricRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMetric(dc: DataConnect, vars: GetMetricVariables, options?: ExecuteQueryOptions): QueryPromise<GetMetricData, GetMetricVariables>;

interface GetMetricRef {
  ...
  (dc: DataConnect, vars: GetMetricVariables): QueryRef<GetMetricData, GetMetricVariables>;
}
export const getMetricRef: GetMetricRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMetricRef:
```typescript
const name = getMetricRef.operationName;
console.log(name);
```

### Variables
The `GetMetric` query requires an argument of type `GetMetricVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetMetricVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetMetric` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMetricData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMetricData {
  metric?: {
    metricName: string;
    value: number;
  };
}
```
### Using `GetMetric`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMetric, GetMetricVariables } from '@dataconnect/generated';

// The `GetMetric` query requires an argument of type `GetMetricVariables`:
const getMetricVars: GetMetricVariables = {
  id: ..., 
};

// Call the `getMetric()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMetric(getMetricVars);
// Variables can be defined inline as well.
const { data } = await getMetric({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMetric(dataConnect, getMetricVars);

console.log(data.metric);

// Or, you can use the `Promise` API.
getMetric(getMetricVars).then((response) => {
  const data = response.data;
  console.log(data.metric);
});
```

### Using `GetMetric`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMetricRef, GetMetricVariables } from '@dataconnect/generated';

// The `GetMetric` query requires an argument of type `GetMetricVariables`:
const getMetricVars: GetMetricVariables = {
  id: ..., 
};

// Call the `getMetricRef()` function to get a reference to the query.
const ref = getMetricRef(getMetricVars);
// Variables can be defined inline as well.
const ref = getMetricRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMetricRef(dataConnect, getMetricVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.metric);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.metric);
});
```

## ListMetrics
You can execute the `ListMetrics` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMetrics(options?: ExecuteQueryOptions): QueryPromise<ListMetricsData, undefined>;

interface ListMetricsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMetricsData, undefined>;
}
export const listMetricsRef: ListMetricsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMetrics(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMetricsData, undefined>;

interface ListMetricsRef {
  ...
  (dc: DataConnect): QueryRef<ListMetricsData, undefined>;
}
export const listMetricsRef: ListMetricsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMetricsRef:
```typescript
const name = listMetricsRef.operationName;
console.log(name);
```

### Variables
The `ListMetrics` query has no variables.
### Return Type
Recall that executing the `ListMetrics` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMetricsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMetricsData {
  metrics: ({
    metricName: string;
    value: number;
  })[];
}
```
### Using `ListMetrics`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMetrics } from '@dataconnect/generated';


// Call the `listMetrics()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMetrics();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMetrics(dataConnect);

console.log(data.metrics);

// Or, you can use the `Promise` API.
listMetrics().then((response) => {
  const data = response.data;
  console.log(data.metrics);
});
```

### Using `ListMetrics`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMetricsRef } from '@dataconnect/generated';


// Call the `listMetricsRef()` function to get a reference to the query.
const ref = listMetricsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMetricsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.metrics);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.metrics);
});
```

## GetDependency
You can execute the `GetDependency` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getDependency(vars: GetDependencyVariables, options?: ExecuteQueryOptions): QueryPromise<GetDependencyData, GetDependencyVariables>;

interface GetDependencyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDependencyVariables): QueryRef<GetDependencyData, GetDependencyVariables>;
}
export const getDependencyRef: GetDependencyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getDependency(dc: DataConnect, vars: GetDependencyVariables, options?: ExecuteQueryOptions): QueryPromise<GetDependencyData, GetDependencyVariables>;

interface GetDependencyRef {
  ...
  (dc: DataConnect, vars: GetDependencyVariables): QueryRef<GetDependencyData, GetDependencyVariables>;
}
export const getDependencyRef: GetDependencyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getDependencyRef:
```typescript
const name = getDependencyRef.operationName;
console.log(name);
```

### Variables
The `GetDependency` query requires an argument of type `GetDependencyVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetDependencyVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetDependency` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetDependencyData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetDependencyData {
  dependency?: {
    connectionType?: string | null;
  };
}
```
### Using `GetDependency`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getDependency, GetDependencyVariables } from '@dataconnect/generated';

// The `GetDependency` query requires an argument of type `GetDependencyVariables`:
const getDependencyVars: GetDependencyVariables = {
  id: ..., 
};

// Call the `getDependency()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getDependency(getDependencyVars);
// Variables can be defined inline as well.
const { data } = await getDependency({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getDependency(dataConnect, getDependencyVars);

console.log(data.dependency);

// Or, you can use the `Promise` API.
getDependency(getDependencyVars).then((response) => {
  const data = response.data;
  console.log(data.dependency);
});
```

### Using `GetDependency`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getDependencyRef, GetDependencyVariables } from '@dataconnect/generated';

// The `GetDependency` query requires an argument of type `GetDependencyVariables`:
const getDependencyVars: GetDependencyVariables = {
  id: ..., 
};

// Call the `getDependencyRef()` function to get a reference to the query.
const ref = getDependencyRef(getDependencyVars);
// Variables can be defined inline as well.
const ref = getDependencyRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getDependencyRef(dataConnect, getDependencyVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.dependency);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.dependency);
});
```

## ListDependencies
You can execute the `ListDependencies` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listDependencies(options?: ExecuteQueryOptions): QueryPromise<ListDependenciesData, undefined>;

interface ListDependenciesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListDependenciesData, undefined>;
}
export const listDependenciesRef: ListDependenciesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listDependencies(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListDependenciesData, undefined>;

interface ListDependenciesRef {
  ...
  (dc: DataConnect): QueryRef<ListDependenciesData, undefined>;
}
export const listDependenciesRef: ListDependenciesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listDependenciesRef:
```typescript
const name = listDependenciesRef.operationName;
console.log(name);
```

### Variables
The `ListDependencies` query has no variables.
### Return Type
Recall that executing the `ListDependencies` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListDependenciesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListDependenciesData {
  dependencies: ({
    connectionType?: string | null;
  })[];
}
```
### Using `ListDependencies`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listDependencies } from '@dataconnect/generated';


// Call the `listDependencies()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listDependencies();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listDependencies(dataConnect);

console.log(data.dependencies);

// Or, you can use the `Promise` API.
listDependencies().then((response) => {
  const data = response.data;
  console.log(data.dependencies);
});
```

### Using `ListDependencies`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listDependenciesRef } from '@dataconnect/generated';


// Call the `listDependenciesRef()` function to get a reference to the query.
const ref = listDependenciesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listDependenciesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.dependencies);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.dependencies);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateClientData
You can execute the `CreateClientData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createClientData(vars: CreateClientDataVariables): MutationPromise<CreateClientDataData, CreateClientDataVariables>;

interface CreateClientDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateClientDataVariables): MutationRef<CreateClientDataData, CreateClientDataVariables>;
}
export const createClientDataRef: CreateClientDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createClientData(dc: DataConnect, vars: CreateClientDataVariables): MutationPromise<CreateClientDataData, CreateClientDataVariables>;

interface CreateClientDataRef {
  ...
  (dc: DataConnect, vars: CreateClientDataVariables): MutationRef<CreateClientDataData, CreateClientDataVariables>;
}
export const createClientDataRef: CreateClientDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createClientDataRef:
```typescript
const name = createClientDataRef.operationName;
console.log(name);
```

### Variables
The `CreateClientData` mutation requires an argument of type `CreateClientDataVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateClientDataVariables {
  companyName: string;
  contactEmail: string;
}
```
### Return Type
Recall that executing the `CreateClientData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateClientDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateClientDataData {
  client_insert: Client_Key;
}
```
### Using `CreateClientData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createClientData, CreateClientDataVariables } from '@dataconnect/generated';

// The `CreateClientData` mutation requires an argument of type `CreateClientDataVariables`:
const createClientDataVars: CreateClientDataVariables = {
  companyName: ..., 
  contactEmail: ..., 
};

// Call the `createClientData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createClientData(createClientDataVars);
// Variables can be defined inline as well.
const { data } = await createClientData({ companyName: ..., contactEmail: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createClientData(dataConnect, createClientDataVars);

console.log(data.client_insert);

// Or, you can use the `Promise` API.
createClientData(createClientDataVars).then((response) => {
  const data = response.data;
  console.log(data.client_insert);
});
```

### Using `CreateClientData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createClientDataRef, CreateClientDataVariables } from '@dataconnect/generated';

// The `CreateClientData` mutation requires an argument of type `CreateClientDataVariables`:
const createClientDataVars: CreateClientDataVariables = {
  companyName: ..., 
  contactEmail: ..., 
};

// Call the `createClientDataRef()` function to get a reference to the mutation.
const ref = createClientDataRef(createClientDataVars);
// Variables can be defined inline as well.
const ref = createClientDataRef({ companyName: ..., contactEmail: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createClientDataRef(dataConnect, createClientDataVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.client_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.client_insert);
});
```

## UpdateClientData
You can execute the `UpdateClientData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateClientData(vars: UpdateClientDataVariables): MutationPromise<UpdateClientDataData, UpdateClientDataVariables>;

interface UpdateClientDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateClientDataVariables): MutationRef<UpdateClientDataData, UpdateClientDataVariables>;
}
export const updateClientDataRef: UpdateClientDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateClientData(dc: DataConnect, vars: UpdateClientDataVariables): MutationPromise<UpdateClientDataData, UpdateClientDataVariables>;

interface UpdateClientDataRef {
  ...
  (dc: DataConnect, vars: UpdateClientDataVariables): MutationRef<UpdateClientDataData, UpdateClientDataVariables>;
}
export const updateClientDataRef: UpdateClientDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateClientDataRef:
```typescript
const name = updateClientDataRef.operationName;
console.log(name);
```

### Variables
The `UpdateClientData` mutation requires an argument of type `UpdateClientDataVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateClientDataVariables {
  id: UUIDString;
  companyName?: string | null;
}
```
### Return Type
Recall that executing the `UpdateClientData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateClientDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateClientDataData {
  client_update?: Client_Key | null;
}
```
### Using `UpdateClientData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateClientData, UpdateClientDataVariables } from '@dataconnect/generated';

// The `UpdateClientData` mutation requires an argument of type `UpdateClientDataVariables`:
const updateClientDataVars: UpdateClientDataVariables = {
  id: ..., 
  companyName: ..., // optional
};

// Call the `updateClientData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateClientData(updateClientDataVars);
// Variables can be defined inline as well.
const { data } = await updateClientData({ id: ..., companyName: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateClientData(dataConnect, updateClientDataVars);

console.log(data.client_update);

// Or, you can use the `Promise` API.
updateClientData(updateClientDataVars).then((response) => {
  const data = response.data;
  console.log(data.client_update);
});
```

### Using `UpdateClientData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateClientDataRef, UpdateClientDataVariables } from '@dataconnect/generated';

// The `UpdateClientData` mutation requires an argument of type `UpdateClientDataVariables`:
const updateClientDataVars: UpdateClientDataVariables = {
  id: ..., 
  companyName: ..., // optional
};

// Call the `updateClientDataRef()` function to get a reference to the mutation.
const ref = updateClientDataRef(updateClientDataVars);
// Variables can be defined inline as well.
const ref = updateClientDataRef({ id: ..., companyName: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateClientDataRef(dataConnect, updateClientDataVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.client_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.client_update);
});
```

## DeleteClientData
You can execute the `DeleteClientData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteClientData(vars: DeleteClientDataVariables): MutationPromise<DeleteClientDataData, DeleteClientDataVariables>;

interface DeleteClientDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteClientDataVariables): MutationRef<DeleteClientDataData, DeleteClientDataVariables>;
}
export const deleteClientDataRef: DeleteClientDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteClientData(dc: DataConnect, vars: DeleteClientDataVariables): MutationPromise<DeleteClientDataData, DeleteClientDataVariables>;

interface DeleteClientDataRef {
  ...
  (dc: DataConnect, vars: DeleteClientDataVariables): MutationRef<DeleteClientDataData, DeleteClientDataVariables>;
}
export const deleteClientDataRef: DeleteClientDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteClientDataRef:
```typescript
const name = deleteClientDataRef.operationName;
console.log(name);
```

### Variables
The `DeleteClientData` mutation requires an argument of type `DeleteClientDataVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteClientDataVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteClientData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteClientDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteClientDataData {
  client_delete?: Client_Key | null;
}
```
### Using `DeleteClientData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteClientData, DeleteClientDataVariables } from '@dataconnect/generated';

// The `DeleteClientData` mutation requires an argument of type `DeleteClientDataVariables`:
const deleteClientDataVars: DeleteClientDataVariables = {
  id: ..., 
};

// Call the `deleteClientData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteClientData(deleteClientDataVars);
// Variables can be defined inline as well.
const { data } = await deleteClientData({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteClientData(dataConnect, deleteClientDataVars);

console.log(data.client_delete);

// Or, you can use the `Promise` API.
deleteClientData(deleteClientDataVars).then((response) => {
  const data = response.data;
  console.log(data.client_delete);
});
```

### Using `DeleteClientData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteClientDataRef, DeleteClientDataVariables } from '@dataconnect/generated';

// The `DeleteClientData` mutation requires an argument of type `DeleteClientDataVariables`:
const deleteClientDataVars: DeleteClientDataVariables = {
  id: ..., 
};

// Call the `deleteClientDataRef()` function to get a reference to the mutation.
const ref = deleteClientDataRef(deleteClientDataVars);
// Variables can be defined inline as well.
const ref = deleteClientDataRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteClientDataRef(dataConnect, deleteClientDataVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.client_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.client_delete);
});
```

## CreateProductData
You can execute the `CreateProductData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createProductData(vars: CreateProductDataVariables): MutationPromise<CreateProductDataData, CreateProductDataVariables>;

interface CreateProductDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProductDataVariables): MutationRef<CreateProductDataData, CreateProductDataVariables>;
}
export const createProductDataRef: CreateProductDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createProductData(dc: DataConnect, vars: CreateProductDataVariables): MutationPromise<CreateProductDataData, CreateProductDataVariables>;

interface CreateProductDataRef {
  ...
  (dc: DataConnect, vars: CreateProductDataVariables): MutationRef<CreateProductDataData, CreateProductDataVariables>;
}
export const createProductDataRef: CreateProductDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createProductDataRef:
```typescript
const name = createProductDataRef.operationName;
console.log(name);
```

### Variables
The `CreateProductData` mutation requires an argument of type `CreateProductDataVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateProductDataVariables {
  name: string;
  type: string;
}
```
### Return Type
Recall that executing the `CreateProductData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateProductDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateProductDataData {
  product_insert: Product_Key;
}
```
### Using `CreateProductData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createProductData, CreateProductDataVariables } from '@dataconnect/generated';

// The `CreateProductData` mutation requires an argument of type `CreateProductDataVariables`:
const createProductDataVars: CreateProductDataVariables = {
  name: ..., 
  type: ..., 
};

// Call the `createProductData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createProductData(createProductDataVars);
// Variables can be defined inline as well.
const { data } = await createProductData({ name: ..., type: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createProductData(dataConnect, createProductDataVars);

console.log(data.product_insert);

// Or, you can use the `Promise` API.
createProductData(createProductDataVars).then((response) => {
  const data = response.data;
  console.log(data.product_insert);
});
```

### Using `CreateProductData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createProductDataRef, CreateProductDataVariables } from '@dataconnect/generated';

// The `CreateProductData` mutation requires an argument of type `CreateProductDataVariables`:
const createProductDataVars: CreateProductDataVariables = {
  name: ..., 
  type: ..., 
};

// Call the `createProductDataRef()` function to get a reference to the mutation.
const ref = createProductDataRef(createProductDataVars);
// Variables can be defined inline as well.
const ref = createProductDataRef({ name: ..., type: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createProductDataRef(dataConnect, createProductDataVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.product_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.product_insert);
});
```

## UpdateProductData
You can execute the `UpdateProductData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateProductData(vars: UpdateProductDataVariables): MutationPromise<UpdateProductDataData, UpdateProductDataVariables>;

interface UpdateProductDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProductDataVariables): MutationRef<UpdateProductDataData, UpdateProductDataVariables>;
}
export const updateProductDataRef: UpdateProductDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateProductData(dc: DataConnect, vars: UpdateProductDataVariables): MutationPromise<UpdateProductDataData, UpdateProductDataVariables>;

interface UpdateProductDataRef {
  ...
  (dc: DataConnect, vars: UpdateProductDataVariables): MutationRef<UpdateProductDataData, UpdateProductDataVariables>;
}
export const updateProductDataRef: UpdateProductDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateProductDataRef:
```typescript
const name = updateProductDataRef.operationName;
console.log(name);
```

### Variables
The `UpdateProductData` mutation requires an argument of type `UpdateProductDataVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateProductDataVariables {
  id: UUIDString;
  description?: string | null;
}
```
### Return Type
Recall that executing the `UpdateProductData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateProductDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateProductDataData {
  product_update?: Product_Key | null;
}
```
### Using `UpdateProductData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateProductData, UpdateProductDataVariables } from '@dataconnect/generated';

// The `UpdateProductData` mutation requires an argument of type `UpdateProductDataVariables`:
const updateProductDataVars: UpdateProductDataVariables = {
  id: ..., 
  description: ..., // optional
};

// Call the `updateProductData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateProductData(updateProductDataVars);
// Variables can be defined inline as well.
const { data } = await updateProductData({ id: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateProductData(dataConnect, updateProductDataVars);

console.log(data.product_update);

// Or, you can use the `Promise` API.
updateProductData(updateProductDataVars).then((response) => {
  const data = response.data;
  console.log(data.product_update);
});
```

### Using `UpdateProductData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateProductDataRef, UpdateProductDataVariables } from '@dataconnect/generated';

// The `UpdateProductData` mutation requires an argument of type `UpdateProductDataVariables`:
const updateProductDataVars: UpdateProductDataVariables = {
  id: ..., 
  description: ..., // optional
};

// Call the `updateProductDataRef()` function to get a reference to the mutation.
const ref = updateProductDataRef(updateProductDataVars);
// Variables can be defined inline as well.
const ref = updateProductDataRef({ id: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateProductDataRef(dataConnect, updateProductDataVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.product_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.product_update);
});
```

## DeleteProductData
You can execute the `DeleteProductData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteProductData(vars: DeleteProductDataVariables): MutationPromise<DeleteProductDataData, DeleteProductDataVariables>;

interface DeleteProductDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProductDataVariables): MutationRef<DeleteProductDataData, DeleteProductDataVariables>;
}
export const deleteProductDataRef: DeleteProductDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteProductData(dc: DataConnect, vars: DeleteProductDataVariables): MutationPromise<DeleteProductDataData, DeleteProductDataVariables>;

interface DeleteProductDataRef {
  ...
  (dc: DataConnect, vars: DeleteProductDataVariables): MutationRef<DeleteProductDataData, DeleteProductDataVariables>;
}
export const deleteProductDataRef: DeleteProductDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteProductDataRef:
```typescript
const name = deleteProductDataRef.operationName;
console.log(name);
```

### Variables
The `DeleteProductData` mutation requires an argument of type `DeleteProductDataVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteProductDataVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteProductData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteProductDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteProductDataData {
  product_delete?: Product_Key | null;
}
```
### Using `DeleteProductData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteProductData, DeleteProductDataVariables } from '@dataconnect/generated';

// The `DeleteProductData` mutation requires an argument of type `DeleteProductDataVariables`:
const deleteProductDataVars: DeleteProductDataVariables = {
  id: ..., 
};

// Call the `deleteProductData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteProductData(deleteProductDataVars);
// Variables can be defined inline as well.
const { data } = await deleteProductData({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteProductData(dataConnect, deleteProductDataVars);

console.log(data.product_delete);

// Or, you can use the `Promise` API.
deleteProductData(deleteProductDataVars).then((response) => {
  const data = response.data;
  console.log(data.product_delete);
});
```

### Using `DeleteProductData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteProductDataRef, DeleteProductDataVariables } from '@dataconnect/generated';

// The `DeleteProductData` mutation requires an argument of type `DeleteProductDataVariables`:
const deleteProductDataVars: DeleteProductDataVariables = {
  id: ..., 
};

// Call the `deleteProductDataRef()` function to get a reference to the mutation.
const ref = deleteProductDataRef(deleteProductDataVars);
// Variables can be defined inline as well.
const ref = deleteProductDataRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteProductDataRef(dataConnect, deleteProductDataVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.product_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.product_delete);
});
```

## CreateDeploymentData
You can execute the `CreateDeploymentData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createDeploymentData(vars: CreateDeploymentDataVariables): MutationPromise<CreateDeploymentDataData, CreateDeploymentDataVariables>;

interface CreateDeploymentDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDeploymentDataVariables): MutationRef<CreateDeploymentDataData, CreateDeploymentDataVariables>;
}
export const createDeploymentDataRef: CreateDeploymentDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createDeploymentData(dc: DataConnect, vars: CreateDeploymentDataVariables): MutationPromise<CreateDeploymentDataData, CreateDeploymentDataVariables>;

interface CreateDeploymentDataRef {
  ...
  (dc: DataConnect, vars: CreateDeploymentDataVariables): MutationRef<CreateDeploymentDataData, CreateDeploymentDataVariables>;
}
export const createDeploymentDataRef: CreateDeploymentDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createDeploymentDataRef:
```typescript
const name = createDeploymentDataRef.operationName;
console.log(name);
```

### Variables
The `CreateDeploymentData` mutation requires an argument of type `CreateDeploymentDataVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateDeploymentDataVariables {
  status: string;
  date: DateString;
  productId: UUIDString;
  clientId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateDeploymentData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateDeploymentDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateDeploymentDataData {
  deployment_insert: Deployment_Key;
}
```
### Using `CreateDeploymentData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createDeploymentData, CreateDeploymentDataVariables } from '@dataconnect/generated';

// The `CreateDeploymentData` mutation requires an argument of type `CreateDeploymentDataVariables`:
const createDeploymentDataVars: CreateDeploymentDataVariables = {
  status: ..., 
  date: ..., 
  productId: ..., 
  clientId: ..., 
};

// Call the `createDeploymentData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createDeploymentData(createDeploymentDataVars);
// Variables can be defined inline as well.
const { data } = await createDeploymentData({ status: ..., date: ..., productId: ..., clientId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createDeploymentData(dataConnect, createDeploymentDataVars);

console.log(data.deployment_insert);

// Or, you can use the `Promise` API.
createDeploymentData(createDeploymentDataVars).then((response) => {
  const data = response.data;
  console.log(data.deployment_insert);
});
```

### Using `CreateDeploymentData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createDeploymentDataRef, CreateDeploymentDataVariables } from '@dataconnect/generated';

// The `CreateDeploymentData` mutation requires an argument of type `CreateDeploymentDataVariables`:
const createDeploymentDataVars: CreateDeploymentDataVariables = {
  status: ..., 
  date: ..., 
  productId: ..., 
  clientId: ..., 
};

// Call the `createDeploymentDataRef()` function to get a reference to the mutation.
const ref = createDeploymentDataRef(createDeploymentDataVars);
// Variables can be defined inline as well.
const ref = createDeploymentDataRef({ status: ..., date: ..., productId: ..., clientId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createDeploymentDataRef(dataConnect, createDeploymentDataVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.deployment_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.deployment_insert);
});
```

## UpdateDeploymentData
You can execute the `UpdateDeploymentData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateDeploymentData(vars: UpdateDeploymentDataVariables): MutationPromise<UpdateDeploymentDataData, UpdateDeploymentDataVariables>;

interface UpdateDeploymentDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateDeploymentDataVariables): MutationRef<UpdateDeploymentDataData, UpdateDeploymentDataVariables>;
}
export const updateDeploymentDataRef: UpdateDeploymentDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateDeploymentData(dc: DataConnect, vars: UpdateDeploymentDataVariables): MutationPromise<UpdateDeploymentDataData, UpdateDeploymentDataVariables>;

interface UpdateDeploymentDataRef {
  ...
  (dc: DataConnect, vars: UpdateDeploymentDataVariables): MutationRef<UpdateDeploymentDataData, UpdateDeploymentDataVariables>;
}
export const updateDeploymentDataRef: UpdateDeploymentDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateDeploymentDataRef:
```typescript
const name = updateDeploymentDataRef.operationName;
console.log(name);
```

### Variables
The `UpdateDeploymentData` mutation requires an argument of type `UpdateDeploymentDataVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateDeploymentDataVariables {
  id: UUIDString;
  status?: string | null;
}
```
### Return Type
Recall that executing the `UpdateDeploymentData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateDeploymentDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateDeploymentDataData {
  deployment_update?: Deployment_Key | null;
}
```
### Using `UpdateDeploymentData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateDeploymentData, UpdateDeploymentDataVariables } from '@dataconnect/generated';

// The `UpdateDeploymentData` mutation requires an argument of type `UpdateDeploymentDataVariables`:
const updateDeploymentDataVars: UpdateDeploymentDataVariables = {
  id: ..., 
  status: ..., // optional
};

// Call the `updateDeploymentData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateDeploymentData(updateDeploymentDataVars);
// Variables can be defined inline as well.
const { data } = await updateDeploymentData({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateDeploymentData(dataConnect, updateDeploymentDataVars);

console.log(data.deployment_update);

// Or, you can use the `Promise` API.
updateDeploymentData(updateDeploymentDataVars).then((response) => {
  const data = response.data;
  console.log(data.deployment_update);
});
```

### Using `UpdateDeploymentData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateDeploymentDataRef, UpdateDeploymentDataVariables } from '@dataconnect/generated';

// The `UpdateDeploymentData` mutation requires an argument of type `UpdateDeploymentDataVariables`:
const updateDeploymentDataVars: UpdateDeploymentDataVariables = {
  id: ..., 
  status: ..., // optional
};

// Call the `updateDeploymentDataRef()` function to get a reference to the mutation.
const ref = updateDeploymentDataRef(updateDeploymentDataVars);
// Variables can be defined inline as well.
const ref = updateDeploymentDataRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateDeploymentDataRef(dataConnect, updateDeploymentDataVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.deployment_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.deployment_update);
});
```

## DeleteDeploymentData
You can execute the `DeleteDeploymentData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteDeploymentData(vars: DeleteDeploymentDataVariables): MutationPromise<DeleteDeploymentDataData, DeleteDeploymentDataVariables>;

interface DeleteDeploymentDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteDeploymentDataVariables): MutationRef<DeleteDeploymentDataData, DeleteDeploymentDataVariables>;
}
export const deleteDeploymentDataRef: DeleteDeploymentDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteDeploymentData(dc: DataConnect, vars: DeleteDeploymentDataVariables): MutationPromise<DeleteDeploymentDataData, DeleteDeploymentDataVariables>;

interface DeleteDeploymentDataRef {
  ...
  (dc: DataConnect, vars: DeleteDeploymentDataVariables): MutationRef<DeleteDeploymentDataData, DeleteDeploymentDataVariables>;
}
export const deleteDeploymentDataRef: DeleteDeploymentDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteDeploymentDataRef:
```typescript
const name = deleteDeploymentDataRef.operationName;
console.log(name);
```

### Variables
The `DeleteDeploymentData` mutation requires an argument of type `DeleteDeploymentDataVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteDeploymentDataVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteDeploymentData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteDeploymentDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteDeploymentDataData {
  deployment_delete?: Deployment_Key | null;
}
```
### Using `DeleteDeploymentData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteDeploymentData, DeleteDeploymentDataVariables } from '@dataconnect/generated';

// The `DeleteDeploymentData` mutation requires an argument of type `DeleteDeploymentDataVariables`:
const deleteDeploymentDataVars: DeleteDeploymentDataVariables = {
  id: ..., 
};

// Call the `deleteDeploymentData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteDeploymentData(deleteDeploymentDataVars);
// Variables can be defined inline as well.
const { data } = await deleteDeploymentData({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteDeploymentData(dataConnect, deleteDeploymentDataVars);

console.log(data.deployment_delete);

// Or, you can use the `Promise` API.
deleteDeploymentData(deleteDeploymentDataVars).then((response) => {
  const data = response.data;
  console.log(data.deployment_delete);
});
```

### Using `DeleteDeploymentData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteDeploymentDataRef, DeleteDeploymentDataVariables } from '@dataconnect/generated';

// The `DeleteDeploymentData` mutation requires an argument of type `DeleteDeploymentDataVariables`:
const deleteDeploymentDataVars: DeleteDeploymentDataVariables = {
  id: ..., 
};

// Call the `deleteDeploymentDataRef()` function to get a reference to the mutation.
const ref = deleteDeploymentDataRef(deleteDeploymentDataVars);
// Variables can be defined inline as well.
const ref = deleteDeploymentDataRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteDeploymentDataRef(dataConnect, deleteDeploymentDataVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.deployment_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.deployment_delete);
});
```

## CreateMetricData
You can execute the `CreateMetricData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createMetricData(vars: CreateMetricDataVariables): MutationPromise<CreateMetricDataData, CreateMetricDataVariables>;

interface CreateMetricDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMetricDataVariables): MutationRef<CreateMetricDataData, CreateMetricDataVariables>;
}
export const createMetricDataRef: CreateMetricDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createMetricData(dc: DataConnect, vars: CreateMetricDataVariables): MutationPromise<CreateMetricDataData, CreateMetricDataVariables>;

interface CreateMetricDataRef {
  ...
  (dc: DataConnect, vars: CreateMetricDataVariables): MutationRef<CreateMetricDataData, CreateMetricDataVariables>;
}
export const createMetricDataRef: CreateMetricDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createMetricDataRef:
```typescript
const name = createMetricDataRef.operationName;
console.log(name);
```

### Variables
The `CreateMetricData` mutation requires an argument of type `CreateMetricDataVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateMetricDataVariables {
  name: string;
  value: number;
  timestamp: TimestampString;
  deploymentId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateMetricData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateMetricDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateMetricDataData {
  metric_insert: Metric_Key;
}
```
### Using `CreateMetricData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createMetricData, CreateMetricDataVariables } from '@dataconnect/generated';

// The `CreateMetricData` mutation requires an argument of type `CreateMetricDataVariables`:
const createMetricDataVars: CreateMetricDataVariables = {
  name: ..., 
  value: ..., 
  timestamp: ..., 
  deploymentId: ..., 
};

// Call the `createMetricData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createMetricData(createMetricDataVars);
// Variables can be defined inline as well.
const { data } = await createMetricData({ name: ..., value: ..., timestamp: ..., deploymentId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createMetricData(dataConnect, createMetricDataVars);

console.log(data.metric_insert);

// Or, you can use the `Promise` API.
createMetricData(createMetricDataVars).then((response) => {
  const data = response.data;
  console.log(data.metric_insert);
});
```

### Using `CreateMetricData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createMetricDataRef, CreateMetricDataVariables } from '@dataconnect/generated';

// The `CreateMetricData` mutation requires an argument of type `CreateMetricDataVariables`:
const createMetricDataVars: CreateMetricDataVariables = {
  name: ..., 
  value: ..., 
  timestamp: ..., 
  deploymentId: ..., 
};

// Call the `createMetricDataRef()` function to get a reference to the mutation.
const ref = createMetricDataRef(createMetricDataVars);
// Variables can be defined inline as well.
const ref = createMetricDataRef({ name: ..., value: ..., timestamp: ..., deploymentId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createMetricDataRef(dataConnect, createMetricDataVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.metric_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.metric_insert);
});
```

## UpdateMetricData
You can execute the `UpdateMetricData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateMetricData(vars: UpdateMetricDataVariables): MutationPromise<UpdateMetricDataData, UpdateMetricDataVariables>;

interface UpdateMetricDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMetricDataVariables): MutationRef<UpdateMetricDataData, UpdateMetricDataVariables>;
}
export const updateMetricDataRef: UpdateMetricDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateMetricData(dc: DataConnect, vars: UpdateMetricDataVariables): MutationPromise<UpdateMetricDataData, UpdateMetricDataVariables>;

interface UpdateMetricDataRef {
  ...
  (dc: DataConnect, vars: UpdateMetricDataVariables): MutationRef<UpdateMetricDataData, UpdateMetricDataVariables>;
}
export const updateMetricDataRef: UpdateMetricDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateMetricDataRef:
```typescript
const name = updateMetricDataRef.operationName;
console.log(name);
```

### Variables
The `UpdateMetricData` mutation requires an argument of type `UpdateMetricDataVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateMetricDataVariables {
  id: UUIDString;
  value?: number | null;
}
```
### Return Type
Recall that executing the `UpdateMetricData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateMetricDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateMetricDataData {
  metric_update?: Metric_Key | null;
}
```
### Using `UpdateMetricData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateMetricData, UpdateMetricDataVariables } from '@dataconnect/generated';

// The `UpdateMetricData` mutation requires an argument of type `UpdateMetricDataVariables`:
const updateMetricDataVars: UpdateMetricDataVariables = {
  id: ..., 
  value: ..., // optional
};

// Call the `updateMetricData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateMetricData(updateMetricDataVars);
// Variables can be defined inline as well.
const { data } = await updateMetricData({ id: ..., value: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateMetricData(dataConnect, updateMetricDataVars);

console.log(data.metric_update);

// Or, you can use the `Promise` API.
updateMetricData(updateMetricDataVars).then((response) => {
  const data = response.data;
  console.log(data.metric_update);
});
```

### Using `UpdateMetricData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateMetricDataRef, UpdateMetricDataVariables } from '@dataconnect/generated';

// The `UpdateMetricData` mutation requires an argument of type `UpdateMetricDataVariables`:
const updateMetricDataVars: UpdateMetricDataVariables = {
  id: ..., 
  value: ..., // optional
};

// Call the `updateMetricDataRef()` function to get a reference to the mutation.
const ref = updateMetricDataRef(updateMetricDataVars);
// Variables can be defined inline as well.
const ref = updateMetricDataRef({ id: ..., value: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateMetricDataRef(dataConnect, updateMetricDataVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.metric_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.metric_update);
});
```

## DeleteMetricData
You can execute the `DeleteMetricData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteMetricData(vars: DeleteMetricDataVariables): MutationPromise<DeleteMetricDataData, DeleteMetricDataVariables>;

interface DeleteMetricDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteMetricDataVariables): MutationRef<DeleteMetricDataData, DeleteMetricDataVariables>;
}
export const deleteMetricDataRef: DeleteMetricDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteMetricData(dc: DataConnect, vars: DeleteMetricDataVariables): MutationPromise<DeleteMetricDataData, DeleteMetricDataVariables>;

interface DeleteMetricDataRef {
  ...
  (dc: DataConnect, vars: DeleteMetricDataVariables): MutationRef<DeleteMetricDataData, DeleteMetricDataVariables>;
}
export const deleteMetricDataRef: DeleteMetricDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteMetricDataRef:
```typescript
const name = deleteMetricDataRef.operationName;
console.log(name);
```

### Variables
The `DeleteMetricData` mutation requires an argument of type `DeleteMetricDataVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteMetricDataVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteMetricData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteMetricDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteMetricDataData {
  metric_delete?: Metric_Key | null;
}
```
### Using `DeleteMetricData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteMetricData, DeleteMetricDataVariables } from '@dataconnect/generated';

// The `DeleteMetricData` mutation requires an argument of type `DeleteMetricDataVariables`:
const deleteMetricDataVars: DeleteMetricDataVariables = {
  id: ..., 
};

// Call the `deleteMetricData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteMetricData(deleteMetricDataVars);
// Variables can be defined inline as well.
const { data } = await deleteMetricData({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteMetricData(dataConnect, deleteMetricDataVars);

console.log(data.metric_delete);

// Or, you can use the `Promise` API.
deleteMetricData(deleteMetricDataVars).then((response) => {
  const data = response.data;
  console.log(data.metric_delete);
});
```

### Using `DeleteMetricData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteMetricDataRef, DeleteMetricDataVariables } from '@dataconnect/generated';

// The `DeleteMetricData` mutation requires an argument of type `DeleteMetricDataVariables`:
const deleteMetricDataVars: DeleteMetricDataVariables = {
  id: ..., 
};

// Call the `deleteMetricDataRef()` function to get a reference to the mutation.
const ref = deleteMetricDataRef(deleteMetricDataVars);
// Variables can be defined inline as well.
const ref = deleteMetricDataRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteMetricDataRef(dataConnect, deleteMetricDataVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.metric_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.metric_delete);
});
```

## CreateDependencyData
You can execute the `CreateDependencyData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createDependencyData(vars: CreateDependencyDataVariables): MutationPromise<CreateDependencyDataData, CreateDependencyDataVariables>;

interface CreateDependencyDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDependencyDataVariables): MutationRef<CreateDependencyDataData, CreateDependencyDataVariables>;
}
export const createDependencyDataRef: CreateDependencyDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createDependencyData(dc: DataConnect, vars: CreateDependencyDataVariables): MutationPromise<CreateDependencyDataData, CreateDependencyDataVariables>;

interface CreateDependencyDataRef {
  ...
  (dc: DataConnect, vars: CreateDependencyDataVariables): MutationRef<CreateDependencyDataData, CreateDependencyDataVariables>;
}
export const createDependencyDataRef: CreateDependencyDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createDependencyDataRef:
```typescript
const name = createDependencyDataRef.operationName;
console.log(name);
```

### Variables
The `CreateDependencyData` mutation requires an argument of type `CreateDependencyDataVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateDependencyDataVariables {
  depId: UUIDString;
  parentId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateDependencyData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateDependencyDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateDependencyDataData {
  dependency_insert: Dependency_Key;
}
```
### Using `CreateDependencyData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createDependencyData, CreateDependencyDataVariables } from '@dataconnect/generated';

// The `CreateDependencyData` mutation requires an argument of type `CreateDependencyDataVariables`:
const createDependencyDataVars: CreateDependencyDataVariables = {
  depId: ..., 
  parentId: ..., 
};

// Call the `createDependencyData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createDependencyData(createDependencyDataVars);
// Variables can be defined inline as well.
const { data } = await createDependencyData({ depId: ..., parentId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createDependencyData(dataConnect, createDependencyDataVars);

console.log(data.dependency_insert);

// Or, you can use the `Promise` API.
createDependencyData(createDependencyDataVars).then((response) => {
  const data = response.data;
  console.log(data.dependency_insert);
});
```

### Using `CreateDependencyData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createDependencyDataRef, CreateDependencyDataVariables } from '@dataconnect/generated';

// The `CreateDependencyData` mutation requires an argument of type `CreateDependencyDataVariables`:
const createDependencyDataVars: CreateDependencyDataVariables = {
  depId: ..., 
  parentId: ..., 
};

// Call the `createDependencyDataRef()` function to get a reference to the mutation.
const ref = createDependencyDataRef(createDependencyDataVars);
// Variables can be defined inline as well.
const ref = createDependencyDataRef({ depId: ..., parentId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createDependencyDataRef(dataConnect, createDependencyDataVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.dependency_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.dependency_insert);
});
```

## UpdateDependencyData
You can execute the `UpdateDependencyData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateDependencyData(vars: UpdateDependencyDataVariables): MutationPromise<UpdateDependencyDataData, UpdateDependencyDataVariables>;

interface UpdateDependencyDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateDependencyDataVariables): MutationRef<UpdateDependencyDataData, UpdateDependencyDataVariables>;
}
export const updateDependencyDataRef: UpdateDependencyDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateDependencyData(dc: DataConnect, vars: UpdateDependencyDataVariables): MutationPromise<UpdateDependencyDataData, UpdateDependencyDataVariables>;

interface UpdateDependencyDataRef {
  ...
  (dc: DataConnect, vars: UpdateDependencyDataVariables): MutationRef<UpdateDependencyDataData, UpdateDependencyDataVariables>;
}
export const updateDependencyDataRef: UpdateDependencyDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateDependencyDataRef:
```typescript
const name = updateDependencyDataRef.operationName;
console.log(name);
```

### Variables
The `UpdateDependencyData` mutation requires an argument of type `UpdateDependencyDataVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateDependencyDataVariables {
  id: UUIDString;
  type?: string | null;
}
```
### Return Type
Recall that executing the `UpdateDependencyData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateDependencyDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateDependencyDataData {
  dependency_update?: Dependency_Key | null;
}
```
### Using `UpdateDependencyData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateDependencyData, UpdateDependencyDataVariables } from '@dataconnect/generated';

// The `UpdateDependencyData` mutation requires an argument of type `UpdateDependencyDataVariables`:
const updateDependencyDataVars: UpdateDependencyDataVariables = {
  id: ..., 
  type: ..., // optional
};

// Call the `updateDependencyData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateDependencyData(updateDependencyDataVars);
// Variables can be defined inline as well.
const { data } = await updateDependencyData({ id: ..., type: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateDependencyData(dataConnect, updateDependencyDataVars);

console.log(data.dependency_update);

// Or, you can use the `Promise` API.
updateDependencyData(updateDependencyDataVars).then((response) => {
  const data = response.data;
  console.log(data.dependency_update);
});
```

### Using `UpdateDependencyData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateDependencyDataRef, UpdateDependencyDataVariables } from '@dataconnect/generated';

// The `UpdateDependencyData` mutation requires an argument of type `UpdateDependencyDataVariables`:
const updateDependencyDataVars: UpdateDependencyDataVariables = {
  id: ..., 
  type: ..., // optional
};

// Call the `updateDependencyDataRef()` function to get a reference to the mutation.
const ref = updateDependencyDataRef(updateDependencyDataVars);
// Variables can be defined inline as well.
const ref = updateDependencyDataRef({ id: ..., type: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateDependencyDataRef(dataConnect, updateDependencyDataVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.dependency_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.dependency_update);
});
```

## DeleteDependencyData
You can execute the `DeleteDependencyData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteDependencyData(vars: DeleteDependencyDataVariables): MutationPromise<DeleteDependencyDataData, DeleteDependencyDataVariables>;

interface DeleteDependencyDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteDependencyDataVariables): MutationRef<DeleteDependencyDataData, DeleteDependencyDataVariables>;
}
export const deleteDependencyDataRef: DeleteDependencyDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteDependencyData(dc: DataConnect, vars: DeleteDependencyDataVariables): MutationPromise<DeleteDependencyDataData, DeleteDependencyDataVariables>;

interface DeleteDependencyDataRef {
  ...
  (dc: DataConnect, vars: DeleteDependencyDataVariables): MutationRef<DeleteDependencyDataData, DeleteDependencyDataVariables>;
}
export const deleteDependencyDataRef: DeleteDependencyDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteDependencyDataRef:
```typescript
const name = deleteDependencyDataRef.operationName;
console.log(name);
```

### Variables
The `DeleteDependencyData` mutation requires an argument of type `DeleteDependencyDataVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteDependencyDataVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteDependencyData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteDependencyDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteDependencyDataData {
  dependency_delete?: Dependency_Key | null;
}
```
### Using `DeleteDependencyData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteDependencyData, DeleteDependencyDataVariables } from '@dataconnect/generated';

// The `DeleteDependencyData` mutation requires an argument of type `DeleteDependencyDataVariables`:
const deleteDependencyDataVars: DeleteDependencyDataVariables = {
  id: ..., 
};

// Call the `deleteDependencyData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteDependencyData(deleteDependencyDataVars);
// Variables can be defined inline as well.
const { data } = await deleteDependencyData({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteDependencyData(dataConnect, deleteDependencyDataVars);

console.log(data.dependency_delete);

// Or, you can use the `Promise` API.
deleteDependencyData(deleteDependencyDataVars).then((response) => {
  const data = response.data;
  console.log(data.dependency_delete);
});
```

### Using `DeleteDependencyData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteDependencyDataRef, DeleteDependencyDataVariables } from '@dataconnect/generated';

// The `DeleteDependencyData` mutation requires an argument of type `DeleteDependencyDataVariables`:
const deleteDependencyDataVars: DeleteDependencyDataVariables = {
  id: ..., 
};

// Call the `deleteDependencyDataRef()` function to get a reference to the mutation.
const ref = deleteDependencyDataRef(deleteDependencyDataVars);
// Variables can be defined inline as well.
const ref = deleteDependencyDataRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteDependencyDataRef(dataConnect, deleteDependencyDataVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.dependency_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.dependency_delete);
});
```

