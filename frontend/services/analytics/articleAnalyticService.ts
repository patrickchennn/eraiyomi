import { ArticlesAnalytic } from "@shared/Article"
import { apiService } from "../apiService";

export const getArticlesAnalytic = async () => {
  return apiService<ArticlesAnalytic>('get', `/articles/analytic`);
}