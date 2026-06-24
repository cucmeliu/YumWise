import { defineStore } from 'pinia';
import request from '../utils/request';

export const useRecommendationStore = defineStore('recommendation', {
  state: () => ({
    homeRecommendations: [],
    nearbyRestaurants: [],
    recommendedDishes: [],
    recommendedRecipes: [],
  }),

  actions: {
    async getHomeRecommendations(limit = 5) {
      try {
        const res = await request.get('/recommendations/home', { limit });
        this.homeRecommendations = res.data;
        return res.data;
      } catch (error) {
        throw error;
      }
    },

    async getNearbyRestaurants(lat, lng, radius = 3) {
      try {
        const res = await request.get('/recommendations/restaurants', {
          lat,
          lng,
          radius,
        });
        this.nearbyRestaurants = res.data;
        return res.data;
      } catch (error) {
        throw error;
      }
    },

    async getDishRecommendations() {
      try {
        const res = await request.get('/recommendations/dishes');
        this.recommendedDishes = res.data;
        return res.data;
      } catch (error) {
        throw error;
      }
    },

    async getRecipeRecommendations() {
      try {
        const res = await request.get('/recommendations/recipes');
        this.recommendedRecipes = res.data;
        return res.data;
      } catch (error) {
        throw error;
      }
    },
  },
});