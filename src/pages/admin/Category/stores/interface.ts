export interface CategoryModel {
  success: boolean;
  data: CategoryList[];
  total: number;
  page: number;
  pageSize: number;
  statusCode: number;
}

export interface CategoryList {
  id: number;
  name: string;
  image: string;
  description: string;
  status: string;
}
