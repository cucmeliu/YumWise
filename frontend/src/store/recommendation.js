import { reactive } from 'vue';
import request from '../utils/request';

const state = reactive({
  homeRecommendations: [],
  nearbyRestaurants: [],
  recommendedDishes: [],
  recommendedRecipes: [],
});

export function useRecommendationStore() {
  const getHomeRecommendations = async (limit = 5) => {
    try {
      const res = await request.get('/recommendations/home', { limit });
      state.homeRecommendations = res.data;
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const getNearbyRestaurants = async (lat, lng, radius = 3) => {
    try {
      const res = await request.get('/recommendations/restaurants', {
        lat,
        lng,
        radius,
      });
      state.nearbyRestaurants = res.data;
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const getDishRecommendations = async () => {
    try {
      const res = await request.get('/recommendations/dishes');
      state.recommendedDishes = res.data;
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const getRecipeRecommendations = async () => {
    try {
      const res = await request.get('/recommendations/recipes');
      state.recommendedRecipes = res.data;
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    state,
    getHomeRecommendations,
    getNearbyRestaurants,
    getDishRecommendations,
    getRecipeRecommendations,
  };
}
