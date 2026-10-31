import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

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

/** Generated Node Admin SDK operation action function for the 'CreateClientData' Mutation. Allow users to execute without passing in DataConnect. */
export function createClientData(dc: DataConnect, vars: CreateClientDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateClientDataData>>;
/** Generated Node Admin SDK operation action function for the 'CreateClientData' Mutation. Allow users to pass in custom DataConnect instances. */
export function createClientData(vars: CreateClientDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateClientDataData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateClientData' Mutation. Allow users to execute without passing in DataConnect. */
export function updateClientData(dc: DataConnect, vars: UpdateClientDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateClientDataData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateClientData' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateClientData(vars: UpdateClientDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateClientDataData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteClientData' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteClientData(dc: DataConnect, vars: DeleteClientDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteClientDataData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteClientData' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteClientData(vars: DeleteClientDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteClientDataData>>;

/** Generated Node Admin SDK operation action function for the 'GetClient' Query. Allow users to execute without passing in DataConnect. */
export function getClient(dc: DataConnect, vars: GetClientVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetClientData>>;
/** Generated Node Admin SDK operation action function for the 'GetClient' Query. Allow users to pass in custom DataConnect instances. */
export function getClient(vars: GetClientVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetClientData>>;

/** Generated Node Admin SDK operation action function for the 'ListClients' Query. Allow users to execute without passing in DataConnect. */
export function listClients(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListClientsData>>;
/** Generated Node Admin SDK operation action function for the 'ListClients' Query. Allow users to pass in custom DataConnect instances. */
export function listClients(options?: OperationOptions): Promise<ExecuteOperationResponse<ListClientsData>>;

/** Generated Node Admin SDK operation action function for the 'CreateProductData' Mutation. Allow users to execute without passing in DataConnect. */
export function createProductData(dc: DataConnect, vars: CreateProductDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateProductDataData>>;
/** Generated Node Admin SDK operation action function for the 'CreateProductData' Mutation. Allow users to pass in custom DataConnect instances. */
export function createProductData(vars: CreateProductDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateProductDataData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateProductData' Mutation. Allow users to execute without passing in DataConnect. */
export function updateProductData(dc: DataConnect, vars: UpdateProductDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateProductDataData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateProductData' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateProductData(vars: UpdateProductDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateProductDataData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteProductData' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteProductData(dc: DataConnect, vars: DeleteProductDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteProductDataData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteProductData' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteProductData(vars: DeleteProductDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteProductDataData>>;

/** Generated Node Admin SDK operation action function for the 'GetProduct' Query. Allow users to execute without passing in DataConnect. */
export function getProduct(dc: DataConnect, vars: GetProductVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProductData>>;
/** Generated Node Admin SDK operation action function for the 'GetProduct' Query. Allow users to pass in custom DataConnect instances. */
export function getProduct(vars: GetProductVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProductData>>;

/** Generated Node Admin SDK operation action function for the 'ListProducts' Query. Allow users to execute without passing in DataConnect. */
export function listProducts(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListProductsData>>;
/** Generated Node Admin SDK operation action function for the 'ListProducts' Query. Allow users to pass in custom DataConnect instances. */
export function listProducts(options?: OperationOptions): Promise<ExecuteOperationResponse<ListProductsData>>;

/** Generated Node Admin SDK operation action function for the 'CreateDeploymentData' Mutation. Allow users to execute without passing in DataConnect. */
export function createDeploymentData(dc: DataConnect, vars: CreateDeploymentDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateDeploymentDataData>>;
/** Generated Node Admin SDK operation action function for the 'CreateDeploymentData' Mutation. Allow users to pass in custom DataConnect instances. */
export function createDeploymentData(vars: CreateDeploymentDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateDeploymentDataData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateDeploymentData' Mutation. Allow users to execute without passing in DataConnect. */
export function updateDeploymentData(dc: DataConnect, vars: UpdateDeploymentDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateDeploymentDataData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateDeploymentData' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateDeploymentData(vars: UpdateDeploymentDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateDeploymentDataData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteDeploymentData' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteDeploymentData(dc: DataConnect, vars: DeleteDeploymentDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteDeploymentDataData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteDeploymentData' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteDeploymentData(vars: DeleteDeploymentDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteDeploymentDataData>>;

/** Generated Node Admin SDK operation action function for the 'GetDeployment' Query. Allow users to execute without passing in DataConnect. */
export function getDeployment(dc: DataConnect, vars: GetDeploymentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetDeploymentData>>;
/** Generated Node Admin SDK operation action function for the 'GetDeployment' Query. Allow users to pass in custom DataConnect instances. */
export function getDeployment(vars: GetDeploymentVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetDeploymentData>>;

/** Generated Node Admin SDK operation action function for the 'ListDeployments' Query. Allow users to execute without passing in DataConnect. */
export function listDeployments(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListDeploymentsData>>;
/** Generated Node Admin SDK operation action function for the 'ListDeployments' Query. Allow users to pass in custom DataConnect instances. */
export function listDeployments(options?: OperationOptions): Promise<ExecuteOperationResponse<ListDeploymentsData>>;

/** Generated Node Admin SDK operation action function for the 'CreateMetricData' Mutation. Allow users to execute without passing in DataConnect. */
export function createMetricData(dc: DataConnect, vars: CreateMetricDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateMetricDataData>>;
/** Generated Node Admin SDK operation action function for the 'CreateMetricData' Mutation. Allow users to pass in custom DataConnect instances. */
export function createMetricData(vars: CreateMetricDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateMetricDataData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateMetricData' Mutation. Allow users to execute without passing in DataConnect. */
export function updateMetricData(dc: DataConnect, vars: UpdateMetricDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateMetricDataData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateMetricData' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateMetricData(vars: UpdateMetricDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateMetricDataData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteMetricData' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteMetricData(dc: DataConnect, vars: DeleteMetricDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteMetricDataData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteMetricData' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteMetricData(vars: DeleteMetricDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteMetricDataData>>;

/** Generated Node Admin SDK operation action function for the 'GetMetric' Query. Allow users to execute without passing in DataConnect. */
export function getMetric(dc: DataConnect, vars: GetMetricVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetMetricData>>;
/** Generated Node Admin SDK operation action function for the 'GetMetric' Query. Allow users to pass in custom DataConnect instances. */
export function getMetric(vars: GetMetricVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetMetricData>>;

/** Generated Node Admin SDK operation action function for the 'ListMetrics' Query. Allow users to execute without passing in DataConnect. */
export function listMetrics(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListMetricsData>>;
/** Generated Node Admin SDK operation action function for the 'ListMetrics' Query. Allow users to pass in custom DataConnect instances. */
export function listMetrics(options?: OperationOptions): Promise<ExecuteOperationResponse<ListMetricsData>>;

/** Generated Node Admin SDK operation action function for the 'CreateDependencyData' Mutation. Allow users to execute without passing in DataConnect. */
export function createDependencyData(dc: DataConnect, vars: CreateDependencyDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateDependencyDataData>>;
/** Generated Node Admin SDK operation action function for the 'CreateDependencyData' Mutation. Allow users to pass in custom DataConnect instances. */
export function createDependencyData(vars: CreateDependencyDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateDependencyDataData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateDependencyData' Mutation. Allow users to execute without passing in DataConnect. */
export function updateDependencyData(dc: DataConnect, vars: UpdateDependencyDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateDependencyDataData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateDependencyData' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateDependencyData(vars: UpdateDependencyDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateDependencyDataData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteDependencyData' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteDependencyData(dc: DataConnect, vars: DeleteDependencyDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteDependencyDataData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteDependencyData' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteDependencyData(vars: DeleteDependencyDataVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteDependencyDataData>>;

/** Generated Node Admin SDK operation action function for the 'GetDependency' Query. Allow users to execute without passing in DataConnect. */
export function getDependency(dc: DataConnect, vars: GetDependencyVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetDependencyData>>;
/** Generated Node Admin SDK operation action function for the 'GetDependency' Query. Allow users to pass in custom DataConnect instances. */
export function getDependency(vars: GetDependencyVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetDependencyData>>;

/** Generated Node Admin SDK operation action function for the 'ListDependencies' Query. Allow users to execute without passing in DataConnect. */
export function listDependencies(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListDependenciesData>>;
/** Generated Node Admin SDK operation action function for the 'ListDependencies' Query. Allow users to pass in custom DataConnect instances. */
export function listDependencies(options?: OperationOptions): Promise<ExecuteOperationResponse<ListDependenciesData>>;

