import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly model: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('AI_API_KEY', '');
    this.apiUrl = this.configService.get('AI_API_URL', '');
    this.model = this.configService.get('AI_MODEL', 'qwen-plus');
  }

  async generateRecipe(params: {
    healthGoal: string;
    dailyCalories: number;
    restrictions: string[];
    preferences: string[];
    cookingTime?: number;
    servings?: number;
  }): Promise<any> {
    const prompt = this.buildRecipePrompt(params);

    try {
      const response = await this.callAiApi(prompt);
      return this.parseRecipeResponse(response);
    } catch (error) {
      this.logger.error('AI菜谱生成失败', error);
      throw error;
    }
  }

  private buildRecipePrompt(params: any): string {
    return `你是一位专业营养师和厨师。请根据以下用户信息生成一道菜谱：

用户画像：
- 目标：${params.healthGoal}
- 每日推荐热量：${params.dailyCalories} kcal
- 饮食禁忌：${params.restrictions?.join('、') || '无'}
- 偏好：${params.preferences?.join('、') || '无特殊偏好'}
- 可用时间：${params.cookingTime || 30} 分钟
- 份量：${params.servings || 2} 人份

生成要求：
1. 菜名（有吸引力，10字以内）
2. 营养成分（热量、蛋白质、碳水、脂肪，每项具体数值+单位）
3. 食材清单（精确用量，如"鸡胸肉 200g"）
4. 烹饪步骤（5步以内，简洁清晰）
5. 健康小贴士（为什么这道菜适合该用户）

请严格按照以下JSON格式返回，不要包含其他文字：
{
  "name": "菜名",
  "description": "简短描述",
  "calories": 数值,
  "protein": 数值,
  "carbs": 数值,
  "fat": 数值,
  "ingredients": [{"name": "食材名", "amount": "用量", "category": "分类"}],
  "steps": [{"order": 1, "instruction": "步骤说明"}],
  "tips": "健康小贴士"
}`;
  }

  private async callAiApi(prompt: string): Promise<string> {
    const response = await axios.post(
      this.apiUrl,
      {
        model: this.model,
        input: { messages: [{ role: 'user', content: prompt }] },
        parameters: { result_format: 'message' },
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      },
    );

    return response.data.output.choices[0].message.content;
  }

  private parseRecipeResponse(response: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return null;
    } catch (error) {
      this.logger.error('解析AI响应失败', error);
      return null;
    }
  }

  async enhanceRecommendation(
    items: any[],
    userProfile: any,
  ): Promise<any[]> {
    const prompt = `根据用户画像（目标：${userProfile.healthGoal}，禁忌：${userProfile.restrictions?.join(',')}），
    从以下选项中推荐最合适的5个，并说明理由：
    ${JSON.stringify(items.slice(0, 20))}`;

    try {
      const response = await this.callAiApi(prompt);
      return items;
    } catch (error) {
      return items;
    }
  }
}