# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createClientData, updateClientData, deleteClientData, getClient, listClients, createProductData, updateProductData, deleteProductData, getProduct, listProducts } from '@dataconnect/generated';


// Operation CreateClientData:  For variables, look at type CreateClientDataVars in ../index.d.ts
const { data } = await CreateClientData(dataConnect, createClientDataVars);

// Operation UpdateClientData:  For variables, look at type UpdateClientDataVars in ../index.d.ts
const { data } = await UpdateClientData(dataConnect, updateClientDataVars);

// Operation DeleteClientData:  For variables, look at type DeleteClientDataVars in ../index.d.ts
const { data } = await DeleteClientData(dataConnect, deleteClientDataVars);

// Operation GetClient:  For variables, look at type GetClientVars in ../index.d.ts
const { data } = await GetClient(dataConnect, getClientVars);

// Operation ListClients: 
const { data } = await ListClients(dataConnect);

// Operation CreateProductData:  For variables, look at type CreateProductDataVars in ../index.d.ts
const { data } = await CreateProductData(dataConnect, createProductDataVars);

// Operation UpdateProductData:  For variables, look at type UpdateProductDataVars in ../index.d.ts
const { data } = await UpdateProductData(dataConnect, updateProductDataVars);

// Operation DeleteProductData:  For variables, look at type DeleteProductDataVars in ../index.d.ts
const { data } = await DeleteProductData(dataConnect, deleteProductDataVars);

// Operation GetProduct:  For variables, look at type GetProductVars in ../index.d.ts
const { data } = await GetProduct(dataConnect, getProductVars);

// Operation ListProducts: 
const { data } = await ListProducts(dataConnect);


```