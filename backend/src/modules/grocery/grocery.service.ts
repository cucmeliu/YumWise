import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GroceryService {
  private readonly platforms = [
    {
      id: 'pdd',
      name: '多多买菜',
      icon: '🛒',
      schemeUrl: 'pinduoduo://',
      miniprogramUrl: 'https://wxapp.pinduoduo.com/duo_duo_mai_cai/search?keyword={keyword}',
    },
    {
      id: 'dingdong',
      name: '叮咚买菜',
      icon: '🥬',
      schemeUrl: 'dingdong://search?keyword={keyword}',
      miniprogramUrl: null,
    },
    {
      id: 'meituan',
      name: '美团买菜',
      icon: '🛍️',
      schemeUrl: 'imeituan://',
      miniprogramUrl: 'https://wxapp.meituan.com/maicai/search?keyword={keyword}',
    },
  ];

  constructor(private configService: ConfigService) {}

  getPlatforms() {
    return this.platforms;
  }

  generatePurchaseUrl(platformId: string, keywords: string[]): any {
    const platform = this.platforms.find((p) => p.id === platformId);
    if (!platform) {
      return null;
    }

    const keyword = encodeURIComponent(keywords.join(' '));

    return {
      platform: platform.name,
      schemeUrl: platform.schemeUrl,
      miniprogramUrl: platform.miniprogramUrl
        ? platform.miniprogramUrl.replace('{keyword}', keyword)
        : null,
      searchKeyword: keywords.join(' '),
    };
  }

  generateBatchPurchaseUrls(ingredients: any[]): any {
    const categorizedIngredients = this.categorizeIngredients(ingredients);

    return this.platforms.map((platform) => {
      const keywords = ingredients
        .filter((i) => !i.isStaple)
        .map((i) => i.name);

      return {
        platform: platform.name,
        icon: platform.icon,
        schemeUrl: platform.schemeUrl,
        miniprogramUrl: platform.miniprogramUrl
          ? platform.miniprogramUrl.replace(
              '{keyword}',
              encodeURIComponent(keywords.join(' ')),
            )
          : null,
        searchKeyword: keywords.join(' '),
        ingredientCount: keywords.length,
      };
    });
  }

  private categorizeIngredients(ingredients: any[]): any {
    const categories: { [key: string]: any[] } = {
      蔬菜: [],
      肉类: [],
      禽蛋: [],
      水产: [],
      豆制品: [],
      调味品: [],
      粮油: [],
      水果: [],
    };

    ingredients.forEach((ingredient) => {
      const category = ingredient.category || '其他';
      if (categories[category]) {
        categories[category].push(ingredient);
      }
    });

    return categories;
  }
}