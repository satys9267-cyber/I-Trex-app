import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Client_Key {
  id: UUIDString;
  __typename?: 'Client_Key';
}

export interface CreateClientDataData {
  client_insert: Client_Key;
}

export interface CreateClientDataVariables {
  companyName: string;
  contactEmail: string;
}

export interface CreateDependencyDataData {
  dependency_insert: Dependency_Key;
}

export interface CreateDependencyDataVariables {
  depId: UUIDString;
  parentId: UUIDString;
}

export interface CreateDeploymentDataData {
  deployment_insert: Deployment_Key;
}

export interface CreateDeploymentDataVariables {
  status: string;
  date: DateString;
  productId: UUIDString;
  clientId: UUIDString;
}

export interface CreateMetricDataData {
  metric_insert: Metric_Key;
}

export interface CreateMetricDataVariables {
  name: string;
  value: number;
  timestamp: TimestampString;
  deploymentId: UUIDString;
}

export interface CreateProductDataData {
  product_insert: Product_Key;
}

export interface CreateProductDataVariables {
  name: string;
  type: string;
}

export interface DeleteClientDataData {
  client_delete?: Client_Key | null;
}

export interface DeleteClientDataVariables {
  id: UUIDString;
}

export interface DeleteDependencyDataData {
  dependency_delete?: Dependency_Key | null;
}

export interface DeleteDependencyDataVariables {
  id: UUIDString;
}

export interface DeleteDeploymentDataData {
  deployment_delete?: Deployment_Key | null;
}

export interface DeleteDeploymentDataVariables {
  id: UUIDString;
}

export interface DeleteMetricDataData {
  metric_delete?: Metric_Key | null;
}

export interface DeleteMetricDataVariables {
  id: UUIDString;
}

export interface DeleteProductDataData {
  product_delete?: Product_Key | null;
}

export interface DeleteProductDataVariables {
  id: UUIDString;
}

export interface Dependency_Key {
  id: UUIDString;
  __typename?: 'Dependency_Key';
}

export interface Deployment_Key {
  id: UUIDString;
  __typename?: 'Deployment_Key';
}

export interface GetClientData {
  client?: {
    companyName: string;
    contactEmail: string;
  };
}

export interface GetClientVariables {
  id: UUIDString;
}

export interface GetDependencyData {
  dependency?: {
    connectionType?: string | null;
  };
}

export interface GetDependencyVariables {
  id: UUIDString;
}

export interface GetDeploymentData {
  deployment?: {
    status: string;
    region?: string | null;
  };
}

export interface GetDeploymentVariables {
  id: UUIDString;
}

export interface GetMetricData {
  metric?: {
    metricName: string;
    value: number;
  };
}

export interface GetMetricVariables {
  id: UUIDString;
}

export interface GetProductData {
  product?: {
    name: string;
    version?: string | null;
  };
}

export interface GetProductVariables {
  id: UUIDString;
}

export interface ListClientsData {
  clients: ({
    companyName: string;
    industry?: string | null;
  })[];
}

export interface ListDependenciesData {
  dependencies: ({
    connectionType?: string | null;
  })[];
}

export interface ListDeploymentsData {
  deployments: ({
    status: string;
    deploymentDate: DateString;
  })[];
}

export interface ListMetricsData {
  metrics: ({
    metricName: string;
    value: number;
  })[];
}

export interface ListProductsData {
  products: ({
    name: string;
    type: string;
  })[];
}

export interface Metric_Key {
  id: UUIDString;
  __typename?: 'Metric_Key';
}

export interface Product_Key {
  id: UUIDString;
  __typename?: 'Product_Key';
}

export interface UpdateClientDataData {
  client_update?: Client_Key | null;
}

export interface UpdateClientDataVariables {
  id: UUIDString;
  companyName?: string | null;
}

export interface UpdateDependencyDataData {
  dependency_update?: Dependency_Key | null;
}

export interface UpdateDependencyDataVariables {
  id: UUIDString;
  type?: string | null;
}

export interface UpdateDeploymentDataData {
  deployment_update?: Deployment_Key | null;
}

export interface UpdateDeploymentDataVariables {
  id: UUIDString;
  status?: string | null;
}

export interface UpdateMetricDataData {
  metric_update?: Metric_Key | null;
}

export interface UpdateMetricDataVariables {
  id: UUIDString;
  value?: number | null;
}

export interface UpdateProductDataData {
  product_update?: Product_Key | null;
}

export interface UpdateProductDataVariables {
  id: UUIDString;
  description?: string | null;
}

interface CreateClientDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateClientDataVariables): MutationRef<CreateClientDataData, CreateClientDataVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateClientDataVariables): MutationRef<CreateClientDataData, CreateClientDataVariables>;
  operationName: string;
}
export const createClientDataRef: CreateClientDataRef;

export function createClientData(vars: CreateClientDataVariables): MutationPromise<CreateClientDataData, CreateClientDataVariables>;
export function createClientData(dc: DataConnect, vars: CreateClientDataVariables): MutationPromise<CreateClientDataData, CreateClientDataVariables>;

interface UpdateClientDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateClientDataVariables): MutationRef<UpdateClientDataData, UpdateClientDataVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateClientDataVariables): MutationRef<UpdateClientDataData, UpdateClientDataVariables>;
  operationName: string;
}
export const updateClientDataRef: UpdateClientDataRef;

export function updateClientData(vars: UpdateClientDataVariables): MutationPromise<UpdateClientDataData, UpdateClientDataVariables>;
export function updateClientData(dc: DataConnect, vars: UpdateClientDataVariables): MutationPromise<UpdateClientDataData, UpdateClientDataVariables>;

interface DeleteClientDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteClientDataVariables): MutationRef<DeleteClientDataData, DeleteClientDataVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteClientDataVariables): MutationRef<DeleteClientDataData, DeleteClientDataVariables>;
  operationName: string;
}
export const deleteClientDataRef: DeleteClientDataRef;

export function deleteClientData(vars: DeleteClientDataVariables): MutationPromise<DeleteClientDataData, DeleteClientDataVariables>;
export function deleteClientData(dc: DataConnect, vars: DeleteClientDataVariables): MutationPromise<DeleteClientDataData, DeleteClientDataVariables>;

interface GetClientRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClientVariables): QueryRef<GetClientData, GetClientVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetClientVariables): QueryRef<GetClientData, GetClientVariables>;
  operationName: string;
}
export const getClientRef: GetClientRef;

export function getClient(vars: GetClientVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientData, GetClientVariables>;
export function getClient(dc: DataConnect, vars: GetClientVariables, options?: ExecuteQueryOptions): QueryPromise<GetClientData, GetClientVariables>;

interface ListClientsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListClientsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListClientsData, undefined>;
  operationName: string;
}
export const listClientsRef: ListClientsRef;

export function listClients(options?: ExecuteQueryOptions): QueryPromise<ListClientsData, undefined>;
export function listClients(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListClientsData, undefined>;

interface CreateProductDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProductDataVariables): MutationRef<CreateProductDataData, CreateProductDataVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateProductDataVariables): MutationRef<CreateProductDataData, CreateProductDataVariables>;
  operationName: string;
}
export const createProductDataRef: CreateProductDataRef;

export function createProductData(vars: CreateProductDataVariables): MutationPromise<CreateProductDataData, CreateProductDataVariables>;
export function createProductData(dc: DataConnect, vars: CreateProductDataVariables): MutationPromise<CreateProductDataData, CreateProductDataVariables>;

interface UpdateProductDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProductDataVariables): MutationRef<UpdateProductDataData, UpdateProductDataVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProductDataVariables): MutationRef<UpdateProductDataData, UpdateProductDataVariables>;
  operationName: string;
}
export const updateProductDataRef: UpdateProductDataRef;

export function updateProductData(vars: UpdateProductDataVariables): MutationPromise<UpdateProductDataData, UpdateProductDataVariables>;
export function updateProductData(dc: DataConnect, vars: UpdateProductDataVariables): MutationPromise<UpdateProductDataData, UpdateProductDataVariables>;

interface DeleteProductDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProductDataVariables): MutationRef<DeleteProductDataData, DeleteProductDataVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteProductDataVariables): MutationRef<DeleteProductDataData, DeleteProductDataVariables>;
  operationName: string;
}
export const deleteProductDataRef: DeleteProductDataRef;

export function deleteProductData(vars: DeleteProductDataVariables): MutationPromise<DeleteProductDataData, DeleteProductDataVariables>;
export function deleteProductData(dc: DataConnect, vars: DeleteProductDataVariables): MutationPromise<DeleteProductDataData, DeleteProductDataVariables>;

interface GetProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProductVariables): QueryRef<GetProductData, GetProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetProductVariables): QueryRef<GetProductData, GetProductVariables>;
  operationName: string;
}
export const getProductRef: GetProductRef;

export function getProduct(vars: GetProductVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductData, GetProductVariables>;
export function getProduct(dc: DataConnect, vars: GetProductVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductData, GetProductVariables>;

interface ListProductsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProductsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListProductsData, undefined>;
  operationName: string;
}
export const listProductsRef: ListProductsRef;

export function listProducts(options?: ExecuteQueryOptions): QueryPromise<ListProductsData, undefined>;
export function listProducts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListProductsData, undefined>;

interface CreateDeploymentDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDeploymentDataVariables): MutationRef<CreateDeploymentDataData, CreateDeploymentDataVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateDeploymentDataVariables): MutationRef<CreateDeploymentDataData, CreateDeploymentDataVariables>;
  operationName: string;
}
export const createDeploymentDataRef: CreateDeploymentDataRef;

export function createDeploymentData(vars: CreateDeploymentDataVariables): MutationPromise<CreateDeploymentDataData, CreateDeploymentDataVariables>;
export function createDeploymentData(dc: DataConnect, vars: CreateDeploymentDataVariables): MutationPromise<CreateDeploymentDataData, CreateDeploymentDataVariables>;

interface UpdateDeploymentDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateDeploymentDataVariables): MutationRef<UpdateDeploymentDataData, UpdateDeploymentDataVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateDeploymentDataVariables): MutationRef<UpdateDeploymentDataData, UpdateDeploymentDataVariables>;
  operationName: string;
}
export const updateDeploymentDataRef: UpdateDeploymentDataRef;

export function updateDeploymentData(vars: UpdateDeploymentDataVariables): MutationPromise<UpdateDeploymentDataData, UpdateDeploymentDataVariables>;
export function updateDeploymentData(dc: DataConnect, vars: UpdateDeploymentDataVariables): MutationPromise<UpdateDeploymentDataData, UpdateDeploymentDataVariables>;

interface DeleteDeploymentDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteDeploymentDataVariables): MutationRef<DeleteDeploymentDataData, DeleteDeploymentDataVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteDeploymentDataVariables): MutationRef<DeleteDeploymentDataData, DeleteDeploymentDataVariables>;
  operationName: string;
}
export const deleteDeploymentDataRef: DeleteDeploymentDataRef;

export function deleteDeploymentData(vars: DeleteDeploymentDataVariables): MutationPromise<DeleteDeploymentDataData, DeleteDeploymentDataVariables>;
export function deleteDeploymentData(dc: DataConnect, vars: DeleteDeploymentDataVariables): MutationPromise<DeleteDeploymentDataData, DeleteDeploymentDataVariables>;

interface GetDeploymentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDeploymentVariables): QueryRef<GetDeploymentData, GetDeploymentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetDeploymentVariables): QueryRef<GetDeploymentData, GetDeploymentVariables>;
  operationName: string;
}
export const getDeploymentRef: GetDeploymentRef;

export function getDeployment(vars: GetDeploymentVariables, options?: ExecuteQueryOptions): QueryPromise<GetDeploymentData, GetDeploymentVariables>;
export function getDeployment(dc: DataConnect, vars: GetDeploymentVariables, options?: ExecuteQueryOptions): QueryPromise<GetDeploymentData, GetDeploymentVariables>;

interface ListDeploymentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListDeploymentsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListDeploymentsData, undefined>;
  operationName: string;
}
export const listDeploymentsRef: ListDeploymentsRef;

export function listDeployments(options?: ExecuteQueryOptions): QueryPromise<ListDeploymentsData, undefined>;
export function listDeployments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListDeploymentsData, undefined>;

interface CreateMetricDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMetricDataVariables): MutationRef<CreateMetricDataData, CreateMetricDataVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateMetricDataVariables): MutationRef<CreateMetricDataData, CreateMetricDataVariables>;
  operationName: string;
}
export const createMetricDataRef: CreateMetricDataRef;

export function createMetricData(vars: CreateMetricDataVariables): MutationPromise<CreateMetricDataData, CreateMetricDataVariables>;
export function createMetricData(dc: DataConnect, vars: CreateMetricDataVariables): MutationPromise<CreateMetricDataData, CreateMetricDataVariables>;

interface UpdateMetricDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMetricDataVariables): MutationRef<UpdateMetricDataData, UpdateMetricDataVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateMetricDataVariables): MutationRef<UpdateMetricDataData, UpdateMetricDataVariables>;
  operationName: string;
}
export const updateMetricDataRef: UpdateMetricDataRef;

export function updateMetricData(vars: UpdateMetricDataVariables): MutationPromise<UpdateMetricDataData, UpdateMetricDataVariables>;
export function updateMetricData(dc: DataConnect, vars: UpdateMetricDataVariables): MutationPromise<UpdateMetricDataData, UpdateMetricDataVariables>;

interface DeleteMetricDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteMetricDataVariables): MutationRef<DeleteMetricDataData, DeleteMetricDataVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteMetricDataVariables): MutationRef<DeleteMetricDataData, DeleteMetricDataVariables>;
  operationName: string;
}
export const deleteMetricDataRef: DeleteMetricDataRef;

export function deleteMetricData(vars: DeleteMetricDataVariables): MutationPromise<DeleteMetricDataData, DeleteMetricDataVariables>;
export function deleteMetricData(dc: DataConnect, vars: DeleteMetricDataVariables): MutationPromise<DeleteMetricDataData, DeleteMetricDataVariables>;

interface GetMetricRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMetricVariables): QueryRef<GetMetricData, GetMetricVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetMetricVariables): QueryRef<GetMetricData, GetMetricVariables>;
  operationName: string;
}
export const getMetricRef: GetMetricRef;

export function getMetric(vars: GetMetricVariables, options?: ExecuteQueryOptions): QueryPromise<GetMetricData, GetMetricVariables>;
export function getMetric(dc: DataConnect, vars: GetMetricVariables, options?: ExecuteQueryOptions): QueryPromise<GetMetricData, GetMetricVariables>;

interface ListMetricsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMetricsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMetricsData, undefined>;
  operationName: string;
}
export const listMetricsRef: ListMetricsRef;

export function listMetrics(options?: ExecuteQueryOptions): QueryPromise<ListMetricsData, undefined>;
export function listMetrics(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMetricsData, undefined>;

interface CreateDependencyDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDependencyDataVariables): MutationRef<CreateDependencyDataData, CreateDependencyDataVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateDependencyDataVariables): MutationRef<CreateDependencyDataData, CreateDependencyDataVariables>;
  operationName: string;
}
export const createDependencyDataRef: CreateDependencyDataRef;

export function createDependencyData(vars: CreateDependencyDataVariables): MutationPromise<CreateDependencyDataData, CreateDependencyDataVariables>;
export function createDependencyData(dc: DataConnect, vars: CreateDependencyDataVariables): MutationPromise<CreateDependencyDataData, CreateDependencyDataVariables>;

interface UpdateDependencyDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateDependencyDataVariables): MutationRef<UpdateDependencyDataData, UpdateDependencyDataVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateDependencyDataVariables): MutationRef<UpdateDependencyDataData, UpdateDependencyDataVariables>;
  operationName: string;
}
export const updateDependencyDataRef: UpdateDependencyDataRef;

export function updateDependencyData(vars: UpdateDependencyDataVariables): MutationPromise<UpdateDependencyDataData, UpdateDependencyDataVariables>;
export function updateDependencyData(dc: DataConnect, vars: UpdateDependencyDataVariables): MutationPromise<UpdateDependencyDataData, UpdateDependencyDataVariables>;

interface DeleteDependencyDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteDependencyDataVariables): MutationRef<DeleteDependencyDataData, DeleteDependencyDataVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteDependencyDataVariables): MutationRef<DeleteDependencyDataData, DeleteDependencyDataVariables>;
  operationName: string;
}
export const deleteDependencyDataRef: DeleteDependencyDataRef;

export function deleteDependencyData(vars: DeleteDependencyDataVariables): MutationPromise<DeleteDependencyDataData, DeleteDependencyDataVariables>;
export function deleteDependencyData(dc: DataConnect, vars: DeleteDependencyDataVariables): MutationPromise<DeleteDependencyDataData, DeleteDependencyDataVariables>;

interface GetDependencyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDependencyVariables): QueryRef<GetDependencyData, GetDependencyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetDependencyVariables): QueryRef<GetDependencyData, GetDependencyVariables>;
  operationName: string;
}
export const getDependencyRef: GetDependencyRef;

export function getDependency(vars: GetDependencyVariables, options?: ExecuteQueryOptions): QueryPromise<GetDependencyData, GetDependencyVariables>;
export function getDependency(dc: DataConnect, vars: GetDependencyVariables, options?: ExecuteQueryOptions): QueryPromise<GetDependencyData, GetDependencyVariables>;

interface ListDependenciesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListDependenciesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListDependenciesData, undefined>;
  operationName: string;
}
export const listDependenciesRef: ListDependenciesRef;

export function listDependencies(options?: ExecuteQueryOptions): QueryPromise<ListDependenciesData, undefined>;
export function listDependencies(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListDependenciesData, undefined>;

